import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slice/counterSlice'
import authReducer from './slice/authSlice'
import productsReducer from './slice/productsSlice'
import cartReducer from './slice/cartSlice'
import userReducer from './slice/userSlice'

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		auth: authReducer,
		products: productsReducer,
		cart: cartReducer,
		user: userReducer,
	},
})