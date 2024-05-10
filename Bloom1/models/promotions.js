import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PromotionsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: String,
});

export default mongoose.model('Promotions', PromotionsSchema);