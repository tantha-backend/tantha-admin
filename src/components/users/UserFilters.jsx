import { RefreshCw, Search } from "lucide-react";

import Button from "../ui/Button";

function UserFilters({
  search = "",
  role = "",
  status = "",
  premium = "",
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onPremiumChange,
  onRefresh,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search users by name or email..."
            className="h-11 w-full rounded-lg border border-white/10 bg-black pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-pink-500"
          />
        </div>

        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value)}
          className="h-11 rounded-lg border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-pink-500"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="artist">Artist</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-11 rounded-lg border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-pink-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deactivated">Deactivated</option>
        </select>

        <select
          value={premium}
          onChange={(event) => onPremiumChange(event.target.value)}
          className="h-11 rounded-lg border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-pink-500"
        >
          <option value="">All Premium</option>
          <option value="true">Premium</option>
          <option value="false">Free</option>
        </select>

        <Button variant="secondary" onClick={onRefresh}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>
    </div>
  );
}

export default UserFilters;
