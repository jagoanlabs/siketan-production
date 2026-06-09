// types/Statistika/editStatistika.d.ts
import { KOMODITAS_OPTIONS } from "./statistika.d";

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

export interface KelompokTaniResponse {
  message: string;
  kelompokTani: KelompokTaniData;
}

export interface EditStatistikaFormData {
  kategoriTanaman: "pangan" | "perkebunan" | "jenis_sayur" | "buah";
  jenisTanaman: "semusim" | "tahunan";
  komoditasSemusim: string;
  komoditasTahunan: string;
  periodeTanam: string;
  luasLahanTanam: number;
  prakiraanLuasPanen: number;
  prakiraanHasilPanen: number;
  prakiraanBulanPanen: string;
  realisasiLuasPanen: number | null;
  realisasiHasilPanen: number | null;
  realisasiBulanPanen: string;
  fk_kelompokId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Interface untuk payload API update (sesuai dengan requirement)
export interface UpdateStatistikaPayload {
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

// Helper function to determine jenis tanaman from komoditas
export const determineJenisTanaman = (
  kategori: string,
  komoditas: string,
): "semusim" | "tahunan" => {
  const normalizedKategori = kategori === "sayur" ? "jenis_sayur" : kategori;
  const mapping = KOMODITAS_OPTIONS[normalizedKategori as keyof typeof KOMODITAS_OPTIONS];

  if (!mapping) return "semusim";

  // Check if komoditas is in semusim
  if ((mapping.semusim as string[]).includes(komoditas)) return "semusim";
  if ((mapping.tahunan as string[]).includes(komoditas)) return "tahunan";

  // Default fallback
  return "semusim";
};
