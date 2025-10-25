import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  CircleUserRound,
  LogIn,
  Search,
  ShoppingCart,
  UserRoundPen,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../shopping/Navbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectProduct } from "../../store/slice/productsSlice";
import { logout } from "../../store/slice/authSlice";
import { getCart } from "../../store/slice/cartSlice";

function LayoutHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.products.products);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Shopping Cart", href: "/cart" },
    { name: "Checkout", href: "/checkout" },
    { name: "Chat", href: "/chat" },
  ];

  const backgroundLocation = { ...location };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search suggestions when clicking outside input/suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecent(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load recent searches
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(
      saved.map((item) =>
        typeof item === "string"
          ? { _id: null, title: item, image: "/placeholder.png", price: null }
          : {
              _id: item._id ?? null,
              title: item.title,
              image: item.image || "/placeholder.png",
              price: item.price ?? null,
            }
      )
    );
  }, []);

  // Filter suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
    setSuggestions(filtered);
  }, [searchTerm, products]);

  const handleSelectSuggestion = (productId, term) => {
    if (productId) dispatch(selectProduct(productId));
    setSearchTerm("");
    setSuggestions([]);
    setShowRecent(false);

    if (term) {
      const selected = products.find(
        (p) => p.title.toLowerCase() === term.toLowerCase()
      );

      const entry = selected
        ? {
            _id: selected._id,
            title: selected.title,
            image: selected.image || "/placeholder.png",
            price: selected.price,
          }
        : {
            _id: null,
            title: term,
            image: "/placeholder.png",
            price: null,
          };

      const updated = [
        entry,
        ...recentSearches.filter((r) => r.title !== entry.title),
      ].slice(0, 5);

      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setSidebarOpen(false);
    navigate("/");
    dispatch(getCart());
  };

  return (
    <header className="w-full relative z-50">
      {/* Top Section */}
      <section className="bg-[#0c6c44] w-full border-b border-[#0b5e3a]/20 shadow-sm md:px-16 py-2">
        <div className="mx-auto flex items-center justify-between px-5 py-2 lg:py-3 font-semibold text-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="DIGITHELA Logo"
              className="h-12 w-auto"
            />
            {/* <span className="text-white font-bold text-2xl hidden sm:block">DIGITHELA</span> */}
          </Link>

          {/* Desktop Search */}
          <div
            ref={searchRef}
            className="relative w-84 lg:w-full max-w-2xl mx-4 hidden sm:block"
          >
            <div className="w-full bg-white rounded-xl px-5 py-2 flex items-center gap-3 shadow-lg focus-within:ring-2 focus-within:ring-green-400">
              <Search className="text-zinc-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for fruits, vegetables, or products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowRecent(false);
                }}
                onFocus={() => {
                  if (!searchTerm.trim()) setShowRecent(true);
                }}
                className="w-full text-lg outline-none placeholder:text-gray-400"
              />
            </div>

            {(suggestions.length > 0 ||
              (showRecent && recentSearches.length > 0)) && (
              <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl mt-2 max-h-80 overflow-y-auto z-50">
                {(showRecent && searchTerm.trim() === ""
                  ? recentSearches
                  : suggestions
                ).map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-50 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSuggestion(item._id, item.title);
                    }}
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <span className="text-gray-700 text-base font-medium truncate">
                      {item.title}
                    </span>
                    {item.price && (
                      <span className="ml-auto text-green-600 font-semibold text-base">
                        ₹{item.price.toFixed(2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop Menu */}
          <div
            className="hidden md:flex items-center gap-3 relative"
            ref={dropdownRef}
          >
            <Link
              to="/cart"
              className="bg-[#189a63] text-white p-2 rounded-md flex items-center justify-center hover:scale-105 transition-shadow relative"
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {/* {cartItems.reduce((total, item) => total, 0)} */}
                  {cartItems.length}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#189a63] text-white p-2 rounded-full flex items-center gap-2"
              >
                <CircleUserRound />
                <span>
                  {isAuthenticated ? user?.username || "User" : "Login"}
                </span>
                <ChevronDown className="h-4 ml-1" />
              </button>

              {/* Desktop dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg border overflow-hidden">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 font-medium">
                        {user?.username || user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 w-full text-left"
                      >
                        <LogIn /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          navigate("/login", { state: { backgroundLocation } });
                          setDropdownOpen(false);
                        }}
                        className="flex gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <LogIn /> Login
                      </div>
                      <div
                        onClick={() => {
                          navigate("/register", {
                            state: { backgroundLocation },
                          });
                          setDropdownOpen(false);
                        }}
                        className="flex gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <UserRoundPen /> Register
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger + Search Icon */}
          <div className="flex md:hidden items-center gap-2">
            <button
              className=" p-2 rounded-full text-white"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-8 w-8" />
            </button>
            <button
              className="bg-[#189a63] p-2 rounded-md text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </section>

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative bg-white w-72 h-full p-6 overflow-y-auto shadow-xl rounded-l-3xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Nav Links */}
          <nav className="flex flex-col gap-4 mb-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className="px-5 py-3 rounded-xl font-medium text-gray-700 bg-white hover:bg-green-100 transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bottom Auth Section */}
          <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="px-2 py-2 font-medium flex items-center gap-2">
                  <CircleUserRound /> {user?.username || user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 text-red-600 w-full text-left"
                >
                  <LogIn /> Logout
                </button>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    navigate("/login", { state: { backgroundLocation } });
                    setSidebarOpen(false);
                  }}
                  className="flex gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <LogIn /> Login
                </div>
                <div
                  onClick={() => {
                    navigate("/register", { state: { backgroundLocation } });
                    setSidebarOpen(false);
                  }}
                  className="flex gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <UserRoundPen /> Register
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Full Screen Search */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              autoFocus
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg px-4 py-2 border rounded-xl outline-none"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="ml-2 text-gray-700"
            >
              <X />
            </button>
          </div>

          <ul className="flex flex-col gap-1">
            {(searchTerm.trim() === "" ? recentSearches : suggestions).map(
              (item, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-green-50 transition rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSuggestion(item._id || null, item.title);
                      setMobileSearchOpen(false);
                    }}
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <span className="text-gray-700 text-base font-medium truncate">
                      {item.title}
                    </span>
                    {item.price && (
                      <span className="ml-auto text-green-600 font-semibold text-base">
                        ₹{item.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default LayoutHeader;
