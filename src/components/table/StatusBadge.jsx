import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const map = {
    live: {
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-400",
      text: "Live",
    },

    pending: {
      icon: Clock3,
      color: "bg-yellow-500/10 text-yellow-400",
      text: "Pending",
    },

    rejected: {
      icon: XCircle,
      color: "bg-red-500/10 text-red-400",
      text: "Rejected",
    },
  };

  const badge =
    typeof status === "boolean"
      ? status
        ? map.live
        : map.pending
      : map[status] || map.pending;

  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${badge.color}`}
    >
      <Icon size={14} />
      {badge.text}
    </span>
  );
};

export default StatusBadge;
