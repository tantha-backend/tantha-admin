function SectionCard({ title, description, action, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-white/40">{description}</p>
            )}
          </div>

          {action && <div>{action}</div>}
        </div>
      )}

      <div className="p-6">{children}</div>
    </div>
  );
}

export default SectionCard;
