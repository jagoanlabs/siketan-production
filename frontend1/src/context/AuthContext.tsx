import { createContext, useState, ReactNode, useMemo, useEffect } from "react";

import { User } from "@/types/user";
import { RoleHelper } from "@/helpers/RoleHelper/roleHelpers";
// import { PERMISSIONS } from "@/helpers/RoleHelper/constants/permission";
// Context value
interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;

  // RBAC methods
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isAdmin: () => boolean;
  isOperator: () => boolean;
  isPenyuluh: () => boolean;
  isPenyuluhSwadaya: () => boolean;
  isPetani: () => boolean;
  canManageData: () => boolean;
  canApproveData: () => boolean;
  getUserRoleType: () => string;
  getUserPermissions: () => string[];
}

// Default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error("AuthContext: Error parsing stored user:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_id", userData.id.toString());
    localStorage.setItem("token", token);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");

    setUser(null);
  };

  const isAuthenticated = useMemo(() => {
    const hasUser = !!user;
    const hasToken = !!localStorage.getItem("token");

    return hasUser && hasToken;
  }, [user]);

  // RBAC Methods
  const hasPermission = (permission: string): boolean => {
    return RoleHelper.hasPermission(user, permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return RoleHelper.hasAnyPermission(user, permissions);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return RoleHelper.hasAllPermissions(user, permissions);
  };

  const isAdmin = (): boolean => {
    return RoleHelper.isAdmin(user);
  };

  const isOperator = (): boolean => {
    return RoleHelper.isOperator(user);
  };

  const isPenyuluh = (): boolean => {
    return RoleHelper.isPenyuluh(user);
  };

  const isPenyuluhSwadaya = (): boolean => {
    return RoleHelper.isPenyuluhSwadaya(user);
  };

  const isPetani = (): boolean => {
    return RoleHelper.isPetani(user);
  };

  const canManageData = (): boolean => {
    return RoleHelper.canManageData(user);
  };

  const canApproveData = (): boolean => {
    return RoleHelper.canApproveData(user);
  };

  const getUserRoleType = (): string => {
    return RoleHelper.getUserRoleType(user);
  };

  const getUserPermissions = (): string[] => {
    return RoleHelper.getUserPermissions(user);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      isLoading,

      // RBAC methods
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      isAdmin,
      isOperator,
      isPenyuluh,
      isPenyuluhSwadaya,
      isPetani,
      canManageData,
      canApproveData,
      getUserRoleType,
      getUserPermissions,
    }),
    [user, isAuthenticated, isLoading],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <p className="ml-4 text-lg">Loading...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
