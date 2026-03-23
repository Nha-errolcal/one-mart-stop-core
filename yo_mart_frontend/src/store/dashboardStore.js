import { create } from "zustand";
import { request } from "./Configstore";

const useDashboard = create((set, get) => ({
  endpoint: "report/",
  monthlySales: [],
  todaySale: null,

  getMonthlySales: async () => {
    try {
      const { endpoint } = get();
      const res = await request(`${endpoint}monthly_sale`);
      set({ monthlySales: res || [] });
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
      set({ monthlySales: [] });
    }
  },

  getTodaySales: async () => {
    try {
      const { endpoint } = get();
      const res = await request(`${endpoint}day`);
      set({ todaySale: res || null });
    } catch (error) {
      console.error("Error fetching today sales:", error);
      set({ todaySale: null });
    }
  },
}));

export default useDashboard;
