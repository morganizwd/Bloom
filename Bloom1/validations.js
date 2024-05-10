import { body, param } from 'express-validator';

//auth validation
export const loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password shoud be at least 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password should be at least 8 symbols').isLength({ min: 8 }),
    body('userName', 'Name is too short').isLength({ min: 2 }),
    body('role', 'Invalid role').custom((value) => {
        const roles = ['user', 'admin'];
        if (!roles.includes(value)) {
            throw new Error('Invalid role');
        }
        return true;
    }),
];

//products
export const createProductValidation = [
    body('name', 'Product name is required').notEmpty(),
    body('description', 'Product description is required').notEmpty(),
    body('price', 'Product price must be a number').isNumeric(),
    body('imageUrl', 'Invalid URL format for image').optional(),
    body('categories', 'Categories must be an array').optional().isArray(),
    body('categories.*', 'Invalid category ID').optional().isMongoId(),
];

export const updateProductValidation = [
    body('name', 'Product name is required').optional().notEmpty(),
    body('description', 'Product description is required').optional().notEmpty(),
    body('price', 'Product price must be a number').optional().isNumeric(),
    body('imageUrl', 'Invalid URL format for image').optional(),
    body('categories', 'Categories must be an array').optional().isArray(),
    body('categories.*', 'Invalid category ID').optional().isMongoId(),
];

//promitions
export const createPromotionValidation = [
    body('name', 'Product name is required').notEmpty(),
    body('description', 'Product description is required').notEmpty(),
    body('imageUrl', 'Invalid URL format for image').optional(),
];

export const updatePromotionValidation = [
    body('name', 'Product name is required').optional().notEmpty(),
    body('description', 'Product description is required').optional().notEmpty(),
    body('imageUrl', 'Invalid URL format for image').optional(),
];

//orders
export const createOrderValidation = [
    body('products', 'Products must be an array').isArray(),
    body('products.*', 'Each product ID must be a valid MongoID').isMongoId(),
    body('total', 'Total must be a number').isNumeric(),
    body('address', 'Address is required').notEmpty(),
    body('phoneNumber', 'Phome number is required').notEmpty(),
];

export const updateOrderValidation = [
    body('products', 'Products must be an array').optional().isArray(),
    body('products.*', 'Each product ID must be a valid MongoID').optional().isMongoId(),
    body('total', 'Total must be a number').optional().isNumeric(),
    body('address', 'Address is required').optional().notEmpty(),
    body('phoneNumber', 'Phome number is required').optional().notEmpty(),
];

//categorys
export const createCategoryValidation = [
    body('name', 'Category name is required').notEmpty(),
    body('name', 'Category name must not exceed 32 characters').isLength({ max: 32 }),
];

export const updateCategoryValidation = [
    param('id', 'Invalid category ID').isMongoId(),
    body('name', 'Category name must not exceed 32 characters').optional().isLength({ max: 32 }),
];

//review validation
export const reviewCreateValidation = [
    param('id', 'Invalid product ID').isMongoId(),
    body('text', 'Отзыв слищком короткий').isLength({ min: 4 }).isString(),
    body('rating', 'Rate should be a number').isNumeric().isFloat({ min: 1, max: 5 }),
];

export const reviewUpdateValidation = [
    body('text', 'Отзыв слищком короткий').optional().isLength({ min: 4 }).isString(),
    body('rating', 'Rate should be a number').optional().isNumeric().isFloat({ min: 1, max: 5 }),
];

//fav
export const createFavoriteValidation = [
    body('userId', 'Invalid user ID').isMongoId(),
    body('productId', 'Invalid product ID').isMongoId()
];

//history
export const createOrderHistoryValidation = [
    body('userId', 'Invalid user ID').isMongoId(),
    body('orderId', 'Invalid order ID').isMongoId()
];