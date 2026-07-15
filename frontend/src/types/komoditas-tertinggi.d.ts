// types/tanaman-petani.types.ts

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

export interface DataPenyuluh {
  id: number;
  nik: string;
  nama: string;
  foto: string;
  alamat: string;
  email: string;
  noTelp: string;
  kecamatan: string;
  desa: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  kecamatanId: number | null;
  desaId: number | null;
  kecamatanData: KecamatanData;
  desaData: DesaData;
}

export interface Kelompok {
  id: number;
  gapoktan: string;
  namaKelompok: string;
  desa: string;
  kecamatan: string;
  penyuluh: string | null;
  createdAt: string | null;
  updatedAt: string;
  kecamatanId: number;
  desaId: number;
  kecamatanData: KecamatanData;
  desaData: DesaData;
  dataPenyuluh: DataPenyuluh;
}

export interface DataTanamanTop {
  id: number;
  kategori: string;
  komoditas: string;
  periodeTanam: string;
  luasLahan: number;
  prakiraanLuasPanen: number;
  prakiraanHasilPanen: number;
  prakiraanBulanPanen: string;
  realisasiLuasPanen: number | null;
  realisasiHasilPanen: number | null;
  realisasiBulanPanen: string | null;
  createdAt: string;
  updatedAt: string;
  fk_kelompokId: number;
  kelompok: Kelompok;
}

export interface DataTanamanTopResponse {
  message: string;
  data: DataTanamanTop[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface TanamanPetaniParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  type?: "prakiraan" | "realisasi";
}
