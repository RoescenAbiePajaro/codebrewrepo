// pages/api/sales.js
import { Order } from "@/models/Order";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await mongoose.connect(process.env.MONGO_URL);

      const { timeframe } = req.query;
      let salesData = {};

      const orders = await Order.find();

      orders.forEach(order => {
        const date = new Date(order.createdAt);
        let key;

        switch (timeframe) {
          case 'daily':
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
            break;
          case 'weekly':
            const week = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0]; // Start of the week
            key = week;
            break;
          case 'monthly':
            key = date.toISOString().split('T')[0].slice(0, 7); // YYYY-MM
            break;
          default:
            key = date.toISOString().split('T')[0];
        }

        if (!salesData[key]) {
          salesData[key] = 0;
        }

        const totalAmount = order.cartProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        salesData[key] += totalAmount;
      });

      res.status(200).json(salesData);
    } catch (error) {
      console.error('Error fetching sales data:', error); // Log the error for debugging
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}