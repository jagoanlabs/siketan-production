# SIKETAN BE

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roles](#roles)

## Getting Started

### Prerequisites

```bash
# Example:
Node.js
npm install -g nodemon
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Germa-Studio/sikaetan-Be.git
cd sikaetan-Be
```

2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```
OR
```bash
nodemon
```

## Roles
- `super admin`
- `admin`
- `operator`
- `user`

## API Reference
`Under construction`

## Sinkronisasi akun dari `user-new.xlsx`

Hanya `Akun Operator Fix` dan `Akun Penyuluh Fix` yang menjadi daftar akun aktif. Akun super admin yang sudah ada tetap dipertahankan, kecuali tercantum di `Akun yang Dihapus`. Akun lain dihapus permanen (termasuk yang hanya ada di `Data Master`). **Jangan jalankan pada produksi tanpa backup penuh database.**

1. Jalankan dry-run dari direktori `backend`: `bun run sync:users:dry`. Tinjau `data_preview/user_sync_preview.json`, khususnya `allDeletes` dan `conflicts`.
2. Jika ada konflik identitas NIK/email, perbaiki data di sumber dan jalankan ulang dry-run. Eksekusi akan menolak seluruh batch yang masih memiliki konflik.
3. Setelah backup penuh dan verifikasi laporan, eksekusi secara eksplisit: `bun run helpers/sync-user-accounts.js --execute --confirm-purge=DELETE-UNLISTED-ACCOUNTS --backup-confirmed`.

Semua penghapusan dan perubahan akun dibungkus dalam satu transaksi; kegagalan relasi database akan membatalkan transaksi. Foto lama di storage tidak termasuk proses sinkronisasi.
