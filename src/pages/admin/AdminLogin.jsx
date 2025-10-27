import React, { useState } from "react";
import { Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, setAuthToken, setUser } from "../../Store/slice/authSlice";
import { toast } from "react-toastify";

const INITIAL_FORM = { email: "", password: "" };

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = await dispatch(loginUser(formData)).unwrap();

      if (data.success && data.user?.role === "admin") {
        toast.success("Welcome, Admin!");
        setMessage({
          text: "Login successful! Redirecting to Admin Dashboard...",
          type: "success",
        });

        if (data.token) {
          dispatch(setAuthToken(data.token));
          dispatch(setUser(data.user));
        }

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        throw new Error("Access denied. Admin credentials required.");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      const errorMsg =
        err?.message || "Invalid admin credentials. Please try again.";
      toast.error(errorMsg);
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Background image overlay with reduced opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/22870.jpg')`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          opacity: 0.2, // reduce opacity here
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Key className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
          <p className="text-gray-300 text-sm mt-2">
            Sign in to manage your dashboard
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-3 mb-5 rounded-lg text-sm text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-300 text-sm">Admin Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300 mt-4"
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 text-sm hover:text-green-400 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
