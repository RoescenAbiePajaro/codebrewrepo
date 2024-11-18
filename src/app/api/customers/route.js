import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    console.log("Attempting to fetch customers...");

    if (!mongoose.connection.readyState) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URL);
    }

    const session = await getServerSession(req, authOptions);
    if (!session) {
      console.error("Session not found");
      return new Response("Session not found", { status: 401 });
    }

    if (session.user.role !== "admin") {
      console.error("Unauthorized access attempt by user:", session.user.email);
      return new Response("Unauthorized: Admin access required", { status: 403 });
    }

    const orders = await Order.find().select("userEmail phone cartProducts");

    const uniqueCustomers = orders.reduce((acc, order) => {
      if (!acc.some((cust) => cust.userEmail === order.userEmail)) {
        acc.push(order);
      }
      return acc;
    }, []);

    console.log("Customers fetched successfully");
    return new Response(JSON.stringify(uniqueCustomers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching unique customers:", error.message, error.stack);
    return new Response("Internal Server Error", { status: 500 });
  }
}
