require('dotenv').config();

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { HeadObjectCommand } = require('@aws-sdk/client-s3');
const db = require('../app/models');
const s3Storage = require('../midleware/s3Storage');

const BACKUP_DIR = path.resolve(__dirname, '..', 'backups');
const REPORT_DIR = path.resolve(__dirname, '..', 'data_preview');
const IMAGEKIT_HOST_SUFFIX = '.imagekit.io';

function isImageKitUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'imagekit.io' || url.hostname.endsWith(IMAGEKIT_HOST_SUFFIX));
  } catch {
    return false;
  }
}

function getArgs() {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex === -1 ? null : Number(args[limitIndex + 1]);

  if (limit !== null && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error('--limit harus berupa bilangan bulat positif.');
  }

  return { execute: args.includes('--execute'), limit };
}

function webpFileName(id, sourceUrl) {
  const originalName = path.basename(new URL(sourceUrl).pathname);
  const baseName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_') || 'berita';
  return `berita-${id}-${baseName}.webp`;
}

async function downloadImage(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`ImageKit merespons HTTP ${response.status}`);
  }

  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > 25 * 1024 * 1024) {
    throw new Error('Ukuran file sumber lebih dari batas 25 MB');
  }

  return Buffer.from(await response.arrayBuffer());
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

async function migrate() {
  const { execute, limit } = getArgs();
  await db.sequelize.authenticate();

  const [allRows] = await db.sequelize.query(
    `SELECT id, fotoBerita
     FROM beritaTanis
     WHERE fotoBerita IS NOT NULL
       AND TRIM(fotoBerita) <> ''
     ORDER BY id`
  );
  const candidates = allRows.filter((row) => isImageKitUrl(row.fotoBerita));
  const rows = limit ? candidates.slice(0, limit) : candidates;

  console.log('============================================================');
  console.log('🖼️  SIKETAN: Migrasi fotoBerita ImageKit ke WebP/S3');
  console.log(`Mode       : ${execute ? 'EXECUTE' : 'DRY-RUN'}`);
  console.log(`Kandidat   : ${candidates.length}${limit ? ` (dibatasi ${rows.length})` : ''}`);
  console.log(`Bucket     : ${s3Storage.bucket}`);
  console.log('============================================================');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `berita_imagekit_before_webp_${timestamp}.json`);
  const reportPath = path.join(REPORT_DIR, 'berita_imagekit_webp_report.json');
  const plan = rows.map((row) => ({
    id: row.id,
    sourceUrl: row.fotoBerita,
    targetFileName: webpFileName(row.id, row.fotoBerita),
  }));

  if (!execute) {
    writeJson(reportPath, {
      generatedAt: new Date().toISOString(),
      mode: 'dry-run',
      totalImageKitCandidates: candidates.length,
      planned: plan,
    });
    console.log(`Dry-run selesai. Tidak ada file atau database yang diubah.`);
    console.log(`Preview: ${reportPath}`);
    return;
  }

  writeJson(backupPath, {
    createdAt: new Date().toISOString(),
    description: 'Nilai fotoBerita sebelum migrasi ImageKit ke WebP/S3',
    rows: plan,
  });

  const results = [];
  for (let index = 0; index < plan.length; index += 1) {
    const item = plan[index];
    process.stdout.write(`[${index + 1}/${plan.length}] berita ${item.id} `);

    try {
      const source = await downloadImage(item.sourceUrl);
      const webp = await sharp(source, { animated: true, limitInputPixels: 40_000_000 })
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toBuffer();

      const uploaded = await s3Storage.upload({ file: webp, fileName: item.targetFileName });
      await s3Storage.client.send(
        new HeadObjectCommand({ Bucket: s3Storage.bucket, Key: uploaded.fileId })
      );

      const [updateResult] = await db.sequelize.query(
        `UPDATE beritaTanis
         SET fotoBerita = :targetUrl, updatedAt = NOW()
         WHERE id = :id AND fotoBerita = :sourceUrl`,
        {
          replacements: {
            id: item.id,
            sourceUrl: item.sourceUrl,
            targetUrl: uploaded.url,
          },
        }
      );

      if ((updateResult.affectedRows || 0) !== 1) {
        throw new Error('Baris database berubah selama migrasi; URL tidak ditimpa.');
      }

      results.push({ ...item, status: 'migrated', targetUrl: uploaded.url, webpBytes: webp.length });
      console.log('✔ migrated');
    } catch (error) {
      results.push({ ...item, status: 'failed', error: error.message });
      console.log(`✘ gagal: ${error.message}`);
    }
  }

  const migrated = results.filter((item) => item.status === 'migrated').length;
  const failed = results.length - migrated;
  writeJson(reportPath, {
    generatedAt: new Date().toISOString(),
    mode: 'execute',
    backupPath,
    totalImageKitCandidates: candidates.length,
    attempted: results.length,
    migrated,
    failed,
    results,
  });

  console.log('============================================================');
  console.log(`Berhasil dimigrasikan: ${migrated}`);
  console.log(`Gagal                : ${failed}`);
  console.log(`Backup               : ${backupPath}`);
  console.log(`Laporan              : ${reportPath}`);
  console.log('============================================================');

  if (failed > 0) process.exitCode = 1;
}

migrate().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
