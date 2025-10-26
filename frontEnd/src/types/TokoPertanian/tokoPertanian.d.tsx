// types/TokoPertanian/product.d.ts
export interface ProductData {
  id: number;
  profesiPenjual: "petani" | "penyuluh";
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  fotoTanaman: string;
  status: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tbl_akun: {
    id: number;
    email: string | null;
    no_wa: string;
    nama: string;
    pekerjaan: string;
    peran: "petani" | "penyuluh";
    foto: string | null;
    accountID: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    dataPetani: {
      id: number;
      nik: string;
      nkk: string | null;
      foto: string | null;
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
    } | null;
    dataPenyuluh: {
      id: number;
      nik: string;
      nama: string;
      foto: string | null;
      alamat: string;
      email: string;
      noTelp: string;
      password: string;
      namaProduct: string;
      kecamatan: string;
      desa: string;
      desaBinaan: string;
      kecamatanBinaan: string;
      accountID: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      kecamatanId: number;
      desaId: number;
    } | null;
  };
}

export interface ProductResponse {
  message: string;
  data: ProductData[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface ProductQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface MetaTokoPertanian {
  message: string;
  data: DataMeta;
}

export interface DataMeta {
  totalProduct: number;
  totalProductPetani: number;
  totalProductPenyuluh: number;
}

// Utility functions
export const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const getStatusColor = (
  status: string,
): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes("tersedia") || lowerStatus.includes("ready")) {
    return "success";
  }
  if (lowerStatus.includes("habis") || lowerStatus.includes("kosong")) {
    return "danger";
  }
  if (lowerStatus.includes("terbatas") || lowerStatus.includes("sedikit")) {
    return "warning";
  }

  return "primary";
};

export const getRoleColor = (
  role: "petani" | "penyuluh",
): "primary" | "secondary" => {
  return role === "petani" ? "primary" : "secondary";
};

export const getRoleLabel = (role: "petani" | "penyuluh"): string => {
  return role === "petani" ? "Petani" : "Penyuluh";
};
