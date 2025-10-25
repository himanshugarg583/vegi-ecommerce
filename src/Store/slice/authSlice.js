import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  error: null,
  otpSent: false,
  otpVerified: false,
};

// Utility to get auth headers
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

/* ----------------------------- OTP HANDLING ----------------------------- */

// Step 1: Send OTP
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email, { rejectWithValue }) => {
    try {
      console.log(email)
      const { data } = await axios.post(
        `${API_URL}/api/auth/request-otp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data; // expects { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

// Step 2: Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data; // expects { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    }
  }
);

/* ----------------------------- REGISTER ----------------------------- */

// Step 3: Create user after OTP verified
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    console.log(formData)
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data; // expects { success, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ----------------------------- LOGIN ----------------------------- */

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data; // expects { user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* ----------------------------- FETCH USER ----------------------------- */

export const fetchUserWithToken = createAsyncThunk(
  "auth/fetchUserWithToken",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token || localStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");

    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders(token),
      });
      return data; // expects { user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

/* ----------------------------- SLICE ----------------------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      const { token, user } = action.payload;
      if (token) state.token = token;
      if (user) state.user = { ...user };
      state.isAuthenticated = !!state.token;
      state.error = null;

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
    },

    setUser: (state, action) => {
      state.user = action.payload ? { ...action.payload } : null;
      state.isAuthenticated = !!state.token;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload || null));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    },
  },

  extraReducers: (builder) => {
    builder
      /* ----------------------------- SEND OTP ----------------------------- */
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.otpSent = false;
        state.error = action.payload;
      })

      /* ----------------------------- VERIFY OTP ----------------------------- */
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpVerified = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.otpVerified = false;
        state.error = action.payload;
      })

      /* ----------------------------- REGISTER ----------------------------- */
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user || null;
        state.isAuthenticated = false; // registration doesn't log in
        state.token = null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })

      /* ----------------------------- LOGIN ----------------------------- */
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false; // reset OTP flags
        state.otpVerified = false;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.isLoading = false;
        state.user = user ? { ...user } : null;
        state.token = token || null;
        state.isAuthenticated = !!token;
        state.error = null;

        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })

      /* ----------------------------- FETCH USER ----------------------------- */
      .addCase(fetchUserWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserWithToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user ? { ...action.payload.user } : null;
        state.isAuthenticated = !!state.token;
        state.error = null;
        if (action.payload.user)
          localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(fetchUserWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Failed to fetch user";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { setAuthToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
