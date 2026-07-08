import { MoreVertical } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_WIDTH = 208;
const MENU_GAP = 8;
const VIEWPORT_PADDING = 12;

function ActionMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();

    let left = buttonRect.right - MENU_WIDTH;
    let top = buttonRect.bottom + MENU_GAP;

    if (left < VIEWPORT_PADDING) {
      left = VIEWPORT_PADDING;
    }

    if (left + MENU_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
      left = window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING;
    }

    const estimatedMenuHeight = Math.max(actions.length * 44, 44);

    if (top + estimatedMenuHeight > window.innerHeight - VIEWPORT_PADDING) {
      top = buttonRect.top - estimatedMenuHeight - MENU_GAP;
    }

    if (top < VIEWPORT_PADDING) {
      top = VIEWPORT_PADDING;
    }

    setPosition({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    calculatePosition();
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

    const handleReposition = () => {
      calculatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const handleToggle = (event) => {
    event.stopPropagation();
    setOpen((current) => !current);
  };

  const handleActionClick = (action, event) => {
    event.stopPropagation();

    if (action.disabled) return;

    action.onClick?.();
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:border-pink-500 hover:text-white"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${MENU_WIDTH}px`,
            }}
            className="z-[9999] overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <button
                  key={`${action.label}-${index}`}
                  type="button"
                  disabled={action.disabled}
                  onClick={(event) => handleActionClick(action, event)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                    action.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-white/70 hover:bg-white/5"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

export default ActionMenu;
