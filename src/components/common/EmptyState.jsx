function EmptyState({
  title = "No data found",
  description = "There is nothing to show here yet.",
  icon: Icon,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40">
          <Icon size={26} />
        </div>
      )}

      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-white/40">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
