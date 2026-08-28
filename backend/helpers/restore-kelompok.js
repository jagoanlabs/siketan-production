/**
 * Script Rollback / Restore Data Kelompok Tani dan Relasinya
 * File: backend/helpers/restore-kelompok.js
 *
 * Fungsi:
 * Mengembalikan data kelompoks, dataTanamans, dataPeople, dan dataPetanis
 * ke kondisi persis sebelum migrasi dijalankan, menggunakan file backup JSON.
 *
 * Penggunaan:
 * node helpers/restore-kelompok.js
 * (otomatis menggunakan file backup paling baru di backend/backups)
 *
 * Atau tentukan file backup spesifik:
 * node helpers/restore-kelompok.js backups/backup_before_migration_kelompok_xxxx.json
 */

const path = require('path');
const fs = require('fs');
const {
  sequelize,
  kelompok,
  dataTanaman,
  dataPerson,
  dataPetani
} = require('../app/models');

/**
 * Mencari file backup terbaru di folder backups
 */
function getLatestBackupFile(customPath) {
  if (customPath && fs.existsSync(customPath)) {
    return path.resolve(customPath);
  }

  const backupDir = path.resolve(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    throw new Error(`Direktori backup tidak ditemukan di: ${backupDir}`);
  }

  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith('backup_before_migration_kelompok_') && f.endsWith('.json'))
    .map((f) => ({
      name: f,
      fullPath: path.join(backupDir, f),
      time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    throw new Error('Tidak ditemukan file backup di folder backups/');
  }

  return files[0].fullPath;
}

/**
 * Eksekusi restore
 */
async function runRestore(targetBackupPath) {
  const backupFilePath = getLatestBackupFile(targetBackupPath || process.argv[2]);

  console.log('====================================================');
  console.log('🔄 SIKETAN - RESTORE DATA KELOMPOK DARI BACKUP');
  console.log('====================================================');
  console.log(`📁 File Backup yang digunakan: ${backupFilePath}\n`);

  const rawData = fs.readFileSync(backupFilePath, 'utf-8');
  const backupContent = JSON.parse(rawData);

  const {
    kelompoks: kelompoksBackup,
    dataTanamans: tanamansBackup,
    dataPeople: peopleBackup,
    dataPetanis: petaniBackup
  } = backupContent.data;

  console.log(`📊 Data yang akan di-restore:`);
  console.log(`- Kelompok:     ${kelompoksBackup?.length || 0} baris`);
  console.log(`- Data Tanaman: ${tanamansBackup?.length || 0} baris`);
  console.log(`- Data Person:  ${peopleBackup?.length || 0} baris`);
  console.log(`- Data Petani:  ${petaniBackup?.length || 0} baris`);
  console.log(`- Dibuat pada:  ${backupContent.createdAt}\n`);

  console.log('⏳ Memulai proses restore ke database (Transaction)...');
  const transaction = await sequelize.transaction();

  try {
    // 1. Matikan Foreign Key Checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { transaction });

    // 2. Kosongkan tabel kelompoks lama
    console.log('1️⃣  Membersihkan dan menyusun ulang tabel kelompoks...');
    await sequelize.query('DELETE FROM kelompoks;', { transaction });

    // 3. Masukkan kembali seluruh baris kelompoks asli dari backup
    console.log('2️⃣  Mengembalikan data kelompoks asli...');
    const kChunkSize = 200;
    for (let i = 0; i < kelompoksBackup.length; i += kChunkSize) {
      const chunk = kelompoksBackup.slice(i, i + kChunkSize);
      await kelompok.bulkCreate(chunk, { transaction, validate: false });
    }

    // 4. Kembalikan foreign key di dataTanamans
    console.log('3️⃣  Mengembalikan relasi dataTanamans...');
    const tChunkSize = 500;
    for (let i = 0; i < tanamansBackup.length; i += tChunkSize) {
      const chunk = tanamansBackup.slice(i, i + tChunkSize);
      const ids = chunk.map((c) => c.id).join(',');
      const cases = chunk.map((c) => `WHEN ${c.id} THEN ${c.fk_kelompokId}`).join(' ');
      await sequelize.query(
        `UPDATE dataTanamans SET fk_kelompokId = CASE id ${cases} END WHERE id IN (${ids});`,
        { transaction }
      );
    }

    // 5. Kembalikan foreign key di dataPeople
    console.log('4️⃣  Mengembalikan relasi dataPeople...');
    for (let i = 0; i < peopleBackup.length; i += tChunkSize) {
      const chunk = peopleBackup.slice(i, i + tChunkSize);
      const ids = chunk.map((c) => c.id).join(',');
      const cases = chunk.map((c) => `WHEN ${c.id} THEN ${c.kelompokId}`).join(' ');
      await sequelize.query(
        `UPDATE dataPeople SET kelompokId = CASE id ${cases} END WHERE id IN (${ids});`,
        { transaction }
      );
    }

    // 6. Kembalikan foreign key di dataPetanis
    console.log('5️⃣  Mengembalikan relasi dataPetanis...');
    if (petaniBackup.length > 0) {
      const ids = petaniBackup.map((c) => c.id).join(',');
      const cases = petaniBackup.map((c) => `WHEN ${c.id} THEN ${c.fk_kelompokId}`).join(' ');
      await sequelize.query(
        `UPDATE dataPetanis SET fk_kelompokId = CASE id ${cases} END WHERE id IN (${ids});`,
        { transaction }
      );
    }

    // 7. Nyalakan kembali Foreign Key Checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { transaction });

    // 8. Reset Auto Increment
    await sequelize.query('ALTER TABLE kelompoks AUTO_INCREMENT = 1123;', { transaction });

    // Commit
    await transaction.commit();
    console.log('\n🎉 RESTORE BERHASIL! Database telah kembali 100% ke kondisi sebelum migrasi.');

    // Verifikasi
    const countKel = await kelompok.count();
    console.log(`✅ Total Kelompok saat ini: ${countKel} baris.`);

  } catch (error) {
    await transaction.rollback();
    console.error('\n❌ Terjadi kesalahan saat restore. Database di-rollback!');
    console.error(error);
    throw error;
  }
}

// Jalankan jika dipanggil via CLI
if (require.main === module) {
  runRestore()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runRestore };
