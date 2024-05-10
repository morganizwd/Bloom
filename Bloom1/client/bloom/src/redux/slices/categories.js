import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const { data } = await axios.get('/categories');
    return data;
});

export const fetchCategoryById = createAsyncThunk('categories/fetchCategoryById', async (id) => {
    const { data } = await axios.get(`/categories/${id}`);
    return data;
});

export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData) => {
    const { data } = await axios.post('/categories/create', categoryData);
    return data;
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/categories/${id}/update`, updatedData);
    return data;
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id) => {
    await axios.delete(`/categories/${id}/delete`);
    return id;
});

const initialState = {
    categories: [],
    currentCategory: null,
    status: 'idle',
    error: null
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCategoryById.pending, (state) => {
                state.currentCategory = null;
                state.status = 'loading';
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.currentCategory = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.currentCategory = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(category => category._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(category => category._id !== action.payload);
            });
    }
});

export const categoriesReducer = categoriesSlice.reducer;