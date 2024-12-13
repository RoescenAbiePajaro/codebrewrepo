import { MongoClient } from "mongodb";

if (!process.env.MONGO_URL) {
  throw new Error('Missing environment variable: "MONGO_URL"');
}

const uri = process.env.MONGO_URL;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  tls: true, // Enable TLS/SSL
  tlsInsecure: false, // Ensure secure connection
};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  });
}

export default clientPromise;
