import { User } from "./../../../models/User";
import mongoose from "mongoose";

export async function POST(req) {
    const body = await req.json();
    
    // Use mongoose.connect instead of createConnection
    try {
        await mongoose.connect(process.env.MONGO_URI); // Ensures connection to the DB
        const createdUser = await User.create(body);
        return Response.json(createdUser);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
