import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLogin from "./pages/admin/AdminLogin";
import Home from "./pages/shopping/Home";
import Products from "./pages/shopping/Products";
import Cart from "./pages/shopping/Cart";
import CheckoutPage from "./pages/shopping/CheckoutPage";
import NoRouteFound from "./pages/common/NoRouteFound";
import CheckAuth from "./components/common/CheckAuth";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import ScrollToTop from "./Utils/ScrollToTop";
import  {fetchUserWithToken}  from "./store/slice/authSlice";
// import  {fetchUserWithToken}  from "../src/Store/slice/authSlice";
import { fetchServerCart, mergeLocalCartAction } from "./store/slice/cartSlice";
import Loader from "./components/common/Loader";
import ProfilePage from "./pages/shopping/ProfilePage";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-login if token exists
    if (!user && localStorage.getItem("token")) {
      dispatch(fetchUserWithToken());
    }
  }, [dispatch, user]);


  // Check if the current location is for modal overlay
  const isModal = location.pathname === "/login" || location.pathname === "/register";

  // Only use backgroundLocation if modal is open
  const backgroundLocation =
    (location.state && location.state.backgroundLocation) || { pathname: "/" };

  return (
    <div className="overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        style={{ fontSize: "14px" }}
      />

      <ScrollToTop />

      {/* --- Background Routes --- */}
      <Routes location={isModal ? backgroundLocation : location}>
        {/* Public / Shopping Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:category" element={<Products />} />

          {/* Cart - Accessible to everyone */}
          <Route path="cart" element={<Cart />} />
          
          {/* Checkout - Opens cart with popup */}
          <Route path="checkout" element={<Cart openCheckoutPopup={true} />} />
          <Route
            path="chat"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <Home /> {/* Replace with actual Chat page/component */}
              </CheckAuth>
            }
          />
        </Route>

        {/* User Routes */}
        <Route
            path="/profile"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ProfilePage />
              </CheckAuth>
            }
          />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NoRouteFound />} />
      </Routes>

      {/* --- Modal Routes for user login/register --- */}
      {isModal && (
        <Routes>
          <Route
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;
