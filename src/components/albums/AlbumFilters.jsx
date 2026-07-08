import { RotateCw } from "lucide-react";

import FilterBar from "../common/FilterBar";
import SearchBar from "../common/SearchBar";
import Button from "../ui/Button";

function AlbumFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  artistFilter,
  onArtistChange,
  artists = [],
  onRefresh,
}) {
  return (
    <FilterBar>
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search albums..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-white outline-none transition focus:border-pink-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={artistFilter}
          onChange={(e) => onArtistChange(e.target.value)}
          className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-white outline-none transition focus:border-pink-500"
        >
          <option value="all">All Artists</option>

          {artists.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.stageName}
            </option>
          ))}
        </select>

        <Button variant="secondary" onClick={onRefresh}>
          <RotateCw size={18} />
          Refresh
        </Button>
      </div>
    </FilterBar>
  );
}

export default AlbumFilters;
