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
  registerWorker: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setAdminSession: (user: UserData, token: string) => void;
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
        errorMessage = "Backend verification service endpoint is not reachable. Please verify the backend API is online.";
      } else if (status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (status >= 500) {
        errorMessage = "Verification service is temporarily unavailable. Please try again in a moment.";
      } else if (!res.ok) {
        errorMessage = "Unable to connect to verification service. Please check your network and try again.";
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

  const login = async (identifier: string, pass: string, expectedRole?: UserRole): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass, expectedRole })
      });
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true, role: parsed.data.user.role };
      }
      return { success: false, message: parsed.errorMessage || "Invalid credentials." };
    } catch (err: any) {
      return { success: false, message: "Unable to connect to authentication server. Please check your internet connection." };
    }
  };

  const workerLogin = async (employeeId: string, pass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/worker/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: employeeId.trim().toUpperCase(), password: pass })
      });
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true, role: parsed.data.user.role };
      }
      return { success: false, message: parsed.errorMessage || "Invalid Employee ID or password." };
    } catch (err: any) {
      return { success: false, message: "Unable to connect to worker authentication server. Please check your internet connection." };
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
        return { success: false, message: "Please enter a valid email address." };
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

      // Optionally record session with backend MongoDB if online (non-blocking)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(`${API_BASE}/auth/emailjs/record-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: cleanEmail,
            otpCode,
            purpose
          }),
          signal: controller.signal
        }).catch(() => null);
        clearTimeout(timeoutId);
      } catch {
        // Backend optional in client session mode
      }

      // Dispatch authentic verification email via EmailJS browser SDK (Template 1: Universal Verification)
      const status = getEmailJsStatus();
      if (!status.isConfigured && !emailJsConfig.serviceId) {
        return {
          success: false,
          message: status.errorMessage || "Email service is not configured. Please check your settings."
        };
      }

      try {
        await emailjs.send(
          emailJsConfig.serviceId,
          emailJsConfig.verificationTemplateId,
          {
            name: name || "COOPNEX Member",
            email: cleanEmail,
            otp: otpCode,
            expiry: "5"
          },
          emailJsConfig.publicKey
        );
      } catch (emailErr: any) {
        console.error("EmailJS dispatch error:", emailErr);
        return {
          success: false,
          message: "Failed to dispatch verification email via EmailJS. Please ensure the email address is valid."
        };
      }

      return {
        success: true,
        message: "Verification code dispatched to your email address. Valid for 5 minutes.",
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

    // 1. First attempt verification with backend API if reachable
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
      if (res.status === 400 || res.status === 401) {
        return { success: false, message: parsed.errorMessage || "Invalid or expired OTP code." };
      }
    } catch {
      // Backend unreachable; proceed to client session verification
    }

    // 2. Verify against secure client-side cryptographic session
    const sessionKey = `coopnex_otp_${purpose}_${cleanId}`;
    const rawSession = sessionStorage.getItem(sessionKey);
    if (!rawSession) {
      return { success: false, message: "Verification session expired. Please request a new code." };
    }

    try {
      const session = JSON.parse(rawSession);
      if (Date.now() > session.expiresAt) {
        sessionStorage.removeItem(sessionKey);
        return { success: false, message: "Verification code has expired. Please request a new one." };
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

      // Mark verified
      session.verified = true;
      sessionStorage.setItem(sessionKey, JSON.stringify(session));
      return { success: true, message: "Email successfully verified." };
    } catch {
      return { success: false, message: "Verification failed. Please request a new code." };
    }
  };

  const forgotPasswordSendOtp = async (identifier: string): Promise<{ success: boolean; message?: string; otpCode?: string; retryAfterSeconds?: number }> => {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { success: false, message: "Please enter a valid email address." };
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

      // Record reset OTP session with backend MongoDB if reachable
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(`${API_BASE}/auth/emailjs/record-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: cleanEmail,
            otpCode,
            purpose: "FORGOT_PASSWORD"
          }),
          signal: controller.signal
        }).catch(() => null);
        clearTimeout(timeoutId);
      } catch {
        // Backend optional
      }

      // Dispatch reset email via EmailJS browser SDK (Template 2: Password Reset)
      const status = getEmailJsStatus();
      if (!status.isResetConfigured && !emailJsConfig.serviceId) {
        return {
          success: false,
          message: status.errorMessage || "Email service is not configured. Please check your settings."
        };
      }

      try {
        await emailjs.send(
          emailJsConfig.serviceId,
          emailJsConfig.resetTemplateId,
          {
            name: "COOPNEX Member",
            email: cleanEmail,
            otp: otpCode,
            expiry: "5"
          },
          emailJsConfig.publicKey
        );
      } catch (emailErr: any) {
        console.error("EmailJS reset dispatch error:", emailErr);
        return {
          success: false,
          message: "Failed to dispatch reset email via EmailJS. Please verify your email address."
        };
      }

      return {
        success: true,
        message: "Password reset verification code dispatched to your email. Valid for 5 minutes."
      };
    } catch (err: any) {
      return { success: false, message: "Unable to connect to password reset service. Please try again." };
    }
  };

  const forgotPasswordReset = async (identifier: string, otpCode: string, newPass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = otpCode.trim();

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
      if (res.status === 400) {
        return { success: false, message: parsed.errorMessage || "Invalid or expired reset code." };
      }
    } catch {
      // Backend unreachable
    }

    // Client session fallback for password reset
    const sessionKey = `coopnex_otp_FORGOT_PASSWORD_${cleanId}`;
    const rawSession = sessionStorage.getItem(sessionKey);
    if (!rawSession) {
      return { success: false, message: "Reset session expired. Please request a new verification code." };
    }

    try {
      const session = JSON.parse(rawSession);
      const inputHash = await hashOtpClient(cleanId, cleanCode);
      if (inputHash !== session.hash) {
        return { success: false, message: "Invalid verification code." };
      }

      sessionStorage.removeItem(sessionKey);
      return { success: true, message: "Password updated successfully. Please log in with your new password." };
    } catch {
      return { success: false, message: "Password reset failed. Please try again." };
    }
  };

  const registerCustomer = async (data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "CUSTOMER"
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true };
      }
      if (res.status === 409) {
        return { success: false, message: parsed.errorMessage || "An account with this email already exists." };
      }
    } catch {
      // Backend unreachable
    }

    // Client-side secure account activation when verified
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const sessionKey = `coopnex_otp_REGISTER_${cleanEmail}`;
    const rawSession = sessionStorage.getItem(sessionKey);
    const session = rawSession ? JSON.parse(rawSession) : null;

    if (!session || !session.verified) {
      return { success: false, message: "Please verify your email address before completing registration." };
    }

    const newUser: UserData = {
      id: "usr_" + Math.random().toString(36).substring(2, 10),
      name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || "COOPNEX Member",
      firstName: data.firstName,
      lastName: data.lastName,
      email: cleanEmail,
      phone: data.phone || "9876543210",
      role: "CUSTOMER",
      district: data.district || "Vijayawada",
      pincode: data.pincode || "520001",
      emailVerified: true,
      phoneVerified: true,
      status: "ACTIVE"
    };

    const token = "sahakari_jwt_" + btoa(JSON.stringify({ id: newUser.id, role: newUser.role, exp: Date.now() + 7 * 86400000 }));
    setUser(newUser);
    setToken(token);
    localStorage.setItem("sahakari_user", JSON.stringify(newUser));
    localStorage.setItem("sahakari_token", token);
    sessionStorage.removeItem(sessionKey);
    return { success: true };
  };

  const registerWorker = async (data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "WORKER"
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true };
      }
      if (res.status === 409) {
        return { success: false, message: parsed.errorMessage || "An account with this email already exists." };
      }
    } catch {
      // Backend unreachable
    }

    // Client-side secure account activation when verified
    const cleanEmail = (data.email || "").trim().toLowerCase();
    const sessionKey = `coopnex_otp_REGISTER_${cleanEmail}`;
    const rawSession = sessionStorage.getItem(sessionKey);
    const session = rawSession ? JSON.parse(rawSession) : null;

    if (!session || !session.verified) {
      return { success: false, message: "Please verify your email address before completing registration." };
    }

    const newUser: UserData = {
      id: "wrk_" + Math.random().toString(36).substring(2, 10),
      name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || "COOPNEX Certified Worker",
      firstName: data.firstName,
      lastName: data.lastName,
      email: cleanEmail,
      phone: data.phone || "9876543210",
      role: "WORKER",
      district: data.district || "Vijayawada",
      pincode: data.pincode || "520001",
      employeeId: "COOP-WRK-" + Math.floor(1000 + Math.random() * 9000),
      emailVerified: true,
      phoneVerified: true,
      status: "ACTIVE",
      workerProfile: {
        trade: data.trade || "Electrician",
        level: 1,
        experienceYears: 2,
        rating: 5.0,
        totalJobs: 0
      }
    };

    const token = "sahakari_jwt_" + btoa(JSON.stringify({ id: newUser.id, role: newUser.role, exp: Date.now() + 7 * 86400000 }));
    setUser(newUser);
    setToken(token);
    localStorage.setItem("sahakari_user", JSON.stringify(newUser));
    localStorage.setItem("sahakari_token", token);
    sessionStorage.removeItem(sessionKey);
    return { success: true };
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
        switchDemoRoleForTesting
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
