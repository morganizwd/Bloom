import mongoose from 'mongoose';
const { Schema } = mongoose;

const FavoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }
    ],
}, {
    timestamps: true,
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

export default Favorite;