import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { hasPermission } from "../util/permission.js";

export default function RequirePermission({ code }) {
    const user = useAuthStore((s) => s.user);
    const permissions = useAuthStore((s) => s.permissions);

    console.log(!hasPermission(permissions, code));
    if (!user) return <Navigate to="/login" replace />;

    if (code && !hasPermission(permissions, code)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
