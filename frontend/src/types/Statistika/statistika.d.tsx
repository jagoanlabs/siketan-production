// types/statistika/index.ts
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
}

export interface StatistikaData {
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
  kelompok: Kelompok;
}

export interface StatistikaResponse {
  message: string;
  data: {
    data: StatistikaData[];
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

export interface CreateStatistikaFormData {
  kategoriTanaman: "pangan" | "perkebunan" | "jenis_sayur" | "buah";
  jenisTanaman: "semusim" | "tahunan";
  komoditasSemusim: string;
  komoditasTahunan: string;
  periodeTanam: string;
  luasLahanTanam: number;
  prakiraanLuasPanen: number;
  prakiraanHasilPanen: number;
  prakiraanBulanPanen: string;
  fk_kelompokId: number;
}

// Interface untuk payload API
export interface CreateStatistikaPayload {
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
  fk_kelompokId: number;
}

export const KOMODITAS_OPTIONS = {
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
    tahunan: ["Tembakau", "Tebu"],
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

export const BULAN_OPTIONS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
