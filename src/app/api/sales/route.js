// ./src/pages/api/sales.js
export default function handler(req, res) {
    if (req.method === 'GET') {
      // Sample sales data
      const salesData = {
        "2024-01-01": 100,
        "2024-01-02": 150,
        "2024-01-03": 200,
        "2024-01-04": 250,
        "2024-01-05": 300,
      };
      res.status(200).json(salesData);
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }