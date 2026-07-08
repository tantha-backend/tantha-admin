import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Coffee,
  Edit,
  Mail,
  Music4,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import artistService from "../services/artistService";

const formatNumber = (value) => {
  if (!value) return "0";
  return Number(value).toLocaleString("en-IN");
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDuration = (duration) => {
  if (!duration) return "0:00";

  const totalSeconds = Number(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/50">{title}</p>
        <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>
        <p className="mt-2 text-sm text-white/40">{subtitle}</p>
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-b-0">
    <span className="text-sm text-white/40">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);

function ArtistDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [songs, setSongs] = useState([]);
  const [songStats, setSongStats] = useState({
    totalSongs: 0,
    publishedSongs: 0,
    draftSongs: 0,
    totalStreams: 0,
    totalLikes: 0,
    premiumSongs: 0,
  });
  const [songsLoading, setSongsLoading] = useState(true);

  const [albums, setAlbums] = useState([]);
  const [albumStats, setAlbumStats] = useState({
    totalAlbums: 0,
    publishedAlbums: 0,
    draftAlbums: 0,
    totalAlbumPlays: 0,
    totalSongsInAlbums: 0,
  });
  const [albumsLoading, setAlbumsLoading] = useState(true);

  const fetchArtist = async () => {
    try {
      setLoading(true);

      const res = await artistService.getArtistById(id);
      setArtist(res.artist || null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load artist.");
      navigate("/artists");
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistSongs = async () => {
    try {
      setSongsLoading(true);

      const res = await artistService.getArtistSongs(id);

      setSongs(res.songs || []);
      setSongStats(
        res.stats || {
          totalSongs: 0,
          publishedSongs: 0,
          draftSongs: 0,
          totalStreams: 0,
          totalLikes: 0,
          premiumSongs: 0,
        },
      );
    } catch (err) {
      console.log("Failed to load artist songs:", err);
      setSongs([]);
    } finally {
      setSongsLoading(false);
    }
  };

  const fetchArtistAlbums = async () => {
    try {
      setAlbumsLoading(true);

      const res = await artistService.getArtistAlbums(id);

      setAlbums(res.albums || []);
      setAlbumStats(
        res.stats || {
          totalAlbums: 0,
          publishedAlbums: 0,
          draftAlbums: 0,
          totalAlbumPlays: 0,
          totalSongsInAlbums: 0,
        },
      );
    } catch (err) {
      console.log("Failed to load artist albums:", err);
      setAlbums([]);
    } finally {
      setAlbumsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtist();
    fetchArtistSongs();
    fetchArtistAlbums();
  }, [id]);

  if (loading) {
    return <div className="text-white/50">Loading artist...</div>;
  }

  if (!artist) {
    return <div className="text-white/50">Artist not found.</div>;
  }

  const user = artist.userId || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button type="button" onClick={() => navigate("/artists")}>
          <ArrowLeft size={18} />
          Back to Artists
        </Button>

        <Button
          type="button"
          onClick={() => navigate(`/artists/${artist._id}/edit`)}
        >
          <Edit size={18} />
          Edit Artist
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="h-56 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20">
          {artist.coverImage && (
            <img
              src={artist.coverImage}
              alt={artist.stageName}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="relative p-6 pt-0">
          <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end">
            {artist.profileImage ? (
              <img
                src={artist.profileImage}
                alt={artist.stageName}
                className="h-32 w-32 rounded-full border-4 border-black object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-black bg-pink-500 text-4xl font-bold text-white">
                {artist.stageName?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}

            <div className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold text-white">
                  {artist.stageName}
                </h1>

                {artist.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                    <BadgeCheck size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-sm text-white/40">
                    Not Verified
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/50">
                <span>{user.name || "No user name"}</span>
                <span className="inline-flex items-center gap-1">
                  <Mail size={14} />
                  {user.email || "No email"}
                </span>
                <span>Joined {formatDate(artist.createdAt)}</span>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-4xl text-sm leading-6 text-white/60">
            {artist.bio || "No biography added yet."}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Followers"
          value={formatNumber(artist.followersCount)}
          subtitle="Total followers"
          icon={Users}
          color="bg-pink-500/10 text-pink-400"
        />

        <StatCard
          title="Total Streams"
          value={formatNumber(songStats.totalStreams)}
          subtitle="From uploaded songs"
          icon={Music4}
          color="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Monthly Listeners"
          value={formatNumber(artist.monthlyListeners)}
          subtitle="Current month"
          icon={Star}
          color="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Fan Club"
          value={`₹${artist.fanClubPrice ?? 99}`}
          subtitle={
            artist.isMonetized ? "Monetization enabled" : "Monetization off"
          }
          icon={Wallet}
          color="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Songs"
          value={formatNumber(songStats.totalSongs)}
          subtitle="Uploaded by artist"
          icon={Music4}
          color="bg-pink-500/10 text-pink-400"
        />

        <StatCard
          title="Published Songs"
          value={formatNumber(songStats.publishedSongs)}
          subtitle="Live on platform"
          icon={BadgeCheck}
          color="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Draft Songs"
          value={formatNumber(songStats.draftSongs)}
          subtitle="Pending or unpublished"
          icon={ShieldCheck}
          color="bg-orange-500/10 text-orange-400"
        />

        <StatCard
          title="Premium Songs"
          value={formatNumber(songStats.premiumSongs)}
          subtitle="Premium-only content"
          icon={Wallet}
          color="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Albums"
          value={formatNumber(albumStats.totalAlbums)}
          subtitle="Artist albums"
          icon={Music4}
          color="bg-pink-500/10 text-pink-400"
        />

        <StatCard
          title="Published Albums"
          value={formatNumber(albumStats.publishedAlbums)}
          subtitle="Live albums"
          icon={BadgeCheck}
          color="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Album Plays"
          value={formatNumber(albumStats.totalAlbumPlays)}
          subtitle="Across all albums"
          icon={Star}
          color="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Songs in Albums"
          value={formatNumber(albumStats.totalSongsInAlbums)}
          subtitle="Total tracks"
          icon={Music4}
          color="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">Artist Overview</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black p-5">
              <div className="flex items-center gap-3">
                <Coffee className="text-pink-400" size={24} />
                <div>
                  <p className="text-sm text-white/50">Coffee Received</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    ₹{formatNumber(artist.coffeeReceived)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black p-5">
              <div className="flex items-center gap-3">
                <Users className="text-blue-400" size={24} />
                <div>
                  <p className="text-sm text-white/50">Fan Club Subscribers</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {formatNumber(artist.fanClubSubscribers)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-400" size={24} />
                <div>
                  <p className="text-sm text-white/50">Verification</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {artist.isVerified ? "Verified" : "Pending"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black p-5">
              <div className="flex items-center gap-3">
                <Wallet className="text-yellow-400" size={24} />
                <div>
                  <p className="text-sm text-white/50">Monetization</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {artist.isMonetized ? "Enabled" : "Disabled"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold text-white">Account Info</h2>

          <div className="mt-4">
            <InfoRow label="User Name" value={user.name || "N/A"} />
            <InfoRow label="Email" value={user.email || "N/A"} />
            <InfoRow label="Role" value={user.role || "artist"} />
            <InfoRow label="Artist ID" value={artist._id} />
            <InfoRow label="Created" value={formatDate(artist.createdAt)} />
            <InfoRow label="Updated" value={formatDate(artist.updatedAt)} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">Artist Songs</h2>

          <p className="mt-1 text-sm text-white/40">
            Songs uploaded by this artist.
          </p>
        </div>

        {songsLoading ? (
          <div className="p-10 text-center text-white/50">Loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="p-10 text-center text-white/50">
            This artist hasn't uploaded any songs yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-white/40">
                  <th className="px-6 py-4">Song</th>
                  <th className="px-6 py-4">Album</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Streams</th>
                  <th className="px-6 py-4">Likes</th>
                  <th className="px-6 py-4">Premium</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Uploaded</th>
                </tr>
              </thead>

              <tbody>
                {songs.map((song) => (
                  <tr
                    key={song._id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {song.coverImage ? (
                          <img
                            src={song.coverImage}
                            alt={song.title}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-pink-500/10">
                            <Music4 size={22} className="text-pink-400" />
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium text-white">
                            {song.title}
                          </h4>

                          <p className="text-xs text-white/40">{song._id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-white/60">
                      {song.albumId?.title || "-"}
                    </td>

                    <td className="px-6 py-5 text-white/60">{song.genre}</td>

                    <td className="px-6 py-5 text-white/60">{song.language}</td>

                    <td className="px-6 py-5 text-white/60">
                      {formatDuration(song.duration)}
                    </td>

                    <td className="px-6 py-5 text-white">
                      {formatNumber(song.playCount)}
                    </td>

                    <td className="px-6 py-5 text-white">
                      {formatNumber(song.likeCount)}
                    </td>

                    <td className="px-6 py-5">
                      {song.isPremiumOnly ? (
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/40">
                          Free
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      {song.isPublished ? (
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-white/60">
                      {formatDate(song.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">Artist Albums</h2>

          <p className="mt-1 text-sm text-white/40">
            Albums created by this artist.
          </p>
        </div>

        {albumsLoading ? (
          <div className="p-10 text-center text-white/50">
            Loading albums...
          </div>
        ) : albums.length === 0 ? (
          <div className="p-10 text-center text-white/50">No albums found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-white/40">
                  <th className="px-6 py-4">Album</th>
                  <th className="px-6 py-4">Songs</th>
                  <th className="px-6 py-4">Plays</th>
                  <th className="px-6 py-4">Release</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {albums.map((album) => (
                  <tr
                    key={album._id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {album.coverImage ? (
                          <img
                            src={album.coverImage}
                            alt={album.title}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-500/10">
                            <Music4 size={22} className="text-blue-400" />
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium text-white">
                            {album.title}
                          </h4>

                          <p className="text-xs text-white/40">{album._id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-white">
                      {album.songs?.length || 0}
                    </td>

                    <td className="px-6 py-5 text-white">
                      {formatNumber(album.totalPlays)}
                    </td>

                    <td className="px-6 py-5 text-white/60">
                      {formatDate(album.releaseDate)}
                    </td>

                    <td className="px-6 py-5">
                      {album.isPublished ? (
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                          Draft
                        </span>
                      )}
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
}

export default ArtistDetails;
