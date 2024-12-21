import mongoose from 'mongoose';
import moment from 'moment-timezone';

const ReceiptSchema = new mongoose.Schema({
  customer: {
    staffname: { type: String, required: true },
  },

  product: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
      // Additional product details can be added as needed
    },
  ],

  cartProducts: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
      quantity: { type: Number, required: true, min: 1 }, // Quantity must be at least 1
      change: { type: Number, required: true, min: 0 }, // Change must be non-negative
    },
  ],

  total: { type: Number, required: true, min: 0 }, // Total price for all products
  subtotal: { type: Number, required: true, min: 0 }, // Subtotal before any change
  createdAt: {
    type: Date,
    default: () => moment.tz("Asia/Manila").toDate(), // Sets the default to the current time in Manila timezone
  },
});

// Check if the model already exists to prevent re-compiling
const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

export default Receipt;
