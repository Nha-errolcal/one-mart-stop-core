import { create } from "zustand";
import { request } from "./Configstore";
import { message } from "antd";

const useAuth = create((set) => ({
  profileData: null,
  roleData: null,
  userData: [],
  loading: false,

  getProfile: async () => {
    try {
      const res = await request("profile", "get");

      if (res?.success) {
        set({ profileData: res.user });
      }
    } catch (error) {
      console.error(error);
    }
  },

  getAllRole: async () => {
    try {
      set({ loading: true });

      const result = await request("role", "get");

      if (result?.success) {
        set({ roleData: result.data });
      }

      set({ loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  searchUsers: async (keyword) => {
    try {
      set({ loading: true });

      if (!keyword || keyword.trim() === "") {
        set({ userData: [] });
        set({ loading: false });
        return;
      }

      const result = await request(
        `users/find/all_user?query=${keyword}`,
        "GET",
      );

      if (result?.status === "success") {
        set({ userData: result.data });
      } else {
        set({ userData: [] });
      }

      set({ loading: false });
    } catch (error) {
      console.error(error);
      set({ userData: [], loading: false });
    }
  },
}));

export default useAuth;
