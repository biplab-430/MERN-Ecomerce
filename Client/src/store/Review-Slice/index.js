import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Access the base URL from the .env file
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

// ---------------- Async Thunks ----------------

// ✅ Add a review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/review/add`, data);
      return response.data; // { success, message, review }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Get all reviews for a product
export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/review/${productId}`);
      return response.data; // { success, reviews }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// ---------------- Slice ----------------
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload?.reviews || [];
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch reviews";
      })

      // ✅ Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const newReview = action.payload?.review;
        if (newReview) {
          state.reviews.unshift(newReview); // adds new review to top
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add review";
      });
  },
});

export default reviewSlice.reducer;
