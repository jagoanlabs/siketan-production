export interface DataSampah {
  id: number;
  user_id: number;
  activity: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  tbl_akun: {
    id: number;
    email: string;
    no_wa: string;
    nama: string;
    password: string;
    pekerjaan: string;
    peran: string;
    foto: string;
    accountID: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SampahQueryParams {
  page: number;
  limit: number;
  search?: string;
}

export interface SampahResponse {
  message: string;
  data: DataSampah[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface RestoreDeleteResponse {
  message: string;
  success: boolean;
}
