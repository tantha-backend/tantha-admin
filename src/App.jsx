import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Songs from "./pages/Songs";
import UploadSong from "./pages/UploadSong";
import EditSong from "./pages/EditSong";
import TagSongs from "./pages/TagSongs";
import Announcements from "./pages/Announcements";
import Approvals from "./pages/Approvals";

import Artists from "./pages/Artists";
import CreateArtist from "./pages/CreateArtist";
import ArtistDetails from "./pages/ArtistDetails";
import EditArtist from "./pages/EditArtist";

import Albums from "./pages/Albums";
import CreateAlbum from "./pages/CreateAlbum";
import EditAlbum from "./pages/EditAlbum";
import AlbumDetails from "./pages/AlbumDetails";

import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import UserDetails from "./pages/UserDetails";
import EditUser from "./pages/EditUser";

import Playlists from "./pages/Playlists";
import CreatePlaylist from "./pages/CreatePlaylist";
import PlaylistDetails from "./pages/PlaylistDetails";
import Analytics from "./pages/Analytics";
import Monetization from "./pages/Monetization";
import Settings from "./pages/Settings";

/** Shorthand so the admin-only routes below read as a list, not a wall. */
const ADMIN = (page) => <ProtectedRoute roles={["admin"]}>{page}</ProtectedRoute>;

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

          {/* Open to every staff member. */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="songs" element={<Songs />} />
          <Route path="songs/upload" element={<UploadSong />} />
          <Route path="songs/:id/edit" element={<EditSong />} />
          <Route path="approvals" element={<Approvals />} />

          {/*
            Admin only. Wrapped rather than hidden, because hiding a link
            does not stop anyone typing the address — and an editor who lands
            here would otherwise get a page of controls the server refuses.
          */}
          <Route path="songs/tag" element={ADMIN(<TagSongs />)} />
          <Route path="announcements" element={ADMIN(<Announcements />)} />

          <Route path="artists" element={ADMIN(<Artists />)} />
          <Route path="artists/create" element={ADMIN(<CreateArtist />)} />
          <Route path="artists/:id" element={ADMIN(<ArtistDetails />)} />
          <Route path="artists/:id/edit" element={ADMIN(<EditArtist />)} />

          <Route path="albums" element={ADMIN(<Albums />)} />
          <Route path="albums/create" element={ADMIN(<CreateAlbum />)} />
          <Route path="albums/:id" element={ADMIN(<AlbumDetails />)} />
          <Route path="albums/:id/edit" element={ADMIN(<EditAlbum />)} />

          <Route path="users" element={ADMIN(<Users />)} />
          <Route path="users/create" element={ADMIN(<CreateUser />)} />
          <Route path="users/:id" element={ADMIN(<UserDetails />)} />
          <Route path="users/:id/edit" element={ADMIN(<EditUser />)} />

          <Route path="playlists" element={ADMIN(<Playlists />)} />
          <Route path="playlists/create" element={ADMIN(<CreatePlaylist />)} />
          <Route path="playlists/:id" element={ADMIN(<PlaylistDetails />)} />

          <Route path="analytics" element={ADMIN(<Analytics />)} />
          <Route path="monetization" element={ADMIN(<Monetization />)} />
          <Route path="settings" element={ADMIN(<Settings />)} />
        </Route>
      </Routes>
    </>
  );
};

export default App;