/**
 * ProtectedRoute.jsx
 *
 * Two guards in one file:
 *
 * 1. <ProtectedRoute>          — redirect to /login if not authenticated
 * 2. <PermissionRoute route>   — redirect to / (or 403) if user lacks permission for that route
 */

import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { getProfile } from "@/store/profile";
import { getAllowedPermissions } from "@/util/navPermissions";

const ALWAYS_ALLOWED = [
  "/",
  "/account/profile",
  "/account/profile/edit",
  "/about/system",
  "/about/team",
];

export const ProtectedRoute = ({ children }) => {
  const user = useMemo(() => getProfile(), []);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const PermissionRoute = ({
  code,
  children,
  mode = "AND",
  fallback = null,
}) => {
  const user = useMemo(() => getProfile(), []);

  // Extract permission codes from user
  const userCodes = useMemo(() => {
    return user?.permissions?.map((p) => p.code) || [];
  }, [user]);

  const requiredCodes = Array.isArray(code) ? code : [code];

  // ALWAYS ALLOWED (no permission check)
  if (!code) return children;

  const hasPermission =
    mode === "AND"
      ? requiredCodes.every((c) => userCodes.includes(c))
      : requiredCodes.some((c) => userCodes.includes(c));

  if (!hasPermission) {
    return fallback || <Navigate to="/" replace />;
  }

  return children;
};
