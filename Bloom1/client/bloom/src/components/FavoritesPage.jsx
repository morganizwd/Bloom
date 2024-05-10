import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFavorite } from '../redux/slices/favorite';
import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const FavoritesPage = () => {
    const dispatch = useDispatch();
    const { favorites } = useSelector(state => state.favorites);
    const userId = useSelector(state => state.auth.data._id);

    useEffect(() => {
        if (userId) {
            dispatch(fetchFavorites(userId));
        }
    }, [dispatch, userId]);

    const handleRemoveFromFavorites = (productId) => {
        dispatch(removeFavorite({ userId, productId }))
            .then(() => {
                console.log("Product removed from favorites");
            })
            .catch((error) => {
                console.error("Failed to remove product from favorites", error);
            });
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '4vh' }}>
            <Grid container spacing={4}>
                {favorites.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card>
                            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={product.imageUrl}
                                    alt={product.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" color="primary">
                                        {product.name}
                                    </Typography>
                                </CardContent>
                            </Link>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleRemoveFromFavorites(product._id)}
                                    startIcon={<DeleteIcon />}
                                >
                                    Удалить из избранного
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FavoritesPage;