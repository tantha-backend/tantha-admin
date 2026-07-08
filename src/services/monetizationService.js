import api from "../api/api";

const monetizationService = {
  getMonetization: async (params = {}) => {
    const res = await api.get("/admin/monetization", {
      params,
    });

    return res.data;
  },

  getPremiumRevenue: async (params = {}) => {
    const res = await api.get("/admin/monetization/premium", {
      params,
    });

    return res.data;
  },

  getCoffeeSupport: async (params = {}) => {
    const res = await api.get("/admin/monetization/coffee-support", {
      params,
    });

    return res.data;
  },

  getFanClubRevenue: async (params = {}) => {
    const res = await api.get("/admin/monetization/fan-club", {
      params,
    });

    return res.data;
  },

  getArtistEarnings: async (params = {}) => {
    const res = await api.get("/admin/monetization/artist-earnings", {
      params,
    });

    return res.data;
  },

  exportReport: async (params = {}) => {
    const res = await api.get("/admin/monetization/export", {
      params,
      responseType: "blob",
    });

    return res.data;
  },
};

export default monetizationService;
