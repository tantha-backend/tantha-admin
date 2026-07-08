import { Download, RefreshCcw } from "lucide-react";

import Button from "../ui/Button";

const EarningsFilters = ({
  range,
  setRange,
  source,
  setSource,
  loading,
  onRefresh,
  onExport,
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
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500"
        >
          <option value="all">All Sources</option>
          <option value="premium">Premium</option>
          <option value="coffee">Coffee Support</option>
          <option value="fanclub">Fan Club</option>
          <option value="artist">Artist Earnings</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="secondary" onClick={onExport}>
          <Download size={16} />
          Export
        </Button>

        <Button onClick={onRefresh} disabled={loading}>
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default EarningsFilters;
