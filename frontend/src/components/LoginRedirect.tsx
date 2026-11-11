import { Navigate } from "react-router-dom";

import { useAuth } from "@/hook/UseAuth";

export const LoginRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard-admin" />;
  }

  return <>{children}</>;
};
