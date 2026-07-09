import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  LogOut,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import notificationService from "../../services/notificationService";

function Header() {
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [accountInfoOpen, setAccountInfoOpen] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const displayName =
    user?.name || user?.fullName || user?.artistName || "Admin User";

  const roleLabel =
    user?.role === "admin" ? "Super Admin" : user?.role || "Admin";

  const email = user?.email || "admin@tanthamusic.com";
  const userId = user?._id || user?.id || "N/A";
  const initial = displayName?.charAt(0)?.toUpperCase() || "A";

  const loadNotifications = async () => {
    try {
      const [list, unread] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(list.notifications || []);
      setUnreadCount(unread.unreadCount || 0);
    } catch (error) {
      console.error("Notification load error:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markRead = async (notification) => {
    try {
      await notificationService.markAsRead(notification._id);

      setNotificationOpen(false);
      loadNotifications();

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  };

  const markAll = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    navigate("/login", { replace: true });
  };

  const goToSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  const openAccountInfo = () => {
    setProfileOpen(false);
    setAccountInfoOpen(true);
  };

  return (
    <>
      <header className="flex h-20 items-center justify-between border-b border-white/10 px-4 md:px-6 xl:px-8">
        <div className="relative hidden w-[320px] md:block">
          <Search className="absolute left-4 top-3 text-white/40" size={18} />

          <input
            className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm outline-none focus:border-pink-500"
            placeholder="Search songs, artists, albums..."
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="relative rounded-xl border border-white/10 p-2 text-white/70 transition hover:border-pink-500 hover:text-white"
              title="Notifications"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-pink-500 px-1.5 text-xs font-semibold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <div>
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <p className="text-xs text-white/40">
                      {unreadCount} unread
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={markAll}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-pink-400 transition hover:bg-white/10"
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-white/40">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => markRead(item)}
                        className={`block w-full border-b border-white/5 p-4 text-left transition hover:bg-white/5 ${
                          !item.isRead ? "bg-pink-500/10" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-white">
                              {item.title}
                            </p>

                            <p className="mt-1 text-sm text-white/60">
                              {item.message}
                            </p>

                            <p className="mt-2 text-xs text-white/30">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>

                          {!item.isRead && (
                            <span className="mt-1 h-2 w-2 rounded-full bg-pink-500" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="text-xs capitalize text-white/40">{roleLabel}</p>
          </div>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotificationOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 font-bold text-white transition hover:scale-105 hover:bg-pink-600"
              title="Profile"
            >
              {initial}
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
                <div className="border-b border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-lg font-bold text-white">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-white/40">{email}</p>
                      <p className="mt-1 text-xs capitalize text-pink-400">
                        {roleLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={goToSettings}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <Settings size={17} />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={openAccountInfo}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <User size={17} />
                    Account Info
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
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

      {accountInfoOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-lg font-semibold text-white">Account Info</h2>

              <button
                type="button"
                onClick={() => setAccountInfoOpen(false)}
                className="rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-2xl font-bold text-white">
                  {initial}
                </div>

                <div>
                  <p className="text-lg font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="text-sm text-white/50">{email}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
                <div>
                  <p className="text-xs text-white/40">Name</p>
                  <p className="text-sm font-medium text-white">
                    {displayName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/40">Email</p>
                  <p className="text-sm font-medium text-white">{email}</p>
                </div>

                <div>
                  <p className="text-xs text-white/40">Role</p>
                  <p className="text-sm font-medium capitalize text-white">
                    {roleLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/40">User ID</p>
                  <p className="break-all text-sm font-medium text-white">
                    {userId}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAccountInfoOpen(false)}
                className="mt-5 w-full rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
