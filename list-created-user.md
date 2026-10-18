# Daftar Akun User yang Terbuat dari Sinkronisasi (`sync:users:alter`)

Dokumen ini berisi daftar seluruh akun pengguna (**23 akun**) yang berhasil dibuat (*inserted*) ke dalam tabel `tbl_akun` dan tabel profil terkait (`dataOperators`, `dataPenyuluhs`) melalui proses sinkronisasi database dari file [user-new.xlsx](file:///Users/user/Data/siketan-production/user-new.xlsx).

---

## 📌 Ringkasan Sinkronisasi

- **Total Akun Baru Terbuat**: **23 Akun**
  - **Operator Admin BPP**: 9 Akun (Role ID: 4)
  - **Penyuluh Pertanian**: 14 Akun (Role ID: 3)
- **Status Akun**: Seluruh akun baru diatur dengan status `isVerified = 1` (Terverifikasi aktif).
- **Kata Sandi Default**: `Siketan2026!` (dihash menggunakan `bcrypt`).

---

## 🏢 1. Kategori: Operator Admin BPP (9 Akun)

Akun-akun ini berasal dari sheet **"Akun Operator Fix"** untuk melengkapi 19 BPP Kecamatan resmi di Kabupaten Ngawi:

| No | ID DB | Nama Lengkap | Email BPP | No. WhatsApp | NIK | Alamat / Wilayah BPP | Account ID (UUID) |
|---|---|---|---|---|---|---|---|
| 1 | 4609 | **Rika Indra Sukmana** | `bppkarangjati@gmail.com` | `081332002057` | `3521077101950001` | Jalan raya ngawi-caruban, Desa Sidokerto, Kec. Karangjati | `0a9573fe-b664-473a-9c81-85b42cb67c8d` |
| 2 | 4610 | **Dyah Rahmatus Safira** | `jogorogobpp@gmail.com` | `085784368613` | `3520085512980001` | Jl. Raya Jogorogo - Ngrambe, Desa Jogorogo, Kec. Jogorogo | `8634c735-aaef-4c26-8cc3-160fe9783683` |
| 3 | 4611 | **Anisa Fadillah** | `bppkaranganyarngw@gmail.com` | `085265217142` | `1376014207000005` | Jl. Raya Sriwedari, Dsn Wonoboyo, Desa Sriwedari, Kec. Karanganyar | `04c22312-834d-4b12-88c1-b92723414373` |
| 4 | 4612 | **Fahmi Pawila Inuyasa** | `paronbpp@gmail.com` | `085850689033` | `3521091706980001` | Jl. Raya Paron No.26, Jati, Jambangan, Kec. Paron | `bea65b67-1bc7-48da-bb71-8574fb6152c5` |
| 5 | 4613 | **Kharisma Syafri Ayuni** | `bppkendalngawi@gmail.com` | `085924060413` | `3521036206980002` | Jl. Raya Jogorogo - Kendal No.13, Pucanganom, Kec. Kendal | `c1dbd72d-d29d-4d7d-b7c8-13416e3df99e` |
| 6 | 4614 | **Shella Anggita Pramestika** | `bppmantingan@gmail.com` | `082334470456` | `3314104502010011` | Jl. Raya Ngawi-Solo Km. 19, Desa Mantingan, Kec. Mantingan | `cd317647-2031-4238-a776-af9aaa1d4261` |
| 7 | 4615 | **Arie Widya Pramudyawardhani** | `bpppitoe@gmail.com` | `081235882199` | `3521095908900001` | Desa Ngancar, Kec. Pitu | `c2611e1c-383a-4d54-9e99-5cacfb95df86` |
| 8 | 4616 | **Heriyanto** | `bpppadas2020@gmail.com` | `085790570462` | `3521081305900002` | Jl. Raya Ngawi-Caruban, Kec. Padas | `75397fa2-9e43-4f6b-87ed-7a82a352fa90` |
| 9 | 4617 | **Tri Sujatmiko, S.P.** | `bppwidodaren.official@gmail.com` | `085159259788` | `3521090205970002` | Widodaren Kidul, Widodaren, Kec. Widodaren | `7b39baee-893d-4429-b941-61b7263f0ce9` |

---

## 🌾 2. Kategori: Penyuluh Pertanian (14 Akun)

Akun-akun ini berasal dari sheet **"Akun Penyuluh Fix"** yang belum terdaftar di database sebelumnya:

| No | ID DB | Nama Lengkap | Email Akun | No. WhatsApp | NIK | Peran | Account ID (UUID) |
|---|---|---|---|---|---|---|---|
| 1 | 4599 | **FITRI LAELA RAHMAWATI, S.P.** | `fitrilaelarahmawati@gmail.com` | `089652316174` | `3314015802990001` | Penyuluh | `a809b61a-e9bf-4249-998d-c0e6a48a4310` |
| 2 | 4600 | **ICHSAN JATI PAMUNGKAS, S.P.** | `ichsanjati@gmail.com` | `089610553804` | `3311102506990002` | Penyuluh | `4e32d79c-df85-41af-909b-ad96bc96e0c3` |
| 3 | 4601 | **ISMAWATI ZULFA SANTIKA, S.P.** | `ismawatizulfas@gmail.com` | `08156924589` | `3314016609970001` | Penyuluh | `86dccdfb-e5e6-450b-8677-91ba2d509acf` |
| 4 | 4602 | **LATIFAH AMALIA RENGGANIS, S.P.** | `latifahamaliarengganis@gmail.com` | `082328370125` | `3314014909980001` | Penyuluh | `909da737-fdf5-4765-9f00-01a058a6835c` |
| 5 | 4603 | **MARATUS SOFIYAH, S.P.** | `maratussofi16@gmail.com` | `087816086989` | `3521095603990001` | Penyuluh | `2555deae-b485-455a-b146-d7acd69f22b9` |
| 6 | 4604 | **MAULANA THARIQ PRAJADUTA SUTIKNO, S.P.** | `thariqmaulana71@gmail.com` | `089848814006` | `3314010605010005` | Penyuluh | `3d00c9f2-d2e3-4149-9ff5-6bafc2f83163` |
| 7 | 4605 | **SALSABILA AYUNIS MUHTAR** | `salsabilaayunis.15@gmail.com` | `0895414985913` | `3318195506010001` | Penyuluh | `91ed93bc-df6f-4b85-ad2f-8a65f56de229` |
| 8 | 4606 | **SETIANI DARMASTUTI, S.P.** | `setiani96@gmail.com` | `089679274924` | `3521095711960001` | Penyuluh | `6c1e34f5-3048-4e88-9a41-22b39fc81e5c` |
| 9 | 4607 | **TAZKIA NURFAUZIANA, S.P.** | `tazkianurfauziana17@gmail.com` | `08815587630` | `3520055703010001` | Penyuluh | `2e37c2a1-de42-4e7c-bfbe-d496aeae8273` |
| 10 | 4608 | **WINDA IKA PERMATASARI, S.P.** | `windaikaper@gmail.com` | `085702379547` | `-` | Penyuluh | `c370899d-3946-4e77-bbc2-2725cbd0728f` |
| 11 | 4618 | **SHELLA ANGGITA PRAMESTIKA, S.P.** | `shelashela064@gmail.com` | `082334470456` | `3314104502010011` | Penyuluh | `2418d520-ef53-4533-a6cb-59d52df1221a` |
| 12 | 4619 | **SRI UTAMI USWATUL HASANAH, S.P.** | `usri3173@gmail.com` | `082229090732` | `3521115202770002` | Penyuluh | `db1507cc-00c8-4807-a690-3b480b8d646a` |
| 13 | 4620 | **TRI SUJATMIKO, S.P.** | `trisujatmiko25@gmail.com` | `085159259788` | `3521090205970002` | Penyuluh | `334d4e2c-af7f-4df6-a1ca-bb1da964a5b6` |
| 14 | 4621 | **WAHYU HARI AHADI, S.S.T., S.Sos., M.Agr.** | `wahyu.ahadi19@gmail.com` | `085814137165` | `3521191907750002` | Penyuluh | `694b64ec-102b-469d-bcf0-9c782ce7a034` |

---

## 🔑 Informasi Login Awal untuk Pengguna Baru

- **URL Login**: `http://localhost:5173/login` (atau URL domain produksi)
- **Username / Email**: Email masing-masing akun di atas.
- **Kata Sandi Sementara**: `Siketan2026!`
- **Catatan Keamanan**: Pengguna disarankan langsung mengganti kata sandi setelah pertama kali login melalui menu **Profil > Ganti Password**.
