import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export async function migrateToAtlas(targetAtlasUri?: string) {
  const atlasUri = targetAtlasUri || process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!atlasUri || atlasUri.includes("localhost") || atlasUri.includes("127.0.0.1")) {
    throw new Error("Valid MongoDB Atlas URI (mongodb+srv://...) required for migration.");
  }

  const localUri = "mongodb://localhost:27017/sahakari_seva";
  const maskedAtlas = atlasUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");

  console.log("=====================================================");
  console.log(" COOPNEX - DATABASE MIGRATION TO MONGODB ATLAS");
  console.log(` Source: ${localUri}`);
  console.log(` Target: ${maskedAtlas}`);
  console.log("=====================================================");

  const localConn = await mongoose.createConnection(localUri).asPromise();
  console.log("[Source] Connected to local MongoDB.");

  const atlasConn = await mongoose.createConnection(atlasUri, {
    serverSelectionTimeoutMS: 10000
  }).asPromise();
  console.log("[Target] Connected to MongoDB Atlas.");

  if (!localConn.db || !atlasConn.db) {
    throw new Error("Database connection established but database instance is unavailable.");
  }

  const collections = await localConn.db.listCollections().toArray();
  const summary: Array<{ collection: string; localCount: number; atlasCount: number; status: string }> = [];

  for (const col of collections) {
    const colName = col.name;
    const localCollection = localConn.db.collection(colName);
    const atlasCollection = atlasConn.db.collection(colName);

    const docs = await localCollection.find({}).toArray();
    const localCount = docs.length;

    if (docs.length > 0) {
      const ops = docs.map((doc: any) => ({
        replaceOne: {
          filter: { _id: doc._id },
          replacement: doc,
          upsert: true
        }
      }));
      await atlasCollection.bulkWrite(ops);
    }

    try {
      const indexes = await localCollection.indexes();
      for (const idx of indexes) {
        if (idx.name === "_id_") continue;
        const keys = idx.key;
        const options: any = { name: idx.name };
        if (idx.unique) options.unique = true;
        if (idx.sparse) options.sparse = true;
        await atlasCollection.createIndex(keys, options);
      }
    } catch (idxErr: any) {
      console.warn(`  Index note on ${colName}:`, idxErr.message);
    }

    const atlasCount = await atlasCollection.countDocuments();
    const isMatch = localCount === atlasCount;

    summary.push({
      collection: colName,
      localCount,
      atlasCount,
      status: isMatch ? "VERIFIED" : "MISMATCH"
    });

    console.log(`  ✓ ${colName}: Local=${localCount} | Atlas=${atlasCount} [${isMatch ? "VERIFIED" : "MISMATCH"}]`);
  }

  console.log("=====================================================");
  console.log(" MIGRATION VERIFICATION AUDIT");
  console.log("=====================================================");
  console.table(summary);

  await localConn.close();
  await atlasConn.close();
  console.log("[Migration] Both database connections closed cleanly.");
  return summary;
}

if (require.main === module) {
  const targetUri = process.argv[2];
  migrateToAtlas(targetUri).catch((err) => {
    console.error("[Migration Fatal Error]:", err.message);
    process.exit(1);
  });
}
