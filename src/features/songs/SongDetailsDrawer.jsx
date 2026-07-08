import {
  X,
  Music4,
  Heart,
  MessageCircle,
  Coffee,
  Crown,
  Disc3,
  Languages,
  ListMusic,
} from "lucide-react";

import CoverImage from "../../components/media/CoverImage";
import AudioPlayer from "../../components/media/AudioPlayer";
import StatusBadge from "../../components/table/StatusBadge";
import Button from "../../components/ui/Button";

const SongDetailsDrawer = ({ song, open, onClose, onEdit, onDelete }) => {
  if (!open || !song) return null;

  const artistName =
    song?.artistId?.name ||
    song?.artist?.name ||
    song?.artistName ||
    "Unknown Artist";

  const albumName =
    song?.albumId?.title ||
    song?.album?.title ||
    song?.albumTitle ||
    "No Album";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-6 py-5 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-white">Song Details</h2>
            <p className="text-sm text-neutral-500">
              View metadata, performance and playback
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
            <CoverImage
              src={song.coverImage}
              alt={song.title}
              className="h-72 w-full object-cover"
            />

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {song.title || "Untitled Song"}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">{artistName}</p>
                </div>

                <StatusBadge status={song.status} />
              </div>

              {song.audio128 && <AudioPlayer src={song.audio128} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={<Music4 size={18} />}
              label="Streams"
              value={song.playCount || 0}
            />
            <InfoCard
              icon={<Heart size={18} />}
              label="Likes"
              value={song.likes?.length || 0}
            />
            <InfoCard
              icon={<MessageCircle size={18} />}
              label="Comments"
              value={song.commentCount || 0}
            />
            <InfoCard
              icon={<Coffee size={18} />}
              label="Coffee"
              value={`₹${song.coffeeEarnings || 0}`}
            />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <h4 className="mb-4 text-sm font-semibold text-white">
              Song Information
            </h4>

            <div className="space-y-4">
              <Detail
                icon={<Disc3 size={16} />}
                label="Album"
                value={albumName}
              />
              <Detail
                icon={<ListMusic size={16} />}
                label="Genre"
                value={song.genre || "Not set"}
              />
              <Detail
                icon={<Languages size={16} />}
                label="Language"
                value={song.language || "Not set"}
              />
              <Detail
                icon={<Crown size={16} />}
                label="Premium"
                value={song.isPremium ? "Yes" : "No"}
              />
            </div>
          </div>

          {song.lyrics && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
              <h4 className="mb-3 text-sm font-semibold text-white">Lyrics</h4>
              <p className="whitespace-pre-line text-sm leading-7 text-neutral-400">
                {song.lyrics}
              </p>
            </div>
          )}

          <div className="flex gap-3 border-t border-neutral-800 pt-5">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => onEdit?.(song)}
            >
              Edit Song
            </Button>

            <Button variant="danger" fullWidth onClick={() => onDelete?.(song)}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-3 text-pink-400">{icon}</div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
};

const Detail = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3 text-neutral-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <span className="text-right text-sm text-neutral-200">{value}</span>
    </div>
  );
};

export default SongDetailsDrawer;
