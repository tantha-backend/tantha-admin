import { Music2 } from "lucide-react";

const TopSongsTable = ({ songs = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">Top Songs</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase text-zinc-500">
              <th className="pb-3 font-medium">Song</th>
              <th className="pb-3 font-medium">Artist</th>
              <th className="pb-3 font-medium">Streams</th>
              <th className="pb-3 font-medium">Likes</th>
              <th className="pb-3 font-medium">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {songs.length > 0 ? (
              songs.map((song) => (
                <tr key={song._id} className="border-b border-white/5">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
                        <Music2 size={18} />
                      </div>
                      <span className="font-medium text-white">
                        {song.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-400">
                    {song.artistName || "Unknown Artist"}
                  </td>
                  <td className="py-4 text-zinc-300">{song.streams || 0}</td>
                  <td className="py-4 text-zinc-300">{song.likes || 0}</td>
                  <td className="py-4 text-zinc-300">₹{song.revenue || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center text-zinc-500">
                  No top songs data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSongsTable;
