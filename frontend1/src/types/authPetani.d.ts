// types/auth.ts

export interface PetaniLoginRequest {
  NIK: string;
  password: string;
}

export interface PetaniLoginResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    nik: string;
    nkk: null;
    foto: null;
    nama: string;
    alamat: string;
    desa: string;
    kecamatan: string;
    password: null;
    email: null;
    noTelp: string;
    accountID: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    fk_penyuluhId: null;
    fk_kelompokId: null;
    kecamatanId: number;
    desaId: number;
  };
  needSetPassword?: boolean; // flag untuk redirect ke set password
}

export interface PetaniSetPasswordRequest {
  NIK: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  response: {
    data: {
      message: string;
    };
  };
  statusCode?: number;
}
