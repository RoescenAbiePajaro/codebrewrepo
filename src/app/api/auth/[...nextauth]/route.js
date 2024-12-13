import NextAuth from "next-auth";
import { authOptions } from "@/libs/authOptions";
import mongoose from "mongoose";
import db from "@/libs/db";

// Ensure that the database connection is open
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await db();  // Connect to MongoDB if not already connected
  }
};

export async function GET(req, res) {
  try {
    await connectDB();  // Ensure the DB connection is ready before handling the request
    const handler = NextAuth(authOptions);  // NextAuth handler for GET requests
    return handler(req, res);
  } catch (error) {
    console.error("Error handling GET request:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors gracefully
  }
}

export async function POST(req, res) {
  try {
    await connectDB();  // Ensure the DB connection is ready before handling the request
    const handler = NextAuth(authOptions);  // NextAuth handler for POST requests
    return handler(req, res);
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors gracefully
  }
}
