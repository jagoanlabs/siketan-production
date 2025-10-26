// types/TokoPertanian/editTokoPertanian.d.ts

export interface EditProductFormData {
  profesiPenjual: string;
  nik: string;
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  status: string;
  fotoTanaman: File | string | null;
}

export interface EditProductFormErrors {
  profesiPenjual?: string;
  nik?: string;
  namaProducts?: string;
  stok?: string;
  satuan?: string;
  harga?: string;
  deskripsi?: string;
  status?: string;
  fotoTanaman?: string;
}

// Product Detail Response Types
export interface KecamatanData {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

export interface DesaData {
  id: number;
  nama: string;
  kecamatanId: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  kecamatan?: KecamatanData;
}

export interface KelompokData {
  id: number;
  gapoktan: string;
  namaKelompok: string;
  desa: string;
  kecamatan: string;
  penyuluh: any;
  createdAt: string | null;
  updatedAt: string;
  kecamatanId: number;
  desaId: number;
}

export interface DataPetani {
  id: number;
  nik: string;
  nkk: string | null;
  foto: string | null;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  password: string | null;
  email: string | null;
  noTelp: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_penyuluhId: number | null;
  fk_kelompokId: number | null;
  kecamatanId: number;
  desaId: number;
  tanamanPetanis?: any[];
  kelompok?: KelompokData;
  kecamatanData?: KecamatanData;
  desaData?: DesaData;
}

export interface KecamatanBinaanData {
  id: number;
  penyuluhId: number;
  kecamatanId: number;
  createdAt: string;
  updatedAt: string;
  kecamatan: KecamatanData;
}

export interface DesaBinaanData {
  id: number;
  penyuluhId: number;
  desaId: number;
  createdAt: string;
  updatedAt: string;
  desa: DesaData;
}

export interface DataPenyuluh {
  id: number;
  nik: string;
  nama: string;
  foto: string | null;
  alamat: string;
  email: string | null;
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
  kecamatanData?: KecamatanData;
  desaData?: DesaData;
  kecamatanBinaanData?: KecamatanBinaanData[];
  desaBinaanData?: DesaBinaanData[];
}

export interface TblAkun {
  id: number;
  email: string | null;
  no_wa: string;
  nama: string;
  password: string | null;
  pekerjaan: string | null;
  peran: string;
  foto: string | null;
  accountID: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  dataPetani: DataPetani | null;
  dataPenyuluh: DataPenyuluh | null;
}

export interface ProductDetail {
  id: number;
  profesiPenjual: string;
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  fotoTanaman: string | null;
  status: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tbl_akun: TblAkun;
}

export interface ProductDetailResponse {
  message: string;
  data: ProductDetail;
}

// Update Product Types
export interface UpdateProductRequest {
  nik: string;
  profesiPenjual: "petani" | "penyuluh";
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  status: string;
  fotoTanaman: File | string | null;
}

export interface UpdateProductResponse {
  message: string;
  data?: any;
}
