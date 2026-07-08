import api from "../api/api";

const artistService = {
  getAvailableArtistUsers: async () => {
    const res = await api.get("/admin/users/available-artists");
    return res.data;
  },

  getArtists: async () => {
    const res = await api.get("/admin/artists");
    return res.data;
  },

  getAllArtists: async () => {
    const res = await api.get("/admin/artists");
    return res.data;
  },

  getArtistById: async (id) => {
    const res = await api.get(`/admin/artists/${id}`);
    return res.data;
  },

  getArtistSongs: async (id) => {
    const res = await api.get(`/admin/artists/${id}/songs`);
    return res.data;
  },

  getArtistAlbums: async (id) => {
    const res = await api.get(`/admin/artists/${id}/albums`);
    return res.data;
  },

  createArtist: async (formData) => {
    const res = await api.post("/admin/artists", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateArtist: async (id, formData) => {
    const res = await api.put(`/admin/artists/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  deleteArtist: async (id) => {
    const res = await api.delete(`/admin/artists/${id}`);
    return res.data;
  },

  verifyArtist: async (id) => {
    const res = await api.put(`/admin/artists/${id}/verify`);
    return res.data;
  },

  updateArtistStatus: async (id, status) => {
    const res = await api.put(`/admin/artists/${id}/status`, {
      status,
    });

    return res.data;
  },
};

export default artistService;
