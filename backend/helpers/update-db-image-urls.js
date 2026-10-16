require('dotenv').config();
const db = require('../app/models');

const OLD_URL_PREFIX = process.env.IMAGEKIT_URL || 'https://ik.imagekit.io/hw6fintvt1';
const S3_PUBLIC_URL = (process.env.S3_PUBLIC_URL || 'http://127.0.0.1:8333').replace(/\/+$/, '');
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siketan';
const NEW_URL_PREFIX = `${S3_PUBLIC_URL}/${S3_BUCKET_NAME}`;

// Target tables and their photo/image columns
const TARGET_COLUMNS = [
  { table: 'beritatanis', column: 'fotoBerita' },
  { table: 'eventtanis', column: 'fotoKegiatan' },
  { table: 'datapetanis', column: 'foto' },
  { table: 'datapenyuluhs', column: 'foto' },
  { table: 'tbl_akuns', column: 'foto' },
  { table: 'penjuals', column: 'foto' },
  { table: 'footers', column: 'value' },
  { table: 'jurnalharians', column: 'gambar' },
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

  const oldPrefixesToReplace = [
    OLD_URL_PREFIX,
    'http://127.0.0.1:8333/siketan',
    'http://localhost:8333/siketan',
    'http://127.0.0.1:8333',
  ].filter(p => p && p !== NEW_URL_PREFIX);

  for (const oldPrefix of oldPrefixesToReplace) {
    console.log(`\nReplacing prefix "${oldPrefix}" -> "${NEW_URL_PREFIX}":`);
    for (const { table, column } of TARGET_COLUMNS) {
      try {
        const sql = `
          UPDATE \`${table}\`
          SET \`${column}\` = REPLACE(\`${column}\`, :oldPrefix, :newPrefix)
          WHERE \`${column}\` LIKE :searchPattern
        `;

        const [result] = await db.sequelize.query(sql, {
          replacements: {
            oldPrefix: oldPrefix,
            newPrefix: NEW_URL_PREFIX,
            searchPattern: `%${oldPrefix}%`
          }
        });

        if (result.affectedRows > 0) {
          console.log(`✔ Table "${table}" (${column}): ${result.affectedRows} rows updated.`);
        }
      } catch (err) {
        // Table or column might not exist, ignore safely
      }
    }
  }

  console.log('\n========================================================');
  console.log('🎉 URL Replacement completed successfully!');
  console.log('========================================================\n');
  process.exit(0);
}

updateDbImageUrls();
