import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderHistories } from '../redux/slices/history';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Paper } from '@mui/material';

const OrderHistoryPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.data);
    const { orderHistories, productDetails, status, error } = useSelector((state) => state.orderHistories);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchOrderHistories(user._id));
        }
    }, [dispatch, user]);

    if (status === 'loading') {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container><Typography color="error">Error: {error}</Typography></Container>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>История заказов</Typography>
            {orderHistories.length > 0 ? orderHistories.map((history) => (
                <Paper key={history._id} style={{ marginBottom: '20px', padding: '20px' }}>
                    <Typography variant="h6">Заказ № {history._id}</Typography>
                    <Typography variant="body1">Дата: {new Date(history.purchaseDate).toLocaleDateString()}</Typography>
                    <Typography variant="body2">Адрес: {history.address}</Typography>
                    <Typography variant="body2">Телефон: {history.phoneNumber}</Typography>
                    <Typography variant="body2">Общая сумма: ${history.total}</Typography>
                    <List>
                        {history.products?.map((productId) => {
                            const product = productDetails[productId];
                            return (
                                <ListItem key={productId}>
                                    <ListItemText
                                        primary={product ? product.name : "Загрузка..."}
                                        secondary={product && `Цена: $${product.price}`}
                                    />
                                    {product && <img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} />}
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            )) : <Typography>История заказов пуста.</Typography>}
        </Container>
    );
};

export default OrderHistoryPage;