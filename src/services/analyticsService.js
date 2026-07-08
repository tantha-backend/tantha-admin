import api from "../api/api";

const analyticsService = {
  getDashboard: async () => {
    const res = await api.get("/admin/analytics/dashboard");
    return res.data;
  },

  getCharts: async (days = 30) => {
    const res = await api.get(`/admin/analytics/charts?days=${days}`);
    return res.data;
  },

  getPlatform: async () => {
    const res = await api.get("/admin/analytics/platform");
    return res.data;
  },

  getTopContent: async (limit = 10) => {
    const res = await api.get(`/admin/analytics/top-content?limit=${limit}`);
    return res.data;
  },

  getGenres: async () => {
    const res = await api.get("/admin/analytics/genres");
    return res.data;
  },

  getLanguages: async () => {
    const res = await api.get("/admin/analytics/languages");
    return res.data;
  },

  getGrowth: async (days = 30) => {
    const res = await api.get(`/admin/analytics/growth?days=${days}`);
    return res.data;
  },

  getStatus: async () => {
    const res = await api.get("/admin/analytics/status");
    return res.data;
  },

  getRevenue: async () => {
    const res = await api.get("/admin/analytics/revenue");
    return res.data;
  },

  getRecentActivity: async (limit = 10) => {
    const res = await api.get(
      `/admin/analytics/recent-activity?limit=${limit}`,
    );
    return res.data;
  },
};

export default analyticsService;
