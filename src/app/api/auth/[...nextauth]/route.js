import mongoose from "mongoose";
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      redirect_uri: process.env.REDIRECT_URI,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        
        await mongoose.connect(process.env.MONGO_URI); // Ensure connection is established
        const user = await User.findOne({ email });
        
        if (!user) {
          throw new Error('No user found with this email');
        }
        
        const passwordOk = await bcrypt.compare(password, user.password);
        
        if (!passwordOk) {
          throw new Error('Invalid password');
        }
        
        // If the credentials are valid, return the user object
        return { email: user.email, name: user.name }; // Ensure the return object has necessary fields
      }
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
