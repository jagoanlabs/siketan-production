require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL || 'https://ik.imagekit.io/hw6fintvt1',
});

const OUTPUT_DIR = path.join(__dirname, '..', 'extracted_images');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'files_manifest.json');

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function extractAllImages() {
  console.log('========================================================');
  console.log('📥 SIKETAN: Extract Images from ImageKit to Local Disk');
  console.log(`Endpoint : ${process.env.IMAGEKIT_URL}`);
  console.log(`Save To  : ${OUTPUT_DIR}`);
  console.log('========================================================\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let allFiles = [];
  let skip = 0;
  const limit = 100;
  let hasMore = true;

  console.log('Fetching files list from ImageKit API...');
  while (hasMore) {
    try {
      const files = await imagekit.listFiles({
        skip,
        limit,
      });

      if (!files || files.length === 0) {
        hasMore = false;
        break;
      }

      allFiles = allFiles.concat(files);
      console.log(`Fetched ${allFiles.length} file metadata records...`);

      if (files.length < limit) {
        hasMore = false;
      } else {
        skip += limit;
      }
    } catch (err) {
      console.error(`Error fetching file list at skip=${skip}:`, err.message);
      break;
    }
  }

  console.log(`\nTotal files to download: ${allFiles.length}`);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(allFiles, null, 2));
  console.log(`Manifest saved to: ${MANIFEST_PATH}\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < allFiles.length; i++) {
    const item = allFiles[i];
    const safeName = item.name.replace(/[/\\?%*:|"<>]/g, '_');
    const filename = `${item.fileId}_${safeName}`;
    const destPath = path.join(OUTPUT_DIR, filename);

    process.stdout.write(`[${i + 1}/${allFiles.length}] ${item.name} ... `);

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      console.log('✔ already exists');
      skipped++;
      continue;
    }

    try {
      await downloadFile(item.url, destPath);
      console.log('✔ downloaded');
      downloaded++;
    } catch (err) {
      console.log(`❌ failed: ${err.message}`);
      failed++;
    }
  }

  console.log('\n========================================================');
  console.log('🎉 Extraction Completed:');
  console.log(`- Downloaded : ${downloaded}`);
  console.log(`- Existing   : ${skipped}`);
  console.log(`- Failed     : ${failed}`);
  console.log(`- Total      : ${allFiles.length}`);
  console.log('========================================================\n');
}

if (require.main === module) {
  extractAllImages();
}

module.exports = { extractAllImages };
