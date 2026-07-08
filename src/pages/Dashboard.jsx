import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Album,
  Crown,
  DollarSign,
  Headphones,
  Music,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import dashboardService from "../services/dashboardService";
import Button from "../components/ui/Button";

const formatNumber = (value) => {
  if (value === undefined || value === null) return "0";
  return Number(value).toLocaleString("en-IN");
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const StatCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm transition hover:border-pink-500/40 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-zinc-400">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
        {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
      </div>
    </div>
  );
};

const RecentSongCard = ({ song }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
      <img
        src={song.coverImage || "/placeholder-cover.png"}
        alt={song.title}
        className="h-14 w-14 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-white">{song.title}</h4>
        <p className="truncate text-sm text-zinc-400">
          {song.artistId?.stageName ||
            song.artistId?.artistName ||
            "Unknown Artist"}
        </p>
      </div>

      <div className="text-right text-xs text-zinc-500">
        <p>{formatNumber(song.playCount)} plays</p>
        <p>{song.status}</p>
      </div>
    </div>
  );
};

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardData, analyticsData, revenueData] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getAnalyticsDashboard(),
        dashboardService.getRevenueOverview(),
      ]);

      setDashboard(dashboardData);
      setAnalytics(analyticsData);
      setRevenue(revenueData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const base = dashboard?.analytics || {};
    const overview = analytics?.dashboard?.overview || {};
    const revenueOverview = revenue?.overview || {};

    return [
      {
        title: "Total Users",
        value: formatNumber(base.totalUsers || overview.users),
        icon: Users,
        subtitle: "Registered users",
      },
      {
        title: "Artists",
        value: formatNumber(base.totalArtists || overview.artists),
        icon: Headphones,
        subtitle: "Artist accounts",
      },
      {
        title: "Songs",
        value: formatNumber(base.totalSongs || overview.songs),
        icon: Music,
        subtitle: "Total uploaded songs",
      },
      {
        title: "Albums",
        value: formatNumber(overview.albums),
        icon: Album,
        subtitle: "Total albums",
      },
      {
        title: "Premium Users",
        value: formatNumber(base.premiumUsers || overview.premiumUsers),
        icon: Crown,
        subtitle: "Active premium users",
      },
      {
        title: "Revenue",
        value: formatCurrency(revenueOverview.totalRevenue || 0),
        icon: DollarSign,
        subtitle: "Last 30 days",
      },
      {
        title: "Total Streams",
        value: formatNumber(base.totalStreams),
        icon: TrendingUp,
        subtitle: "Platform streams",
      },
      {
        title: "Pending Songs",
        value: formatNumber(base.pendingSongs || overview.pendingSongs),
        icon: Activity,
        subtitle: "Awaiting approval",
      },
    ];
  }, [dashboard, analytics, revenue]);

  const recentSongs = dashboard?.recentSongs || [];
  const topSongs = analytics?.dashboard?.topContent?.songs || [];
  const topArtists = analytics?.dashboard?.topContent?.artists || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/10" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Overview of Tantha Music platform performance.
          </p>
        </div>

        <Button onClick={fetchDashboard} disabled={loading}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-semibold text-white">Recent Songs</h2>
          <div className="mt-4 space-y-3">
            {recentSongs.length > 0 ? (
              recentSongs.map((song) => (
                <RecentSongCard key={song._id} song={song} />
              ))
            ) : (
              <p className="text-sm text-zinc-500">No recent songs found.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-semibold text-white">Top Songs</h2>
          <div className="mt-4 space-y-3">
            {topSongs.length > 0 ? (
              topSongs.map((song) => (
                <RecentSongCard key={song._id} song={song} />
              ))
            ) : (
              <p className="text-sm text-zinc-500">No top songs found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold text-white">Top Artists</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topArtists.length > 0 ? (
            topArtists.map((artist) => (
              <div
                key={artist._id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <h4 className="font-semibold text-white">
                  {artist.stageName || artist.artistName || "Unnamed Artist"}
                </h4>
                <p className="mt-1 text-sm text-zinc-400">
                  {formatNumber(artist.followersCount)} followers
                </p>
                <p className="text-sm text-zinc-500">
                  {formatNumber(artist.monthlyListeners)} monthly listeners
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No artists found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
