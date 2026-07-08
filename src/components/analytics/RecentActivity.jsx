import {
  Music2,
  UserRound,
  Album,
  Heart,
  Play,
  IndianRupee,
  Clock,
} from "lucide-react";

const activityIcons = {
  song: Music2,
  artist: UserRound,
  album: Album,
  play: Play,
  like: Heart,
  revenue: IndianRupee,
};

const iconColors = {
  song: "text-pink-400 bg-pink-500/10",
  artist: "text-blue-400 bg-blue-500/10",
  album: "text-purple-400 bg-purple-500/10",
  play: "text-emerald-400 bg-emerald-500/10",
  like: "text-red-400 bg-red-500/10",
  revenue: "text-yellow-400 bg-yellow-500/10",
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>

        <Clock size={18} className="text-zinc-500" />
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type] || Music2;
            const colorClass =
              iconColors[activity.type] || "text-pink-400 bg-pink-500/10";

            return (
              <div
                key={activity._id}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4 transition hover:border-white/10"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass}`}
                >
                  <Icon size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {activity.title}
                  </p>

                  {activity.description && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {activity.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-zinc-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10">
          <div className="text-center">
            <Clock size={34} className="mx-auto mb-3 text-zinc-600" />

            <p className="text-zinc-400">No recent activity found.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
