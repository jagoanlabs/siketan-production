require('dotenv').config();
const db = require('../app/models');

const OLD_URL_PREFIX = process.env.IMAGEKIT_URL || 'https://ik.imagekit.io/hw6fintvt1';
const S3_PUBLIC_URL = (process.env.S3_PUBLIC_URL || 'http://127.0.0.1:8333').replace(/\/+$/, '');
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siketan';
const NEW_URL_PREFIX = `${S3_PUBLIC_URL}/${S3_BUCKET_NAME}`;

async function updateDbImageUrls() {
  console.log('========================================================');
  console.log('🔄 SIKETAN: Replace ImageKit URLs with S3 URLs in Database');
  console.log(`Target Prefix : ${NEW_URL_PREFIX}`);
  console.log('========================================================\n');

  try {
    await db.sequelize.authenticate();
    console.log('✅ Connected to database.\n');
  } catch (err) {
    console.error('❌ Cannot connect to database:', err.message);
    process.exit(1);
  }

  // Old prefixes that might exist in database
  const oldPrefixesToReplace = [
    OLD_URL_PREFIX,
    'https://ik.imagekit.io/hw6fintvt1',
    'http://127.0.0.1:8333/siketan',
    'http://localhost:8333/siketan',
    'http://127.0.0.1:8333',
    'http://localhost:8333',
  ]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter((p) => p !== NEW_URL_PREFIX);

  console.log('Fetching table and column schema dynamically from database...');
  const [columns] = await db.sequelize.query(`
    SELECT TABLE_NAME, COLUMN_NAME 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND (DATA_TYPE LIKE '%char%' OR DATA_TYPE LIKE '%text%')
  `);

  console.log(`Inspecting ${columns.length} columns across database for old image URLs...\n`);

  let totalUpdatedRows = 0;

  for (const { TABLE_NAME, COLUMN_NAME } of columns) {
    // Skip Sequelize internal migration table
    if (TABLE_NAME === 'SequelizeMeta') continue;

    for (const oldPrefix of oldPrefixesToReplace) {
      try {
        const sql = `
          UPDATE \`${TABLE_NAME}\`
          SET \`${COLUMN_NAME}\` = REPLACE(\`${COLUMN_NAME}\`, :oldPrefix, :newPrefix)
          WHERE \`${COLUMN_NAME}\` LIKE :searchPattern
        `;

        const [result] = await db.sequelize.query(sql, {
          replacements: {
            oldPrefix,
            newPrefix: NEW_URL_PREFIX,
            searchPattern: `%${oldPrefix}%`,
          },
        });

        const affected = result?.affectedRows || result?.rowCount || 0;
        if (affected > 0) {
          console.log(`✔ [${TABLE_NAME}.${COLUMN_NAME}] Updated ${affected} rows (${oldPrefix} -> ${NEW_URL_PREFIX})`);
          totalUpdatedRows += affected;
        }
      } catch (err) {
        // Silently skip if column update errors
      }
    }
  }

  console.log('\n========================================================');
  console.log(`🎉 Total updated rows: ${totalUpdatedRows}`);
  console.log('========================================================\n');
  process.exit(0);
}

updateDbImageUrls();
