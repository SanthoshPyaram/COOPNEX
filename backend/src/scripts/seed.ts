import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Worker } from "../models/Worker";
import { Admin } from "../models/Admin";
import { Federation } from "../models/Federation";
import { Society } from "../models/Society";
import { Booking } from "../models/Booking";
import { WorkforceExchange } from "../models/WorkforceExchange";
import { DemandRecord } from "../models/DemandRecord";
import { USER_ROLES } from "../config/constants";

dotenv.config();

const SEED_PASSWORD = "DemoPassword123!";

export async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/sahakari_seva";
  console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
  await mongoose.connect(mongoUri);

  console.log("[Seed] Clearing old data...");
  await Promise.all([
    User.deleteMany({}),
    Worker.deleteMany({}),
    Admin.deleteMany({}),
    Federation.deleteMany({}),
    Society.deleteMany({}),
    Booking.deleteMany({}),
    WorkforceExchange.deleteMany({}),
    DemandRecord.deleteMany({})
  ]);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, salt);
  const workerDemoHash = await bcrypt.hash("Coopnex@Worker2026!", salt);
  const adminDemoHash = await bcrypt.hash("Coopnex@Admin2026!", salt);
  const customerDemoHash = await bcrypt.hash("Coopnex@Customer2026!", salt);

  console.log("[Seed] Creating Federations...");
  const federation = await Federation.create({
    name: "Andhra Pradesh State Labour Cooperative Federation (AP-SLCF)",
    code: "APSLCF",
    state: "Andhra Pradesh",
    registrationNumber: "AP/COOP/FED/2018/004",
    headquarters: "Amaravati / Vijayawada",
    contactEmail: "contact@apslcf.gov.in",
    contactPhone: "+91 866 2471900",
    totalSocietiesCount: 14,
    totalWorkersCount: 3840,
    welfareFundBalance: 4850000
  });

  console.log("[Seed] Creating Societies...");
  const societyVijayawada = await Society.create({
    federationId: federation._id,
    name: "Vijayawada Central Labour Cooperative Society",
    registrationNumber: "VJA-LAB-COOP-104",
    district: "Vijayawada",
    subDistrict: "Benz Circle Urban",
    address: "Cooperative Bhavan, Bandar Road, Vijayawada - 520010",
    officeLocation: {
      type: "Point",
      coordinates: [80.6480, 16.5062] // [lon, lat]
    },
    serviceRadiusKm: 18,
    contactPerson: "K. Murali Krishna",
    contactPhone: "+91 98480 11223",
    contactEmail: "vijayawada.central@apslcf.gov.in",
    activeWorkersCount: 186,
    totalBookingsCompleted: 1420,
    welfareReserveAmount: 420000
  });

  const societyGuntur = await Society.create({
    federationId: federation._id,
    name: "Guntur East Labour Cooperative Society",
    registrationNumber: "GTR-LAB-COOP-208",
    district: "Guntur",
    subDistrict: "Market Yard Sub-division",
    address: "Labour Guild Hall, Old Club Road, Guntur - 522001",
    officeLocation: {
      type: "Point",
      coordinates: [80.4650, 16.2980]
    },
    serviceRadiusKm: 22,
    contactPerson: "P. Raghava Rao",
    contactPhone: "+91 98480 33445",
    contactEmail: "guntur.east@apslcf.gov.in",
    activeWorkersCount: 142,
    totalBookingsCompleted: 980,
    welfareReserveAmount: 310000
  });

  const societyAutoNagar = await Society.create({
    federationId: federation._id,
    name: "Auto Nagar Industrial & Skilled Labour Cooperative",
    registrationNumber: "VJA-IND-COOP-312",
    district: "Vijayawada",
    subDistrict: "Auto Nagar Industrial Estate",
    address: "Block C, Industrial Estate, Vijayawada - 520007",
    officeLocation: {
      type: "Point",
      coordinates: [80.6820, 16.4950]
    },
    serviceRadiusKm: 15,
    contactPerson: "T. Srinivas",
    contactPhone: "+91 98480 55667",
    contactEmail: "autonagar@apslcf.gov.in",
    activeWorkersCount: 120,
    totalBookingsCompleted: 740,
    welfareReserveAmount: 280000
  });

  console.log("[Seed] Creating Demo Users and Core Accounts...");
  // 1. Customers
  const demoCustomer = await User.create({
    name: "K. Venkata Rao",
    email: "customer@sahakariseva.gov.in",
    phone: "+91 94401 55667",
    passwordHash: customerDemoHash,
    role: USER_ROLES.CUSTOMER,
    district: "Vijayawada",
    city: "Vijayawada",
    address: "Flat 402, Sri Sai Residency, Near Benz Circle, Vijayawada"
  });

  await User.create({
    name: "K. Venkata Rao",
    email: "customer@coopnex.local",
    phone: "+91 94401 99999",
    passwordHash: customerDemoHash,
    role: USER_ROLES.CUSTOMER,
    district: "Vijayawada",
    city: "Vijayawada",
    address: "Benz Circle, Vijayawada"
  });

  // 2. Society Admin
  await User.create({
    name: "K. Murali Krishna (Society Secretary)",
    email: "society.admin@sahakariseva.gov.in",
    phone: "+91 98480 11223",
    passwordHash,
    role: USER_ROLES.SOCIETY_ADMIN,
    district: "Vijayawada",
    city: "Vijayawada",
    societyId: societyVijayawada._id,
    federationId: federation._id
  });

  // 3. Federation Admin
  await User.create({
    name: "Dr. B. R. Ambedkar Prasad (Director)",
    email: "federation.admin@sahakariseva.gov.in",
    phone: "+91 866 2471900",
    passwordHash,
    role: USER_ROLES.FEDERATION_ADMIN,
    district: "Amaravati",
    city: "Vijayawada",
    federationId: federation._id
  });

  // 4. Super Admin Accounts
  await User.create({
    name: "COOPNEX Super Admin",
    email: "admin@coopnex.local",
    phone: "+91 11 23380001",
    passwordHash: adminDemoHash,
    role: USER_ROLES.SUPER_ADMIN,
    district: "New Delhi",
    city: "New Delhi",
    status: "ACTIVE"
  });

  await User.create({
    name: "National Cooperative Registrar Admin",
    email: "super.admin@sahakariseva.gov.in",
    phone: "+91 11 23380000",
    passwordHash: adminDemoHash,
    role: USER_ROLES.SUPER_ADMIN,
    district: "New Delhi",
    city: "New Delhi",
    status: "ACTIVE"
  });

  await Admin.create({
    adminId: "SUPER-ADM-01",
    email: "admin@coopnex.local",
    name: "COOPNEX Super Admin",
    passwordHash: adminDemoHash,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    mfaEnabled: false
  });

  // 5. Dedicated Demo Worker (Arjun Kumar - Employee ID: COOP-EMP-0001)
  const arjunUser = await User.create({
    employeeId: "COOP-EMP-0001",
    name: "Arjun Kumar",
    email: "worker.arjun@coopnex.local",
    phone: "+91 98480 00001",
    passwordHash: workerDemoHash,
    role: USER_ROLES.WORKER,
    district: "Vijayawada",
    city: "Vijayawada",
    societyId: societyVijayawada._id,
    federationId: federation._id,
    address: "Plot 12, Cooperative Colony, Vijayawada",
    status: "ACTIVE"
  });

  await Worker.create({
    userId: arjunUser._id,
    workerIdNumber: "COOP-EMP-0001",
    employeeId: "COOP-EMP-0001",
    name: "Arjun Kumar",
    phone: "+91 98480 00001",
    email: "worker.arjun@coopnex.local",
    avatarUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=480&q=80",
    societyId: societyVijayawada._id,
    societyName: "COOPNEX Vijayawada Electrical Cooperative",
    federationId: federation._id,
    district: "Vijayawada",
    location: {
      type: "Point",
      coordinates: [80.6480, 16.5062]
    },
    serviceRadiusKm: 20,
    skills: ["Electrician"],
    experienceYears: 7,
    languages: ["Telugu", "Hindi", "English"],
    verificationLevel: 4,
    verificationStatus: "VERIFIED",
    status: "ACTIVE",
    rating: 4.9,
    totalJobs: 156
  });

  // 5. Worker (Raj Kumar - The Protagonist of the SIH Winning Demo Journey)
  const rajUser = await User.create({
    employeeId: "SS-AP-2026-104",
    name: "Raj Kumar",
    email: "worker.raj@sahakariseva.gov.in",
    phone: "+91 98480 22341",
    passwordHash,
    role: USER_ROLES.WORKER,
    district: "Vijayawada",
    city: "Vijayawada",
    societyId: societyVijayawada._id,
    federationId: federation._id,
    address: "Door 12-4-19, Labour Colony, Gunadala, Vijayawada"
  });

  console.log("[Seed] Creating Raj Kumar's verified worker profile (Level 4 Certified)...");
  const rajWorker = await Worker.create({
    userId: rajUser._id,
    workerIdNumber: "SS-AP-2026-104",
    employeeId: "SS-AP-2026-104",
    name: "Raj Kumar",
    phone: "+91 98480 22341",
    email: "worker.raj@sahakariseva.gov.in",
    avatarUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    societyId: societyVijayawada._id,
    societyName: societyVijayawada.name,
    federationId: federation._id,
    district: "Vijayawada",
    location: {
      type: "Point",
      coordinates: [80.6540, 16.5120] // 1.4 km from Benz Circle
    },
    serviceRadiusKm: 15,
    skills: ["Electrician", "Technician"],
    experienceYears: 6,
    languages: ["Telugu", "Hindi", "English"],
    verificationLevel: 4, // Level 4 State Certified
    verificationStatus: "VERIFIED",
    verificationTimeline: [
      {
        level: 1,
        title: "Aadhaar e-KYC Identity Verified",
        verified: true,
        verifiedAt: new Date("2023-04-10"),
        notes: "Biometric UIDAI verification cleared."
      },
      {
        level: 2,
        title: "Cooperative Society Membership Verified",
        verified: true,
        verifiedAt: new Date("2023-04-15"),
        notes: "Registered member #AP-104-88 with share capital contribution."
      },
      {
        level: 3,
        title: "Trade Competency Assessment Passed",
        verified: true,
        verifiedAt: new Date("2023-05-02"),
        notes: "Practical test in residential wiring, MCBs, earthing and inverter setups (Score: 94%)."
      },
      {
        level: 4,
        title: "NSDC / State Skill Council Certified",
        verified: true,
        verifiedAt: new Date("2023-08-20"),
        notes: "Certificate #AP-SSDC-ELEC-2023-9082 issued by AP State Skill Development Corp."
      },
      {
        level: 5,
        title: "Master Craftsman / Safety Supervisor",
        verified: false,
        notes: "Requires 7 years on-field tenure (currently at 6.2 years)."
      }
    ],
    certificates: [
      {
        title: "NSDC Certified Electrician - Domestic Solutions",
        issuer: "National Skill Development Corporation (NSDC)",
        issueDate: "2023-08-20",
        expiryDate: "2028-08-19",
        credentialId: "NSDC-AP-EL-9082"
      },
      {
        title: "High Voltage Domestic & Industrial Safety Certificate",
        issuer: "AP State Electricity Safety Directorate",
        issueDate: "2024-02-14",
        expiryDate: "2027-02-13",
        credentialId: "AP-ESD-SAFE-4421"
      }
    ],
    rating: 4.9,
    reviewCount: 48,
    jobsCompletedCount: 142,
    isAvailable: true,
    emergencyReady: true,
    activeJobsToday: 0,
    baseHourlyRate: 450,
    walletBalance: 4850,
    totalEarnings: 68400,
    gender: "Male",
    kycDocuments: [
      {
        documentType: "AADHAAR",
        documentNumber: "XXXX-XXXX-9021",
        fileUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&q=80",
        verificationStatus: "VERIFIED",
        fraudRiskScore: 2,
        fraudFlags: [],
        aiVerificationNotes: "UIDAI Verhoeff Checksum valid. Name matches municipal electoral roll.",
        submittedAt: new Date("2023-04-10"),
        verifiedAt: new Date("2023-04-10")
      },
      {
        documentType: "PAN",
        documentNumber: "ABCDE1234F",
        fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
        verificationStatus: "VERIFIED",
        fraudRiskScore: 1,
        fraudFlags: [],
        aiVerificationNotes: "NSDL tax verification cleared. TDS compliant.",
        submittedAt: new Date("2023-04-10"),
        verifiedAt: new Date("2023-04-10")
      },
      {
        documentType: "POLICE_CLEARANCE",
        documentNumber: "PCC-VJA-2023-0881",
        fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
        verificationStatus: "VERIFIED",
        fraudRiskScore: 0,
        fraudFlags: [],
        aiVerificationNotes: "Gunadala Police Station clearance certificate active. Zero criminal records.",
        submittedAt: new Date("2023-04-12"),
        verifiedAt: new Date("2023-04-12")
      },
      {
        documentType: "TRADE_CERTIFICATE",
        documentNumber: "NSDC-AP-EL-9082",
        fileUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80",
        verificationStatus: "VERIFIED",
        fraudRiskScore: 3,
        fraudFlags: [],
        aiVerificationNotes: "State Skill Council domestic electrician certification verified.",
        submittedAt: new Date("2023-04-14"),
        verifiedAt: new Date("2023-04-14")
      },
      {
        documentType: "BANK_PROOF",
        documentNumber: "APGB-0021-99821",
        fileUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
        verificationStatus: "VERIFIED",
        fraudRiskScore: 1,
        fraudFlags: [],
        aiVerificationNotes: "Andhra Pragathi Grameena Bank passbook verified for direct DBT wage escrow.",
        submittedAt: new Date("2023-04-15"),
        verifiedAt: new Date("2023-04-15")
      }
    ],
    insuranceInfo: {
      policyNumber: "AIC-COOP-882193-AP",
      provider: "Cooperative General Insurance Federation of India",
      planType: "Pradhan Mantri Suraksha Bima Yojana (PMSBY) + Co-op Group Accidental",
      coverageAmount: 500000,
      isActive: true,
      validUntil: "2027-03-24"
    },
    welfareBenefits: [
      {
        title: "PM-JAY Health Protection",
        status: "ACTIVE",
        renewalDate: "2027-03-31"
      },
      {
        title: "Subsidized Toolkit Replacement Grant",
        status: "ACTIVE",
        renewalDate: "2026-12-31"
      },
      {
        title: "Children Polytechnic Education Scholarship",
        status: "ACTIVE",
        renewalDate: "2026-05-31"
      }
    ]
  });

  console.log("[Seed] Creating 20 realistic male and female workers across all 10 trades + Anti-fraud demo...");
  const fullWorkersList = [
    // 1. Electrician (Female)
    {
      name: "Sunita Devi",
      gender: "Female",
      trade: "Electrician",
      skills: ["Electrician", "Technician"],
      exp: 5,
      rating: 4.8,
      vLevel: 4,
      lat: 16.5090,
      lon: 80.6480,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      rate: 450
    },
    // 2. Plumber (Male)
    {
      name: "Suresh Babu",
      gender: "Male",
      trade: "Plumber",
      skills: ["Plumber"],
      exp: 7,
      rating: 4.8,
      vLevel: 4,
      lat: 16.5020,
      lon: 80.6420,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      rate: 400
    },
    // 3. Plumber (Female)
    {
      name: "Kavitha Reddy",
      gender: "Female",
      trade: "Plumber",
      skills: ["Plumber"],
      exp: 6,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5140,
      lon: 80.6380,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      rate: 420
    },
    // 4. Carpenter (Male)
    {
      name: "Ch. Lakshmi Narayana",
      gender: "Male",
      trade: "Carpenter",
      skills: ["Carpenter"],
      exp: 8,
      rating: 4.9,
      vLevel: 5,
      lat: 16.5180,
      lon: 80.6390,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      rate: 480
    },
    // 5. Carpenter (Female)
    {
      name: "Meena Kumari",
      gender: "Female",
      trade: "Carpenter",
      skills: ["Carpenter"],
      exp: 4,
      rating: 4.8,
      vLevel: 4,
      lat: 16.5060,
      lon: 80.6510,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
      rate: 460
    },
    // 6. Painter (Male)
    {
      name: "V. Govind",
      gender: "Male",
      trade: "Painter",
      skills: ["Painter"],
      exp: 5,
      rating: 4.7,
      vLevel: 3,
      lat: 16.4950,
      lon: 80.6650,
      soc: societyAutoNagar,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
      rate: 500
    },
    // 7. Painter (Female)
    {
      name: "Anjali Sharma",
      gender: "Female",
      trade: "Painter",
      skills: ["Painter"],
      exp: 6,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5010,
      lon: 80.6580,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=400&q=80",
      rate: 520
    },
    // 8. Cleaner (Male)
    {
      name: "Mohan Lal",
      gender: "Male",
      trade: "Cleaner",
      skills: ["Cleaner"],
      exp: 5,
      rating: 4.8,
      vLevel: 4,
      lat: 16.5120,
      lon: 80.6490,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      rate: 420
    },
    // 9. Cleaner (Female)
    {
      name: "K. Padma",
      gender: "Female",
      trade: "Cleaner",
      skills: ["Cleaner", "Domestic Helper"],
      exp: 6,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5110,
      lon: 80.6410,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      rate: 450
    },
    // 10. Caregiver (Male)
    {
      name: "Rajesh Nair",
      gender: "Male",
      trade: "Caregiver",
      skills: ["Caregiver"],
      exp: 7,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5190,
      lon: 80.6450,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
      rate: 650
    },
    // 11. Caregiver (Female)
    {
      name: "M. Anasuya",
      gender: "Female",
      trade: "Caregiver",
      skills: ["Caregiver"],
      exp: 8,
      rating: 5.0,
      vLevel: 5,
      lat: 16.5080,
      lon: 80.6550,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
      rate: 700
    },
    // 12. Driver (Male)
    {
      name: "D. Ravi Shankar",
      gender: "Male",
      trade: "Driver",
      skills: ["Driver"],
      exp: 9,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5150,
      lon: 80.6620,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
      rate: 550
    },
    // 13. Driver (Female)
    {
      name: "Deepa Rao",
      gender: "Female",
      trade: "Driver",
      skills: ["Driver"],
      exp: 5,
      rating: 4.8,
      vLevel: 4,
      lat: 16.5040,
      lon: 80.6470,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
      rate: 550
    },
    // 14. Gardener (Male)
    {
      name: "S. Nageswara Rao",
      gender: "Male",
      trade: "Gardener",
      skills: ["Gardener"],
      exp: 6,
      rating: 4.7,
      vLevel: 3,
      lat: 16.5220,
      lon: 80.6350,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      rate: 380
    },
    // 15. Gardener (Female)
    {
      name: "Kamala Devi",
      gender: "Female",
      trade: "Gardener",
      skills: ["Gardener"],
      exp: 5,
      rating: 4.8,
      vLevel: 4,
      lat: 16.5170,
      lon: 80.6440,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      rate: 390
    },
    // 16. Technician (Male)
    {
      name: "B. Venkatesh",
      gender: "Male",
      trade: "Technician",
      skills: ["Technician", "Electrician"],
      exp: 6,
      rating: 4.9,
      vLevel: 4,
      lat: 16.4910,
      lon: 80.6780,
      soc: societyAutoNagar,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80",
      rate: 520
    },
    // 17. Technician (Female)
    {
      name: "Priya Menon",
      gender: "Female",
      trade: "Technician",
      skills: ["Technician"],
      exp: 5,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5050,
      lon: 80.6530,
      soc: societyVijayawada,
      emergency: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      rate: 530
    },
    // 18. Domestic Helper (Male)
    {
      name: "Gopal Das",
      gender: "Male",
      trade: "Domestic Helper",
      skills: ["Domestic Helper", "Cleaner"],
      exp: 4,
      rating: 4.7,
      vLevel: 3,
      lat: 16.5130,
      lon: 80.6410,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80",
      rate: 350
    },
    // 19. Domestic Helper (Female)
    {
      name: "Shanti Bai",
      gender: "Female",
      trade: "Domestic Helper",
      skills: ["Domestic Helper"],
      exp: 7,
      rating: 4.9,
      vLevel: 4,
      lat: 16.5100,
      lon: 80.6460,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
      rate: 380
    },
    // 20. SUSPECTED FRAUD DEMO WORKER (For Admin KYC Testing & Judge Showcase)
    {
      name: "Vikram Singh (Suspected Fraud Demo)",
      gender: "Male",
      trade: "Electrician",
      skills: ["Electrician"],
      exp: 2,
      rating: 3.5,
      vLevel: 1,
      lat: 16.5200,
      lon: 80.6300,
      soc: societyVijayawada,
      emergency: false,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      rate: 300,
      isSuspicious: true
    }
  ];

  for (let i = 0; i < fullWorkersList.length; i++) {
    const w = fullWorkersList[i];
    const workerEmpId = `SS-AP-2026-${200 + i}`;
    const u = await User.create({
      employeeId: workerEmpId,
      name: w.name,
      gender: w.gender,
      email: `worker.${w.name.toLowerCase().replace(/[^a-z]/g, "")}@sahakariseva.gov.in`,
      phone: `+91 9849${i % 10} ${10000 + i * 231}`,
      passwordHash,
      role: USER_ROLES.WORKER,
      phoneVerified: true,
      emailVerified: true,
      district: w.soc.district,
      city: w.soc.district,
      societyId: w.soc._id,
      federationId: federation._id
    });

    const isFraud = (w as any).isSuspicious;
    const workerKycDocs = isFraud
      ? [
          {
            documentType: "AADHAAR",
            documentNumber: "9988-7766-5544",
            fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
            verificationStatus: "SUSPECTED_FAKE",
            fraudRiskScore: 88,
            fraudFlags: [
              "CRITICAL: UIDAI Verhoeff Checksum Check Failed",
              "Mismatched Font Kerning: Substring 'Vikram Singh' does not match UIDAI standard template",
              "Low resolution artifact indicating Photoshop layer tampering"
            ],
            aiVerificationNotes: "Automated pre-check flagged forgery. Tamper confidence: 88%. Offence under IPC Section 468/471.",
            submittedAt: new Date()
          },
          {
            documentType: "PAN",
            documentNumber: "BLRPZ9921K",
            fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
            verificationStatus: "SUSPECTED_FAKE",
            fraudRiskScore: 76,
            fraudFlags: [
              "DUPLICATE_PAN: Card BLRPZ9921K is already registered under User #AP-2023-8812"
            ],
            aiVerificationNotes: "Duplicate tax identification detected in cooperative federation ledger.",
            submittedAt: new Date()
          },
          {
            documentType: "TRADE_CERTIFICATE",
            documentNumber: "FAKE-ITI-2023-112",
            fileUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80",
            verificationStatus: "SUSPECTED_FAKE",
            fraudRiskScore: 92,
            fraudFlags: [
              "Unregistered ITI Institute Code",
              "Date of issue precedes applicant legal working age"
            ],
            aiVerificationNotes: "Fake trade credential. Institute not found in NCVT/SCVT national registry.",
            submittedAt: new Date()
          }
        ]
      : [
          {
            documentType: "AADHAAR",
            documentNumber: `XXXX-XXXX-${8000 + i}`,
            fileUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&q=80",
            verificationStatus: "VERIFIED",
            fraudRiskScore: 2,
            fraudFlags: [],
            aiVerificationNotes: "UIDAI biometric match confirmed. Clean Verhoeff checksum.",
            submittedAt: new Date("2023-06-15"),
            verifiedAt: new Date("2023-06-15")
          },
          {
            documentType: "PAN",
            documentNumber: `ABCDE${1000 + i}K`,
            fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
            verificationStatus: "VERIFIED",
            fraudRiskScore: 1,
            fraudFlags: [],
            aiVerificationNotes: "NSDL records match applicant name.",
            submittedAt: new Date("2023-06-15"),
            verifiedAt: new Date("2023-06-15")
          },
          {
            documentType: "POLICE_CLEARANCE",
            documentNumber: `PCC-AP-${9000 + i}`,
            fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
            verificationStatus: "VERIFIED",
            fraudRiskScore: 0,
            fraudFlags: [],
            aiVerificationNotes: "District police clearance verified. Clean background.",
            submittedAt: new Date("2023-06-16"),
            verifiedAt: new Date("2023-06-16")
          },
          {
            documentType: "TRADE_CERTIFICATE",
            documentNumber: `SSDC-${w.trade.toUpperCase().slice(0, 4)}-${2023 + i}`,
            fileUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80",
            verificationStatus: "VERIFIED",
            fraudRiskScore: 3,
            fraudFlags: [],
            aiVerificationNotes: `AP State Skill Development Council ${w.trade} certification active.`,
            submittedAt: new Date("2023-06-17"),
            verifiedAt: new Date("2023-06-17")
          }
        ];

    await Worker.create({
      userId: u._id,
      workerIdNumber: workerEmpId,
      employeeId: workerEmpId,
      name: w.name,
      gender: w.gender,
      phone: u.phone,
      email: u.email,
      avatarUrl: w.avatar,
      societyId: w.soc._id,
      societyName: w.soc.name,
      federationId: federation._id,
      district: w.soc.district,
      location: {
        type: "Point",
        coordinates: [w.lon, w.lat]
      },
      serviceRadiusKm: 15,
      skills: w.skills,
      experienceYears: w.exp,
      languages: ["Telugu", "Hindi", "English"],
      verificationLevel: isFraud ? 1 : w.vLevel,
      verificationStatus: isFraud ? "UNDER_REVIEW" : "VERIFIED",
      kycDocuments: workerKycDocs,
      verificationTimeline: [
        { level: 1, title: "Identity Verified", verified: true, verifiedAt: new Date() },
        { level: 2, title: "Cooperative Verified", verified: !isFraud, verifiedAt: new Date() },
        { level: 3, title: "Trade Assessment", verified: !isFraud, verifiedAt: new Date() },
        { level: 4, title: "State Skill Certified", verified: !isFraud && w.vLevel >= 4, verifiedAt: new Date() }
      ],
      rating: w.rating,
      reviewCount: 30 + i * 4,
      jobsCompletedCount: 80 + i * 12,
      isAvailable: !isFraud,
      emergencyReady: w.emergency,
      activeJobsToday: 0,
      baseHourlyRate: w.rate,
      walletBalance: 3200 + i * 250,
      totalEarnings: 42000 + i * 3100,
      insuranceInfo: {
        policyNumber: `AIC-COOP-${900000 + i}`,
        provider: "Cooperative General Insurance Federation of India",
        planType: "PM-Suraksha + Co-op Group Accidental",
        coverageAmount: 500000,
        isActive: true,
        validUntil: "2027-03-24"
      }
    });
  }

  console.log("[Seed] Creating Cooperative Workforce Exchange proposals...");
  await WorkforceExchange.create([
    {
      exchangeCode: "EXC-2026-AP-01",
      federationId: federation._id,
      trade: "Plumber",
      sourceSocietyId: societyGuntur._id,
      sourceSocietyName: societyGuntur.name,
      targetSocietyId: societyVijayawada._id,
      targetSocietyName: societyVijayawada.name,
      recommendedWorkersCount: 6,
      distanceKm: 34.0,
      dailyTravelAllowanceINR: 180,
      estimatedSurplusCount: 8,
      estimatedShortageCount: 10,
      unmetDemandPreventionPct: 82.5,
      aiRationale: "High municipal water connection maintenance surge detected in Vijayawada Central. Guntur East possesses 8 idle certified plumbers within 35 km transit corridor.",
      status: "PENDING_APPROVAL",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]
    },
    {
      exchangeCode: "EXC-2026-AP-02",
      federationId: federation._id,
      trade: "Electrician",
      sourceSocietyId: societyGuntur._id,
      sourceSocietyName: societyGuntur.name,
      targetSocietyId: societyAutoNagar._id,
      targetSocietyName: societyAutoNagar.name,
      recommendedWorkersCount: 5,
      distanceKm: 28.5,
      dailyTravelAllowanceINR: 140,
      estimatedSurplusCount: 7,
      estimatedShortageCount: 8,
      unmetDemandPreventionPct: 78.0,
      aiRationale: "Industrial power maintenance scheduled in Auto Nagar. Guntur cooperative has certified 3-phase electricians with low local domestic load.",
      status: "PENDING_APPROVAL",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
    }
  ]);

  console.log("[Seed] Creating past completed bookings for demonstration...");
  await Booking.create({
    bookingNumber: "BK-2026-881294",
    customerId: demoCustomer._id,
    customerName: demoCustomer.name,
    customerPhone: demoCustomer.phone,
    workerId: rajWorker._id,
    workerName: rajWorker.name,
    workerPhone: rajWorker.phone,
    societyId: societyVijayawada._id,
    serviceCategory: "Electrician",
    requirementDescription: "Full home rewiring inspection and MCB board replacement.",
    serviceLocation: {
      address: "Flat 402, Sri Sai Residency, Near Benz Circle, Vijayawada",
      coordinates: [80.6480, 16.5062]
    },
    bookingType: "STANDARD",
    status: "COMPLETED",
    statusTimeline: [
      { status: "REQUESTED", timestamp: new Date(Date.now() - 86400000), note: "Booking scheduled." },
      { status: "ASSIGNED", timestamp: new Date(Date.now() - 86000000), note: "Raj Kumar assigned." },
      { status: "ACCEPTED", timestamp: new Date(Date.now() - 85500000), note: "Worker confirmed." },
      { status: "COMPLETED", timestamp: new Date(Date.now() - 72000000), note: "Job completed to perfection." }
    ],
    scheduledAt: new Date(Date.now() - 86400000),
    aiMatchScore: 97,
    aiMatchReasons: [
      "✓ Level 4 State Certified Electrician",
      "✓ 1.4 km away - ETA 7 min",
      "✓ 4.9★ Customer Satisfaction"
    ],
    fairWageBreakdown: {
      customerPaid: 764,
      baseWorkerWage: 450,
      skillPremium: 70,
      experiencePremium: 40,
      travelAllowance: 30,
      emergencyAllowance: 60,
      workerEarning: 650,
      cooperativeContribution: 78,
      taxGst: 36
    },
    paymentStatus: "PAID",
    rating: 5,
    reviewComment: "Raj Kumar was extremely punctual, polite, and resolved the hazardous sparking safely. Wonderful cooperative service!",
    completedAt: new Date(Date.now() - 72000000)
  });

  console.log("===================================================================");
  console.log(" 🎉 COOPNEX DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("===================================================================");
  console.log(" DEMO CREDENTIALS:");
  console.log(" 1. CUSTOMER:    customer@sahakariseva.gov.in (or customer@coopnex.local)");
  console.log("                 Password: Coopnex@Customer2026! (or DemoPassword123!)");
  console.log(" 2. WORKER:      Employee ID: COOP-EMP-0001 (Arjun Kumar)");
  console.log("                 Password: Coopnex@Worker2026!");
  console.log(" 3. WORKER(Raj): Employee ID: SS-AP-2026-104 (Raj Kumar)");
  console.log("                 Password: DemoPassword123!");
  console.log(" 4. SUPER ADMIN: admin@coopnex.local (or super.admin@sahakariseva.gov.in)");
  console.log("                 Password: Coopnex@Admin2026!");
  console.log("===================================================================");

  await mongoose.disconnect();
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("[Seed Error]:", err);
    process.exit(1);
  });
}

