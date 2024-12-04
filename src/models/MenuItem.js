import mongoose, { model, models, Schema } from "mongoose";

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  sizes: [{ type: String }],
  extraIngredientPrices: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { type: String },
});

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
