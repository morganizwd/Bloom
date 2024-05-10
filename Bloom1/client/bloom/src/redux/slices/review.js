import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios.js";

export const fetchReviewsByProduct = createAsyncThunk(
  'reviews/fetchByProduct',
  async (ProductId) => {
    const { data } = await axios.get(`/Product/${ProductId}/reviews`);
    return data;
  }
);

export const fetchReviewsByUser = createAsyncThunk(
  `reviews/fetchReviewsByUser`, 
  async (userId) => {
    const { data } = await axios.get(`/reviews/user/${userId}`);
    return data;
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/product/${productId}/review-create`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      await axios.delete(`/Product/review-delete/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  reviews: {
    items: [],
    status: 'loading',
  }
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) =>[
    builder
      //fetchReviewsByProduct
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.reviews.status = 'loading';
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.reviews.items = action.payload; // Assuming the payload is an array of reviews
        state.reviews.status = 'loaded';
      })
      .addCase(fetchReviewsByProduct.rejected, (state) => {
        state.reviews.status = 'error';
      })
      
      //fetchReviewsByUser
      .addCase(fetchReviewsByUser.pending, (state) => {
        state.reviews.status = 'loading';
      })
      .addCase(fetchReviewsByUser.fulfilled, (state, action) => {
        state.reviews.items = action.payload; // Assuming the payload is an array of reviews
        state.reviews.status = 'loaded';
      })
      .addCase(fetchReviewsByUser.rejected, (state) => {
        state.reviews.status = 'error';
      })

      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.items.push(action.payload); // Добавление нового отзыва в состояние
      })
      .addCase(createReview.rejected, (state, action) => {
        console.error('Ошибка при создании отзыва:', action.payload);
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews.items = state.reviews.items.filter(
          (review) => review._id !== action.payload
        );
      })
      
  ]
});

export const reviewReducer = reviewSlice.reducer;