// src/redux/slices/adminOrderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
  error: null,
  successMessage: null,
};

// ---------------- Async Thunks ----------------

// Fetch all orders (Admin)
export const getAllOrderForAdmin = createAsyncThunk(
  "/order/getAllOrderForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders/get`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Fetch specific order details (Admin)
export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders/details/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

// Update order status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// ---------------- Slice ----------------
const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrderForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.error = null;
      })
      .addCase(getAllOrderForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get order details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload.message || "Order status updated successfully.";

        // Update orderDetails if viewing that order
        if (state.orderDetails && state.orderDetails._id === action.payload.data._id) {
          state.orderDetails = action.payload.data;
        }

        // Optionally update orderList
        const index = state.orderList.findIndex(o => o._id === action.payload.data._id);
        if (index !== -1) {
          state.orderList[index] = action.payload.data;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update order status.";
      });
  },
});

export const { clearOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
