# Panduan Setup SeaweedFS (Local S3 Storage) & Migrasi Gambar di Server

Dokumen ini berisi panduan langkah demi langkah (*runbook*) untuk menginstalasi, mengonfigurasi, dan memigrasikan aset gambar dari **ImageKit** ke **SeaweedFS S3 Storage** di server produksi/staging platform **SIKETAN**.

---

## Daftar Isi
1. [Arsitektur & Kebutuhan Port](#1-arsitektur--kebutuhan-port)
2. [Prasyarat (Prerequisites)](#2-prasyarat-prerequisites)
3. [Langkah 1: Setup SeaweedFS Storage Container](#langkah-1-setup-seaweedfs-storage-container)
4. [Langkah 2: Konfigurasi Nginx Reverse Proxy](#langkah-2-konfigurasi-nginx-reverse-proxy)
5. [Langkah 3: Konfigurasi Environment Backend (.env)](#langkah-3-konfigurasi-environment-backend-env)
6. [Langkah 4: Ekstraksi & Migrasi Gambar (ImageKit -> SeaweedFS)](#langkah-4-ekstraksi--migrasi-gambar-imagekit---seaweedfs)
   - [4.1 Ekstraksi dari ImageKit](#41-ekstraksi-dari-imagekit)
   - [4.2 Upload ke Bucket S3 SeaweedFS](#42-upload-ke-bucket-s3-seaweedfs)
   - [4.3 Update URL di Database MySQL](#43-update-url-di-database-mysql)
7. [Langkah 5: Pengujian & Verifikasi](#langkah-5-pengujian--verifikasi)
8. [Panduan Operasional & Backup](#panduan-operasional--backup)

---

## 1. Arsitektur & Kebutuhan Port

```mermaid
flowchart LR
    Client["Browser / Frontend\n(<img src=...>)"] -->|Port 80/443\nGET /storage/siketan/...| Nginx["Nginx Reverse Proxy"]
    Nginx -->|Internal proxy_pass| S3Server["SeaweedFS S3 Server\n(Port 8333)"]
    Backend["Backend Express API"] -->|S3 SDK PutObject\n(Port 8333)| S3Server
    S3Server --> DataVolume["Volume Persisten\n(seaweedfs_data / ./seaweedfs/data)"]
```

### Pemetaan Port:
* **Port 8333**: S3 API Endpoint (internal docker & upload backend).
* **Port 8888**: Filer HTTP (Web Explorer file internal).
* **Port 80 / 443**: Akses publik gambar melalui Nginx path `/storage/`.

---

## 2. Prasyarat (Prerequisites)

Pastikan di server sudah terpasang:
* **Podman** atau **Docker** + Docker Compose.
* **Node.js** (v18+) atau **Bun**.
* Repository branch **`inserver`** sudah di-pull di server:
  ```bash
  git fetch origin inserver
  git checkout inserver
  ```

---

## 3. Langkah 1: Setup SeaweedFS Storage Container

Pastikan file konfigurasi akun S3 [seaweedfs/s3.json](file:///Users/user/Data/siketan-production/seaweedfs/s3.json) sudah ada di direktori root project:

```json
{
  "identities": [
    {
      "name": "siketan_admin",
      "credentials": [
        {
          "accessKey": "siketan_s3_key",
          "secretKey": "siketan_s3_secret"
        }
      ],
      "actions": [
        "Admin",
        "Read",
        "Write",
        "List",
        "Tagging"
      ]
    },
    {
      "name": "anonymous",
      "actions": [
        "Read",
        "List"
      ]
    }
  ]
}
```

### Opsi A: Menjalankan via Docker Compose (Direkomendasikan)
SeaweedFS sudah terdaftar di `docker-compose.yml`. Cukup build/start service:
```bash
docker-compose up -d seaweedfs
```

### Opsi B: Menjalankan via Podman CLI Mandiri
Jika server menggunakan Podman standalone:
```bash
# Buat folder data lokal jika belum ada
mkdir -p seaweedfs/data

# Jalankan container
podman run -d \
  --name siketan_seaweedfs \
  --restart unless-stopped \
  -p 8333:8333 \
  -p 8888:8888 \
  -v ./seaweedfs/s3.json:/etc/seaweedfs/s3.json:ro \
  -v ./seaweedfs/data:/data \
  docker.io/chrislusf/seaweedfs:latest \
  server -s3 -s3.port=8333 -s3.config=/etc/seaweedfs/s3.json -dir=/data
```

Verifikasi container berjalan:
```bash
podman ps --filter "name=siketan_seaweedfs"
# atau
docker ps | grep seaweedfs
```

---

## 4. Langkah 2: Konfigurasi Nginx Reverse Proxy

Tambahkan blok routing `/storage/` pada konfigurasi Nginx server agar gambar dapat dibuka oleh publik:

* Untuk local/staging ([nginx/conf.d/default.conf](file:///Users/user/Data/siketan-production/nginx/conf.d/default.conf)):
* Untuk domain produksi SSL ([nginx/conf.d/siketan.conf](file:///Users/user/Data/siketan-production/nginx/conf.d/siketan.conf)):

```nginx
# Forward akses gambar ke SeaweedFS S3
location /storage/ {
    proxy_pass http://seaweedfs:8333/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Reload Nginx:
```bash
docker-compose exec nginx nginx -s reload
# atau jika Nginx di host:
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Langkah 3: Konfigurasi Environment Backend (.env)

Masuk ke folder `backend` dan sesuaikan file `.env`:

```env
# Storage Driver
STORAGE_DRIVER=s3

# S3 Configuration
# Jika backend jalan di dalam container Docker/Podman:
# S3_ENDPOINT=http://seaweedfs:8333
# Jika backend jalan langsung di host server:
S3_ENDPOINT=http://127.0.0.1:8333

S3_REGION=us-east-1
S3_ACCESS_KEY=siketan_s3_key
S3_SECRET_KEY=siketan_s3_secret
S3_BUCKET_NAME=siketan

# Public URL untuk akses browser (sesuaikan dengan domain/IP server):
# Contoh lokal/staging:
S3_PUBLIC_URL=http://localhost:8089/storage
# Contoh produksi domain:
# S3_PUBLIC_URL=https://siketan.ngawikab.go.id/storage

# Fallback legacy ImageKit (biarkan sebagai cadangan)
IMAGEKIT_PUBLIC_KEY=public_d3bMQiQDK8VII3jDBgsRLCrZr3o=
IMAGEKIT_PRIVATE_KEY=private_go+D1FTg009zi9acYPcBURQPCKQ=
IMAGEKIT_URL=https://ik.imagekit.io/hw6fintvt1
```

Install dependency AWS S3 SDK (jika belum):
```bash
cd backend
npm install
```

---

## 6. Langkah 4: Ekstraksi & Migrasi Gambar (ImageKit -> SeaweedFS)

Proses migrasi terbagi menjadi 3 langkah berurutan:

```
[4.1 Extract ImageKit] -> [4.2 Upload ke S3] -> [4.3 Update URL di DB]
```

### 4.1 Ekstraksi dari ImageKit
*(Langkah ini mengunduh seluruh file lama dari ImageKit ke folder lokal `backend/extracted_images/`)*

Pastikan kredensial ImageKit di `.env` valid, lalu jalankan:
```bash
cd backend
node extract-images.js
```
* **Hasil**: Seluruh file foto tersimpan di `backend/extracted_images/` dan dibuat file metadata `files_manifest.json`.
* **Fitur Resume**: Jika terputus di tengah jalan, Anda bisa menjalankan ulang perintah di atas tanpa mendownload file yang sudah ada.

---

### 4.2 Upload ke Bucket S3 SeaweedFS
*(Langkah ini mengunggah seluruh file yang ada di `extracted_images/` ke SeaweedFS S3 storage)*

Jalankan perintah:
```bash
cd backend
npm run migrate:s3
# atau:
node helpers/migrate-imagekit-to-s3.js
```

Contoh output yang diharapkan:
```
========================================================
🎉 Migration to S3 Summary:
- Uploaded : 1213
- Skipped (already in S3) : 0
- Missing on disk : 0
- Failed   : 0
========================================================
```

---

### 4.3 Update URL di Database MySQL
*(Langkah ini memperbarui prefix URL di kolom database dari ImageKit ke S3 lokal)*

Pastikan database MySQL server aktif, lalu jalankan:
```bash
cd backend
node helpers/update-db-image-urls.js
```
Tabel-tabel yang otomatis diperbarui:
- `beritatanis` (`fotoBerita`)
- `eventtanis` (`fotoKegiatan`)
- `datapetanis` (`foto`)
- `datapenyuluhs` (`foto`)
- `tbl_akuns` (`foto`)
- `penjuals` (`foto`)
- `footers` (`value`)
- `jurnalharians` (`gambar`)

---

## 7. Langkah 5: Pengujian & Verifikasi

### 1. Uji Endpoint S3 SeaweedFS:
```bash
curl -I http://localhost:8333/
# Output: HTTP/1.1 405 Method Not Allowed (Artinya S3 aktif merespons)
```

### 2. Uji Ambil Salah Satu Gambar Langsung dari S3:
```bash
curl -I http://localhost:8333/siketan/default-image.jpg
# Output yang diharapkan: HTTP/1.1 200 OK, Content-Type: image/jpeg
```

### 3. Uji Ambil Gambar melalui Reverse Proxy Nginx:
```bash
curl -I http://localhost:8089/storage/siketan/default-image.jpg
# atau via domain:
curl -I https://siketan.ngawikab.go.id/storage/siketan/default-image.jpg
# Output yang diharapkan: HTTP/1.1 200 OK
```

### 4. Uji Upload Baru dari Backend:
Jalankan skrip tes cepat upload file baru:
```bash
cd backend
node -e "
const storage = require('./midleware/imageKit');
storage.upload({
  file: Buffer.from('Test upload server S3'),
  fileName: 'test-server.txt'
}).then(console.log).catch(console.error);
"
```

---

## 8. Panduan Operasional & Backup

### Lokasi Data Persisten:
Semua file objek, metadata filer, dan bucket S3 tersimpan secara persisten di:
- Path host: `./seaweedfs/data/`
- Docker volume: `seaweedfs_data`

### Cara Backup Storage SeaweedFS:
Untuk melakukan backup seluruh data foto/dokumen:
```bash
# Backup direktori data SeaweedFS
tar -czvf seaweedfs-backup-$(date +%F).tar.gz ./seaweedfs/data
```

### Cara Restart / Maintenance Container:
```bash
# Menggunakan Podman:
podman restart siketan_seaweedfs
podman logs -f siketan_seaweedfs

# Menggunakan Docker Compose:
docker-compose restart seaweedfs
docker-compose logs -f seaweedfs
```
