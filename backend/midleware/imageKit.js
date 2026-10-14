const ImageKit = require('imagekit');
const dotenv = require('dotenv');
const s3Storage = require('./s3Storage');

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

module.exports = storageInstance;
