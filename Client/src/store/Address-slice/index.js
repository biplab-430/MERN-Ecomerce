// src/redux/slices/addressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  AddressList: [],
  error: null,
};

// ---------------- Async Thunks ----------------

// Add New Address
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/address/add`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch All Addresses
export const fetchAllAddress = createAsyncThunk(
  "/addresses/fetchAllAddress",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/address/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit Address
export const editAddress = createAsyncThunk(
  "/addresses/editAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/shop/address/update/${userId}/${addressId}`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Address
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/shop/address/delete/${userId}/${addressId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ---------------- Slice ----------------
const AddressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add New
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AddressList = action.payload?.data || [];
      })
      .addCase(fetchAllAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.AddressList = [];
        state.error = action.payload;
      })

      // Edit
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.AddressList.findIndex(
          (p) => p._id === action.payload?._id
        );
        if (index !== -1) {
          state.AddressList[index] = action.payload;
        }
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data?._id) {
          state.AddressList = state.AddressList.filter(
            (p) => p._id !== action.payload.data._id
          );
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default AddressSlice.reducer;
