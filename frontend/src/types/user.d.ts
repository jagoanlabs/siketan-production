export interface User {
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
  role_id: number;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  petani?: {
    id: number;
    nama: string;
    nik: string;
    alamat: string;
    desa: string;
    kecamatan: string;
    [key: string]: any;
  };
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
  module: string;
  action: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  role_permission: RolePermission;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
  created_at: Date;
  updated_at: Date;
}
