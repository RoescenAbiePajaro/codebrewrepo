// src\app\api\menu-items\route.js
import mongoose from "mongoose";
import { isAdmin } from "@/libs/userService";
import { MenuItem } from "@/models/MenuItem";


async function connectDB() {
  if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Database connection failed");
    }
  }
}

export async function GET() {
  try {
    await connectDB();
    const menuItems = await MenuItem.find(); // Fetch all menu items, including stock
    return new Response(JSON.stringify(menuItems), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve menu items" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate category if provided
    if (data.category && !mongoose.Types.ObjectId.isValid(data.category)) {
      throw new Error("Invalid category ObjectId");
    }
    if (!data.category) {
      data.category = null;
    }

    // Ensure that stock is provided and is a valid number
    if (data.stock === undefined || isNaN(data.stock)) {
      data.stock = 0; // Default stock to 0 if not provided or invalid
    }

    const menuItemDoc = await MenuItem.create(data);
    return new Response(JSON.stringify(menuItemDoc), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/menu-items:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to create menu item" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { _id, stock, ...data } = await req.json();

    // Allow stock updates for non-admin users
    if (stock !== undefined && !isNaN(stock)) {
      const updatedItem = await MenuItem.findByIdAndUpdate(_id, { stock }, { new: true });
      return new Response(JSON.stringify(updatedItem), { status: 200 });
    }

    // Allow admins to update other fields
    if (await isAdmin(req)) {
      const updatedItem = await MenuItem.findByIdAndUpdate(_id, data, { new: true });
      return new Response(JSON.stringify(updatedItem), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  } catch (error) {
    console.error("Error in PUT /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to update menu item" }), { status: 500 });
  }
}



export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    // Optionally handle stock before deletion (e.g., set to 0 or keep it)
    await MenuItem.deleteOne({ _id });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to delete menu item" }), { status: 500 });
  }
}

