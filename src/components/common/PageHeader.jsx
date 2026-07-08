const PageHeader = ({
  title,
  description,
  subtitle,
  action,
  children,
  className = "",
}) => {
  const finalDescription = description || subtitle;

  return (
    <div
      className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>

        {finalDescription && (
          <p className="mt-2 text-sm text-zinc-400">{finalDescription}</p>
        )}
      </div>

      {(action || children) && (
        <div className="flex flex-wrap items-center gap-3">
          {action || children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
