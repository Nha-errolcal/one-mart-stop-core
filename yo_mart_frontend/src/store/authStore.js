import { create } from "zustand";
import { request } from "./Configstore";

export const useAuth = create((set, get) => ({
  endPoint: "admin/",
  profileData: null,

  getProfile: async () => {
    try {
      const res = await request("profile", "get");
      if (res.success === true) {
        console.log(res.user.username);

        set({ profileData: res.user });
      } else {
        throw new Error(res.message || "Failed to fetch profile data");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
