import { NavLink, Link } from "react-router-dom";
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
  Tags,
  Megaphone,
} from "lucide-react";

import { currentUser, isAdmin } from "../../utils/permissions";

/**
 * The fourth entry says who may see the item. Editors get the three things
 * they were hired for; everything else is the owner's business.
 */
const menu = [
  ["Dashboard", "/dashboard", LayoutDashboard, "all"],
  ["Songs", "/songs", Music, "all"],
  ["Approvals", "/approvals", ShieldCheck, "all"],
  ["Tag Songs", "/songs/tag", Tags, "admin"],
  ["Albums", "/albums", Disc3, "admin"],
  ["Artists", "/artists", Mic2, "admin"],
  ["Playlists", "/playlists", ListMusic, "admin"],
  ["Announcements", "/announcements", Megaphone, "admin"],
  ["Users", "/users", Users, "admin"],
  ["Monetization", "/monetization", Wallet, "admin"],
  ["Analytics", "/analytics", BarChart3, "admin"],
  ["Settings", "/settings", Settings, "admin"],
];

function Sidebar() {
  const user = currentUser();
  const visible = menu.filter(([, , , who]) => who === "all" || isAdmin(user));

  return (
    <aside className="hidden min-h-screen w-60 shrink-0 border-r border-white/10 bg-black px-5 py-7 lg:block">
      <div className="mb-10">
        <Link to="/dashboard">
          <h1 className="text-4xl font-black tracking-tight text-white transition hover:text-pink-500">
            Tantha
          </h1>
        </Link>
      </div>

      <nav className="space-y-1">
        {visible.map(([label, path, Icon]) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "border-l-4 border-pink-500 bg-zinc-950 text-white"
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
