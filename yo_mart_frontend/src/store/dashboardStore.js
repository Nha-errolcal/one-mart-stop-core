import { create } from "zustand";
import { request } from "./Configstore";

const useDashboard = create((set, get) => ({
  endpoint: "report/",
  monthlySales: [],
  todaySale: null,

  getMonthlySales: async (year, userId) => {
    try {
      const { endpoint } = get();

      const query = new URLSearchParams();
      if (year) query.append("year", year);
      if (userId) query.append("user_id", userId);

      const res = await request(
        `${endpoint}monthly-sales-report?${query.toString()}`,
      );
      if (res.status === 200) {
        set({ monthlySales: res.data || [] });
      }
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
      set({ monthlySales: [] });
    }
  },

  getTodaySales: async (userId) => {
    try {
      const { endpoint } = get();

      const query = userId ? `?user_id=${userId}` : "";

      const res = await request(`${endpoint}order-report-today${query}`);

      set({ todaySale: res || null });
    } catch (error) {
      console.error("Error fetching today sales:", error);
      set({ todaySale: null });
    }
  },
}));

export default useDashboard;
