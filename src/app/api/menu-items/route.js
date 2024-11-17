import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URL, {
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    if (await isAdmin()) {
      const menuItemDoc = await MenuItem.create(data);
      return new Response(JSON.stringify(menuItemDoc), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }
  } catch (error) {
    console.error("Error in POST /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to create menu item" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { _id, ...data } = await req.json();

    if (await isAdmin()) {
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

export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    if (await isAdmin()) {
      await MenuItem.deleteOne({ _id });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }
  } catch (error) {
    console.error("Error in DELETE /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to delete menu item" }), { status: 500 });
  }
}
