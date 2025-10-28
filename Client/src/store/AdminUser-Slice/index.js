// src/redux/slices/adminUserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

// ---------------- Initial State ----------------
const initialState = {
  isLoading: false,
  users: [],
  error: null,
};

// ---------------- Async Thunks ----------------

// ✅ Get All Users
export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users/all`);
      return response.data.users; // assuming { success, users: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ✅ Delete User by ID
export const deleteUserById = createAsyncThunk(
  "adminUsers/deleteUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/admin/users/delete/${id}`
      );
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// ✅ Edit (Update) User by ID
export const editUserById = createAsyncThunk(
  "adminUsers/editUserById",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/users/update/${id}`,
        updatedData
      );
      return response.data.user; // updated user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// ---------------- Slice ----------------
const AdminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload || [];
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.users = [];
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUserById.pending, (state) => { state.isLoading = true; })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((u) => u._id !== action.payload.id);
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Edit User
      .addCase(editUserById.pending, (state) => { state.isLoading = true; })
      .addCase(editUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(editUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminUserError } = AdminUserSlice.actions;
export default AdminUserSlice.reducer;
