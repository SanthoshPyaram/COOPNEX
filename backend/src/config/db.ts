import mongoose from "mongoose";
import dns from "dns";

// Guarantee SRV lookup resilience across varied network/ISP DNS resolvers
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getMaskedUri = (uri?: string): string => {
  if (!uri) return "[NOT_SET]";
  return uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
};

export const getMongoUri = (): string => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!uri) {
      const errMsg = "[FATAL] Production database configuration error: MONGO_URI (or MONGODB_URI) environment variable is required. A cloud MongoDB Atlas connection string (mongodb+srv://...) must be configured.";
      console.error(errMsg);
      throw new Error(errMsg);
    }
    if (uri.includes("localhost") || uri.includes("127.0.0.1")) {
      const errMsg = `[FATAL] Production database configuration error: MONGO_URI cannot point to localhost/127.0.0.1 in production. Target: ${getMaskedUri(uri)}`;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    return uri;
  }

  // Development default
  return uri || "mongodb://localhost:27017/sahakari_seva";
};

export const connectDB = async (): Promise<void> => {
  let mongoUri: string;
  try {
    mongoUri = getMongoUri();
  } catch (err: any) {
    console.error(err.message);
    return;
  }

  const masked = getMaskedUri(mongoUri);

  try {
    mongoose.set("strictQuery", true);

    // Mongoose Event Listeners
    mongoose.connection.on("connected", () => {
      console.log(`[MongoDB] Active connection established to ${masked}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error(`[MongoDB] Runtime connection error:`, err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(`[MongoDB] Connection disconnected from ${masked}.`);
    });

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });

    console.log(`[MongoDB] Initial connection successful to ${masked}`);
  } catch (error: any) {
    console.error(`[MongoDB] Initial connection failed for ${masked}:`, error?.message || error);
    if (process.env.NODE_ENV === "production") {
      console.error("[MongoDB] In production, verify MongoDB Atlas IP Whitelist (0.0.0.0/0) and credentials.");
    } else {
      console.warn("[MongoDB] Running in degraded mode. Local MongoDB service may need to be started.");
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("[MongoDB] Connection cleanly closed.");
  } catch (err: any) {
    console.error("[MongoDB] Error during disconnect:", err?.message || err);
  }
};


