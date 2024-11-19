// app/api/users/route.js
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

export async function GET() {
  await mongoose.connect(process.env.MONGO_URL);
  if (await isAdmin()) {
    const users = await User.find();
    return Response.json(users);
  } else {
    return Response.json([]);
  }
}

export async function POST(request) {
  const { email, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser  = new User({ email, password: hashedPassword });
  await newUser .save();

  return new Response(null, { status: 201 });
}

export async function DELETE(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Get the last part of the URL path

    if (!id) {
      return new Response(JSON.stringify({ error: "User  ID is required" }), { status: 400 });
    }

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid User ID" }), { status: 400 });
    }

    const deletedUser  = await User.findByIdAndDelete(id);
    if (!deletedUser ) {
      return new Response(JSON.stringify({ error: "User  not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return new Response(JSON.stringify({ error: "Failed to delete user", details: error.message }), { status: 500 });
  }
}