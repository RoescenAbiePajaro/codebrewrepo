// src\app\api\users\route.js
import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

// CREATE - POST: Add a new user
export async function POST(req) {
  await connectToDatabase();

  try {
    const { name, email, password, admin = false, permissions = false, } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name || "Unnamed User", // Default name if not provided
      email,
      password: hashedPassword,
      admin,
      permissions,
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to create user", details: error.message }),
      { status: 500 }
    );
  }
}

// READ - GET: Fetch all users or a single user by ID
export async function GET(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single user by ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return new Response(
          JSON.stringify({ error: "Invalid User ID" }),
          { status: 400 }
        );
      }

      const user = await User.findById(id);

      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404 }
        );
      }

      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      // Fetch all users
      const users = await User.find();
      return new Response(JSON.stringify(users), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users", details: error.message }),
      { status: 500 }
    );
  }
}

// UPDATE - PUT: Update a user's details
export async function PUT(req) {
  await connectToDatabase();

  try {
    const data = await req.json();
    const { _id, name, email, admin, permissions, } = data;

    if (!_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required for update" }),
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid User ID" }),
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: { name, email, admin, permissions, } },
      { new: true } 
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ user: updatedUser }), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to update user", details: error.message }),
      { status: 500 }
    );
  }
}

// DELETE - DELETE: Remove a user by ID
export async function DELETE(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "User ID is required for deletion" }),
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid User ID" }),
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "User deleted successfully", user: deletedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to delete user", details: error.message }),
      { status: 500 }
    );
  }
}