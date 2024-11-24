import clientPromise from "@/libs/mongoConnect";
import { User } from '@/models/User';
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

// Connect to MongoDB if not already connected
async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

// NextAuth options
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
        await connectDB(); // Ensure DB connection
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with that email");
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return { email: user.email }; // Return user object
      }
    })
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  session: {
    strategy: "jwt",
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
