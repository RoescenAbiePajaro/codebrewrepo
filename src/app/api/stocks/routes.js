// src/app/api/stocks/route.js
import mongoose from 'mongoose';
import MenuItem from '@/models/MenuItem';

async function connectDB() {
  if (!mongoose.connection.readyState) {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined');
    }
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const stocks = await MenuItem.find({}, 'name basePrice stock');
    return new Response(JSON.stringify(stocks), { status: 200 });
  } catch (error) {
    console.error("Error retrieving stocks data:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { _id, stock } = await req.json();

    if (typeof stock !== 'number' || stock < 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid stock value' }),
        { status: 400 }
      );
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      _id,
      { stock },
      { new: true }
    );

    if (!updatedItem) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    console.error("Error updating stock:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to update stock' }),
      { status: 500 }
    );
  }
}


