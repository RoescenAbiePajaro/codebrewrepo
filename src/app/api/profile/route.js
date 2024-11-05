import {User} from "@/models/User";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function PUT (req){

    mongoose.connect(process.env.MONGO_URI);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const email = session.user.email;


   
    await User.updateOne({email},data);
    return Response.json(true);
}

export async function GET (req){
    mongoose.connect(process.env.MONGO_URI);
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return Response.json({});
    }
    return Response.json(
        await User.findOne({email})
    );
}

