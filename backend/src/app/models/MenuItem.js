import mongoose, { Schema } from "mongoose";

// Define the schema for extra prices
const ExtraPriceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

// Define the schema for MenuItems
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  // sizes should store objects with name and price
  sizes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
  }],
  // extraIngredientPrices should store objects with name and price
  extraIngredientPrices: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
  }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { type: String },
  stock: { type: Number, required: true, default: 0 },
});

// Ensure the MenuItem model is registered only once
export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
