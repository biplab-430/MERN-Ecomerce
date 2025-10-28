// src/redux/slices/adminProductSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

// ---------------- Async Thunks ----------------

// Add new product
export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(`${API_URL}/api/admin/products/add`, formData, {
        headers: { "Content-Type": "application/json" }, // change to multipart/form-data if needed
      });
      return result.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${API_URL}/api/admin/products/get`);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

// Edit product by ID
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(`${API_URL}/api/admin/products/edit/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return result.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to edit product");
    }
  }
);

// Delete product by ID
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/products/delete/${id}`);
      return id; // Return deleted product id to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete product");
    }
  }
);

// ---------------- Slice ----------------
const AdminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add New
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList.push(action.payload);
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data; // replace with fetched list
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Edit
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.productList.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.productList[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = state.productList.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default AdminProductSlice.reducer;
