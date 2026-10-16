require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ExcelJS = require('exceljs');
const bcrypt = require('bcryptjs');
const db = require('../app/models');

const EXCEL_PATH = path.resolve(__dirname, '..', '..', 'user-new.xlsx');
const PREVIEW_DIR = path.resolve(__dirname, '..', 'data_preview');
const PREVIEW_FILE = path.join(PREVIEW_DIR, 'user_sync_preview.json');

const ROLE_MAPPING = {
  'operator super admin': 1,
  'operator_super_admin': 1,
  'operator poktan': 2,
  'operator_poktan': 2,
  'penyuluh': 3,
  'operator admin': 4,
  'operator_admin': 4,
  'penyuluh swadaya': 5,
  'penyuluh_swadaya': 5,
  'petani': 6,
};

function cleanString(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (s === '' || s === '-' || s.toLowerCase() === 'null') return null;
  return s;
}

function cleanPhone(val) {
  const s = cleanString(val);
  if (!s) return null;
  let cleaned = s.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('62')) cleaned = '0' + cleaned.slice(2);
  else if (cleaned.startsWith('8')) cleaned = '0' + cleaned;
  return cleaned || null;
}

async function mergePenyuluh(sourceAccountID, targetAccountID, transaction) {
  const [srcRows] = await db.sequelize.query(
    'SELECT * FROM `dataPenyuluhs` WHERE `accountID` = :sourceAccountID',
    { replacements: { sourceAccountID }, transaction }
  );
  if (!srcRows.length) return;

  const [tgtRows] = await db.sequelize.query(
    'SELECT * FROM `dataPenyuluhs` WHERE `accountID` = :targetAccountID',
    { replacements: { targetAccountID }, transaction }
  );

  if (tgtRows.length > 0) {
    const srcId = srcRows[0].id;
    const tgtId = tgtRows[0].id;

    // 1. Transfer Jurnal Harian
    await db.sequelize.query(
      'UPDATE `jurnalHarians` SET `fk_penyuluhId` = :tgtId WHERE `fk_penyuluhId` = :srcId',
      { replacements: { tgtId, srcId }, transaction }
    );

    // 2. Transfer Petani Binaan
    await db.sequelize.query(
      'UPDATE `dataPetanis` SET `fk_penyuluhId` = :tgtId WHERE `fk_penyuluhId` = :srcId',
      { replacements: { tgtId, srcId }, transaction }
    );

    // 3. Transfer Desa Binaan (remove duplicates first)
    await db.sequelize.query(
      `DELETE FROM \`desaBinaans\` 
       WHERE \`penyuluhId\` = :srcId 
         AND \`desaId\` IN (SELECT \`desaId\` FROM (SELECT \`desaId\` FROM \`desaBinaans\` WHERE \`penyuluhId\` = :tgtId) AS tmp)`,
      { replacements: { srcId, tgtId }, transaction }
    );
    await db.sequelize.query(
      'UPDATE `desaBinaans` SET `penyuluhId` = :tgtId WHERE `penyuluhId` = :srcId',
      { replacements: { tgtId, srcId }, transaction }
    );

    // 4. Transfer Kecamatan Binaan (remove duplicates first)
    await db.sequelize.query(
      `DELETE FROM \`kecamatanBinaans\` 
       WHERE \`penyuluhId\` = :srcId 
         AND \`kecamatanId\` IN (SELECT \`kecamatanId\` FROM (SELECT \`kecamatanId\` FROM \`kecamatanBinaans\` WHERE \`penyuluhId\` = :tgtId) AS tmp)`,
      { replacements: { srcId, tgtId }, transaction }
    );
    await db.sequelize.query(
      'UPDATE `kecamatanBinaans` SET `penyuluhId` = :tgtId WHERE `penyuluhId` = :srcId',
      { replacements: { tgtId, srcId }, transaction }
    );

    // 5. Update NIK/Alamat if target has short/placeholder NIK
    const srcNik = srcRows[0].nik;
    const tgtNik = tgtRows[0].nik;
    if (srcNik && srcNik.length >= 8 && (!tgtNik || tgtNik.length < 8)) {
      await db.sequelize.query(
        'UPDATE `dataPenyuluhs` SET `nik` = :srcNik WHERE `id` = :tgtId',
        { replacements: { srcNik, tgtId }, transaction }
      );
    }

    // 6. Delete duplicate source row
    await db.sequelize.query(
      'DELETE FROM `dataPenyuluhs` WHERE `id` = :srcId',
      { replacements: { srcId }, transaction }
    );
  } else {
    // Target does not exist in dataPenyuluhs, safe to reassign
    await db.sequelize.query(
      'UPDATE `dataPenyuluhs` SET `accountID` = :targetAccountID WHERE `accountID` = :sourceAccountID',
      { replacements: { targetAccountID, sourceAccountID }, transaction }
    );
  }
}

async function mergeOperator(sourceAccountID, targetAccountID, transaction) {
  const [srcRows] = await db.sequelize.query(
    'SELECT * FROM `dataOperators` WHERE `accountID` = :sourceAccountID',
    { replacements: { sourceAccountID }, transaction }
  );
  if (!srcRows.length) return;

  const [tgtRows] = await db.sequelize.query(
    'SELECT * FROM `dataOperators` WHERE `accountID` = :targetAccountID',
    { replacements: { targetAccountID }, transaction }
  );

  if (tgtRows.length > 0) {
    // Both exist in dataOperators, delete source row
    await db.sequelize.query(
      'DELETE FROM `dataOperators` WHERE `id` = :srcId',
      { replacements: { srcId: srcRows[0].id }, transaction }
    );
  } else {
    await db.sequelize.query(
      'UPDATE `dataOperators` SET `accountID` = :targetAccountID WHERE `accountID` = :sourceAccountID',
      { replacements: { targetAccountID, sourceAccountID }, transaction }
    );
  }
}

async function mergePetani(sourceAccountID, targetAccountID, transaction) {
  const [srcRows] = await db.sequelize.query(
    'SELECT * FROM `dataPetanis` WHERE `accountID` = :sourceAccountID',
    { replacements: { sourceAccountID }, transaction }
  );
  if (!srcRows.length) return;

  const [tgtRows] = await db.sequelize.query(
    'SELECT * FROM `dataPetanis` WHERE `accountID` = :targetAccountID',
    { replacements: { targetAccountID }, transaction }
  );

  if (tgtRows.length > 0) {
    // Transfer tanamanPetanis
    await db.sequelize.query(
      'UPDATE `tanamanPetanis` SET `fk_petaniId` = :tgtId WHERE `fk_petaniId` = :srcId',
      { replacements: { tgtId: tgtRows[0].id, srcId: srcRows[0].id }, transaction }
    );
    await db.sequelize.query(
      'DELETE FROM `dataPetanis` WHERE `id` = :srcId',
      { replacements: { srcId: srcRows[0].id }, transaction }
    );
  } else {
    await db.sequelize.query(
      'UPDATE `dataPetanis` SET `accountID` = :targetAccountID WHERE `accountID` = :sourceAccountID',
      { replacements: { targetAccountID, sourceAccountID }, transaction }
    );
  }
}

async function mergePenjual(sourceAccountID, targetAccountID, transaction) {
  await db.sequelize.query(
    'UPDATE `penjuals` SET `accountID` = :targetAccountID WHERE `accountID` = :sourceAccountID',
    { replacements: { targetAccountID, sourceAccountID }, transaction }
  );
}

async function runSync() {
  const args = process.argv.slice(2);
  const isHelp = args.includes('--help') || args.includes('-h');
  const isExecute = args.includes('--execute');
  const isDryRun = !isExecute;
  const isAlterUsers = args.includes('--alter-users') || args.includes('--update-only');
  const isSkipDelete = isAlterUsers || args.includes('--skip-delete');
  const preservePasswords = !args.includes('--overwrite-passwords'); // Always true by default
  const defaultPassword = process.env.DEFAULT_NEW_USER_PASSWORD || 'Siketan2026!';

  if (isHelp) {
    console.log(`
================================================================
📖 SIKETAN User Synchronization CLI Helper
================================================================

Usage:
  node helpers/sync-user-accounts.js [options]
  bun run sync:users [options]

Options:
  --alter-users       : Alter/update user data (nama, email, no_wa, isVerified, peran, NIK, alamat)
                        ONLY. Skips deleting accounts and strictly preserves existing passwords.
  --update-only       : Alias for --alter-users.
  --skip-delete       : Update accounts but skip deleting accounts in 'Akun yang Dihapus'.
  --preserve-passwords: (Default: true) Guarantees existing user passwords are never changed.
  --execute           : Commit changes to database. Without this flag, script runs in DRY-RUN mode.
  --help, -h          : Show this help menu.

Available npm/bun shortcuts:
  bun run sync:users:alter     -> Alter users directly to DB (passwords preserved)
  bun run sync:users:alter:dry -> Dry-run simulation of alter users
  bun run sync:users           -> Full synchronization (update, reassign, and delete)
  bun run sync:users:dry       -> Full synchronization preview
================================================================
`);
    process.exit(0);
  }

  console.log('================================================================');
  console.log('🔄 SIKETAN: User Account Reset & Smart Synchronization');
  console.log(`Branch            : main`);
  console.log(`Mode              : ${isExecute ? '⚡ LIVE EXECUTION (Writing to DB)' : '🔍 DRY-RUN PREVIEW (No Changes)'}`);
  console.log(`Alter Users Only  : ${isAlterUsers ? 'YES (--alter-users active, no deletions)' : 'NO (Full sync)'}`);
  console.log(`Password Security : 🔒 STRICT PRESERVATION (Existing passwords will NOT be touched)`);
  console.log(`Excel File        : ${EXCEL_PATH}`);
  console.log('================================================================\n');

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`❌ Excel file not found at: ${EXCEL_PATH}`);
    process.exit(1);
  }

  // 1. Connect to Database
  try {
    await db.sequelize.authenticate();
    console.log('✅ Connected to database.\n');
  } catch (err) {
    console.error('❌ Cannot connect to database:', err.message);
    process.exit(1);
  }

  // 2. Read Excel Workbook
  console.log('📖 Reading user-new.xlsx...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);

  // 3. Parse "Akun yang Dihapus"
  console.log('Parsing "Akun yang Dihapus"...');
  const wsDihapus = wb.getWorksheet('Akun yang Dihapus');
  const deleteList = [];
  const deleteAccountIds = new Set();

  if (wsDihapus) {
    wsDihapus.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const masalah = cleanString(row.getCell(1).value);
        const accountID = cleanString(row.getCell(2).value);
        const peran = cleanString(row.getCell(3).value);
        const nik = cleanString(row.getCell(4).value);
        const nama = cleanString(row.getCell(5).value);
        const email = cleanString(row.getCell(6).value);

        if (accountID) {
          deleteList.push({ masalah, accountID, peran, nik, nama, email });
          deleteAccountIds.add(accountID);
        }
      }
    });
  }
  console.log(`Found ${deleteList.length} accounts marked for deletion.\n`);

  // 4. Parse "Data Master"
  console.log('Parsing "Data Master"...');
  const wsMaster = wb.getWorksheet('Data Master');
  const masterAccounts = [];
  const masterByAccountID = new Map();
  const masterByNik = new Map();
  const masterByNama = new Map();

  if (wsMaster) {
    wsMaster.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const accountID = cleanString(row.getCell(1).value);
        const peran = cleanString(row.getCell(2).value) || 'petani';
        const nama = cleanString(row.getCell(3).value);
        const email = cleanString(row.getCell(4).value);
        const no_wa = cleanPhone(row.getCell(5).value);
        const verifiedVal = row.getCell(6).value;
        const isVerified = (verifiedVal === 1 || verifiedVal === '1' || String(verifiedVal).toLowerCase() === 'true') ? 1 : 0;
        const nik = cleanString(row.getCell(10).value);
        const nkk = cleanString(row.getCell(11).value);
        const alamat = cleanString(row.getCell(12).value);

        const role_id = ROLE_MAPPING[peran.toLowerCase()] || 6;

        if (accountID) {
          const item = { accountID, peran, role_id, nama, email, no_wa, isVerified, nik, nkk, alamat };
          masterAccounts.push(item);
          masterByAccountID.set(accountID, item);
          if (nik) masterByNik.set(nik, item);
          if (nama) masterByNama.set(nama.toLowerCase(), item);
        }
      }
    });
  }
  console.log(`Found ${masterAccounts.length} accounts in Data Master.\n`);

  // 5. Build Re-assignment Plan for Deleted / Merged Accounts
  console.log('Analyzing Re-assignment for Double Roles...');
  const reassignments = [];
  const orphanCleanups = [];

  for (const del of deleteList) {
    // Check if there is a primary counterpart in Master (by NIK or Nama)
    let primary = null;
    if (del.nik && masterByNik.has(del.nik)) {
      const match = masterByNik.get(del.nik);
      if (match.accountID !== del.accountID) primary = match;
    }
    if (!primary && del.nama && masterByNama.has(del.nama.toLowerCase())) {
      const match = masterByNama.get(del.nama.toLowerCase());
      if (match.accountID !== del.accountID) primary = match;
    }

    if (primary) {
      reassignments.push({
        sourceAccountID: del.accountID,
        sourceNama: del.nama,
        sourcePeran: del.peran,
        targetAccountID: primary.accountID,
        targetNama: primary.nama,
        targetPeran: primary.peran,
        masalah: del.masalah,
      });
    } else {
      orphanCleanups.push(del);
    }
  }

  console.log(`- Accounts to reassign (Double Role merge): ${reassignments.length}`);
  console.log(`- Accounts to clean up directly (Test / Dummy): ${orphanCleanups.length}\n`);

  // 6. Fetch Existing Accounts from Database
  const [existingAkun] = await db.sequelize.query('SELECT id, accountID, email, no_wa, nama, peran, role_id, isVerified FROM tbl_akun');
  const dbAkunMap = new Map(existingAkun.map(a => [a.accountID, a]));

  const accountsToUpdate = [];
  const accountsToInsert = [];

  for (const m of masterAccounts) {
    // If account was marked for deletion and has a primary, skip updating it as standalone
    if (deleteAccountIds.has(m.accountID)) continue;

    if (dbAkunMap.has(m.accountID)) {
      accountsToUpdate.push(m);
    } else {
      accountsToInsert.push(m);
    }
  }

  console.log('Database Change Summary:');
  console.log(`✔ Accounts to UPDATE in tbl_akun : ${accountsToUpdate.length}`);
  console.log(`✔ Accounts to INSERT in tbl_akun : ${accountsToInsert.length}`);
  console.log(`✔ Profiles to REASSIGN          : ${reassignments.length}`);
  console.log(`✔ Accounts to DELETE from tbl_akun: ${deleteList.length}\n`);

  // 7. Save Preview JSON
  if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const previewData = {
    generatedAt: new Date().toISOString(),
    isExecute,
    summary: {
      totalMaster: masterAccounts.length,
      accountsToUpdate: accountsToUpdate.length,
      accountsToInsert: accountsToInsert.length,
      accountsToDelete: deleteList.length,
      reassignmentsCount: reassignments.length,
      cleanupsCount: orphanCleanups.length,
    },
    sampleUpdates: accountsToUpdate.slice(0, 5),
    sampleInserts: accountsToInsert.slice(0, 5),
    reassignments,
    cleanups: orphanCleanups,
  };
  fs.writeFileSync(PREVIEW_FILE, JSON.stringify(previewData, null, 2));
  console.log(`📄 Detailed preview JSON saved to: ${PREVIEW_FILE}\n`);

  // 8. If DRY-RUN mode, stop here and prompt user
  if (isDryRun) {
    console.log('================================================================');
    console.log('🔍 DRY-RUN COMPLETE: No changes were made to the database.');
    console.log('To execute the real synchronization, run:');
    console.log('👉 bun run sync:users');
    console.log('================================================================\n');
    process.exit(0);
  }

  // 9. LIVE EXECUTION
  console.log('================================================================');
  console.log('⚡ STARTING LIVE DATABASE SYNCHRONIZATION...');
  console.log('================================================================\n');

  const transaction = await db.sequelize.transaction();

  try {
    // STEP 1 & 2: Re-assignment & Deletion (Skipped if --alter-users or --skip-delete is active)
    if (!isSkipDelete) {
      console.log('Step 1: Reassigning ownership for double-role profiles...');
      for (const r of reassignments) {
        await mergeOperator(r.sourceAccountID, r.targetAccountID, transaction);
        await mergePenyuluh(r.sourceAccountID, r.targetAccountID, transaction);
        await mergePetani(r.sourceAccountID, r.targetAccountID, transaction);
        await mergePenjual(r.sourceAccountID, r.targetAccountID, transaction);
      }
      console.log(`✔ Completed ${reassignments.length} ownership reassignments.\n`);

      console.log('Step 2: Removing retired & duplicate accounts from tbl_akun and cleaning profiles...');
      const delIds = deleteList.map(d => d.accountID);
      if (delIds.length > 0) {
        const [srcPen] = await db.sequelize.query(
          'SELECT id FROM `dataPenyuluhs` WHERE `accountID` IN (:delIds)',
          { replacements: { delIds }, transaction }
        );
        if (srcPen.length > 0) {
          const penIds = srcPen.map(p => p.id);
          await db.sequelize.query('DELETE FROM `jurnalHarians` WHERE `fk_penyuluhId` IN (:penIds)', { replacements: { penIds }, transaction });
          await db.sequelize.query('DELETE FROM `desaBinaans` WHERE `penyuluhId` IN (:penIds)', { replacements: { penIds }, transaction });
          await db.sequelize.query('DELETE FROM `kecamatanBinaans` WHERE `penyuluhId` IN (:penIds)', { replacements: { penIds }, transaction });
          await db.sequelize.query('DELETE FROM `dataPenyuluhs` WHERE `id` IN (:penIds)', { replacements: { penIds }, transaction });
        }

        await db.sequelize.query('DELETE FROM `dataOperators` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
        await db.sequelize.query('DELETE FROM `dataPetanis` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
        await db.sequelize.query('DELETE FROM `penjuals` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });

        const [delResult] = await db.sequelize.query(
          'DELETE FROM `tbl_akun` WHERE `accountID` IN (:delIds)',
          { replacements: { delIds }, transaction }
        );
        console.log(`✔ Deleted ${delResult?.affectedRows || delIds.length} accounts from tbl_akun.\n`);
      }
    } else {
      console.log('ℹ️  Step 1 & Step 2 SKIPPED (--alter-users active). No accounts will be deleted.\n');
    }

    // STEP 3: Update/Alter Valid Accounts in tbl_akun (Preserving existing password)
    console.log('Step 3: Altering/Updating valid accounts in tbl_akun...');
    console.log('🔒 Password Security: Existing user passwords are 100% PRESERVED (NOT modified).\n');
    let updatedCount = 0;
    for (const acc of accountsToUpdate) {
      await db.sequelize.query(
        `UPDATE \`tbl_akun\`
         SET \`nama\` = :nama,
             \`email\` = :email,
             \`no_wa\` = :no_wa,
             \`isVerified\` = :isVerified,
             \`peran\` = :peran,
             \`role_id\` = :role_id,
             \`updatedAt\` = NOW()
         WHERE \`accountID\` = :accountID`,
        {
          replacements: {
            nama: acc.nama,
            email: acc.email,
            no_wa: acc.no_wa,
            isVerified: acc.isVerified,
            peran: acc.peran,
            role_id: acc.role_id,
            accountID: acc.accountID,
          },
          transaction,
        }
      );
      updatedCount++;

      // Also update NIK/NKK/Alamat in profile tables if exists
      if (acc.nik || acc.alamat) {
        if (acc.peran.includes('penyuluh')) {
          await db.sequelize.query(
            'UPDATE `dataPenyuluhs` SET `nik` = COALESCE(:nik, `nik`), `alamat` = COALESCE(:alamat, `alamat`) WHERE `accountID` = :accountID',
            { replacements: { nik: acc.nik, alamat: acc.alamat, accountID: acc.accountID }, transaction }
          );
        } else if (acc.peran.includes('operator')) {
          await db.sequelize.query(
            'UPDATE `dataOperators` SET `nik` = COALESCE(:nik, `nik`), `alamat` = COALESCE(:alamat, `alamat`) WHERE `accountID` = :accountID',
            { replacements: { nik: acc.nik, alamat: acc.alamat, accountID: acc.accountID }, transaction }
          );
        } else if (acc.peran.includes('petani')) {
          await db.sequelize.query(
            'UPDATE `dataPetanis` SET `nik` = COALESCE(:nik, `nik`), `nkk` = COALESCE(:nkk, `nkk`), `alamat` = COALESCE(:alamat, `alamat`) WHERE `accountID` = :accountID',
            { replacements: { nik: acc.nik, nkk: acc.nkk, alamat: acc.alamat, accountID: acc.accountID }, transaction }
          );
        }
      }
    }
    console.log(`✔ Updated ${updatedCount} existing accounts in tbl_akun and profiles.\n`);

    // STEP 4: Insert New Accounts (if any)
    if (accountsToInsert.length > 0) {
      console.log(`Step 4: Inserting ${accountsToInsert.length} new accounts with default password...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      for (const acc of accountsToInsert) {
        await db.sequelize.query(
          `INSERT INTO \`tbl_akun\` (\`accountID\`, \`nama\`, \`email\`, \`no_wa\`, \`password\`, \`peran\`, \`role_id\`, \`isVerified\`, \`createdAt\`, \`updatedAt\`)
           VALUES (:accountID, :nama, :email, :no_wa, :password, :peran, :role_id, :isVerified, NOW(), NOW())`,
          {
            replacements: {
              accountID: acc.accountID || crypto.randomUUID(),
              nama: acc.nama,
              email: acc.email,
              no_wa: acc.no_wa,
              password: hashedPassword,
              peran: acc.peran,
              role_id: acc.role_id,
              isVerified: acc.isVerified,
            },
            transaction,
          }
        );
      }
      console.log(`✔ Inserted ${accountsToInsert.length} new accounts.\n`);
    }

    // STEP 5: Audit & Integrity Verification
    console.log('Step 5: Verifying database integrity & orphan counts...');
    const [orphanPen] = await db.sequelize.query(
      'SELECT count(*) as c FROM `dataPenyuluhs` WHERE `accountID` IS NOT NULL AND `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)',
      { transaction }
    );
    const [orphanOp] = await db.sequelize.query(
      'SELECT count(*) as c FROM `dataOperators` WHERE `accountID` IS NOT NULL AND `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)',
      { transaction }
    );
    const [orphanPet] = await db.sequelize.query(
      'SELECT count(*) as c FROM `dataPetanis` WHERE `accountID` IS NOT NULL AND `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)',
      { transaction }
    );

    console.log(`Orphaned Profiles:`);
    console.log(`- Penyuluh : ${orphanPen[0].c}`);
    console.log(`- Operator : ${orphanOp[0].c}`);
    console.log(`- Petani   : ${orphanPet[0].c}\n`);

    // Commit Transaction
    await transaction.commit();
    console.log('================================================================');
    console.log('🎉 LIVE SYNCHRONIZATION COMPLETED SUCCESSFULLY & COMMITTED TO DATABASE!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Error during synchronization, transaction rolled back safely:', err.message);
    process.exit(1);
  }
}

runSync();
