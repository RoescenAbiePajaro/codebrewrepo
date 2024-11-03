//route.js api/auth/[]...nextauth]
import mongoose from "mongoose";
import {User} from '@/models/User';
import bcrypt from 'bcrypt';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
secret: process.env.SECRET,
  providers:[
      CredentialsProvider({
          name: "Credentials",
          id:'credentials',
          credentials: {
            name: { label: "Name", type: "nname", placeholder: "Your name here" }, // name: { label: "Name", type: "name", placeholder: "Your Name" },
            username: { label: "Email", type: "email", placeholder: "test@example.com" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials, req) {
            const nname = credentials?.nname; // const nname = credentials?.name;
            const email =  credentials?.email;
            const password = credentials?.password;

            mongoose.connect(process.env.MONGO_URI);
            const user = await User.findOne({ $or: [{ nname }, { email }] }); //const user = await User.findOne({{ email }] });
            const passwordOk = user && bcrypt.compareSync(password, user.password);
            
            if (passwordOk)  {
              return user;
            }

            return null
          }
        })
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }