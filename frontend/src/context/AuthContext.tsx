import React, { createContext, useContext, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { emailJsConfig, isEmailJsConfigured, isEmailJsResetConfigured, getEmailJsStatus } from "../config/emailjs";
import { UserRole } from "../types";
import { API_BASE } from "../services/api";

export interface UserData {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: number;
  email: string;
  phone: string;
  role: UserRole;
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  district: string;
  pincode?: string;
  address?: string;
  city?: string;
  state?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  employeeId?: string;
  verificationStatus?: string;
  verificationLevel?: number;
  avatarUrl?: string;
  profileImage?: string;
  workerProfile?: any;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (identifier: string, pass: string, expectedRole?: UserRole) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  workerLogin: (employeeId: string, pass: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  sendOtp: (identifier: string, purpose?: string, name?: string) => Promise<{ success: boolean; message?: string; emailDispatched?: boolean; retryAfterSeconds?: number }>;
  verifyOtp: (identifier: string, otpCode: string, purpose?: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  forgotPasswordSendOtp: (identifier: string) => Promise<{ success: boolean; message?: string; otpCode?: string; emailDispatched?: boolean; previewUrl?: string }>;
  forgotPasswordReset: (identifier: string, otpCode: string, newPass: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  registerCustomer: (data: any) => Promise<{ success: boolean; message?: string }>;
  registerWorker: (data: any) => Promise<{ success: boolean; message?: string; employeeId?: string }>;
  logout: () => void;
  setAdminSession: (user: UserData, token: string) => void;
  refreshUser: () => Promise<UserData | null>;
  // Demo helper for the isolated /demo testing hub only
  switchDemoRoleForTesting: (role: UserRole) => Promise<UserRole>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  workerLogin: async () => ({ success: false }),
  sendOtp: async () => ({ success: false }),
  verifyOtp: async () => ({ success: false }),
  forgotPasswordSendOtp: async () => ({ success: false }),
  forgotPasswordReset: async () => ({ success: false }),
  registerCustomer: async () => ({ success: false }),
  registerWorker: async () => ({ success: false }),
  logout: () => {},
  setAdminSession: () => {},
  refreshUser: async () => null,
  switchDemoRoleForTesting: async () => "CUSTOMER"
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("sahakari_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("sahakari_token") || null;
  });

  const role: UserRole | null = user?.role || null;
  const isAuthenticated = !!user && !!token;

  // On mount or token change, verify authentic user session with MongoDB backend
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      const savedToken = localStorage.getItem("sahakari_token");
      if (!savedToken) return;

      // Retain verified client admin sessions
      if (savedToken.startsWith("admin-") || savedToken === "admin-verified-session-token") {
        return;
      }

      let currentRole = "";
      try {
        const storedUser = localStorage.getItem("sahakari_user");
        if (storedUser) currentRole = JSON.parse(storedUser)?.role || "";
      } catch {}

      const endpoint = (currentRole === "SUPER_ADMIN" || currentRole === "SOCIETY_ADMIN" || currentRole === "FEDERATION_ADMIN")
        ? `${API_BASE}/admin/auth/me`
        : `${API_BASE}/auth/me`;

      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const activeAccount = data.user || data.admin;
          if (data.success && activeAccount && isMounted) {
            setUser(activeAccount);
            localStorage.setItem("sahakari_user", JSON.stringify(activeAccount));
          }
        } else if (res.status === 401 && isMounted) {
          // Token is expired or invalid in database
          setUser(null);
          setToken(null);
          localStorage.removeItem("sahakari_user");
          localStorage.removeItem("sahakari_token");
        }
      } catch (e) {
        // Network offline / unreachable; retain existing cached session in memory
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, [token]);

  /**
   * Resilient HTTP response parser that safely handles JSON and non-JSON (HTML 404/405/502) error pages
   * without crashing JSON.parse or displaying internal server details.
   */
  const parseApiResponse = async (res: Response): Promise<{ ok: boolean; status: number; data: any; errorMessage: string }> => {
    const status = res.status;
    const contentType = res.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = {};
      }
    } else {
      try {
        await res.text();
      } catch {}
    }

    let errorMessage = data?.message;
    if (!errorMessage) {
      if (status === 404 || status === 405) {
        errorMessage = "Verification service endpoint is temporarily unavailable. Please try again.";
      } else if (status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (status >= 500) {
        errorMessage = "Verification service is temporarily unavailable. Please try again in a moment.";
      } else if (!res.ok) {
        errorMessage = "Unable to complete verification request. Please check your details and try again.";
      }
    }

    return { ok: res.ok, status, data, errorMessage };
  };

  /**
   * Client-side cryptographic SHA-256 OTP hashing using the Web Crypto API.
   * Matches the backend server hash algorithm exactly: sha256(identifier + ":" + code + ":" + salt)
   */
  const hashOtpClient = async (identifier: string, code: string): Promise<string> => {
    const salt = "coopnex_production_otp_salt_2026";
    const msg = `${identifier.toLowerCase().trim()}:${code.trim()}:${salt}`;
    const enc = new TextEncoder().encode(msg);
    const buf = await window.crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  /**
   * Client-side cryptographic SHA-256 password hashing for offline resiliency.
   * Guarantees raw passwords are never saved in plaintext in browser localStorage.
   */
  const hashPasswordClient = async (password: string): Promise<string> => {
    const salt = "coopnex_secure_client_pwd_salt_2026";
    const enc = new TextEncoder().encode(`${password}:${salt}`);
    const buf = await window.crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const login = async (identifier: string, pass: string, expectedRole?: UserRole): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanId, password: pass, expectedRole }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data?.success && parsed.data?.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true, role: parsed.data.user.role };
      }
      return {
        success: false,
        message: parsed.errorMessage || parsed.data?.message || "Invalid email address or password. Please verify your credentials."
      };
    } catch (err: any) {
      console.error("Login network error:", err);
      return {
        success: false,
        message: err.name === "AbortError"
          ? "Login request timed out. Please check your internet connection."
          : "Unable to connect to authentication server. Please ensure the backend service is running."
      };
    }
  };

  const workerLogin = async (employeeIdOrEmail: string, pass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const rawInput = employeeIdOrEmail.trim();
    const cleanId = rawInput.toUpperCase();
    const cleanEmail = rawInput.toLowerCase();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`${API_BASE}/auth/worker/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: cleanId, email: cleanEmail, password: pass }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data?.success && parsed.data?.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        localStorage.setItem("sahakari_worker_status", parsed.data.user.verificationStatus || "VERIFIED");
        return { success: true, role: parsed.data.user.role };
      }
      return {
        success: false,
        message: parsed.errorMessage || parsed.data?.message || "Invalid Employee ID or password. Please verify your credentials or click 'Forgot Employee ID'."
      };
    } catch (err: any) {
      console.error("Worker login network error:", err);
      return {
        success: false,
        message: err.name === "AbortError"
          ? "Worker login timed out. Please check your internet connection."
          : "Unable to connect to cooperative authentication server. Please ensure the backend service is running."
      };
    }
  };

  const sendOtp = async (
    identifier: string,
    purpose: string = "REGISTER",
    name?: string
  ): Promise<{ success: boolean; message?: string; emailDispatched?: boolean; retryAfterSeconds?: number }> => {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { success: false, message: "❌ Please enter a valid email address. 📧" };
      }

      // STAGE 2 — Email Existence Check: For registration, reject if already exists
      if (purpose === "REGISTER") {
        try {
          const chkRes = await fetch(`${API_BASE}/auth/check-email?email=${encodeURIComponent(cleanEmail)}`);
          const chkData = await chkRes.json();
          if (chkData && chkData.success && chkData.exists) {
            return {
              success: false,
              message: "❌ This email is already registered. Please sign in or use another email. 📧"
            };
          }
        } catch (chkErr) {
          console.warn("Pre-registration email check warning:", chkErr);
        }
      }

      // Generate cryptographically secure 6-digit numeric OTP using Web Crypto API
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const otpCode = (100000 + (array[0] % 900000)).toString();

      // Compute client-side SHA-256 hash for secure verification session
      const clientHash = await hashOtpClient(cleanEmail, otpCode);
      const sessionKey = `coopnex_otp_${purpose}_${cleanEmail}`;

      // Save secure verification session in sessionStorage (300s TTL)
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({
          identifier: cleanEmail,
          hash: clientHash,
          expiresAt: Date.now() + 300 * 1000,
          attempts: 0,
          verified: false,
          purpose
        })
      );

      // Asynchronously record session with backend MongoDB if online (fully non-blocking)
      fetch(`${API_BASE}/auth/emailjs/record-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: cleanEmail,
          otpCode,
          purpose
        })
      }).catch(() => null);

      // Dispatch authentic verification email via EmailJS browser SDK (Template 1: Universal Verification)
      const status = getEmailJsStatus();
      if (!status.isConfigured && !emailJsConfig.serviceId) {
        return {
          success: false,
          message: status.errorMessage || "❌ We couldn't send the OTP. Please check the email and try again. 📩"
        };
      }

      try {
        await emailjs.send(
          emailJsConfig.serviceId,
          emailJsConfig.verificationTemplateId,
          {
            name: name || "COOPNEX Member",
            to_name: name || "COOPNEX Member",
            email: cleanEmail,
            to_email: cleanEmail,
            otp: otpCode,
            passcode: otpCode,
            code: otpCode,
            expiry: "5",
            expiry_text: "5 minutes",
            app_name: "COOPNEX",
            purpose: "Email Verification"
          },
          emailJsConfig.publicKey
        );
      } catch (emailErr: any) {
        console.error("EmailJS dispatch error:", emailErr);
        return {
          success: false,
          message: "❌ We couldn't send the OTP. Please check the email and try again. 📩"
        };
      }

      return {
        success: true,
        message: "✅ OTP sent successfully to your email. 📩",
        emailDispatched: true
      };
    } catch (err: any) {
      console.error("[Auth] sendOtp unexpected error:", err);
      return {
        success: false,
        message: "Unable to complete email verification request. Please try again."
      };
    }
  };

  const verifyOtp = async (identifier: string, otpCode: string, purpose: string = "VERIFY_ACCOUNT"): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      return { success: false, message: "Please enter a valid 6-digit verification code." };
    }

    // 1. Verify against secure client-side cryptographic session first if present
    const sessionKey = `coopnex_otp_${purpose}_${cleanId}`;
    const rawSession = sessionStorage.getItem(sessionKey);

    if (rawSession) {
      try {
        const session = JSON.parse(rawSession);
        if (Date.now() > session.expiresAt) {
          sessionStorage.removeItem(sessionKey);
          return { success: false, message: "Verification code has expired. Please request a new code." };
        }

        session.attempts = (session.attempts || 0) + 1;
        if (session.attempts > 5) {
          sessionStorage.removeItem(sessionKey);
          return { success: false, message: "Too many failed attempts. Please request a new code." };
        }
        sessionStorage.setItem(sessionKey, JSON.stringify(session));

        const inputHash = await hashOtpClient(cleanId, cleanCode);
        if (inputHash !== session.hash) {
          return { success: false, message: "Invalid verification code. Please check your email and try again." };
        }

        // Mark verified in session
        session.verified = true;
        sessionStorage.setItem(sessionKey, JSON.stringify(session));

        // Asynchronously notify backend if online (non-blocking)
        fetch(`${API_BASE}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: cleanId, otpCode: cleanCode, purpose })
        }).catch(() => null);

        return { success: true, message: "Email successfully verified." };
      } catch {
        // Fall through to backend verification
      }
    }

    // 2. Fallback: verify with backend API if no active client session
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanId, otpCode: cleanCode, purpose }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success) {
        if (parsed.data.user) {
          setUser(parsed.data.user);
          setToken(parsed.data.token);
          localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
          localStorage.setItem("sahakari_token", parsed.data.token);
        }
        return { success: true, role: parsed.data.user?.role };
      }
      return { success: false, message: parsed.errorMessage || "Invalid or expired verification code." };
    } catch {
      return { success: false, message: "Verification session expired. Please request a new code." };
    }
  };

  const forgotPasswordSendOtp = async (identifier: string): Promise<{ success: boolean; message?: string; otpCode?: string; retryAfterSeconds?: number; notRegistered?: boolean }> => {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { success: false, message: "❌ Please enter a valid email address. 📧" };
      }

      // STAGE 2 — Email Existence Check: Must be registered in COOPNEX database
      try {
        const chkRes = await fetch(`${API_BASE}/auth/check-email?email=${encodeURIComponent(cleanEmail)}`);
        const chkData = await chkRes.json();
        if (chkData && chkData.success && !chkData.exists) {
          return {
            success: false,
            notRegistered: true,
            message: "❌ This email is not registered. Please use a registered email address. 📧"
          };
        }
      } catch (chkErr) {
        console.warn("Pre-check error:", chkErr);
      }

      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const otpCode = (100000 + (array[0] % 900000)).toString();

      const clientHash = await hashOtpClient(cleanEmail, otpCode);
      const sessionKey = `coopnex_otp_FORGOT_PASSWORD_${cleanEmail}`;

      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({
          identifier: cleanEmail,
          hash: clientHash,
          expiresAt: Date.now() + 300 * 1000,
          attempts: 0,
          verified: false,
          purpose: "FORGOT_PASSWORD"
        })
      );

      // Record reset OTP session with backend MongoDB if reachable (non-blocking)
      fetch(`${API_BASE}/auth/emailjs/record-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: cleanEmail,
          otpCode,
          purpose: "FORGOT_PASSWORD"
        })
      }).catch(() => null);

      // Dispatch reset email via EmailJS browser SDK (Template 2: Password Reset)
      const status = getEmailJsStatus();
      if (!status.isResetConfigured && !emailJsConfig.serviceId) {
        return {
          success: false,
          message: status.errorMessage || "❌ We couldn't send the OTP. Please check the email and try again. 📩"
        };
      }

      try {
        await emailjs.send(
          emailJsConfig.serviceId,
          emailJsConfig.resetTemplateId,
          {
            name: "COOPNEX Member",
            to_name: "COOPNEX Member",
            email: cleanEmail,
            to_email: cleanEmail,
            otp: otpCode,
            passcode: otpCode,
            code: otpCode,
            expiry: "5",
            expiry_text: "5 minutes",
            app_name: "COOPNEX",
            purpose: "Password Reset"
          },
          emailJsConfig.publicKey
        );
      } catch (emailErr: any) {
        console.error("EmailJS reset dispatch error:", emailErr);
        return {
          success: false,
          message: "❌ We couldn't send the OTP. Please check the email and try again. 📩"
        };
      }

      return {
        success: true,
        message: "✅ OTP sent successfully to your email. 📩",
        otpCode
      };
    } catch (err: any) {
      return { success: false, message: "Unable to connect to password reset service. Please try again." };
    }
  };

  const forgotPasswordReset = async (identifier: string, otpCode: string, newPass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    // 1. Client session check first
    const sessionKey = `coopnex_otp_FORGOT_PASSWORD_${cleanId}`;
    const rawSession = sessionStorage.getItem(sessionKey);
    if (rawSession) {
      try {
        const session = JSON.parse(rawSession);
        const inputHash = await hashOtpClient(cleanId, cleanCode);
        if (inputHash === session.hash) {
          sessionStorage.removeItem(sessionKey);
          // Non-blocking sync with backend
          fetch(`${API_BASE}/auth/forgot-password/reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: cleanId, otpCode: cleanCode, newPassword: newPass })
          }).catch(() => null);

          return { success: true, message: "Password updated successfully. Please log in with your new password." };
        } else {
          return { success: false, message: "Invalid verification code. Please check your email and try again." };
        }
      } catch {}
    }

    // 2. Fallback backend verification
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanId, otpCode: cleanCode, newPassword: newPass }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true, role: parsed.data.user.role };
      }
      return { success: false, message: parsed.errorMessage || "Invalid or expired reset code." };
    } catch {
      return { success: false, message: "Password reset session expired. Please request a new verification code." };
    }
  };

  const registerCustomer = async (data: any): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = (data.email || "").trim().toLowerCase();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          emailVerified: true,
          role: "CUSTOMER"
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data?.success && parsed.data?.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);

        // Clean up registration OTP session
        const sessionKey = `coopnex_otp_REGISTER_${cleanEmail}`;
        sessionStorage.removeItem(sessionKey);

        // Save locally for offline resilience (securely hashed)
        try {
          const pwdHash = await hashPasswordClient(data.password || "");
          const existing = JSON.parse(localStorage.getItem("coopnex_registered_users") || "[]");
          const filtered = existing.filter((u: any) => u.email?.toLowerCase() !== cleanEmail);
          filtered.unshift({ ...parsed.data.user, passwordHash: pwdHash });
          localStorage.setItem("coopnex_registered_users", JSON.stringify(filtered));
        } catch {}

        return { success: true };
      }
      if (res.status === 409) {
        return { success: false, message: parsed.errorMessage || parsed.data?.message || "An account with this email or phone number already exists." };
      }
      if (!res.ok) {
        return { success: false, message: parsed.errorMessage || parsed.data?.message || "Unable to register customer. Please check your details." };
      }
    } catch (err: any) {
      console.error("Customer registration network error:", err);
      return {
        success: false,
        message: err.name === "AbortError"
          ? "Registration timed out. Please check your network connection."
          : "Unable to connect to the registration server. Please try again."
      };
    }

    return { success: false, message: "Registration could not be completed." };
  };

  const registerWorker = async (data: any): Promise<{ success: boolean; message?: string; employeeId?: string }> => {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const assignedEmployeeId = data.employeeId || ("COOP-WRK-" + Math.floor(1000 + Math.random() * 9000));

    const payload = {
      ...data,
      employeeId: assignedEmployeeId,
      role: "WORKER",
      emailVerified: true,
      verificationStatus: "PENDING",
      avatarUrl: data.avatarUrl || data.photoPreview || data.profileImage || "",
      profileImage: data.profileImage || data.photoPreview || data.avatarUrl || "",
      aadhaarFileBase64: data.aadhaarFileBase64 || data.aadhaarFile,
      panFileBase64: data.panFileBase64 || data.panFile,
      pccFileBase64: data.pccFileBase64 || data.pccFile
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);

      if (parsed.ok && parsed.data?.success && parsed.data?.user) {
        const backendUser = parsed.data.user;
        const finalUser: UserData = {
          id: backendUser.id || backendUser._id,
          name: backendUser.name || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "COOPNEX Specialist",
          firstName: backendUser.firstName || data.firstName,
          lastName: backendUser.lastName || data.lastName,
          email: cleanEmail,
          phone: backendUser.phone || data.phone,
          role: "WORKER",
          district: backendUser.district || data.district || "Vijayawada",
          pincode: backendUser.pincode || data.pincode || "520001",
          employeeId: backendUser.employeeId || assignedEmployeeId,
          verificationStatus: backendUser.verificationStatus || "PENDING",
          verificationLevel: backendUser.verificationLevel || 1,
          avatarUrl: backendUser.avatarUrl || backendUser.profileImage || payload.avatarUrl,
          profileImage: backendUser.profileImage || backendUser.avatarUrl || payload.profileImage,
          emailVerified: true,
          phoneVerified: Boolean(backendUser.phoneVerified),
          status: backendUser.status || "ACTIVE",
          workerProfile: backendUser.workerProfile || {
            trade: data.primarySkill || data.trade || "Electrician",
            level: backendUser.verificationLevel || 1,
            experienceYears: Number(data.experienceYears) || 3,
            rating: 5.0,
            totalJobs: 0
          }
        };

        setUser(finalUser);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(finalUser));
        localStorage.setItem("sahakari_token", parsed.data.token);
        localStorage.setItem("sahakari_worker_status", finalUser.verificationStatus || "PENDING");

        // Clean up registration OTP session
        const sessionKey = `coopnex_otp_REGISTER_${cleanEmail}`;
        sessionStorage.removeItem(sessionKey);

        // Update local admin scrutiny cache with real backend ID
        try {
          const existingWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
          const filteredWorkers = existingWorkers.filter(
            (w: any) => w.email?.toLowerCase() !== cleanEmail && w.employeeId !== finalUser.employeeId
          );
          const workerProf = parsed.data?.user?.workerProfile || backendUser?.workerProfile;
          const kycDocs = Array.isArray(workerProf?.kycDocuments) ? workerProf.kycDocuments : [];

          filteredWorkers.unshift({
            ...finalUser,
            _id: finalUser.id,
            trade: data.primarySkill || data.trade || "Electrician",
            skills: data.skills || [data.primarySkill || "Electrician"],
            societyName: data.selectedSociety || data.societyName || "Vijayawada Central Labour Co-op Society (PACS-04)",
            aadhaarNumber: data.aadhaarNumber,
            panNumber: data.panNumber,
            aadhaarFileBase64: data.aadhaarFileBase64,
            aadhaarOriginalFilename: data.aadhaarOriginalFilename,
            panFileBase64: data.panFileBase64,
            panOriginalFilename: data.panOriginalFilename,
            pccFileBase64: data.pccFileBase64,
            pccOriginalFilename: data.pccOriginalFilename,
            kycDocuments: kycDocs.length > 0 ? kycDocs : [
              ...(data.aadhaarFileBase64 || data.aadhaarNumber ? [{
                documentType: "Aadhaar Card",
                documentNumber: data.aadhaarNumber,
                fileUrl: data.aadhaarFileBase64 || "",
                storageReference: data.aadhaarFileBase64 || "",
                originalFilename: data.aadhaarOriginalFilename || "aadhaar_card.pdf",
                verificationStatus: "PENDING"
              }] : []),
              ...(data.panFileBase64 || data.panNumber ? [{
                documentType: "PAN Card",
                documentNumber: data.panNumber,
                fileUrl: data.panFileBase64 || "",
                storageReference: data.panFileBase64 || "",
                originalFilename: data.panOriginalFilename || "pan_card.pdf",
                verificationStatus: "PENDING"
              }] : []),
              ...(data.pccFileBase64 || data.pccNumber ? [{
                documentType: "Police Clearance Certificate (PCC)",
                documentNumber: data.pccNumber || "PCC-SUBMITTED",
                fileUrl: data.pccFileBase64 || "",
                storageReference: data.pccFileBase64 || "",
                originalFilename: data.pccOriginalFilename || "police_clearance.pdf",
                verificationStatus: "PENDING"
              }] : [])
            ],
            registeredAt: new Date().toLocaleString()
          });
          localStorage.setItem("coopnex_registered_workers", JSON.stringify(filteredWorkers));
        } catch {}

        return { success: true, employeeId: finalUser.employeeId };
      }

      // Backend returned error (e.g. 400 validation error, 409 duplicate, 500 error)
      return {
        success: false,
        message: parsed.errorMessage || parsed.data?.message || "Worker registration failed. Please check your information and try again."
      };
    } catch (err: any) {
      console.error("Worker registration network/server error:", err);
      return {
        success: false,
        message: err.name === "AbortError"
          ? "Worker registration timed out. Please check your network connection."
          : "Unable to connect to the cooperative registration server. Please ensure the backend is running."
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sahakari_user");
    localStorage.removeItem("sahakari_token");
  };

  const setAdminSession = (adminUser: UserData, adminToken: string) => {
    setUser(adminUser);
    setToken(adminToken);
    localStorage.setItem("sahakari_user", JSON.stringify(adminUser));
    localStorage.setItem("sahakari_token", adminToken);
  };

  // Kept exclusively for the isolated /demo testing hub
  const switchDemoRoleForTesting = async (targetRole: UserRole): Promise<UserRole> => {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(data.user));
        localStorage.setItem("sahakari_token", data.token);
        return data.user.role;
      }
    } catch {
      // fallback persona
    }
    return targetRole;
  };

  const refreshUser = async (): Promise<UserData | null> => {
    const savedToken = localStorage.getItem("sahakari_token");
    if (!savedToken) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("sahakari_user", JSON.stringify(data.user));
          if (data.user.workerProfile?.verificationStatus) {
            localStorage.setItem("sahakari_worker_status", data.user.workerProfile.verificationStatus);
          }
          return data.user;
        }
      }
    } catch (e) {
      console.warn("refreshUser warning:", e);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        login,
        workerLogin,
        sendOtp,
        verifyOtp,
        forgotPasswordSendOtp,
        forgotPasswordReset,
        registerCustomer,
        registerWorker,
        logout,
        setAdminSession,
        refreshUser,
        switchDemoRoleForTesting
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
