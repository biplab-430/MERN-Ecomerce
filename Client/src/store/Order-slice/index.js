import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Environment variable

const initialState = {
  approvalURl: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  paymentStatus: null,
  error: null,
  message: null,
};

// ---------------- Async Thunks ----------------

// ✅ Create a new order
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/order/create`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  }
);

// ✅ Capture payment after approval
export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async ({ orderId, paymentId, payerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/order/capture`, {
        orderId,
        paymentId,
        payerId,
      });
      return response.data; // { success, message, order, paypalResponse }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment capture failed");
    }
  }
);

// ✅ Get all orders by user
export const getAllOrderByUserId = createAsyncThunk(
  "order/getAllOrderByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/order/list/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// ✅ Get order details
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/order/details/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order details");
    }
  }
);

// ---------------- Slice ----------------
const shopOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Create Order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURl = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.approvalURl = null;
        state.orderId = null;
        state.error = action.payload;
      })

      // ✅ Capture Payment
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.order._id;
        state.paymentStatus = action.payload.order.paymentStatus;
        state.message = action.payload.message;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Payment failed";
      })

      // ✅ Get Orders by User
      .addCase(getAllOrderByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrderByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrderByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload;
      })

      // ✅ Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload;
      });
  },
});

export const { resetOrderDetails } = shopOrderSlice.actions;
export default shopOrderSlice.reducer;
