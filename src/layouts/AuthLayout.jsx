import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useEffect } from "react";

function AuthLayout({ LoginRegisterClickHandler, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClose = () => {
    if (LoginRegisterClickHandler) {
      LoginRegisterClickHandler();
    } else {
      navigate("/");
    }
  };
  
  useEffect(() => {
    document.body.style.overflow = ( location.pathname == "/login" || location.pathname == "/register") ? "hidden" : "";
    
    return () => (document.body.style.overflow = "");
    }, [location]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-xs sm:max-w-md md:max-w-lg rounded-2xl border border-white/30 
                   bg-white/30 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-2xl text-white 
                   transition-all duration-300 overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-6 md:top-3 md:right-3 text-white/80 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>

        {/* Content */}
        <div className="mt-2 text-sm sm:text-base">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
