import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios.js";

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId) => {
    const { data } = await axios.get(`/favorites/user/${userId}`);
    return data;
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async ({ userId, productId }) => {
    const { data } = await axios.post('/favorites/add', { userId, productId });
    return data;
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async ({ userId, productId }) => {
    const { data } = await axios.delete('/favorites/remove', { data: { userId, productId } });
    return data;
  }
);

// Initial state
const initialState = {
  favorites: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = 'failed';
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(favorite => favorite.productId !== action.payload.productId);
      });
  }
});

export const favoriteReducer = favoriteSlice.reducer;