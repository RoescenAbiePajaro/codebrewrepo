// app/api/sales/route.js
import Receipt from "@/models/Receipt";
import mongoose from "mongoose";

async function connectDB() {
  if (!mongoose.connection.readyState) {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const timeframe = url.searchParams.get("timeframe") || "daily";

    let salesData;

    switch (timeframe) {
      case "daily":
        salesData = await Receipt.aggregate([
          { 
            $group: { 
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
              totalSales: { $sum: "$subtotal" } 
            } 
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "weekly":
        salesData = await Receipt.aggregate([
          { 
            $group: { 
              _id: { $isoWeek: "$createdAt" }, 
              totalSales: { $sum: "$subtotal" } 
            } 
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "monthly":
        salesData = await Receipt.aggregate([
          { 
            $group: { 
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, 
              totalSales: { $sum: "$subtotal" } 
            } 
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      default:
        throw new Error("Invalid timeframe parameter.");
    }

    // Format sales data for daily, weekly, monthly
    const formattedSales = salesData.reduce((acc, { _id, totalSales }) => {
      acc[_id] = totalSales;
      return acc;
    }, {});

    return new Response(JSON.stringify(formattedSales), { status: 200 });
  } catch (error) {
    console.error("Error retrieving sales data:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}