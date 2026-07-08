import { Trophy } from "lucide-react";

const TopEarningArtists = ({ artists = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">
        Top Earning Artists
      </h3>

      <div className="space-y-4">
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <div
              key={artist._id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/20 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Trophy size={18} />
                </div>

                <div>
                  <p className="font-medium text-white">
                    #{index + 1}{" "}
                    {artist.stageName || artist.name || "Unknown Artist"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {artist.streams || 0} streams
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-emerald-400">
                  ₹{artist.revenue || 0}
                </p>
                <p className="text-xs text-zinc-500">total earnings</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-zinc-500">
            No earning artists found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TopEarningArtists;
