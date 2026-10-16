# Panduan Setup SeaweedFS (Local S3 Storage) & Migrasi Gambar di Server

Dokumen ini berisi panduan lengkap langkah demi langkah (*runbook*) untuk menginstalasi, mengonfigurasi, memigrasikan aset dari **ImageKit** ke **SeaweedFS S3 Storage**, serta **cara memantau & memverifikasi file** di server produksi/staging platform **SIKETAN**.

---

## Daftar Isi
1. [Arsitektur & Kebutuhan Port](#1-arsitektur--kebutuhan-port)
2. [Prasyarat (Prerequisites)](#2-prasyarat-prerequisites)
3. [Langkah 1: Setup SeaweedFS Storage Container](#langkah-1-setup-seaweedfs-storage-container)
4. [Langkah 2: Konfigurasi Nginx Reverse Proxy](#langkah-2-konfigurasi-nginx-reverse-proxy)
5. [Langkah 3: Konfigurasi Environment Backend (.env)](#langkah-3-konfigurasi-environment-backend-env)
6. [Langkah 4: Alur Ekstraksi & Migrasi Gambar](#langkah-4-alur-ekstraksi--migrasi-gambar)
   - [Opsi A: Ekstraksi di Lokal (PC/Mac) lalu Transfer ke Server (Direkomendasikan jika server belum ada file)](#opsi-a-ekstraksi-di-lokal-pcmac-lalu-transfer-ke-server-direkomendasikan)
   - [Opsi B: Trik Singkat (Direct Volume Transfer)](#opsi-b-trik-singkat-direct-volume-transfer-paling-cepat)
   - [Opsi C: Ekstraksi Langsung di Server](#opsi-c-ekstraksi-langsung-di-server)
   - [Update URL di Database MySQL](#tahap-akhir-update-url-di-database-mysql)
7. [Langkah 5: Cara Memantau & Memonitoring File di SeaweedFS](#langkah-5-cara-memantau--memonitoring-file-di-seaweedfs)
   - [Metode 1: Skrip Monitoring Otomatis (npm run check:s3)](#metode-1-skrip-monitoring-otomatis-npm-run-checks3)
   - [Metode 2: Web Filer GUI (Browser - Paling Mudah & Visual)](#metode-2-web-filer-gui-browser---paling-mudah--visual)
   - [Metode 3: Master Dashboard & Volume Stats](#metode-3-master-dashboard--volume-stats)
   - [Metode 4: Menggunakan Desktop S3 Client (Cyberduck / FileZilla)](#metode-4-menggunakan-desktop-s3-client-cyberduck--filezilla)
   - [Metode 5: Menggunakan AWS CLI](#metode-5-menggunakan-aws-cli)
8. [Panduan Operasional & Backup](#panduan-operasional--backup)

---

## 1. Arsitektur & Kebutuhan Port

```mermaid
flowchart LR
    Client["Browser / Frontend\n(<img src=...>)"] -->|Port 80/443\nGET /storage/siketan/...| Nginx["Nginx Reverse Proxy"]
    Nginx -->|Internal proxy_pass| S3Server["SeaweedFS S3 Server\n(Port 8333)"]
    Backend["Backend Express API"] -->|S3 SDK PutObject\n(Port 8333)| S3Server
    S3Server --> DataVolume["Volume Persisten\n(seaweedfs_data / ./seaweedfs/data)"]
    Admin["Developer / Admin"] -->|Port 8888\nWeb Filer GUI| Filer["SeaweedFS Filer\n(Monitoring File)"]
```

### Pemetaan Port:
* **Port 8333**: S3 API Endpoint (internal docker & upload backend).
* **Port 8888**: Filer HTTP Web GUI (antarmuka browser untuk memantau/melihat file).
* **Port 9333**: SeaweedFS Master Status (dashboard performa cluster/disk).
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

### Menjalankan Container:

#### Opsi A: Menggunakan Docker Compose (Direkomendasikan)
Service SeaweedFS sudah terdaftar di `docker-compose.yml`. Cukup jalankan:
```bash
docker-compose up -d seaweedfs
```

#### Opsi B: Menggunakan Podman CLI Mandiri
Jika server menggunakan Podman standalone:
```bash
mkdir -p seaweedfs/data

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

Verifikasi container sudah berjalan:
```bash
podman ps --filter "name=siketan_seaweedfs"
# atau
docker ps | grep seaweedfs
```

---

## 4. Langkah 2: Konfigurasi Nginx Reverse Proxy

Tambahkan blok routing `/storage/` pada konfigurasi Nginx server agar gambar dapat dibuka oleh publik tanpa perlu domain baru:

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
# atau jika Nginx jalan di host server:
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

# Public URL untuk akses browser:
# Contoh jika menggunakan Nginx reverse proxy di domain server:
S3_PUBLIC_URL=https://siketan.ngawikab.go.id/storage
# Atau jika staging lokal port 8089:
# S3_PUBLIC_URL=http://localhost:8089/storage

# Fallback legacy ImageKit (cadangan)
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

## 6. Langkah 4: Alur Ekstraksi & Migrasi Gambar

Karena folder `extracted_images` di-ignore dari Git agar tidak membebani repository, pilih salah satu alur di bawah ini sesuai kenyamanan Anda:

---

### Opsi A: Ekstraksi di Lokal (PC/Mac) lalu Transfer ke Server (Direkomendasikan)
*Gunakan opsi ini jika koneksi internet di laptop Anda lebih stabil atau Anda sudah memiliki folder `backend/extracted_images/` di lokal.*

#### 1. Jalankan ekstraksi di laptop/PC lokal (jika belum ada):
```bash
cd backend
npm run extract:images   # atau: bun run extract:images
```
*(Menghasilkan folder `backend/extracted_images/` berisi 1.213 file foto dan `files_manifest.json`)*.

#### 2. Kompres folder hasil ekstraksi di laptop:
```bash
cd backend
tar -czvf extracted_images.tar.gz extracted_images/
```

#### 3. Kirim file arsip ke server menggunakan `scp` atau `rsync`:
```bash
scp extracted_images.tar.gz user@ip-server:/path/to/siketan-production/backend/
```

#### 4. Di server: Buka ekstrak file arsip:
```bash
cd /path/to/siketan-production/backend/
tar -xzvf extracted_images.tar.gz
rm extracted_images.tar.gz
```

#### 5. Di server: Unggah ke SeaweedFS S3:
```bash
npm run migrate:s3
```
*Skrip akan otomatis membaca `extracted_images/files_manifest.json` dan mengunggah seluruh foto ke bucket SeaweedFS.*

---

### Opsi B: Trik Singkat (Direct Volume Transfer - Paling Cepat!)
*Jika Anda sudah menjalankan SeaweedFS di lokal laptop dan 1.213 file sudah masuk ke storage:*

Data fisik SeaweedFS tersimpan di folder `./seaweedfs/data`. Anda cukup meng-copy folder data tersebut ke server:
```bash
# 1. Di laptop, arsipkan folder data:
tar -czvf seaweedfs-data.tar.gz seaweedfs/data/

# 2. Kirim ke server:
scp seaweedfs-data.tar.gz user@ip-server:/path/to/siketan-production/

# 3. Di server:
tar -xzvf seaweedfs-data.tar.gz
# Lalu jalankan container SeaweedFS. File langsung 100% terbaca tanpa perlu upload ulang!
```

---

### Opsi C: Ekstraksi Langsung di Server
*Gunakan opsi ini jika server Anda memiliki koneksi internet langsung ke ImageKit:*

Cukup jalankan dua perintah ini berurutan di server:
```bash
cd backend

# 1. Unduh dari ImageKit ke disk server:
npm run extract:images

# 2. Upload dari disk server ke SeaweedFS S3:
npm run migrate:s3
```

---

### Tahap Akhir: Update URL di Database MySQL
Setelah file berhasil masuk ke SeaweedFS, perbarui URL di database:
```bash
cd backend
npm run update:urls   # atau: bun run update:urls
```
Skrip ini akan mencari semua URL lama `https://ik.imagekit.io/hw6fintvt1/...` pada tabel `beritatanis`, `datapetanis`, `eventtanis`, `datapenyuluhs`, dll., lalu menggantinya ke URL S3 baru.

---

## 7. Langkah 5: Cara Memantau & Memonitoring File di SeaweedFS

Untuk memastikan file-file benar-benar sudah tersimpan di SeaweedFS dan dapat diakses dengan baik, Anda dapat menggunakan beberapa metode monitoring berikut:

---

### Metode 1: Skrip Monitoring Otomatis (`npm run check:s3`) ⭐ *(Paling Cepat)*
Kami telah menyediakan skrip pemeriksa storage otomatis di [backend/helpers/check-s3-stats.js](file:///Users/user/Data/siketan-production/backend/helpers/check-s3-stats.js).

Jalankan di terminal server:
```bash
cd backend
npm run check:s3
```

**Output yang Dihasilkan:**
```text
========================================================
📊 SeaweedFS S3 Storage Monitor & File Inspector
Endpoint   : http://127.0.0.1:8333
Bucket     : siketan
Public URL : http://127.0.0.1:8333
========================================================

🔍 Memindai seluruh file di bucket..... selesai!

📦 Status Penyimpanan S3:
- Total Objek/File : 1.216 file
- Total Kapasitas  : 362.46 MB
--------------------------------------------------------

🔎 Sampel 5 File Teratas & Uji Akses Publik:
[1] IMG-1686081260856_CeeYMBqUZ.jpg
    Ukuran : 24.96 KB
    URL    : http://127.0.0.1:8333/siketan/IMG-1686081260856_CeeYMBqUZ.jpg
    Status : HTTP 200 OK

[2] IMG-1686110085187_Ik7LxLqsC.jpg
    Ukuran : 24.96 KB
    URL    : http://127.0.0.1:8333/siketan/IMG-1686110085187_Ik7LxLqsC.jpg
    Status : HTTP 200 OK
...
========================================================
✅ Semua verifikasi selesai. Penyimpanan berjalan normal!
========================================================
```

---

### Metode 2: Web Filer GUI (Browser - Paling Mudah & Visual) 🌐
SeaweedFS memiliki web explorer bawaan yang sangat ringan dan mudah digunakan.

1. Buka browser dan akses port Filer (Port 8888):
   ```
   http://<IP-SERVER-ANDA>:8888/
   ```
2. Atau langsung buka direktori bucket `siketan`:
   ```
   http://<IP-SERVER-ANDA>:8888/buckets/siketan/
   ```
3. **Fitur di Web GUI**:
   - Menampilkan daftar seluruh file foto secara alfabetis.
   - Menampilkan ukuran file (*File Size*) dan waktu unggah.
   - Anda bisa **mengklik nama file foto** untuk langsung melihat pratinjau (*preview*) foto di browser.

*(Tips: Jika port 8888 ditutup firewall, Anda bisa menggunakan SSH Tunneling dari laptop: `ssh -L 8888:localhost:8888 user@ip-server`, lalu buka `http://localhost:8888/buckets/siketan/` di browser laptop).*

---

### Metode 3: Master Dashboard & Volume Stats
Untuk memantau performa disk, free space, dan jumlah volume storage:

Buka di browser:
```
http://<IP-SERVER-ANDA>:9333/
```
Dashboard ini menampilkan:
* **Topology**: Data center & rack storage.
* **Volume Servers**: Status kapasitas harddisk yang terpakai vs kapasitas bebas.
* **Total File Count**: Jumlah total file yang tersimpan.

---

### Metode 4: Menggunakan Desktop S3 Client (Cyberduck / FileZilla)
Anda bisa menggunakan aplikasi GUI S3 client populer seperti **Cyberduck** atau **FileZilla**:

1. Buka **Cyberduck** $\rightarrow$ Klik **Open Connection**.
2. Pilih protokol: **Amazon S3**.
3. Masukkan konfigurasi:
   - **Server**: `<IP-SERVER-ANDA>`
   - **Port**: `8333`
   - **Access Key ID**: `siketan_s3_key`
   - **Secret Access Key**: `siketan_s3_secret`
4. Anda akan melihat bucket `siketan` seperti membuka Google Drive / Explorer, lengkap dengan fitur drag-and-drop, delete, dan download file.

---

### Metode 5: Menggunakan AWS CLI
Jika di server terpasang AWS CLI:
```bash
# Menampilkan 20 file pertama di bucket siketan
aws s3 ls s3://siketan/ --endpoint-url http://localhost:8333 | head -n 20

# Menghitung total file di dalam bucket
aws s3 ls s3://siketan/ --endpoint-url http://localhost:8333 | wc -l
```

---

## 8. Panduan Operasional & Backup

### Lokasi Data Fisik Persisten:
Semua file foto tersimpan secara persisten di:
- Path host: `./seaweedfs/data/`
- Docker volume: `seaweedfs_data`

### Cara Backup Rutin Storage SeaweedFS:
Lakukan backup file `.dat` dan `.idx` secara berkala:
```bash
# Backup seluruh data foto ke file arsip terkompresi
tar -czvf seaweedfs-backup-$(date +%F).tar.gz ./seaweedfs/data
```

### Cara Memulihkan (*Restore*) dari Backup:
```bash
# 1. Stop container
docker-compose stop seaweedfs

# 2. Ekstrak data backup
tar -xzvf seaweedfs-backup-YYYY-MM-DD.tar.gz

# 3. Nyalakan kembali container
docker-compose start seaweedfs
```
