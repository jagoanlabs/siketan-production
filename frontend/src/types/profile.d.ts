// types/profile.types.ts

export interface TblAkun {
  id: number;
  email: string;
  no_wa: string;
  nama: string;
  password: string;
  pekerjaan: string;
  peran: string;
  foto: string | null;
  accountID: string;
  isVerified: boolean;
  role_id: number;
  createdAt: string;
  updatedAt: string;
}

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
}

export interface KecamatanBinaan {
  id: number;
  penyuluhId: number;
  kecamatanId: number;
  createdAt: string;
  updatedAt: string;
  kecamatan: KecamatanData;
}

export interface DesaBinaan {
  id: number;
  penyuluhId: number;
  desaId: number;
  createdAt: string;
  updatedAt: string;
  desa: DesaData;
}

export interface Kelompok {
  id: number;
  gapoktan: string;
  namaKelompok: string;
  desa: string;
  kecamatan: string;
  penyuluh: string | null;
  kecamatanId: number;
  desaId: number;
}

export interface DataPenyuluh {
  id: number;
  nik: string;
  nama: string;
  foto: string | null;
  alamat: string;
  email: string | null;
  noTelp: string;
  password: string | null;
  namaProduct: string | null;
  kecamatan: string;
  desa: string;
  desaBinaan: string | null;
  kecamatanBinaan: string | null;
  accountID: string;
  kecamatanId: number;
  desaId: number;
  tipe: "reguler" | "swadaya";
  deletedAt: string | null;
  kelompoks: Kelompok[];
}

// Profile Data untuk Penyuluh
export interface PenyuluhProfile {
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
  kecamatanId: number;
  desaId: number;
  tipe: "reguler" | "swadaya";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tbl_akun: TblAkun;
  kecamatanData: KecamatanData;
  desaData: DesaData;
  kecamatanBinaanData: KecamatanBinaan[];
  desaBinaanData: DesaBinaan[];
  kelompoks: Kelompok[];
}

// Profile Data untuk Petani
export interface PetaniProfile {
  id: number;
  nik: string;
  nkk: string;
  foto: string;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  password: string;
  email: string;
  noTelp: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_penyuluhId: number;
  fk_kelompokId: number;
  kecamatanId: number;
  desaId: number;
  tbl_akun: TblAkun;
  kelompoks: Kelompok[];
  dataPenyuluh: DataPenyuluh;
  kecamatanData: KecamatanData;
  desaData: DesaData;
}

// Profile Data untuk Operator
export interface OperatorProfile {
  id: number;
  nik: string;
  nkk: string;
  nama: string;
  email: string;
  noTelp: string;
  foto: string;
  alamat: string;
  accountID: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  tbl_akun: TblAkun;
}

// Union type untuk semua jenis profile
export type ProfileData = PenyuluhProfile | PetaniProfile | OperatorProfile;

export interface ProfileResponse {
  message: string;
  data: ProfileData;
}

// Helper types untuk role detection
export type UserRole =
  | "penyuluh"
  | "petani"
  | "operator poktan"
  | "operator super admin";
