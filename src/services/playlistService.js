import api from "../api/api";

const playlistService = {
  getPlaylists: (params = {}) => {
    return api.get("/admin/playlists", { params });
  },

  getPlaylistById: (id) => {
    return api.get(`/admin/playlists/${id}`);
  },

  createPlaylist: (data, onUploadProgress) => {
    return api.post("/admin/playlists/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  updatePlaylist: (id, data, onUploadProgress) => {
    return api.put(`/admin/playlists/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  deletePlaylist: (id) => {
    return api.delete(`/admin/playlists/${id}`);
  },

  makePublic: (id) => {
    return api.put(`/admin/playlists/${id}/public`);
  },

  makePrivate: (id) => {
    return api.put(`/admin/playlists/${id}/private`);
  },

  addSong: (playlistId, songId) => {
    return api.put(`/admin/playlists/${playlistId}/songs/add`, {
      songId,
    });
  },

  removeSong: (playlistId, songId) => {
    return api.put(`/admin/playlists/${playlistId}/songs/remove`, {
      songId,
    });
  },

  getAnalytics: (id) => {
    return api.get(`/admin/playlists/${id}/analytics`);
  },
};

export default playlistService;
