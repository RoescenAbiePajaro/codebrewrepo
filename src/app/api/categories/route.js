// src\app\api\categories\route.js
import { Category } from "@/models/Category";
import mongoose from "mongoose";

async function connectDB() {
  if (!mongoose.connection.readyState) {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

async function isAdmin() {
  // Implement your logic to check if the user is an admin
  return true; // Placeholder
}

export async function POST(req) {
  await connectDB();
  try {
    const { name } = await req.json();
    if (await isAdmin()) {
      const newCategory = new Category({ name });
      await newCategory.save();
      return Response.json({ success: true, category: newCategory });
    }
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("POST error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  try {
    const { _id, name } = await req.json();
    if (await isAdmin()) {
      const result = await Category.updateOne({ _id }, { name });
      if (result.modifiedCount === 0) {
        throw new Error("Category not found or not modified");
      }
      return Response.json({ success: true });
    }
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    if (await isAdmin()) {
      const result = await Category.deleteOne({ _id });
      if (result.deletedCount === 0) {
        throw new Error("Category not found");
      }
      return Response.json({ success: true });
    }
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  try {
    const categories = await Category.find();
    return Response.json(categories);
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}