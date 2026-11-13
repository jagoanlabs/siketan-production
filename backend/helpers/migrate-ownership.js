require('dotenv').config();

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const { sequelize, kelompok, dataPenyuluh } = require('../app/models');

const EXCEL_PATH = path.resolve(__dirname, '..', '..', 'user-new.xlsx');
const PREVIEW_DIR = path.resolve(__dirname, '..', 'data_preview');
const PREVIEW_FILE = path.join(PREVIEW_DIR, 'ownership_migration_preview.json');
const BACKUP_DIR = path.resolve(__dirname, '..', 'backups');

const desaAliases = {
  krtprandon: 'karangtengahprandon',
  sambirejo: 'samberejo',
  keniten: 'kenitren',
  warukkalong: 'warukkalong',
  waruktengah: 'waruktengah',
  legowetan: 'legowetan'
};

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const normalizeDesa = (value) => desaAliases[normalize(value)] || normalize(value);
const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => normalize(item))
    .filter(Boolean);

function getHeaderIndex(sheet, header) {
  const headers = sheet.getRow(1).values;
  return headers.findIndex((value) => String(value || '').trim().toLowerCase() === header.toLowerCase());
}

function getArgs() {
  const args = process.argv.slice(2);
  return {
    execute: args.includes('--execute'),
    preferExisting: args.includes('--prefer-existing'),
    allowUnresolved: args.includes('--allow-unresolved'),
    help: args.includes('--help') || args.includes('-h')
  };
}

function printHelp() {
  console.log(`
Usage:
  node helpers/migrate-ownership.js [options]

Options:
  --execute            Write resolved Poktan ownership to kelompoks.penyuluh.
  --prefer-existing    Resolve an ambiguity only when the current active owner is
                       one of the candidates declared in user-new.xlsx.
  --allow-unresolved   Permit a partial execution. Unresolved Poktan are left
                       unchanged. Without this flag, any conflict aborts execution.
  --help, -h           Show this help.

The default mode is a dry-run. It writes:
  ${PREVIEW_FILE}
`);
}

async function readAssignments() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel file tidak ditemukan: ${EXCEL_PATH}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);
  const sheet = workbook.getWorksheet('Akun Penyuluh Fix');
  if (!sheet) {
    throw new Error('Sheet "Akun Penyuluh Fix" tidak ditemukan.');
  }

  const columns = {
    nik: getHeaderIndex(sheet, 'NIK'),
    nip: getHeaderIndex(sheet, 'NIP'),
    name: getHeaderIndex(sheet, 'Nama'),
    gapoktan: getHeaderIndex(sheet, 'Gapoktan Binaan'),
    kelompok: getHeaderIndex(sheet, 'Kelompok Tani Binaan')
  };

  for (const [name, index] of Object.entries(columns)) {
    if (index === -1) {
      throw new Error(`Kolom "${name}" tidak ditemukan pada sheet "Akun Penyuluh Fix".`);
    }
  }

  const assignments = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const nik = String(row.getCell(columns.nik).value || row.getCell(columns.nip).value || '').trim();
    const name = String(row.getCell(columns.name).value || '').trim();
    const gapoktan = splitList(row.getCell(columns.gapoktan).value);
    const kelompok = splitList(row.getCell(columns.kelompok).value);
    if (!name || !nik || gapoktan.length === 0 || kelompok.length === 0) return;

    assignments.push({ rowNumber, nik, name, gapoktan: new Set(gapoktan), kelompok: new Set(kelompok) });
  });

  return assignments;
}

async function backupOwnership(groups) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup_before_ownership_migration_${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        totalGroups: groups.length,
        groups: groups.map((group) => ({
          id: group.id,
          gapoktan: group.gapoktan,
          namaKelompok: group.namaKelompok,
          desa: group.desa,
          kecamatan: group.kecamatan,
          penyuluh: group.penyuluh
        }))
      },
      null,
      2
    )
  );
  return backupPath;
}

async function buildPlan({ preferExisting = false } = {}) {
  const [assignments, profiles, groups] = await Promise.all([
    readAssignments(),
    dataPenyuluh.findAll({
      where: { deletedAt: null },
      attributes: ['id', 'nik', 'nama'],
      raw: true,
      paranoid: false
    }),
    kelompok.findAll({
      attributes: ['id', 'gapoktan', 'namaKelompok', 'desa', 'kecamatan', 'penyuluh'],
      raw: true
    })
  ]);

  const profileByNik = new Map(profiles.filter((profile) => profile.nik).map((profile) => [String(profile.nik).trim(), profile]));
  const unresolvedRows = [];
  const resolvedAssignments = [];

  for (const assignment of assignments) {
    const profile = profileByNik.get(assignment.nik);
    if (!profile) {
      unresolvedRows.push({
        type: 'PROFILE_NOT_FOUND',
        rowNumber: assignment.rowNumber,
        name: assignment.name,
        nik: assignment.nik
      });
      continue;
    }

    resolvedAssignments.push({ ...assignment, profile });
  }

  const plan = [];
  for (const group of groups) {
    const gapoktan = normalize(group.gapoktan);
    const namaKelompok = normalize(group.namaKelompok);
    const candidates = resolvedAssignments
      .filter((assignment) => assignment.gapoktan.has(gapoktan) && assignment.kelompok.has(namaKelompok))
      .map((assignment) => ({
        id: assignment.profile.id,
        nama: assignment.profile.nama,
        nik: assignment.profile.nik,
        rowNumber: assignment.rowNumber
      }));

    const currentOwnerId = group.penyuluh === null || group.penyuluh === '' ? null : Number(group.penyuluh);
    let status;
    let targetOwnerId = null;

    if (candidates.length === 0) {
      status = 'NO_CANDIDATE';
    } else if (candidates.length === 1) {
      status = 'UNIQUE_CANDIDATE';
      targetOwnerId = candidates[0].id;
    } else {
      const existingCandidate = candidates.find((candidate) => candidate.id === currentOwnerId);
      if (preferExisting && existingCandidate) {
        status = 'PRESERVED_EXISTING_OWNER';
        targetOwnerId = existingCandidate.id;
      } else {
        status = 'AMBIGUOUS_CANDIDATES';
      }
    }

    plan.push({
      groupId: group.id,
      gapoktan: group.gapoktan,
      namaKelompok: group.namaKelompok,
      desa: group.desa,
      kecamatan: group.kecamatan,
      currentOwnerId,
      targetOwnerId,
      status,
      candidates
    });
  }

  const summary = {
    totalGroups: plan.length,
    uniqueCandidate: plan.filter((item) => item.status === 'UNIQUE_CANDIDATE').length,
    preservedExistingOwner: plan.filter((item) => item.status === 'PRESERVED_EXISTING_OWNER').length,
    ambiguousCandidates: plan.filter((item) => item.status === 'AMBIGUOUS_CANDIDATES').length,
    noCandidate: plan.filter((item) => item.status === 'NO_CANDIDATE').length,
    profileNotFound: unresolvedRows.length,
    changes: plan.filter((item) => item.targetOwnerId && item.targetOwnerId !== item.currentOwnerId).length
  };

  return { plan, summary, unresolvedRows };
}

async function runMigration() {
  const options = getArgs();
  if (options.help) return printHelp();

  console.log('============================================================');
  console.log('🔄 SIKETAN: Migrasi Ownership Poktan dari user-new.xlsx');
  console.log(`Mode: ${options.execute ? 'EXECUTE' : 'DRY-RUN'}`);
  console.log(`Prefer existing owner: ${options.preferExisting ? 'yes' : 'no'}`);
  console.log('============================================================');

  await sequelize.authenticate();
  const { plan, summary, unresolvedRows } = await buildPlan(options);
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  fs.writeFileSync(
    PREVIEW_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), options, summary, unresolvedRows, plan }, null, 2)
  );

  console.log(JSON.stringify(summary, null, 2));
  console.log(`Preview: ${PREVIEW_FILE}`);

  const unresolvedCount = summary.ambiguousCandidates + summary.noCandidate + summary.profileNotFound;
  if (!options.execute) {
    console.log('Dry-run selesai. Tidak ada perubahan database.');
    return { summary, previewFile: PREVIEW_FILE };
  }

  if (unresolvedCount > 0 && !options.allowUnresolved) {
    throw new Error(
      `${unresolvedCount} ownership belum dapat dipastikan. ` +
        'Gunakan --allow-unresolved hanya setelah meninjau preview; Poktan unresolved akan dibiarkan tanpa perubahan.'
    );
  }

  const changes = plan.filter((item) => item.targetOwnerId && item.targetOwnerId !== item.currentOwnerId);
  const backupPath = await backupOwnership(plan.map((item) => ({
    id: item.groupId,
    gapoktan: item.gapoktan,
    namaKelompok: item.namaKelompok,
    desa: item.desa,
    kecamatan: item.kecamatan,
    penyuluh: item.currentOwnerId
  })));

  const transaction = await sequelize.transaction();
  try {
    for (const item of changes) {
      await kelompok.update(
        { penyuluh: String(item.targetOwnerId), updatedAt: new Date() },
        { where: { id: item.groupId }, transaction }
      );
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  console.log(`✅ ${changes.length} ownership Poktan diperbarui.`);
  console.log(`Backup ownership: ${backupPath}`);
  return { summary, changes: changes.length, backupPath };
}

if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(`❌ ${error.message}`);
      process.exit(1);
    });
}

module.exports = { buildPlan, runMigration };
