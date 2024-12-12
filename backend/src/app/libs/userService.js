// src\libs\userService.js
import bcrypt from "bcrypt";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions"; // assuming you place the auth options in this file

export async function getUserByEmail(email) {
  return await User.findOne({ email });
}

export async function updateUserInfo(userEmail, updatedData) {
  return await UserInfo.findOneAndUpdate(
    { email: userEmail },
    updatedData,
    { upsert: true, new: true }
  );
}

export async function createUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
}

export const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  };
  

// Admin check function
export async function isAdmin() {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    const userInfo = await UserInfo.findOne({ email: userEmail });
    if (!userInfo) {
      return false;
    }
    return userInfo.admin;
  }

  // Permission check function
export async function isPermission(permissions) {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    
    const userInfo = await UserInfo.findOne({ email: userEmail });
    if (!userInfo) {
      return false;
    }
  
    // Check if user has the required permission
    if (permissions === 'user') {
      return userInfo.user;
    }
  
    // Default return false if permission is not recognized
    return false;
  }
  