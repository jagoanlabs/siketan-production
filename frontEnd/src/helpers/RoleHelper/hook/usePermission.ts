import { RoleHelper } from "../roleHelpers";

import { useAuth } from "@/hook/UseAuth";

export const usePermission = () => {
  const { user } = useAuth();

  return {
    // Permission checks
    hasPermission: (permission: string) =>
      RoleHelper.hasPermission(user, permission),
    hasAnyPermission: (permissions: string[]) =>
      RoleHelper.hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: string[]) =>
      RoleHelper.hasAllPermissions(user, permissions),

    // Role checks
    isAdmin: () => RoleHelper.isAdmin(user),
    isOperator: () => RoleHelper.isOperator(user),
    isPenyuluh: () => RoleHelper.isPenyuluh(user),
    isPenyuluhReguler: () => RoleHelper.isPenyuluhReguler(user),
    isPenyuluhSwadaya: () => RoleHelper.isPenyuluhSwadaya(user),
    isPetani: () => RoleHelper.isPetani(user),

    // Capability checks
    canManageData: () => RoleHelper.canManageData(user),
    canApproveData: () => RoleHelper.canApproveData(user),
    canCreateContent: () => RoleHelper.canCreateContent(user),
    canAccessOwnDataOnly: () => RoleHelper.canAccessOwnDataOnly(user),

    // User info
    getUserRoleType: () => RoleHelper.getUserRoleType(user),
    getAccessLevel: () => RoleHelper.getAccessLevel(user),
    getUserCapabilities: () => RoleHelper.getUserCapabilities(user),
  };
};
