import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Coffee, Crown, HeartHandshake, IndianRupee } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";

import AnalyticsStatCard from "../components/analytics/AnalyticsStatCard";

import RevenueChart from "../components/monetization/RevenueChart";
import SubscriptionChart from "../components/monetization/SubscriptionChart";
import CoffeeSupportTable from "../components/monetization/CoffeeSupportTable";
import FanClubTable from "../components/monetization/FanClubTable";
import PremiumTable from "../components/monetization/PremiumTable";
import TopEarningArtists from "../components/monetization/TopEarningArtists";
import RevenueBreakdown from "../components/monetization/RevenueBreakdown";
import RecentTransactions from "../components/monetization/RecentTransactions";
import EarningsFilters from "../components/monetization/EarningsFilters";

import monetizationService from "../services/monetizationService";

const Monetization = () => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [range, setRange] = useState("30d");
  const [source, setSource] = useState("all");
  const [monetization, setMonetization] = useState(null);

  const loadMonetization = async () => {
    try {
      setLoading(true);

      const res = await monetizationService.getMonetization({
        range,
        source,
      });

      setMonetization(res.data || res);
    } catch (error) {
      console.error("Load monetization error:", error);
      toast.error("Failed to load monetization data.");
      setMonetization(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const blob = await monetizationService.exportReport({
        range,
        source,
      });

      const fileBlob = blob instanceof Blob ? blob : new Blob([blob]);

      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `tantha-monetization-${range}-${source}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report exported successfully.");
    } catch (error) {
      console.error("Export monetization error:", error);
      toast.error("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    loadMonetization();
  }, [range, source]);

  if (loading) {
    return <LoadingState text="Loading monetization data..." />;
  }

  if (!monetization) {
    return (
      <EmptyState
        title="No Monetization Data"
        description="Revenue and transaction data is currently unavailable."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monetization"
        subtitle="Track revenue, subscriptions, fan support and artist earnings."
      />

      <EarningsFilters
        range={range}
        setRange={setRange}
        source={source}
        setSource={setSource}
        loading={loading || exporting}
        onRefresh={loadMonetization}
        onExport={handleExport}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          title="Total Revenue"
          value={`₹${monetization.totalRevenue || 0}`}
          icon={IndianRupee}
          change="+15.2%"
          description="All monetization sources"
        />

        <AnalyticsStatCard
          title="Premium Revenue"
          value={`₹${monetization.premiumRevenue || 0}`}
          icon={Crown}
          change="+9.8%"
          description="Premium subscriptions"
        />

        <AnalyticsStatCard
          title="Coffee Support"
          value={`₹${monetization.coffeeRevenue || 0}`}
          icon={Coffee}
          change="+6.4%"
          description="Fan donations"
        />

        <AnalyticsStatCard
          title="Fan Club Revenue"
          value={`₹${monetization.fanClubRevenue || 0}`}
          icon={HeartHandshake}
          change="+11.7%"
          description="Fan club memberships"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart
          title="Revenue Trend"
          data={monetization.revenueChart || []}
          dataKey="revenue"
        />

        <SubscriptionChart
          title="Subscription Revenue"
          data={monetization.subscriptionChart || []}
          dataKey="value"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueBreakdown data={monetization.revenueBreakdown || []} />

        <TopEarningArtists artists={monetization.topEarningArtists || []} />
      </div>

      <div className="grid gap-6">
        <PremiumTable subscribers={monetization.premiumSubscribers || []} />

        <FanClubTable memberships={monetization.fanClubMemberships || []} />

        <CoffeeSupportTable supports={monetization.coffeeSupports || []} />

        <RecentTransactions
          transactions={monetization.recentTransactions || []}
        />
      </div>
    </div>
  );
};

export default Monetization;
