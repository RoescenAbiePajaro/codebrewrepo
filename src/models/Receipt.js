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
      basePrice: Number,
      sizes: [
        {
          name: String,
          price: Number,
        }
      ],
      extraIngredients: [
        {
          name: String,
          price: Number,
        }
      ],
      total: Number,  // The calculated total for this product
    }
  ],
  subtotal: Number,  // The sum of the total for all products
  change: Number,  // Change to be given to the customer
  createdAt: {
    type: Date,
    default: () => moment.tz("Asia/Manila").toDate(),
  },
});

const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

export default Receipt;
