export interface RegisterPayload {
  no_wa: string;
  nama: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    nama: string;
    email: string;
    no_wa: string;
    role: string;
  };
}
