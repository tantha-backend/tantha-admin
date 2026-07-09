import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Heart,
  ListMusic,
  Lock,
  Music4,
  RefreshCcw,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import StatCard from "../components/common/StatCard";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/ui/Button";

import playlistService from "../services/playlistService";

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingSongId, setRemovingSongId] = useState(null);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(Number(value || 0));
  };

  const formatDuration = (seconds) => {
    const totalSeconds = Number(seconds || 0);

    if (!totalSeconds) return "0:00";

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getArtistName = (song) => {
    return (
      song?.artistId?.stageName ||
      song?.artistId?.artistName ||
      song?.artistId?.name ||
      song?.artist?.stageName ||
      song?.artist?.artistName ||
      song?.artist?.name ||
      song?.artistName ||
      "Unknown Artist"
    );
  };

  const getOwnerName = (item) => {
    return (
      item?.userId?.name ||
      item?.createdBy?.name ||
      item?.userId?.email ||
      item?.createdBy?.email ||
      "Admin"
    );
  };

  const normalizePlaylist = (response) => {
    return (
      response?.data?.playlist ||
      response?.playlist ||
      response?.data?.data ||
      null
    );
  };

  const loadPlaylist = async () => {
    try {
      setLoading(true);

      const response = await playlistService.getPlaylistById(id);
      const data = normalizePlaylist(response);

      setPlaylist(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load playlist");
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshPlaylist = async () => {
    try {
      setRefreshing(true);

      const response = await playlistService.getPlaylistById(id);
      const data = normalizePlaylist(response);

      setPlaylist(data);
      toast.success("Playlist refreshed");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to refresh playlist",
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const stats = useMemo(() => {
    const songs = playlist?.songs || [];

    const totalDuration = songs.reduce(
      (sum, song) => sum + Number(song?.duration || 0),
      0,
    );

    const totalStreams = songs.reduce(
      (sum, song) => sum + Number(song?.playCount || 0),
      0,
    );

    return {
      songs: songs.length,
      followers: playlist?.followerCount || 0,
      duration: totalDuration,
      streams: totalStreams,
    };
  }, [playlist]);

  const handleRemoveSong = async (song) => {
    const confirmRemove = window.confirm(
      `Remove "${song?.title || "this song"}" from this playlist?`,
    );

    if (!confirmRemove) return;

    try {
      setRemovingSongId(song._id);

      await playlistService.removeSong(playlist._id, song._id);

      toast.success("Song removed from playlist");
      await refreshPlaylist();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove song");
    } finally {
      setRemovingSongId(null);
    }
  };

  const handleDeletePlaylist = async () => {
    const confirmDelete = window.confirm(
      `Delete "${playlist?.title || "this playlist"}"?`,
    );

    if (!confirmDelete) return;

    try {
      await playlistService.deletePlaylist(playlist._id);
      toast.success("Playlist deleted successfully");
      navigate("/playlists");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete playlist",
      );
    }
  };

  const handleToggleVisibility = async () => {
    try {
      if (playlist?.isPublic) {
        await playlistService.makePrivate(playlist._id);
        toast.success("Playlist is now private");
      } else {
        await playlistService.makePublic(playlist._id);
        toast.success("Playlist is now public");
      }

      await refreshPlaylist();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update visibility",
      );
    }
  };

  if (loading) {
    return <LoadingState message="Loading playlist details..." />;
  }

  if (!playlist) {
    return (
      <EmptyState
        icon={ListMusic}
        title="Playlist not found"
        description="The playlist may have been deleted or is unavailable."
        actionLabel="Back to Playlists"
        onAction={() => navigate("/playlists")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlist Details"
        description="View and manage playlist songs, visibility, and performance."
        action={
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/playlists")}
            >
              <ArrowLeft size={18} />
              Back
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={refreshPlaylist}
              disabled={refreshing}
            >
              <RefreshCcw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={handleDeletePlaylist}
            >
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        }
      />

      <SectionCard>
        <div className="flex flex-col gap-6 lg:flex-row">
          {playlist?.coverImage ? (
            <img
              src={playlist.coverImage}
              alt={playlist?.title || "Playlist cover"}
              className="h-56 w-56 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white/5">
              <ListMusic size={56} className="text-white/30" />
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {playlist?.title || "Untitled Playlist"}
              </h2>

              <p className="mt-2 max-w-3xl text-sm text-white/50">
                {playlist?.description || "No description available."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {playlist?.isPublic ? (
                <StatusBadge variant="success">
                  <Globe size={13} />
                  Public
                </StatusBadge>
              ) : (
                <StatusBadge>
                  <Lock size={13} />
                  Private
                </StatusBadge>
              )}

              {playlist?.isFeatured ? (
                <StatusBadge variant="warning">
                  <Star size={13} />
                  Featured
                </StatusBadge>
              ) : (
                <StatusBadge>Normal</StatusBadge>
              )}
            </div>

            <div className="grid gap-3 text-sm text-white/50 md:grid-cols-2">
              <p>
                Owner:{" "}
                <span className="font-medium text-white">
                  {getOwnerName(playlist)}
                </span>
              </p>

              <p>
                Created:{" "}
                <span className="font-medium text-white">
                  {playlist?.createdAt
                    ? new Date(playlist.createdAt).toLocaleDateString("en-IN")
                    : "Unknown"}
                </span>
              </p>
            </div>

            <Button type="button" onClick={handleToggleVisibility}>
              {playlist?.isPublic ? (
                <>
                  <Lock size={18} />
                  Make Private
                </>
              ) : (
                <>
                  <Globe size={18} />
                  Make Public
                </>
              )}
            </Button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Songs"
          value={formatNumber(stats.songs)}
          subtitle="Tracks included"
          icon={Music4}
          variant="info"
        />

        <StatCard
          title="Followers"
          value={formatNumber(stats.followers)}
          subtitle="Playlist followers"
          icon={Heart}
          variant="danger"
        />

        <StatCard
          title="Duration"
          value={formatDuration(stats.duration)}
          subtitle="Total runtime"
          icon={ListMusic}
          variant="warning"
        />

        <StatCard
          title="Streams"
          value={formatNumber(stats.streams)}
          subtitle="Combined song streams"
          icon={Globe}
          variant="success"
        />
      </div>

      <SectionCard
        title="Songs"
        description="Songs currently included in this playlist."
      >
        {!playlist?.songs || playlist.songs.length === 0 ? (
          <EmptyState
            icon={Music4}
            title="No songs in this playlist"
            description="Songs added to this playlist will appear here."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Song
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Artist
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Genre
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Duration
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Status
                    </th>
                    <th className="px-4 py-4 text-right text-xs uppercase tracking-wide text-white/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {playlist.songs.map((song) => (
                    <tr
                      key={song._id}
                      className="border-t border-white/10 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {song?.coverImage ? (
                            <img
                              src={song.coverImage}
                              alt={song?.title || "Song cover"}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                              <Music4 size={20} className="text-white/30" />
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-white">
                              {song?.title || "Untitled"}
                            </p>
                            <p className="text-sm text-white/40">
                              {song?.language || "Unknown language"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-white/60">
                        {getArtistName(song)}
                      </td>

                      <td className="px-4 py-4 text-sm text-white/60">
                        {song?.genre || "Not set"}
                      </td>

                      <td className="px-4 py-4 text-sm text-white">
                        {formatDuration(song?.duration)}
                      </td>

                      <td className="px-4 py-4">
                        {song?.status === "published" || song?.isPublished ? (
                          <StatusBadge variant="success">Published</StatusBadge>
                        ) : (
                          <StatusBadge variant="warning">Pending</StatusBadge>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="danger"
                            disabled={removingSongId === song._id}
                            onClick={() => handleRemoveSong(song)}
                          >
                            <Trash2 size={16} />
                            {removingSongId === song._id
                              ? "Removing..."
                              : "Remove"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default PlaylistDetails;
