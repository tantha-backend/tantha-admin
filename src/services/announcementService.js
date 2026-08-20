import api from "../api/api";

const announcementService = {
  list: async () => {
    const res = await api.get("/admin/announcements");
    return res.data;
  },

  // Reaches everyone using the app, so the caller should confirm first.
  send: async ({ title, message, link }) => {
    const res = await api.post("/admin/announcements", { title, message, link });
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/admin/announcements/${id}`);
    return res.data;
  },
};

export default announcementService;
