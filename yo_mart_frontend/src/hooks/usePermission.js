import { useAuthStore } from "../store/useAuthStore";
import { hasPermission } from "../util/permission.js";

export const usePermission = () => {
    const permissions = useAuthStore((s) => s.permissions);

    return {
        permissions,
        can: (code) => hasPermission(permissions, code),
    };
};
