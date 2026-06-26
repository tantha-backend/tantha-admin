import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Music,
} from "lucide-react";
import api from "../api/api";

function Songs() {
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/songs");

      setSongs(res.data.songs || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter((song) => {
    const text =
      `${song.title} ${song.genre} ${song.language} ${song.artistId?.stageName}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Songs</h1>
          <p className="text-white/50 mt-2">
            Manage uploaded songs, approvals, premium access and metadata.
          </p>
        </div>

        <button
          onClick={() => navigate("/songs/upload")}
          className="bg-pink-500 hover:bg-pink-600 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <Plus size={18} />
          Upload Song
        </button>
      </div>

      <div className="card mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-3 text-white/40" size={18} />
            <input
              className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-pink-500"
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn flex items-center gap-2">
            <SlidersHorizontal size={18} />
            Filter
          </button>
        </div>

        {loading ? (
          <p className="text-white/50">Loading songs...</p>
        ) : filteredSongs.length === 0 ? (
          <div className="py-16 text-center text-white/50">
            <Music className="mx-auto mb-4 text-pink-500" size={40} />
            <p>No songs found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/40 text-left">
              <tr>
                <th className="pb-4">Song</th>
                <th className="pb-4">Artist</th>
                <th className="pb-4">Genre</th>
                <th className="pb-4">Language</th>
                <th className="pb-4">Streams</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSongs.map((song) => (
                <tr key={song._id} className="border-t border-white/10">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      {song.coverImage ? (
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                          <Music className="text-pink-500" size={22} />
                        </div>
                      )}

                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-xs text-white/40">
                          {song.audio128 ? "Audio uploaded" : "No audio"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-white/70">
                    {song.artistId?.stageName || "Unknown Artist"}
                  </td>

                  <td className="text-white/70">{song.genre}</td>
                  <td className="text-white/70">{song.language}</td>
                  <td className="text-white/70">{song.playCount || 0}</td>

                  <td>
                    <Status song={song} />
                  </td>

                  <td className="text-right">
                    <button className="text-white/50 hover:text-white">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Status({ song }) {
  let label = "Pending";
  let style = "bg-yellow-500/10 text-yellow-400";

  if (song.isPublished) {
    label = "Live";
    style = "bg-green-500/10 text-green-400";
  }

  if (song.isPremiumOnly) {
    label = "Premium";
    style = "bg-pink-500/10 text-pink-400";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${style}`}>{label}</span>
  );
}

export default Songs;
