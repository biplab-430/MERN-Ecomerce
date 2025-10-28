// src/store/contact-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  isLoading: false,
  contacts: [],
  message: null,
  error: null,
};

// ========== THUNKS ==========

// 📨 Send a new contact message
export const sendContactMessage = createAsyncThunk(
  "contact/sendContactMessage",
  async (contactData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/ContactFrom/contact`, contactData);
      return response.data; // { message: "message send successfully" }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📋 Get all contact messages
export const getAllContacts = createAsyncThunk(
  "contact/getAllContacts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/ContactFrom/all`);
      return response.data; // contacts array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ❌ Delete contact by ID
export const deleteContactById = createAsyncThunk(
  "contact/deleteContactById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/api/shop/ContactFrom/contacts/delete/${id}`);
      return { id, ...response.data }; // { id, message: "User deleted successfully." }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ========== SLICE ==========
const ContactSlice = createSlice({
  name: "contactSlice",
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Contact
      .addCase(sendContactMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to send message";
      })

      // Get All Contacts
      .addCase(getAllContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch contacts";
      })

      // Delete Contact
      .addCase(deleteContactById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteContactById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = state.contacts.filter(
          (c) => c._id !== action.payload.id
        );
        state.message = action.payload.message;
      })
      .addCase(deleteContactById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete contact";
      });
  },
});

export const { resetContactState } = ContactSlice.actions;
export default ContactSlice.reducer;
