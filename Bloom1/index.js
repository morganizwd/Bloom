import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    UserController,
    ProductController,
    OrderController,
    CategoryContoller,
    ReviewController,
    PromotionController,
    FavoriteController,
    OrderHistoryController,
} from './controllers/index.js';

import {
    loginValidation,
    registerValidation,
    createProductValidation,
    updateProductValidation,
    createOrderValidation,
    updateOrderValidation,
    createCategoryValidation,
    updateCategoryValidation,
    reviewCreateValidation,
    createPromotionValidation,
    updatePromotionValidation,
    createFavoriteValidation,
    createOrderHistoryValidation,
} from './validations.js';

import {
    handleValidationErrors,
    allRolesAuth,
    adminOnlyAuth,
} from './utils/index.js';

mongoose
    .connect('mongodb+srv://admin:He12345678@cluster0.k6wg7rw.mongodb.net/Bloom?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//media upload pathes
app.post('/upload', adminOnlyAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//auth
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', allRolesAuth, UserController.getMe);
app.get('/user/:userId', allRolesAuth, UserController.getUserById);

//products
app.post('/products/create', adminOnlyAuth, createProductValidation, handleValidationErrors, ProductController.create);
app.patch('/products/:id/update', adminOnlyAuth, updateProductValidation, handleValidationErrors, ProductController.update);
app.delete('/products/:id/delete', adminOnlyAuth, ProductController.remove)
app.get('/products/:id', ProductController.getOne);
app.get('/products', ProductController.getAll)
app.get('/products/category/:categoryId', ProductController.getByCategory);

//promotions
app.post('/promotions/create', adminOnlyAuth, createPromotionValidation, handleValidationErrors, PromotionController.create);
app.patch('/promotions/:id/update', adminOnlyAuth, updatePromotionValidation, handleValidationErrors, PromotionController.update);
app.delete('/promotions/:id/delete', adminOnlyAuth, PromotionController.remove)
app.get('/promotions/:id', PromotionController.getOne);
app.get('/promotions', PromotionController.getAll)

//orders
app.post('/orders/create', allRolesAuth, (req, res, next) => {
    console.log(req.body); // Для отладки
    next();
}, createOrderValidation, handleValidationErrors, OrderController.create);
app.patch('/orders/:id/update', adminOnlyAuth, updateOrderValidation, handleValidationErrors, OrderController.update);
app.delete('/orders/:id/delete', adminOnlyAuth, OrderController.remove);
app.get('/orders/:id', allRolesAuth, OrderController.getOne);
app.get('/orders', adminOnlyAuth, OrderController.getAll);

//categories
app.post('/categories/create', adminOnlyAuth, createCategoryValidation, handleValidationErrors, CategoryContoller.create);
app.patch('/categories/:id/update', adminOnlyAuth, updateCategoryValidation, handleValidationErrors, CategoryContoller.update);
app.delete('/categories/:id/delete', adminOnlyAuth, CategoryContoller.remove);
app.get('/categories/:id', CategoryContoller.getOne);
app.get('/categories', CategoryContoller.getAll);

// review pathes
app.post('/product/:id/review-create', 
    allRolesAuth,
    reviewCreateValidation,
    handleValidationErrors,
    ReviewController.create
);
app.delete('/product/review-delete/:reviewId', allRolesAuth, ReviewController.remove);
app.get('/product/:id/reviews',
    ReviewController.getAll
);

// Favorite routes
app.post('/favorites/add', allRolesAuth, createFavoriteValidation, handleValidationErrors, FavoriteController.add);
app.delete('/favorites/remove', allRolesAuth, FavoriteController.remove);
app.get('/favorites/user/:userId', allRolesAuth, FavoriteController.get);

//history
app.post('/order-history/add', allRolesAuth, createOrderHistoryValidation, handleValidationErrors, OrderHistoryController.add);
app.get('/order-history/user/:userId', allRolesAuth, OrderHistoryController.get);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});