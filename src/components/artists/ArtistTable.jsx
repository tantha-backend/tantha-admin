import { CheckCircle2, Edit, Eye, Trash2, XCircle } from "lucide-react";

const getArtistName = (artist) => {
  return artist.stageName || artist.userId?.name || "Unnamed Artist";
};

const getArtistEmail = (artist) => {
  return artist.userId?.email || "No Email";
};

const getUserName = (artist) => {
  return artist.userId?.name || "No User";
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function ArtistTable({
  artists,
  loading,
  deletingId,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center text-white/50">Loading artists...</div>
    );
  }

  if (!artists.length) {
    return (
      <div className="p-12 text-center text-white/50">No artists found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px]">
        <thead>
          <tr className="border-b border-white/10 text-left text-sm text-white/40">
            <th className="px-6 py-4">Artist</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Verification</th>
            <th className="px-6 py-4">Fan Club</th>
            <th className="px-6 py-4">Joined</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {artists.map((artist) => {
            const artistName = getArtistName(artist);
            const userName = getUserName(artist);

            return (
              <tr
                key={artist._id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {artist.profileImage ? (
                      <img
                        src={artist.profileImage}
                        alt={artistName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10 font-semibold text-pink-400">
                        {artistName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-white">{artistName}</h4>
                      <p className="text-xs text-white/35">ID: {artist._id}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-white/60">{userName}</td>

                <td className="px-6 py-5 text-white/60">
                  {getArtistEmail(artist)}
                </td>

                <td className="px-6 py-5">
                  {artist.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      <CheckCircle2 size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/40">
                      <XCircle size={14} />
                      Not Verified
                    </span>
                  )}
                </td>

                <td className="px-6 py-5 text-white/60">
                  ₹{artist.fanClubPrice ?? 99}
                </td>

                <td className="px-6 py-5 text-white/60">
                  {formatDate(artist.createdAt)}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(artist)}
                      className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:border-pink-500 hover:text-pink-400"
                      title="View artist"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit?.(artist)}
                      className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:border-blue-500 hover:text-blue-400"
                      title="Edit artist"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(artist._id)}
                      disabled={deletingId === artist._id}
                      className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:border-red-500 hover:text-red-400 disabled:opacity-40"
                      title="Delete artist"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ArtistTable;
