// Types - include here if not in separate file
export interface UserAksesData {
  id: number;
  nama: string;
  email: string | null;
  peran: string;
  no_wa: string;
  accountID?: string;
}

export interface UserAksesQueryParams {
  page: number;
  limit: number;
  search?: string;
}

export interface UserAksesResponse {
  message: string;
  data: UserAksesData[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface UbahPeranRequest {
  id: number;
  roles: string;
}

export interface UbahPeranResponse {
  message: string;
}

export interface MetaPeranRoles {
  operator_super_admin: number;
  penyuluh: number;
  operator_poktan: number;
  operator_admin: number;
  petani: number;
}

export interface MetaPeranResponse {
  message: string;
  totalUser: number;
  roles: MetaPeranRoles;
}

export type UserRole =
  | "petani"
  | "penyuluh"
  | "operator poktan"
  | "operator admin"
  | "operator super admin";

// Updated USER_ROLES with mapping for API response
export const USER_ROLES: {
  value: UserRole;
  label: string;
  apiKey: keyof MetaPeranRoles;
  color: string;
}[] = [
  {
    value: "petani",
    label: "Petani",
    apiKey: "petani",
    color: "success",
  },
  {
    value: "penyuluh",
    label: "Penyuluh",
    apiKey: "penyuluh",
    color: "primary",
  },
  {
    value: "operator poktan",
    label: "Operator Poktan",
    apiKey: "operator_poktan",
    color: "secondary",
  },
  {
    value: "operator admin",
    label: "Operator Admin",
    apiKey: "operator_admin",
    color: "warning",
  },
  {
    value: "operator super admin",
    label: "Operator Super Admin",
    apiKey: "operator_super_admin",
    color: "danger",
  },
];
