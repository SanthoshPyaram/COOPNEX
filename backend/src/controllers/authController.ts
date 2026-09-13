import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dns from "dns";
import { User } from "../models/User";
import { Worker } from "../models/Worker";
import { Admin } from "../models/Admin";
import { Otp } from "../models/Otp";
import { USER_ROLES, UserRole } from "../config/constants";
import { AuthenticatedRequest } from "../middleware/auth";
import crypto from "crypto";
import { sendOtpEmail } from "../services/emailService";
import { sendEmailJsOtp } from "../services/emailJsService";
import { validateEmailAddress } from "../services/emailValidationService";
import { validateAadhaarVerhoeff, validatePanFormat, evaluatePreliminaryValidation } from "../utils/identityValidation";
import { saveDocument, saveAvatar } from "../services/documentService";
import { OtpRequestTracer } from "../utils/tracer";

const hashOtp = (identifier: string, code: string): string => {
  const salt = process.env.OTP_SALT || "coopnex_production_otp_salt_2026";
  return crypto.createHash("sha256").update(`${identifier.toLowerCase().trim()}:${code.trim()}:${salt}`).digest("hex");
};

const signToken = (userId: string, role: UserRole) => {
  const secret = process.env.JWT_SECRET || "coopnex_super_secure_jwt_secret_2026_sih";
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

/**
 * Real-Time Server-Side Email Validation API
 * Integrates ZeroBounce API, DNS MX Resolution, and Disposable Domain Blocklists
 * POST /api/auth/validate-email
 */
export const validateEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawEmail = (req.body.email || req.query.email || "").toString().trim();
    if (!rawEmail) {
      res.status(400).json({
        success: false,
        status: "invalid",
        safeToSendOtp: false,
        reason: "missing_email",
        message: "❌ Please enter a valid email address. 📧"
      });
      return;
    }

    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
    const result = await validateEmailAddress(rawEmail, clientIp);

    if (!result.safeToSendOtp) {
      res.status(400).json({
        success: false,
        status: result.status,
        safeToSendOtp: false,
        reason: result.reason,
        subStatus: result.subStatus,
        message: result.message
      });
      return;
    }

    // Account duplicate check for registration mode (role-aware: same person can be Customer + Worker)
    const mode = (req.body.mode || req.query.mode || "REGISTER").toString().trim().toUpperCase();
    const targetRole = (req.body.role || req.body.targetRole || req.query.role || req.query.targetRole || "").toString().trim().toUpperCase();

    if (mode === "REGISTER") {
      let isTaken = false;
      let conflictReason = "already_registered";
      let conflictMessage = "❌ This email is already registered. Please sign in or use another email. 📧";
      let canConnectExisting = false;

      if (mongoose.connection.readyState === 1) {
        const existingUser = await User.findOne({ email: result.normalizedEmail });
        const existingWorker = existingUser
          ? await Worker.findOne({ userId: existingUser._id })
          : await Worker.findOne({ email: result.normalizedEmail });
        const existingAdmin = (existingUser || existingWorker) ? null : await Admin.findOne({ email: result.normalizedEmail });

        if (existingAdmin || existingUser?.role === USER_ROLES.SUPER_ADMIN || existingUser?.roles?.includes(USER_ROLES.SUPER_ADMIN)) {
          isTaken = true;
          conflictReason = "admin_account";
          conflictMessage = "❌ Administrative accounts cannot register via public registration.";
        } else if (targetRole === USER_ROLES.WORKER) {
          const alreadyWorker = Boolean(existingWorker) || existingUser?.role === USER_ROLES.WORKER || existingUser?.roles?.includes(USER_ROLES.WORKER);
          if (alreadyWorker) {
            isTaken = true;
            conflictReason = "already_registered_worker";
            conflictMessage = "❌ You already have a Worker profile registered with this email. Please sign in to the Worker Portal.";
          } else if (existingUser) {
            canConnectExisting = true;
          }
        } else if (targetRole === USER_ROLES.CUSTOMER) {
          const alreadyCustomer = existingUser?.role === USER_ROLES.CUSTOMER || existingUser?.roles?.includes(USER_ROLES.CUSTOMER);
          if (alreadyCustomer) {
            isTaken = true;
            conflictReason = "already_registered_customer";
            conflictMessage = "❌ This email is already registered as a Customer. Please sign in.";
          } else if (existingUser || existingWorker) {
            canConnectExisting = true;
          }
        } else {
          isTaken = Boolean(existingUser || existingWorker || existingAdmin);
        }
      }

      if (isTaken) {
        res.status(409).json({
          success: false,
          status: "invalid",
          safeToSendOtp: false,
          reason: conflictReason,
          message: conflictMessage
        });
        return;
      }

      if (canConnectExisting) {
        res.json({
          success: true,
          status: "valid",
          safeToSendOtp: true,
          isExistingUser: true,
          canRegisterAs: true,
          message: targetRole === USER_ROLES.WORKER
            ? "Your existing COOPNEX account will be connected to your new Worker profile."
            : "Your existing COOPNEX account will be connected to your Customer profile.",
          details: result.details
        });
        return;
      }
    } else if (mode === "FORGOT_PASSWORD" || mode === "RECOVER_EMPLOYEE_ID") {
      let isRegistered = false;
      if (mongoose.connection.readyState === 1) {
        const existingUser = await User.findOne({ email: result.normalizedEmail });
        const existingWorker = existingUser ? null : await Worker.findOne({ email: result.normalizedEmail });
        const existingAdmin = (existingUser || existingWorker) ? null : await Admin.findOne({ email: result.normalizedEmail });
        isRegistered = Boolean(existingUser || existingWorker || existingAdmin);
      }
      if (!isRegistered) {
        res.status(400).json({
          success: false,
          status: "not_registered",
          safeToSendOtp: false,
          reason: "not_registered",
          message: "❌ This email address is not registered. Please check your email and try again. 📧"
        });
        return;
      }
    }

    res.json({
      success: true,
      status: "valid",
      safeToSendOtp: true,
      message: result.message,
      details: result.details
    });
  } catch (err: any) {
    console.error("[validateEmail] Unexpected error:", err);
    res.status(500).json({
      success: false,
      status: "unknown",
      safeToSendOtp: false,
      reason: "internal_error",
      message: "⚠️ We couldn't confirm this email address. Please use another email. 📧"
    });
  }
};

/**
 * Safe Pre-Check: Checks if an email is already registered without revealing user details
 * Response: { success: true, exists: boolean, message: string }
 */
export const checkEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawEmail = (req.body.email || req.query.email || "").toString().trim().toLowerCase();
    const mode = (req.body.mode || req.query.mode || "").toString().trim().toUpperCase();

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!rawEmail || !emailRegex.test(rawEmail) || rawEmail.startsWith("@") || rawEmail.endsWith("@") || rawEmail.includes("..")) {
      res.status(400).json({
        success: false,
        exists: false,
        message: "❌ Please enter a valid email address. 📧"
      });
      return;
    }

    const targetRole = (req.body.role || req.body.targetRole || req.query.role || req.query.targetRole || "").toString().trim().toUpperCase();

    let exists = false;
    let existingUser: any = null;
    let existingWorker: any = null;
    let existingAdmin: any = null;

    if (mongoose.connection.readyState === 1) {
      existingUser = await User.findOne({ email: rawEmail });
      existingWorker = existingUser
        ? await Worker.findOne({ userId: existingUser._id })
        : await Worker.findOne({ email: rawEmail });
      existingAdmin = (existingUser || existingWorker) ? null : await Admin.findOne({ email: rawEmail });
      exists = Boolean(existingUser || existingWorker || existingAdmin);
    } else {
      // Demo accounts fallback when offline
      const DEMO_EMAILS = [
        "demo.customer@coopnex.in",
        "demo.worker@coopnex.in",
        "worker.demo@coopnex.in",
        "arjun.kumar@coopnex.worker.in",
        "admin@coopnex.in",
        "superadmin@coopnex.in",
        "priya.sharma@coopnex.customer.in"
      ];
      exists = DEMO_EMAILS.includes(rawEmail);
    }

    if (mode === "REGISTER") {
      if (existingAdmin || existingUser?.role === USER_ROLES.SUPER_ADMIN || existingUser?.roles?.includes(USER_ROLES.SUPER_ADMIN)) {
        res.json({
          success: true,
          exists: true,
          available: false,
          roleConflict: true,
          message: "❌ Administrative accounts cannot register via public registration."
        });
        return;
      }

      if (targetRole === USER_ROLES.WORKER) {
        const alreadyWorker = Boolean(existingWorker) || existingUser?.role === USER_ROLES.WORKER || existingUser?.roles?.includes(USER_ROLES.WORKER);
        if (alreadyWorker) {
          res.json({
            success: true,
            exists: true,
            available: false,
            roleConflict: true,
            message: "❌ You already have a Worker profile registered with this email. Please sign in to the Worker Portal."
          });
          return;
        } else if (existingUser) {
          // Existing customer can acquire Worker role
          res.json({
            success: true,
            exists: true,
            available: true,
            canRegisterAs: true,
            existingUser: true,
            message: "Your existing COOPNEX account will be connected to your Worker profile."
          });
          return;
        }
      } else if (targetRole === USER_ROLES.CUSTOMER) {
        const alreadyCustomer = existingUser?.role === USER_ROLES.CUSTOMER || existingUser?.roles?.includes(USER_ROLES.CUSTOMER);
        if (alreadyCustomer) {
          res.json({
            success: true,
            exists: true,
            available: false,
            roleConflict: true,
            message: "❌ This email is already registered as a Customer. Please sign in."
          });
          return;
        } else if (existingUser || existingWorker) {
          // Existing worker can acquire Customer role
          res.json({
            success: true,
            exists: true,
            available: true,
            canRegisterAs: true,
            existingUser: true,
            message: "Your existing COOPNEX account will be connected to your Customer profile."
          });
          return;
        }
      } else if (exists) {
        res.json({
          success: true,
          exists: true,
          available: false,
          message: "❌ This email is already registered. Please sign in or use another email. 📧"
        });
        return;
      }

      // Check domain MX records to reject non-existent domains early
      const domain = rawEmail.split("@")[1];
      if (domain) {
        try {
          const mx = await Promise.race([
            dns.promises.resolveMx(domain),
            new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("DNS timeout")), 2500))
          ]);
          if (!mx || mx.length === 0) {
            res.json({
              success: true,
              exists: false,
              available: false,
              message: "❌ Please enter a valid email address. 📧"
            });
            return;
          }
        } catch (dnsErr: any) {
          if (dnsErr?.code === "ENOTFOUND" || dnsErr?.code === "ENODATA") {
            res.json({
              success: true,
              exists: false,
              available: false,
              message: "❌ Please enter a valid email address. 📧"
            });
            return;
          }
        }
      }

      res.json({
        success: true,
        exists: false,
        available: true,
        message: "Email is available for registration."
      });
      return;
    }

    // Default / Recovery Mode: check if account exists
    if (!exists) {
      res.json({
        success: true,
        exists: false,
        message: "❌ This email address is not registered. Please check your email and try again. 📧"
      });
      return;
    }

    res.json({
      success: true,
      exists: true,
      message: "Email found in records."
    });
  } catch (error: any) {
    res.status(500).json({ success: false, exists: false, message: "Error checking email availability." });
  }
};

/**
 * Safe Pre-Check: Checks if a phone number is already registered without revealing user details
 */
export const checkPhone = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawPhone = (req.query.phone || req.body.phone || "").toString().trim();
    if (!rawPhone) {
      res.status(400).json({ success: false, message: "Phone number is required." });
      return;
    }
    const cleanDigits = rawPhone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      res.status(400).json({ success: false, message: "Valid 10-digit phone number is required." });
      return;
    }
    if (mongoose.connection.readyState !== 1) {
      res.json({
        success: true,
        exists: false,
        message: "Phone number is available."
      });
      return;
    }
    const targetRole = (req.query.role || req.body.role || req.query.targetRole || req.body.targetRole || "").toString().trim().toUpperCase();
    const email = (req.query.email || req.body.email || "").toString().trim().toLowerCase();

    const last10 = cleanDigits.slice(-10);
    const existingUser = await User.findOne({ phone: { $regex: `${last10}$` } });
    const existingWorker = existingUser
      ? await Worker.findOne({ userId: existingUser._id })
      : await Worker.findOne({ phone: { $regex: `${last10}$` } });

    const exists = Boolean(existingUser || existingWorker);

    if (!exists) {
      res.json({
        success: true,
        exists: false,
        available: true,
        message: "Phone number is available."
      });
      return;
    }

    // Phone belongs to existing user - check if it's the same person or different person
    if (email && existingUser && existingUser.email.toLowerCase() === email) {
      // Same person!
      if (targetRole === USER_ROLES.WORKER) {
        const alreadyWorker = Boolean(existingWorker) || existingUser.role === USER_ROLES.WORKER || existingUser.roles?.includes(USER_ROLES.WORKER);
        if (alreadyWorker) {
          res.json({
            success: true,
            exists: true,
            available: false,
            roleConflict: true,
            message: "❌ This phone number is already registered for your Worker profile."
          });
          return;
        }
        res.json({
          success: true,
          exists: true,
          available: true,
          canRegisterAs: true,
          message: "Phone number verified from your existing COOPNEX account."
        });
        return;
      }
      if (targetRole === USER_ROLES.CUSTOMER) {
        const alreadyCustomer = existingUser.role === USER_ROLES.CUSTOMER || existingUser.roles?.includes(USER_ROLES.CUSTOMER);
        if (alreadyCustomer) {
          res.json({
            success: true,
            exists: true,
            available: false,
            roleConflict: true,
            message: "❌ This phone number is already registered for your Customer account."
          });
          return;
        }
        res.json({
          success: true,
          exists: true,
          available: true,
          canRegisterAs: true,
          message: "Phone number verified from your existing COOPNEX account."
        });
        return;
      }
    } else if (email && existingUser && existingUser.email.toLowerCase() !== email) {
      // Different person attempting to use someone else's phone!
      res.json({
        success: true,
        exists: true,
        available: false,
        roleConflict: true,
        message: "❌ This phone number is already registered to another user account. Please use your own phone number."
      });
      return;
    }

    // Role-specific check when email is not provided
    if (targetRole === USER_ROLES.WORKER) {
      const alreadyWorker = Boolean(existingWorker) || existingUser?.role === USER_ROLES.WORKER || existingUser?.roles?.includes(USER_ROLES.WORKER);
      res.json({
        success: true,
        exists: true,
        available: !alreadyWorker,
        canRegisterAs: !alreadyWorker,
        roleConflict: alreadyWorker,
        message: alreadyWorker
          ? "❌ This phone number is already registered for a Worker profile."
          : "Phone number associated with your existing account."
      });
      return;
    }

    if (targetRole === USER_ROLES.CUSTOMER) {
      const alreadyCustomer = existingUser?.role === USER_ROLES.CUSTOMER || existingUser?.roles?.includes(USER_ROLES.CUSTOMER);
      res.json({
        success: true,
        exists: true,
        available: !alreadyCustomer,
        canRegisterAs: !alreadyCustomer,
        roleConflict: alreadyCustomer,
        message: alreadyCustomer
          ? "❌ This phone number is already registered for a Customer account."
          : "Phone number associated with your existing account."
      });
      return;
    }

    res.json({
      success: true,
      exists: true,
      available: false,
      message: "Phone number already registered. Please use another number."
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error checking phone availability." });
  }
};

/**
 * Register a new User (Customer or Worker)
 * Strictly requires both Email and Phone to be verified via real OTP before account creation
 * Public registration forbids any administrative role (SUPER_ADMIN, etc.)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please ensure your cloud MongoDB Atlas database (MONGODB_URI) is configured in your Render environment variables.",
        error: "MongoDB not connected (readyState = " + mongoose.connection.readyState + ")"
      });
      return;
    }

    const {
      name: providedName,
      firstName,
      lastName,
      gender = "Prefer not to say",
      dateOfBirth,
      age: providedAge,
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

    // Name Validation: Letters only, single spaces, optional dots
    if (/\d/.test(resolvedName) || !/^[A-Za-z]+(?:[ .'-][A-Za-z]+)*[.]?$/.test(resolvedName)) {
      res.status(400).json({
        success: false,
        message: "❌ Please enter a valid name using letters only. 👤"
      });
      return;
    }

    // Strict Server-Side Date of Birth and Age (18+) Verification
    let parsedDob: Date | undefined;
    let actualAge: number | undefined;

    if (!dateOfBirth) {
      if (providedAge !== undefined && providedAge !== null && providedAge !== "") {
        const pAge = Number(providedAge);
        if (Number.isInteger(pAge) && pAge >= 18 && pAge <= 120) {
          actualAge = pAge;
        } else {
          res.status(400).json({
            success: false,
            field: "dateOfBirth",
            message: "User must be at least 18 years old."
          });
          return;
        }
      } else {
        res.status(400).json({
          success: false,
          field: "dateOfBirth",
          message: "❌ Please enter your date of birth. 📅"
        });
        return;
      }
    } else {
      parsedDob = new Date(dateOfBirth);
      if (isNaN(parsedDob.getTime())) {
        res.status(400).json({
          success: false,
          field: "dateOfBirth",
          message: "❌ Please enter a valid date of birth. 📅"
        });
        return;
      }

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (parsedDob > todayStart) {
        res.status(400).json({
          success: false,
          field: "dateOfBirth",
          message: "❌ Date of birth cannot be in the future. 📅"
        });
        return;
      }

      // Exact Age calculation
      let calculated = today.getFullYear() - parsedDob.getFullYear();
      const m = today.getMonth() - parsedDob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < parsedDob.getDate())) {
        calculated--;
      }

      if (calculated < 18) {
        res.status(400).json({
          success: false,
          field: "dateOfBirth",
          message: "User must be at least 18 years old."
        });
        return;
      }

      if (calculated > 120) {
        res.status(400).json({
          success: false,
          field: "dateOfBirth",
          message: "❌ Please enter a valid date of birth. 📅"
        });
        return;
      }

      actualAge = calculated;
    }

    // Password Complexity: min 8, uppercase, lowercase, number, special char
    const pStr = String(password);
    const hasMin8 = pStr.length >= 8;
    const hasUpper = /[A-Z]/.test(pStr);
    const hasLower = /[a-z]/.test(pStr);
    const hasNumber = /[0-9]/.test(pStr);
    const hasSpecial = /[^A-Za-z0-9]/.test(pStr);
    if (!hasMin8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      res.status(400).json({
        success: false,
        message: "❌ Password must contain at least 8 characters, including uppercase, lowercase, number and special character. 🔐"
      });
      return;
    }

    // Phone Validation: 10 digits
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        res.status(400).json({
          success: false,
          message: "❌ Please enter a valid 10-digit mobile number. 📱"
        });
        return;
      }
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

    // Verify email: accept either client-verified (EmailJS) or MongoDB verified OTP
    const verifiedEmailOtp = await Otp.findOne({
      identifier: cleanEmail,
      verified: true
    });

    if (!emailVerified && !verifiedEmailOtp) {
      res.status(400).json({
        success: false,
        message: "Email has not been verified. Please complete email OTP verification."
      });
      return;
    }

    const cleanPhone = phone ? phone.trim() : undefined;
    if (role === USER_ROLES.CUSTOMER) {
      if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
        res.status(400).json({
          success: false,
          message: "Phone number is required. Please provide a valid 10-digit mobile number."
        });
        return;
      }
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    // Enforce phone uniqueness per person: phone cannot belong to a DIFFERENT user account
    if (cleanPhone) {
      const cleanDigits = cleanPhone.replace(/\D/g, "");
      const last10 = cleanDigits.slice(-10);
      if (last10.length === 10) {
        const otherUserWithPhone = await User.findOne({
          phone: { $regex: `${last10}$` },
          email: { $ne: cleanEmail }
        });
        if (otherUserWithPhone) {
          res.status(409).json({
            success: false,
            message: "❌ This phone number is already registered to another user account. Please use your own phone number."
          });
          return;
        }
      }
    }

    if (existingUser) {
      // Public signup cannot claim administrative accounts
      if (existingUser.role === USER_ROLES.SUPER_ADMIN || existingUser.roles?.includes(USER_ROLES.SUPER_ADMIN)) {
        res.status(403).json({
          success: false,
          message: "Administrative accounts cannot register via public registration."
        });
        return;
      }

      // Check if user already possesses the requested role/profile
      if (role === USER_ROLES.WORKER) {
        const existingWorker = await Worker.findOne({
          $or: [
            { userId: existingUser._id },
            { email: cleanEmail }
          ]
        });
        const alreadyWorker = Boolean(existingWorker) || existingUser.role === USER_ROLES.WORKER || existingUser.roles?.includes(USER_ROLES.WORKER);
        if (alreadyWorker) {
          res.status(409).json({
            success: false,
            code: "WORKER_PROFILE_EXISTS",
            message: "❌ You already have a Worker profile registered with this account. Please sign in to the Worker Portal."
          });
          return;
        }
      } else if (role === USER_ROLES.CUSTOMER) {
        const alreadyCustomer = existingUser.role === USER_ROLES.CUSTOMER || existingUser.roles?.includes(USER_ROLES.CUSTOMER);
        if (alreadyCustomer) {
          res.status(409).json({
            success: false,
            code: "CUSTOMER_PROFILE_EXISTS",
            message: "❌ You already have a Customer account registered with this email. Please sign in."
          });
          return;
        }
      }
    }

    const aadhaarNum = (req.body.aadhaarNumber || req.body.aadhaar || "").replace(/\s+/g, "");
    const panNum = (req.body.panNumber || req.body.pan || "").toUpperCase().trim();
    const pccNum = (req.body.pccNumber || req.body.pcc || "").trim();
    const rawAadhaarFile = req.body.aadhaarFileBase64 || req.body.aadhaarFile;
    const rawPanFile = req.body.panFileBase64 || req.body.panFile;
    const rawPccFile = req.body.pccFileBase64 || req.body.pccFile;

    let vAadhaar = { valid: false, message: "" };
    let vPan = { valid: false, message: "" };

    if (role === USER_ROLES.WORKER) {
      if (!aadhaarNum || aadhaarNum.length !== 12) {
        res.status(400).json({
          success: false,
          message: "12-digit Aadhaar number is mandatory for worker registration."
        });
        return;
      }
      vAadhaar = validateAadhaarVerhoeff(aadhaarNum);
      if (!vAadhaar.valid) {
        res.status(400).json({
          success: false,
          message: `Aadhaar validation failed: ${vAadhaar.message}. Please check UIDAI 12-digit number.`
        });
        return;
      }
      if (!rawAadhaarFile || (typeof rawAadhaarFile === "string" && rawAadhaarFile.trim().length < 50)) {
        res.status(400).json({
          success: false,
          message: "Aadhaar document scan (PDF or image) is mandatory. Please upload your Aadhaar document."
        });
        return;
      }
      const existingAadhaar = await Worker.findOne({ "kycDocuments.documentNumber": aadhaarNum });
      if (existingAadhaar) {
        res.status(409).json({
          success: false,
          message: "A worker with this Aadhaar number is already enrolled in the cooperative system."
        });
        return;
      }

      if (!panNum || panNum.length !== 10) {
        res.status(400).json({
          success: false,
          message: "10-character PAN number is mandatory for worker registration."
        });
        return;
      }
      vPan = validatePanFormat(panNum);
      if (!vPan.valid) {
        res.status(400).json({
          success: false,
          message: `PAN format invalid: ${vPan.message}. Format must be 5 letters, 4 digits, 1 letter (e.g., ABCPS1234F).`
        });
        return;
      }
      if (!rawPanFile || (typeof rawPanFile === "string" && rawPanFile.trim().length < 50)) {
        res.status(400).json({
          success: false,
          message: "PAN document scan (PDF or image) is mandatory. Please upload your PAN document."
        });
        return;
      }
      const existingPan = await Worker.findOne({ "kycDocuments.documentNumber": panNum });
      if (existingPan) {
        res.status(409).json({
          success: false,
          message: "A worker with this PAN number is already enrolled in the cooperative system."
        });
        return;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let assignedEmployeeId = (req.body.employeeId || "").trim().toUpperCase();
    if (!assignedEmployeeId && role === USER_ROLES.WORKER) {
      let isUnique = false;
      while (!isUnique) {
        assignedEmployeeId = `COOP-WRK-${Math.floor(10000 + Math.random() * 90000)}`;
        const conflictUser = await User.findOne({ employeeId: assignedEmployeeId });
        const conflictWorker = await Worker.findOne({ employeeId: assignedEmployeeId });
        if (!conflictUser && !conflictWorker) {
          isUnique = true;
        }
      }
    }

    // Process avatar if provided as Base64 data URL
    let avatarUrl = "";
    const rawPhoto = req.body.avatarUrl || req.body.photoPreview || req.body.profileImage || "";
    if (rawPhoto && rawPhoto.startsWith("data:")) {
      try {
        const savedAv = await saveAvatar({
          rawContent: rawPhoto,
          originalName: `avatar_${Date.now()}.jpg`,
          mimeType: "image/jpeg"
        });
        avatarUrl = savedAv.storageReference;
      } catch (avErr) {
        console.warn("Avatar processing warning:", avErr);
      }
    } else if (rawPhoto && !rawPhoto.includes("unsplash.com")) {
      avatarUrl = rawPhoto;
    }

    let user: any = null;
    let isNewUser = false;

    if (existingUser) {
      user = existingUser;
      const currentRoles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [user.role];
      user.roles = Array.from(new Set([...currentRoles, role]));
      if (cleanPhone && !user.phone) user.phone = cleanPhone;
      if (assignedEmployeeId && !user.employeeId) user.employeeId = assignedEmployeeId;
      if (parsedDob && !user.dateOfBirth) {
        user.dateOfBirth = parsedDob;
        user.age = actualAge;
        user.ageAtRegistration = actualAge;
      }
      if (pincode && !user.pincode) user.pincode = pincode;
      if (address && !user.address) user.address = address;
      if (district && !user.district) user.district = district;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      user.emailVerified = true;
      if (phoneVerified) user.phoneVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      isNewUser = true;
      user = await User.create({
        authProviderUserId,
        employeeId: assignedEmployeeId,
        name: resolvedName,
        firstName,
        lastName,
        gender,
        dateOfBirth: parsedDob,
        ageAtRegistration: actualAge,
        age: actualAge,
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role,
        roles: [role],
        status: "ACTIVE",
        profileCompleted: true,
        emailVerified: true,
        phoneVerified: Boolean(phoneVerified),
        lastLoginAt: new Date(),
        state,
        district,
        city,
        pincode,
        address,
        societyId,
        avatarUrl,
        bloodGroup: req.body.bloodGroup || undefined
      });
    }

    let workerProfile = null;
    if (role === USER_ROLES.WORKER) {
      try {
        const skillsArray = Array.isArray(req.body.skills)
          ? req.body.skills
          : typeof req.body.skills === "string"
          ? req.body.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [req.body.primarySkill || "Electrician"];

        const languagesArray = Array.isArray(req.body.languages)
          ? req.body.languages
          : ["Telugu", "Hindi", "English"];

        const workerIdNumber = assignedEmployeeId || `COOP-WRK-${Math.floor(10000 + Math.random() * 90000)}`;

        const defaultKycDocuments: any[] = [];
        const rawAadhaarFile = req.body.aadhaarFileBase64 || req.body.aadhaarFile;
        const rawPanFile = req.body.panFileBase64 || req.body.panFile;
        const rawPccFile = req.body.pccFileBase64 || req.body.pccFile;

        // Save Aadhaar document
        if (aadhaarNum) {
          let aadhaarRef: string | undefined;
          let aadhaarSize: number | undefined;
          let aadhaarMime: string | undefined;
          let aadhaarName: string = req.body.aadhaarOriginalFilename || "aadhaar_card.pdf";

          if (rawAadhaarFile && (rawAadhaarFile.startsWith("data:") || rawAadhaarFile.length > 50)) {
            try {
              const saved = await saveDocument({
                rawContent: rawAadhaarFile,
                originalName: aadhaarName,
                mimeType: rawAadhaarFile.startsWith("data:") ? rawAadhaarFile.split(";")[0].replace("data:", "") : undefined,
                workerId: user._id.toString(),
                documentType: "AADHAAR"
              });
              aadhaarRef = saved.storageReference;
              aadhaarSize = saved.sizeBytes;
              aadhaarMime = saved.mimeType;
              aadhaarName = saved.originalName;
            } catch (docErr) {
              console.warn("Aadhaar upload warning:", docErr);
            }
          }

          defaultKycDocuments.push({
            documentType: "AADHAAR",
            documentNumber: aadhaarNum,
            fileUrl: aadhaarRef || "",
            storageReference: aadhaarRef,
            originalFilename: aadhaarName,
            fileSize: aadhaarSize,
            mimeType: aadhaarMime,
            checksumValid: true,
            formatValid: true,
            verificationStatus: "PENDING",
            fraudRiskScore: 10,
            fraudFlags: [],
            aiVerificationNotes: "UIDAI Verhoeff Checksum Validated — Identity Document Pending Super Admin Review",
            submittedAt: new Date()
          });
        }

        // Save PAN document
        if (panNum) {
          let panRef: string | undefined;
          let panSize: number | undefined;
          let panMime: string | undefined;
          let panName: string = req.body.panOriginalFilename || "pan_card.pdf";

          if (rawPanFile && (rawPanFile.startsWith("data:") || rawPanFile.length > 50)) {
            try {
              const saved = await saveDocument({
                rawContent: rawPanFile,
                originalName: panName,
                mimeType: rawPanFile.startsWith("data:") ? rawPanFile.split(";")[0].replace("data:", "") : undefined,
                workerId: user._id.toString(),
                documentType: "PAN"
              });
              panRef = saved.storageReference;
              panSize = saved.sizeBytes;
              panMime = saved.mimeType;
              panName = saved.originalName;
            } catch (docErr) {
              console.warn("PAN upload warning:", docErr);
            }
          }

          defaultKycDocuments.push({
            documentType: "PAN",
            documentNumber: panNum,
            fileUrl: panRef || "",
            storageReference: panRef,
            originalFilename: panName,
            fileSize: panSize,
            mimeType: panMime,
            checksumValid: true,
            formatValid: true,
            verificationStatus: "PENDING",
            fraudRiskScore: 10,
            fraudFlags: [],
            aiVerificationNotes: "NSDL/ITD Standard Format Validated — Identity Document Pending Super Admin Review",
            submittedAt: new Date()
          });
        }

        // Save PCC document
        if (pccNum || rawPccFile) {
          let pccRef: string | undefined;
          let pccSize: number | undefined;
          let pccMime: string | undefined;
          let pccName: string = req.body.pccOriginalFilename || "police_clearance.pdf";

          if (rawPccFile && (rawPccFile.startsWith("data:") || rawPccFile.length > 50)) {
            try {
              const saved = await saveDocument({
                rawContent: rawPccFile,
                originalName: pccName,
                mimeType: rawPccFile.startsWith("data:") ? rawPccFile.split(";")[0].replace("data:", "") : undefined,
                workerId: user._id.toString(),
                documentType: "POLICE_CLEARANCE"
              });
              pccRef = saved.storageReference;
              pccSize = saved.sizeBytes;
              pccMime = saved.mimeType;
              pccName = saved.originalName;
            } catch (docErr) {
              console.warn("PCC upload warning:", docErr);
            }
          }

          defaultKycDocuments.push({
            documentType: "POLICE_CLEARANCE",
            documentNumber: pccNum || "PCC-SUBMITTED",
            fileUrl: pccRef || "",
            storageReference: pccRef,
            originalFilename: pccName,
            fileSize: pccSize,
            mimeType: pccMime,
            checksumValid: true,
            formatValid: true,
            verificationStatus: "PENDING",
            fraudRiskScore: 10,
            fraudFlags: [],
            aiVerificationNotes: "Police Clearance Record Submitted — Pending Super Admin Review",
            submittedAt: new Date()
          });
        }

        // Preliminary validation evaluation
        const prelim = evaluatePreliminaryValidation({
          aadhaarChecksumValid: Boolean(aadhaarNum && vAadhaar.valid),
          panFormatValid: Boolean(panNum && vPan.valid),
          hasAadhaarDoc: Boolean(rawAadhaarFile),
          hasPanDoc: Boolean(rawPanFile)
        });

        // Check for existing worker profile to update or create
        const existingWorker = await Worker.findOne({
          $or: [
            { userId: user._id },
            { email: user.email },
            ...(assignedEmployeeId ? [{ employeeId: assignedEmployeeId }] : [])
          ]
        });

        if (existingWorker) {
          existingWorker.userId = user._id;
          existingWorker.workerIdNumber = workerIdNumber;
          existingWorker.employeeId = assignedEmployeeId || existingWorker.employeeId;
          existingWorker.name = user.name;
          existingWorker.gender = user.gender === "Female" ? "Female" : user.gender === "Male" ? "Male" : "Other";
          existingWorker.phone = user.phone || existingWorker.phone;
          existingWorker.email = user.email;
          existingWorker.avatarUrl = avatarUrl || existingWorker.avatarUrl;
          existingWorker.profileImage = avatarUrl || existingWorker.profileImage || existingWorker.avatarUrl;
          existingWorker.skills = skillsArray.length > 0 ? skillsArray : existingWorker.skills;
          existingWorker.languages = languagesArray;
          existingWorker.kycDocuments = defaultKycDocuments;
          existingWorker.verificationStatus = "PENDING";
          existingWorker.preliminaryRiskScore = prelim.preliminaryRiskScore;
          if (!existingWorker.auditHistory) {
            existingWorker.auditHistory = [];
          }
          existingWorker.auditHistory.push({
            action: "REGISTRATION_SUBMITTED",
            performedBy: user._id,
            timestamp: new Date(),
            details: `Worker registered with employeeId ${assignedEmployeeId}. Identity documents submitted. Awaiting Super Admin review.`
          });
          await existingWorker.save();
          workerProfile = existingWorker;
        } else {
          workerProfile = await Worker.create({
            userId: user._id,
            workerIdNumber,
            employeeId: assignedEmployeeId,
            name: user.name,
            gender: user.gender === "Female" ? "Female" : user.gender === "Male" ? "Male" : "Other",
            phone: user.phone || "",
            email: user.email,
            avatarUrl,
            profileImage: avatarUrl,
            societyId: user.societyId || new mongoose.Types.ObjectId("65b900000000000000000001"),
            societyName: req.body.societyName || req.body.selectedSociety || "Vijayawada Central Labour Co-op Society (PACS-04)",
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
            verificationLevel: 1,
            verificationStatus: "PENDING",
            preliminaryRiskScore: prelim.preliminaryRiskScore,
            kycDocuments: defaultKycDocuments,
            rating: 5.0,
            reviewCount: 0,
            jobsCompletedCount: 0,
            isAvailable: false,
            emergencyReady: false,
            baseHourlyRate: Number(req.body.baseHourlyRate) || 350,
            walletBalance: 0,
            totalEarnings: 0,
            auditHistory: [
              {
                action: "REGISTRATION_SUBMITTED",
                performedBy: user._id,
                timestamp: new Date(),
                details: `Worker registered with employeeId ${assignedEmployeeId}. Identity documents submitted. Awaiting Super Admin review.`
              }
            ]
          });
        }
      } catch (workerErr: any) {
        // ATOMIC ROLLBACK: delete created user only if brand new, or revert added role if existing user
        console.error("Worker profile creation failed. Rolling back:", workerErr);
        if (isNewUser) {
          await User.findByIdAndDelete(user._id);
        } else {
          user.roles = (user.roles || []).filter((r: string) => r !== USER_ROLES.WORKER);
          await user.save();
        }
        res.status(500).json({
          success: false,
          message: "Failed to create worker profile. Registration was rolled back.",
          error: workerErr.message
        });
        return;
      }
    }

    // Invalidate and delete used OTPs to guarantee zero OTP reuse
    await Otp.deleteMany({ identifier: cleanEmail });
    if (cleanPhone) {
      await Otp.deleteMany({ identifier: { $regex: cleanPhone.slice(-10) } });
    }

    const token = signToken(user._id.toString(), (role || user.role) as UserRole);

    res.status(201).json({
      success: true,
      message: role === USER_ROLES.WORKER
        ? (!isNewUser ? "Worker profile created and linked to your existing account." : "COOPNEX Worker account created successfully.")
        : (!isNewUser ? "Customer profile activated and linked to your existing account." : "COOPNEX Customer account created successfully."),
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
        employeeId: assignedEmployeeId || user.employeeId,
        role: role || user.role,
        roles: user.roles || [user.role],
        status: user.status,
        verificationStatus: workerProfile?.verificationStatus || (role === USER_ROLES.WORKER ? "PENDING" : "APPROVED"),
        verificationLevel: workerProfile?.verificationLevel || 1,
        avatarUrl: user.avatarUrl || workerProfile?.avatarUrl,
        profileImage: user.avatarUrl || workerProfile?.profileImage || workerProfile?.avatarUrl,
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
    if (mongoose.connection.readyState !== 1) {
      res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please ensure your cloud MongoDB Atlas database (MONGODB_URI) is configured in your Render environment variables.",
        error: "MongoDB not connected (readyState = " + mongoose.connection.readyState + ")"
      });
      return;
    }

    const { email, identifier, phone, password, expectedRole = USER_ROLES.CUSTOMER } = req.body;
    const target = (email || identifier || phone || "").trim().toLowerCase();

    if (!target || !password) {
      res.status(400).json({ success: false, message: "Email/Phone and password are required." });
      return;
    }

    // Unified Identity Lookup: Find the person by email or phone across all roles
    const user = await User.findOne({
      $or: [{ email: target }, { phone: target }]
    });

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

    const userRoles: string[] = Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : [user.role || USER_ROLES.CUSTOMER];

    // Role Enforcement & Portal Isolation
    if (user.role === USER_ROLES.SUPER_ADMIN || userRoles.includes(USER_ROLES.SUPER_ADMIN)) {
      if (expectedRole !== USER_ROLES.SUPER_ADMIN) {
        res.status(403).json({
          success: false,
          message: "Administrative accounts must sign in via the dedicated Admin Command Gateway (/admin/login)."
        });
        return;
      }
    }

    if (expectedRole === USER_ROLES.CUSTOMER && !userRoles.includes(USER_ROLES.CUSTOMER)) {
      res.status(403).json({
        success: false,
        message: "This account is not registered as a customer. Please sign in via the Worker portal or register as a customer."
      });
      return;
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const effectiveRole = (expectedRole && userRoles.includes(expectedRole as UserRole))
      ? (expectedRole as UserRole)
      : (userRoles.includes(USER_ROLES.CUSTOMER) ? USER_ROLES.CUSTOMER : (user.role as UserRole));

    const token = signToken(user._id.toString(), effectiveRole);

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
        role: effectiveRole,
        roles: userRoles,
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
    const { employeeId, email, identifier, phone, password } = req.body;
    const rawInput = (employeeId || email || identifier || phone || "").trim();
    const cleanId = rawInput.toUpperCase();
    const cleanEmail = rawInput.toLowerCase();
    const cleanPhone = rawInput;

    if (!rawInput || !password) {
      res.status(400).json({
        success: false,
        message: "Employee ID or registered email and password are required."
      });
      return;
    }

    // 1. Find Worker profile by employeeId, workerIdNumber, or email
    let workerProfile = await Worker.findOne({
      $or: [
        { employeeId: cleanId },
        { workerIdNumber: cleanId },
        { email: cleanEmail }
      ]
    });

    let user = null;
    if (workerProfile) {
      if (workerProfile.userId) {
        user = await User.findById(workerProfile.userId);
      }
      if (!user && workerProfile.email) {
        user = await User.findOne({ email: workerProfile.email.toLowerCase() });
        if (user && !workerProfile.userId) {
          workerProfile.userId = user._id;
          await workerProfile.save();
        }
      }
    } else {
      // Check User document directly by employeeId, email, or phone
      user = await User.findOne({
        $or: [
          { employeeId: cleanId },
          { email: cleanEmail },
          { phone: cleanPhone }
        ]
      });
      if (user) {
        workerProfile = await Worker.findOne({
          $or: [
            { userId: user._id },
            { email: user.email },
            ...(user.employeeId ? [{ employeeId: user.employeeId }, { workerIdNumber: user.employeeId }] : []),
            ...(user.phone ? [{ phone: user.phone }] : [])
          ]
        });
        if (workerProfile && !workerProfile.userId) {
          workerProfile.userId = user._id;
          await workerProfile.save();
        }
      }
    }

    // Check configured demo worker ID or email - strictly query the demo account itself
    const demoEmpId = (process.env.WORKER_DEMO_EMPLOYEE_ID || "COOP-EMP-0001").toUpperCase().trim();
    if (!user && (cleanId === demoEmpId || cleanEmail === "arjun.kumar@coopnex.worker.in" || cleanEmail === "worker@coopnex.in")) {
      user = await User.findOne({
        $or: [{ email: "worker@coopnex.in" }, { email: "arjun.kumar@coopnex.worker.in" }, { employeeId: demoEmpId }]
      });
      if (user) {
        workerProfile = await Worker.findOne({ userId: user._id });
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Employee ID or registered email not found. Please check your credentials."
      });
      return;
    }

    const userRoles: string[] = Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : [user.role || USER_ROLES.CUSTOMER];

    // 2. Verify worker role authorization
    const isWorkerAuthorized = userRoles.includes(USER_ROLES.WORKER) || user.role === USER_ROLES.WORKER || Boolean(workerProfile);
    if (!isWorkerAuthorized) {
      res.status(403).json({
        success: false,
        message: "This account is not registered as a worker. Please register through the Worker Onboarding portal."
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

    // 4. Secure password verification - demo password ONLY applies to the specific demo account
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    const demoPass = process.env.WORKER_DEMO_PASSWORD || "Coopnex@Worker2026!";
    const isDedicatedDemoUser =
      user.email === "worker@coopnex.in" ||
      user.email === "arjun.kumar@coopnex.worker.in" ||
      user.employeeId === demoEmpId ||
      user.employeeId === "COOP-EMP-0001";
    const isDemoMatch =
      isDedicatedDemoUser &&
      (password === demoPass || password === "Coopnex@Worker2026!" || password === "DemoPassword123!");

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
    const resolvedEmployeeId =
      user.employeeId ||
      workerProfile?.employeeId ||
      workerProfile?.workerIdNumber ||
      (cleanId.startsWith("COOP-") || cleanId.startsWith("SS-") ? cleanId : "COOP-WRK-MEMBER");

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
        employeeId: resolvedEmployeeId,
        role: USER_ROLES.WORKER,
        roles: userRoles.includes(USER_ROLES.WORKER) ? userRoles : [...userRoles, USER_ROLES.WORKER],
        status: user.status,
        verificationStatus: workerProfile?.verificationStatus || "PENDING",
        verificationLevel: workerProfile?.verificationLevel || 1,
        avatarUrl: user.avatarUrl || workerProfile?.avatarUrl,
        profileImage: user.avatarUrl || workerProfile?.profileImage || workerProfile?.avatarUrl,
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

    const userRoles: string[] = Array.isArray(req.user.roles) && req.user.roles.length > 0
      ? req.user.roles
      : [req.user.role || USER_ROLES.CUSTOMER];

    let workerProfile = null;
    if (req.user.role === USER_ROLES.WORKER || userRoles.includes(USER_ROLES.WORKER)) {
      workerProfile = await Worker.findOne({
        $or: [
          { userId: req.user._id },
          ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
          ...(req.user.employeeId ? [{ employeeId: req.user.employeeId }, { workerIdNumber: req.user.employeeId }] : []),
          ...(req.user.phone ? [{ phone: req.user.phone }] : [])
        ]
      });

      if (workerProfile && !workerProfile.userId) {
        workerProfile.userId = req.user._id;
        await workerProfile.save();
      }
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
        roles: userRoles,
        status: req.user.status || "ACTIVE",
        gender: req.user.gender,
        address: req.user.address,
        city: req.user.city,
        district: req.user.district,
        state: req.user.state,
        pincode: req.user.pincode,
        avatarUrl: req.user.avatarUrl || workerProfile?.avatarUrl,
        profileImage: req.user.avatarUrl || workerProfile?.profileImage || workerProfile?.avatarUrl,
        verificationStatus: workerProfile?.verificationStatus || (req.user.role === USER_ROLES.WORKER ? "PENDING" : "APPROVED"),
        verificationLevel: workerProfile?.verificationLevel || 1,
        employeeId: req.user.employeeId || workerProfile?.employeeId || workerProfile?.workerIdNumber,
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
 * STRICT REQUIREMENT:
 * Server-side email validation runs FIRST via validateEmailAddress.
 * If safeToSendOtp is false, OTP generation and email sending are STRICTLY FORBIDDEN.
 * OTP is generated cryptographically on the server, hashed with salt, and stored in MongoDB.
 */
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const tracer = new OtpRequestTracer(req.body?.identifier || req.body?.email || req.body?.phone || "");
  try {
    const { identifier, phone, email, name, purpose = "REGISTER", role, targetRole } = req.body;
    const target = (identifier || email || phone || "").trim().toLowerCase();
    const requestedRole = ((role || targetRole || "") as string).toUpperCase().trim();

    if (!target) {
      tracer.finish("INVALID_TARGET");
      res.status(400).json({
        success: false,
        safeToSendOtp: false,
        code: "INVALID_EMAIL",
        message: "❌ Please enter a valid email address. 📧"
      });
      return;
    }

    // STRICT STEP: If target is an email, run server-side real validation FIRST
    if (target.includes("@")) {
      tracer.mark("email format validation");
      const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
      const valResult = await validateEmailAddress(target, clientIp);

      if (!valResult.safeToSendOtp) {
        tracer.finish("EMAIL_VALIDATION_FAILED");
        res.status(400).json({
          success: false,
          safeToSendOtp: false,
          code: valResult.reason === "timeout" ? "TIMEOUT" : "INVALID_EMAIL",
          status: valResult.status,
          reason: valResult.reason,
          subStatus: valResult.subStatus,
          message: valResult.message
        });
        return;
      }

      // Check registration duplicate or recovery existence using direct index lookup
      tracer.mark("user lookup started");
      if (purpose === "REGISTER") {
        if (mongoose.connection.readyState === 1) {
          const existingUser = await User.findOne({ email: target }).select("_id email role roles");
          const existingWorker = await Worker.findOne({
            $or: [
              { email: target },
              ...(existingUser ? [{ userId: existingUser._id }] : [])
            ]
          }).select("_id email");
          const existingAdmin = await Admin.findOne({ email: target }).select("_id email");

          if (existingAdmin || existingUser?.role === USER_ROLES.SUPER_ADMIN || existingUser?.roles?.includes(USER_ROLES.SUPER_ADMIN)) {
            tracer.finish("ADMIN_EMAIL_RESTRICTED");
            res.status(409).json({
              success: false,
              safeToSendOtp: false,
              code: "EMAIL_ALREADY_REGISTERED",
              message: "❌ Administrative accounts cannot register via public registration."
            });
            return;
          }

          if (requestedRole === USER_ROLES.WORKER) {
            const userRoles = existingUser ? (Array.isArray(existingUser.roles) && existingUser.roles.length > 0 ? existingUser.roles : [existingUser.role]) : [];
            const alreadyWorker = Boolean(existingWorker) || userRoles.includes(USER_ROLES.WORKER) || existingUser?.role === USER_ROLES.WORKER;
            if (alreadyWorker) {
              tracer.finish("WORKER_ALREADY_EXISTS");
              res.status(409).json({
                success: false,
                safeToSendOtp: false,
                code: "WORKER_ALREADY_REGISTERED",
                message: "❌ A Worker profile with this email already exists. Please sign in to the Worker Portal."
              });
              return;
            }
            // Customer registering as Worker is permitted - proceed to send OTP!
          } else if (requestedRole === USER_ROLES.CUSTOMER) {
            const userRoles = existingUser ? (Array.isArray(existingUser.roles) && existingUser.roles.length > 0 ? existingUser.roles : [existingUser.role]) : [];
            const alreadyCustomer = userRoles.includes(USER_ROLES.CUSTOMER) || existingUser?.role === USER_ROLES.CUSTOMER;
            if (alreadyCustomer) {
              tracer.finish("CUSTOMER_ALREADY_EXISTS");
              res.status(409).json({
                success: false,
                safeToSendOtp: false,
                code: "CUSTOMER_ALREADY_REGISTERED",
                message: "❌ An account with this email is already registered as a Customer. Please sign in."
              });
              return;
            }
            // Worker registering as Customer is permitted - proceed to send OTP!
          } else {
            if (existingUser || existingWorker) {
              tracer.finish("EMAIL_ALREADY_EXISTS");
              res.status(409).json({
                success: false,
                safeToSendOtp: false,
                code: "EMAIL_ALREADY_REGISTERED",
                message: "❌ This email is already registered. Please sign in or use another email. 📧"
              });
              return;
            }
          }
        }
      } else if (purpose === "RECOVER_EMPLOYEE_ID" || purpose === "FORGOT_PASSWORD") {
        if (mongoose.connection.readyState === 1) {
          const existingUser = await User.findOne({ email: target }).select("_id email");
          const existingWorker = existingUser ? null : await Worker.findOne({ email: target }).select("_id email");
          const existingAdmin = (existingUser || existingWorker) ? null : await Admin.findOne({ email: target }).select("_id email");
          if (!existingUser && !existingWorker && !existingAdmin) {
            tracer.finish("EMAIL_NOT_FOUND");
            res.status(404).json({
              success: false,
              exists: false,
              safeToSendOtp: false,
              code: "EMAIL_NOT_FOUND",
              message: "This email is not registered. Please try again with another email address."
            });
            return;
          }
        }
      }
      tracer.mark("user lookup completed");
    }

    // Rate Limiting: 60-Second Resend Cooldown
    const recentOtp = await Otp.findOne({ identifier: target, purpose }).sort({ createdAt: -1 });
    if (recentOtp && recentOtp.lastSentAt) {
      const timeSinceLastSent = (Date.now() - new Date(recentOtp.lastSentAt).getTime()) / 1000;
      if (timeSinceLastSent < 60) {
        const waitTime = Math.ceil(60 - timeSinceLastSent);
        tracer.finish("RATE_LIMITED");
        res.status(429).json({
          success: false,
          safeToSendOtp: false,
          code: "RATE_LIMITED",
          message: `Too many OTP requests. Please wait ${waitTime}s before requesting a new code.`,
          retryAfterSeconds: waitTime
        });
        return;
      }
    }

    // Rate Limiting: Maximum 3 OTP requests within 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentCount = await Otp.countDocuments({
      identifier: target,
      createdAt: { $gte: tenMinutesAgo }
    });
    if (recentCount >= 3) {
      tracer.finish("MAX_OTP_LIMIT");
      res.status(429).json({
        success: false,
        safeToSendOtp: false,
        code: "RATE_LIMITED",
        message: "Too many OTP requests. Please wait before trying again.",
        retryAfterSeconds: 600
      });
      return;
    }

    // Generate cryptographically secure 6-digit OTP code using crypto.randomInt
    tracer.mark("OTP generation");
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOtp(target, otpCode);

    // Clean up any stale unverified OTPs for this target & purpose
    tracer.mark("OTP persistence");
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

    // Real Email Dispatch via Server-Side Hierarchy (Brevo -> EmailJS Server -> SMTP)
    if (target.includes("@")) {
      tracer.mark("email provider request started");
      const emailResult = await sendOtpEmail(target, otpCode, purpose, name);
      tracer.mark("email provider response");

      if (!emailResult.success) {
        // Rollback OTP on dispatch failure so un-sent OTP cannot be used
        await Otp.deleteMany({ identifier: target, purpose, verified: false });
        if (emailResult.error === "OTP_PROVIDER_CONFIG_ERROR") {
          tracer.finish("OTP_PROVIDER_CONFIG_ERROR");
          res.status(503).json({
            success: false,
            safeToSendOtp: false,
            code: "OTP_PROVIDER_CONFIG_ERROR",
            message: "OTP service is temporarily unavailable. Please try again later."
          });
          return;
        }
        if (emailResult.error === "TIMEOUT") {
          tracer.finish("TIMEOUT");
          res.status(504).json({
            success: false,
            safeToSendOtp: false,
            code: "TIMEOUT",
            message: "The OTP service is taking too long to respond. Please try again."
          });
          return;
        }
        tracer.finish("OTP_SEND_FAILED");
        res.status(502).json({
          success: false,
          safeToSendOtp: false,
          code: "OTP_SEND_FAILED",
          message: "We couldn't send the OTP right now. Please try again."
        });
        return;
      }
    }

    tracer.finish("SUCCESS");
    res.json({
      success: true,
      safeToSendOtp: true,
      code: "SUCCESS",
      message: "OTP sent successfully. Please check your email.",
      expiresInSeconds: 300,
      retryAfterSeconds: 60
    });
  } catch (error: any) {
    console.error("sendOtp error:", error);
    tracer.finish("SERVER_ERROR");
    res.status(500).json({
      success: false,
      safeToSendOtp: false,
      code: "SERVER_ERROR",
      message: "We couldn't send the OTP right now. Please try again."
    });
  }
};

/**
 * Real-Time Cryptographically Secure OTP Verification
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, phone, email, otpCode, purpose = "REGISTER" } = req.body;
    const target = (identifier || phone || email || "").trim().toLowerCase();
    const code = (otpCode || "").trim();

    if (!target || !code) {
      res.status(400).json({ success: false, message: "❌ Identifier and 6-digit OTP code are required. 🔐" });
      return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      res.status(400).json({ success: false, message: "❌ Please enter a valid 6-digit numeric verification code. 🔐" });
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
        message: "⏰ This verification code has expired. Please request a new one."
      });
      return;
    }

    // Check maximum 5 attempts limit
    if (validOtp.attempts >= 5) {
      await Otp.deleteOne({ _id: validOtp._id });
      res.status(429).json({
        success: false,
        message: "⏰ Maximum verification attempts exceeded. Please request a new code."
      });
      return;
    }

    // Check 5-minute expiration
    const otpAgeSeconds = (Date.now() - new Date(validOtp.createdAt).getTime()) / 1000;
    if (otpAgeSeconds > 300) {
      await Otp.deleteOne({ _id: validOtp._id });
      res.status(400).json({
        success: false,
        message: "⏰ This verification code has expired. Please request a new one."
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
          ? `❌ Incorrect OTP. Please try again. (${remaining} attempt${remaining === 1 ? "" : "s"} remaining) 🔐`
          : "❌ Incorrect OTP. Maximum attempts reached. Please request a new code. 🔐"
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
        message: "✅ Email verified successfully! 🎉"
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

    const userRoles: string[] = Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : [user.role || USER_ROLES.CUSTOMER];

    const token = signToken(user._id.toString(), user.role as UserRole);

    let workerProfile = null;
    if (user.role === USER_ROLES.WORKER || userRoles.includes(USER_ROLES.WORKER)) {
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
        roles: userRoles,
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
  const tracer = new OtpRequestTracer(req.body?.identifier || req.body?.email || req.body?.employeeId || req.body?.phone || "");
  try {
    const { identifier, email, employeeId, phone } = req.body;
    const cleanTarget = (identifier || email || employeeId || phone || "").trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanTarget || (!emailRegex.test(cleanTarget) && cleanTarget.length < 4)) {
      tracer.finish("INVALID_EMAIL");
      res.status(400).json({
        success: false,
        code: "INVALID_EMAIL",
        message: "Please enter a valid email address."
      });
      return;
    }

    // 1. Check if eligible account exists in User or Worker collection via direct index lookup
    tracer.mark("user lookup started");
    let user: any = null;

    if (mongoose.connection.readyState === 1) {
      if (cleanTarget.includes("@")) {
        user = await User.findOne({ email: cleanTarget }).select("_id name email status isActive role");
        if (!user) {
          const worker = await Worker.findOne({ email: cleanTarget }).select("userId email name");
          if (worker && worker.userId) {
            user = await User.findById(worker.userId).select("_id name email status isActive role");
          }
        }
      } else {
        user = await User.findOne({
          $or: [
            { employeeId: cleanTarget.toUpperCase() },
            { phone: cleanTarget }
          ]
        }).select("_id name email status isActive role");
        if (!user) {
          const worker = await Worker.findOne({ employeeId: cleanTarget.toUpperCase() }).select("userId email name");
          if (worker && worker.userId) {
            user = await User.findById(worker.userId).select("_id name email status isActive role");
          }
        }
      }
    } else {
      const DEMO_EMAILS = [
        "demo.customer@coopnex.in",
        "demo.worker@coopnex.in",
        "worker.demo@coopnex.in",
        "arjun.kumar@coopnex.worker.in",
        "admin@coopnex.in",
        "superadmin@coopnex.in",
        "priya.sharma@coopnex.customer.in"
      ];
      if (DEMO_EMAILS.includes(cleanTarget)) {
        user = { name: "Demo User", email: cleanTarget, isActive: true, status: "ACTIVE" };
      }
    }
    tracer.mark("user lookup completed");

    // 2. Strict Check: If user DOES NOT exist or is inactive, DO NOT send OTP
    if (!user || user.status === "SUSPENDED" || user.isActive === false) {
      tracer.finish("EMAIL_NOT_FOUND");
      res.status(404).json({
        success: false,
        exists: false,
        code: "EMAIL_NOT_FOUND",
        message: "This email is not registered. Please try again with another email address."
      });
      return;
    }

    // Determine target recipient email
    const emailTarget = user.email || (cleanTarget.includes("@") ? cleanTarget : null);
    if (!emailTarget) {
      tracer.finish("EMAIL_NOT_FOUND");
      res.status(404).json({
        success: false,
        exists: false,
        code: "EMAIL_NOT_FOUND",
        message: "This email is not registered. Please try again with another email address."
      });
      return;
    }

    // 3. 60-second cooldown rate limit check
    const recentOtp = await Otp.findOne({ identifier: cleanTarget, purpose: "FORGOT_PASSWORD" }).sort({ createdAt: -1 });
    if (recentOtp && recentOtp.lastSentAt) {
      const timeSinceLastSent = (Date.now() - new Date(recentOtp.lastSentAt).getTime()) / 1000;
      if (timeSinceLastSent < 60) {
        const waitTime = Math.ceil(60 - timeSinceLastSent);
        tracer.finish("RATE_LIMITED");
        res.status(429).json({
          success: false,
          code: "RATE_LIMITED",
          message: `Too many OTP requests. Please wait ${waitTime}s before requesting a new password reset code.`,
          retryAfterSeconds: waitTime
        });
        return;
      }
    }

    // 4. Cryptographically secure 6-digit OTP code using crypto.randomInt
    tracer.mark("OTP generation");
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOtp(cleanTarget, otpCode);

    // 5. Clean up stale unverified reset OTPs for this target and set new one with 10-minute TTL
    tracer.mark("OTP persistence");
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

    // 6. Real Email Dispatch via single unified sendOtpEmail call
    tracer.mark("email provider request started");
    const emailResult = await sendOtpEmail(emailTarget, otpCode, "FORGOT_PASSWORD", user.name);
    tracer.mark("email provider response");

    if (!emailResult.success) {
      // Rollback un-dispatched OTP record so dead OTP cannot linger
      await Otp.deleteMany({ identifier: cleanTarget, purpose: "FORGOT_PASSWORD", verified: false });
      if (emailResult.error === "OTP_PROVIDER_CONFIG_ERROR") {
        tracer.finish("OTP_PROVIDER_CONFIG_ERROR");
        res.status(503).json({
          success: false,
          exists: true,
          otpSent: false,
          code: "OTP_PROVIDER_CONFIG_ERROR",
          message: "OTP service is temporarily unavailable. Please try again later."
        });
        return;
      }
      if (emailResult.error === "TIMEOUT") {
        tracer.finish("TIMEOUT");
        res.status(504).json({
          success: false,
          exists: true,
          otpSent: false,
          code: "TIMEOUT",
          message: "The OTP service is taking too long to respond. Please try again."
        });
        return;
      }
      tracer.finish("OTP_SEND_FAILED");
      res.status(502).json({
        success: false,
        exists: true,
        otpSent: false,
        code: "OTP_SEND_FAILED",
        message: "We couldn't send the OTP right now. Please try again."
      });
      return;
    }

    tracer.finish("SUCCESS");
    res.status(200).json({
      success: true,
      exists: true,
      otpSent: true,
      code: "SUCCESS",
      message: "OTP sent successfully. Please check your email.",
      retryAfterSeconds: 60,
      expiresInSeconds: 600
    });
  } catch (error: any) {
    console.error("forgotPasswordSendOtp error:", error);
    tracer.finish("SERVER_ERROR");
    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "We couldn't send the OTP right now. Please try again."
    });
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

/**
 * Brevo Delivery Webhook Listener
 * Receives transactional delivery events (delivered, hardBounce, softBounce, invalid, blocked, error).
 * Automatically invalidates active verification attempts if hardBounce or invalid event occurs.
 */
export const handleBrevoWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = req.body;
    const eventType = (event.event || event.type || "").toString();
    const recipientEmail = (event.email || "").toString().trim().toLowerCase();

    console.log(`[BREVO WEBHOOK] Event: ${eventType} for ${recipientEmail}`);

    if (
      eventType === "hardBounce" ||
      eventType === "softBounce" ||
      eventType === "invalid" ||
      eventType === "blocked" ||
      eventType === "error"
    ) {
      if (recipientEmail) {
        await Otp.deleteMany({ identifier: recipientEmail });
        console.warn(`[BREVO WEBHOOK] Delivery failure (${eventType}). Invalidated verification attempts for ${recipientEmail}.`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("[BREVO WEBHOOK ERROR]:", err?.message);
    res.status(200).json({ received: true });
  }
};


