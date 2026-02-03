// types/petaniRegister.ts

export interface PetaniRegisterRequest {
  NIK: string;
  NKK?: string; // optional, akan diisi dengan NIK jika kosong
  nama: string;
  email?: string; // optional, akan di-generate jika kosong
  alamat: string;
  desa: string;
  desaId?: number;
  kecamatan: string;
  kecamatanId?: number;
  password: string;
  NoWa: string;
  gapoktan: string;
  penyuluh: number; // ID penyuluh
  namaKelompok: string;
  file?: File; // foto KTP/profile
}

export interface PetaniRegisterResponse {
  message: string;
  user: {
    id: number;
    nik: string;
    nkk: string;
    nama: string;
    foto?: string;
    alamat: string;
    desa: string;
    kecamatan: string;
    email: string;
    noTelp: string;
    accountID: string;
    fk_penyuluhId: number;
    fk_kelompokId: number;
    kecamatanId: number;
    desaId: number;
  };
  token: string;
}

export interface Kecamatan {
  id: number;
  nama: string;
}

export interface Desa {
  id: number;
  nama: string;
  kecamatanId: number;
}

export interface Penyuluh {
  id: number;
  nama: string;
  email: string;
  noTelp: string;
}

export interface Gapoktan {
  id: number;
  nama: string;
  desa: string;
}

export interface KelompokTani {
  id: number;
  gapoktan: string;
  namaKelompok: string;
  desa: string;
  kecamatan: string;
  penyuluh: string;
  createdAt: string | null;
  updatedAt: string;
  kecamatanId: number;
  desaId: number;
}

export interface KelompokTaniResponse {
  message: string;
  kelompokTani: KelompokTani[];
}

export interface FormStep {
  title: string;
  description: string;
  fields: string[];
}

export interface ValidationErrors {
  [key: string]: string;
}
