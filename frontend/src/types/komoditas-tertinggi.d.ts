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
}

export interface DataPetani {
  id: number;
  nik: string;
  nkk: string | null;
  foto: string;
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
  kelompok: Kelompok | null;
  kecamatanData: KecamatanData;
  desaData: DesaData;
}

export interface TanamanPetani {
  id: number;
  statusKepemilikanLahan: string;
  luasLahan: string;
  kategori: string;
  jenis: string;
  komoditas: string;
  periodeMusimTanam: string;
  periodeBulanTanam: string;
  prakiraanLuasPanen: number;
  prakiraanProduksiPanen: number;
  prakiraanBulanPanen: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_petaniId: number;
  dataPetani: DataPetani;
}

export interface TanamanPetaniResponse {
  message: string;
  data: TanamanPetani[];
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
}
