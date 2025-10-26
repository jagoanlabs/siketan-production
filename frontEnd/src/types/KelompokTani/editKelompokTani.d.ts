// types/editKelompokTani.types.ts
export interface KelompokDetail {
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
  kecamatanData: {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
  };
  desaData: {
    id: number;
    nama: string;
    kecamatanId: number;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface KelompokDetailResponse {
  message: string;
  data: KelompokDetail;
}

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

export interface UpdateKelompokData {
  gapoktan: string;
  namaKelompok: string;
  kecamatanId: number;
  desaId: number;
}

export interface UpdateKelompokResponse {
  message: string;
  success: boolean;
  data?: any;
}
