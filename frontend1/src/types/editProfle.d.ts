// types/profile.ts

export interface BaseProfileData {
  nik: string;
  email: string;
  whatsapp: string;
  alamat: string;
  desa: string;
  desaId?: number;
  nama: string;
  kecamatan: string;
  kecamatanId?: number;
  password?: string;
  passwordBaru?: string;
  foto?: File | null;
}

export interface PenyuluhProfileData extends BaseProfileData {
  namaProduct?: string;
  kecamatanBinaan?: string;
  desaBinaan?: string;
}

export interface PetaniProfileData extends BaseProfileData {
  nokk: string;
}

export interface OperatorPoktanProfileData extends BaseProfileData {
  baru?: string; // password baru untuk operator poktan
}

export interface ProfileResponse {
  message: string;
  data?: any;
}

export interface ProfileDetail {
  nik: string;
  email: string;
  nama: string;
  no_wa: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  foto: string | null;
  // Specific fields based on role
  nokk?: string; // for petani
  namaProduct?: string; // for penyuluh
  kecamatanBinaan?: string; // for penyuluh
  desaBinaan?: string; // for penyuluh
}
