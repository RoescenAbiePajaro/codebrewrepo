import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    // Convert string values that should be booleans
    if (typeof otherUser.isActive === 'string') {
      otherUser.isActive = otherUser.isActive === 'true'; // Convert to boolean
    }

    let filter = {};
    if (_id) {
      filter = { _id };
    } else {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;
      filter = { email };
    }

    const user = await User.findOne(filter);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Update user data
    const updateUser = await User.updateOne(filter, { name, image });
    const updatedUser = await UserInfo.findOneAndUpdate(
      { email: user.email },
      otherUser,
      { upsert: true } // Missing comma added here
    );

    if (updateUser.modifiedCount === 0 && !updatedUser) {
      return new Response(JSON.stringify({ error: "No changes made" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
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