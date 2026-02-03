// types/penyuluh.ts
export interface Penyuluh {
  id: number;
  nik: string;
  nama: string;
  foto: string | null;
  alamat: string;
  email: string;
  noTelp: string;
  password: string | null;
  namaProduct: string | null;
  kecamatan: string;
  desa: string;
  desaBinaan: string | null;
  kecamatanBinaan: string | null;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tipe: string;
  kecamatanId: number;
  desaId: number | null;
  kecamatanData: {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  desaData: {
    id: number;
    nama: string;
    kecamatanId: number;
    type: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  kecamatanBinaanData: Array<{
    id: number;
    penyuluhId: number;
    kecamatanId: number;
    createdAt: string;
    updatedAt: string;
    kecamatan: {
      id: number;
      nama: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
  desaBinaanData: Array<{
    id: number;
    penyuluhId: number;
    desaId: number;
    createdAt: string;
    updatedAt: string;
    desa: {
      id: number;
      nama: string;
      kecamatanId: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

export interface PenyuluhResponse {
  message: string;
  data: Penyuluh[];
  total: number;
  currentPages: string;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface PenyuluhQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
