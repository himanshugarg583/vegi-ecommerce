import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children }) {
  const location = useLocation();
  const path = location.pathname;

  // --- Allow everyone to access admin routes ---
  if (path.startsWith("/admin")) {
    return <>{children}</>;
  }

  // --- Allow access to login/register pages ---
  if (path.includes("/login") || path.includes("/register")) {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  // --- Allow everyone to view the cart ---
  if (path === "/cart") {
    return <>{children}</>;
  }

  // --- Require authentication for checkout and protected routes ---
  if (path.startsWith("/checkout") || path.startsWith("/orders") || path.startsWith("/profile")) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  }

  // --- Default: allow access ---
  return <>{children}</>;
}

export default CheckAuth;
