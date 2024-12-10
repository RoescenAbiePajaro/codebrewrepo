// import mongoose from "mongoose";

// export async function connectDB() {
//   if (mongoose.connections[0].readyState) {
//     return; // If already connected
//   }
//   await mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// }

import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return; // If already connected
  }
  await mongoose.connect(process.env.MONGO_URL); // No need to pass deprecated options
}

