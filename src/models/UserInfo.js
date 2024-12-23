import { Schema, model, models } from "mongoose";

const UserInfoSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String },
    admin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    streetAddress: { type: String },
  },
  { timestamps: true }
);

export const UserInfo = models.UserInfo || model("UserInfo", UserInfoSchema);

