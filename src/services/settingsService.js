import api from "../api/api";

const settingsService = {
  getSettings: async () => {
    const res = await api.get("/admin/settings");
    return res.data;
  },

  updateGeneralSettings: async (payload) => {
    const res = await api.put("/admin/settings/general", payload);
    return res.data;
  },

  updateStorageSettings: async (payload) => {
    const res = await api.put("/admin/settings/storage", payload);
    return res.data;
  },

  updateFeatureSettings: async (payload) => {
    const res = await api.put("/admin/settings/features", payload);
    return res.data;
  },

  updateSecuritySettings: async (payload) => {
    const res = await api.put("/admin/settings/security", payload);
    return res.data;
  },

  updateNotificationSettings: async (payload) => {
    const res = await api.put("/admin/settings/notifications", payload);
    return res.data;
  },

  updateEmailSettings: async (payload) => {
    const res = await api.put("/admin/settings/email", payload);
    return res.data;
  },

  updateStreamingSettings: async (payload) => {
    const res = await api.put("/admin/settings/streaming", payload);
    return res.data;
  },

  updateUploadSettings: async (payload) => {
    const res = await api.put("/admin/settings/uploads", payload);
    return res.data;
  },

  updateMaintenanceMode: async (payload) => {
    const res = await api.put("/admin/settings/maintenance", payload);
    return res.data;
  },

  resetSettings: async () => {
    const res = await api.post("/admin/settings/reset");
    return res.data;
  },
};

export default settingsService;
