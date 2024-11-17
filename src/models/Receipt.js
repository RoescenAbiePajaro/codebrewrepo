//models/Receipt.js this is for receipt model for mongodb 
import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
  },
  cartProducts: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  subtotal: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

export default Receipt;
