import mongoose from "mongoose";
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
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
    const menuItems = await MenuItem.find();
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

    if (data.category && !mongoose.Types.ObjectId.isValid(data.category)) {
      throw new Error("Invalid category ObjectId");
    }
    if (!data.category) {
      data.category = null;
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
    const { _id, ...data } = await req.json();

    if (await isAdmin(req)) {
      await MenuItem.findByIdAndUpdate(_id, data);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }
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

    await MenuItem.deleteOne({ _id });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to delete menu item" }), { status: 500 });
  }
}

