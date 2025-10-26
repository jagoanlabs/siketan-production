// types/kelompokTani.types.ts
export interface KelompokTaniData {
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

export interface KelompokTaniQueryParams {
  page: number;
  limit: number;
  search?: string;
}

export interface KelompokTaniResponse {
  message: string;
  data: KelompokTaniData[];
  total: number;
  currentPages: string;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface DeleteKelompokResponse {
  message: string;
  success: boolean;
}

export interface UploadResponse {
  message: string;
  success: boolean;
  data?: any;
}
