import { Navigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthRole } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: AuthRole;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentRole = useAuthStore((s) => s.role);

  if (!isAuthenticated || currentRole !== role) {
    return <Navigate to={role === "admin" ? "/login" : "/student-login"} replace />;
  }

  return <>{children}</>;
}
