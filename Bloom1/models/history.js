import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        }
    ],
}, {
    timestamps: true
});

export default mongoose.model('OrderHistory', OrderHistorySchema);
