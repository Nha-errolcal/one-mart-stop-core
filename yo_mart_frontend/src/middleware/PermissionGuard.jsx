import { Navigate, useLocation } from "react-router-dom";
import { getPermission } from "../util/Helper";
import { useMemo } from "react";

const extractAllowedRoutes = (permission) => {
  if (!permission) return new Set();

  const routes = [];

  if (typeof permission === "object" && !Array.isArray(permission)) {
    Object.values(permission).forEach((entry) => {
      if (Array.isArray(entry?.action)) {
        entry.action.forEach((item) => {
          if (item?.web_route) routes.push(item.web_route);
        });
      }
      if (Array.isArray(entry)) {
        entry.forEach((item) => {
          if (item?.web_route) routes.push(item.web_route);
        });
      }
    });
  }

  return new Set(routes);
};

const PermissionGuard = ({ children }) => {
  const { pathname } = useLocation();
  const permission = getPermission();

  const allowedRoutes = useMemo(
    () => extractAllowedRoutes(permission),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(permission)],
  );

  // Not logged in → go to login
  if (!allowedRoutes.size) return <Navigate to="/login" replace />;

  // Logged in but no permission for this route → go to 403
  if (!allowedRoutes.has(pathname)) return <Navigate to="/403" replace />;

  return children;
};

export default PermissionGuard;
