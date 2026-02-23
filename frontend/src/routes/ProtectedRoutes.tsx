import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/hook/UseAuth";
import { ROLES, RoleType } from "@/helpers/RoleHelper/constants/role";
import { PermissionType } from "@/helpers/RoleHelper/constants/permission";

interface ProtectedRouteProps {
  requiredRole?:
    | RoleType
    | "admin"
    | "operator"
    | "penyuluh"
    | "penyuluh_swadaya"
    | "petani";
  requiredRoles?: RoleType[];
  requiredPermissions?: PermissionType[];
  requireAllPermissions?: boolean;
}

const ProtectedRoute = ({
  requiredRoles,
  requiredPermissions,
  requireAllPermissions = false,
}: ProtectedRouteProps = {}) => {
  const {
    isAuthenticated,
    isLoading,
    isAdmin,
    isOperator,
    isPenyuluh,
    isPenyuluhSwadaya,
    isPetani,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  // Redirect ke login jika tidak authenticated
  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  // Cek role requirement
  if (requiredRoles && requiredRoles.length > 0) {
    let hasRequiredRole = false;

    for (const role of requiredRoles) {
      switch (role) {
        case ROLES.OPERATOR_ADMIN:
        case ROLES.OPERATOR_SUPER_ADMIN:
          if (isAdmin()) {
            hasRequiredRole = true;
          }
          break;
        case ROLES.OPERATOR_POKTAN:
          if (isOperator()) {
            hasRequiredRole = true;
          }
          break;
        case ROLES.PENYULUH:
          if (isPenyuluh()) {
            hasRequiredRole = true;
          }
          break;
        case ROLES.PENYULUH_SWADAYA:
          if (isPenyuluhSwadaya()) {
            hasRequiredRole = true;
          }
          break;
        case ROLES.PETANI:
          if (isPetani()) {
            hasRequiredRole = true;
          }
          break;
        default:
          break;
      }

      if (hasRequiredRole) break; // Cukup satu yang cocok
    }

    if (!hasRequiredRole) {
      return <Navigate replace to="/unauthorized" />;
    }
  }

  // Cek multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    let hasRequiredPermissions = false;

    if (requireAllPermissions) {
      hasRequiredPermissions = hasAllPermissions(requiredPermissions);
    } else {
      hasRequiredPermissions = hasAnyPermission(requiredPermissions);
    }

    if (!hasRequiredPermissions) {
      return <Navigate replace to="/unauthorized" />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
