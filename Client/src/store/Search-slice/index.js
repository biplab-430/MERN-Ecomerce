import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Access the backend base URL from your .env file
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null,
};

// ---------------- Async Thunk ----------------
export const getSearchResults = createAsyncThunk(
  "products/search",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/search/${keyword}`);
      return response.data.products; // returning only the products array
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// ---------------- Slice ----------------
const searchSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
