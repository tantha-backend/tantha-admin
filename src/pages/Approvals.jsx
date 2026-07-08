import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";

const Approvals = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingSongs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/songs/pending");

      setSongs(res.data.songs || []);
    } catch (error) {
      console.error("Failed to fetch pending songs:", error);
      toast.error("Failed to load pending songs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSongs();
  }, []);

  const handleApprove = async (songId) => {
    try {
      setActionLoading(songId);

      await api.put(`/admin/songs/${songId}/approve`);

      setSongs((prev) => prev.filter((song) => song._id !== songId));

      toast.success("Song approved successfully.");
    } catch (error) {
      console.error("Failed to approve song:", error);
      toast.error("Failed to approve song.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (songId) => {
    const reason = window.prompt("Reason for rejection:");

    if (reason === null) return;

    try {
      setActionLoading(songId);

      await api.put(`/admin/songs/${songId}/reject`, {
        reason: reason || "Rejected by admin",
      });

      setSongs((prev) => prev.filter((song) => song._id !== songId));

      toast.success("Song rejected successfully.");
    } catch (error) {
      console.error("Failed to reject song:", error);
      toast.error("Failed to reject song.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSongs = songs.filter((song) => {
    const title = song.title?.toLowerCase() || "";
    const artist = song.artistId?.stageName?.toLowerCase() || "";
    const genre = song.genre?.toLowerCase() || "";
    const language = song.language?.toLowerCase() || "";
    const value = search.toLowerCase();

    return (
      title.includes(value) ||
      artist.includes(value) ||
      genre.includes(value) ||
      language.includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Approvals</h1>

          <p className="mt-1 text-sm text-zinc-400">
            Review artist uploads before publishing them on Tantha.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPendingSongs}
          disabled={loading}
          className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-white transition hover:border-pink-500 hover:text-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Pending Songs</p>

            <h2 className="text-3xl font-semibold text-white">
              {songs.length}
            </h2>
          </div>

          <input
            type="text"
            placeholder="Search pending songs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-pink-500 md:w-80"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-400">
            Loading pending songs...
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-400">No pending songs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-zinc-800 bg-black">
                <tr>
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Song
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Artist
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Genre
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Language
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Premium
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Preview
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSongs.map((song) => (
                  <tr
                    key={song._id}
                    className="border-b border-zinc-900 hover:bg-zinc-900/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-zinc-900">
                          <img
                            src={song.coverImage || "/placeholder-cover.png"}
                            alt={song.title || "Song cover"}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "/placeholder-cover.png";
                            }}
                          />
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {song.title || "Untitled Song"}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {song.duration || 0}s · {song.playCount || 0}{" "}
                            streams
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-300">
                      {song.artistId?.stageName ||
                        song.artistId?.artistName ||
                        "Unknown Artist"}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {song.genre || "Not set"}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-400">
                      {song.language || "Not set"}
                    </td>

                    <td className="px-5 py-4">
                      {song.isPremiumOnly ? (
                        <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-400">
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                          Free
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {song.audio128 ? (
                        <audio controls className="h-9 w-48">
                          <source src={song.audio128} />
                        </audio>
                      ) : (
                        <span className="text-xs text-zinc-600">No audio</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleReject(song._id)}
                          disabled={actionLoading === song._id}
                          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(song._id)}
                          disabled={actionLoading === song._id}
                          className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === song._id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;