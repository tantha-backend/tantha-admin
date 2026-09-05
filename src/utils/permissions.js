/**
 * What each kind of staff member sees in the dashboard.
 *
 * ─── This is not the lock ────────────────────────────────────────────────
 *
 * The server decides what anyone may actually do, and refuses on every admin
 * route regardless of what this file says — anything here can be got round
 * by typing a URL or editing localStorage. What this file is for is not
 * showing an editor a page full of buttons that will all fail, and not
 * putting the payouts in front of somebody who was hired to type lyrics.
 *
 * Keep it honest against the allowlist in the backend's staffMiddleware. If
 * the two disagree, the server wins and the person sees a page that does not
 * work — which is the safe way round, but still worth not doing.
 */

export const STAFF_ROLES = ["admin", "editor"];

/** The pages an editor may open. Everything else is admin only. */
export const EDITOR_PATHS = [
  "/dashboard",
  "/songs",
  "/songs/upload",
  "/songs/:id/edit",
  "/approvals",
];

export const isStaff = (user) => STAFF_ROLES.includes(user?.role);

export const isAdmin = (user) => user?.role === "admin";

export const roleLabel = (user) => {
  if (user?.role === "admin") return "Super Admin";
  if (user?.role === "editor") return "Editor";

  return user?.role || "Admin";
};

/** Reads the signed-in staff member back out of localStorage. */
export const currentUser = () => {
  try {
    const raw = localStorage.getItem("user");

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
