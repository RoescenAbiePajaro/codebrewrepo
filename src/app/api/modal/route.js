// src/app/api/modal/route.js
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";

// Function to connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

export async function PUT(req) {
  await connectToDatabase();

  try {
    const data = await req.json();
    const { _id, name, email, admin, isVerified } = data;

    if (!_id) {
      return new Response(JSON.stringify({ error: "Missing user ID" }), { status: 400 });
    }

    // Update User data
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { $set: { name, email, admin, isVerified } },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Update UserInfo data
    const updatedUserInfo = await UserInfo.findOneAndUpdate(
      { email: updatedUser.email },
      { $set: { name, email, admin,isVerified } },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { ...updatedUser.toObject(), ...updatedUserInfo.toObject() } 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }), 
      { status: 500 }
    );
  }
}
