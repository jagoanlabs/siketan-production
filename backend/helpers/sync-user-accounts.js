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

async function runSync() {
  const args = process.argv.slice(2);
  const isHelp = args.includes('--help') || args.includes('-h');
  const isExecute = args.includes('--execute');
  const isDryRun = !isExecute;
  const isSkipDelete = args.includes('--skip-delete') || args.includes('--alter-users');
  
  let defaultPassword = process.env.DEFAULT_NEW_USER_PASSWORD || 'Siketan2026!';
  const pwdIdx = args.indexOf('--default-password');
  if (pwdIdx !== -1 && args[pwdIdx + 1]) {
    defaultPassword = args[pwdIdx + 1];
  }

  if (isHelp) {
    console.log(`
================================================================
📖 SIKETAN Comprehensive User Synchronization CLI Helper
================================================================

Usage:
  node helpers/sync-user-accounts.js [options]
  bun run sync:users [options]

Options:
  --execute           : Commit changes to database. Without this flag, runs in DRY-RUN mode.
  --skip-delete       : Skip deleting accounts (only update and insert).
  --default-password  : Set temporary password for newly created accounts (default: 'Siketan2026!').
  --help, -h          : Show this help menu.

Available shortcuts:
  bun run sync:users         -> Live Execution (Hard Delete unlisted/audit, Update existing, Create new)
  bun run sync:users:dry     -> Dry-run simulation (Preview only, no DB changes)
  bun run sync:users:alter   -> Safe Execution (Update existing and create new without deleting any accounts)
================================================================
`);
    process.exit(0);
  }

  console.log('================================================================');
  console.log('🔄 SIKETAN: Comprehensive User Synchronization & Purge');
  console.log(`Mode              : ${isExecute ? '⚡ LIVE EXECUTION (Writing to DB)' : '🔍 DRY-RUN PREVIEW (No DB Changes)'}`);
  console.log(`Delete Policy     : ${isSkipDelete ? 'NO (--skip-delete active)' : 'HARD DELETE (Accounts in "Akun yang Dihapus" and outside Fix sheets)'}`);
  console.log('Protected Super Admin: ONLY jagoanlabs@gmail.com (All other accounts matched strictly to Fix sheets)');
  console.log(`Password Security : 🔒 STRICT PRESERVATION (Existing user passwords will NOT be touched)`);
  console.log(`Excel File        : ${EXCEL_PATH}`);
  console.log('================================================================\n');

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`❌ Excel file not found at: ${EXCEL_PATH}`);
    process.exit(1);
  }

  // 1. Connect to Database
  try {
    await db.sequelize.authenticate();
    // Ensure column types in dataPenyuluhs accommodate long village lists
    await db.sequelize.query('ALTER TABLE `dataPenyuluhs` MODIFY COLUMN `desaBinaan` TEXT DEFAULT NULL');
    await db.sequelize.query('ALTER TABLE `dataPenyuluhs` MODIFY COLUMN `kecamatanBinaan` TEXT DEFAULT NULL');
    console.log('✅ Connected to database (Schema verified).\n');
  } catch (err) {
    console.error('❌ Cannot connect to database:', err.message);
    process.exit(1);
  }

  // 2. Read Excel Workbook
  console.log('📖 Reading user-new.xlsx...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);

  // 3. Parse "Akun yang Dihapus"
  console.log('Parsing sheet "Akun yang Dihapus"...');
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
  console.log(`Found ${deleteList.length} accounts to delete from audit sheet.\n`);

  // 4. Parse Allowlist Sheets: "Akun Operator Fix" & "Akun Penyuluh Fix"
  const consolidated = [];
  const conflicts = [];
  const allEmailsSeen = new Map();

  // 4a. Parse "Akun Operator Fix" (Official Operator Admin BPP)
  console.log('Parsing sheet "Akun Operator Fix"...');
  const wsOp = wb.getWorksheet('Akun Operator Fix');
  let opAdded = 0;
  const opNiksSeen = new Set();
  const opEmailsSeen = new Set();

  if (wsOp) {
    wsOp.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const peran = 'operator admin';
        const role_id = 4;
        const rawNik = cleanString(row.getCell(2).value);
        const noUnikAlt = cleanString(row.getCell(3).value);
        // Rule 4: jika data tidak memiliki NIK maka ganti NIK menggunakan No Unik Alternatif
        const nik = rawNik || noUnikAlt;
        const nama = cleanString(row.getCell(4).value);
        const email = cleanString(row.getCell(5).value)?.toLowerCase();
        const no_wa = cleanPhone(row.getCell(6).value);
        const kec = cleanString(row.getCell(8).value);
        const alamat = cleanString(row.getCell(9).value);

        if (!nama && !email) return;

        // Rule 1: NIK/NIP & Email dibuat unique
        if (nik) {
          if (opNiksSeen.has(nik)) {
            conflicts.push({ source: 'Akun Operator Fix', rowNumber, nik, email, reason: `Duplicate Operator NIK detected: ${nik}` });
          }
          opNiksSeen.add(nik);
        }

        if (email) {
          if (opEmailsSeen.has(email)) {
            conflicts.push({ source: 'Akun Operator Fix', rowNumber, nik, email, reason: `Duplicate Operator Email detected: ${email}` });
          }
          opEmailsSeen.add(email);
          allEmailsSeen.set(email, { source: 'Akun Operator Fix', rowNumber, nama });
        }

        consolidated.push({
          source: 'Akun Operator Fix',
          rowNumber,
          accountID: crypto.randomUUID(),
          peran,
          role_id,
          nama,
          email,
          no_wa,
          isVerified: 1,
          nik,
          nkk: null,
          alamat,
          kecamatan: kec,
        });
        opAdded++;
      }
    });
  }
  console.log(`Akun Operator Fix: Loaded ${opAdded} accounts (Unique NIKs: ${opNiksSeen.size}, Unique Emails: ${opEmailsSeen.size}).\n`);

  // 4b. Parse "Akun Penyuluh Fix" (Official Penyuluh)
  console.log('Parsing sheet "Akun Penyuluh Fix"...');
  const wsPen = wb.getWorksheet('Akun Penyuluh Fix');
  let penAdded = 0;
  const penNiksSeen = new Set();
  const penEmailsSeen = new Set();

  if (wsPen) {
    wsPen.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const peran = 'penyuluh';
        const role_id = 3;
        const rawNik = cleanString(row.getCell(2).value);
        const rawNip = cleanString(row.getCell(3).value);
        // NIK or NIP
        const nik = rawNik || rawNip;
        const nama = cleanString(row.getCell(4).value);
        const email = cleanString(row.getCell(5).value)?.toLowerCase();
        const no_wa = cleanPhone(row.getCell(6).value);
        const kecBinaan = cleanString(row.getCell(7).value);
        const desaBinaan = cleanString(row.getCell(8).value);

        if (!nama && !email) return;

        // Rule 1: NIK/NIP & Email dibuat unique
        if (nik) {
          if (penNiksSeen.has(nik)) {
            conflicts.push({ source: 'Akun Penyuluh Fix', rowNumber, nik, email, reason: `Duplicate Penyuluh NIK/NIP detected: ${nik}` });
          }
          penNiksSeen.add(nik);
        }

        if (email) {
          if (penEmailsSeen.has(email)) {
            conflicts.push({ source: 'Akun Penyuluh Fix', rowNumber, nik, email, reason: `Duplicate Penyuluh Email detected: ${email}` });
          }
          if (allEmailsSeen.has(email)) {
            const existing = allEmailsSeen.get(email);
            if (existing.source !== 'Akun Penyuluh Fix') {
              conflicts.push({ source: 'Akun Penyuluh Fix', rowNumber, nik, email, reason: `Cross-sheet Duplicate Email with ${existing.source} row ${existing.rowNumber} (${existing.nama})` });
            }
          }
          penEmailsSeen.add(email);
          allEmailsSeen.set(email, { source: 'Akun Penyuluh Fix', rowNumber, nama });
        }

        consolidated.push({
          source: 'Akun Penyuluh Fix',
          rowNumber,
          accountID: crypto.randomUUID(),
          peran,
          role_id,
          nama,
          email,
          no_wa,
          isVerified: 1,
          nik,
          nkk: null,
          alamat: null,
          kecamatanBinaan: kecBinaan,
          desaBinaan: desaBinaan,
        });
        penAdded++;
      }
    });
  }
  console.log(`Akun Penyuluh Fix: Loaded ${penAdded} accounts (Unique NIK/NIPs: ${penNiksSeen.size}, Unique Emails: ${penEmailsSeen.size}).\n`);
  console.log('ℹ️  Sheet "Verifikasi Akun": IGNORED (sementara) as instructed.\n');
  console.log(`Total Official Accounts Consolidated from Fix sheets: ${consolidated.length}\n`);

  if (opAdded === 0 || penAdded === 0) {
    throw new Error('Fix sheets are empty; refusing to proceed with synchronization.');
  }

  // 5. Fetch Existing Accounts from Database
  console.log('Comparing with database records...');
  const [dbUsers] = await db.sequelize.query('SELECT id, accountID, email, no_wa, nama, peran, role_id, isVerified FROM tbl_akun');
  
  // Protected Super Admin: ONLY jagoanlabs@gmail.com
  const isProtectedSuperAdmin = u => u.email && u.email.toLowerCase().trim() === 'jagoanlabs@gmail.com';
  
  if (!dbUsers.some(u => isProtectedSuperAdmin(u))) {
    throw new Error('Super admin jagoanlabs@gmail.com not found in tbl_akun. Refusing to proceed.');
  }

  const usersByAccountId = new Map(dbUsers.map(user => [user.accountID, user]));
  const [dbProfiles] = await db.sequelize.query(
    'SELECT accountID, nik FROM dataOperators UNION ALL SELECT accountID, nik FROM dataPenyuluhs UNION ALL SELECT accountID, nik FROM dataPetanis'
  );

  const nikByAccountId = new Map();
  for (const profile of dbProfiles) {
    if (profile.nik) nikByAccountId.set(profile.accountID, cleanString(profile.nik));
  }

  const dbByNik = new Map();
  for (const [accountID, nik] of nikByAccountId.entries()) {
    const user = usersByAccountId.get(accountID);
    if (!nik || !user) continue;
    if (!dbByNik.has(nik)) dbByNik.set(nik, []);
    if (!dbByNik.get(nik).some(u => u.accountID === user.accountID)) dbByNik.get(nik).push(user);
  }

  const dbByEmail = new Map();
  for (const u of dbUsers) {
    if (u.email) {
      const key = u.email.toLowerCase().trim();
      if (!dbByEmail.has(key)) dbByEmail.set(key, []);
      dbByEmail.get(key).push(u);
    }
  }

  // 6. Match Consolidated Fix accounts to Database
  const accountsToUpdate = [];
  const accountsToInsert = [];
  const processedDbAccountIDs = new Set();

  for (const item of consolidated) {
    let matchedDbUser = null;
    const cleanEmail = item.email ? item.email.toLowerCase().trim() : null;

    // 1. Primary match: by exact Email and Role (if multiple DB users share email, disambiguate with NIK)
    if (cleanEmail && dbByEmail.has(cleanEmail)) {
      const candidates = dbByEmail.get(cleanEmail).filter(u => 
        !processedDbAccountIDs.has(u.accountID) && 
        !deleteAccountIds.has(u.accountID) && 
        u.peran === item.peran
      );
      if (candidates.length === 1) {
        matchedDbUser = candidates[0];
      } else if (candidates.length > 1 && item.nik) {
        matchedDbUser = candidates.find(u => nikByAccountId.get(u.accountID) === item.nik);
      }
    }

    // 2. Secondary match: by NIK and Role (handles email updates in Excel for existing user)
    if (!matchedDbUser && item.nik && dbByNik.has(item.nik)) {
      const candidates = dbByNik.get(item.nik).filter(u => 
        !processedDbAccountIDs.has(u.accountID) && 
        !deleteAccountIds.has(u.accountID) &&
        !isProtectedSuperAdmin(u) &&
        u.peran === item.peran
      );
      if (candidates.length === 1) {
        matchedDbUser = candidates[0];
      }
    }

    if (matchedDbUser) {
      if (isProtectedSuperAdmin(matchedDbUser)) {
        conflicts.push({ source: item.source, rowNumber: item.rowNumber, nik: item.nik, email: item.email, reason: 'Baris Fix mencoba menimpa protected super admin' });
      } else {
        item.accountID = matchedDbUser.accountID;
        accountsToUpdate.push(item);
        processedDbAccountIDs.add(matchedDbUser.accountID);
      }
    } else {
      accountsToInsert.push(item);
    }
  }

  // 7. Determine Accounts to Delete Permanently
  // All accounts that are NOT jagoanlabs@gmail.com, and are either in deleteAccountIds OR unlisted (not in Fix sheets)
  const accountsToDeleteFromDb = isSkipDelete
    ? []
    : dbUsers.filter(u => 
        !isProtectedSuperAdmin(u) && (
          deleteAccountIds.has(u.accountID) || 
          !processedDbAccountIDs.has(u.accountID)
        )
      );

  console.log('----------------------------------------------------------------');
  console.log('📊 DATABASE CHANGE SUMMARY:');
  console.log(`🗑️ Accounts to HARD DELETE from DB    : ${accountsToDeleteFromDb.length} (Audit list + other superadmins + unlisted outside Fix sheets)`);
  console.log(`✔ Accounts to UPDATE in tbl_akun     : ${accountsToUpdate.length} (Passwords strictly preserved)`);
  console.log(`✔ Accounts to INSERT into tbl_akun   : ${accountsToInsert.length} (New accounts with default password)`);
  console.log(`👑 Protected Super Admin             : 1 (jagoanlabs@gmail.com)`);
  console.log(`Total Surviving Accounts after sync  : ${accountsToUpdate.length + accountsToInsert.length + 1} (Expected: 153)`);
  console.log('----------------------------------------------------------------\n');

  // 8. Save Preview JSON
  if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const previewData = {
    generatedAt: new Date().toISOString(),
    isExecute,
    summary: {
      totalConsolidatedFix: consolidated.length,
      accountsToDelete: accountsToDeleteFromDb.length,
      accountsToUpdate: accountsToUpdate.length,
      accountsToInsert: accountsToInsert.length,
      superAdminsPreserved: 1,
      totalSurviving: accountsToUpdate.length + accountsToInsert.length + 1,
      conflicts: conflicts.length,
    },
    sampleDeletes: accountsToDeleteFromDb.slice(0, 5),
    allDeletes: accountsToDeleteFromDb,
    conflicts,
    sampleUpdates: accountsToUpdate.slice(0, 5),
    sampleInserts: accountsToInsert.slice(0, 5),
    allInserts: accountsToInsert,
  };
  fs.writeFileSync(PREVIEW_FILE, JSON.stringify(previewData, null, 2));
  console.log(`📄 Detailed preview JSON saved to: ${PREVIEW_FILE}\n`);

  if (conflicts.length > 0) {
    throw new Error(`${conflicts.length} critical conflicts detected. Review ${PREVIEW_FILE}.`);
  }

  // 9. If DRY-RUN mode, stop here
  if (isDryRun) {
    console.log('================================================================');
    console.log('🔍 DRY-RUN COMPLETE: No changes were made to the database.');
    console.log('To execute the live synchronization and apply permanent purge to DB, run:');
    console.log('👉 bun run sync:users');
    console.log('================================================================\n');
    process.exit(0);
  }

  // 10. LIVE EXECUTION
  console.log('================================================================');
  console.log('⚡ STARTING LIVE DATABASE SYNCHRONIZATION...');
  console.log('================================================================\n');

  const transaction = await db.sequelize.transaction();

  try {
    // STEP 1: Delete Audit List & Unlisted Accounts (Hard Delete)
    if (!isSkipDelete && accountsToDeleteFromDb.length > 0) {
      console.log(`Step 1: Permanently deleting ${accountsToDeleteFromDb.length} accounts from database...`);
      const delIds = accountsToDeleteFromDb.map(d => d.accountID);
      const delUserIds = accountsToDeleteFromDb.map(d => d.id);

      // 1a. Clean up notifications & logs
      await db.notification.destroy({ where: { user_id: delUserIds }, transaction });
      await db.logactivity.destroy({ where: { user_id: delUserIds }, transaction });

      // 1b. Clean up tanamanPetanis (FK to dataPetanis)
      await db.sequelize.query(
        'DELETE FROM `tanamanPetanis` WHERE `fk_petaniId` IN (SELECT `id` FROM (SELECT `id` FROM `dataPetanis` WHERE `accountID` IN (:delIds)) AS t)',
        { replacements: { delIds }, transaction }
      );

      // 1c. Clean up profiles of deleted accounts
      await db.sequelize.query('DELETE FROM `dataPetanis` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      await db.sequelize.query('DELETE FROM `dataPenyuluhs` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      await db.sequelize.query('DELETE FROM `dataOperators` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      await db.sequelize.query('DELETE FROM `penjuals` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      
      // 1d. Clean up tbl_akun
      const [delRes] = await db.sequelize.query('DELETE FROM `tbl_akun` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      console.log(`✔ Successfully deleted ${delRes?.affectedRows || delIds.length} accounts from tbl_akun and related child tables.\n`);
    } else {
      console.log('ℹ️  Step 1 SKIPPED: No accounts deleted.\n');
    }

    // 1e. Clean up orphaned records in profile tables that have no matching tbl_akun
    console.log('Step 1e: Cleaning up orphaned records and cross-role leftovers in profile tables...');
    await db.sequelize.query('DELETE FROM `dataPenyuluhs` WHERE `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)', { transaction });
    await db.sequelize.query('DELETE FROM `dataOperators` WHERE `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)', { transaction });
    await db.sequelize.query('DELETE FROM `dataPetanis` WHERE `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)', { transaction });
    await db.sequelize.query('DELETE FROM `penjuals` WHERE `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)', { transaction });

    // 1f. Clean up mismatched profiles (Double-role leftovers):
    // An account whose role in tbl_akun is NOT 'operator admin' should NOT have a row in dataOperators
    await db.sequelize.query(
      "DELETE FROM `dataOperators` WHERE `accountID` IN (SELECT `accountID` FROM `tbl_akun` WHERE `peran` != 'operator admin')",
      { transaction }
    );
    // An account whose role in tbl_akun is NOT 'penyuluh' should NOT have a row in dataPenyuluhs
    await db.sequelize.query(
      "DELETE FROM `dataPenyuluhs` WHERE `accountID` IN (SELECT `accountID` FROM `tbl_akun` WHERE `peran` != 'penyuluh')",
      { transaction }
    );
    // An account whose role in tbl_akun is NOT 'petani' should NOT have a row in dataPetanis
    await db.sequelize.query(
      "DELETE FROM `dataPetanis` WHERE `accountID` IN (SELECT `accountID` FROM `tbl_akun` WHERE `peran` != 'petani')",
      { transaction }
    );
    console.log('✔ Profile tables cleaned of orphans and cross-role duplicate rows.\n');

    // STEP 2: Update Existing Valid Accounts in tbl_akun (Preserving existing password)
    console.log(`Step 2: Updating ${accountsToUpdate.length} existing accounts in tbl_akun...`);
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

      // Update Profile tables
      if (acc.peran.includes('penyuluh')) {
        const [existingPen] = await db.sequelize.query(
          'SELECT id FROM `dataPenyuluhs` WHERE `accountID` = :accountID',
          { replacements: { accountID: acc.accountID }, transaction }
        );
        if (existingPen.length > 0) {
          await db.sequelize.query(
            `UPDATE \`dataPenyuluhs\`
             SET \`nama\` = COALESCE(:nama, \`nama\`),
                 \`email\` = COALESCE(:email, \`email\`),
                 \`noTelp\` = COALESCE(:no_wa, \`noTelp\`),
                 \`nik\` = :nik,
                 \`alamat\` = COALESCE(:alamat, \`alamat\`),
                 \`kecamatanBinaan\` = COALESCE(:kecamatanBinaan, \`kecamatanBinaan\`),
                 \`desaBinaan\` = COALESCE(:desaBinaan, \`desaBinaan\`),
                 \`updatedAt\` = NOW()
             WHERE \`accountID\` = :accountID`,
            {
              replacements: {
                nama: acc.nama,
                email: acc.email,
                no_wa: acc.no_wa,
                nik: acc.nik,
                alamat: acc.alamat,
                kecamatanBinaan: acc.kecamatanBinaan || null,
                desaBinaan: acc.desaBinaan || null,
                accountID: acc.accountID,
              },
              transaction,
            }
          );
        } else {
          await db.sequelize.query(
            `INSERT INTO \`dataPenyuluhs\` (\`accountID\`, \`nik\`, \`nama\`, \`email\`, \`noTelp\`, \`alamat\`, \`kecamatanBinaan\`, \`desaBinaan\`, \`tipe\`, \`createdAt\`, \`updatedAt\`)
             VALUES (:accountID, :nik, :nama, :email, :noTelp, :alamat, :kecamatanBinaan, :desaBinaan, 'reguler', NOW(), NOW())`,
            {
              replacements: {
                accountID: acc.accountID,
                nik: acc.nik || null,
                nama: acc.nama,
                email: acc.email || null,
                noTelp: acc.no_wa || null,
                alamat: acc.alamat || null,
                kecamatanBinaan: acc.kecamatanBinaan || null,
                desaBinaan: acc.desaBinaan || null,
              },
              transaction,
            }
          );
        }
      } else if (acc.peran.includes('operator')) {
        const [existingOp] = await db.sequelize.query(
          'SELECT id FROM `dataOperators` WHERE `accountID` = :accountID',
          { replacements: { accountID: acc.accountID }, transaction }
        );
        if (existingOp.length > 0) {
          await db.sequelize.query(
            `UPDATE \`dataOperators\`
             SET \`nama\` = COALESCE(:nama, \`nama\`),
                 \`email\` = COALESCE(:email, \`email\`),
                 \`noTelp\` = COALESCE(:no_wa, \`noTelp\`),
                 \`nik\` = :nik,
                 \`alamat\` = COALESCE(:alamat, \`alamat\`),
                 \`updatedAt\` = NOW()
             WHERE \`accountID\` = :accountID`,
            {
              replacements: {
                nama: acc.nama,
                email: acc.email,
                no_wa: acc.no_wa,
                nik: acc.nik,
                alamat: acc.alamat,
                accountID: acc.accountID,
              },
              transaction,
            }
          );
        } else {
          await db.sequelize.query(
            `INSERT INTO \`dataOperators\` (\`accountID\`, \`nik\`, \`nama\`, \`email\`, \`noTelp\`, \`alamat\`, \`createdAt\`, \`updatedAt\`)
             VALUES (:accountID, :nik, :nama, :email, :noTelp, :alamat, NOW(), NOW())`,
            {
              replacements: {
                accountID: acc.accountID,
                nik: acc.nik || null,
                nama: acc.nama,
                email: acc.email || null,
                noTelp: acc.no_wa || null,
                alamat: acc.alamat || null,
              },
              transaction,
            }
          );
        }
      }
    }
    console.log(`✔ Updated ${updatedCount} existing accounts in tbl_akun and profile tables.\n`);

    // STEP 3: Insert Brand New Accounts into tbl_akun & Create Profiles
    if (accountsToInsert.length > 0) {
      console.log(`Step 3: Creating ${accountsToInsert.length} brand new accounts with default password...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      let insertedCount = 0;

      for (const acc of accountsToInsert) {
        const accId = acc.accountID || crypto.randomUUID();

        await db.sequelize.query(
          `INSERT INTO \`tbl_akun\` (\`accountID\`, \`nama\`, \`email\`, \`no_wa\`, \`password\`, \`peran\`, \`role_id\`, \`isVerified\`, \`createdAt\`, \`updatedAt\`)
           VALUES (:accountID, :nama, :email, :no_wa, :password, :peran, :role_id, :isVerified, NOW(), NOW())`,
          {
            replacements: {
              accountID: accId,
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
        insertedCount++;

        // Ensure profile record is also created
        if (acc.peran.includes('operator')) {
          await db.sequelize.query(
            `INSERT INTO \`dataOperators\` (\`accountID\`, \`nik\`, \`nama\`, \`email\`, \`noTelp\`, \`alamat\`, \`password\`, \`createdAt\`, \`updatedAt\`)
             VALUES (:accountID, :nik, :nama, :email, :noTelp, :alamat, :password, NOW(), NOW())`,
            {
              replacements: {
                accountID: accId,
                nik: acc.nik || null,
                nama: acc.nama,
                email: acc.email || null,
                noTelp: acc.no_wa || null,
                alamat: acc.alamat || null,
                password: hashedPassword,
              },
              transaction,
            }
          );
        } else if (acc.peran.includes('penyuluh')) {
          await db.sequelize.query(
            `INSERT INTO \`dataPenyuluhs\` (\`accountID\`, \`nik\`, \`nama\`, \`email\`, \`noTelp\`, \`alamat\`, \`kecamatanBinaan\`, \`desaBinaan\`, \`tipe\`, \`password\`, \`createdAt\`, \`updatedAt\`)
             VALUES (:accountID, :nik, :nama, :email, :noTelp, :alamat, :kecamatanBinaan, :desaBinaan, 'reguler', :password, NOW(), NOW())`,
            {
              replacements: {
                accountID: accId,
                nik: acc.nik || null,
                nama: acc.nama,
                email: acc.email || null,
                noTelp: acc.no_wa || null,
                alamat: acc.alamat || null,
                kecamatanBinaan: acc.kecamatanBinaan || null,
                desaBinaan: acc.desaBinaan || null,
                password: hashedPassword,
              },
              transaction,
            }
          );
        }
      }
      console.log(`✔ Inserted ${insertedCount} new accounts into tbl_akun and created corresponding profiles.\n`);
    }

    // STEP 4: Auditing Database Integrity
    console.log('Step 4: Auditing database relational integrity...');
    const [finalTblAkun] = await db.sequelize.query(
      'SELECT peran, role_id, count(*) as count FROM `tbl_akun` GROUP BY peran, role_id',
      { transaction }
    );
    const [finalTotalAkun] = await db.sequelize.query('SELECT count(*) as c FROM `tbl_akun`', { transaction });
    const [finalOps] = await db.sequelize.query('SELECT count(*) as c FROM `dataOperators`', { transaction });
    const [finalPens] = await db.sequelize.query('SELECT count(*) as c FROM `dataPenyuluhs`', { transaction });
    const [orphanPen] = await db.sequelize.query(
      'SELECT count(*) as c FROM `dataPenyuluhs` WHERE `accountID` IS NOT NULL AND `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)',
      { transaction }
    );
    const [orphanOp] = await db.sequelize.query(
      'SELECT count(*) as c FROM `dataOperators` WHERE `accountID` IS NOT NULL AND `accountID` NOT IN (SELECT `accountID` FROM `tbl_akun`)',
      { transaction }
    );

    console.log(`================================================================`);
    console.log(`📊 FINAL POST-SYNC DATABASE AUDIT:`);
    console.log(`- tbl_akun Total : ${finalTotalAkun[0].c} (Target: 153)`);
    for (const r of finalTblAkun) {
      console.log(`  * ${r.peran} (role_id ${r.role_id}): ${r.count}`);
    }
    console.log(`- dataOperators  : ${finalOps[0].c} (Target: 19)`);
    console.log(`- dataPenyuluhs  : ${finalPens[0].c} (Target: 133)`);
    console.log(`- Orphan Profiles: ${orphanPen[0].c + orphanOp[0].c} (Target: 0)`);
    console.log(`================================================================\n`);

    // Commit Transaction
    await transaction.commit();
    console.log('================================================================');
    console.log('🎉 COMPREHENSIVE SYNCHRONIZATION & PURGE COMMITTED TO DB!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Error during synchronization, transaction rolled back safely:', err.message);
    process.exit(1);
  }
}

runSync();
