import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function PUT (req){

    mongoose.connect(process.env.MONGO_URI);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    console.log(session);

    if ('name' in data){

    }

    return Response.json(true);
}