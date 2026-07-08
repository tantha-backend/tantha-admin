import { BadgeCheck, DollarSign, Music4, Users } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>

          <p className="mt-2 text-sm text-white/40">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

function ArtistStats({ artists = [] }) {
  const totalArtists = artists.length;

  const verifiedArtists = artists.filter((artist) => artist.isVerified).length;

  const monetizedArtists = artists.filter(
    (artist) => artist.isMonetized,
  ).length;

  const totalFanClubRevenue = artists.reduce(
    (sum, artist) => sum + (artist.fanClubPrice || 0),
    0,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        title="Total Artists"
        value={totalArtists}
        subtitle="Registered artist profiles"
        color="bg-pink-500/10 text-pink-400"
      />

      <StatCard
        icon={BadgeCheck}
        title="Verified Artists"
        value={verifiedArtists}
        subtitle="Official verified creators"
        color="bg-emerald-500/10 text-emerald-400"
      />

      <StatCard
        icon={Music4}
        title="Monetized Artists"
        value={monetizedArtists}
        subtitle="Coffee & Fan Club enabled"
        color="bg-blue-500/10 text-blue-400"
      />

      <StatCard
        icon={DollarSign}
        title="Fan Club Value"
        value={`₹${totalFanClubRevenue}`}
        subtitle="Combined monthly subscription"
        color="bg-yellow-500/10 text-yellow-400"
      />
    </div>
  );
}

export default ArtistStats;
