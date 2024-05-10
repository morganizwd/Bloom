import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const { data } = await axios.get('/orders');
    return data;
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id) => {
    const { data } = await axios.get(`/orders/${id}`);
    return data;
});

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
    const { data } = await axios.post('/orders/create', orderData);
    return data;
});

export const updateOrder = createAsyncThunk('orders/update', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/orders/${id}/update`, updatedData);
    return data;
});

export const deleteOrder = createAsyncThunk('orders/delete', async (id) => {
    await axios.delete(`/orders/${id}/delete`);
    return id;
});

const initialState = {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) => {
                state.status = 'loading';
                state.currentOrder = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
            // Create Order
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
            })
            // Update Order
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            // Delete Order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order._id !== action.payload);
            });
    }
});

export const ordersReducer = ordersSlice.reducer;