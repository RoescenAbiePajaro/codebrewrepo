//models/Receipt.js this is for receipt model for mongodb 
import mongoose from 'mongoose';
import moment from 'moment-timezone';

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
    default: () => moment.tz("Asia/Manila").toDate(),
  },
});

const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

export default Receipt;