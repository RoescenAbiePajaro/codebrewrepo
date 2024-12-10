// src/libs/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import clientPromise from "@/libs/mongoConnect";
import { connectDB } from "@/libs/db";
import { getUserByEmail } from "./userService";
import { verifyPassword } from "./userService";
import {UserInfo} from "@/models/UserInfo";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
      
        // Validate password is a non-empty string
        if (typeof credentials.password !== 'string' || credentials.password.trim() === '') {
          throw new Error("Password is required and cannot be empty");
        }


    // Check if the email domain is tealerin.com
    const emailDomain = credentials.email.split('@')[1];
    if (emailDomain !== 'tealerin.com') {
      throw new Error("Only users with the domain are allowed to log in");
    }
      
        await connectDB(); // Ensure DB connection
        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error("No user found with that email");
        }
      
        // Verify password using bcrypt
        const isPasswordValid = await verifyPassword(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

         // Check if the user is verified
  const userInfo = await UserInfo.findOne({ email: credentials.email });
  if (!userInfo || !userInfo.isVerified) {
    throw new Error("Your account is not verified by the admin");
  }
        // Return the user object with email and name
        return { email: user.email, name: user.name };
      }
    })
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  session: {
    strategy: "jwt", // Use JWT session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.email = token.email;
      session.name = token.name;
      return session;
    },

    
  },
};
