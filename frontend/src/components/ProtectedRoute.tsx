import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (location.pathname.startsWith("/admin") || allowedRoles?.includes("SUPER_ADMIN")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith("/worker") || allowedRoles?.includes("WORKER")) {
      return <Navigate to="/worker/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // If trying to access admin console while logged in as customer or worker, route to admin login gateway
    if (allowedRoles.includes("SUPER_ADMIN")) {
      return <Navigate to="/admin/login" replace />;
    }
    // Redirect user to their own authorized dashboard
    if (role === "CUSTOMER") return <Navigate to="/app" replace />;
    if (role === "WORKER") return <Navigate to="/worker" replace />;
    if (role === "SOCIETY_ADMIN") return <Navigate to="/society" replace />;
    if (role === "FEDERATION_ADMIN") return <Navigate to="/federation" replace />;
    if (role === "SUPER_ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

