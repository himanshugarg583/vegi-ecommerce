// src/store/slice/userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  userDetails: null,
  savedAddresses: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

/* ----------------------------- Fetch User Profile ----------------------------- */
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const { data } = await axios.get(`${API_URL}/api/user/profile`, {
        headers: getAuthHeaders(token),
      });
      return data; // expects { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

/* ----------------------------- Update Profile ----------------------------- */
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const { data } = await axios.put(`${API_URL}/api/user/profile`, formData, {
        headers: getAuthHeaders(token),
      });
      return data; // expects { user, message }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

/* ----------------------------- Change Password ----------------------------- */
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const { data } = await axios.put(`${API_URL}/api/user/change-password`, passwordData, {
        headers: getAuthHeaders(token),
      });
      return data; // expects { message }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password update failed");
    }
  }
);

/* ----------------------------- Manage Addresses ----------------------------- */
export const addAddress = createAsyncThunk(
  "user/addAddress",
  async (address, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const { data } = await axios.post(`${API_URL}/api/user/address`, address, {
        headers: getAuthHeaders(token),
      });
      return data; // expects updated address list
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (addressId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const { data } = await axios.delete(`${API_URL}/api/user/address/${addressId}`, {
        headers: getAuthHeaders(token),
      });
      return data; // expects updated address list
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete address");
    }
  }
);

/* ----------------------------- Slice ----------------------------- */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.user;
        state.savedAddresses = action.payload.user.addresses || [];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.user;
        state.successMessage = action.payload.message || "Profile updated successfully!";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Password changed successfully!";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Address management
      .addCase(addAddress.fulfilled, (state, action) => {
        state.savedAddresses = action.payload.addresses;
        state.successMessage = "Address added successfully!";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.savedAddresses = action.payload.addresses;
        state.successMessage = "Address removed successfully!";
      });
  },
});

export const { clearUserMessages } = userSlice.actions;
export default userSlice.reducer;
