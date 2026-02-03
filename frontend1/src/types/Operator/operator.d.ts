// types/operator.types.ts
export interface Operator {
  id: number;
  nik: string;
  nkk: string | null;
  nama: string;
  email: string;
  noTelp: string;
  foto: string | null;
  alamat: string;
  accountID: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  akun: Akun;
}
export interface Akun {
  peran: string;
  role: Role;
}
export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperatorResponse {
  message: string;
  data: Operator[];
  total: number;
  currentPages: string;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface OperatorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface OperatorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: Operator | null;
}
