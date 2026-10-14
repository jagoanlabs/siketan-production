const { S3Client, CreateBucketCommand, HeadBucketCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://127.0.0.1:8333',
  credentials: {
    accessKeyId: 'siketan_s3_key',
    secretAccessKey: 'siketan_s3_secret'
  },
  forcePathStyle: true
});

const BUCKET = 'siketan';

async function testS3() {
  console.log('Testing S3 connection to SeaweedFS...');

  // 1. Check / Create Bucket
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket "${BUCKET}" already exists.`);
  } catch (err) {
    console.log(`Bucket "${BUCKET}" does not exist, creating...`);
    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket "${BUCKET}" created successfully.`);
  }

  // 2. Upload a sample object
  const testContent = Buffer.from('Hello from Siketan SeaweedFS S3 Storage!');
  const testKey = `test-${Date.now()}.txt`;

  console.log(`Uploading test file: ${testKey}...`);
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: testKey,
    Body: testContent,
    ContentType: 'text/plain'
  }));
  console.log(`Uploaded successfully! Key: ${testKey}`);

  // 3. Test HTTP access via anonymous read
  const publicUrl = `http://127.0.0.1:8333/${BUCKET}/${testKey}`;
  console.log(`Testing HTTP GET to: ${publicUrl}`);

  const res = await fetch(publicUrl);
  console.log(`HTTP Status: ${res.status}`);
  const text = await res.text();
  console.log(`HTTP Response Body: "${text}"`);

  if (res.status === 200 && text === 'Hello from Siketan SeaweedFS S3 Storage!') {
    console.log('\n🎉 S3 Storage (SeaweedFS) TEST PASSED 100%!');
  } else {
    console.error('\n❌ HTTP fetch test failed!');
  }
}

testS3().catch((err) => {
  console.error('❌ Error during S3 test:', err);
  process.exit(1);
});
