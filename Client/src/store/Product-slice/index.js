import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Environment variable

const initialState = {
  isLoading: false,
  productList: [],
  ProductDetails: null,
  error: null,
};

// ---------------- Async Thunks ----------------

// ✅ Fetch all products with filters & sorting
export const fetchAllShopProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams = {}, sortParams = "price_asc" } = {}, { rejectWithValue }) => {
    try {
      // Normalize filter arrays to comma-separated strings
      const normalizedFilters = {};
      if (filterParams.category?.length) {
        normalizedFilters.category = filterParams.category.join(",");
      }
      if (filterParams.brand?.length) {
        normalizedFilters.brand = filterParams.brand.join(",");
      }

      // Build query string
      const query = new URLSearchParams({
        ...normalizedFilters,
        sortBy: sortParams,
      }).toString();

      const result = await axios.get(`${API_URL}/api/shop/products/get?${query}`);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

// ✅ Fetch single product details
export const fetchProductsDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${API_URL}/api/shop/products/get/${id}`);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch product details");
    }
  }
);

// ---------------- Slice ----------------
const shopProductSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.ProductDetails = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch all products
      .addCase(fetchAllShopProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllShopProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllShopProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload || "Failed to fetch products";
      })

      // ✅ Fetch product details
      .addCase(fetchProductsDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ProductDetails = action.payload?.data || null;
      })
      .addCase(fetchProductsDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.ProductDetails = null;
        state.error = action.payload || "Failed to fetch product details";
      });
  },
});

export const { setProductDetails } = shopProductSlice.actions;
export default shopProductSlice.reducer;
