import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "../components/ui/Button";
import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";

import DeleteUserModal from "../components/users/DeleteUserModal";

import userService from "../services/userService";

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name = "") => {
  return (
    name
      ?.split(" ")
      ?.map((part) => part[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U"
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
      <span className="text-sm text-white/50">{label}</span>
      <span className="max-w-[65%] text-right text-sm font-medium text-white">
        {value || "Not available"}
      </span>
    </div>
  );
};

const StatBox = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm text-white/50">{label}</p>
      <h3 className="mt-2 text-2xl font-bold text-white">{value || 0}</h3>
    </div>
  );
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSuspended = user?.status === "suspended";

  const profileName = useMemo(() => {
    return user?.name || user?.stageName || "Unnamed User";
  }, [user]);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);

      const [userRes, analyticsRes] = await Promise.allSettled([
        userService.getUserById(id),
        userService.getUserAnalytics(id),
      ]);

      if (userRes.status === "fulfilled") {
        const payload = userRes.value?.data || userRes.value;
        setUser(payload?.user || payload);
      } else {
        throw userRes.reason;
      }

      if (analyticsRes.status === "fulfilled") {
        const payload = analyticsRes.value?.data || analyticsRes.value;
        setAnalytics(payload?.analytics || payload);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleBack = () => {
    navigate("/users");
  };

  const handleEdit = () => {
    navigate(`/users/${id}/edit`);
  };

  const handleTogglePremium = async () => {
    if (!user?._id) return;

    try {
      setActionLoading(true);

      await userService.togglePremium(user._id, {
        isPremium: !user.isPremium,
      });

      toast.success(
        user.isPremium
          ? "Premium removed successfully"
          : "Premium enabled successfully",
      );

      fetchUserDetails();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update premium status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user?._id) return;

    const nextStatus = isSuspended ? "active" : "suspended";

    try {
      setActionLoading(true);

      await userService.toggleStatus(user._id, {
        status: nextStatus,
      });

      toast.success(
        nextStatus === "active"
          ? "User activated successfully"
          : "User suspended successfully",
      );

      fetchUserDetails();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update user status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user?._id) return;

    try {
      setDeleting(true);

      await userService.deleteUser(user._id);

      toast.success("User deleted successfully");
      navigate("/users");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState title="Loading user details..." />;
  }

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="The user may have been deleted or does not exist."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Details"
        description="View user account information, premium status, role, and analytics."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={handleBack}>
              <ArrowLeft size={18} />
              Back to Users
            </Button>

            <Button variant="secondary" onClick={handleEdit}>
              <Edit size={18} />
              Edit User
            </Button>

            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        }
      />

      <SectionCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={profileName}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-500/20 text-2xl font-bold text-pink-300">
                {getInitials(profileName)}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-white">{profileName}</h2>
              <p className="mt-1 text-sm text-white/50">{user.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={user.role || "user"} />
                <StatusBadge status={user.status || "active"} />
                <StatusBadge status={user.isPremium ? "premium" : "free"} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              disabled={actionLoading}
              onClick={handleTogglePremium}
            >
              {user.isPremium ? "Remove Premium" : "Enable Premium"}
            </Button>

            <Button
              variant={isSuspended ? "secondary" : "danger"}
              disabled={actionLoading}
              onClick={handleToggleStatus}
            >
              {isSuspended ? "Activate User" : "Suspend User"}
            </Button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Account Information">
          <InfoRow label="User ID" value={user._id} />
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={user.role} />
          <InfoRow label="Status" value={user.status || "active"} />
          <InfoRow
            label="Premium"
            value={user.isPremium ? "Enabled" : "Disabled"}
          />
          <InfoRow
            label="Premium Expires"
            value={formatDate(user.premiumExpiresAt)}
          />
          <InfoRow label="Joined" value={formatDate(user.createdAt)} />
          <InfoRow label="Last Login" value={formatDateTime(user.lastLogin)} />
        </SectionCard>

        <SectionCard title="User Analytics">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatBox
              label="Liked Songs"
              value={analytics?.likedSongsCount || analytics?.likedSongs || 0}
            />
            <StatBox
              label="Playlists"
              value={analytics?.playlistsCount || analytics?.playlists || 0}
            />
            <StatBox
              label="Following Artists"
              value={
                analytics?.followingArtistsCount ||
                analytics?.followingArtists ||
                0
              }
            />
            <StatBox
              label="Listening History"
              value={
                analytics?.listeningHistoryCount ||
                analytics?.listeningHistory ||
                0
              }
            />
          </div>
        </SectionCard>
      </div>

      {user.role === "artist" && (
        <SectionCard title="Artist Information">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox
              label="Total Songs"
              value={analytics?.totalSongs || analytics?.songsCount || 0}
            />
            <StatBox
              label="Total Streams"
              value={analytics?.totalStreams || analytics?.streams || 0}
            />
            <StatBox
              label="Followers"
              value={analytics?.followers || analytics?.followersCount || 0}
            />
            <StatBox
              label="Monthly Listeners"
              value={analytics?.monthlyListeners || 0}
            />
          </div>
        </SectionCard>
      )}

      <SectionCard title="Quick Actions">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleEdit}>
            Edit User
          </Button>

          <Button
            variant="secondary"
            disabled={actionLoading}
            onClick={handleTogglePremium}
          >
            {user.isPremium ? "Remove Premium" : "Enable Premium"}
          </Button>

          <Button
            variant={isSuspended ? "secondary" : "danger"}
            disabled={actionLoading}
            onClick={handleToggleStatus}
          >
            {isSuspended ? "Activate User" : "Suspend User"}
          </Button>

          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            Delete User
          </Button>
        </div>
      </SectionCard>

      <DeleteUserModal
        open={deleteModalOpen}
        user={user}
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserDetails;
