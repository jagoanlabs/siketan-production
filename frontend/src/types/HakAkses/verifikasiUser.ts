export interface VerifikasiUserData {
  id: number;
  nama: string;
  peran: string;
  no_wa: string;
  email: string | null;
  isVerified: boolean;
  dataPetani: {
    NIK: string;
  } | null;
}

export interface VerifikasiUserQueryParams {
  page: number;
  limit: number;
  search?: string;
  sort?: "verified_desc" | "verified_asc"; // New sort parameter
}

export interface VerifikasiUserResponse {
  message: string;
  data: VerifikasiUserData[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface VerifikasiActionResponse {
  message: string;
  success?: boolean;
}
