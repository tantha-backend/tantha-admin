import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Clock3,
  Copy,
  Eye,
  Music4,
  Pencil,
  Play,
  Plus,
  Radio,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import FilterBar from "../components/common/FilterBar";
import SearchBar from "../components/common/SearchBar";
import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import StatusBadge from "../components/common/StatusBadge";
import ActionMenu from "../components/common/ActionMenu";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";

import Button from "../components/ui/Button";
import CoverImage from "../components/media/CoverImage";
import AudioPlayer from "../components/media/AudioPlayer";
import SongDetailsDrawer from "../features/songs/SongDetailsDrawer";
import songService from "../services/songService";

const PAGE_SIZE = 10;

const getSongStatus = (song) => {
  if (song?.status) return song.status;
  if (song?.isPublished === true) return "published";
  if (song?.isPublished === false) return "pending";
  return "unknown";
};

const getStatusVariant = (status) => {
  if (status === "published") return "success";
  if (status === "pending") return "warning";
  if (status === "rejected") return "danger";
  return "default";
};

const getAccessType = (song) => {
  return song?.isPremium || song?.isPremiumOnly ? "premium" : "free";
};

const getAudioSource = (song) => {
  return (
    song?.audio128 ||
    song?.audio320 ||
    song?.audioUrl ||
    song?.audioURL ||
    song?.audio ||
    song?.audioFile ||
    song?.songUrl ||
    song?.songURL ||
    song?.fileUrl ||
    song?.fileURL ||
    song?.mediaUrl ||
    song?.mediaURL ||
    song?.files?.audio128 ||
    song?.files?.audio320 ||
    song?.files?.audio ||
    song?.media?.audio128 ||
    song?.media?.audio320 ||
    song?.media?.audio ||
    song?.urls?.audio128 ||
    song?.urls?.audio320 ||
    song?.urls?.audio ||
    song?.s3?.audio128 ||
    song?.s3?.audio320 ||
    song?.s3?.audio ||
    ""
  );
};

const Songs = () => {
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedSong, setSelectedSong] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(Number(value || 0));
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

  const getAlbumName = (song) => {
    return (
      song?.albumId?.title ||
      song?.album?.title ||
      song?.albumTitle ||
      "No Album"
    );
  };

  const normalizeSongsResponse = (response) => {
    const data =
      response?.data?.songs ||
      response?.data?.data ||
      response?.songs ||
      response?.data ||
      [];

    return Array.isArray(data) ? data : [];
  };

  const loadSongs = async () => {
    try {
      setLoading(true);
      const response = await songService.getAllSongs();
      const normalized = normalizeSongsResponse(response);

      console.log("Songs Response:", normalized);
      if (normalized.length) {
        console.log("First Song:", normalized[0]);
        console.log("Audio Source:", getAudioSource(normalized[0]));
      }

      setSongs(normalized);
    } catch (error) {
      toast.error("Failed to load songs.");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSongs = async () => {
    try {
      setRefreshing(true);
      const response = await songService.getAllSongs();
      setSongs(normalizeSongsResponse(response));
      setSelectedRows([]);
      toast.success("Songs refreshed.");
    } catch (error) {
      toast.error("Failed to refresh songs.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    setPage(1);
    setSelectedRows([]);
  }, [search, statusFilter, premiumFilter]);

  const filteredSongs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return songs.filter((song) => {
      const status = getSongStatus(song);
      const accessType = getAccessType(song);

      const matchesSearch =
        !keyword ||
        song?.title?.toLowerCase().includes(keyword) ||
        getArtistName(song).toLowerCase().includes(keyword) ||
        getAlbumName(song).toLowerCase().includes(keyword) ||
        song?.genre?.toLowerCase().includes(keyword) ||
        song?.language?.toLowerCase().includes(keyword);

      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesPremium =
        premiumFilter === "all" || accessType === premiumFilter;

      return matchesSearch && matchesStatus && matchesPremium;
    });
  }, [songs, search, statusFilter, premiumFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSongs.length / PAGE_SIZE));

  const paginatedSongs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSongs.slice(start, start + PAGE_SIZE);
  }, [filteredSongs, page]);

  const stats = useMemo(() => {
    const total = songs.length;
    const live = songs.filter(
      (song) => getSongStatus(song) === "published",
    ).length;
    const pending = songs.filter(
      (song) => getSongStatus(song) === "pending",
    ).length;
    const streams = songs.reduce(
      (sum, song) => sum + Number(song?.playCount || 0),
      0,
    );

    return { total, live, pending, streams };
  }, [songs]);

  const allVisibleSelected =
    paginatedSongs.length > 0 &&
    paginatedSongs.every((song) => selectedRows.includes(song._id));

  const openSongDrawer = (song) => {
    setSelectedSong(song);
    setDrawerOpen(true);
  };

  const closeSongDrawer = () => {
    setDrawerOpen(false);
    setSelectedSong(null);
  };

  const handleUploadSong = () => {
    navigate("/songs/upload");
  };

  const handleEditSong = (song) => {
    console.log("Edit song:", song);
    toast("Song edit screen will be connected next.");
  };

  const handleSongAnalytics = (song) => {
    console.log("Song analytics:", song);
    toast("Song analytics will be connected next.");
  };

  const handleDuplicateSong = (song) => {
    console.log("Duplicate song:", song);
    toast("Song duplicate will be connected next.");
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmConfig(null);
  };

  const handleDeleteSong = (song) => {
    setConfirmConfig({
      title: "Delete Song",
      description: `Are you sure you want to delete "${song?.title || "this song"}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          await songService.deleteSong(song._id);
          await refreshSongs();
          toast.success("Song deleted successfully.");
          closeConfirm();
        } catch (error) {
          toast.error("Unable to delete song.");
        } finally {
          setConfirmLoading(false);
        }
      },
    });

    setConfirmOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    setConfirmConfig({
      title: "Delete Selected Songs",
      description: `Are you sure you want to delete ${selectedRows.length} selected song(s)? This action cannot be undone.`,
      confirmLabel: "Delete Selected",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          await Promise.all(
            selectedRows.map((id) => songService.deleteSong(id)),
          );
          await refreshSongs();
          toast.success("Selected songs deleted successfully.");
          closeConfirm();
        } catch (error) {
          toast.error("Unable to delete selected songs.");
        } finally {
          setConfirmLoading(false);
        }
      },
    });

    setConfirmOpen(true);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedRows((current) => {
      if (checked) return [...new Set([...current, id])];
      return current.filter((rowId) => rowId !== id);
    });
  };

  const handleSelectAllVisible = (checked) => {
    if (!checked) {
      setSelectedRows((current) =>
        current.filter((id) => !paginatedSongs.some((song) => song._id === id)),
      );
      return;
    }

    setSelectedRows((current) => [
      ...new Set([
        ...current,
        ...paginatedSongs.map((song) => song._id).filter(Boolean),
      ]),
    ]);
  };

  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={(event) => handleSelectAllVisible(event.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-black accent-pink-500"
        />
      ),
      render: (song) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(song._id)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => handleSelectRow(song._id, event.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-black accent-pink-500"
        />
      ),
    },
    {
      key: "cover",
      label: "Cover",
      render: (song) => (
        <CoverImage
          src={song?.coverImage}
          alt={song?.title || "Song cover"}
          className="h-12 w-12 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "song",
      label: "Song",
      render: (song) => (
        <button
          type="button"
          onClick={() => openSongDrawer(song)}
          className="min-w-[190px] text-left"
        >
          <p className="font-medium text-white transition hover:text-pink-400">
            {song?.title || "Untitled"}
          </p>
          <p className="text-sm text-white/40">{getArtistName(song)}</p>
        </button>
      ),
    },
    {
      key: "album",
      label: "Album",
      render: (song) => (
        <span className="text-sm text-white/60">{getAlbumName(song)}</span>
      ),
    },
    {
      key: "genre",
      label: "Genre",
      render: (song) => (
        <span className="text-sm text-white/60">
          {song?.genre || "Not set"}
        </span>
      ),
    },
    {
      key: "language",
      label: "Language",
      render: (song) => (
        <span className="text-sm text-white/60">
          {song?.language || "Not set"}
        </span>
      ),
    },
    {
      key: "streams",
      label: "Streams",
      render: (song) => (
        <span className="text-sm text-white">
          {formatNumber(song?.playCount)}
        </span>
      ),
    },
    {
      key: "premium",
      label: "Access",
      render: (song) =>
        getAccessType(song) === "premium" ? (
          <StatusBadge variant="warning">Premium</StatusBadge>
        ) : (
          <StatusBadge>Free</StatusBadge>
        ),
    },
    {
      key: "audio",
      label: "Audio",
      render: (song) => {
        const audioSource = getAudioSource(song);

        return audioSource ? (
          <AudioPlayer src={audioSource} />
        ) : (
          <span className="text-sm text-white/30">No audio</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (song) => {
        const status = getSongStatus(song);
        return (
          <StatusBadge variant={getStatusVariant(status)}>{status}</StatusBadge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (song) => (
        <div
          className="flex justify-end"
          onClick={(event) => event.stopPropagation()}
        >
          <ActionMenu
            actions={[
              { label: "View", icon: Eye, onClick: () => openSongDrawer(song) },
              {
                label: "Edit",
                icon: Pencil,
                onClick: () => handleEditSong(song),
              },
              {
                label: "Analytics",
                icon: BarChart3,
                onClick: () => handleSongAnalytics(song),
              },
              {
                label: "Duplicate",
                icon: Copy,
                onClick: () => handleDuplicateSong(song),
              },
              {
                label: "Delete",
                icon: Trash2,
                danger: true,
                onClick: () => handleDeleteSong(song),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Songs"
        description="Manage all songs published, pending, and uploaded on Tantha."
        actionLabel="Upload Song"
        actionIcon={Plus}
        onAction={handleUploadSong}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Songs"
          value={formatNumber(stats.total)}
          subtitle="All uploaded tracks"
          icon={Music4}
          color="bg-pink-500/10 text-pink-400"
        />

        <StatCard
          title="Live Songs"
          value={formatNumber(stats.live)}
          subtitle="Published tracks"
          icon={Radio}
          color="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Pending Songs"
          value={formatNumber(stats.pending)}
          subtitle="Awaiting approval"
          icon={Clock3}
          color="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="Total Streams"
          value={formatNumber(stats.streams)}
          subtitle="All-time plays"
          icon={Play}
          color="bg-blue-500/10 text-blue-400"
        />
      </div>

      <SectionCard
        className="overflow-visible"
        title="Song Library"
        description="Search, filter and manage your music catalog."
      >
        <FilterBar className="border-b-0 p-0">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search songs, artists, albums, genre..."
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={premiumFilter}
              onChange={(event) => setPremiumFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500"
            >
              <option value="all">All Access</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>

            <Button
              type="button"
              variant="secondary"
              onClick={refreshSongs}
              disabled={refreshing}
            >
              <RefreshCcw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>
        </FilterBar>

        {selectedRows.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-black p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/60">
              <span className="font-semibold text-white">
                {selectedRows.length}
              </span>{" "}
              song(s) selected
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedRows([])}
              >
                Clear
              </Button>

              <Button type="button" variant="danger" onClick={handleBulkDelete}>
                <Trash2 size={16} />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <div className="mt-5 overflow-visible rounded-2xl border border-white/10 bg-black/40">
          {loading ? (
            <LoadingState message="Loading songs..." />
          ) : filteredSongs.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Music4}
                title="No songs found"
                description="Try changing your search or filters. Newly uploaded songs will appear here after they are stored in MongoDB."
              />
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={paginatedSongs}
                getRowKey={(song) => song._id}
              />

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                  if (nextPage < 1 || nextPage > totalPages) return;
                  setPage(nextPage);
                }}
              />
            </>
          )}
        </div>
      </SectionCard>

      <SongDetailsDrawer
        song={selectedSong}
        open={drawerOpen}
        onClose={closeSongDrawer}
        onEdit={handleEditSong}
        onDelete={handleDeleteSong}
      />

      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig?.title}
        description={confirmConfig?.description}
        confirmLabel={confirmConfig?.confirmLabel}
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={confirmConfig?.onConfirm}
        onClose={closeConfirm}
      />
    </div>
  );
};

export default Songs;
