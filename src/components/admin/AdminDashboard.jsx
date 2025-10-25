import React from "react";
import { Users } from "lucide-react";

function AdminDashboard() {
  return (
    <section
      className="w-full bg-white rounded-xl border-b-2 border-gray-100 px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
      aria-labelledby="admin-dashboard-heading"
    >
      {/* Icon */}
      <div
        className="bg-[#e8f4fe] text-[#2196f3] h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      {/* Heading + Description */}
      <div className="text-left">
        <h1
          id="admin-dashboard-heading"
          className="font-bold tracking-wide text-xl sm:text-2xl leading-tight text-gray-800"
        >
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Manage your store and monitor performance
        </p>
      </div>
    </section>
  );
}

export default AdminDashboard;
