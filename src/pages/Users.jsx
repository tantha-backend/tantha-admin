import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "../components/ui/Button";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";

import UserStats from "../components/users/UserStats";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import DeleteUserModal from "../components/users/DeleteUserModal";

import userService from "../services/userService";

const getPayload = (response) => {
  if (response?.data?.data) return response.data.data;
  if (response?.data) return response.data;
  return response;
};

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    artists: 0,
    admins: 0,
    activeUsers: 0,
    suspendedUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [premium, setPremium] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filters = useMemo(
    () => ({
      search,
      role,
      status,
      premium,
      page: currentPage,
      limit: 10,
    }),
    [search, role, status, premium, currentPage],
  );

  const fetchUsers = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await userService.getUsers(filters);
        const payload = getPayload(response);

        setUsers(Array.isArray(payload?.users) ? payload.users : []);

        setStats({
          totalUsers: payload?.stats?.totalUsers || 0,
          premiumUsers: payload?.stats?.premiumUsers || 0,
          artists: payload?.stats?.artists || 0,
          admins: payload?.stats?.admins || 0,
          activeUsers: payload?.stats?.activeUsers || 0,
          suspendedUsers: payload?.stats?.suspendedUsers || 0,
        });

        setTotalPages(payload?.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Fetch users error:", error);
        toast.error(error?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    navigate("/users/create");
  };

  const handleViewUser = (user) => {
    navigate(`/users/${user._id}`);
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user._id}/edit`);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setSelectedUser(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser?._id) return;

    try {
      setDeleting(true);

      await userService.deleteUser(selectedUser._id);

      toast.success("User deleted successfully");

      setSelectedUser(null);
      setDeleteModalOpen(false);

      fetchUsers(true);
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePremium = async (user) => {
    if (!user?._id) return;

    try {
      await userService.togglePremium(user._id, {
        isPremium: !user.isPremium,
      });

      toast.success(
        user.isPremium
          ? "Premium removed successfully"
          : "Premium enabled successfully",
      );

      fetchUsers(true);
    } catch (error) {
      console.error("Toggle premium error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update premium status",
      );
    }
  };

  const handleToggleStatus = async (user) => {
    if (!user?._id) return;

    const nextStatus = user.status === "suspended" ? "active" : "suspended";

    try {
      await userService.toggleStatus(user._id, {
        status: nextStatus,
      });

      toast.success(
        nextStatus === "active"
          ? "User activated successfully"
          : "User suspended successfully",
      );

      fetchUsers(true);
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update user status",
      );
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePremiumChange = (value) => {
    setPremium(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchUsers(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage users, artists, admins, premium access, and account status.
          </p>
        </div>

        <Button onClick={handleAddUser}>
          <Plus size={18} />
          Add User
        </Button>
      </div>

      <UserStats stats={stats} loading={loading} />

      <UserFilters
        search={search}
        role={role}
        status={status}
        premium={premium}
        refreshing={refreshing}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onPremiumChange={handlePremiumChange}
        onRefresh={handleRefresh}
      />

      {loading ? (
        <LoadingState title="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try changing the search or filter options."
        />
      ) : (
        <>
          <UserTable
            users={users}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteClick}
            onTogglePremium={handleTogglePremium}
            onToggleStatus={handleToggleStatus}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <DeleteUserModal
        open={deleteModalOpen}
        user={selectedUser}
        loading={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Users;
