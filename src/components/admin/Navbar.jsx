import {
  House,
  LogOut,
  Package2,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const sideBarNavigations = [
  { title: "Dashboard", logo: <House />, link: "/admin/" },
  { title: "Products", logo: <Package2 />, link: "/admin/products" },
  { title: "Orders", logo: <ShoppingCart />, link: "/admin/orders" },
  { title: "Customers", logo: <Users />, link: "/admin/customers" },
  { title: "Categories", logo: <Tag />, link: "/admin/categories" },
  { title: "Settings", logo: <Settings />, link: "/admin/settings" },
];

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const headerHeight = 56; // px

  return (
    <>
      {/* Mobile Top Navbar */}
      <header className="flex md:hidden items-center justify-between bg-white shadow-sm px-4 py-3 sticky top-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 bg-green-600 px-3 py-2 rounded-full">
          <img src="/logo.webp" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 hover:text-green-700 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Overlay behind sidebar (dims header + page) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar Menu (Right) */}
      <aside
        className={`fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto pt-4">
          {/* Logo at the top */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 bg-green-600 px-3 py-2 rounded-full">
              <img src="/logo.webp" alt="Logo" className="h-8 w-auto" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-2">
            <ul className="flex flex-col gap-3 px-2">
              {sideBarNavigations.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.link}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-green-100 hover:text-green-700 transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.logo}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer / Logout */}
        <footer className="border-t border-gray-300">
          <button
            className="flex items-center justify-center gap-2 text-red-600 py-5 bg-white shadow-md hover:shadow-lg hover:bg-red-100 w-full transition-all duration-300"
            aria-label="Logout"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </footer>
      </aside>
    </>
  );
}

export default Navbar;
