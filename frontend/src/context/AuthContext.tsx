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

  const login = async (identifier: string, pass: string, expectedRole?: UserRole): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass, expectedRole })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(data.user));
        localStorage.setItem("sahakari_token", data.token);
        return { success: true, role: data.user.role };
      }
      return { success: false, message: data.message || "Invalid credentials." };
    } catch (err: any) {
      return { success: false, message: "Network or server error." };
    }
  };

  const workerLogin = async (employeeId: string, pass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/worker/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: employeeId.trim().toUpperCase(), password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(data.user));
        localStorage.setItem("sahakari_token", data.token);
        return { success: true, role: data.user.role };
      }
      return { success: false, message: data.message || "Invalid Employee ID or password." };
    } catch (err: any) {
      return { success: false, message: "Network or server error." };
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

      const recordData = await recordRes.json();
      if (!recordRes.ok || !recordData.success) {
        return {
          success: false,
          message: recordData.message || "Failed to initialize verification session.",
          retryAfterSeconds: recordData.retryAfterSeconds
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
      return { success: false, message: "Network connection error." };
    }
  };

  const verifyOtp = async (identifier: string, otpCode: string, purpose: string = "VERIFY_ACCOUNT"): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otpCode, purpose })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(data.user));
        localStorage.setItem("sahakari_token", data.token);
        return { success: true, role: data.user.role };
      }
      return { success: data.success || false, message: data.message || "Invalid or expired OTP." };
    } catch (err: any) {
      return { success: false, message: "Verification failed. Please try again." };
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

      const recordData = await recordRes.json();
      if (!recordRes.ok || !recordData.success) {
        return {
          success: false,
          message: recordData.message || "Failed to initialize password reset session.",
          retryAfterSeconds: recordData.retryAfterSeconds
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
      return { success: false, message: "Failed to send reset code." };
    }
  };

  const forgotPasswordReset = async (identifier: string, otpCode: string, newPass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otpCode, newPassword: newPass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("sahakari_user", JSON.stringify(data.user));
        localStorage.setItem("sahakari_token", data.token);
        return { success: true, role: data.user.role };
      }
      return { success: false, message: data.message || "Password reset failed." };
    } catch (err: any) {
      return { success: false, message: "Password reset error." };
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
      const resData = await res.json();
      if (resData.success && resData.user) {
        setUser(resData.user);
        setToken(resData.token);
        localStorage.setItem("sahakari_user", JSON.stringify(resData.user));
        localStorage.setItem("sahakari_token", resData.token);
        return { success: true };
      }
      return { success: false, message: resData.message || "Registration failed." };
    } catch {
      return { success: false, message: "Server connection failed." };
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
      const resData = await res.json();
      if (resData.success && resData.user) {
        setUser(resData.user);
        setToken(resData.token);
        localStorage.setItem("sahakari_user", JSON.stringify(resData.user));
        localStorage.setItem("sahakari_token", resData.token);
        return { success: true };
      }
      return { success: false, message: resData.message || "Registration failed." };
    } catch {
      return { success: false, message: "Server connection failed." };
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
