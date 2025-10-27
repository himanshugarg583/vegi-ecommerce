import React, { useState } from "react";
import { Mail, KeyRound, Lock, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  sendOTP,
  verifyOTP,
  registerUser,
} from "../../Store/slice/authSlice";

const INITIAL_FORM = {
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const backgroundLocation =
    (location.state && location.state.backgroundLocation) || {
      pathname: "/",
    };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(sendOTP(formData.email)).unwrap();
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(verifyOTP({ email: formData.email, otp: formData.otp })).unwrap();
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (err) {
      toast.error(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const data = await dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      if (data.success) {
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/login", { state: { backgroundLocation } });
        }, 500);
      }
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-md w-full bg-white rounded-xl shadow-lg border border-[#189a63]/30 overflow-hidden transition-all duration-500">
      {/* Header */}
      <div className="bg-[#0c6c44] rounded-t-xl py-6 px-4 text-center text-white">
        <div className="w-16 h-16 bg-[#189a63] rounded-full mx-auto flex items-center justify-center mb-4 shadow-md transition-transform duration-500 transform hover:scale-110">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold transition-all duration-500">
          {step === 1
            ? "Enter Your Email"
            : step === 2
            ? "Verify OTP"
            : "Create Password"}
        </h2>
        <p className="text-sm text-white/80 mt-1">
          {step === 1
            ? "We'll send you a 6-digit code"
            : step === 2
            ? "Check your email for the code"
            : "Secure your account"}
        </p>
      </div>

      <div className="p-8 px-10 relative min-h-[260px]">
        {/* STEP 1: Email */}
        <form
          onSubmit={handleEmailSubmit}
          className={`absolute mx-5 inset-0 flex flex-col justify-center space-y-4 transition-all duration-500 ${
            step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <div
            className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5
            focus-within:ring-2 focus-within:ring-[#189a63]/50 transition-all duration-200"
          >
            <Mail className="text-[#189a63] w-5 h-5 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full focus:outline-none text-sm text-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#189a63] hover:bg-[#0c6c44] text-white text-sm font-semibold py-2.5 rounded-lg
            shadow-md transition-all duration-300"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {/* STEP 2: OTP */}
        <form
          onSubmit={handleOTPSubmit}
          className={`absolute inset-0 flex flex-col justify-center space-y-4 transition-all duration-500 ${
            step === 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <div
            className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5
            focus-within:ring-2 focus-within:ring-[#189a63]/50 transition-all duration-200"
          >
            <KeyRound className="text-[#189a63] w-5 h-5 mr-2" />
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
              required
              className="w-full focus:outline-none text-sm text-gray-700 tracking-widest text-center"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#189a63] hover:bg-[#0c6c44] text-white text-sm font-semibold py-2.5 rounded-lg
            shadow-md transition-all duration-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* STEP 3: Password */}
        <form
          onSubmit={handleRegisterSubmit}
          className={`absolute inset-0 flex flex-col justify-center space-y-4 transition-all duration-500 ${
            step === 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <div
            className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5
            focus-within:ring-2 focus-within:ring-[#189a63]/50 transition-all duration-200"
          >
            <Lock className="text-[#189a63] w-5 h-5 mr-2" />
            <input
              type="password"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full focus:outline-none text-sm text-gray-700"
            />
          </div>
          <div
            className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5
            focus-within:ring-2 focus-within:ring-[#189a63]/50 transition-all duration-200"
          >
            <Lock className="text-[#189a63] w-5 h-5 mr-2" />
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              required
              className="w-full focus:outline-none text-sm text-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#189a63] hover:bg-[#0c6c44] text-white text-sm font-semibold py-2.5 rounded-lg
            shadow-md transition-all duration-300"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-6 mb-6">
        Already have an account?{" "}
        <button
          onClick={() =>
            navigate("/login", { state: { backgroundLocation } })
          }
          className="text-[#189a63] hover:text-[#0c6c44] hover:underline font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;
