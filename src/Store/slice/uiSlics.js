import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authModal: null, // 'login', 'register', or null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.authModal = action.payload; // 'login' or 'register'
    },
    closeAuthModal: (state) => {
      state.authModal = null;
    },
  },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;

export default uiSlice.reducer;
