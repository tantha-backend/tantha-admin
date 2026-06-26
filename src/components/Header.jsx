import { Bell, Search } from "lucide-react";

function Header() {
  return (
    <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between">
      <div className="relative w-[320px]">
        <Search className="absolute left-4 top-3 text-white/40" size={18} />
        <input
          className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-pink-500"
          placeholder="Search songs, artists, albums..."
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell size={22} />
          <span className="absolute -top-2 -right-2 bg-pink-500 text-xs rounded-full px-1.5">
            12
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold">Admin User</p>
          <p className="text-xs text-white/40">Super Admin</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}

export default Header;