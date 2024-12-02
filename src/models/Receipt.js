// src\models\Receipt.js
import mongoose from 'mongoose';
import moment from 'moment-timezone';

const ReceiptSchema = new mongoose.Schema({
  customer: {
    staffname: String,
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
