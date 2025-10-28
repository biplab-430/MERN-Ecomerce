// src/redux/slices/featureSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

// ---------------- Initial State ----------------
const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null,
};

// ---------------- Async Thunks ----------------

// Add Feature Image
export const addFeatureImage = createAsyncThunk(
  "features/addFeatureImage",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/feature/add`, { image });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Get All Feature Images
export const getFeatureImages = createAsyncThunk(
  "features/getFeatureImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/feature/get`);
      return response.data; // images array
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Delete Feature Image
export const deleteFeatureImage = createAsyncThunk(
  "features/deleteFeatureImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/feature/delete/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// ---------------- Slice ----------------
const FeatureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    clearFeatureError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Feature
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList.push(action.payload);
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add image";
      })

      // Get Features
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.featureImageList = [];
        state.error = action.payload || "Failed to fetch images";
      })

      // Delete Feature
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload?.data?._id;
        if (deletedId) {
          state.featureImageList = state.featureImageList.filter(
            (img) => img._id !== deletedId
          );
        }
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete image";
      });
  },
});

export const { clearFeatureError } = FeatureSlice.actions;
export default FeatureSlice.reducer;
