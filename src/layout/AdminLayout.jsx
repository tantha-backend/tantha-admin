import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1">
        <Header />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
