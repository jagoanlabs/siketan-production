require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const ImageKit = require('imagekit');

// Inisialisasi ImageKit dengan kredensial dari .env
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL
});

// Folder tujuan penyimpanan file
const OUTPUT_DIR = path.join(__dirname, 'extracted_images');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Helper untuk mendownload file dari URL dan menyimpannya ke disk
 */
function downloadFile(fileUrl, destinationPath) {
  return new Promise((resolve, reject) => {
    const client = fileUrl.startsWith('https') ? https : http;
    const fileStream = fs.createWriteStream(destinationPath);

    client.get(fileUrl, (response) => {
      // Handle redirect jika ada (status 301, 302, 307, 308)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        fileStream.close();
        fs.unlink(destinationPath, () => {});
        return downloadFile(response.headers.location, destinationPath)
          .then(resolve)
          .catch(reject);
      }

      // Jika error 400 karena resolusi terlalu besar (>25MP), coba ambil original tanpa transformasi
      if (response.statusCode === 400 && !fileUrl.includes('tr:orig-true')) {
        fileStream.close();
        fs.unlink(destinationPath, () => {});
        const urlObj = new URL(fileUrl);
        const originalUrl = `${urlObj.origin}/tr:orig-true${urlObj.pathname}`;
        return downloadFile(originalUrl, destinationPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        fileStream.close();
        fs.unlink(destinationPath, () => {});
        return reject(new Error(`HTTP status code ${response.statusCode}`));
      }

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      fileStream.close();
      fs.unlink(destinationPath, () => {});
      reject(err);
    });
  });
}

async function extractAllResources() {
  console.log('====================================================');
  console.log('📦 ImageKit Resource Extractor');
  console.log(`Endpoint: ${process.env.IMAGEKIT_URL}`);
  console.log('====================================================\n');

  let skip = 0;
  const limit = 100;
  let allFiles = [];
  let hasMore = true;

  // 1. Mengambil seluruh metadata file dari ImageKit (Paging)
  console.log('⏳ Mengambil daftar seluruh file dari ImageKit...');
  while (hasMore) {
    process.stdout.write(`Fetching offset ${skip}... `);
    try {
      const files = await imagekit.listFiles({
        skip,
        limit,
      });

      if (!files || files.length === 0) {
        console.log('selesai.');
        hasMore = false;
        break;
      }

      console.log(`ditemukan ${files.length} file.`);
      allFiles.push(...files);
      skip += files.length;

      // Jika file yang didapat kurang dari batas limit, berarti sudah halaman terakhir
      if (files.length < limit) {
        hasMore = false;
      }
    } catch (error) {
      console.error(`\n❌ Error saat fetch file list: ${error.message}`);
      break;
    }
  }

  console.log(`\n Total resource ditemukan: ${allFiles.length} file.`);

  if (allFiles.length === 0) {
    console.log('Tidak ada file untuk diunduh.');
    return;
  }

  // Simpan data manifest (metadata) ke files_manifest.json
  const manifestPath = path.join(OUTPUT_DIR, 'files_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(allFiles, null, 2));
  console.log(`📄 Manifest disimpan ke: ${manifestPath}\n`);

  // 2. Download file ke direktori lokal
  console.log('⬇️  Mulai proses download file...');
  let successCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    // Pastikan nama file aman untuk filesystem
    const safeName = file.name.replace(/[/\\?%*:|"<>]/g, '_');
    // Prefix dengan ID unik jika ada kemungkinan duplikasi nama
    const fileName = `${file.fileId}_${safeName}`;
    const destination = path.join(OUTPUT_DIR, fileName);

    process.stdout.write(`[${i + 1}/${allFiles.length}] ${file.name} `);

    // Lewati jika file sudah terdownload sebelumnya dan ukurannya sesuai
    if (fs.existsSync(destination)) {
      const stats = fs.statSync(destination);
      if (stats.size > 0) {
        console.log('(sudah ada, dilewati)');
        skippedCount++;
        continue;
      }
    }

    try {
      await downloadFile(file.url, destination);
      console.log('✔ selesai');
      successCount++;
    } catch (err) {
      console.log(`❌ gagal: ${err.message}`);
      failCount++;
    }
  }

  console.log('\n====================================================');
  console.log('🎉 Ringkasan Ekstraksi:');
  console.log(`- Berhasil diunduh : ${successCount}`);
  console.log(`- Sudah ada        : ${skippedCount}`);
  console.log(`- Gagal            : ${failCount}`);
  console.log(`- Lokasi folder    : ${OUTPUT_DIR}`);
  console.log('====================================================\n');
}

extractAllResources();
