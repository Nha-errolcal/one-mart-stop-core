import React from "react";
import { ProtectedRoute, PermissionRoute } from "@/components/ProtectedRoute";

const PR = ({ code, children, mode, fallback }) => (
  <ProtectedRoute>
    <PermissionRoute code={code} mode={mode} fallback={fallback}>
      {children}
    </PermissionRoute>
  </ProtectedRoute>
);

export default PR;
