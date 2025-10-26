import { ReactNode } from "react";

import { useAuth } from "@/hook/UseAuth";
import { RoleType } from "@/helpers/RoleHelper/constants/role";
import { PermissionType } from "@/helpers/RoleHelper/constants/permission";

interface PermissionWrapperProps {
  permission?: PermissionType;
  permissions?: PermissionType[];
  requireAll?: boolean; // true = AND, false = OR
  role?:
    | RoleType
    | "operator super admin"
    | "operator admin"
    | "operator poktan"
    | "penyuluh"
    | "penyuluh swadaya"
    | "petani";
  children: ReactNode;
}

const PermissionWrapper = ({
  permission,
  permissions,
  requireAll = false,
  role,
  children,
}: PermissionWrapperProps) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isOperator,
    isPenyuluh,
    isPenyuluhSwadaya,
    isPetani,
  } = useAuth();

  let hasAccess = true;

  // Cek permission tunggal
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // Cek multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  // Cek role
  if (role) {
    switch (role) {
      // Role groups (backward compatibility)
      case "operator super admin":
      case "operator admin":
        hasAccess = isAdmin();
        break;
      case "operator poktan":
        hasAccess = isOperator();
        break;
      case "penyuluh":
        hasAccess = isPenyuluh();
        break;
      case "penyuluh swadaya":
        hasAccess = isPenyuluhSwadaya();
        break;
      case "petani":
        hasAccess = isPetani();
        break;
      default:
        hasAccess = false;
    }
  }

  return hasAccess ? <>{children}</> : null;
};

export default PermissionWrapper;
