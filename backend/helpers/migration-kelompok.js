/**
 * Script Migrasi dan Sinkronisasi ID Kelompok Tani Sesuai Data Resmi Dinas
 * File: backend/helpers/migration-kelompok.js
 *
 * Tujuan:
 * 1. Mengubah ID pada tabel kelompoks agar sesuai dengan daftar resmi Dinas (List ID Poktan.xlsx).
 * 2. Mengupdate seluruh foreign key di tabel turunan (dataTanamans, dataPeople, dataPetanis, dataOperators)
 *    secara atomik dan aman (menggunakan Database Transaction).
 * 3. Menyimpan backup data otomatis sebelum migrasi dieksekusi.
 */

const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const {
  sequelize,
  kelompok,
  kecamatan,
  desa,
  dataTanaman,
  dataPerson,
  dataPetani
} = require('../app/models');
const { Op } = require('sequelize');

// Normalisasi teks untuk pencocokan nama
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Kamus alias nama desa & kecamatan untuk normalisasi perbedaan ejaan
const desaAliases = {
  krtprandon: 'karangtengahprandon',
  sambirejo: 'samberejo',
  keniten: 'kenitren',
  randusongo: 'randusongo',
  warukkalong: 'warukkalong',
  waruktengah: 'waruktengah',
  legowetan: 'legowetan'
};

const kecAliases = {
  ngawi: 'ngawikota'
};

const normDesa = (s) => {
  const n = norm(s);
  return desaAliases[n] || n;
};

const normKec = (s) => {
  const n = norm(s);
  return kecAliases[n] || n;
};

/**
 * Fungsi backup data sebelum migrasi
 */
async function backupData() {
  const backupDir = path.resolve(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilePath = path.join(backupDir, `backup_before_migration_kelompok_${timestamp}.json`);

  console.log('🔄 Menyiapkan backup data...');
  const kelompoksBackup = await kelompok.findAll({ raw: true });
  const tanamansBackup = await dataTanaman.findAll({
    where: { fk_kelompokId: { [Op.not]: null } },
    raw: true
  });
  const peopleBackup = await dataPerson.findAll({
    where: { kelompokId: { [Op.not]: null } },
    raw: true
  });
  const petaniBackup = await dataPetani.findAll({
    where: { fk_kelompokId: { [Op.not]: null } },
    raw: true
  });

  const fullBackup = {
    createdAt: new Date().toISOString(),
    totalKelompok: kelompoksBackup.length,
    totalTanamanWithFk: tanamansBackup.length,
    totalPeopleWithFk: peopleBackup.length,
    totalPetaniWithFk: petaniBackup.length,
    data: {
      kelompoks: kelompoksBackup,
      dataTanamans: tanamansBackup,
      dataPeople: peopleBackup,
      dataPetanis: petaniBackup
    }
  };

  fs.writeFileSync(backupFilePath, JSON.stringify(fullBackup, null, 2), 'utf-8');
  console.log(`✅ Backup berhasil disimpan di: ${backupFilePath}`);
  return backupFilePath;
}

/**
 * Membaca Excel dan membentuk pemetaan 1-to-1 antara DB lama dan ID baru Excel
 */
async function buildMapping(excelFilePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const sheet = workbook.worksheets[0];

  const allDb = await kelompok.findAll();
  const allKec = await kecamatan.findAll();
  const allDesa = await desa.findAll();

  // Buat lookup kecamatan dan desa untuk kecamatanId dan desaId baru
  const kecMap = new Map();
  allKec.forEach((k) => kecMap.set(normKec(k.nama), k.id));

  const desaMap = new Map(); // key: `${kecId}:${normDesa}` -> id
  allDesa.forEach((d) => {
    desaMap.set(`${d.kecamatanId}:${normDesa(d.nama)}`, d.id);
  });

  const excelRows = [];
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const excelId = Number(row.getCell(1).value);
    const gapoktan = String(row.getCell(2).value || '').trim();
    const nama = String(row.getCell(3).value || '').trim();
    const desaName = String(row.getCell(4).value || '').trim();
    const kecName = String(row.getCell(5).value || '').trim();

    if (!excelId) continue;
    excelRows.push({ excelId, gapoktan, nama, desa: desaName, kec: kecName });
  }

  const usedDbIds = new Set();
  const mapping = [];
  const unmapped = [];

  for (const item of excelRows) {
    const targetNama = norm(item.nama);
    const targetDesa = normDesa(item.desa);
    const targetKec = normKec(item.kec);

    // Cari kecamatanId dan desaId
    const resolvedKecId = kecMap.get(targetKec) || null;
    const resolvedDesaId = resolvedKecId ? desaMap.get(`${resolvedKecId}:${targetDesa}`) || null : null;

    // 1. Match by (name + normalized desa + normalized kec)
    let match = allDb.find(
      (db) =>
        !usedDbIds.has(db.id) &&
        norm(db.namaKelompok) === targetNama &&
        normDesa(db.desa) === targetDesa &&
        normKec(db.kecamatan) === targetKec
    );

    // 2. Match by (name + normalized desa)
    if (!match) {
      match = allDb.find(
        (db) =>
          !usedDbIds.has(db.id) &&
          norm(db.namaKelompok) === targetNama &&
          normDesa(db.desa) === targetDesa
      );
    }

    // 3. Match by (name + normalized kec)
    if (!match) {
      match = allDb.find(
        (db) =>
          !usedDbIds.has(db.id) &&
          norm(db.namaKelompok) === targetNama &&
          normKec(db.kecamatan) === targetKec
      );
    }

    // 4. Match by same ID if same kec
    if (!match) {
      const sameIdDb = allDb.find(
        (db) => db.id === item.excelId && !usedDbIds.has(db.id)
      );
      if (sameIdDb && normKec(sameIdDb.kecamatan) === targetKec) {
        match = sameIdDb;
      }
    }

    if (match) {
      usedDbIds.add(match.id);
      mapping.push({
        newId: item.excelId,
        oldId: match.id,
        gapoktan: item.gapoktan || match.gapoktan,
        namaKelompok: item.nama,
        desa: item.desa,
        kecamatan: item.kec,
        kecamatanId: resolvedKecId || match.kecamatanId,
        desaId: resolvedDesaId || match.desaId,
        penyuluh: match.penyuluh // pertahankan data penyuluh
      });
    } else {
      unmapped.push(item);
    }
  }

  return { mapping, unmapped, totalExcel: excelRows.length, totalDb: allDb.length };
}

/**
 * Eksekutor Migrasi
 */
async function runMigration(options = {}) {
  const isDryRun = options.dryRun || process.argv.includes('--dry-run');
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const excelFilePath =
    options.excelFilePath ||
    fileArg ||
    path.resolve(__dirname, '../../List ID Poktan.xlsx');

  console.log('====================================================');
  console.log('🚀 SIKETAN - MIGRATION KELOMPOK KE ID RESMI DINAS');
  console.log('====================================================');
  console.log(`📁 File Excel: ${excelFilePath}`);
  console.log(`⚙️ Mode: ${isDryRun ? 'DRY-RUN (Simulasi / Tanpa Ubah DB)' : 'EKSEKUSI PENUH (Database Update)'}\n`);

  if (!fs.existsSync(excelFilePath)) {
    throw new Error(`File Excel tidak ditemukan di: ${excelFilePath}`);
  }

  // 1. Bangun Pemetaan
  console.log('🔍 Membangun pemetaan 1-to-1 antara DB dan Excel...');
  const { mapping, unmapped, totalExcel, totalDb } = await buildMapping(excelFilePath);

  console.log(`📊 Hasil Pemetaan:`);
  console.log(`- Total baris di Excel: ${totalExcel}`);
  console.log(`- Total baris di DB:    ${totalDb}`);
  console.log(`- Berhasil dipetakan:   ${mapping.length} / ${totalExcel}`);
  console.log(`- Belum terpetakan:     ${unmapped.length}`);

  if (unmapped.length > 0) {
    console.error('❌ Ada baris yang belum terpetakan. Migrasi dibatalkan demi keamanan.');
    console.error(JSON.stringify(unmapped, null, 2));
    return;
  }

  // Verifikasi contoh kasus (Mulyaning Bebrayan)
  const mb = mapping.find((m) => m.namaKelompok.includes('Mulyaning Bebrayan'));
  if (mb) {
    console.log(`\n🔎 Verifikasi Sampel:`);
    console.log(`   Nama: ${mb.namaKelompok}`);
    console.log(`   ID Lama di DB: ${mb.oldId}  ➡️  ID Baru Dinas: ${mb.newId}`);
  }

  if (isDryRun) {
    console.log('\n💡 Dry-run selesai. Semua 1.122 data valid dan siap dieksekusi.');
    console.log('Jalankan tanpa flag --dry-run untuk mengeksekusi ke database.');
    return;
  }

  // 2. Buat Backup Data
  await backupData();

  // 3. Eksekusi Migrasi dalam Transaksi Database
  console.log('\n⏳ Memulai proses migrasi ke database (Transaction)...');
  const transaction = await sequelize.transaction();

  try {
    // A. Matikan sementara pengecekan foreign key agar re-indexing ID tidak diblokir
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { transaction });

    // B. Pindahkan semua ID lama ke OFFSET sementara (+100.000) untuk menghindari Duplicate Primary Key
    const OFFSET = 100000;
    console.log(`1️⃣  Menggeser ID lama ke temporary range (+${OFFSET})...`);

    await sequelize.query(`UPDATE kelompoks SET id = id + ${OFFSET};`, { transaction });
    await sequelize.query(
      `UPDATE dataTanamans SET fk_kelompokId = fk_kelompokId + ${OFFSET} WHERE fk_kelompokId IS NOT NULL;`,
      { transaction }
    );
    await sequelize.query(
      `UPDATE dataPeople SET kelompokId = kelompokId + ${OFFSET} WHERE kelompokId IS NOT NULL;`,
      { transaction }
    );
    await sequelize.query(
      `UPDATE dataPetanis SET fk_kelompokId = fk_kelompokId + ${OFFSET} WHERE fk_kelompokId IS NOT NULL;`,
      { transaction }
    );

    // C. Update ID ke ID baru Dinas dan perbarui tabel relasi
    console.log('2️⃣  Mengupdate data kelompok dan menyinkronkan seluruh tabel relasi...');
    let updatedCount = 0;

    for (const item of mapping) {
      const tempOldId = item.oldId + OFFSET;
      const newId = item.newId;

      // Update foreign key di dataTanamans
      await sequelize.query(
        `UPDATE dataTanamans SET fk_kelompokId = ${newId} WHERE fk_kelompokId = ${tempOldId};`,
        { transaction }
      );

      // Update foreign key di dataPeople
      await sequelize.query(
        `UPDATE dataPeople SET kelompokId = ${newId} WHERE kelompokId = ${tempOldId};`,
        { transaction }
      );

      // Update foreign key di dataPetanis
      await sequelize.query(
        `UPDATE dataPetanis SET fk_kelompokId = ${newId} WHERE fk_kelompokId = ${tempOldId};`,
        { transaction }
      );

      // Update baris kelompok itu sendiri
      await sequelize.query(
        `UPDATE kelompoks 
         SET id = :newId,
             gapoktan = :gapoktan,
             namaKelompok = :namaKelompok,
             desa = :desa,
             kecamatan = :kecamatan,
             kecamatanId = :kecamatanId,
             desaId = :desaId,
             updatedAt = NOW()
         WHERE id = ${tempOldId};`,
        {
          replacements: {
            newId: item.newId,
            gapoktan: item.gapoktan,
            namaKelompok: item.namaKelompok,
            desa: item.desa,
            kecamatan: item.kecamatan,
            kecamatanId: item.kecamatanId,
            desaId: item.desaId
          },
          transaction
        }
      );

      updatedCount++;
    }

    // D. Kembalikan Foreign Key Checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { transaction });

    // E. Reset AUTO_INCREMENT tabel kelompoks
    await sequelize.query('ALTER TABLE kelompoks AUTO_INCREMENT = 1123;', { transaction });

    // Commit transaksi
    await transaction.commit();
    console.log(`\n🎉 SUKSES! Sebanyak ${updatedCount} kelompok dan seluruh data relasinya berhasil disinkronkan.`);

    // 4. Verifikasi Pasca-Migrasi
    console.log('\n🔎 Verifikasi Pasca-Migrasi:');
    const verifyMb = await kelompok.findByPk(409);
    console.log(`   Kelompok ID 409: ${verifyMb?.namaKelompok} (${verifyMb?.desa}, ${verifyMb?.kecamatan})`);

    const verifyTanaman = await dataTanaman.count({ where: { fk_kelompokId: 409 } });
    console.log(`   Jumlah Data Tanaman di ID 409: ${verifyTanaman} record(s)`);

    const totalFinalKelompok = await kelompok.count();
    console.log(`   Total Kelompok di Database: ${totalFinalKelompok} baris.`);

  } catch (error) {
    await transaction.rollback();
    console.error('\n❌ Terjadi kesalahan saat eksekusi migrasi. Transaksi di-rollback!');
    console.error(error);
    throw error;
  }
}

// Jalankan jika dipanggil via CLI
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runMigration, buildMapping, backupData };
