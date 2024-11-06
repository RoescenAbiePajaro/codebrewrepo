// app/api/users/route.js
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

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