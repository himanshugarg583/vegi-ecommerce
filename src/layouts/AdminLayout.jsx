import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import AdminDashboard from "../components/admin/AdminDashboard";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-zinc-100 relative">
      {/* ---------- Desktop Sidebar ---------- */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r shadow-sm fixed inset-y-0">
        <Sidebar />
      </aside>

      {/* ---------- Mobile Navbar & Sliding Sidebar ---------- */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ---------- Main Content ---------- */}
      <div className="md:ml-64">
        {/* ---------- Main Content Area ---------- */}
        <main className="overflow-y-auto p-4 sm:p-6 md:p-8" style={{ maxHeight: '100vh' }}>
          <AdminDashboard />
          <section className="mt-6">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
