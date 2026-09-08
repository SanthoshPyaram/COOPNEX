import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Worker } from "../models/Worker";
import { Society } from "../models/Society";
import { Federation } from "../models/Federation";
import { USER_ROLES } from "../config/constants";

dotenv.config();

export async function setupWorkerDemo() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/sahakari_seva";
  console.log(`[Worker Demo Setup] Connecting to MongoDB: ${mongoUri}...`);
  await mongoose.connect(mongoUri);

  const DEMO_EMAIL = "worker.demo@coopnex.in";
  const DEMO_PASS = "Worker@123";

  let user = await User.findOne({ email: DEMO_EMAIL });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEMO_PASS, salt);

  const society = await Society.findOne({ name: /Vijayawada/i }) || await Society.findOne();
  const federation = await Federation.findOne() || (society?.federationId ? await Federation.findById(society.federationId) : null);

  if (!user) {
    console.log(`[Worker Demo Setup] Creating new worker account: ${DEMO_EMAIL}...`);
    user = await User.create({
      name: "Raju Sharma",
      firstName: "Raju",
      lastName: "Sharma",
      email: DEMO_EMAIL,
      phone: "+919849019999",
      passwordHash,
      role: USER_ROLES.WORKER,
      gender: "Male",
      age: 32,
      state: "Andhra Pradesh",
      district: "Vijayawada",
      city: "Vijayawada",
      pincode: "520010",
      address: "Door 4-12, Near Benz Circle, Vijayawada",
      societyId: society?._id,
      federationId: federation?._id,
      emailVerified: true,
      phoneVerified: true,
      status: "ACTIVE",
      isActive: true,
      profileCompleted: true
    });
    console.log(`[Worker Demo Setup] User created with ID: ${user._id}`);
  } else {
    console.log(`[Worker Demo Setup] Existing user found with ID: ${user._id}. Updating password & role...`);
    user.passwordHash = passwordHash;
    user.role = USER_ROLES.WORKER;
    user.emailVerified = true;
    user.phoneVerified = true;
    user.status = "ACTIVE";
    user.isActive = true;
    await user.save();
  }

  // Check or create linked Worker document
  let worker = await Worker.findOne({ userId: user._id });
  if (!worker) {
    console.log(`[Worker Demo Setup] Creating linked Worker profile...`);
    worker = await Worker.create({
      userId: user._id,
      workerIdNumber: "AP-VJA-W-0199",
      name: user.name,
      gender: "Male",
      phone: user.phone || "+919849019999",
      email: user.email,
      avatarUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
      societyId: society?._id,
      societyName: society?.name || "Vijayawada Central Labour Cooperative Society",
      federationId: federation?._id,
      district: "Vijayawada",
      location: {
        type: "Point",
        coordinates: [80.6480, 16.5062] // Benz Circle coords
      },
      serviceRadiusKm: 15,
      skills: ["Electrician", "Technician"],
      experienceYears: 8,
      languages: ["Telugu", "English", "Hindi"],
      verificationLevel: 5,
      verificationStatus: "VERIFIED",
      verificationTimeline: [
        { level: 1, title: "Mobile & Aadhaar OTP KYC", verified: true, verifiedAt: new Date() },
        { level: 2, title: "Physical Society Inspection", verified: true, verifiedAt: new Date() },
        { level: 3, title: "Police Criminal Record Clear", verified: true, verifiedAt: new Date() },
        { level: 4, title: "NSDC Skill Trade Certification", verified: true, verifiedAt: new Date() },
        { level: 5, title: "Cooperative Peer Review & PMSBY", verified: true, verifiedAt: new Date() }
      ],
      rating: 4.9,
      reviewCount: 112,
      jobsCompletedCount: 320,
      isAvailable: true,
      emergencyReady: true,
      activeJobsToday: 1,
      baseHourlyRate: 380,
      walletBalance: 4850,
      totalEarnings: 84200,
      insuranceInfo: {
        policyNumber: "PMSBY-AP-2026-9912",
        provider: "National Insurance Co / PMSBY",
        planType: "Accidental & Disability Security",
        coverageAmount: 500000,
        isActive: true,
        validUntil: "2027-03-31"
      }
    });
    console.log(`[Worker Demo Setup] Linked Worker profile created with ID: ${worker._id}`);
  } else {
    console.log(`[Worker Demo Setup] Existing linked Worker profile found with ID: ${worker._id}`);
    worker.isAvailable = true;
    worker.emergencyReady = true;
    await worker.save();
  }

  console.log("=== WORKER DEMO SETUP COMPLETE ===");
  console.log(`Email: ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASS}`);
  console.log(`Role: ${user.role}`);
  console.log(`Worker ID Number: ${worker.workerIdNumber}`);
  console.log(`Worker Trade: ${worker.skills.join(", ")}`);

  await mongoose.disconnect();
}

if (require.main === module) {
  setupWorkerDemo().catch((err) => {
    console.error("Worker demo setup error:", err);
    process.exit(1);
  });
}
