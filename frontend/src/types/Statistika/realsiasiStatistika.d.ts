// types/Statistika/realisasiStatistika.d.ts
export interface RealisasiStatistikaFormData {
  realisasiLuasPanen: number | null;
  realisasiHasilPanen: number | null;
  realisasiBulanPanen: string;
}

export interface UpdateRealisasiPayload {
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
  fk_kelompokId: number;
  createdAt: string;
  updatedAt: string;
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

export interface RealisasiValidationErrors {
  realisasiLuasPanen?: string;
  realisasiHasilPanen?: string;
  realisasiBulanPanen?: string;
}
