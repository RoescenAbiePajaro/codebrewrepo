//routeModule.js
import {User} from "@/models/User";
import mongoose from "mongoose";

export async function POST(req){
    const body = await req.json();
    mongoose.connect(process.env.MONGO_URI);
    const createdUser = await User.create(body);
    return Response.json(createdUser);
}
