// types/Statistika/detailStatistika.d.ts
export interface StatistikaDetailData {
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
  kelompok: {
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
  };
}

export interface StatistikaDetailResponse {
  message: string;
  data: StatistikaDetailData;
}

export interface KelompokTaniDetailData {
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

export interface KelompokTaniDetailResponse {
  message: string;
  kelompokTani: KelompokTaniDetailData;
}

// Helper types for display
export interface StatistikaMetrics {
  totalLuasLahan: number;
  totalPrakiraanLuasPanen: number;
  totalPrakiraanHasilPanen: number;
  totalRealisasiLuasPanen: number;
  totalRealisasiHasilPanen: number;
  selisihLuasPanen: number;
  selisihHasilPanen: number;
  persentaseRealisasiLuas: number;
  persentaseRealisasiHasil: number;
}

export interface DetailStatistikaDisplayData {
  statistika: StatistikaDetailData;
  kelompokTani: KelompokTaniDetailData;
  metrics: StatistikaMetrics;
  status: {
    isPrakiraanComplete: boolean;
    isRealisasiComplete: boolean;
    isOverdue: boolean;
  };
}
