import { RefreshCcw } from "lucide-react";

import Button from "../ui/Button";

const AnalyticsFilters = ({
  range,
  setRange,
  metric,
  setMetric,
  loading,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="12m">Last 12 months</option>
        </select>

        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
        >
          <option value="streams">Streams</option>
          <option value="likes">Likes</option>
          <option value="users">Users</option>
          <option value="revenue">Revenue</option>
        </select>
      </div>

      <Button onClick={onRefresh} disabled={loading}>
        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        Refresh
      </Button>
    </div>
  );
};

export default AnalyticsFilters;
