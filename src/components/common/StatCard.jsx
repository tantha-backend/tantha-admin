function StatCard({ title, value, subtitle, icon: Icon, color = "" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{value}</h2>
          {subtitle && <p className="mt-2 text-sm text-white/40">{subtitle}</p>}
        </div>

        {Icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
