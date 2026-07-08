import { Bell, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Header() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const displayName =
    user?.name || user?.fullName || user?.artistName || "Admin User";

  const roleLabel =
    user?.role === "admin" ? "Super Admin" : user?.role ? user.role : "Admin";

  const initial = displayName?.charAt(0)?.toUpperCase() || "A";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 px-4 md:px-6 xl:px-8">
      <div className="relative hidden w-[320px] md:block">
        <Search className="absolute left-4 top-3 text-white/40" size={18} />

        <input
          className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm outline-none focus:border-pink-500"
          placeholder="Search songs, artists, albums..."
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
        <div className="relative">
          <Bell size={22} />

          <span className="absolute -right-2 -top-2 rounded-full bg-pink-500 px-1.5 text-xs">
            12
          </span>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{displayName}</p>
          <p className="text-xs capitalize text-white/40">{roleLabel}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 font-bold">
          {initial}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-white/10 p-2 text-white/60 transition hover:border-pink-500 hover:text-white"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
