require('dotenv').config();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://127.0.0.1:8333';
const S3_REGION = process.env.S3_REGION || 'us-east-1';
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || 'siketan_s3_key';
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || 'siketan_s3_secret';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siketan';
const S3_PUBLIC_URL = (process.env.S3_PUBLIC_URL || 'http://127.0.0.1:8333').replace(/\/+$/, '');

const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function checkS3Stats() {
  console.log('========================================================');
  console.log('📊 SeaweedFS S3 Storage Monitor & File Inspector');
  console.log(`Endpoint   : ${S3_ENDPOINT}`);
  console.log(`Bucket     : ${S3_BUCKET_NAME}`);
  console.log(`Public URL : ${S3_PUBLIC_URL}`);
  console.log('========================================================\n');

  let totalFiles = 0;
  let totalBytes = 0;
  let continuationToken = undefined;
  let sampleFiles = [];

  process.stdout.write('🔍 Memindai seluruh file di bucket...');

  try {
    do {
      const response = await s3Client.send(new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }));

      if (response.Contents) {
        for (const item of response.Contents) {
          totalFiles++;
          totalBytes += item.Size || 0;
          if (sampleFiles.length < 5) {
            sampleFiles.push(item);
          }
        }
      }

      continuationToken = response.NextContinuationToken;
      process.stdout.write('.');
    } while (continuationToken);

    console.log(' selesai!\n');

    console.log('📦 Status Penyimpanan S3:');
    console.log(`- Total Objek/File : ${totalFiles.toLocaleString('id-ID')} file`);
    console.log(`- Total Kapasitas  : ${formatBytes(totalBytes)}`);
    console.log('--------------------------------------------------------');

    if (totalFiles === 0) {
      console.log('⚠️ Bucket masih kosong. Belum ada file yang diunggah.');
      return;
    }

    console.log('\n🔎 Sampel 5 File Teratas & Uji Akses Publik:');
    for (let i = 0; i < sampleFiles.length; i++) {
      const file = sampleFiles[i];
      const fileUrl = `${S3_PUBLIC_URL}/${S3_BUCKET_NAME}/${file.Key}`;
      let statusText = 'Unknown';
      try {
        const res = await fetch(fileUrl, { method: 'HEAD' });
        statusText = `HTTP ${res.status} ${res.statusText || 'OK'}`;
      } catch (err) {
        statusText = `Error: ${err.message}`;
      }

      console.log(`[${i + 1}] ${file.Key}`);
      console.log(`    Ukuran : ${formatBytes(file.Size || 0)}`);
      console.log(`    URL    : ${fileUrl}`);
      console.log(`    Status : ${statusText}\n`);
    }

    console.log('========================================================');
    console.log('✅ Semua verifikasi selesai. Penyimpanan berjalan normal!');
    console.log('========================================================\n');
  } catch (error) {
    console.error('\n❌ Gagal memeriksa S3:', error.message);
    process.exit(1);
  }
}

checkS3Stats();
