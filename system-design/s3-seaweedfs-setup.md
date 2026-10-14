# Sistem Desain & Panduan Setup: S3 Local Storage (SeaweedFS) - SIKETAN

Dokumen ini mencatat seluruh rancangan arsitektur, konfigurasi container, integrasi backend, dan alur migrasi untuk penggantian **ImageKit** ke **SeaweedFS (S3-Compatible Local Storage)** pada platform Siketan.

---

## 1. Arsitektur & Aliran Akses Storage

```mermaid
flowchart LR
    Browser["Client Browser / Mobile"] -->|GET /storage/siketan/...| Nginx["Nginx Reverse Proxy\n(Port 80 / 8089)"]
    Nginx -->|Proxy Pass| SeaweedS3["SeaweedFS S3 API\n(Port 8333)"]
    Backend["Backend Express API\n(Node.js / Bun)"] -->|@aws-sdk/client-s3\nPutObjectCommand| SeaweedS3
    SeaweedS3 --> FilerVolume["Local Volume Persisten\n(/data)"]
```

---

## 2. Konfigurasi SeaweedFS

### A. File Izin Akses (`seaweedfs/s3.json`)
File konfigurasi identitas S3 untuk SeaweedFS:
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
* **`siketan_admin`**: Kredensial penuh untuk backend mengunggah/menghapus file.
* **`anonymous`**: Izin membaca publik tanpa token, agar tag `<img src="..." />` di frontend dapat merender gambar langsung.

### B. Perintah Menjalankan Container (Podman / Docker)
```bash
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

---

## 3. Integrasi Docker Compose

Tambahkan service `seaweedfs` pada `docker-compose.yml`:
```yaml
services:
  seaweedfs:
    image: chrislusf/seaweedfs:latest
    container_name: siketan_seaweedfs
    restart: unless-stopped
    command: "server -s3 -s3.port=8333 -s3.config=/etc/seaweedfs/s3.json -dir=/data"
    volumes:
      - ./seaweedfs/s3.json:/etc/seaweedfs/s3.json:ro
      - seaweedfs_data:/data
    networks:
      - siketan-network

volumes:
  seaweedfs_data:
```

---

## 4. Konfigurasi Nginx Reverse Proxy

Tambahkan blok lokasi pada `nginx/conf.d/default.conf` dan `nginx/conf.d/siketan.conf`:
```nginx
location /storage/ {
    proxy_pass http://seaweedfs:8333/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 5. Konfigurasi Backend & Environment Variables

### A. Environment Variables (`.env`)
```env
# Storage Driver ('s3' atau 'imagekit')
STORAGE_DRIVER=s3
S3_ENDPOINT=http://127.0.0.1:8333
S3_REGION=us-east-1
S3_ACCESS_KEY=siketan_s3_key
S3_SECRET_KEY=siketan_s3_secret
S3_BUCKET_NAME=siketan
S3_PUBLIC_URL=http://127.0.0.1:8333
```

### B. Modul S3 Storage (`backend/midleware/s3Storage.js`)
Menggunakan `@aws-sdk/client-s3` dengan signature yang kompatibel penuh dengan panggilan ImageKit:
- `upload({ file, fileName })` $\rightarrow$ mengembalikan `{ url, fileId, name }`.
- `delete({ fileId })` $\rightarrow$ menghapus file dari S3 bucket.

### C. Adapter Drop-in (`backend/midleware/imageKit.js`)
Mengarahkan pemanggilan `imageKit.upload` ke driver S3 secara default tanpa perlu mengubah file controller lain.

---

## 6. Skrip Pendukung Migrasi

1. **`backend/helpers/migrate-imagekit-to-s3.js`**:
   - Membaca `backend/extracted_images/files_manifest.json`.
   - Mengunggah 1.213 file lokal ke bucket S3 dengan key nama asli (`item.name`).
   - Dapat dijalankan via `npm run migrate:s3`.
2. **`backend/helpers/update-db-image-urls.js`**:
   - Menjalankan `REPLACE` otomatis pada seluruh tabel (`beritatanis`, `datapetanis`, `tbl_akuns`, dll.) untuk mengubah prefix `https://ik.imagekit.io/hw6fintvt1/` menjadi `${S3_PUBLIC_URL}/${S3_BUCKET_NAME}/`.
