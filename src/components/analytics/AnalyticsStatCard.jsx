import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const AnalyticsStatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = "positive",
  description,
}) => {
  const isPositive = changeType === "positive";

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-zinc-500">{description}</p>
          )}
        </div>

        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white">
            <Icon size={22} />
          </div>
        )}
      </div>

      {change && (
        <div className="mt-5 flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {change}
          </span>

          <span className="text-xs text-zinc-500">vs previous period</span>
        </div>
      )}
    </div>
  );
};

export default AnalyticsStatCard;
