import OrderHistoryModel from '../models/history.js';

export const add = async (req, res) => {
    try {
        const { userId, orderId } = req.body;

        let orderHistory = await OrderHistoryModel.findOne({ user: userId });

        if (orderHistory) {
            orderHistory.orders.push(orderId);
            await orderHistory.save();
        } else {
            orderHistory = new OrderHistoryModel({
                user: userId,
                orders: [orderId],
            });
            await orderHistory.save();
        }

        res.status(200).json(orderHistory);
    } catch (err) {
        res.status(500).json({ message: 'Error adding to history', error: err });
    }
};

export const get = async (req, res) => {
    try {
        const userId = req.params.userId;

        const orderHistories = await OrderHistoryModel.findOne({ user: userId}).populate('orders');

        if (orderHistories) {
            res.status(200).json(orderHistories.orders);
        } else {
            res.status(404).json({ message: 'No order history yet' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order history', error: err });
    }
};