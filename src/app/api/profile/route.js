import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const { name, image, ...otherUserInfo } = data;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const email = session.user.email;

    // Update the User and UserInfo documents
    await User.updateOne({ email }, { name, image });
    await UserInfo.findOneAndUpdate({ email }, otherUserInfo, { upsert: true });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in PUT /profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const email = session.user.email;
    const user = await User.findOne({ email }).lean();
    const userInfo = await UserInfo.findOne({ email }).lean();

    if (!user && !userInfo) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({ ...user, ...userInfo }), { status: 200 });
  } catch (error) {
    console.error("Error in GET /profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
