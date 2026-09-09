import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Worker } from "../models/Worker";
import { Admin } from "../models/Admin";
import { USER_ROLES } from "../config/constants";

export async function ensureDemoAccounts(): Promise<void> {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    // 1. Safe Index Migration: Drop old single-field unique index on email if present
    try {
      const indexes = await db.collection("users").indexes();
      const hasOldEmailUnique = indexes.some((idx) => idx.name === "email_1" && idx.unique);
      if (hasOldEmailUnique) {
        await db.collection("users").dropIndex("email_1");
        console.log("[DemoSeed] Dropped obsolete single-field email_1 unique index to allow customer/worker email sharing.");
      }
      const hasOldPhoneUnique = indexes.some((idx) => idx.name === "phone_1" && idx.unique);
      if (hasOldPhoneUnique) {
        await db.collection("users").dropIndex("phone_1");
        console.log("[DemoSeed] Dropped obsolete single-field phone_1 unique index.");
      }
      // Rebuild schema compound indexes
      await User.syncIndexes();
    } catch (idxErr) {
      console.warn("[DemoSeed] Index synchronization note:", idxErr);
    }

    const salt = await bcrypt.genSalt(10);
    const workerHash = await bcrypt.hash("Coopnex@Worker2026!", salt);
    const adminHash = await bcrypt.hash("Coopnex@Admin2026!", salt);
    const customerHash = await bcrypt.hash("Coopnex@Customer2026!", salt);

    // 2. Ensure Demo Worker: Arjun Kumar (COOP-EMP-0001)
    let workerUser = await User.findOne({
      $or: [{ employeeId: "COOP-EMP-0001" }, { email: "worker.arjun@coopnex.local" }]
    });

    if (!workerUser) {
      workerUser = await User.create({
        employeeId: "COOP-EMP-0001",
        name: "Arjun Kumar",
        email: "worker.arjun@coopnex.local",
        phone: "+91 98480 00001",
        passwordHash: workerHash,
        role: USER_ROLES.WORKER,
        district: "Vijayawada",
        city: "Vijayawada",
        address: "Plot 12, Cooperative Colony, Vijayawada",
        status: "ACTIVE",
        isActive: true,
        profileCompleted: true
      });
      console.log("[DemoSeed] Created default demo worker User (COOP-EMP-0001)");
    } else {
      workerUser.employeeId = "COOP-EMP-0001";
      workerUser.name = "Arjun Kumar";
      workerUser.role = USER_ROLES.WORKER;
      workerUser.status = "ACTIVE";
      workerUser.isActive = true;
      const isMatch = await bcrypt.compare("Coopnex@Worker2026!", workerUser.passwordHash);
      if (!isMatch) {
        workerUser.passwordHash = workerHash;
      }
      await workerUser.save();
    }

    let workerProfile = await Worker.findOne({
      $or: [{ employeeId: "COOP-EMP-0001" }, { workerIdNumber: "COOP-EMP-0001" }, { userId: workerUser._id }]
    });

    if (!workerProfile) {
      workerProfile = await Worker.create({
        userId: workerUser._id,
        workerIdNumber: "COOP-EMP-0001",
        employeeId: "COOP-EMP-0001",
        name: "Arjun Kumar",
        phone: "+91 98480 00001",
        email: "worker.arjun@coopnex.local",
        avatarUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=480&q=80",
        district: "Vijayawada",
        serviceRadiusKm: 20,
        skills: ["Electrician", "Solar Pro", "Appliance Repair"],
        experienceYears: 7,
        languages: ["Telugu", "Hindi", "English"],
        verificationLevel: 4,
        verificationStatus: "VERIFIED",
        status: "ACTIVE",
        rating: 4.9,
        reviewCount: 48,
        jobsCompletedCount: 142,
        isAvailable: true,
        emergencyReady: true,
        activeJobsToday: 2,
        baseHourlyRate: 350,
        walletBalance: 5500,
        totalEarnings: 68400,
        location: {
          type: "Point",
          coordinates: [80.648, 16.5062]
        }
      });
      console.log("[DemoSeed] Created default demo Worker profile (COOP-EMP-0001)");
    } else {
      workerProfile.userId = workerUser._id;
      workerProfile.employeeId = "COOP-EMP-0001";
      workerProfile.workerIdNumber = "COOP-EMP-0001";
      workerProfile.verificationStatus = "VERIFIED";
      workerProfile.verificationLevel = 4;
      if (!workerProfile.skills || workerProfile.skills.length === 0) {
        workerProfile.skills = ["Electrician", "Solar Pro", "Appliance Repair"];
      }
      await workerProfile.save();
    }

    // 3. Ensure Super Admin: admin@coopnex.local
    let adminUser = await User.findOne({
      email: "admin@coopnex.local",
      role: USER_ROLES.SUPER_ADMIN
    });

    if (!adminUser) {
      adminUser = await User.create({
        name: "COOPNEX Super Admin",
        email: "admin@coopnex.local",
        phone: "+91 11 23380001",
        passwordHash: adminHash,
        role: USER_ROLES.SUPER_ADMIN,
        district: "New Delhi",
        city: "New Delhi",
        status: "ACTIVE",
        isActive: true,
        profileCompleted: true
      });
      console.log("[DemoSeed] Created default demo Super Admin (admin@coopnex.local)");
    } else {
      const isMatch = await bcrypt.compare("Coopnex@Admin2026!", adminUser.passwordHash);
      if (!isMatch) {
        adminUser.passwordHash = adminHash;
        await adminUser.save();
      }
    }

    let adminProfile = await Admin.findOne({ email: "admin@coopnex.local" });
    if (!adminProfile) {
      await Admin.create({
        adminId: "SUPER-ADM-01",
        email: "admin@coopnex.local",
        name: "COOPNEX Super Admin",
        passwordHash: adminHash,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        mfaEnabled: false
      });
    }

    // 4. Ensure Demo Customer: customer@coopnex.local
    let customerUser = await User.findOne({
      email: "customer@coopnex.local",
      role: USER_ROLES.CUSTOMER
    });

    if (!customerUser) {
      await User.create({
        name: "K. Venkata Rao",
        email: "customer@coopnex.local",
        phone: "+91 94401 99999",
        passwordHash: customerHash,
        role: USER_ROLES.CUSTOMER,
        district: "Vijayawada",
        city: "Vijayawada",
        address: "Flat 402, Sri Sai Residency, Near Benz Circle, Vijayawada",
        status: "ACTIVE",
        isActive: true,
        profileCompleted: true
      });
      console.log("[DemoSeed] Created default demo Customer (customer@coopnex.local)");
    } else {
      const isMatch = await bcrypt.compare("Coopnex@Customer2026!", customerUser.passwordHash);
      if (!isMatch) {
        customerUser.passwordHash = customerHash;
        await customerUser.save();
      }
    }

    console.log("[DemoSeed] Default SIH Demo Accounts verified and active.");
  } catch (err) {
    console.error("[DemoSeed] Error ensuring demo accounts:", err);
  }
}

