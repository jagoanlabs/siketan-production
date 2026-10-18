require('dotenv').config();
const db = require('../app/models');

const OLD_URL_PREFIX = process.env.IMAGEKIT_URL || 'https://ik.imagekit.io/hw6fintvt1';
const S3_PUBLIC_URL = (process.env.S3_PUBLIC_URL || 'http://127.0.0.1:8333').replace(/\/+$/, '');
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siketan';
const NEW_URL_PREFIX = `${S3_PUBLIC_URL}/${S3_BUCKET_NAME}`;

// Target tables and their photo/image columns (supporting multiple casing aliases for Linux/macOS)
const TARGET_COLUMNS = [
  { tableAliases: ['penjuals'], column: 'fotoTanaman' }, // Product data image
  { tableAliases: ['tbl_akun'], column: 'foto' }, // User account avatar
  { tableAliases: ['beritaTanis', 'beritatanis'], column: 'fotoBerita' },
  { tableAliases: ['eventTanis', 'eventtanis'], column: 'fotoKegiatan' },
  { tableAliases: ['dataPetanis', 'datapetanis'], column: 'foto' },
  { tableAliases: ['dataPenyuluhs', 'datapenyuluhs'], column: 'foto' },
  { tableAliases: ['dataOperators', 'dataoperators'], column: 'foto' },
  { tableAliases: ['dataPeople', 'datapeople'], column: 'foto' },
  { tableAliases: ['laporanTanams', 'laporantanams'], column: 'fotoTanaman' },
  { tableAliases: ['presesiKehadirans', 'presesikehadirans'], column: 'FotoKegiatan' },
  { tableAliases: ['footers'], column: 'value' },
  { tableAliases: ['jurnalHarians', 'jurnalharians'], column: 'gambar' },
  { tableAliases: ['attachments'], column: 'link' },
];

async function updateDbImageUrls() {
  console.log('========================================================');
  console.log('🔄 SIKETAN: Replace ImageKit URLs with S3 URLs in Database');
  console.log(`Old Prefix : ${OLD_URL_PREFIX}`);
  console.log(`New Prefix : ${NEW_URL_PREFIX}`);
  console.log('========================================================\n');

  try {
    await db.sequelize.authenticate();
    console.log('✅ Connected to database.\n');
  } catch (err) {
    console.error('❌ Cannot connect to database:', err.message);
    process.exit(1);
  }

  // Fetch all existing tables in database
  const [dbTablesRaw] = await db.sequelize.query('SHOW TABLES');
  const existingTables = new Set(dbTablesRaw.map(r => Object.values(r)[0]));

  for (const { tableAliases, column } of TARGET_COLUMNS) {
    const matchedTable = tableAliases.find(alias => existingTables.has(alias));
    if (!matchedTable) {
      console.warn(`⚠️ Skipped: None of tables [${tableAliases.join(', ')}] exist in database.`);
      continue;
    }

    try {
      const sql = `
        UPDATE \`${matchedTable}\`
        SET \`${column}\` = REPLACE(\`${column}\`, :oldPrefix, :newPrefix)
        WHERE \`${column}\` LIKE :searchPattern
      `;

      const [result] = await db.sequelize.query(sql, {
        replacements: {
          oldPrefix: OLD_URL_PREFIX,
          newPrefix: NEW_URL_PREFIX,
          searchPattern: `%${OLD_URL_PREFIX}%`
        }
      });

      console.log(`✔ Table "${matchedTable}" (${column}): ${result.affectedRows || 0} rows updated.`);
    } catch (err) {
      console.warn(`⚠️ Error on "${matchedTable}.${column}": ${err.message}`);
    }
  }

  console.log('\n========================================================');
  console.log('🎉 URL Replacement completed successfully!');
  console.log('========================================================\n');
  process.exit(0);
}

updateDbImageUrls();
