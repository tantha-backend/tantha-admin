import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Songs from "./pages/Songs";
import UploadSong from "./pages/UploadSong";
import Albums from "./pages/Albums";
import Artists from "./pages/Artists";
import Playlists from "./pages/Playlists";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import Monetization from "./pages/Monetization";
import Settings from "./pages/Settings";

import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="songs" element={<Songs />} />
        <Route path="songs/upload" element={<UploadSong />} />
        <Route path="albums" element={<Albums />} />
        <Route path="artists" element={<Artists />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="monetization" element={<Monetization />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
