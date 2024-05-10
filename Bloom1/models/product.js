import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: String,
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
});

export default mongoose.model('Product', ProductSchema);