import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, 
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        text: String,
        rating: Number,
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Review', ReviewSchema);