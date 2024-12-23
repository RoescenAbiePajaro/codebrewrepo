//Model\User.js
import { model, models, Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String },
    firstName: { type: String ,default: 'Anonymous' },
    lastName: { type: String, default: 'User' },
    email: { type: String, required: true, unique: true, match: '/^[^\s@]+@[^\s@]+\.[^\s@]+$/' },
    password: { type: String },
    admin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, // New field for verification
}, { timestamps: true });

export const User = models?.User  || model('User', UserSchema);