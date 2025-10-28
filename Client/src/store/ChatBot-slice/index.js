import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Access the env variable

const initialState = {
  isLoading: false,
  messages: [], // stores chat history (user + bot)
  error: null,
};

// ---------------- Async Thunk ----------------
export const sendChatMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/chatbot/help`, { message });
      return {
        userMessage: message,
        botReply: response.data.reply,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// for order related chat
export const sendOrderChatMessage = createAsyncThunk(
  "chatbot/sendOrderMessage",
  async ({ message, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/chatbot/order`, { message, user });
      return {
        userMessage: message,
        botReply: response.data.reply,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

// ---------------- Slice ----------------
const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Normal chatbot
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          user: action.payload.userMessage,
          bot: action.payload.botReply,
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Chatbot request failed.";
      })
      // Order chatbot
      .addCase(sendOrderChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOrderChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          user: action.payload.userMessage,
          bot: action.payload.botReply,
        });
      })
      .addCase(sendOrderChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Order chatbot request failed.";
      });
  },
});

export const { clearChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;
