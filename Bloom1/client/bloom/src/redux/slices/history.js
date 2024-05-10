import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchOrderHistories = createAsyncThunk(
    'order-history/fetchOrderHistories',
    async (userId, { dispatch }) => {
        const { data } = await axios.get(`/order-history/user/${userId}`);
        data.forEach(history => {
            history.products.forEach(productId => {
                dispatch(fetchProductDetails(productId));
            });
        });
        return data;
    }
);

export const fetchProductDetails = createAsyncThunk(
    'products/fetchDetails',
    async (productId) => {
        const { data } = await axios.get(`/products/${productId}`);
        return data;
    }
);

export const addOrderHistory = createAsyncThunk(
    'order-history/add',
    async ({ userId, orderId }) => {
        const { data } = await axios.post('/order-history/add', { userId, orderId });
        return data;
    }
);

const initialState = {
    orderHistories: [],
    productDetails: {},
    status: 'idle',
    error: null
}

const orderHistorySlice = createSlice({
    name: 'orderHistories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderHistories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderHistories.fulfilled, (state, action) => {
                state.orderHistories = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrderHistories.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
            .addCase(addOrderHistory.fulfilled, (state, action) => {
                state.orderHistories.push(action.payload);
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.productDetails[action.payload._id] = action.payload;
            });
    }
});

export const { reducer: orderHistoryReducer } = orderHistorySlice;