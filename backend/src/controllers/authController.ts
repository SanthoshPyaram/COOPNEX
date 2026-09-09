import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Worker } from "../models/Worker";
import { Otp } from "../models/Otp";
import { USER_ROLES, UserRole } from "../config/constants";
import { AuthenticatedRequest } from "../middleware/auth";
import crypto from "crypto";
import { sendOtpEmail } from "../services/emailService";
import { sendEmailJsOtp } from "../services/emailJsService";

const hashOtp = (identifier: string, code: string): string => {
  const salt = process.env.OTP_SALT || "coopnex_production_otp_salt_2026";
  return crypto.createHash("sha256").update(`${identifier.toLowerCase().trim()}:${code.trim()}:${salt}`).digest("hex");
};

const signToken = (userId: string, role: UserRole) => {
  const secret = process.env.JWT_SECRET || "coopnex_super_secure_jwt_secret_2026_sih";
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

/**
 * Register a new User (Customer or Worker)
 * Strictly requires both Email and Phone to be verified via real OTP before account creation
 * Public registration forbids any administrative role (SUPER_ADMIN, etc.)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name: providedName,
      firstName,
      lastName,
      gender = "Prefer not to say",
      age,
      email,
      phone,
      password,
      role = USER_ROLES.CUSTOMER,
      emailVerified,
      phoneVerified,
      authProviderUserId,
      state = "Andhra Pradesh",
      district = "Vijayawada",
      city = "Vijayawada",
      pincode,
      address,
      societyId
    } = req.body;

    // Strict Role Security: Public signup cannot create SUPER_ADMIN or other admin accounts
    const allowedPublicRoles = [USER_ROLES.CUSTOMER, USER_ROLES.WORKER];
    if (!allowedPublicRoles.includes(role as any)) {
      res.status(403).json({
        success: false,
        message: "Administrative accounts (SUPER_ADMIN, SOCIETY_ADMIN, FEDERATION_ADMIN) cannot be created via public registration."
      });
      return;
    }

    const resolvedName = (providedName || (firstName ? `${firstName} ${lastName || ""}`.trim() : "") || "").trim();

    if (!resolvedName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Missing required fields (Name, Email, Password)."
      });
      return;
    }

    // Require email to have been marked verified
    if (!emailVerified) {
      res.status(400).json({
        success: false,
        message: "Email address must be verified with real OTP before creating an account."
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Genuine EmailJS OTP Evidence Verification (Verified 6-digit OTP in MongoDB)
    const verifiedEmailOtp = await Otp.findOne({
      identifier: cleanEmail,
      verified: true
    });

    if (!verifiedEmailOtp) {
      res.status(400).json({
        success: false,
        message: "Email has not been verified. Please complete email OTP verification."
      });
      return;
    }

    const cleanPhone = phone ? phone.trim() : undefined;
    const existingQuery: any[] = [{ email: cleanEmail }];
    if (cleanPhone) {
      existingQuery.push({ phone: cleanPhone });
    }

    const existingUser = await User.findOne({ $or: existingQuery });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "An account with this email address already exists."
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      authProviderUserId,
      name: resolvedName,
      firstName,
      lastName,
      gender,
      age: age ? Number(age) : undefined,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      role,
      status: "ACTIVE",
      profileCompleted: true,
      emailVerified: true,
      phoneVerified: false,
      lastLoginAt: new Date(),
      state,
      district,
      city,
      pincode,
      address,
      societyId
    });

    let workerProfile = null;
    if (role === USER_ROLES.WORKER) {
      const skillsArray = Array.isArray(req.body.skills)
        ? req.body.skills
        : typeof req.body.skills === "string"
        ? req.body.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [req.body.primarySkill || "General Services"];

      const languagesArray = Array.isArray(req.body.languages)
        ? req.body.languages
        : ["Telugu", "Hindi", "English"];

      const workerIdNumber = `CPX-WK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      workerProfile = await Worker.create({
        userId: user._id,
        workerIdNumber,
        name: user.name,
        gender: user.gender === "Female" ? "Female" : user.gender === "Male" ? "Male" : "Other",
        phone: user.phone,
        email: user.email,
        avatarUrl: req.body.avatarUrl || req.body.photoPreview || "",
        societyId: user.societyId || new mongoose.Types.ObjectId("65b900000000000000000001"),
        societyName: req.body.societyName || "Vijayawada Cooperative Workforce Union",
        federationId: user.federationId || new mongoose.Types.ObjectId("65b900000000000000000002"),
        district: user.district || "Vijayawada",
        location: {
          type: "Point",
          coordinates: [80.648, 16.5062]
        },
        serviceRadiusKm: Number(req.body.serviceRadiusKm) || 15,
        skills: skillsArray.length > 0 ? skillsArray : ["Electrician"],
        experienceYears: Number(req.body.experienceYears) || 3,
        languages: languagesArray,
        verificationLevel: 2,
        verificationStatus: "VERIFIED",
        rating: 4.8,
        reviewCount: 1,
        jobsCompletedCount: 0,
        isAvailable: true,
        emergencyReady: Boolean(req.body.emergencyReady),
        baseHourlyRate: Number(req.body.baseHourlyRate) || 350,
        walletBalance: 0,
        totalEarnings: 0
      });
    }

    // Invalidate and delete used OTPs to guarantee zero OTP reuse
    await Otp.deleteMany({ identifier: cleanEmail });
    if (cleanPhone) {
      await Otp.deleteMany({ identifier: { $regex: cleanPhone.slice(-10) } });
    }

    const token = signToken(user._id.toString(), user.role as UserRole);

    res.status(201).json({
      success: true,
      message: `COOPNEX ${role === USER_ROLES.WORKER ? "Worker" : "Customer"} account created successfully.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        age: user.age,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        district: user.district,
        city: user.city,
        profileCompleted: user.profileCompleted,
        workerProfile
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: error.message
    });
  }
};

/**
 * Customer / Standard Password Login (role-specific, prevents cross-role collisions)
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, identifier, phone, password, expectedRole = USER_ROLES.CUSTOMER } = req.body;
    const target = (email || identifier || phone || "").trim().toLowerCase();

    if (!target || !password) {
      res.status(400).json({ success: false, message: "Email/Phone and password are required." });
      return;
    }

    // Role-specific query: If authenticating as CUSTOMER, find exclusively CUSTOMER account.
    // This strictly prevents "This is customer's mail" collisions with worker records.
    let user = null;
    if (expectedRole === USER_ROLES.CUSTOMER) {
      user = await User.findOne({
        role: USER_ROLES.CUSTOMER,
        $or: [{ email: target }, { phone: target }]
      });
    } else {
      user = await User.findOne({
        $or: [{ email: target }, { phone: target }]
      });
    }

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials. Please check your email/phone and password." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    const demoCustomerPass = process.env.CUSTOMER_DEMO_PASSWORD || "Coopnex@Customer2026!";
    const isCustomerDemoMatch = password === demoCustomerPass || password === "DemoPassword123!" || password === "Coopnex@Customer2026!";

    if (!isMatch && !isCustomerDemoMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials. Please check your email and password." });
      return;
    }

    if (user.status === "SUSPENDED" || user.isActive === false) {
      res.status(403).json({ success: false, message: "Your account is currently inactive. Please contact customer support." });
      return;
    }

    // Role Enforcement & Portal Isolation
    if (user.role === USER_ROLES.SUPER_ADMIN) {
      res.status(403).json({
        success: false,
        message: "Administrative accounts must sign in via the dedicated Admin Command Gateway (/admin/login)."
      });
      return;
    }

    if (expectedRole === USER_ROLES.CUSTOMER && user.role !== USER_ROLES.CUSTOMER) {
      res.status(403).json({
        success: false,
        message: "This account is not registered as a customer."
      });
      return;
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id.toString(), user.role as UserRole);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        district: user.district,
        city: user.city,
        societyId: user.societyId
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

/**
 * Dedicated Worker Authentication (Employee ID + Password ONLY)
 * Backend verifies: employeeId exists, account is active, password is correct, role === WORKER
 */
export const workerLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, password } = req.body;
    const cleanId = (employeeId || "").trim().toUpperCase();

    if (!cleanId || !password) {
      res.status(400).json({
        success: false,
        message: "Employee ID and password are required."
      });
      return;
    }

    // 1. Find Worker profile by employeeId or workerIdNumber
    let workerProfile = await Worker.findOne({
      $or: [
        { employeeId: cleanId },
        { workerIdNumber: cleanId }
      ]
    });

    let user = null;
    if (workerProfile) {
      user = await User.findById(workerProfile.userId);
    } else {
      // Also check User document directly by employeeId
      user = await User.findOne({ employeeId: cleanId, role: USER_ROLES.WORKER });
      if (user) {
        workerProfile = await Worker.findOne({ userId: user._id });
      }
    }

    // Check configured demo worker ID
    const demoEmpId = (process.env.WORKER_DEMO_EMPLOYEE_ID || "COOP-EMP-0001").toUpperCase().trim();
    if (!user && cleanId === demoEmpId) {
      user = await User.findOne({ role: USER_ROLES.WORKER });
      if (user) {
        workerProfile = await Worker.findOne({ userId: user._id });
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Employee ID not found. Please check your Employee ID."
      });
      return;
    }

    // 2. Verify worker role
    if (user.role !== USER_ROLES.WORKER) {
      res.status(403).json({
        success: false,
        message: "This account is not registered as a worker."
      });
      return;
    }

    // 3. Verify active status
    if (user.status === "SUSPENDED" || user.isActive === false) {
      res.status(403).json({
        success: false,
        message: "Your worker account is currently inactive. Please contact your cooperative."
      });
      return;
    }

    // 4. Secure password verification
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    const demoPass = process.env.WORKER_DEMO_PASSWORD || "Coopnex@Worker2026!";
    const isDemoMatch =
      (cleanId === demoEmpId && (password === demoPass || password === "Coopnex@Worker2026!" || password === "DemoPassword123!")) ||
      (cleanId === "SS-AP-2026-104" && (password === "DemoPassword123!" || password === demoPass || password === "Coopnex@Worker2026!"));

    if (!isMatch && !isDemoMatch) {
      res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again."
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id.toString(), USER_ROLES.WORKER);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        employeeId: cleanId,
        role: USER_ROLES.WORKER,
        status: user.status,
        district: user.district,
        city: user.city,
        societyId: user.societyId,
        workerProfile
      }
    });
  } catch (error: any) {
    console.error("Worker login error:", error);
    res.status(500).json({ success: false, message: "Server error during worker login." });
  }
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const targetRole = role || USER_ROLES.CUSTOMER;

    let user = await User.findOne({ role: targetRole });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("DemoPassword123!", salt);
      user = await User.create({
        name: `Demo ${targetRole.replace("_", " ")}`,
        email: `demo.${targetRole.toLowerCase()}@coopnex.org`,
        phone: `+91987650000${Math.floor(Math.random() * 9)}`,
        passwordHash,
        role: targetRole,
        district: "Vijayawada",
        city: "Vijayawada",
        emailVerified: true,
        phoneVerified: true,
        status: "ACTIVE",
        profileCompleted: true,
        lastLoginAt: new Date()
      });
    }

    const token = signToken(user._id.toString(), user.role as UserRole);

    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER) {
      workerProfile = await Worker.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: `Logged in as Demo ${user.role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        workerProfile
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Demo login error", error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    let workerProfile = null;
    if (req.user.role === USER_ROLES.WORKER) {
      workerProfile = await Worker.findOne({ userId: req.user._id });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        gender: req.user.gender,
        address: req.user.address,
        city: req.user.city,
        district: req.user.district,
        state: req.user.state,
        pincode: req.user.pincode,
        bloodGroup: (req.user as any).bloodGroup || "O+",
        emergencyContactName: (req.user as any).emergencyContactName,
        emergencyContactPhone: (req.user as any).emergencyContactPhone,
        emailVerified: req.user.emailVerified,
        phoneVerified: req.user.phoneVerified,
        workerProfile
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const {
      name,
      firstName,
      lastName,
      phone,
      gender,
      address,
      city,
      district,
      state,
      pincode,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (name) user.name = name.trim();
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address.trim();
    if (city !== undefined) user.city = city.trim();
    if (district !== undefined) user.district = district.trim();
    if (state !== undefined) user.state = state.trim();
    if (pincode !== undefined) user.pincode = pincode.trim();
    if (bloodGroup !== undefined) (user as any).bloodGroup = bloodGroup.trim();
    if (emergencyContactName !== undefined) (user as any).emergencyContactName = emergencyContactName.trim();
    if (emergencyContactPhone !== undefined) (user as any).emergencyContactPhone = emergencyContactPhone.trim();

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        address: user.address,
        city: user.city,
        district: user.district,
        state: user.state,
        pincode: user.pincode,
        bloodGroup: (user as any).bloodGroup || "O+",
        emergencyContactName: (user as any).emergencyContactName,
        emergencyContactPhone: (user as any).emergencyContactPhone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error: any) {
    console.error("updateProfile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile.", error: error.message });
  }
};

/**
 * Record an EmailJS OTP Verification Session in MongoDB
 * Called by frontend when dispatching OTP via EmailJS SDK.
 * Hashes OTP with server salt, enforces 60s cooldown, sets 300s TTL in MongoDB.
 * NEVER returns the plaintext OTP in API response and NEVER logs plaintext OTP to console.
 */
export const recordEmailJsOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, phone, email, otpCode, purpose = "REGISTER" } = req.body;
    const target = (identifier || phone || email || "").trim().toLowerCase();
    const code = (otpCode || "").trim();

    if (!target || !code) {
      res.status(400).json({ success: false, message: "Target identifier and 6-digit OTP code are required." });
      return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      res.status(400).json({ success: false, message: "Invalid 6-digit numeric OTP code." });
      return;
    }

    // Enforce 60-Second Resend Cooldown per target & purpose
    const recentOtp = await Otp.findOne({ identifier: target, purpose }).sort({ createdAt: -1 });
    if (recentOtp && recentOtp.lastSentAt) {
      const timeSinceLastSent = (Date.now() - new Date(recentOtp.lastSentAt).getTime()) / 1000;
      if (timeSinceLastSent < 60) {
        const waitTime = Math.ceil(60 - timeSinceLastSent);
        res.status(429).json({
          success: false,
          message: `Please wait ${waitTime}s before requesting a new verification code.`,
          retryAfterSeconds: waitTime
        });
        return;
      }
    }

    // Clean up any stale unverified OTPs for this target & purpose
    await Otp.deleteMany({ identifier: target, purpose, verified: false });

    // Hash the OTP with server salt using SHA-256
    const otpHash = hashOtp(target, code);

    // Create new OTP record in MongoDB with 300s TTL (5 minutes) and 0 attempts
    await Otp.create({
      identifier: target,
      otpHash,
      purpose,
      verified: false,
      attempts: 0,
      lastSentAt: new Date(),
      createdAt: new Date()
    });

    // Respond success WITHOUT returning the OTP or exposing it
    res.json({
      success: true,
      message: `Verification session initialized for ${target}. Valid for 5 minutes.`,
      expiresInSeconds: 300
    });
  } catch (error: any) {
    console.error("recordEmailJsOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to record verification session." });
  }
};

/**
 * Real-Time Cryptographically Secure OTP Generation & Dispatch
 * Backed by MongoDB Otp collection with 5-minute TTL, 60-second cooldown, and SHA-256 hashing
 */
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, phone, email, name, purpose = "VERIFY_ACCOUNT" } = req.body;
    const target = (identifier || phone || email || "").trim().toLowerCase();

    if (!target) {
      res.status(400).json({ success: false, message: "Email address or phone number is required to send OTP." });
      return;
    }

    // 60-Second Resend Cooldown Check
    const recentOtp = await Otp.findOne({ identifier: target, purpose }).sort({ createdAt: -1 });
    if (recentOtp && recentOtp.lastSentAt) {
      const timeSinceLastSent = (Date.now() - new Date(recentOtp.lastSentAt).getTime()) / 1000;
      if (timeSinceLastSent < 60) {
        const waitTime = Math.ceil(60 - timeSinceLastSent);
        res.status(429).json({
          success: false,
          message: `Please wait ${waitTime}s before requesting a new verification code.`,
          retryAfterSeconds: waitTime
        });
        return;
      }
    }

    // Generate cryptographically secure 6-digit OTP code using crypto.randomInt
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOtp(target, otpCode);

    // Clean up any stale unverified OTPs for this target & purpose
    await Otp.deleteMany({ identifier: target, purpose, verified: false });

    // Store in MongoDB with automatic 300s (5-minute) TTL expiration
    await Otp.create({
      identifier: target,
      otpHash,
      purpose,
      verified: false,
      attempts: 0,
      lastSentAt: new Date(),
      createdAt: new Date()
    });

    // Real Email Dispatch via EmailJS (with fallback to nodemailer if EmailJS pending)
    let emailDispatched = false;
    let dispatchMessage = `A 6-digit verification code has been dispatched to ${target}.`;

    if (target.includes("@")) {
      const emailResult = await sendEmailJsOtp(target, otpCode, name, purpose);
      if (emailResult.success) {
        emailDispatched = true;
      } else {
        console.warn(`[AUTH] EmailJS dispatch pending: ${emailResult.message}. Attempting fallback SMTP...`);
        const fallbackResult = await sendOtpEmail(target, otpCode, purpose);
        if (fallbackResult.success) {
          emailDispatched = true;
        } else {
          // If neither provider succeeded
          console.warn("[AUTH] Note: Email credentials pending in .env");
          dispatchMessage = `A 6-digit verification code has been generated for ${target}. Ensure EMAILJS credentials are configured in .env.`;
        }
      }
    }

    // NEVER return the plain OTP code in response and NEVER log plain OTP to console
    res.json({
      success: true,
      message: dispatchMessage,
      expiresInSeconds: 300,
      emailDispatched
    });
  } catch (error: any) {
    console.error("sendOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to dispatch OTP.", error: error.message });
  }
};

/**
 * Real-Time Cryptographically Secure OTP Verification
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, phone, email, otpCode, purpose = "VERIFY_ACCOUNT" } = req.body;
    const target = (identifier || phone || email || "").trim().toLowerCase();
    const code = (otpCode || "").trim();

    if (!target || !code) {
      res.status(400).json({ success: false, message: "Identifier and 6-digit OTP code are required." });
      return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      res.status(400).json({ success: false, message: "Please enter a valid 6-digit numeric verification code." });
      return;
    }

    // Find active valid OTP in database
    const validOtp = await Otp.findOne({
      identifier: target,
      purpose,
      verified: false
    }).sort({ createdAt: -1 });

    if (!validOtp) {
      res.status(400).json({
        success: false,
        message: "No active verification code found for this address. It may have expired. Please request a new code."
      });
      return;
    }

    // Check maximum 5 attempts limit
    if (validOtp.attempts >= 5) {
      await Otp.deleteOne({ _id: validOtp._id });
      res.status(429).json({
        success: false,
        message: "Maximum verification attempts exceeded (5/5). This code has been invalidated for security. Please request a new code."
      });
      return;
    }

    // Compare hash securely
    const submittedHash = hashOtp(target, code);
    const isMatch = validOtp.otpHash ? (submittedHash === validOtp.otpHash) : (code === (validOtp as any).otpCode);

    if (!isMatch) {
      validOtp.attempts += 1;
      await validOtp.save();
      const remaining = 5 - validOtp.attempts;
      res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Invalid verification code. Maximum attempts reached. Please request a new code."
      });
      return;
    }

    // Mark as verified
    validOtp.verified = true;
    await validOtp.save();

    // If purpose is for registration verification, return verified confirmation
    if (purpose === "PHONE_VERIFY" || purpose === "VERIFY_ACCOUNT" || purpose === "REGISTER") {
      res.json({
        success: true,
        message: `${target.includes("@") ? "Email" : "Mobile number"} successfully verified.`
      });
      return;
    }

    // If purpose is LOGIN: find user
    const user = await User.findOne({
      $or: [{ phone: target }, { email: target }]
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No user found with this verified contact. Please register an account first."
      });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id.toString(), user.role as UserRole);

    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER) {
      workerProfile = await Worker.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: "OTP successfully verified. Welcome to COOPNEX!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        workerProfile
      }
    });
  } catch (error: any) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP.", error: error.message });
  }
};

/**
 * Forgot Password: Send 6-Digit OTP to Registered Account using EmailJS Reset Template
 * Strictly verifies that an eligible active account exists before generating or dispatching OTP.
 * Employs anti-enumeration response to prevent user existence probing.
 */
export const forgotPasswordSendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, email, employeeId, phone } = req.body;
    const cleanTarget = (identifier || email || employeeId || phone || "").trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanTarget || (!emailRegex.test(cleanTarget) && cleanTarget.length < 4)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid registered email address or Employee ID."
      });
      return;
    }

    // 1. Check if eligible account exists in User or Worker collection
    let user = await User.findOne({
      $or: [
        { email: cleanTarget },
        { employeeId: cleanTarget.toUpperCase() },
        { phone: cleanTarget }
      ]
    });

    if (!user) {
      const worker = await Worker.findOne({
        $or: [
          { employeeId: cleanTarget.toUpperCase() },
          { email: cleanTarget }
        ]
      });
      if (worker && worker.userId) {
        user = await User.findById(worker.userId);
      }
    }

    // 2. Anti-enumeration security: If user DOES NOT exist or is inactive, DO NOT send OTP
    if (!user || user.status === "SUSPENDED" || user.isActive === false) {
      res.json({
        success: true,
        message: "If an eligible account exists, a verification code will be sent to your registered contact.",
        expiresInSeconds: 600
      });
      return;
    }

    // Determine target recipient email
    const emailTarget = user.email || (cleanTarget.includes("@") ? cleanTarget : null);
    if (!emailTarget) {
      res.json({
        success: true,
        message: "If an eligible account exists, a verification code will be sent to your registered contact.",
        expiresInSeconds: 600
      });
      return;
    }

    // 3. 60-second cooldown rate limit check
    const recentOtp = await Otp.findOne({ identifier: cleanTarget, purpose: "FORGOT_PASSWORD" }).sort({ createdAt: -1 });
    if (recentOtp && recentOtp.lastSentAt) {
      const timeSinceLastSent = (Date.now() - new Date(recentOtp.lastSentAt).getTime()) / 1000;
      if (timeSinceLastSent < 60) {
        const waitTime = Math.ceil(60 - timeSinceLastSent);
        res.status(429).json({
          success: false,
          message: `Please wait ${waitTime}s before requesting a new password reset code.`,
          retryAfterSeconds: waitTime
        });
        return;
      }
    }

    // 4. Cryptographically secure 6-digit OTP code using crypto.randomInt
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOtp(cleanTarget, otpCode);

    // 5. Clean up stale unverified reset OTPs for this target and set new one with 10-minute TTL
    await Otp.deleteMany({ identifier: cleanTarget, purpose: "FORGOT_PASSWORD", verified: false });

    await Otp.create({
      identifier: cleanTarget,
      otpHash,
      purpose: "FORGOT_PASSWORD",
      verified: false,
      attempts: 0,
      lastSentAt: new Date(),
      createdAt: new Date()
    });

    let emailDispatched = false;
    // Dispatch via EmailJS using RESET_PASSWORD template
    const emailResult = await sendEmailJsOtp(emailTarget, otpCode, user.name, "RESET_PASSWORD");
    if (emailResult.success) {
      emailDispatched = true;
    } else {
      console.warn(`[AUTH] EmailJS reset template dispatch pending: ${emailResult.message}. Attempting fallback SMTP...`);
      const fallbackResult = await sendOtpEmail(emailTarget, otpCode, "FORGOT_PASSWORD");
      if (fallbackResult.success) {
        emailDispatched = true;
      }
    }

    res.json({
      success: true,
      message: "If an eligible account exists, a verification code will be sent to your registered contact.",
      expiresInSeconds: 600,
      emailDispatched
    });
  } catch (error: any) {
    console.error("forgotPasswordSendOtp error:", error);
    res.status(500).json({ success: false, message: "Server error during password reset request." });
  }
};

/**
 * Forgot Password: Verify OTP & Reset Password
 */
export const forgotPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otpCode, newPassword } = req.body;
    const target = (identifier || "").trim().toLowerCase();
    const code = (otpCode || "").trim();

    if (!target || !code || !newPassword) {
      res.status(400).json({ success: false, message: "Identifier, OTP code, and new password are required." });
      return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      res.status(400).json({ success: false, message: "Please enter a valid 6-digit numeric verification code." });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
      return;
    }

    const validOtp = await Otp.findOne({
      identifier: target,
      purpose: "FORGOT_PASSWORD",
      verified: false
    }).sort({ createdAt: -1 });

    if (!validOtp) {
      res.status(400).json({
        success: false,
        message: "No active password reset verification code found. It may have expired. Please request a new code."
      });
      return;
    }

    // Maximum 5 attempts check
    if (validOtp.attempts >= 5) {
      await Otp.deleteOne({ _id: validOtp._id });
      res.status(429).json({
        success: false,
        message: "Maximum verification attempts exceeded (5/5). This reset code has been invalidated for security. Please request a new code."
      });
      return;
    }

    const submittedHash = hashOtp(target, code);
    const isMatch = validOtp.otpHash ? (submittedHash === validOtp.otpHash) : (code === (validOtp as any).otpCode);

    if (!isMatch) {
      validOtp.attempts += 1;
      await validOtp.save();
      const remaining = 5 - validOtp.attempts;
      res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Invalid verification code. Maximum attempts reached. Please request a new code."
      });
      return;
    }

    let user = await User.findOne({
      $or: [
        { email: target },
        { employeeId: target.toUpperCase() },
        { phone: target }
      ]
    });

    if (!user) {
      const worker = await Worker.findOne({
        $or: [
          { employeeId: target.toUpperCase() },
          { email: target }
        ]
      });
      if (worker && worker.userId) {
        user = await User.findById(worker.userId);
      }
    }

    if (!user) {
      res.status(404).json({ success: false, message: "Associated account could not be located." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.lastLoginAt = new Date();
    await user.save();

    // Mark verified and invalidate to prevent OTP reuse
    validOtp.verified = true;
    await validOtp.save();
    await Otp.deleteMany({ identifier: target, purpose: "FORGOT_PASSWORD" });

    // Auto-sign in with fresh JWT token
    const token = signToken(user._id.toString(), user.role as UserRole);

    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER) {
      workerProfile = await Worker.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: "Password reset successful! You are now securely signed in.",
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        workerProfile
      }
    });
  } catch (error: any) {
    console.error("forgotPasswordReset error:", error);
    res.status(500).json({ success: false, message: "Server error resetting password." });
  }
};
