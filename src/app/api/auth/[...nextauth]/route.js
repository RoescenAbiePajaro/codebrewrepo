// [project]/src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions";
import mongoose from "mongoose";
import db from "@/libs/db";

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return; // If already connected
  }
  await mongoose.connect(process.env.MONGO_URL); // No need to pass deprecated options
}

export async function GET(req, res) {
  const handler = NextAuth(authOptions);
  return handler(req, res); // pass the request and response to the NextAuth handler
}

export async function POST(req, res) {
  const handler = NextAuth(authOptions);
  return handler(req, res); // pass the request and response to the NextAuth handler
}
