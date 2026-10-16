const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

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

let bucketEnsured = false;
async function ensureBucketExists() {
  if (bucketEnsured) return;
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET_NAME }));
    bucketEnsured = true;
  } catch (err) {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET_NAME }));
      bucketEnsured = true;
      console.log(`[SeaweedFS S3] Bucket "${S3_BUCKET_NAME}" created successfully.`);
    } catch (createErr) {
      console.warn(`[SeaweedFS S3] Note on ensure bucket "${S3_BUCKET_NAME}":`, createErr.message);
    }
  }
}

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
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

/**
 * Drop-in replacement for ImageKit.upload
 * @param {Object} options
 * @param {Buffer|string} options.file - file buffer or base64 string
 * @param {string} options.fileName - destination filename
 */
async function upload({ file, fileName }) {
  await ensureBucketExists();

  let body = file;
  if (typeof file === 'string') {
    // If base64 string
    const base64Data = file.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    body = Buffer.from(base64Data, 'base64');
  }

  const cleanFileName = fileName.replace(/[/\\?%*:|"<>]/g, '_');
  const contentType = getMimeType(cleanFileName);

  console.log(`[SeaweedFS S3] 📤 Mengunggah "${cleanFileName}" (${contentType})...`);

  await s3Client.send(new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: cleanFileName,
    Body: body,
    ContentType: contentType,
  }));

  const publicUrl = `${S3_PUBLIC_URL}/${S3_BUCKET_NAME}/${cleanFileName}`;

  console.log(`[SeaweedFS S3] ✅ Berhasil diunggah: ${publicUrl}`);

  return {
    url: publicUrl,
    fileId: cleanFileName,
    name: cleanFileName,
    size: Buffer.isBuffer(body) ? body.length : null,
    filePath: `/${cleanFileName}`,
  };
}

/**
 * Delete object from S3
 */
async function deleteFile(fileId) {
  try {
    console.log(`[SeaweedFS S3] 🗑️ Menghapus "${fileId}" dari bucket "${S3_BUCKET_NAME}"...`);
    await s3Client.send(new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileId,
    }));
    return { success: true };
  } catch (err) {
    console.error(`[SeaweedFS S3] ❌ Gagal menghapus ${fileId}:`, err);
    throw err;
  }
}

module.exports = {
  client: s3Client,
  upload,
  deleteFile,
  delete: deleteFile,
  bucket: S3_BUCKET_NAME,
};
