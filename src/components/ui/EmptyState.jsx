const EmptyState = ({
  icon,
  title = "No data found",
  description = "There is nothing to show right now.",
  action,
}) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center p-8">
      <div className="max-w-sm text-center">
        {icon && (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-500">
            {icon}
          </div>
        )}

        <h3 className="text-base font-semibold text-white">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
