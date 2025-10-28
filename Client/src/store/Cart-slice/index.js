import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // ✅ fallback for safety

const initialState = {
  isLoading: false,
  cartItems: [],
  error: null,
};

// ---------------- Async Thunks ----------------

// 🛒 Get Cart Items
export const getCartItems = createAsyncThunk(
  "Cart/getCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/cart/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ➕ Add to Cart
export const addToCart = createAsyncThunk(
  "Cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/cart/add`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔄 Update Cart Item
export const updateCartItem = createAsyncThunk(
  "Cart/updateCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/shop/cart/update-cart`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ❌ Remove Cart Item
export const removeCartItem = createAsyncThunk(
  "Cart/removeCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/shop/cart/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ---------------- Slice ----------------
const shopCartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartItems = [];
        state.error = action.payload;
      })

      // Get Cart
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.cartItems = [];
        state.error = action.payload;
      })

      // Update Cart
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.cartItems = [];
        state.error = action.payload;
      })

      // Remove Cart Item
      .addCase(removeCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.cartItems = [];
        state.error = action.payload;
      });
  },
});

export default shopCartSlice.reducer;
