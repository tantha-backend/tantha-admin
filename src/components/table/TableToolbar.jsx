import { Trash2, CheckCircle2, XCircle } from "lucide-react";

const TableToolbar = ({
  selectedCount = 0,
  onClearSelection,
  actions = [],
}) => {
  if (selectedCount <= 0) return null;

  const defaultIcon = (type) => {
    if (type === "delete") return <Trash2 size={16} />;
    if (type === "approve") return <CheckCircle2 size={16} />;
    if (type === "reject") return <XCircle size={16} />;
    return null;
  };

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-800 bg-neutral-900/60 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-neutral-300">
        <span className="font-semibold text-white">{selectedCount}</span>{" "}
        selected
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition ${
              action.variant === "danger"
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {action.icon || defaultIcon(action.type)}
            {action.label}
          </button>
        ))}

        <button
          onClick={onClearSelection}
          className="h-9 rounded-lg px-3 text-sm text-neutral-500 hover:text-white"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TableToolbar;
