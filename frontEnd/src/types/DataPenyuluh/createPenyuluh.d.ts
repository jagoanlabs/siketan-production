// types/create-penyuluh.ts

export interface Kecamatan {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

export interface KecamatanResponse {
  status: string;
  data: Kecamatan[];
}

export interface Desa {
  id: number;
  nama: string;
  kecamatanId: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface DesaResponse {
  status: string;
  data: Desa[];
}

export interface Kelompok {
  id: number;
  gapoktan: string;
  namaKelompok: string;
  desa: string;
  kecamatan: string;
  penyuluh: number | null;
  createdAt: string | null;
  updatedAt: string;
  kecamatanId: number;
  desaId: number;
}

export interface KelompokResponse {
  message: string;
  dataKelompok: Record<string, Kelompok>;
}

export interface CreatePenyuluhData {
  NIP: string;
  nama: string;
  email: string;
  NoWa: string;
  password: string;
  alamat: string;
  kecamatanId: number;
  kecamatan: string;
  desaId: number;
  desa: string;
  kecamatanBinaan: string;
  desaBinaan: string[];
  namaProduct: string;
  selectedKelompokIds: number[];
  foto?: File;
  tipe: string;
}
