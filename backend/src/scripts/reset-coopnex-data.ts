import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

// Explicitly load backend .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { getMongoUri, getMaskedUri } from "../config/db";
import { User } from "../models/User";
import { Admin, SecurityEvent, AdminAuditLog } from "../models/Admin";
import { Worker } from "../models/Worker";
import { Booking } from "../models/Booking";
import { Payment } from "../models/Payment";
import { Invoice } from "../models/Invoice";
import { Review } from "../models/Review";
import { Notification } from "../models/Notification";
import { Otp } from "../models/Otp";
import { StoredDocument } from "../models/StoredDocument";
import { WorkforceExchange } from "../models/WorkforceExchange";
import { Complaint } from "../models/Complaint";
import { InsurancePolicy } from "../models/Insurance";
import { WelfareBenefit } from "../models/Welfare";
import { DemandRecord } from "../models/DemandRecord";
import { Society } from "../models/Society";
import { Federation } from "../models/Federation";

const UPLOADS_ROOT = path.resolve(__dirname, "../../uploads");
const DOCUMENTS_DIR = path.join(UPLOADS_ROOT, "documents");
const AVATARS_DIR = path.join(UPLOADS_ROOT, "avatars");

export async function resetCoopnexData(): Promise<void> {
  console.log("========================================================");
  console.log("  COOPNEX SECURE DATABASE CLEANUP & RESET FOR ROUND 3");
  console.log("========================================================\n");

  // 1. Connection & Target Verification
  const uri = getMongoUri();
  console.log(`[Target URI]: ${getMaskedUri(uri)}`);

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Fatal: Could not obtain database handle from active connection.");
  }

  const databaseName = db.databaseName;
  console.log(`[Database Name]: ${databaseName}`);

  if (databaseName !== "sahakari_seva") {
    throw new Error(`Safety Abort: Active database is '${databaseName}', expected 'sahakari_seva'.`);
  }

  // 2. Identify and Guard SUPER_ADMIN
  console.log("\n[Step 1/5] Identifying existing SUPER_ADMIN...");

  const existingAdmin = await Admin.findOne({ role: "SUPER_ADMIN" });
  if (!existingAdmin) {
    throw new Error("CRITICAL SAFETY ABORT: No SUPER_ADMIN found in 'admins' collection. Aborting to protect database!");
  }

  const existingUserAdmin = await User.findOne({
    role: "SUPER_ADMIN",
    $or: [{ email: existingAdmin.email.toLowerCase() }, { adminId: existingAdmin.adminId }]
  }) || await User.findOne({ role: "SUPER_ADMIN" });

  if (!existingUserAdmin) {
    throw new Error("CRITICAL SAFETY ABORT: No SUPER_ADMIN found in 'users' collection. Aborting to protect database!");
  }

  console.log(`✓ Preserved Admin Identity: adminId="${existingAdmin.adminId}", email="${existingAdmin.email}"`);
  console.log(`✓ Preserved User Identity: _id="${existingUserAdmin._id}", email="${existingUserAdmin.email}", role="${existingUserAdmin.role}"`);

  // 3. Targeted Deletions
  console.log("\n[Step 2/5] Executing targeted data cleanup...");

  // Non-admin Users
  const usersDeleted = await User.deleteMany({ _id: { $ne: existingUserAdmin._id } });
  const adminsDeleted = await Admin.deleteMany({ _id: { $ne: existingAdmin._id } });

  // Workers
  const workersDeleted = await Worker.deleteMany({});

  // Bookings & Transactions
  const bookingsDeleted = await Booking.deleteMany({});
  const paymentsDeleted = await Payment.deleteMany({});
  const invoicesDeleted = await Invoice.deleteMany({});

  // Reviews, Notifications & OTPs
  const reviewsDeleted = await Review.deleteMany({});
  const notificationsDeleted = await Notification.deleteMany({});
  const otpsDeleted = await Otp.deleteMany({});

  // Stored Documents, AI exchanges, Audit & Security Logs
  const documentsDeleted = await StoredDocument.deleteMany({});
  const workforceExchangesDeleted = await WorkforceExchange.deleteMany({});
  const securityEventsDeleted = await SecurityEvent.deleteMany({});
  const auditLogsDeleted = await AdminAuditLog.deleteMany({});

  // Complaints, Insurance, Demands, and auxiliary collections
  const complaintsDeleted = await Complaint.deleteMany({});
  const insuranceDeleted = await InsurancePolicy.deleteMany({});
  const demandRecordsDeleted = await DemandRecord.deleteMany({});
  const welfareBenefitsDeleted = await WelfareBenefit.deleteMany({});

  let phoneVerificationsDeleted = { deletedCount: 0 };
  try {
    phoneVerificationsDeleted = await db.collection("phoneverifications").deleteMany({});
  } catch {}

  // 4. Clean local upload files (test documents and test avatars)
  console.log("\n[Step 3/5] Cleaning local disk storage cache for test documents and avatars...");
  let localFilesDeletedCount = 0;

  for (const dir of [DOCUMENTS_DIR, AVATARS_DIR]) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        try {
          fs.unlinkSync(path.join(dir, file));
          localFilesDeletedCount++;
        } catch (err) {
          console.warn(`Could not delete file ${file}:`, err);
        }
      }
    }
  }
  console.log(`✓ Cleaned ${localFilesDeletedCount} cached disk files.`);

  // 5. Reset master data counters
  console.log("\n[Step 4/5] Resetting system master data counters...");
  await Society.updateMany({}, {
    $set: {
      activeWorkersCount: 0,
      totalBookingsCompleted: 0
    }
  });

  const societyCount = await Society.countDocuments();
  await Federation.updateMany({}, {
    $set: {
      totalWorkersCount: 0,
      totalSocietiesCount: societyCount
    }
  });

  // 6. Post-Cleanup Verification
  console.log("\n[Step 5/5] Performing post-cleanup verification...");

  const superAdminCount = await Admin.countDocuments();
  const superAdminUserCount = await User.countDocuments();
  const remainingWorkers = await Worker.countDocuments();
  const remainingBookings = await Booking.countDocuments();
  const remainingPayments = await Payment.countDocuments();
  const remainingInvoices = await Invoice.countDocuments();
  const remainingReviews = await Review.countDocuments();
  const remainingNotifications = await Notification.countDocuments();
  const remainingDocuments = await StoredDocument.countDocuments();
  const remainingExchanges = await WorkforceExchange.countDocuments();
  const remainingSocieties = await Society.countDocuments();
  const remainingFederations = await Federation.countDocuments();

  // Safety Assertion
  if (superAdminCount !== 1 || superAdminUserCount !== 1) {
    throw new Error(`Verification Failure: Expected exactly 1 SUPER_ADMIN, found ${superAdminCount} admin and ${superAdminUserCount} user.`);
  }

  if (remainingWorkers !== 0 || remainingBookings !== 0 || remainingPayments !== 0) {
    throw new Error("Verification Failure: Application data remaining after deletion!");
  }

  const verifiedAdmin = await Admin.findById(existingAdmin._id);
  const verifiedUser = await User.findById(existingUserAdmin._id);

  if (!verifiedAdmin || verifiedAdmin.role !== "SUPER_ADMIN" || verifiedAdmin.status !== "ACTIVE") {
    throw new Error("Verification Failure: SUPER_ADMIN admin record corrupted or inactive.");
  }
  if (!verifiedUser || verifiedUser.role !== "SUPER_ADMIN" || verifiedUser.status !== "ACTIVE") {
    throw new Error("Verification Failure: SUPER_ADMIN user record corrupted or inactive.");
  }

  console.log("\n========================================================");
  console.log("            COOPNEX DATABASE CLEANUP COMPLETE           ");
  console.log("========================================================");
  console.log(`Database:                   ${databaseName}`);
  console.log(`SUPER_ADMIN (Admin):        ${superAdminCount} preserved (ID: ${verifiedAdmin.adminId})`);
  console.log(`SUPER_ADMIN (User):         ${superAdminUserCount} preserved (Email: ${verifiedUser.email})`);
  console.log(`Workers:                    ${remainingWorkers}`);
  console.log(`Customers:                  0 (all ${usersDeleted.deletedCount} non-admin accounts removed)`);
  console.log(`Bookings:                   ${remainingBookings}`);
  console.log(`Payments:                   ${remainingPayments}`);
  console.log(`Invoices:                   ${remainingInvoices}`);
  console.log(`Reviews:                    ${remainingReviews}`);
  console.log(`Notifications:              ${remainingNotifications}`);
  console.log(`Stored Documents / KYC:     ${remainingDocuments}`);
  console.log(`Workforce Exchanges:        ${remainingExchanges}`);
  console.log(`Security Events / Audits:   0`);
  console.log(`Societies (Master Data):    ${remainingSocieties} preserved`);
  console.log(`Federations (Master Data):  ${remainingFederations} preserved`);
  console.log("========================================================");
  console.log("Database successfully reset and verified for Round 3.\n");

  await mongoose.disconnect();
}

// Auto-run when executed directly from CLI
if (require.main === module) {
  resetCoopnexData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("\n[RESET FAILED]:", err.message);
      process.exit(1);
    });
}
