// // /models/Order.js
// import { model, models, Schema } from "mongoose";

// const OrderSchema = new Schema({
//   userEmail: String,
//   phone: String,
//   streetAddress: String,
//   cartProducts: [{
//     name: String,
//     price: Number,
//     quantity: Number
//   }],
//   paid: { type: Boolean, default: false },
// }, { timestamps: true }); // Adds createdAt and updatedAt fields

// export const Order = models.Order || model('Order', OrderSchema);
