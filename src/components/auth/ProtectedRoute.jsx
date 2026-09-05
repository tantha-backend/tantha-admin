import { Navigate } from "react-router-dom";

import { isStaff } from "../../utils/permissions";

/**
 * The door to the dashboard.
 *
 * `roles` narrows it further for pages only some staff may open — leave it
 * out and any staff member passes. The server refuses on its own regardless;
 * this only decides what is worth rendering.
 *
 * An admin who wanders onto an editor-only page is sent to the dashboard
 * rather than signed out: being in the wrong place is not the same as not
 * belonging here, and throwing away a working session for it is rude.
 */
function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isStaff(user)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
