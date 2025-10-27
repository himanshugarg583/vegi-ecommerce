import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { loginFormControls } from "../../config/authConfig.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, setAuthToken, setUser } from "../../Store/slice/authSlice.js";
import { mergeLocalCartToServer } from "../../Store/slice/cartSlice.js";
import { toast } from "react-toastify";

const INITIAL_FORM = { email: "", password: "" };

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch();

  const backgroundLocation =
    (location.state && location.state.backgroundLocation) || {
      pathname: "/",
    };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = await dispatch(loginUser(formData)).unwrap();

      if (data.success) {
        toast.success("Login Successful");
        setMessage({
          text: "Login successful! Redirecting...",
          type: "success",
        });

        setFormData(INITIAL_FORM);

        if (data.token) {
          // Store token in Redux + localStorage
          dispatch(setAuthToken(data.token));
          dispatch(setUser(data.user));

          // Merge local cart into server cart
          await dispatch(mergeLocalCartToServer())
            .unwrap()
            .then(() =>
              toast.success("Local cart merged with server cart", {
                position: "top-right",
                autoClose: 1500,
              })
            )
            .catch(() =>
              toast.error("Failed to merge local cart", {
                position: "top-right",
              })
            );

          // Navigate to the preserved background page
          navigate(backgroundLocation.pathname || "/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err?.message || err || "Invalid credentials. Try again.";
      toast.error(errorMsg);
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-md w-full bg-white rounded-xl shadow-lg border border-[#189a63]/30">
      {/* Header */}
      <div className="bg-[#0c6c44] rounded-t-xl py-6 px-4 text-center text-white">
        <div className="w-16 h-16 bg-[#189a63] rounded-full mx-auto flex items-center justify-center mb-4 shadow-md">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-sm text-white/80 mt-1">Log in to continue</p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-3 mx-6 mt-4 rounded-lg text-sm text-center ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        {loginFormControls.map(({ name, type, placeholder, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 
                       focus-within:ring-2 focus-within:ring-[#189a63]/50 transition-all duration-200"
          >
            <Icon className="text-[#189a63] w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-[#189a63] hover:bg-[#0c6c44] text-white text-sm font-semibold py-2.5 rounded-lg
                     shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Log In
            </>
          )}
        </button>
      </form>

      {/* OR Divider */}
      <div className="w-full flex items-center justify-center px-8">
        <div className="flex-grow border-t border-gray-200" />
        <span className="px-3 text-sm text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      {/* Switch to Register */}
      <p className="text-center text-sm text-gray-600 mt-6 mb-6">
        Don’t have an account?{" "}
        <button
          onClick={() =>
            navigate("/register", { state: { backgroundLocation } })
          }
          className="text-[#189a63] hover:text-[#0c6c44] hover:underline font-medium transition-colors"
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;
