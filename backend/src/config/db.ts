import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/sahakari_seva";
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to ${mongoUri}`);
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    console.warn("[MongoDB] Running in degraded / retry mode.");
  }
};

