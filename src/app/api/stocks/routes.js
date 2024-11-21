import Receipt from "@/models/Receipt";
import MenuItem from "@/models/MenuItem"; // Ensure this is imported
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
  // Define your logic to check if the user is an admin
  return true; // Placeholder, replace with actual admin check
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
    const { _id, stock } = await req.json(); // Ensure stock is included

    if (await isAdmin()) {
      const updatedItem = await MenuItem.findByIdAndUpdate(_id, { stock }, { new: true });
      return new Response(JSON.stringify(updatedItem), { status: 200 }); // Return updated item
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }
  } catch (error) {
    console.error("Error in PUT /api/menu-items:", error);
    return new Response(JSON.stringify({ error: "Failed to update menu item" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const stocks = await MenuItem.find(); // Fetch all menu items
    return new Response(JSON.stringify(stocks), { status: 200 });
  } catch (error) {
    console.error("Error retrieving stocks data:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}