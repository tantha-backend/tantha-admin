import { Users, Crown, Mic2, ShieldCheck } from "lucide-react";

import StatCard from "../common/StatCard";

function UserStats({ stats = {} }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers || 0}
        icon={Users}
      />

      <StatCard
        title="Premium Users"
        value={stats.premiumUsers || 0}
        icon={Crown}
      />

      <StatCard title="Artists" value={stats.artists || 0} icon={Mic2} />

      <StatCard title="Admins" value={stats.admins || 0} icon={ShieldCheck} />
    </div>
  );
}

export default UserStats;
