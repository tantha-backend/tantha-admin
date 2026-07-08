import api from "../api/api";

const songService = {
  getAllSongs: async () => {
    const res = await api.get("/admin/songs");
    return res.data;
  },

  getPendingSongs: async () => {
    const res = await api.get("/admin/songs/pending");
    return res.data;
  },

  getSongById: async (id) => {
    const res = await api.get(`/songs/${id}`);
    return res.data;
  },

  uploadSong: async (formData, onUploadProgress) => {
    const res = await api.post("/admin/songs/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return res.data;
  },

  approveSong: async (id) => {
    const res = await api.put(`/admin/songs/${id}/approve`);
    return res.data;
  },

  rejectSong: async (id, reason) => {
    const res = await api.put(`/admin/songs/${id}/reject`, { reason });
    return res.data;
  },

  deleteSong: async (id) => {
    const res = await api.delete(`/admin/songs/${id}`);
    return res.data;
  },

  searchSongs: async (query) => {
    const res = await api.get(`/songs/search?q=${query}`);
    return res.data;
  },
};

export default songService;
