import Button from "../ui/Button";

const PageHeader = ({
  title,
  description,
  subtitle,
  action,
  children,
  className = "",
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
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

      {(action || children || actionLabel) && (
        <div className="flex flex-wrap items-center gap-3">
          {action || children || (
            <Button type="button" onClick={onAction}>
              {ActionIcon && <ActionIcon size={18} />}
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
