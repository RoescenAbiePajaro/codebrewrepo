// src\app\api\receipt\route.js
import Receipt from "@/models/Receipt";
import mongoose from "mongoose";

async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const newReceipt = await Receipt.create(data);
    return new Response(JSON.stringify(newReceipt), { status: 201 });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return new Response(JSON.stringify({ error: "Failed to create receipt" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { _id, ...data } = await req.json();
    const updatedReceipt = await Receipt.findByIdAndUpdate(_id, data, { new: true });
    return new Response(JSON.stringify(updatedReceipt), { status: 200 });
  } catch (error) {
    console.error("Error updating receipt:", error);
    return new Response(JSON.stringify({ error: "Failed to update receipt" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const receipts = _id ? await Receipt.findById(_id) : await Receipt.find();
    return new Response(JSON.stringify(receipts), { status: 200 });
  } catch (error) {
    console.error("Error retrieving receipts:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve receipts" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Receipt ID is required" }), { status: 400 });
    }

    const deletedReceipt = await Receipt.findByIdAndDelete(id);
    if (!deletedReceipt) {
      return new Response(JSON.stringify({ error: "Receipt not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting receipt:", error.message);
    return new Response(JSON.stringify({ error: "Failed to delete receipt" }), { status: 500 });
  }
}

