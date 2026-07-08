import { Search } from "lucide-react";
import Button from "../ui/Button";

function ArtistFilters({ searchTerm, setSearchTerm, onRefresh }) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />

        <input
          type="text"
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-pink-500"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500">
          <option>All Genres</option>
        </select>

        <select className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500">
          <option>All Status</option>
        </select>

        <select className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-pink-500">
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>A-Z</option>
          <option>Z-A</option>
        </select>

        <Button onClick={onRefresh}>Refresh</Button>
      </div>
    </div>
  );
}

export default ArtistFilters;
