// src\app\api\profile
import { authOptions } from "@/libs/authOptions";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

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
    const { _id, name, image, ...otherUser } = data;

    // Convert specific fields to booleans if they're strings
    const booleanFields = ['isActive', 'admin'];
    booleanFields.forEach(field => {
      if (typeof otherUser[field] === 'string') {
        otherUser[field] = otherUser[field].trim() === 'true';
      }
    });

    // Determine filter based on _id or user session
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

    // Update main User data
    const updatedUser = await User.findOneAndUpdate(
      filter,
      { $set: { name, image } }, // Ensure image is updated here
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



export async function GET(req) {
  await connectToDatabase(); // Ensure connection

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');

  let filterUser  = {};
  if (_id) {
    filterUser  = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    filterUser  = { email };
  }

  try {
    const user = await User.findOne(filterUser ).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "User  not found" }), { status: 404 });
    }

    const userInfo = await UserInfo.findOne({ email: user.email }).lean();
    return new Response(JSON.stringify({ ...user, ...userInfo }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}