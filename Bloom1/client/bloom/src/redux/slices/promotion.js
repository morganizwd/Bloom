import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

export const fetchPromotion = createAsyncThunk('promotions/fetchPromotion', async () => {
    const { data } = await axios.get('/promotions');
    return data;
});

export const fetchPromotionById = createAsyncThunk(
    'promotions/fetchPromotionById',
    async (id) => {
        const { data } = await axios.get(`/promotions/${id}`);
        return data;
    }
);

export const createPromotion = createAsyncThunk('promotion/create', async (promotionData) => {
    const { data } = await axios.post('/promotions/create', promotionData);
    return data;
});

export const updatePromotion = createAsyncThunk(
    'promotions/update',
    async ({ id, updatedData }) => {
        const response = await axios.patch(`/promotions/${id}/update`, updatedData);
        return response.data;
    }
);

export const deletePromotion = createAsyncThunk(
    'promotions/delete',
    async (id) => {
        await axios.delete(`/promotions/${id}/delete`);
        return id;
    }
);

const initialState = {
    promotions: {
        items: [],
        status: 'loading',
    }
}

const promotionlice = createSlice({
    name: 'promotions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch promotion
            .addCase(fetchPromotion.pending, (state) => {
                state.promotions.items = [];
                state.promotions.status = 'loading';
            })
            .addCase(fetchPromotion.fulfilled, (state, action) => {
                state.promotions.items = action.payload;
                state.promotions.status = 'loaded';
            })
            .addCase(fetchPromotion.rejected, (state) => {
                state.promotions.items = [];
                state.promotions.status = 'error';
            })

            .addCase(fetchPromotionById.pending, (state) => {
                state.currentPromotion = null;
                state.status = 'loading';
            })
            .addCase(fetchPromotionById.fulfilled, (state, action) => {
                state.currentPromotion = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchPromotionById.rejected, (state) => {
                state.currentPromotion = null;
                state.status = 'error';
            })

            .addCase(createPromotion.fulfilled, (state, action) => {
                state.promotions.items.push(action.payload);
            })

            .addCase(updatePromotion.fulfilled, (state, action) => {
                const index = state.promotions.items.findIndex(Promotion => Promotion._id === action.meta.arg.id);
                if (index !== -1) {
                    state.promotions.items[index] = { ...state.promotions.items[index], ...action.payload };
                    console.log('Updated Promotion in state:', state.promotions.items[index]);
                }
            })   

            .addCase(deletePromotion.fulfilled, (state, action) => {
                state.promotions.items = state.promotions.items.filter(
                    (promotion) => promotion._id !== action.payload
                );
            });
    }
});

export const promotionReducer = promotionlice.reducer;