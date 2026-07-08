import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Edit,
  Eye,
  Music4,
  Trash2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import FilterBar from "../components/common/FilterBar";
import SearchBar from "../components/common/SearchBar";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import ActionMenu from "../components/common/ActionMenu";
import ConfirmModal from "../components/common/ConfirmModal";
import Button from "../components/ui/Button";

import artistService from "../services/artistService";

const getArtistName = (artist) => artist.stageName || artist.userId?.name || "";
const getArtistEmail = (artist) => artist.userId?.email || "";
const getUserName = (artist) => artist.userId?.name || "";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Artists() {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchArtists = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await artistService.getAllArtists();
      setArtists(res.artists || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load artists.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const stats = useMemo(() => {
    const totalArtists = artists.length;
    const verifiedArtists = artists.filter(
      (artist) => artist.isVerified,
    ).length;
    const monetizedArtists = artists.filter(
      (artist) => artist.isMonetized,
    ).length;

    const fanClubValue = artists.reduce(
      (sum, artist) => sum + (artist.fanClubPrice || 0),
      0,
    );

    return {
      totalArtists,
      verifiedArtists,
      monetizedArtists,
      fanClubValue,
    };
  }, [artists]);

  const filteredArtists = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return artists;

    return artists.filter((artist) => {
      return (
        getArtistName(artist).toLowerCase().includes(query) ||
        getArtistEmail(artist).toLowerCase().includes(query) ||
        getUserName(artist).toLowerCase().includes(query) ||
        (artist.bio || "").toLowerCase().includes(query)
      );
    });
  }, [artists, searchTerm]);

  const handleViewArtist = (artist) => {
    if (!artist?._id) return;
    navigate(`/artists/${artist._id}`);
  };

  const handleEditArtist = (artist) => {
    if (!artist?._id) return;
    navigate(`/artists/${artist._id}/edit`);
  };

  const openDeleteModal = (artistId) => {
    const artist = artists.find((item) => item._id === artistId);

    if (!artist) return;

    setSelectedArtist(artist);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedArtist(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedArtist?._id) return;

    try {
      setDeletingId(selectedArtist._id);

      await artistService.deleteArtist(selectedArtist._id);

      setArtists((prev) =>
        prev.filter((artist) => artist._id !== selectedArtist._id),
      );

      closeDeleteModal();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete artist.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "artist",
      label: "Artist",
      render: (artist) => {
        const artistName = getArtistName(artist);

        return (
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
              <h4 className="font-medium text-white">
                {artistName || "Unnamed Artist"}
              </h4>
              <p className="text-xs text-white/35">ID: {artist._id}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "user",
      label: "User",
      render: (artist) => (
        <span className="text-white/60">
          {getUserName(artist) || "No User"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (artist) => (
        <span className="text-white/60">
          {getArtistEmail(artist) || "No Email"}
        </span>
      ),
    },
    {
      key: "verification",
      label: "Verification",
      render: (artist) =>
        artist.isVerified ? (
          <StatusBadge variant="success">Verified</StatusBadge>
        ) : (
          <StatusBadge>Not Verified</StatusBadge>
        ),
    },
    {
      key: "fanClubPrice",
      label: "Fan Club",
      render: (artist) => (
        <span className="text-white/60">₹{artist.fanClubPrice ?? 99}</span>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (artist) => (
        <span className="text-white/60">{formatDate(artist.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (artist) => (
        <div className="flex justify-end">
          <ActionMenu
            actions={[
              {
                label: "View",
                icon: Eye,
                onClick: () => handleViewArtist(artist),
              },
              {
                label: "Edit",
                icon: Edit,
                onClick: () => handleEditArtist(artist),
              },
              {
                label: "Delete",
                icon: Trash2,
                danger: true,
                disabled: deletingId === artist._id,
                onClick: () => openDeleteModal(artist._id),
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
        title="Artists"
        description="Manage artist profiles, verification, fan clubs and monetization."
        actionLabel="Add Artist"
        actionIcon={UserPlus}
        onAction={() => navigate("/artists/create")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Artists"
          value={stats.totalArtists}
          subtitle="Registered artist profiles"
          icon={Users}
          color="bg-pink-500/10 text-pink-400"
        />

        <StatCard
          title="Verified Artists"
          value={stats.verifiedArtists}
          subtitle="Official verified creators"
          icon={BadgeCheck}
          color="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Monetized Artists"
          value={stats.monetizedArtists}
          subtitle="Coffee & Fan Club enabled"
          icon={Music4}
          color="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Fan Club Value"
          value={`₹${stats.fanClubValue}`}
          subtitle="Combined monthly subscription"
          icon={Wallet}
          color="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      <SectionCard>
        <FilterBar>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search artists, users, email or bio..."
          />

          <Button
            type="button"
            variant="secondary"
            onClick={() => fetchArtists(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </FilterBar>

        {error ? (
          <div className="p-10 text-center text-sm text-red-400">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredArtists}
            loading={loading}
            emptyMessage="No artists found."
            getRowKey={(artist) => artist._id}
          />
        )}
      </SectionCard>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Artist"
        description={
          selectedArtist
            ? `Are you sure you want to delete ${getArtistName(
                selectedArtist,
              )}? This action cannot be undone.`
            : "Are you sure you want to delete this artist?"
        }
        confirmLabel="Delete Artist"
        loading={deletingId !== null}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Artists;
