export interface KelompokData {
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
}

export interface DataTanaman {
  id: number;
  kategori: string;
  komoditas: string;
  periodeTanam: string;
  luasLahan: number;
  prakiraanLuasPanen: number;
  prakiraanHasilPanen: number;
  prakiraanBulanPanen: string;
  realisasiLuasPanen: number;
  realisasiHasilPanen: number;
  realisasiBulanPanen: string;
  createdAt: string;
  updatedAt: string;
  fk_kelompokId: number;
  kelompok: KelompokData;
}

export interface TanamanApiResponse {
  message: string;
  data: {
    data: DataTanaman[];
    total: number;
    currentPages: number;
    limit: number;
    maxPages: number;
    from: number;
    to: number;
    sortBy: string;
    sortType: string;
  };
}

export interface TanamanQueryParams {
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortType?: "ASC" | "DESC";
  poktan_id?: string | number;
  isExport?: boolean;
}
