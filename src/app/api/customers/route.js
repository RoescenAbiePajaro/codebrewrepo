import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
    await mongoose.connect(process.env.MONGO_URL);
  
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Session not found", { status: 401 });
    }
  
    const admin = session?.user?.role === 'admin';
    if (!admin) {
      return new Response("Unauthorized: Admin access required", { status: 403 });
    }
  
    const orders = await Order.find().select('userEmail phone cartProducts');
    
    // Extract unique customers
    const uniqueCustomers = Array.from(new Set(orders.map(order => order.userEmail)))
      .map(email => {
        return orders.find(order => order.userEmail === email);
      });
  
    return Response.json(uniqueCustomers);
  }