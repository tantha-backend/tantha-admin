import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <div className="p-4 md:p-6 xl:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
