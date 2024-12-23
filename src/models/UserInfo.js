import { Schema, model, models } from "mongoose";

const UserInfoSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String }, // Optional, no validation
    admin: { type: Boolean, default: false }, // Default is non-admin
    isVerified: { type: Boolean, default: false }, // For user email or account verification
    phone: { type: String }, // Optional phone field
    streetAddress: { type: String }, // Optional address
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const UserInfo = models.UserInfo || model("UserInfo", UserInfoSchema);

