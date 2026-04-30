import { create } from "zustand";
import { request } from "./Configstore";
import { message } from "antd";

const usePermission = create((set) => ({
  loading: false,
  dataPermission: null,

  getAllPermission: async () => {
    try {
      set({ loading: true });
      const result = await request("permission", "get");
      if (result?.success) {
        set({ dataPermission: result });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  registerPermissionToRole: async (userId, role_ids) => {
    try {
      if (!userId) return message.error("Missing user id");
      if (!Array.isArray(role_ids))
        return message.error("role_ids must be array");

      const result = await request(`users/${userId}/sync-roles`, "POST", {
        role_ids,
      });

      if (result?.success || result?.code === 201) {
        message.success("បានផ្ដល់តួនាទីទៅអ្នកប្រើប្រាស់ជោគជ័យ");
        return true;
      } else {
        message.error(result?.message || "Failed to assign roles");
        return false;
      }
    } catch (error) {
      console.error(error);
      message.error("Server error");
      return false;
    }
  },

  registerRolePermissionCreate: async (roleId, body) => {
    try {
      if (!roleId) return message.error("Missing role id");

      const result = await request(
        `role/${roleId}/permissions/add`,
        "POST",
        body,
      );

      if (result?.code === 201 && result?.success === true) {
        message.success("បានរក្សាទុកសិទ្ធជោគជ័យ");
        return true;
      }
    } catch (error) {
      console.error(error);
      message.error("Server error");
      return false;
    }
  },
}));

export default usePermission;
