import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { productReducer } from './slices/product';
import { categoriesReducer } from './slices/categories';
import { ordersReducer } from './slices/order';
import { reviewReducer } from './slices/review';
import { promotionReducer } from './slices/promotion';
import { favoriteReducer } from './slices/favorite';
import { orderHistoryReducer } from './slices/history';
import cartReducer from './slices/cart';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoriesReducer,
        orders: ordersReducer,
        cart: cartReducer,
        reviews: reviewReducer,
        promotions: promotionReducer,
        favorites: favoriteReducer,
        orderHistories: orderHistoryReducer,
    }
});

export default store;