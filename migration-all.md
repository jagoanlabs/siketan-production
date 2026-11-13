# Runbook Migrasi Lengkap SIKETAN

Dokumen ini menjelaskan migrasi dari dump database lama hingga database, akun, ownership Poktan, dan file gambar siap dipakai pada storage S3-compatible (SeaweedFS).

> **Peringatan:** Jalankan pada server maintenance / database target, bukan pada database produksi aktif tanpa backup terverifikasi. Proses sinkronisasi akun menghapus permanen akun yang tidak ada pada daftar resmi Excel.

## 1. Prasyarat

- MySQL atau MariaDB tersedia.
- Node.js dan npm tersedia.
- Dependensi backend terpasang:

  ```bash
  cd /Users/user/Data/siketan-production/backend
  npm ci
  ```

- SeaweedFS/S3 sudah dapat dijalankan.
- File sumber tersedia:
  - `/Users/user/Data/siketan-production/old-db.sql`
  - `/Users/user/Data/siketan-production/List ID Poktan.xlsx`
  - `/Users/user/Data/siketan-production/user-new.xlsx`
  - `/Users/user/Data/siketan-production/backend/extracted_images/files_manifest.json`

## 2. Buat Database Target dan Impor Dump Lama

Pilih nama database target, misalnya `siketan`.

```bash
mysql -u USER -p -e "CREATE DATABASE siketan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u USER -p siketan < /Users/user/Data/siketan-production/old-db.sql
```

Verifikasi impor:

```bash
mysql -u USER -p siketan -e "
  SELECT
    (SELECT COUNT(*) FROM SequelizeMeta) AS migrations,
    (SELECT COUNT(*) FROM kelompoks) AS groups,
    (SELECT COUNT(*) FROM dataTanamans) AS statistics,
    (SELECT COUNT(*) FROM tbl_akun) AS accounts;
"
```

Dump lama yang digunakan proyek ini diharapkan memiliki:

- 58 migration pada `SequelizeMeta`
- 1.122 Poktan
- 20.516 data statistika
- 2.444 akun lama

## 3. Konfigurasi Backend ke Database Target

Salin contoh environment bila belum ada:

```bash
cd /Users/user/Data/siketan-production/backend
cp .env.example .env
```

Isi koneksi database pada `.env`:

```env
DB_NAME=siketan
DB_USER=USER
DB_PASSWORD=PASSWORD
DB_HOST=127.0.0.1
DB_PORT=3306
```

Jangan commit file `.env`.

## 4. Backup Sebelum Perubahan

Simpan backup penuh sebelum menjalankan migration aplikasi:

```bash
mysqldump -u USER -p \
  --single-transaction \
  --routines \
  --events \
  --hex-blob \
  siketan > /lokasi-backup/pre_full_migration.sql
```

Pastikan file backup memiliki ukuran wajar dan dapat dibaca sebelum melanjutkan.

## 5. Upgrade Struktur Database

Jalankan migration Sequelize:

```bash
cd /Users/user/Data/siketan-production/backend
npx sequelize-cli db:migrate
```

Untuk dump lama ini, migration yang seharusnya ditambahkan adalah:

1. `created_by` pada `dataTanamans`
2. tabel `notifications`
3. permission realisasi statistik untuk role penyuluh

Verifikasi:

```bash
npx sequelize-cli db:migrate:status
```

Semua migration harus berstatus `up`.

## 6. Migrasi ID Poktan

Migrasi ini menyelaraskan `kelompoks.id` dengan daftar resmi Dinas dan memperbarui foreign key pada data statistika, petani, dan data person.

### Simulasi

```bash
cd /Users/user/Data/siketan-production/backend
npm run migrate:poktan -- --dry-run
```

Lanjutkan hanya jika hasilnya:

```text
Berhasil dipetakan: 1122 / 1122
Belum terpetakan: 0
```

### Eksekusi

```bash
npm run migrate:poktan
```

Skrip membuat backup tambahan pada `backend/backups/`.

### Verifikasi

```bash
mysql -u USER -p siketan -e "
  SELECT id, namaKelompok, desa, kecamatan
  FROM kelompoks
  WHERE id = 409;

  SELECT COUNT(*) AS invalid_statistic_group_references
  FROM dataTanamans d
  LEFT JOIN kelompoks k ON k.id = d.fk_kelompokId
  WHERE d.fk_kelompokId IS NOT NULL AND k.id IS NULL;
"
```

Poktan ID `409` harus menjadi `Mulyaning Bebrayan.` dan jumlah referensi invalid harus `0`.

## 7. Cleaning dan Sinkronisasi Akun

Sumber resmi akun adalah:

```text
/Users/user/Data/siketan-production/user-new.xlsx
```

Skrip membaca:

- `Akun Operator Fix`
- `Akun Penyuluh Fix`
- `Akun yang Dihapus`

Skrip tidak menggunakan `Data Master` sebagai daftar akun aktif.

### Simulasi

```bash
cd /Users/user/Data/siketan-production/backend
npm run sync:users:dry
```

Tinjau file:

```text
backend/data_preview/user_sync_preview.json
```

Periksa terutama:

- `conflicts` harus kosong
- `allDeletes` adalah daftar akun yang memang boleh dihapus
- jumlah akun insert dan update sesuai harapan

### Eksekusi

```bash
npm run sync:users
```

> Perintah ini melakukan hard delete terhadap akun di sheet penghapusan dan akun lain di luar dua sheet `Fix`, kecuali super-admin yang dilindungi.

### Verifikasi

```bash
mysql -u USER -p siketan -e "
  SELECT peran, COUNT(*) AS total
  FROM tbl_akun
  GROUP BY peran
  ORDER BY peran;

  SELECT COUNT(*) AS active_penyuluh
  FROM dataPenyuluhs
  WHERE deletedAt IS NULL;

  SELECT COUNT(*) AS orphan_penyuluh_profiles
  FROM dataPenyuluhs p
  LEFT JOIN tbl_akun a ON a.accountID = p.accountID
  WHERE p.accountID IS NOT NULL AND a.accountID IS NULL;
"
```

Target daftar resmi saat ini:

- 19 operator admin
- 133 penyuluh
- 1 operator super admin
- 153 akun total

## 8. Migrasi Ownership Poktan ke Penyuluh

Sumber ownership terdapat pada sheet `Akun Penyuluh Fix`:

- `Gapoktan Binaan`
- `Kelompok Tani Binaan`

Migrator:

```text
backend/helpers/migrate-ownership.js
```

Migrator mencocokkan pasangan **Gapoktan + Poktan**, lalu mengisi `kelompoks.penyuluh` dengan ID profil `dataPenyuluhs`.

### Simulasi

```bash
cd /Users/user/Data/siketan-production/backend
npm run migrate:ownership -- --prefer-existing
```

Tinjau:

```text
backend/data_preview/ownership_migration_preview.json
```

Jangan menjalankan mode tulis apabila masih terdapat `ambiguousCandidates`, kecuali setiap konflik sudah memiliki keputusan penugasan yang resmi.

### Eksekusi Parsial Aman

Perintah ini hanya menerapkan kandidat tunggal dan mempertahankan owner lama yang masih cocok dengan Excel. Poktan ambigu tidak diubah.

```bash
npm run migrate:ownership -- --execute --prefer-existing --allow-unresolved
```

Migrator membuat backup ownership pada `backend/backups/`.

### Menyelesaikan Konflik

Jika satu Poktan muncul pada beberapa penyuluh, buat mapping override resmi dengan bentuk:

| ID Poktan | ID/NIK Penyuluh | Alasan |
| --- | --- | --- |
| 409 | 3521... | Penugasan Dinas |

Terapkan override tersebut melalui migrator tambahan atau query terkontrol. Jangan memilih kandidat pertama secara otomatis.

## 9. Siapkan SeaweedFS / S3

Atur storage pada `backend/.env`:

```env
STORAGE_DRIVER=s3
S3_ENDPOINT=http://127.0.0.1:8333
S3_REGION=us-east-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET_NAME=siketan
S3_PUBLIC_URL=https://domain-aplikasi.example/storage
```

`S3_PUBLIC_URL` harus URL yang dapat diakses browser pengguna. Jangan menggunakan `127.0.0.1` atau hostname container untuk URL produksi yang akan disimpan ke database.

Untuk environment lokal dengan Docker:

```bash
cd /Users/user/Data/siketan-production
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d seaweedfs
```

Pastikan endpoint S3 tersedia sebelum lanjut:

```bash
curl -I http://127.0.0.1:8333
```

## 10. Migrasi File Gambar ke S3

Skrip membaca manifest dan file dari `backend/extracted_images/`.

```bash
cd /Users/user/Data/siketan-production/backend
npm run migrate:s3
```

Lanjutkan hanya jika ringkasan menunjukkan:

```text
Failed   : 0
Missing  : 0
```

Skrip idempoten: file yang sudah ada di bucket akan dilewati.

## 11. Ubah URL ImageKit Menjadi URL S3

Jalankan **setelah** unggahan S3 tervalidasi:

```bash
cd /Users/user/Data/siketan-production/backend
node helpers/update-db-image-urls.js
```

Skrip ini mengganti prefix URL lama pada kolom gambar akun, profil, berita, acara, produk, jurnal, lampiran, dan tabel terkait.

## 12. Validasi Akhir

### Database

```bash
mysql -u USER -p siketan -e "
  SELECT COUNT(*) AS invalid_statistic_group_references
  FROM dataTanamans d
  LEFT JOIN kelompoks k ON k.id = d.fk_kelompokId
  WHERE d.fk_kelompokId IS NOT NULL AND k.id IS NULL;

  SELECT
    SUM(penyuluh IS NULL OR penyuluh = '') AS unassigned,
    COUNT(*) AS total
  FROM kelompoks;
"
```

### Aplikasi

1. Login sebagai operator admin.
2. Login sebagai beberapa penyuluh.
3. Pastikan penyuluh hanya melihat Poktan binaannya.
4. Buka statistik Poktan ID `409`.
5. Uji gambar profil, berita, acara, produk, jurnal, dan lampiran melalui domain publik.

## 13. Rollback

### Rollback penuh

Gunakan dump yang dibuat pada langkah 4:

```bash
mysql -u USER -p -e "DROP DATABASE siketan; CREATE DATABASE siketan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u USER -p siketan < /lokasi-backup/pre_full_migration.sql
```

### Rollback ID Poktan

Jika hanya migrasi Poktan yang perlu dikembalikan:

```bash
cd /Users/user/Data/siketan-production/backend
npm run restore:poktan
```

Untuk cleaning akun dan perubahan URL gambar, gunakan backup database penuh. Jangan mencoba rollback manual setelah sinkronisasi akun.
