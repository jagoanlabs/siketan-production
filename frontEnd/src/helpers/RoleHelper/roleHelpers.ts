import { ROLES } from "./constants/role";
import { PERMISSIONS, PERMISSION_GROUPS } from "./constants/permission";

import { User } from "@/types/user";

export class RoleHelper {
  // Check if user is admin level
  static isAdmin(user: User | null): boolean {
    if (!user || !user.role) return false;

    return (
      user.role.name === ROLES.OPERATOR_SUPER_ADMIN ||
      user.role.name === ROLES.OPERATOR_POKTAN ||
      user.role.name === ROLES.OPERATOR_ADMIN
    );
  }

  // Check if user is operator level
  static isOperator(user: User | null): boolean {
    if (!user || !user.role) return false;

    return this.isAdmin(user) || user.role.name === ROLES.OPERATOR_POKTAN;
  }

  // Check if user is any type of penyuluh
  static isPenyuluh(user: User | null): boolean {
    if (!user || !user.role) return false;

    return (
      user.role.name === ROLES.PENYULUH ||
      user.role.name === ROLES.PENYULUH_SWADAYA
    );
  }

  // Check if user is reguler penyuluh
  static isPenyuluhReguler(user: User | null): boolean {
    if (!user || !user.role) return false;

    return user.role.name === ROLES.PENYULUH;
  }

  // Check if user is swadaya penyuluh
  static isPenyuluhSwadaya(user: User | null): boolean {
    if (!user || !user.role) return false;

    return user.role.name === ROLES.PENYULUH_SWADAYA;
  }

  // Check if user is petani
  static isPetani(user: User | null): boolean {
    if (!user || !user.role) return false;

    return user.role.name === ROLES.PETANI;
  }

  // Check if user has specific permission
  static hasPermission(user: User | null, permissionName: string): boolean {
    if (!user || !user.role || !user.role.permissions) return false;

    // Cek berdasarkan nama permission
    return user.role.permissions.some(
      (permission) =>
        permission.name === permissionName && permission.is_active === true,
    );
  }

  // Check if user has any permission from a list
  static hasAnyPermission(
    user: User | null,
    permissionNames: string[],
  ): boolean {
    if (!user || !user.role || !user.role.permissions) return false;

    return permissionNames.some((permissionName) =>
      user.role.permissions.some(
        (permission) =>
          permission.name === permissionName && permission.is_active === true,
      ),
    );
  }

  // Check if user has all permissions from a list
  static hasAllPermissions(
    user: User | null,
    permissionNames: string[],
  ): boolean {
    if (!user || !user.role || !user.role.permissions) return false;

    return permissionNames.every((permissionName) =>
      user.role.permissions.some(
        (permission) =>
          permission.name === permissionName && permission.is_active === true,
      ),
    );
  }

  // Check if user has permission from a group
  static hasPermissionGroup(user: User | null, group: string[]): boolean {
    return this.hasAnyPermission(user, group);
  }

  // Get user role type for display
  static getUserRoleType(user: User | null): string {
    if (!user || !user.role) return "Guest";

    switch (user.role.name) {
      case ROLES.OPERATOR_SUPER_ADMIN:
        return "Operator Super Admin";
      case ROLES.OPERATOR_ADMIN:
        return "Operator Admin";
      case ROLES.OPERATOR_POKTAN:
        return "Operator Poktan";
      case ROLES.PENYULUH:
        return "Penyuluh";
      case ROLES.PENYULUH_SWADAYA:
        return "Penyuluh Swadaya";
      case ROLES.PETANI:
        return "Petani";
      default:
        return "Unknown";
    }
  }

  // Get user permissions list (array of permission names)
  static getUserPermissions(user: User | null): string[] {
    if (!user || !user.role || !user.role.permissions) return [];

    return user.role.permissions
      .filter((permission) => permission.is_active === true)
      .map((permission) => permission.name);
  }

  // Check if user can access admin features
  static canAccessAdminFeatures(user: User | null): boolean {
    return this.isAdmin(user);
  }

  // Check if user can manage data
  static canManageData(user: User | null): boolean {
    return this.isOperator(user) || this.isPenyuluhReguler(user);
  }

  // Check if user can approve data
  static canApproveData(user: User | null): boolean {
    return this.isAdmin(user) || this.isPenyuluhReguler(user);
  }

  // Check if user can create content
  static canCreateContent(user: User | null): boolean {
    return this.isOperator(user) || this.isPenyuluhReguler(user);
  }

  // Check if user can access own data only
  static canAccessOwnDataOnly(user: User | null): boolean {
    return this.isPenyuluhSwadaya(user) || this.isPetani(user);
  }

  // Get access level (for UI purposes)
  static getAccessLevel(user: User | null): string {
    if (!user || !user.role) return "guest";

    if (this.isAdmin(user)) return "admin";
    if (this.isOperator(user)) return "operator";
    if (this.isPenyuluh(user)) return "penyuluh";
    if (this.isPenyuluhSwadaya(user)) return "penyuluh_swadaya";
    if (this.isPetani(user)) return "petani";

    return "guest";
  }

  // Get user capabilities summary
  static getUserCapabilities(user: User | null) {
    return {
      roleType: this.getUserRoleType(user),
      canAccessAdmin: this.canAccessAdminFeatures(user),
      canManageData: this.canManageData(user),
      canApproveData: this.canApproveData(user),
      canCreateContent: this.canCreateContent(user),
      accessLevel: this.getAccessLevel(user),
      permissions: this.getUserPermissions(user),
    };
  }
}

// Export constants for easy access
export { ROLES, PERMISSIONS, PERMISSION_GROUPS };
