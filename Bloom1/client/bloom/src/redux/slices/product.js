import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const { data } = await axios.get('/products');
    return data;
});

export const fetchProductsByCategory = createAsyncThunk('products/fetchProductsByCategory', async (categoryId) => {
    const { data } = await axios.get(`/products/category/${categoryId}`);
    return data;
});

export const fetchProductsById = createAsyncThunk(
    'products/fetchProductsById',
    async (id) => {
        const { data } = await axios.get(`/products/${id}`);
        return data;
    }
);

export const createProduct = createAsyncThunk('products/create', async (productData) => {
    const { data } = await axios.post('/products/create', productData);
    return data;
});

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, updatedData }) => {
        // If you're not uploading files, remove the 'Content-Type' header or set it to 'application/json'.
        const response = await axios.patch(`/products/${id}/update`, updatedData);
        return response.data;
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id) => {
        await axios.delete(`/products/${id}/delete`);
        return id;
    }
);

const initialState = {
    products: {
        items: [],
        status: 'loading',
    }
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.products.items = [];
                state.products.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products.items = action.payload;
                state.products.status = 'loaded';
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.products.items = [];
                state.products.status = 'error';
            })

            //fetchProductsById
            .addCase(fetchProductsById.pending, (state) => {
                state.currentProduct = null;
                state.status = 'loading';
            })
            .addCase(fetchProductsById.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchProductsById.rejected, (state) => {
                state.currentProduct = null;
                state.status = 'error';
            })

            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.items.push(action.payload);
            })

            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.products.items = action.payload;
                state.products.status = 'loaded';
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.items.findIndex(product => product._id === action.meta.arg.id);
                if (index !== -1) {
                    // Use the spread operator to update the item immutably
                    state.products.items[index] = { ...state.products.items[index], ...action.payload };
                    // Log the updated product for debugging
                    console.log('Updated product in state:', state.products.items[index]);
                }
            })   

            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products.items = state.products.items.filter(
                    (product) => product._id !== action.payload
                );
            });
    }
});

export const productReducer = productSlice.reducer;