import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Crown,
  Eye,
  MoreVertical,
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    user: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    artist: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    admin: "border-red-500/30 bg-red-500/10 text-red-300",
    premium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    free: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
    active: "border-green-500/30 bg-green-500/10 text-green-300",
    suspended: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    deactivated: "border-red-500/30 bg-red-500/10 text-red-300",
    default: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
        variants[variant] || variants.default
      }`}
    >
      {children}
    </span>
  );
};

const UserActionMenu = ({
  user,
  onView,
  onEdit,
  onDelete,
  onTogglePremium,
  onToggleStatus,
}) => {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const isSuspended = user?.status === "suspended";

  const closeMenu = () => {
    setOpen(false);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: Math.max(rect.right - 224, 16),
    });

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClose = () => {
      closeMenu();
    };

    window.addEventListener("click", handleClose);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);

    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  const actions = [
    {
      label: "View User",
      icon: Eye,
      onClick: () => onView(user),
    },
    {
      label: "Edit User",
      icon: Pencil,
      onClick: () => onEdit(user),
    },
    {
      label: user?.isPremium ? "Remove Premium" : "Enable Premium",
      icon: Crown,
      onClick: () => onTogglePremium(user),
      separated: true,
    },
    {
      label: isSuspended ? "Activate User" : "Suspend User",
      icon: isSuspended ? ShieldCheck : ShieldOff,
      onClick: () => onToggleStatus(user),
    },
    {
      label: "Delete User",
      icon: Trash2,
      onClick: () => onDelete(user),
      danger: true,
      separated: true,
    },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black text-zinc-400 transition hover:border-white/20 hover:bg-zinc-900 hover:text-white"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[9999] w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60"
            style={{
              top: position.top,
              left: position.left,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    closeMenu();
                    action.onClick();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                    action.separated ? "border-t border-white/10" : ""
                  } ${
                    action.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {action.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
};

const UserTable = ({
  users = [],
  onView,
  onEdit,
  onDelete,
  onTogglePremium,
  onToggleStatus,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                User
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Role
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Premium
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Joined
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {users.map((user) => {
              const role = user.role || "user";
              const premium = user.isPremium ? "premium" : "free";
              const status = user.status || "active";

              return (
                <tr key={user._id} className="transition hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name || "User"}
                          className="h-11 w-11 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-pink-500/15 text-sm font-bold text-pink-300">
                          {getInitials(user.name)}
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-white">
                          {user.name || "Unnamed User"}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant={role}>{role}</Badge>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant={premium}>{premium}</Badge>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant={status}>{status}</Badge>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-400">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <UserActionMenu
                        user={user}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTogglePremium={onTogglePremium}
                        onToggleStatus={onToggleStatus}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
