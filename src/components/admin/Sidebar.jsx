import { House, LogOut, Package2, Settings, ShoppingCart, Tag, Users } from "lucide-react";
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

function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col justify-between col-span-2 h-screen bg-white shadow-lg pt-6 overflow-y-auto rounded-none"
      aria-label="Main Sidebar Navigation"
    >
      {/* Logo / Header */}
      {/* Logo / Header */}
      <div className="px-6 py-5 flex items-center gap-3">
      {/* Logo */}
      <img
      src="/logo2.png"
      alt="DIGITHELA Logo"
      className="w-10 h-10 rounded-full object-contain"
      />
      <span className="text-xl font-bold text-gray-800">DIGITHELA Admin</span>
      </div>



      {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto mt-6">
                    <ul className="flex flex-col gap-3 px-2">
                      {sideBarNavigations.map((item, idx) => (
                        <li key={idx}>
                          <Link
                            to={item.link}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-green-100 hover:text-green-700 transition"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.logo}
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

      {/* Footer / Logout */}
      <footer className="flex flex-col gap-3 mt-auto border-t border-gray-300">
        <button
          className="flex items-center justify-center gap-2 text-red-600 py-5 bg-white shadow-md hover:shadow-lg hover:bg-red-100 transition-all duration-300"
          aria-label="Logout"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </footer>

      {/* Schema.org JSON-LD for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            "name": sideBarNavigations.map((item) => item.title),
            "url": sideBarNavigations.map((item) => item.link),
            "description": "Sidebar menu for Comfy store admin panel",
          }),
        }}
      />
    </aside>
  );
}

export default Sidebar;
