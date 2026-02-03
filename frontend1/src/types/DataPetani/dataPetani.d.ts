// DataPetani Types based on API response
export interface DataPetaniAccount {
  id: number;
  email: string | null;
  no_wa: string;
  nama: string;
  password: string | null;
  pekerjaan: string | null;
  peran: "petani";
  foto: string | null;
  accountID: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface DataPetaniItem {
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
  kelompok: any | null;
  dataPenyuluh: any | null;
  tbl_akun: DataPetaniAccount;
  kecamatanData: KecamatanData;
  desaData: DesaData;
}

export interface DataPetaniResponse {
  message: string;
  data: DataPetaniItem[];
  total: number;
  currentPages: number;
  maxPages: number;
  limit: number;
  from: number;
  to: number;
}

export interface DataPetaniQueryParams {
  page?: number;
  limit?: number;
  verified?: string;
  search?: string;
  sortBy?: string;
  sortType?: "ASC" | "DESC";
}

export interface DataPetaniMetaResponse {
  message: string;
  data: {
    totalPetani: number;
    totalVerified: number;
    totalUnverified: number;
  };
}

// Utility functions
export const getVerificationColor = (
  isVerified: boolean,
): "success" | "warning" => {
  return isVerified ? "success" : "warning";
};

export const getVerificationLabel = (isVerified: boolean): string => {
  return isVerified ? "Terverifikasi" : "Belum Verifikasi";
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "-";

  // Format phone number with proper spacing
  return phone.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3");
};
