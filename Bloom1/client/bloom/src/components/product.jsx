import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsById, updateProduct } from '../redux/slices/product';
import { fetchCategories } from '../redux/slices/categories';
import {
    Container, Grid, Typography, Button, TextField, Select, MenuItem, CircularProgress, Divider, FormControl, InputLabel, OutlinedInput, Chip, Snackbar, IconButton, Rating, List, ListItem, ListItemText, Link
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { addToCart } from '../redux/slices/cart';
import { fetchReviewsByProduct, createReview, deleteReview } from '../redux/slices/review';
import { fetchUserById } from '../redux/slices/auth';
import { addFavorite } from '../redux/slices/favorite';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductProfilePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const product = useSelector(state => state.products.currentProduct);
    const categories = useSelector(state => state.categories.categories);
    const [usersData, setUsersData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categories: []
    });
    const user = useSelector(state => state.auth.data);
    const [quantity, setQuantity] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { reviews } = useSelector(state => state.reviews);
    const { id: productIdFromURL } = useParams();

    const handleAddToFavorites = () => {
        if (user && user._id && product && product._id) {
            dispatch(addFavorite({ userId: user._id, productId: product._id }))
                .then(() => {
                    // You can add any post-action logic here, like displaying a message
                    console.log("Product added to favorites");
                })
                .catch((error) => {
                    console.error("Failed to add product to favorites", error);
                });
        } else {
            console.log("User or product information is missing");
        }
    };

    const handleAddToCartClick = () => {
        handleAddToCart();
        setSnackbarOpen(true); // Открыть Snackbar при добавлении товара в корзину
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false); // Закрыть Snackbar
    };

    useEffect(() => {
        if (productIdFromURL) {
            dispatch(fetchReviewsByProduct(productIdFromURL));
        }
    }, [dispatch, productIdFromURL]);

    useEffect(() => {
        reviews.items.forEach(review => {
            dispatch(fetchUserById(review.user._id)).then(res => {
                setUsersData(prev => ({ ...prev, [review.user._id]: res.payload }));
            });
        });
    }, [dispatch, reviews.items]);

    useEffect(() => {
        dispatch(fetchCategories());
        if (id) {
            dispatch(fetchProductsById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (product) {
            setUpdatedProduct({
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                categories: product.categories.map(c => c._id)
            });
        }
    }, [product]);

    const [reviewData, setReviewData] = useState({
        text: '',
        rating: 0,
    });

    const handleCreateReview = () => {
        dispatch(createReview({
            productId: productIdFromURL,
            reviewData: { ...reviewData, user: user._id }
        }));
    };

    const handleDeleteReview = (reviewId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот отзыв?")) {
            dispatch(deleteReview(reviewId));
        }
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(product));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCategoryChange = (event) => {
        setUpdatedProduct(prevState => ({
            ...prevState,
            categories: event.target.value
        }));
    };

    const handleSubmit = async () => {
        // Filter out invalid or null category IDs
        const validCategoryIds = updatedProduct.categories.filter(categoryId =>
            categoryId != null && typeof categoryId === 'string'
        );

        const updatedData = {
            ...updatedProduct,
            categories: validCategoryIds
        };

        try {
            console.log('Updating product with data:', updatedData); // Debugging log
            await dispatch(updateProduct({ id, updatedData }));
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };



    if (!product) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '4vh' }}>
            <Grid container spacing={4}>
                <Grid item md={6}>
                    {editMode ? (
                        <TextField
                            fullWidth
                            label="Image URL"
                            name="imageUrl"
                            value={updatedProduct.imageUrl}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />
                    )}
                </Grid>
                <Grid item md={6}>
                    {editMode ? (
                        <>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={updatedProduct.name}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={updatedProduct.description}
                                onChange={handleInputChange}
                                margin="normal"
                                multiline
                            />
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={updatedProduct.price}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="category-select-label">Категории</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    multiple
                                    value={updatedProduct.categories}
                                    onChange={handleCategoryChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Категории" />}
                                    renderValue={(selected) => (
                                        <div>
                                            {selected.map((value) => {
                                                const category = categories.find((c) => c._id === value);
                                                return (
                                                    <Chip key={category?._id} label={category?.Name || value} />
                                                );
                                            })}
                                        </div>
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.Name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button onClick={handleSubmit} variant="contained" color="primary">
                                Сохранить изменения
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h3" component="h1">
                                {product.name}
                            </Typography>
                            <Typography variant="subtitle1" paragraph>
                                {product.description}
                            </Typography>
                            <Typography variant="h4" color="primary" gutterBottom>
                                {product.price} BYN
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="quantity-label">Количество</InputLabel>
                                <Select
                                    labelId="quantity-label"
                                    label="Количество" // Эта метка связывается с InputLabel выше
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                >
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" startIcon={<AddShoppingCartIcon />} sx={{ mr: 2 }} onClick={handleAddToCartClick}>
                                Добавить в корзину
                            </Button>
                            <Button variant="contained" startIcon={<FavoriteIcon />} onClick={handleAddToFavorites}>
                                Добавить в избранное
                            </Button>
                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={6000}
                                onClose={handleSnackbarClose}
                                message="Товар добавлен в корзину"
                                action={
                                    <React.Fragment>
                                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                                            <CheckCircleIcon fontSize="small" />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            />
                            <Button variant="contained" startIcon={<PhoneInTalkIcon />} color="success">
                                Позвонить для заказа
                            </Button>
                            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                                Отзывы
                            </Typography>
                            <TextField
                                label="Ваш отзыв"
                                multiline
                                rows={4}
                                value={reviewData.text}
                                onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                            />
                            <Rating
                                name="simple-controlled"
                                value={reviewData.rating}
                                onChange={(e, newValue) => {
                                    setReviewData({ ...reviewData, rating: newValue });
                                }}
                            />
                            <Button onClick={handleCreateReview}>Оставить отзыв</Button>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {reviews.items.map((review, index) => (
                                    <React.Fragment key={review._id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={
                                                    <Typography component="span">
                                                        Отзыв от {review.user && usersData[review.user._id]
                                                            ? <Link to={`/user/${review.user._id}`}>{usersData[review.user._id].fullName}</Link>
                                                            : 'Пользователь'
                                                        } {new Date(review.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            Рейтинг: {review.rating}
                                                        </Typography>
                                                        {" — " + review.text}
                                                    </>
                                                }
                                            />
                                            {user && user._id === review.user._id && (
                                                <Button onClick={() => handleDeleteReview(review._id)}>
                                                    Удалить
                                                </Button>
                                            )}
                                        </ListItem>
                                        {index < reviews.items.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                            {user && user.role === 'admin' && (
                                <Button onClick={() => setEditMode(true)} variant="contained" color="secondary">
                                    Редактировать
                                </Button>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductProfilePage;