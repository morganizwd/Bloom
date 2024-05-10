import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPromotion } from '../redux/slices/promotion';
import { createPromotion, deletePromotion } from '../redux/slices/promotion';
import axios from '../redux/axios';
import { Button, Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const PromotionsPage = () => {
    const dispatch = useDispatch();
    const [selectedPromotions, setSelectedPromotions] = useState([]);
    const promotions = useSelector(state => state.promotions.promotions.items);
    const user = useSelector(state => state.auth.data);
    const [open, setOpen] = useState(false);
    const [newPromotion, setNewPromotion] = useState({
        name: '',
        description: '',
        imageUrl: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewPromotion({ ...newPromotion, [name]: value });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const uploadPromotion = async (formData) => {
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
        formData.append('name', newPromotion.name);
        formData.append('description', newPromotion.description);

        const response = await uploadPromotion(formData);

        if (response.url) {
            const protocol = window.location.protocol;
            const fullImageUrl = `${protocol}//localhost:4444${response.url}`;

            const promotionWithImage = { ...newPromotion, imageUrl: fullImageUrl };
            dispatch(createPromotion(promotionWithImage));
        }

        handleClose();
    };

    const toggleSelectPromotion = (id) => {
        setSelectedPromotions(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(pid => pid !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = async () => {
        await Promise.all(selectedPromotions.map(id => dispatch(deletePromotion(id))));
        setSelectedPromotions([]);
    };

    useEffect(() => {
        dispatch(fetchPromotion());
    }, [dispatch]);

    const [imageFile, setImageFile] = useState(null);

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    return (
        <div style={{ margin: '20px' }}>
            {user && user.role === 'admin' && (
                <>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        Добавить
                    </Button>
                    {selectedPromotions.length > 0 && (
                        <Button variant="contained" color="secondary" onClick={handleDeleteSelected}>
                            Удалить
                        </Button>
                    )}
                </>
            )}
            <Grid container spacing={2}>
                {promotions.map(promotion => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={promotion._id} onClick={() => toggleSelectPromotion(promotion._id)}>
                        <Card style={{ backgroundColor: selectedPromotions.includes(promotion._id) ? 'lightgray' : 'white' }}>
                            <CardActionArea>
                                {promotion.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        image={promotion.imageUrl}
                                        alt={promotion.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {promotion.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {promotion.description}
                                    </Typography>
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
                        value={newPromotion.name}
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
                        value={newPromotion.description}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleSubmit}>Добавить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PromotionsPage;