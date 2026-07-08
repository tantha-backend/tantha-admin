import api from "../api/api";

const dashboardService = {
  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },

  getAnalyticsDashboard: async () => {
    const res = await api.get("/admin/analytics/dashboard");
    return res.data;
  },

  getRevenueOverview: async () => {
    const res = await api.get("/admin/monetization/overview");
    return res.data;
  },
};

export default dashboardService;
