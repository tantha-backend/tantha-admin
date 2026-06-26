import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Music,
  Disc3,
  Mic2,
  ListMusic,
  ShieldCheck,
  Users,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Songs", "/songs", Music],
  ["Albums", "/albums", Disc3],
  ["Artists", "/artists", Mic2],
  ["Playlists", "/playlists", ListMusic],
  ["Approvals", "/approvals", ShieldCheck],
  ["Users", "/users", Users],
  ["Monetization", "/monetization", Wallet],
  ["Analytics", "/analytics", BarChart3],
  ["Settings", "/settings", Settings],
];

function Sidebar() {
  return (
    <aside className="w-60 min-h-screen border-r border-white/10 bg-black px-5 py-7">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Tantha
        </h1>
      </div>

      <nav className="space-y-1">
        {menu.map(([label, path, Icon]) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
                isActive
                  ? "bg-zinc-950 text-white border-l-4 border-pink-500"
                  : "text-white/60 hover:bg-zinc-950 hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
