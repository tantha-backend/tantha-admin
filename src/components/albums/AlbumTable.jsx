import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Upload,
  Download,
  MoreVertical,
} from "lucide-react";

import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";

const AlbumActionMenu = ({
  album,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}) => {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const closeMenu = () => setOpen(false);

  const openMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.right - 192,
    });

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return;
      }

      closeMenu();
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
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

  const menuItems = [
    {
      label: "View",
      icon: Eye,
      onClick: () => onView(album),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => onEdit(album),
    },
    album.isPublished
      ? {
          label: "Unpublish",
          icon: Download,
          onClick: () => onUnpublish(album),
        }
      : {
          label: "Publish",
          icon: Upload,
          onClick: () => onPublish(album),
        },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      onClick: () => onDelete(album),
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
            className="fixed z-[9999] w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60"
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
                  } ${index === 3 ? "border-t border-white/10" : ""}`}
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

function AlbumTable({
  albums = [],
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}) {
  const columns = useMemo(
    () => [
      {
        key: "cover",
        header: "Album",
        render: (album) => (
          <div className="flex items-center gap-3">
            <img
              src={
                album.coverImage ||
                "https://placehold.co/60x60/111/FFF?text=Album"
              }
              alt={album.title}
              className="h-12 w-12 rounded-lg border border-white/10 object-cover"
            />

            <div>
              <p className="font-medium text-white">{album.title}</p>
              <p className="text-xs text-zinc-400">{album.genre || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        key: "artist",
        header: "Artist",
        render: (album) => album.artistId?.stageName || "-",
      },
      {
        key: "tracks",
        header: "Tracks",
        render: (album) => album.songs?.length || 0,
      },
      {
        key: "plays",
        header: "Plays",
        render: (album) => (album.totalPlays || 0).toLocaleString(),
      },
      {
        key: "status",
        header: "Status",
        render: (album) => (
          <StatusBadge variant={album.isPublished ? "success" : "warning"}>
            {album.isPublished ? "Published" : "Draft"}
          </StatusBadge>
        ),
      },
      {
        key: "releaseDate",
        header: "Release",
        render: (album) =>
          album.releaseDate
            ? new Date(album.releaseDate).toLocaleDateString()
            : "-",
      },
      {
        key: "actions",
        header: "",
        render: (album) => (
          <AlbumActionMenu
            album={album}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
          />
        ),
      },
    ],
    [onView, onEdit, onDelete, onPublish, onUnpublish],
  );

  return <DataTable columns={columns} data={albums} rowKey="_id" />;
}

export default AlbumTable;
