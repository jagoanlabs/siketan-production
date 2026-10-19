const ImageKit = require('imagekit');
const dotenv = require('dotenv');
const s3Storage = require('./s3Storage');
const sharp = require('sharp');
const path = require('path');

dotenv.config();

const STORAGE_DRIVER = process.env.STORAGE_DRIVER || 's3';

let storageInstance;

if (STORAGE_DRIVER === 'imagekit') {
  storageInstance = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL,
  });
} else {
  // Default to local S3 compatible storage (SeaweedFS / MinIO / AWS S3)
  storageInstance = s3Storage;
}

// Convert uploaded images once, regardless of the configured storage provider.
// Non-image attachments (PDF, spreadsheet, etc.) retain their original bytes.
async function upload(options) {
  const extension = path.extname(options.fileName || '').toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
    return storageInstance.upload(options);
  }

  const input = Buffer.isBuffer(options.file)
    ? options.file
    : Buffer.from(String(options.file).replace(/^data:[^,]+,/, ''), 'base64');
  const image = sharp(input, { animated: extension === '.gif', limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  if (!['jpeg', 'png', 'gif', 'webp'].includes(metadata.format)) {
    throw new Error('Unsupported image format');
  }

  const webp = await image.resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();
  return storageInstance.upload({
    ...options,
    file: webp,
    fileName: `${options.fileName.slice(0, -extension.length)}.webp`
  });
}

module.exports = new Proxy(storageInstance, {
  get(target, property) {
    if (property === 'upload') return upload;
    const value = target[property];
    return typeof value === 'function' ? value.bind(target) : value;
  }
});
