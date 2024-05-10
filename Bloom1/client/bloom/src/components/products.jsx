import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, fetchProductsByCategory } from '../redux/slices/product';
import { fetchCategories } from '../redux/slices/categories';
import { createProduct, deleteProduct } from '../redux/slices/product';
import axios from '../redux/axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const categories = useSelector(state => state.categories.categories);
    const products = useSelector(state => state.products.products.items);
    const user = useSelector(state => state.auth.data);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categories: []
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "categories") {
            setSelectedCategories(value);
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const uploadProduct = async (formData) => {
        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        // Добавляем каждый ID категории отдельно
        selectedCategories.forEach(categoryId => {
            formData.append('categories[]', categoryId);
        });

        const response = await uploadProduct(formData);

        if (response.url) {
            const protocol = window.location.protocol;
            const fullImageUrl = `${protocol}//localhost:4444${response.url}`;

            const productWithImage = { ...newProduct, imageUrl: fullImageUrl, categories: selectedCategories };
            dispatch(createProduct(productWithImage));
        }

        handleClose();
    };

    const toggleSelectProduct = (id) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(pid => pid !== id)
                : [...prevSelected, id]
        );
    };

    // Функция удаления выделенных продуктов
    const handleDeleteSelected = async () => {
        await Promise.all(selectedProducts.map(id => dispatch(deleteProduct(id))));
        setSelectedProducts([]);
    };

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (selectedCategoryId) {
            dispatch(fetchProductsByCategory(selectedCategoryId));
        }
    }, [selectedCategoryId, dispatch]);

    const handleCategoryChange = (event) => {
        setSelectedCategoryId(event.target.value);
        if (!event.target.value) {
            dispatch(fetchProducts());
        } else {
            dispatch(fetchProductsByCategory(event.target.value));
        }
    };

    const [imageFile, setImageFile] = useState(null);

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const filteredProducts = products.filter(product => {
        const price = parseFloat(product.price);
        const minPrice = priceFilter.min ? parseFloat(priceFilter.min) : -Infinity;
        const maxPrice = priceFilter.max ? parseFloat(priceFilter.max) : Infinity;
        return price >= minPrice && price <= maxPrice;
    });

    return (
        <div style={{ margin: '20px' }}>
            {user && user.role === 'admin' && (
                <>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        Добавить
                    </Button>
                    {selectedProducts.length > 0 && (
                        <Button variant="contained" color="secondary" onClick={handleDeleteSelected}>
                            Удалить
                        </Button>
                    )}
                </>
            )}
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                    labelId="category-select-label"
                    value={selectedCategoryId}
                    label="Категория"
                    onChange={handleCategoryChange}
                >
                    <MenuItem value="">
                        <em>Все категории</em>
                    </MenuItem>
                    {categories.map(category => (
                        <MenuItem key={category._id} value={category._id}>
                            {category.Name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Мин. цена"
                type="number"
                value={priceFilter.min}
                onChange={e => setPriceFilter({ ...priceFilter, min: e.target.value })}
            />
            <TextField
                label="Макс. цена"
                type="number"
                value={priceFilter.max}
                onChange={e => setPriceFilter({ ...priceFilter, max: e.target.value })}
            />
            <Grid container spacing={2}>
                {Array.isArray(filteredProducts) && filteredProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id} onClick={() => toggleSelectProduct(product._id)}>
                        <Card style={{ backgroundColor: selectedProducts.includes(product._id) ? 'lightgray' : 'white' }}>
                            <CardActionArea>
                                {product.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        image={product.imageUrl}
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Цена: {product.price} BYN
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to={`/products/${product._id}`}
                                        variant="outlined"
                                        color="primary"
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Подробнее
                                    </Button>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Название"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newProduct.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Описание"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={newProduct.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Цена"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={newProduct.price}
                        onChange={handleChange}
                    />
                    <TextField
                        type="file"
                        margin="dense"
                        name="image"
                        fullWidth
                        variant="standard"
                        onChange={handleFileChange}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="category-select-label">Категории</InputLabel>
                        <Select
                            labelId="category-select-label"
                            name="categories"
                            multiple
                            value={selectedCategories}
                            onChange={handleChange}
                            renderValue={(selected) => selected.map(id => categories.find(c => c._id === id).Name).join(', ')}
                        >
                            {categories.map(category => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleSubmit}>Добавить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductsPage;