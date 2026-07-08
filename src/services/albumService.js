import api from "../api/api";

const albumService = {
  // =========================
  // Albums
  // =========================

  getAllAlbums: async () => {
    const res = await api.get("/admin/albums");
    return res.data;
  },

  getAlbumById: async (id) => {
    const res = await api.get(`/admin/albums/${id}`);
    return res.data;
  },

  createAlbum: async (formData) => {
    const res = await api.post("/admin/albums/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateAlbum: async (id, formData) => {
    const res = await api.put(`/admin/albums/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  deleteAlbum: async (id) => {
    const res = await api.delete(`/admin/albums/${id}`);
    return res.data;
  },

  // =========================
  // Publish
  // =========================

  publishAlbum: async (id) => {
    const res = await api.put(`/admin/albums/${id}/publish`);

    return res.data;
  },

  unpublishAlbum: async (id) => {
    const res = await api.put(`/admin/albums/${id}/unpublish`);

    return res.data;
  },

  // =========================
  // Songs
  // =========================

  addSongToAlbum: async (albumId, songId) => {
    const res = await api.put(`/admin/albums/${albumId}/songs/add`, {
      songId,
    });

    return res.data;
  },

  removeSongFromAlbum: async (albumId, songId) => {
    const res = await api.put(`/admin/albums/${albumId}/songs/remove`, {
      songId,
    });

    return res.data;
  },

  // =========================
  // Analytics
  // =========================

  getAlbumAnalytics: async (id) => {
    const res = await api.get(`/admin/albums/${id}/analytics`);

    return res.data;
  },

  // =========================
  // Search
  // =========================

  searchAlbums: async (query) => {
    const { albums } = await albumService.getAllAlbums();

    if (!query) return albums;

    return albums.filter((album) => {
      const title = album.title?.toLowerCase() || "";

      const artist = album.artistId?.stageName?.toLowerCase() || "";

      return (
        title.includes(query.toLowerCase()) ||
        artist.includes(query.toLowerCase())
      );
    });
  },
};

export default albumService;
