require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand, HeadBucketCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://127.0.0.1:8333';
const S3_REGION = process.env.S3_REGION || 'us-east-1';
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || 'siketan_s3_key';
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || 'siketan_s3_secret';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'siketan';
const EXTRACTED_DIR = path.join(__dirname, '..', 'extracted_images');
const MANIFEST_PATH = path.join(EXTRACTED_DIR, 'files_manifest.json');

const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

async function ensureBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET_NAME }));
  } catch (err) {
    console.log(`Bucket "${S3_BUCKET_NAME}" does not exist, creating...`);
    await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET_NAME }));
    console.log(`Bucket "${S3_BUCKET_NAME}" created.`);
  }
}

async function migrateImagesToS3() {
  console.log('========================================================');
  console.log('🚀 Migrating Extracted Images to S3 Storage (SeaweedFS)');
  console.log(`Endpoint : ${S3_ENDPOINT}`);
  console.log(`Bucket   : ${S3_BUCKET_NAME}`);
  console.log('========================================================\n');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifest file not found at: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  await ensureBucket();

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📦 Total files in manifest: ${manifest.length}`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;
  let failedCount = 0;

  for (let i = 0; i < manifest.length; i++) {
    const item = manifest[i];
    const safeName = item.name.replace(/[/\\?%*:|"<>]/g, '_');
    const localDiskName = `${item.fileId}_${safeName}`;
    const localPath = path.join(EXTRACTED_DIR, localDiskName);

    process.stdout.write(`[${i + 1}/${manifest.length}] ${item.name} `);

    if (!fs.existsSync(localPath)) {
      console.log('⚠️ local file missing, skipped');
      missingCount++;
      continue;
    }

    const key = item.name;

    // Check if object already exists in S3
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      }));
      console.log('✔ already in S3');
      skippedCount++;
      continue;
    } catch (e) {
      // Object not found, proceed to upload
    }

    try {
      const fileBuffer = fs.readFileSync(localPath);
      const contentType = item.mime || getMimeType(key);

      await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      }));

      console.log('✔ uploaded');
      uploadedCount++;
    } catch (err) {
      console.log(`❌ upload failed: ${err.message}`);
      failedCount++;
    }
  }

  console.log('\n========================================================');
  console.log('🎉 Migration to S3 Summary:');
  console.log(`- Uploaded : ${uploadedCount}`);
  console.log(`- Skipped (already in S3) : ${skippedCount}`);
  console.log(`- Missing on disk : ${missingCount}`);
  console.log(`- Failed   : ${failedCount}`);
  console.log('========================================================\n');
}

migrateImagesToS3().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
