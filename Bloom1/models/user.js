import mongoose from "mongoose";
import { OrderSchema } from './order.js';

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            maxlength: 32,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        orders: [OrderSchema],
    },
    {
        timestamps: true,
    },
);

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);