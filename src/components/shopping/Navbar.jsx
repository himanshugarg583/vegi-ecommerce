import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Shopping Cart", href: "/cart" },
    { name: "Checkout", href: "/checkout" },
    { name: "Chat", href: "/chat" },
  ];

  return (
    <nav className="w-full hidden md:block bg-gradient-to-r from-green-50 to-blue-50 border-t border-b border-gray-200 shadow-sm">
      <ul
        className="
          flex items-center 
          px-5 lg:px-12 xl:px-20 
          gap-3 sm:gap-5 lg:gap-10 xl:gap-14 
          transition-all duration-300
        "
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              to={item.href}
              key={index}
              className="
                relative py-3 px-4 
                group cursor-pointer 
                transition-all duration-300
              "
            >
              {/* Animated underline */}
              <div
                className={`absolute left-0 bottom-0 w-full h-[3px] rounded-full bg-[#0C6C44] origin-center transition-transform duration-300
                ${isActive ? "scale-x-100" : "scale-x-0"} 
                group-hover:scale-x-100`}
              ></div>

              {/* Text */}
              <div
                className={`
                  font-semibold uppercase tracking-wide transition-colors duration-300
                  text-[14px] sm:text-[15px] 
                  lg:text-[16px] xl:text-[17px] 2xl:text-[18px]
                  ${isActive ? "text-[#0C6C44]" : "text-gray-700"} 
                  group-hover:text-[#0C6C44]
                `}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;
