import { useLayoutEffect, useState } from "react";

/**
 * Positions a portalled dropdown next to its trigger button.
 *
 * Opens downward when there is room and flips above the button when there
 * isn't, so a menu on the last row of a table stays on screen. The menu is
 * measured after it mounts rather than assuming a fixed height, so menus with
 * different numbers of items all place correctly.
 *
 * Coordinates are viewport-relative because the menu is `position: fixed` —
 * scroll offsets must not be added.
 */
const GAP = 8;

export const useMenuPosition = (open, buttonRef, menuRef) => {
  const [style, setStyle] = useState({ top: 0, left: 0 });

  // Layout effect, not a plain effect: the measure-and-place runs before the
  // browser paints, so the menu is never seen at its pre-measured position.
  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const button = buttonRef.current;
      const menu = menuRef.current;

      if (!button || !menu) return;

      const rect = button.getBoundingClientRect();
      const { offsetHeight: height, offsetWidth: width } = menu;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Flip up only when below genuinely doesn't fit and above fits better.
      const flipUp = spaceBelow < height + GAP && spaceAbove > spaceBelow;

      const top = flipUp ? rect.top - height - GAP : rect.bottom + GAP;

      // Right-align to the button, then keep the whole menu on screen.
      const left = rect.right - width;

      const clamp = (value, max) => Math.max(GAP, Math.min(value, max - GAP));

      setStyle({
        top: clamp(top, window.innerHeight - height),
        left: clamp(left, window.innerWidth - width),
      });
    };

    place();

    // `true` catches scrolling inside the table container, not just the window.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);

    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, buttonRef, menuRef]);

  return style;
};

export default useMenuPosition;
