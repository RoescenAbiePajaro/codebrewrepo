import mongoose from 'mongoose';
import { Sale } from '@/models/Sale';

const connectDb = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
      throw new Error('Database connection failed');
    }
  }
};

export default async function handler(req, res) {
  await connectDb();

  if (req.method === 'GET') {
    try {
      const sales = await Sale.find(); // Fetch sales data
      const salesData = sales.reduce((acc, sale) => {
        const date = sale.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        acc[date] = (acc[date] || 0) + sale.amount; // Aggregate sales by date
        return acc;
      }, {});
      res.status(200).json(salesData);
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: 'Error fetching sales data', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}