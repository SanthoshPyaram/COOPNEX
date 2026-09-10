import mongoose from "mongoose";

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/sahakari_seva";
  const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to ${maskedUri}`);
  } catch (error: any) {
    console.error(`[MongoDB] Connection error for ${maskedUri}:`, error?.message || error);
    console.warn("[MongoDB] Running in degraded mode. Database operations will require active MongoDB connection.");
  }
};

