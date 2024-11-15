import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});

export const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);