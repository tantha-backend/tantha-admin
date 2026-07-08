const variants = {
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

  warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

  danger: "bg-red-500/10 text-red-400 border border-red-500/20",

  info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",

  default: "bg-white/5 text-white/60 border border-white/10",
};

function StatusBadge({ children, variant = "default" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        variants[variant]
      }`}
    >
      {children}
    </span>
  );
}

export default StatusBadge;
