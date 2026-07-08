import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
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

  if (user.role !== "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
