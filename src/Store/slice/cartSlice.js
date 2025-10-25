import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

// ---------- Local Storage Helpers ----------
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ---------- Helper to get auth headers ----------
const getAuthHeaders = (getState) => {
  const token = getState().auth.token || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- Async Thunks for Server ----------
export const fetchServerCart = createAsyncThunk(
  "cart/fetchServerCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState);
      const { data } = await axios.get(`${API_URL}/api/cart/getcart`, {
        headers,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Silent fetch for internal use (no toast)
export const fetchServerCartSilent = createAsyncThunk(
  "cart/fetchServerCartSilent",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState);
      const { data } = await axios.get(`${API_URL}/api/cart/getcart`, {
        headers,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addItemToServerCart = createAsyncThunk(
  "cart/addItemToServerCart",
  async ({ productId, quantity }, { getState, rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);
      await axios.post(
        `${API_URL}/api/cart/addsingleproduct`,
        { productId, quantity },
        { headers }
      );
      await dispatch(fetchServerCartSilent()); // update state silently
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeItemFromServerCart = createAsyncThunk(
  "cart/removeItemFromServerCart",
  async (productId, { getState, rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);
      const { data } = await axios.delete(
        `${API_URL}/api/cart/removesingleitem/${productId}`,
        { headers }
      );
      if (data.success) {
        await dispatch(fetchServerCartSilent()); // update state silently
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateServerQuantity = createAsyncThunk(
  "cart/updateServerQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);
      await axios.patch(
        `${API_URL}/api/cart/updatecart/${productId}/${quantity}`,
        {}, 
        { headers } 
      );
      await dispatch(fetchServerCartSilent());
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// ---------- Async thunk for merging local cart to server ----------
export const mergeLocalCartToServer = createAsyncThunk(
  "cart/mergeLocalCartToServer",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);
      const localCart = loadCartFromStorage();

      if (!localCart.length) return [];

      const productsPayload = localCart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      // 👇 send array directly
      await axios.post(`${API_URL}/api/cart/additemsinarray`, productsPayload, {
        headers,
      });

      const serverCart = await dispatch(fetchServerCartSilent()).unwrap();

      localStorage.removeItem("cart");

      return serverCart;
    } catch (error) {
      console.error("Cart merge failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const clearServerCart = createAsyncThunk(
  "cart/clearServerCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = getAuthHeaders(getState);
      await axios.delete(`${API_URL}/api/cart/clearcart`, { headers });
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ---------- Cart Slice ----------
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartFromStorage(),
    isLoading: false,
    error: null,
    merged: false,
  },
  reducers: {
    addItemToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.cartItems.find(
        (item) => item.product._id === product._id
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cartItems.push({ product, quantity });
      }
      saveCartToStorage(state.cartItems);
    },
    removeItemFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== productId
      );
      saveCartToStorage(state.cartItems);
    },

    getCart: (state) => {
      state.cartItems = loadCartFromStorage();
    },
    updateLocalQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.cartItems.find(
        (item) => item.product._id === productId
      );
      if (existing) existing.quantity = quantity;
      saveCartToStorage(state.cartItems);
    },
    clearCartServer: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    clearLocalCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    proceedToCheckout: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
    mergeLocalCart: (state, action) => {
  // action.payload is server cart after merge
  state.cartItems = action.payload;
  state.merged = true;
},

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(fetchServerCartSilent.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(addItemToServerCart.fulfilled, (state, action) => {
        // state already updated by silent fetch
      })
      .addCase(removeItemFromServerCart.fulfilled, (state, action) => {
        // state already updated by silent fetch
      })
      .addCase(updateServerQuantity.fulfilled, (state, action) => {
        // state already updated by silent fetch
      })
      .addCase(clearServerCart.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

// ---------- Auth-aware Thunks with Toasts ----------
export const addItemToCartAction =
  ({ product, quantity }) =>
  (dispatch, getState) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      dispatch(addItemToServerCart({ productId: product._id, quantity }))
        .unwrap()
        .then(() =>
          toast.success(`${product.title} added to cart!`, {
            position: "top-right",
            autoClose: 1500,
          })
        )
        .catch(() =>
          toast.error(`Failed to add ${product.title} to cart`, {
            position: "top-right",
          })
        );
    } else {
      dispatch(cartSlice.actions.addItemToCart({ product, quantity }));

      toast.success(`${product.title} added to cart!`, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

export const removeItemFromCartAction = (product) => (dispatch, getState) => {
  const { auth } = getState();
  if (auth.isAuthenticated) {
    dispatch(removeItemFromServerCart(product._id))
      .unwrap()
      .then(() =>
        toast.info(`${product.title} removed from cart`, {
          position: "top-right",
          autoClose: 1500,
        })
      )
      .catch(() =>
        toast.error(`Failed to remove ${product.title}`, {
          position: "top-right",
        })
      );
  } else {
    dispatch(cartSlice.actions.removeItemFromCart(product._id));
    toast.info(`${product.title} removed from cart`, {
      position: "top-right",
      autoClose: 1500,
    });
  }
};

export const updateQuantityAction =
  ({ product, quantity }) =>
  (dispatch, getState) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      dispatch(updateServerQuantity({ productId: product._id, quantity }))
        .unwrap()
        .then(() =>
          toast.success(`${product.title} quantity updated to ${quantity}`, {
            position: "top-right",
            autoClose: 1500,
          })
        )
        .catch(() =>
          toast.error(`Failed to update ${product.title}`, {
            position: "top-right",
          })
        );
    } else {
      dispatch(
        cartSlice.actions.updateLocalQuantity({
          productId: product._id,
          quantity,
        })
      );
      toast.success(`${product.title} quantity updated to ${quantity}`, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

export const clearCartAction = () => (dispatch, getState) => {
  const { auth } = getState();
  if (auth.isAuthenticated) {
    dispatch(clearServerCart())
      .unwrap()
      .then(() =>
        toast.info("Cart cleared", { position: "top-right", autoClose: 1500 })
      )
      .catch(() =>
        toast.error("Failed to clear cart", { position: "top-right" })
      );
  } else {
    dispatch(cartSlice.actions.clearLocalCart());
    toast.info("Cart cleared", { position: "top-right", autoClose: 1500 });
  }
};

export const getCartAction = () => (dispatch, getState) => {
  const { auth } = getState();
  if (auth.isAuthenticated) {
    dispatch(fetchServerCart())
      .unwrap()
      .then(() =>
        toast.success("Cart loaded from server", {
          position: "top-right",
          autoClose: 1500,
        })
      )
      .catch(() =>
        toast.error("Failed to load cart from server", {
          position: "top-right",
        })
      );
  } else {
    dispatch(cartSlice.actions.getCart());
    toast.success("Cart loaded from local storage", {
      position: "top-right",
      autoClose: 1500,
    });
  }
};

export const proceedToCheckoutAction = () => (dispatch) => {
  dispatch(cartSlice.actions.proceedToCheckout());
  toast.success("Proceeding to checkout", {
    position: "top-right",
    autoClose: 1500,
  });
};

export const mergeLocalCartAction = (serverCart) => (dispatch) => {
  dispatch(cartSlice.actions.mergeLocalCart(serverCart));
  toast.success("Local cart merged with server cart", {
    position: "top-right",
    autoClose: 1500,
  });
};

// ---------- Export reducers and actions ----------
export const {
  addItemToCart,
  removeItemFromCart,
  getCart,
  updateLocalQuantity,
  clearCartServer,
  clearLocalCart,
  proceedToCheckout,
  mergeLocalCart,
} = cartSlice.actions;

export default cartSlice.reducer;
