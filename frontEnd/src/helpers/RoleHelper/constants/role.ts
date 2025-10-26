export const ROLES = {
  OPERATOR_SUPER_ADMIN: "operator_super_admin",
  OPERATOR_ADMIN: "operator_admin",
  OPERATOR_POKTAN: "operator_poktan",
  PENYULUH: "penyuluh",
  PENYULUH_SWADAYA: "penyuluh_swadaya",
  PETANI: "petani",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
