// src libs/crud.js
import { connectDB } from "@/libs/db";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  await connectDB();

  try {
    const data = await req.json();
    const { _id, name, image, ...otherUser } = data;

    // Convert specific fields to booleans if they're strings
    const booleanFields = ['isActive', 'admin', 'permissions'];
    booleanFields.forEach(field => {
      if (typeof otherUser[field] === 'string') {
        otherUser[field] = otherUser[field].trim() === 'true';
      }
    });

    let filter = {};
    if (_id) {
      filter = { _id };
    } else {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;
      if (!email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
      }
      filter = { email };
    }

    const updatedUser = await User.findOneAndUpdate(
      filter,
      { $set: { name, image } },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Update or upsert additional user info in UserInfo
    const updatedUserInfo = await UserInfo.findOneAndUpdate(
        { email: updatedUser.email },
        otherUser,
        { upsert: true, new: true }
      );

    return new Response(
      JSON.stringify({ success: true, user: { ...updatedUser.toObject(), ...updatedUserInfo.toObject() } }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (session?.user?.email === 'admin@tealerin.com') {  // Assuming 'admin@example.com' is the admin email
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } else {
    return new Response(JSON.stringify([]), { status: 403 });
  }
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Get the last part of the URL path

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid User ID" }), { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return new Response(JSON.stringify({ error: "Failed to delete user", details: error.message }), { status: 500 });
  }
}
