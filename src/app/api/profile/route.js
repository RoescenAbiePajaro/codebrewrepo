import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function PUT (req){

    mongoose.connect(process.env.MONGO_URI);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const email = session.user.email;


    if ('name' in data){
        const user = await User.findOne({email});
        user.name = data.name;
        await user.save();
        console.log({email:{name:date.name}});
    }

    return Response.json(true);
}