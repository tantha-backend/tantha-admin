import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Activity, IndianRupee, Music2, Users } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";

import AnalyticsStatCard from "../components/analytics/AnalyticsStatCard";
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import AnalyticsLineChart from "../components/analytics/AnalyticsLineChart";
import AnalyticsBarChart from "../components/analytics/AnalyticsBarChart";
import GenreChart from "../components/analytics/GenreChart";
import LanguageChart from "../components/analytics/LanguageChart";
import TopSongsTable from "../components/analytics/TopSongsTable";
import TopArtistsTable from "../components/analytics/TopArtistsTable";
import RecentActivity from "../components/analytics/RecentActivity";

import analyticsService from "../services/analyticsService";

const getDaysFromRange = (range) => {
  if (range === "7d") return 7;
  if (range === "90d") return 90;
  if (range === "1y") return 365;
  return 30;
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [range, setRange] = useState("30d");
  const [metric, setMetric] = useState("streams");

  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const days = getDaysFromRange(range);

      const [
        dashboardRes,
        chartsRes,
        platformRes,
        topContentRes,
        genresRes,
        languagesRes,
        growthRes,
        statusRes,
        revenueRes,
        recentActivityRes,
      ] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getCharts(days),
        analyticsService.getPlatform(),
        analyticsService.getTopContent(10),
        analyticsService.getGenres(),
        analyticsService.getLanguages(),
        analyticsService.getGrowth(days),
        analyticsService.getStatus(),
        analyticsService.getRevenue(),
        analyticsService.getRecentActivity(10),
      ]);

      const dashboard =
        dashboardRes?.dashboard ||
        dashboardRes?.data?.dashboard ||
        dashboardRes;

      const overview =
        dashboard?.overview ||
        dashboardRes?.overview ||
        dashboardRes?.data?.overview ||
        {};

      const topContent =
        topContentRes?.topContent ||
        topContentRes?.data?.topContent ||
        topContentRes?.data ||
        topContentRes ||
        {};

      const revenue =
        revenueRes?.revenue ||
        revenueRes?.overview ||
        revenueRes?.data?.revenue ||
        revenueRes?.data?.overview ||
        revenueRes?.data ||
        revenueRes ||
        {};

      const charts =
        chartsRes?.charts ||
        chartsRes?.data?.charts ||
        chartsRes?.data ||
        chartsRes ||
        {};

      const growth =
        growthRes?.growth ||
        growthRes?.data?.growth ||
        growthRes?.data ||
        growthRes ||
        {};

      const platform =
        platformRes?.platform ||
        platformRes?.data?.platform ||
        platformRes?.data ||
        platformRes ||
        {};

      const status =
        statusRes?.status ||
        statusRes?.data?.status ||
        statusRes?.data ||
        statusRes ||
        {};

      setAnalytics({
        totalStreams:
          overview.totalStreams ||
          overview.streams ||
          dashboard?.totalStreams ||
          platform.totalStreams ||
          0,

        totalSongs:
          overview.totalSongs ||
          overview.songs ||
          dashboard?.totalSongs ||
          platform.totalSongs ||
          0,

        activeUsers:
          overview.activeUsers ||
          overview.monthlyListeners ||
          overview.users ||
          platform.activeUsers ||
          platform.totalUsers ||
          0,

        revenue:
          revenue.totalRevenue ||
          revenue.revenue ||
          revenue.amount ||
          overview.revenue ||
          0,

        streamChart: normalizeArray(
          charts.streams ||
            charts.streamChart ||
            charts.dailyStreams ||
            charts.timeline ||
            growth.streams ||
            growth.chart ||
            growth.timeline,
        ),

        monthlyChart: normalizeArray(
          charts.monthly ||
            charts.monthlyChart ||
            charts.performance ||
            growth.monthly ||
            growth.performance,
        ),

        genreDistribution: normalizeArray(
          genresRes?.genres ||
            genresRes?.genreDistribution ||
            genresRes?.data?.genres ||
            genresRes?.data?.genreDistribution ||
            genresRes,
        ),

        languageDistribution: normalizeArray(
          languagesRes?.languages ||
            languagesRes?.languageDistribution ||
            languagesRes?.data?.languages ||
            languagesRes?.data?.languageDistribution ||
            languagesRes,
        ),

        topSongs: normalizeArray(
          topContent.songs ||
            topContent.topSongs ||
            dashboard?.topContent?.songs ||
            dashboard?.topSongs,
        ),

        topArtists: normalizeArray(
          topContent.artists ||
            topContent.topArtists ||
            dashboard?.topContent?.artists ||
            dashboard?.topArtists,
        ),

        recentActivity: normalizeArray(
          recentActivityRes?.activities ||
            recentActivityRes?.recentActivity ||
            recentActivityRes?.data?.activities ||
            recentActivityRes?.data?.recentActivity ||
            recentActivityRes,
        ),

        status,
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);
      toast.error("Failed to load analytics.");
      setAnalytics(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [range, metric]);

  const filteredChartData = useMemo(() => {
    if (!analytics) return [];

    if (metric === "revenue") {
      return analytics.monthlyChart || [];
    }

    return analytics.streamChart || [];
  }, [analytics, metric]);

  if (loading) {
    return <LoadingState text="Loading analytics..." />;
  }

  if (!analytics) {
    return (
      <EmptyState
        title="No Analytics Found"
        description="Analytics data is currently unavailable."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Platform insights, performance and engagement overview."
      />

      <AnalyticsFilters
        range={range}
        setRange={setRange}
        metric={metric}
        setMetric={setMetric}
        loading={refreshing}
        onRefresh={() => loadAnalytics(true)}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          title="Total Streams"
          value={analytics.totalStreams || 0}
          icon={Activity}
          change="+12.8%"
          description="Across all songs"
        />

        <AnalyticsStatCard
          title="Total Songs"
          value={analytics.totalSongs || 0}
          icon={Music2}
          change="+6.1%"
          description="Published songs"
        />

        <AnalyticsStatCard
          title="Active Users"
          value={analytics.activeUsers || 0}
          icon={Users}
          change="+8.4%"
          description="Monthly listeners"
        />

        <AnalyticsStatCard
          title="Revenue"
          value={`₹${analytics.revenue || 0}`}
          icon={IndianRupee}
          change="+15.2%"
          description="Platform earnings"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnalyticsLineChart
          title={metric === "revenue" ? "Revenue Trend" : "Streaming Trend"}
          data={filteredChartData}
          dataKey={metric === "revenue" ? "revenue" : "value"}
        />

        <AnalyticsBarChart
          title="Monthly Performance"
          data={analytics.monthlyChart || []}
          dataKey="value"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GenreChart data={analytics.genreDistribution || []} />

        <LanguageChart data={analytics.languageDistribution || []} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TopSongsTable songs={analytics.topSongs || []} />

        <TopArtistsTable artists={analytics.topArtists || []} />
      </div>

      <RecentActivity activities={analytics.recentActivity || []} />
    </div>
  );
};

export default Analytics;
