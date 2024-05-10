import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
    items: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 