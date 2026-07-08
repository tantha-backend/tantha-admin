import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Songs from "./pages/Songs";
import UploadSong from "./pages/UploadSong";
import Approvals from "./pages/Approvals";

import Artists from "./pages/Artists";
import CreateArtist from "./pages/CreateArtist";
import ArtistDetails from "./pages/ArtistDetails";

import Albums from "./pages/Albums";
import CreateAlbum from "./pages/CreateAlbum";
import EditAlbum from "./pages/EditAlbum";
import AlbumDetails from "./pages/AlbumDetails";

import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import EditUser from "./pages/EditUser";

import Playlists from "./pages/Playlists";
import Analytics from "./pages/Analytics";
import Monetization from "./pages/Monetization";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />

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
          <Route path="approvals" element={<Approvals />} />

          <Route path="artists" element={<Artists />} />
          <Route path="artists/create" element={<CreateArtist />} />
          <Route path="artists/:id" element={<ArtistDetails />} />

          <Route path="albums" element={<Albums />} />
          <Route path="albums/create" element={<CreateAlbum />} />
          <Route path="albums/:id" element={<AlbumDetails />} />
          <Route path="albums/:id/edit" element={<EditAlbum />} />

          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/:id/edit" element={<EditUser />} />

          <Route path="playlists" element={<Playlists />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="monetization" element={<Monetization />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
