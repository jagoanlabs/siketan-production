interface Product {
  id: number;
  profesiPenjual: string;
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  fotoTanaman: string;
  status: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tbl_akun: Account;
}

interface Account {
  id: number;
  email: string;
  no_wa: string;
  nama: string;
  pekerjaan: string;
  peran: string;
  foto: string | null;
  accountID: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  dataPetani: null;
  dataPenyuluh: Penyuluh;
}

interface Penyuluh {
  id: number;
  nik: string;
  nama: string;
  foto: string | null;
  alamat: string;
  email: string;
  noTelp: string;
  password: string;
  namaProduct: string;
  kecamatan: string;
  desa: string;
  desaBinaan: string;
  kecamatanBinaan: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  kecamatanId: number;
  desaId: number;
}
