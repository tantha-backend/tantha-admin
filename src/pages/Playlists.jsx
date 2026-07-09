import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Globe,
  Heart,
  ListMusic,
  Lock,
  Music4,
  Plus,
  RefreshCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/ui/Button";

import playlistService from "../services/playlistService";

function Playlists() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(Number(value || 0));

  const normalizePlaylists = (response) => {
    const data =
      response?.data?.playlists ||
      response?.playlists ||
      response?.data?.data ||
      response?.data ||
      [];

    return Array.isArray(data) ? data : [];
  };

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const response = await playlistService.getPlaylists({ limit: 100 });
      setPlaylists(normalizePlaylists(response));
    } catch (error) {
      toast.error("Failed to load playlists");
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshPlaylists = async () => {
    try {
      setRefreshing(true);
      const response = await playlistService.getPlaylists({ limit: 100 });
      setPlaylists(normalizePlaylists(response));
      toast.success("Playlists refreshed");
    } catch (error) {
      toast.error("Failed to refresh playlists");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const filteredPlaylists = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return playlists;

    return playlists.filter((playlist) => {
      return (
        playlist?.title?.toLowerCase().includes(keyword) ||
        playlist?.description?.toLowerCase().includes(keyword) ||
        playlist?.userId?.name?.toLowerCase().includes(keyword) ||
        playlist?.createdBy?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [playlists, search]);

  const stats = useMemo(() => {
    return {
      total: playlists.length,
      publicCount: playlists.filter((playlist) => playlist?.isPublic).length,
      tracks: playlists.reduce(
        (sum, playlist) => sum + Number(playlist?.songs?.length || 0),
        0,
      ),
      followers: playlists.reduce(
        (sum, playlist) => sum + Number(playlist?.followerCount || 0),
        0,
      ),
    };
  }, [playlists]);

  const getOwnerName = (playlist) => {
    return (
      playlist?.userId?.name ||
      playlist?.createdBy?.name ||
      playlist?.userId?.email ||
      playlist?.createdBy?.email ||
      "Admin"
    );
  };

  const handleViewPlaylist = async (playlist) => {
    try {
      const response = await playlistService.getPlaylistById(playlist._id);

      const details =
        response?.data?.playlist || response?.playlist || response?.data?.data;

      console.log("Playlist Details:", details);

      toast.success(
        `${details?.title || "Playlist"} has ${
          details?.songs?.length || 0
        } song(s).`,
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load playlist details",
      );
    }
  };

  const handleDeletePlaylist = async (playlist) => {
    const confirmDelete = window.confirm(
      `Delete "${playlist?.title || "this playlist"}"?`,
    );

    if (!confirmDelete) return;

    try {
      await playlistService.deletePlaylist(playlist._id);
      toast.success("Playlist deleted successfully");
      await refreshPlaylists();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete playlist",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlists"
        description="Manage editorial, featured, and community playlists."
        action={
          <Button type="button" onClick={() => navigate("/playlists/create")}>
            <Plus size={18} />
            Create Playlist
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Playlists"
          value={formatNumber(stats.total)}
          subtitle="All playlists"
          icon={ListMusic}
          variant="info"
        />

        <StatCard
          title="Public"
          value={formatNumber(stats.publicCount)}
          subtitle="Visible playlists"
          icon={Globe}
          variant="success"
        />

        <StatCard
          title="Tracks"
          value={formatNumber(stats.tracks)}
          subtitle="Songs included"
          icon={Music4}
          variant="warning"
        />

        <StatCard
          title="Followers"
          value={formatNumber(stats.followers)}
          subtitle="Playlist followers"
          icon={Heart}
          variant="danger"
        />
      </div>

      <SectionCard
        title="Playlist Management"
        description="Create, organize, and manage playlists across Tantha Music."
      >
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              placeholder="Search playlists..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pink-500"
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={refreshPlaylists}
            disabled={refreshing}
          >
            <RefreshCcw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>

        {loading ? (
          <LoadingState message="Loading playlists..." />
        ) : filteredPlaylists.length === 0 ? (
          <EmptyState
            icon={ListMusic}
            title="No playlists found"
            description="Create your first playlist to get started."
            actionLabel="Create Playlist"
            onAction={() => navigate("/playlists/create")}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Playlist
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Owner
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Songs
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Visibility
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Featured
                    </th>
                    <th className="px-4 py-4 text-left text-xs uppercase tracking-wide text-white/40">
                      Followers
                    </th>
                    <th className="px-4 py-4 text-right text-xs uppercase tracking-wide text-white/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlaylists.map((playlist) => (
                    <tr
                      key={playlist._id}
                      className="border-t border-white/10 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {playlist?.coverImage ? (
                            <img
                              src={playlist.coverImage}
                              alt={playlist?.title || "Playlist cover"}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                              <ListMusic size={20} className="text-white/30" />
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-white">
                              {playlist?.title || "Untitled Playlist"}
                            </p>
                            <p className="line-clamp-1 text-sm text-white/40">
                              {playlist?.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-white/60">
                        {getOwnerName(playlist)}
                      </td>

                      <td className="px-4 py-4 text-sm text-white">
                        {formatNumber(playlist?.songs?.length || 0)}
                      </td>

                      <td className="px-4 py-4">
                        {playlist?.isPublic ? (
                          <StatusBadge variant="success">
                            <Globe size={13} />
                            Public
                          </StatusBadge>
                        ) : (
                          <StatusBadge variant="default">
                            <Lock size={13} />
                            Private
                          </StatusBadge>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {playlist?.isFeatured ? (
                          <StatusBadge variant="warning">
                            <Star size={13} />
                            Featured
                          </StatusBadge>
                        ) : (
                          <StatusBadge>Normal</StatusBadge>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-white">
                        {formatNumber(playlist?.followerCount || 0)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              navigate(`/playlists/${playlist._id}`)
                            }
                          >
                            <Eye size={16} />
                          </Button>

                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => handleDeletePlaylist(playlist)}
                          >
                            <Trash2 size={16} />
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
}

export default Playlists;
