import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function cleanDatabaseFreshStart() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGO_URI provided.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) {
    console.error("Could not obtain DB handle.");
    process.exit(1);
  }

  console.log("Connected to database:", db.databaseName);

  // Today start date (IST 2026-09-13 00:00:00 IST = 2026-09-12 18:30:00 UTC)
  // Let's use 2026-09-13T00:00:00.000Z or midnight IST
  const todayISTStart = new Date("2026-09-13T00:00:00.000+05:30");
  console.log("Cutoff for 'Registered Today' (IST):", todayISTStart.toISOString());

  // 1. Find workers in 'workers' collection
  const allWorkers = await db.collection("workers").find({}).toArray();
  console.log(`Total workers in 'workers' collection: ${allWorkers.length}`);

  let deletedWorkersCount = 0;
  for (const w of allWorkers) {
    const isDemo =
      (w.name && w.name.toLowerCase().includes("demo")) ||
      (w.phone && (w.phone.includes("98480 00001") || w.phone.includes("98765 43210") || w.phone.includes("9848000001"))) ||
      (w.email && w.email.toLowerCase().includes("demo"));
    
    const createdDate = w.createdAt ? new Date(w.createdAt) : null;
    const isBeforeToday = !createdDate || createdDate < todayISTStart;

    if (isDemo || isBeforeToday) {
      console.log(`Deleting worker: [${w._id}] ${w.name} (${w.phone}) - Created: ${w.createdAt} - Demo: ${isDemo}`);
      await db.collection("workers").deleteOne({ _id: w._id });
      deletedWorkersCount++;
    }
  }

  // 2. Find users in 'users' collection
  const allUsers = await db.collection("users").find({}).toArray();
  console.log(`Total users in 'users' collection: ${allUsers.length}`);

  let deletedUsersCount = 0;
  for (const u of allUsers) {
    // Keep SUPER_ADMIN safe
    if (u.role === "SUPER_ADMIN" || u.email === "superadmin@coopnex.gov.in") {
      console.log(`Preserving Super Admin: [${u._id}] ${u.name} (${u.role})`);
      continue;
    }

    const isDemo =
      (u.name && u.name.toLowerCase().includes("demo")) ||
      (u.phone && (u.phone.includes("9876500008") || u.phone.includes("98480 00001") || u.phone.includes("9848000001"))) ||
      (u.email && u.email.toLowerCase().includes("demo"));

    const createdDate = u.createdAt ? new Date(u.createdAt) : null;
    const isWorkerRole = u.role === "WORKER";
    const isBeforeToday = !createdDate || createdDate < todayISTStart;

    // Delete if explicitly demo, or if worker not registered today, or customer not registered today
    if (isDemo || (isWorkerRole && isBeforeToday) || isBeforeToday) {
      console.log(`Deleting user: [${u._id}] ${u.name} (${u.role}, ${u.phone}) - Created: ${u.createdAt} - Demo: ${isDemo}`);
      await db.collection("users").deleteOne({ _id: u._id });
      deletedUsersCount++;
    } else {
      console.log(`Preserving today's user: [${u._id}] ${u.name} (${u.role}, ${u.phone}) - Created: ${u.createdAt}`);
    }
  }

  // 3. Clear demo/old bookings, reviews, notifications, otps, messages
  const bookingsDeleted = await db.collection("bookings").deleteMany({});
  const reviewsDeleted = await db.collection("reviews").deleteMany({});
  const paymentsDeleted = await db.collection("payments").deleteMany({});
  const notificationsDeleted = await db.collection("notifications").deleteMany({});
  const otpsDeleted = await db.collection("otps").deleteMany({});
  const messagesDeleted = await db.collection("messages").deleteMany({});

  console.log("\n================ CLEANUP SUMMARY ================");
  console.log(`Workers Deleted:           ${deletedWorkersCount}`);
  console.log(`Users Deleted:             ${deletedUsersCount}`);
  console.log(`Bookings Cleared:          ${bookingsDeleted.deletedCount}`);
  console.log(`Reviews Cleared:           ${reviewsDeleted.deletedCount}`);
  console.log(`Payments Cleared:          ${paymentsDeleted.deletedCount}`);
  console.log(`Notifications Cleared:     ${notificationsDeleted.deletedCount}`);
  console.log(`OTPs Cleared:              ${otpsDeleted.deletedCount}`);
  console.log(`Messages Cleared:          ${messagesDeleted.deletedCount}`);

  const remainingWorkers = await db.collection("workers").countDocuments();
  const remainingUsers = await db.collection("users").countDocuments();
  console.log(`Remaining Workers in DB:   ${remainingWorkers}`);
  console.log(`Remaining Users in DB:     ${remainingUsers}`);
  console.log("=================================================\n");

  await mongoose.disconnect();
  console.log("Cleanup completed successfully!");
  process.exit(0);
}

cleanDatabaseFreshStart().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});

