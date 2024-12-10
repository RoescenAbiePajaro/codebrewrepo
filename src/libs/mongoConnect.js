import { MongoClient } from "mongodb";

// Ensure MONGO_URL is available in environment variables
if (!process.env.MONGO_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"');
}

const uri = process.env.MONGO_URL;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

// MongoDB client instance and connection promise
let client;
let clientPromise;

// Ensure MongoClient is used properly in development and production environments
if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to reuse the MongoClient connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new MongoClient for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

export default clientPromise;
