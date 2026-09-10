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

      // Record OTP verification session in MongoDB with SHA-256 hash, 60s cooldown, 300s TTL
      const recordRes = await fetch(`${API_BASE}/auth/emailjs/record-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: cleanEmail,
          otpCode,
          purpose
        })
      });

      const parsed = await parseApiResponse(recordRes);
      if (!parsed.ok || !parsed.data.success) {
        return {
          success: false,
          message: parsed.errorMessage || "Failed to initialize verification session.",
          retryAfterSeconds: parsed.data?.retryAfterSeconds
        };
      }

      // Dispatch authentic verification email via EmailJS browser SDK (Template 1: Universal Verification)
      const status = getEmailJsStatus();
      if (!status.isConfigured) {
        return {
          success: false,
          message: status.errorMessage || "EmailJS configuration missing in frontend .env. Please set VITE_EMAILJS_SERVICE_ID and templates."
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
          message: "Failed to dispatch verification email via EmailJS. Please verify your EmailJS credentials in .env."
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
        message: "Unable to connect to the verification service. Please check your network connection or try again."
      };
    }
  };

  const verifyOtp = async (identifier: string, otpCode: string, purpose: string = "VERIFY_ACCOUNT"): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otpCode, purpose })
      });
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true, role: parsed.data.user.role };
      }
      return { success: parsed.data.success || false, message: parsed.errorMessage || "Invalid or expired OTP." };
    } catch (err: any) {
      return { success: false, message: "Verification service connection failed. Please try again." };
    }
  };

  const forgotPasswordSendOtp = async (identifier: string): Promise<{ success: boolean; message?: string; otpCode?: string; retryAfterSeconds?: number }> => {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { success: false, message: "Please enter a valid email address." };
      }

      // Generate cryptographically secure 6-digit numeric OTP using Web Crypto API
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const otpCode = (100000 + (array[0] % 900000)).toString();

      // Record reset OTP session with backend MongoDB
      const recordRes = await fetch(`${API_BASE}/auth/emailjs/record-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: cleanEmail,
          otpCode,
          purpose: "FORGOT_PASSWORD"
        })
      });

      const parsed = await parseApiResponse(recordRes);
      if (!parsed.ok || !parsed.data.success) {
        return {
          success: false,
          message: parsed.errorMessage || "Failed to initialize password reset session.",
          retryAfterSeconds: parsed.data?.retryAfterSeconds
        };
      }

      // Dispatch reset email via EmailJS browser SDK (Template 2: Password Reset)
      const status = getEmailJsStatus();
      if (!status.isResetConfigured) {
        return {
          success: false,
          message: status.errorMessage || "EmailJS Reset template missing in frontend .env. Please set VITE_EMAILJS_RESET_TEMPLATE_ID."
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
          message: "Failed to dispatch reset email via EmailJS. Please verify your EmailJS credentials in .env."
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
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otpCode, newPassword: newPass })
      });
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true, role: parsed.data.user.role };
      }
      return { success: false, message: parsed.errorMessage || "Password reset failed." };
    } catch (err: any) {
      return { success: false, message: "Unable to connect to password reset service. Please try again." };
    }
  };

  const registerCustomer = async (data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "CUSTOMER"
        })
      });
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true };
      }
      return { success: false, message: parsed.errorMessage || "Registration failed." };
    } catch {
      return { success: false, message: "Unable to connect to registration server. Please check your internet connection." };
    }
  };

  const registerWorker = async (data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "WORKER"
        })
      });
      const parsed = await parseApiResponse(res);
      if (parsed.ok && parsed.data.success && parsed.data.user) {
        setUser(parsed.data.user);
        setToken(parsed.data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(parsed.data.user));
        localStorage.setItem("sahakari_token", parsed.data.token);
        return { success: true };
      }
      return { success: false, message: parsed.errorMessage || "Registration failed." };
    } catch {
      return { success: false, message: "Unable to connect to worker registration server. Please check your internet connection." };
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
