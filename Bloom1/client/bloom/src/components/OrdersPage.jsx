import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, deleteOrder } from '../redux/slices/order';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    List,
    ListItem,
    ListItemText,
    CardMedia,
    Button,
    TextField,
    Box
} from '@mui/material';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [sortDirection, setSortDirection] = useState({
        price: 'asc',
        quantity: 'asc',
    });
    const [filters, setFilters] = useState({
        date: '',
        phoneNumber: '',
        address: '',
    });

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        setSortedOrders(orders);
    }, [orders]);

    const handleDelete = (orderId) => {
        dispatch(deleteOrder(orderId));
    };

    const handleSort = (field) => {
        const direction = sortDirection[field] === 'asc' ? 'desc' : 'asc';
        const sorted = [...sortedOrders].sort((a, b) => {
            const aValue = field === 'quantity' ? a.products.length : a.total;
            const bValue = field === 'quantity' ? b.products.length : b.total;

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortedOrders(sorted);
        setSortDirection({ ...sortDirection, [field]: direction });
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredOrders = sortedOrders.filter((order) => {
        return (
            (filters.date ? new Date(order.purchaseDate).toLocaleDateString().includes(filters.date) : true) &&
            (filters.phoneNumber ? order.phoneNumber.includes(filters.phoneNumber) : true) &&
            (filters.address ? order.address.toLowerCase().includes(filters.address.toLowerCase()) : true)
        );
    });

    return (
        <Container>
            <Typography variant="h4" style={{ margin: '20px 0' }}>Заказы</Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    label="Поиск по номеру телефона"
                    type="text"
                    value={filters.phoneNumber}
                    onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    label="Поиск по адресу"
                    type="text"
                    value={filters.address}
                    onChange={(e) => handleFilterChange('address', e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    label="Поиск по дате (гггг-мм-дд)"
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ marginRight: '10px' }}
                />
                <Button
                    variant="contained"
                    onClick={() => handleSort('price')}
                >
                    Сортировать по цене {sortDirection.price === 'asc' ? '⬆️' : '⬇️'}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleSort('quantity')}
                    style={{ marginLeft: '10px' }}
                >
                    Сортировать по количеству {sortDirection.quantity === 'asc' ? '⬆️' : '⬇️'}
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID заказа</TableCell>
                            <TableCell>Дата заказа</TableCell>
                            <TableCell>Итоговая стоимость</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Номер телефона</TableCell>
                            <TableCell>Товары</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{new Date(order.purchaseDate).toLocaleDateString()}</TableCell>
                                <TableCell>{order.total} BYN</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.phoneNumber}</TableCell>
                                <TableCell>
                                    <List>
                                        {order.products.map((product) => (
                                            <ListItem key={product._id}>
                                                <CardMedia
                                                    component="img"
                                                    height="100"
                                                    image={product.imageUrl}
                                                    alt={product.name}
                                                />
                                                <ListItemText primary={product.name} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(order._id)}
                                    >
                                        Удалить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default OrdersPage;
