import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Crown,
  ShieldOff,
  ShieldCheck,
  MoreVertical,
} from "lucide-react";

import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

  const closeMenu = () => setOpen(false);

  const openMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.right - 208,
    });

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (buttonRef.current && buttonRef.current.contains(event.target)) return;
      closeMenu();
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const isActive = user.status === "active";

  const menuItems = [
    {
      label: "View",
      icon: Eye,
      onClick: () => onView(user),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => onEdit(user),
    },
    {
      label: user.isPremium ? "Remove Premium" : "Make Premium",
      icon: Crown,
      onClick: () => onTogglePremium(user),
    },
    {
      label: isActive ? "Suspend User" : "Activate User",
      icon: isActive ? ShieldOff : ShieldCheck,
      onClick: () => onToggleStatus(user),
    },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      onClick: () => onDelete(user),
    },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openMenu();
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-zinc-400 transition hover:border-white/20 hover:bg-zinc-900 hover:text-white"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[9999] w-52 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60"
            style={{
              top: position.top,
              left: position.left,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    closeMenu();
                    item.onClick();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                    item.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-zinc-300 hover:bg-white/10 hover:text-white"
                  } ${index === 4 ? "border-t border-white/10" : ""}`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
};

function UserTable({
  users = [],
  onView,
  onEdit,
  onDelete,
  onTogglePremium,
  onToggleStatus,
}) {
  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        render: (user) => (
          <div className="flex items-center gap-3">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-11 w-11 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-sm font-semibold text-white">
                {getInitials(user.name)}
              </div>
            )}

            <div>
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-xs text-zinc-400">{user.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        render: (user) => (
          <StatusBadge
            variant={
              user.role === "admin"
                ? "danger"
                : user.role === "artist"
                  ? "info"
                  : "default"
            }
          >
            {user.role || "user"}
          </StatusBadge>
        ),
      },
      {
        key: "premium",
        header: "Premium",
        render: (user) => (
          <StatusBadge variant={user.isPremium ? "success" : "default"}>
            {user.isPremium ? "Premium" : "Free"}
          </StatusBadge>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (user) => (
          <StatusBadge
            variant={
              user.status === "active"
                ? "success"
                : user.status === "suspended"
                  ? "warning"
                  : "danger"
            }
          >
            {user.status || "active"}
          </StatusBadge>
        ),
      },
      {
        key: "joined",
        header: "Joined",
        render: (user) =>
          user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-",
      },
      {
        key: "actions",
        header: "",
        render: (user) => (
          <UserActionMenu
            user={user}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePremium={onTogglePremium}
            onToggleStatus={onToggleStatus}
          />
        ),
      },
    ],
    [onView, onEdit, onDelete, onTogglePremium, onToggleStatus],
  );

  return <DataTable columns={columns} data={users} rowKey="_id" />;
}

export default UserTable;
