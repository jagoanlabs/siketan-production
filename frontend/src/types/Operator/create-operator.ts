// types/create-operator.types.ts
export interface CreateOperatorFormData {
  nik: string;
  nkk: string;
  nama: string;
  email: string;
  notelp: string;
  alamat: string;
  password: string;
  peran: string;
  foto?: File | null;
}

export interface EditOperatorFormData {
  nik: string;
  nkk: string;
  nama: string;
  email: string;
  notelp: string;
  alamat: string;
  password: string;
  peran: string;
  foto?: File | null;
  currentFoto?: string; // URL foto yang sudah ada
}

export interface CreateOperatorRequest {
  nik: string;
  nkk: string;
  nama: string;
  email: string;
  notelp: string;
  alamat: string;
  password: string;
  peran: string;
}

export interface UpdateOperatorRequest {
  nik: string;
  nkk: string;
  nama: string;
  email: string;
  notelp: string;
  alamat: string;
  password: string;
  peran: string;
}

export interface CreateOperatorResponse {
  status: string;
  message: string;
  data: any;
  newAccount: any;
}

export interface UpdateOperatorResponse {
  message: string;
  data: any;
  accountUpdate: any;
}

export interface OperatorRole {
  value: string;
  label: string;
}

export const OPERATOR_ROLES: OperatorRole[] = [
  { value: "operator super admin", label: "Operator Super Admin" },
  { value: "operator poktan", label: "Operator Poktan" },
  { value: "operator admin", label: "Operator Admin" },
];
