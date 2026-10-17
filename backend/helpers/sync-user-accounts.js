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
  const isSkipDelete = args.includes('--skip-delete');
  
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
  --skip-delete       : Skip deleting accounts listed in sheet 'Akun yang Dihapus'.
  --default-password  : Set temporary password for newly created accounts (default: 'Siketan2026!').
  --help, -h          : Show this help menu.

Available shortcuts:
  bun run sync:users         -> Live Execution (Delete audit accounts, Update existing, Create new)
  bun run sync:users:dry     -> Dry-run simulation (Preview only, no DB changes)
================================================================
`);
    process.exit(0);
  }

  console.log('================================================================');
  console.log('🔄 SIKETAN: Comprehensive User Synchronization & Audit Purge');
  console.log(`Branch            : main`);
  console.log(`Mode              : ${isExecute ? '⚡ LIVE EXECUTION (Writing to DB)' : '🔍 DRY-RUN PREVIEW (No DB Changes)'}`);
  console.log(`Delete Audit List : ${isSkipDelete ? 'NO (--skip-delete active)' : 'YES (Accounts in "Akun yang Dihapus" will be deleted)'}`);
  console.log(`Password Security : 🔒 STRICT PRESERVATION (Existing user passwords will NOT be touched)`);
  console.log(`New User Password : '${defaultPassword}'`);
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

  // 4. Parse "Data Master" (skipping accounts marked for deletion)
  console.log('Parsing sheet "Data Master"...');
  const wsMaster = wb.getWorksheet('Data Master');
  const consolidated = new Map();
  let masterSkipped = 0;

  if (wsMaster) {
    wsMaster.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const accountID = cleanString(row.getCell(1).value);
        if (!accountID) return;

        if (deleteAccountIds.has(accountID)) {
          masterSkipped++;
          return;
        }

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

        consolidated.set(accountID, {
          source: 'Data Master',
          accountID,
          peran,
          role_id,
          nama,
          email,
          no_wa,
          isVerified,
          nik,
          nkk,
          alamat,
        });
      }
    });
  }
  console.log(`Loaded ${consolidated.size} accounts from Data Master (skipped ${masterSkipped} deleted accounts).\n`);

  // 5. Parse "Akun Operator Fix" (19 Official Operator Admin BPP)
  console.log('Parsing sheet "Akun Operator Fix"...');
  const wsOp = wb.getWorksheet('Akun Operator Fix');
  let opAdded = 0;
  let opEnriched = 0;

  if (wsOp) {
    wsOp.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const peran = 'operator admin';
        const role_id = 4;
        const nik = cleanString(row.getCell(2).value);
        const nama = cleanString(row.getCell(3).value);
        const email = cleanString(row.getCell(4).value);
        const no_wa = cleanPhone(row.getCell(5).value);
        const kec = cleanString(row.getCell(6).value);
        const alamat = cleanString(row.getCell(7).value);

        if (!nama && !email) return;

        // Check if already in consolidated by email or NIK
        let existingKey = null;
        for (const [k, v] of consolidated) {
          if (email && v.email && v.email.toLowerCase() === email.toLowerCase()) {
            existingKey = k;
            break;
          }
          if (nik && v.nik && v.nik === nik && v.peran === 'operator admin') {
            existingKey = k;
            break;
          }
        }

        if (existingKey) {
          const item = consolidated.get(existingKey);
          item.nama = nama || item.nama;
          item.email = email || item.email;
          item.no_wa = no_wa || item.no_wa;
          item.nik = nik || item.nik;
          item.alamat = alamat || item.alamat;
          item.kecamatan = kec;
          item.peran = 'operator admin';
          item.role_id = 4;
          item.isVerified = 1;
          opEnriched++;
        } else {
          const newAccId = crypto.randomUUID();
          consolidated.set(newAccId, {
            source: 'Akun Operator Fix',
            accountID: newAccId,
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
      }
    });
  }
  console.log(`Akun Operator Fix: Enriched ${opEnriched}, Added New ${opAdded}.\n`);

  // 6. Parse "Akun Penyuluh Fix" (130 Official Penyuluh)
  console.log('Parsing sheet "Akun Penyuluh Fix"...');
  const wsPen = wb.getWorksheet('Akun Penyuluh Fix');
  let penAdded = 0;
  let penEnriched = 0;

  if (wsPen) {
    wsPen.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const peran = 'penyuluh';
        const role_id = 3;
        const nik = cleanString(row.getCell(2).value);
        const nama = cleanString(row.getCell(3).value);
        const email = cleanString(row.getCell(4).value);
        const no_wa = cleanPhone(row.getCell(5).value);
        const kecBinaan = cleanString(row.getCell(6).value);
        const desaBinaan = cleanString(row.getCell(7).value);

        if (!nama && !email) return;

        let existingKey = null;
        for (const [k, v] of consolidated) {
          if (email && v.email && v.email.toLowerCase() === email.toLowerCase()) {
            existingKey = k;
            break;
          }
          if (nik && v.nik && v.nik === nik && v.peran === 'penyuluh') {
            existingKey = k;
            break;
          }
          if (nama && v.nama && v.nama.toLowerCase() === nama.toLowerCase() && v.peran === 'penyuluh') {
            existingKey = k;
            break;
          }
        }

        if (existingKey) {
          const item = consolidated.get(existingKey);
          if (email) item.email = email;
          if (no_wa) item.no_wa = no_wa;
          if (nik) item.nik = nik;
          item.kecamatanBinaan = kecBinaan;
          item.desaBinaan = desaBinaan;
          item.isVerified = 1;
          penEnriched++;
        } else {
          const newAccId = crypto.randomUUID();
          consolidated.set(newAccId, {
            source: 'Akun Penyuluh Fix',
            accountID: newAccId,
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
      }
    });
  }
  console.log(`Akun Penyuluh Fix: Enriched ${penEnriched}, Added New ${penAdded}.\n`);
  console.log(`Total Master Accounts Consolidated: ${consolidated.size}\n`);

  // 7. Fetch Existing Accounts from Database
  console.log('Comparing with database records...');
  const [dbUsers] = await db.sequelize.query('SELECT id, accountID, email, no_wa, nama, peran, role_id, isVerified FROM tbl_akun');
  
  // Exclude accounts scheduled for deletion from DB map
  const survivingDbUsers = isSkipDelete ? dbUsers : dbUsers.filter(u => !deleteAccountIds.has(u.accountID));
  const accountsToDeleteFromDb = dbUsers.filter(u => deleteAccountIds.has(u.accountID));

  const dbById = new Map(survivingDbUsers.map(u => [u.accountID, u]));
  const dbByEmail = new Map();
  for (const u of survivingDbUsers) {
    if (u.email) dbByEmail.set(u.email.toLowerCase().trim(), u);
  }

  const accountsToUpdate = [];
  const accountsToInsert = [];
  const processedDbAccountIDs = new Set();

  for (const [accId, item] of consolidated) {
    let matchedDbUser = null;
    if (dbById.has(item.accountID)) {
      matchedDbUser = dbById.get(item.accountID);
    } else if (item.email && dbByEmail.has(item.email.toLowerCase())) {
      matchedDbUser = dbByEmail.get(item.email.toLowerCase());
      item.accountID = matchedDbUser.accountID;
    }

    if (matchedDbUser) {
      accountsToUpdate.push(item);
      processedDbAccountIDs.add(matchedDbUser.accountID);
    } else {
      accountsToInsert.push(item);
    }
  }

  // Deactivate surviving DB accounts not in master list
  const accountsToDeactivate = survivingDbUsers.filter(u => !processedDbAccountIDs.has(u.accountID) && u.isVerified !== 0);

  console.log('----------------------------------------------------------------');
  console.log('📊 DATABASE CHANGE SUMMARY:');
  console.log(`🗑️ Accounts to DELETE from DB         : ${accountsToDeleteFromDb.length} (From "Akun yang Dihapus")`);
  console.log(`✔ Accounts to UPDATE in tbl_akun     : ${accountsToUpdate.length} (Passwords strictly preserved)`);
  console.log(`✔ Accounts to INSERT into tbl_akun   : ${accountsToInsert.length} (New accounts with default password)`);
  console.log(`✔ Accounts to DEACTIVATE (isVerified=0): ${accountsToDeactivate.length} (Unlisted test/spam accounts)`);
  console.log('----------------------------------------------------------------\n');

  // 8. Save Preview JSON
  if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const previewData = {
    generatedAt: new Date().toISOString(),
    isExecute,
    summary: {
      totalConsolidated: consolidated.size,
      accountsToDelete: accountsToDeleteFromDb.length,
      accountsToUpdate: accountsToUpdate.length,
      accountsToInsert: accountsToInsert.length,
      accountsToDeactivate: accountsToDeactivate.length,
    },
    sampleDeletes: accountsToDeleteFromDb.slice(0, 5),
    sampleUpdates: accountsToUpdate.slice(0, 5),
    sampleInserts: accountsToInsert.slice(0, 5),
  };
  fs.writeFileSync(PREVIEW_FILE, JSON.stringify(previewData, null, 2));
  console.log(`📄 Detailed preview JSON saved to: ${PREVIEW_FILE}\n`);

  // 9. If DRY-RUN mode, stop here
  if (isDryRun) {
    console.log('================================================================');
    console.log('🔍 DRY-RUN COMPLETE: No changes were made to the database.');
    console.log('To execute the live synchronization and apply changes to DB, run:');
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
    // STEP 1: Delete Audit List Accounts
    if (!isSkipDelete && accountsToDeleteFromDb.length > 0) {
      console.log(`Step 1: Deleting ${accountsToDeleteFromDb.length} audit list accounts from database...`);
      const delIds = accountsToDeleteFromDb.map(d => d.accountID);

      await db.sequelize.query('DELETE FROM `dataPenyuluhs` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      await db.sequelize.query('DELETE FROM `dataOperators` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      await db.sequelize.query('DELETE FROM `dataPetanis` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      await db.sequelize.query('DELETE FROM `penjuals` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      
      const [delRes] = await db.sequelize.query('DELETE FROM `tbl_akun` WHERE `accountID` IN (:delIds)', { replacements: { delIds }, transaction });
      console.log(`✔ Successfully deleted ${delRes?.affectedRows || delIds.length} accounts from tbl_akun and profiles.\n`);
    } else {
      console.log('ℹ️  Step 1 SKIPPED: No accounts deleted.\n');
    }

    // STEP 2: Update Existing Valid Accounts in tbl_akun (Preserving existing password)
    console.log('Step 2: Updating existing accounts in tbl_akun...');
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
        await db.sequelize.query(
          `UPDATE \`dataPenyuluhs\`
           SET \`nama\` = COALESCE(:nama, \`nama\`),
               \`email\` = COALESCE(:email, \`email\`),
               \`noTelp\` = COALESCE(:no_wa, \`noTelp\`),
               \`nik\` = COALESCE(:nik, \`nik\`),
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
      } else if (acc.peran.includes('operator')) {
        await db.sequelize.query(
          `UPDATE \`dataOperators\`
           SET \`nama\` = COALESCE(:nama, \`nama\`),
               \`email\` = COALESCE(:email, \`email\`),
               \`noTelp\` = COALESCE(:no_wa, \`noTelp\`),
               \`nik\` = COALESCE(:nik, \`nik\`),
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
      } else if (acc.peran.includes('petani')) {
        await db.sequelize.query(
          `UPDATE \`dataPetanis\`
           SET \`nama\` = COALESCE(:nama, \`nama\`),
               \`email\` = COALESCE(:email, \`email\`),
               \`noTelp\` = COALESCE(:no_wa, \`noTelp\`),
               \`nik\` = COALESCE(:nik, \`nik\`),
               \`nkk\` = COALESCE(:nkk, \`nkk\`),
               \`alamat\` = COALESCE(:alamat, \`alamat\`),
               \`updatedAt\` = NOW()
           WHERE \`accountID\` = :accountID`,
          {
            replacements: {
              nama: acc.nama,
              email: acc.email,
              no_wa: acc.no_wa,
              nik: acc.nik,
              nkk: acc.nkk,
              alamat: acc.alamat,
              accountID: acc.accountID,
            },
            transaction,
          }
        );
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
          const [existingOp] = await db.sequelize.query(
            'SELECT id FROM `dataOperators` WHERE `accountID` = :accountID',
            { replacements: { accountID: accId }, transaction }
          );
          if (existingOp.length === 0) {
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
          }
        } else if (acc.peran.includes('penyuluh')) {
          const [existingPen] = await db.sequelize.query(
            'SELECT id FROM `dataPenyuluhs` WHERE `accountID` = :accountID',
            { replacements: { accountID: accId }, transaction }
          );
          if (existingPen.length === 0) {
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
        } else if (acc.peran.includes('petani')) {
          const [existingPet] = await db.sequelize.query(
            'SELECT id FROM `dataPetanis` WHERE `accountID` = :accountID',
            { replacements: { accountID: accId }, transaction }
          );
          if (existingPet.length === 0) {
            await db.sequelize.query(
              `INSERT INTO \`dataPetanis\` (\`accountID\`, \`nik\`, \`nkk\`, \`nama\`, \`email\`, \`noTelp\`, \`alamat\`, \`password\`, \`createdAt\`, \`updatedAt\`)
               VALUES (:accountID, :nik, :nkk, :nama, :email, :noTelp, :alamat, :password, NOW(), NOW())`,
              {
                replacements: {
                  accountID: accId,
                  nik: acc.nik || null,
                  nkk: acc.nkk || null,
                  nama: acc.nama,
                  email: acc.email || null,
                  noTelp: acc.no_wa || null,
                  alamat: acc.alamat || null,
                  password: hashedPassword,
                },
                transaction,
              }
            );
          }
        }
      }
      console.log(`✔ Inserted ${insertedCount} new accounts into tbl_akun and created corresponding profiles.\n`);
    }

    // STEP 4: Deactivate Unlisted Accounts (Set isVerified = 0)
    if (accountsToDeactivate.length > 0) {
      console.log(`Step 4: Deactivating ${accountsToDeactivate.length} unlisted accounts (setting isVerified = 0)...`);
      const deactIds = accountsToDeactivate.map(a => a.accountID);
      await db.sequelize.query(
        'UPDATE `tbl_akun` SET `isVerified` = 0, `updatedAt` = NOW() WHERE `accountID` IN (:deactIds)',
        { replacements: { deactIds }, transaction }
      );
      console.log(`✔ Deactivated ${accountsToDeactivate.length} unlisted accounts.\n`);
    }

    // STEP 5: Auditing Database Integrity
    console.log('Step 5: Auditing database relational integrity...');
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
    console.log('🎉 COMPREHENSIVE SYNCHRONIZATION & AUDIT PURGE COMMITTED TO DB!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Error during synchronization, transaction rolled back safely:', err.message);
    process.exit(1);
  }
}

runSync();
