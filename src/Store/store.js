import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from './Slices/counterSlice.js';
import authReducer from './slice/authSlice.js';
import productReducer from './slice/productsSlice.js';
import cartReducer from './slice/cartSlice.js';
import userReducer from './slice/userSlice.js';


export const store = configureStore({
reducer: {
// counter: counterReducer,
auth : authReducer,
products : productReducer,
cart : cartReducer,
user : userReducer
},
});