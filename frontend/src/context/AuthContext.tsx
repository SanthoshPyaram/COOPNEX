import React, { createContext, useContext, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { emailJsConfig, isEmailJsConfigured, isEmailJsResetConfigured, getEmailJsStatus } from "../config/emailjs";
import { UserRole } from "../types";
import { API_BASE } from "../services/api";
import { validateEmailFormat } from "../utils/validation";

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
  roles?: UserRole[];
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
  workerLogin: (employeeIdOrEmail: string, pass: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  validateEmail: (email: string, mode?: string, targetRole?: string) => Promise<{ success: boolean; status: string; safeToSendOtp: boolean; message: string; reason?: string; isExistingUser?: boolean; canRegisterAs?: boolean }>;
  sendOtp: (identifier: string, purpose?: string, name?: string, targetRole?: string) => Promise<{ success: boolean; code?: string; message?: string; emailDispatched?: boolean; retryAfterSeconds?: number; notRegistered?: boolean }>;
  verifyOtp: (identifier: string, otpCode: string, purpose?: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  forgotPasswordSendOtp: (identifier: string) => Promise<{ success: boolean; code?: string; message?: string; otpCode?: string; emailDispatched?: boolean; previewUrl?: string; notRegistered?: boolean; retryAfterSeconds?: number }>;
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
  validateEmail: async () => ({ success: false, status: "invalid", safeToSendOtp: false, message: "" }),
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

  const validateEmail = async (
    email: string,
    mode: string = "REGISTER",
    targetRole?: string
  ): Promise<{ success: boolean; status: string; safeToSendOtp: boolean; message: string; reason?: string; isExistingUser?: boolean; canRegisterAs?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    const fmt = validateEmailFormat(cleanEmail);
    if (!fmt.isValid) {
      return {
        success: false,
        status: "invalid",
        safeToSendOtp: false,
        reason: "invalid_syntax",
        message: "❌ Please enter a valid email address. 📧"
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const payload = { email: cleanEmail, mode, role: targetRole, targetRole };
      let res = await fetch(`${API_BASE}/auth/validate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      // Route Fallback if /auth/validate-email returns 404
      if (res.status === 404) {
        res = await fetch(`${API_BASE}/validate-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);
      const data = await res.json();
      return {
        success: Boolean(res.ok && data.success && data.safeToSendOtp === true),
        status: data.status || (res.ok ? "valid" : "invalid"),
        safeToSendOtp: Boolean(data.safeToSendOtp === true),
        reason: data.reason,
        isExistingUser: Boolean(data.isExistingUser),
        canRegisterAs: Boolean(data.canRegisterAs),
        message: data.message || (res.ok ? "Email address is valid." : "❌ This email address could not be verified. Please check it and try again. 📧")
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === "AbortError") {
        return {
          success: false,
          status: "timeout",
          safeToSendOtp: false,
          reason: "timeout",
          message: "⏱️ Email verification is taking too long. Please try again. 📧"
        };
      }
      return {
        success: false,
        status: "unknown",
        safeToSendOtp: false,
        reason: "network_error",
        message: "❌ This email address could not be verified. Please check it and try again. 📧"
      };
    }
  };

  const sendOtp = async (
    identifier: string,
    purpose: string = "REGISTER",
    name?: string,
    targetRole?: string
  ): Promise<{ success: boolean; code?: string; message?: string; emailDispatched?: boolean; retryAfterSeconds?: number; notRegistered?: boolean }> => {
    try {
      const cleanEmail = identifier.trim().toLowerCase();

      // STEP 1: Client-Side Syntax Validation
      const formatCheck = validateEmailFormat(cleanEmail);
      if (!formatCheck.isValid) {
        return { success: false, code: "INVALID_EMAIL", message: "❌ Please enter a valid email address. 📧" };
      }

      // STEP 2: Dispatch through backend /auth/send-otp (Server-Side Real Validation + Cryptographic OTP)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        const payload = {
          identifier: cleanEmail,
          purpose,
          name,
          role: targetRole,
          targetRole
        };
        let res = await fetch(`${API_BASE}/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (res.status === 404) {
          res = await fetch(`${API_BASE}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
        }

        clearTimeout(timeoutId);
        const data = await res.json().catch(() => null);

        if (res.ok && data?.success) {
          return {
            success: true,
            code: "SUCCESS",
            emailDispatched: true,
            message: data.message || "✅ OTP sent successfully! 📩",
            retryAfterSeconds: data.retryAfterSeconds
          };
        }

        if (res.status === 404 || data?.code === "EMAIL_NOT_FOUND" || data?.exists === false) {
          return {
            success: false,
            code: "EMAIL_NOT_FOUND",
            notRegistered: true,
            message: data?.message || "❌ This email address is not registered.",
            retryAfterSeconds: data?.retryAfterSeconds
          };
        }

        if (res.status === 429 || data?.code === "RATE_LIMITED" || data?.code === "OTP_RATE_LIMITED") {
          return {
            success: false,
            code: "RATE_LIMITED",
            message: data?.message || "⏱️ Too many requests. Please wait and try again.",
            retryAfterSeconds: data?.retryAfterSeconds
          };
        }

        if (res.status === 503 || data?.code === "OTP_PROVIDER_CONFIG_ERROR") {
          return {
            success: false,
            code: "OTP_PROVIDER_CONFIG_ERROR",
            message: data?.message || "OTP service is temporarily unavailable. Please try again later.",
            retryAfterSeconds: data?.retryAfterSeconds
          };
        }

        if (res.status === 504 || data?.code === "TIMEOUT") {
          return {
            success: false,
            code: "TIMEOUT",
            message: data?.message || "⏱️ OTP dispatch is taking too long. Please try again. 📩",
            retryAfterSeconds: data?.retryAfterSeconds
          };
        }

        return {
          success: false,
          code: data?.code || "OTP_SEND_FAILED",
          notRegistered: false,
          message: data?.message || "❌ We couldn't send the verification code. Please try again. 📩",
          retryAfterSeconds: data?.retryAfterSeconds
        };
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        if (netErr?.name === "AbortError") {
          return {
            success: false,
            code: "TIMEOUT",
            message: "⏱️ OTP dispatch is taking too long. Please try again. 📩"
          };
        }
        return {
          success: false,
          code: "NETWORK_ERROR",
          message: "❌ We couldn't connect to the verification server. Please try again. 📩"
        };
      }
    } catch (err: any) {
      console.error("[Auth] sendOtp unexpected error:", err);
      return {
        success: false,
        code: "OTP_SEND_FAILED",
        message: "❌ We couldn't send the verification code. Please try again. 📩"
      };
    }
  };

  const verifyOtp = async (identifier: string, otpCode: string, purpose: string = "REGISTER"): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      return { success: false, message: "❌ Incorrect OTP. Please try again. 🔐" };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanId, otpCode: cleanCode, purpose })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem("sahakari_user", JSON.stringify(data.user));
          localStorage.setItem("sahakari_token", data.token);
        }
        return { success: true, role: data.user?.role, message: data.message || "✅ Email verified successfully! 🎉" };
      }

      return {
        success: false,
        message: data.message || "❌ Incorrect OTP. Please try again. 🔐"
      };
    } catch {
      return {
        success: false,
        message: "❌ Verification failed. Please check your connection and try again."
      };
    }
  };

  const forgotPasswordSendOtp = async (identifier: string): Promise<{
    success: boolean;
    code?: string;
    message?: string;
    otpCode?: string;
    retryAfterSeconds?: number;
    notRegistered?: boolean;
  }> => {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      const formatCheck = validateEmailFormat(cleanEmail);
      if (!formatCheck.isValid) {
        return {
          success: false,
          code: "INVALID_EMAIL",
          message: "❌ Please enter a valid email address. 📧"
        };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        let res = await fetch(`${API_BASE}/auth/forgot-password/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: cleanEmail, email: cleanEmail }),
          signal: controller.signal
        });

        // If a proxy or static host gives 404 HTML without JSON, try route alias
        if (res.status === 404) {
          const contentType = res.headers.get("content-type") || "";
          if (!contentType.includes("application/json")) {
            res = await fetch(`${API_BASE}/forgot-password/send-otp`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ identifier: cleanEmail, email: cleanEmail }),
              signal: controller.signal
            });
          }
        }

        clearTimeout(timeoutId);
        const data = await res.json().catch(() => null);

        if (res.ok && data?.success) {
          return {
            success: true,
            code: "SUCCESS",
            message: data.message || "OTP sent successfully. Please check your email.",
            retryAfterSeconds: data.retryAfterSeconds || 60
          };
        }

        if (res.status === 404 || data?.code === "EMAIL_NOT_FOUND" || data?.exists === false) {
          return {
            success: false,
            notRegistered: true,
            code: "EMAIL_NOT_FOUND",
            message: data?.message || "This email is not registered. Please try again with another email address."
          };
        }

        if (res.status === 429 || data?.code === "RATE_LIMITED" || data?.code === "OTP_RATE_LIMITED") {
          return {
            success: false,
            code: "RATE_LIMITED",
            retryAfterSeconds: data?.retryAfterSeconds || 60,
            message: data?.message || "Too many OTP requests. Please wait and try again."
          };
        }

        if (res.status === 503 || data?.code === "OTP_PROVIDER_CONFIG_ERROR") {
          return {
            success: false,
            code: "OTP_PROVIDER_CONFIG_ERROR",
            message: data?.message || "OTP service is temporarily unavailable. Please try again later."
          };
        }

        if (res.status === 504 || data?.code === "TIMEOUT") {
          return {
            success: false,
            code: "TIMEOUT",
            message: data?.message || "⏱️ OTP dispatch is taking too long. Please try again. 📩"
          };
        }

        return {
          success: false,
          code: data?.code || "OTP_SEND_FAILED",
          message: data?.message || "We couldn't send the OTP to this email right now. Please try again."
        };
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr?.name === "AbortError") {
          return {
            success: false,
            code: "TIMEOUT",
            message: "⏱️ OTP dispatch is taking too long. Please check your connection and try again. 📩"
          };
        }
        return {
          success: false,
          code: "NETWORK_ERROR",
          message: "Unable to connect to the server. Please check your internet connection and try again."
        };
      }
    } catch {
      return {
        success: false,
        code: "OTP_SEND_FAILED",
        message: "We couldn't send the OTP to this email right now. Please try again."
      };
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
          return { success: false, message: "❌ Incorrect OTP. Please check the code and try again. 🔐" };
        }
      } catch {}
    }

    // 2. Fallback backend verification
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
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
        validateEmail,
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
