// types/Statistika/editStatistika.d.ts
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
  const KOMODITAS_MAPPING = {
    pangan: {
      semusim: [
        "Padi Konvensional",
        "Padi Ramah Lingkungan",
        "Padi Organik",
        "Jagung",
        "Kedelai",
        "Ubi Jalar",
        "Ubi Kayu",
        "Kacang Tanah",
        "Kacang Hijau",
      ],
      tahunan: [
        "Padi Konvensional",
        "Padi Ramah Lingkungan",
        "Padi Organik",
        "Jagung",
        "Kedelai",
        "Ubi Jalar",
        "Ubi Kayu",
        "Kacang Tanah",
        "Kacang Hijau",
      ],
    },
    perkebunan: {
      semusim: ["Kopi", "Kakao", "Cengkeh", "Teh", "Karet", "Kelapa"],
      tahunan: ["Tembakau", "Tebu", "Perkebunan Tembakau", "Perkebunan Tebu"],
    },
    buah: {
      semusim: ["Melon", "Semangka", "Pisang", "Blewah"],
      tahunan: [
        "Mangga",
        "Durian",
        "Manggis",
        "Alpukat",
        "Rambutan",
        "Jeruk Lemon",
        "Jeruk Nipis",
        "Jeruk Keprok",
        "Jeruk Besar",
        "Nangka",
        "Jambu Biji",
        "Jambu Air",
        "Sukun",
        "Sirsak",
        "Sawo",
        "Duku",
      ],
    },
    jenis_sayur: {
      semusim: [],
      tahunan: [
        "Pare",
        "Gambas",
        "Bayam",
        "Kangkung",
        "Sawi",
        "Kacang Panjang",
        "Timun",
      ],
    },
  };

  const mapping = KOMODITAS_MAPPING[kategori as keyof typeof KOMODITAS_MAPPING];

  if (!mapping) return "semusim";

  // Check if komoditas is in semusim
  if ((mapping.semusim as string[]).includes(komoditas)) return "semusim";
  if ((mapping.tahunan as string[]).includes(komoditas)) return "tahunan";

  // Default fallback
  return "semusim";
};
