import api from "../api/api";

const userService = {
  getUsers: async (params = {}) => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },

  createUser: async (data) => {
    const res = await api.post("/admin/users/create", data);
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  updateUserRole: async (id, role) => {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  togglePremium: async (id, data = {}) => {
    const res = await api.put(`/admin/users/${id}/premium`, data);
    return res.data;
  },

  toggleStatus: async (id, data = {}) => {
    const res = await api.put(`/admin/users/${id}/status`, data);
    return res.data;
  },

  getUserAnalytics: async (id) => {
    const res = await api.get(`/admin/users/${id}/analytics`);
    return res.data;
  },
};

export default userService;