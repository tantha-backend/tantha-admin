import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Eye,
  Pencil,
  BarChart3,
  Copy,
  Trash2,
} from "lucide-react";

const MENU_WIDTH = 208;
const MENU_HEIGHT = 248;
const GAP = 8;

const ActionMenu = ({ onView, onEdit, onAnalytics, onDuplicate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < MENU_HEIGHT + GAP;

    const top = openUpward
      ? rect.top + window.scrollY - MENU_HEIGHT - GAP
      : rect.bottom + window.scrollY + GAP;

    const left = rect.right + window.scrollX - MENU_WIDTH;

    setPosition({ top, left });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const clickedButton = buttonRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  const closeMenu = (callback) => {
    setOpen(false);
    callback?.();
  };

  const menu = open ? (
    <div
      ref={menuRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${MENU_WIDTH}px`,
      }}
      className="fixed z-[9999] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl"
    >
      <MenuItem
        icon={<Eye size={16} />}
        label="View"
        onClick={() => closeMenu(onView)}
      />

      <MenuItem
        icon={<Pencil size={16} />}
        label="Edit"
        onClick={() => closeMenu(onEdit)}
      />

      <MenuItem
        icon={<BarChart3 size={16} />}
        label="Analytics"
        onClick={() => closeMenu(onAnalytics)}
      />

      <MenuItem
        icon={<Copy size={16} />}
        label="Duplicate"
        onClick={() => closeMenu(onDuplicate)}
      />

      <div className="border-t border-neutral-800" />

      <MenuItem
        danger
        icon={<Trash2 size={16} />}
        label="Delete"
        onClick={() => closeMenu(onDelete)}
      />
    </div>
  ) : null;

  return (
    <>
      <div className="flex justify-end">
        <button
          ref={buttonRef}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((current) => !current);
          }}
          className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {createPortal(menu, document.body)}
    </>
  );
};

const MenuItem = ({ icon, label, onClick, danger = false }) => {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-neutral-300 hover:bg-neutral-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default ActionMenu;
