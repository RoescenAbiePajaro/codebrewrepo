import Receipt from "@/models/Receipt";
import mongoose from "mongoose";

async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Get the id from the query parameters
    await Receipt.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return new Response(JSON.stringify({ error: "Failed to delete receipt" }), { status: 500 });
  }
}
