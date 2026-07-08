import { Album, Disc3, Music4, Headphones } from "lucide-react";

import StatCard from "../common/StatCard";

function AlbumStats({ albums = [] }) {
  const totalAlbums = albums.length;

  const publishedAlbums = albums.filter((album) => album.isPublished).length;

  const totalTracks = albums.reduce(
    (total, album) => total + (album.songs?.length || 0),
    0,
  );

  const totalPlays = albums.reduce(
    (total, album) => total + (album.totalPlays || 0),
    0,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Albums"
        value={totalAlbums}
        subtitle="Albums on platform"
        icon={Album}
        variant="info"
      />

      <StatCard
        title="Published"
        value={publishedAlbums}
        subtitle="Live releases"
        icon={Disc3}
        variant="success"
      />

      <StatCard
        title="Tracks"
        value={totalTracks}
        subtitle="Songs inside albums"
        icon={Music4}
        variant="warning"
      />

      <StatCard
        title="Total Plays"
        value={totalPlays.toLocaleString()}
        subtitle="Album streams"
        icon={Headphones}
        variant="danger"
      />
    </div>
  );
}

export default AlbumStats;
