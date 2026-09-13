import { WorkerProfile, Booking, WorkforceExchangeProposal, HeatmapZone } from "../types";
import { resolveClientPincode, ClientLocationResult } from "../utils/clientLocationResolver";

// Production Backend API Base URL
// In production, fallback to the deployed production backend if VITE_API_URL is omitted
export const DEFAULT_PROD_API_URL = "https://coopnex-backend.onrender.com";

const getApiBaseUrl = (): string => {
  // 1. Explicit Vite environment variable (built or provided at build/deploy time)
  const envUrl = (import.meta.env.VITE_API_URL || "").trim();
  if (envUrl) {
    return envUrl.endsWith("/api") ? envUrl : `${envUrl.replace(/\/$/, "")}/api`;
  }

  // 2. Allow dynamic local storage override for flexible deployments / staging testing
  if (typeof window !== "undefined" && window.localStorage) {
    const custom = window.localStorage.getItem("coopnex_backend_url");
    if (custom) {
      return custom.endsWith("/api") ? custom : `${custom.replace(/\/$/, "")}/api`;
    }
  }

  // 3. Dynamic LAN / Local IP resolution (for local development or testing across mobile devices on LAN)
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    const isLocalOrIp =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
      hostname.endsWith(".local");

    if (isLocalOrIp) {
      return `http://${hostname}:5000/api`;
    }

    // 4. In browser runtime on GitHub Pages, Vercel, Netlify, Render or any remote production domain
    return `${DEFAULT_PROD_API_URL}/api`;
  }

  return DEFAULT_PROD_API_URL ? `${DEFAULT_PROD_API_URL}/api` : "/api";
};

export const API_BASE = getApiBaseUrl();

export const api = {
  // Workers
  getWorkers: async (params?: Record<string, any>): Promise<WorkerProfile[]> => {
    try {
      const cleanParams: Record<string, any> = {};
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v !== undefined && v !== null && v !== "") {
            cleanParams[k] = String(v);
          }
        }
      }
      const query = new URLSearchParams(cleanParams).toString();
      const res = await fetch(`${API_BASE}/workers${query ? `?${query}` : ""}`);
      const data = await res.json();
      if (data && Array.isArray(data.workers)) {
        return data.workers;
      }
    } catch (e) {
      console.error("api.getWorkers network error:", e);
    }
    return [];
  },

  getServiceCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/workers/categories`);
      const data = await res.json();
      return data.categories || [];
    } catch (e) {
      console.error("api.getServiceCategories error:", e);
      return [];
    }
  },

  getNearbyWorkers: async (service = "Electrician", lat = 16.5062, lon = 80.6480, isEmergency = false) => {
    const res = await fetch(
      `${API_BASE}/workers/nearby?service=${encodeURIComponent(service)}&lat=${lat}&lon=${lon}&isEmergency=${isEmergency}`
    );
    return res.json();
  },

  getWorkerById: async (id: string): Promise<WorkerProfile | null> => {
    const res = await fetch(`${API_BASE}/workers/${id}`);
    const data = await res.json();
    return data.worker || null;
  },

  // Fair Wage
  calculateWage: async (body: any) => {
    const res = await fetch(`${API_BASE}/fair-wage/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  getWagePolicy: async () => {
    const res = await fetch(`${API_BASE}/fair-wage/policy`);
    return res.json();
  },

  // Bookings
  createBooking: async (body: any, token?: string) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  getMyBookings: async (token?: string): Promise<Booking[]> => {
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: {
        Authorization: `Bearer ${token || localStorage.getItem("sahakari_token") || ""}`
      }
    });
    const data = await res.json();
    return data.bookings || [];
  },

  updateBookingStatus: async (bookingId: string, status: string, note?: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify({ status, note })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update booking status.");
    }
    return data;
  },

  submitReview: async (body: any) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  getMyReviews: async () => {
    const res = await fetch(`${API_BASE}/reviews/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Emergency
  triggerEmergency: async (body: any) => {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  getEmergencyTracking: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/emergency/${bookingId}/track`);
    return res.json();
  },

  // Payments & Invoices
  createPaymentOrder: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify({ bookingId })
    });
    return res.json();
  },

  verifyPayment: async (body: any) => {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  getInvoice: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/invoices/${bookingId}`);
    return res.json();
  },

  // Federation & Admin
  getFederationIntelligence: async () => {
    const res = await fetch(`${API_BASE}/admin/intelligence`);
    return res.json();
  },

  getDemandHeatmap: async (): Promise<{ success: boolean; zones: HeatmapZone[] }> => {
    const res = await fetch(`${API_BASE}/admin/heatmap`);
    return res.json();
  },

  getWorkforceExchanges: async (): Promise<{ success: boolean; exchanges: WorkforceExchangeProposal[] }> => {
    const res = await fetch(`${API_BASE}/admin/workforce-exchanges`);
    return res.json();
  },

  approveWorkforceExchange: async (exchangeId: string) => {
    const res = await fetch(`${API_BASE}/admin/workforce-exchanges/${exchangeId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // AI Insights
  getAiForecast: async (service = "Electrician", location = "Vijayawada", days = 7) => {
    const res = await fetch(
      `${API_BASE}/ai/forecast?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}&days=${days}`
    );
    return res.json();
  },

  getSkillGap: async (district = "Vijayawada") => {
    const res = await fetch(`${API_BASE}/ai/skill-gap?district=${encodeURIComponent(district)}`);
    return res.json();
  },

  // Welfare
  getWelfareOverview: async () => {
    const res = await fetch(`${API_BASE}/welfare`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Location & Coverage Engine
  checkPincodeAvailability: async (pincode: string, service?: string) => {
    const query = new URLSearchParams({ pincode });
    if (service) query.append("service", service);
    const res = await fetch(`${API_BASE}/location/check-pincode?${query.toString()}`);
    return res.json();
  },

  getStates: async () => {
    const res = await fetch(`${API_BASE}/location/states`);
    return res.json();
  },

  // Official Postal & LGD Location Resolver with automatic offline client fallback
  getPincodeDetails: async (pincode: string, signal?: AbortSignal): Promise<ClientLocationResult> => {
    const cleanPin = (pincode || "").replace(/\D/g, "").trim();
    if (cleanPin.length !== 6) {
      return resolveClientPincode(cleanPin);
    }

    // 1. First attempt: configured API endpoint (local :5000 or production backend)
    try {
      const res = await fetch(`${API_BASE}/location/pincode/${encodeURIComponent(cleanPin)}`, { signal });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data) {
          return json.data;
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") throw err;
    }

    // 2. Second attempt: direct relative path /api in case Vite proxy is running
    try {
      if (API_BASE !== "/api") {
        const res2 = await fetch(`/api/location/pincode/${encodeURIComponent(cleanPin)}`, { signal });
        if (res2.ok) {
          const json2 = await res2.json();
          if (json2 && json2.success && json2.data) {
            return json2.data;
          }
        }
      }
    } catch (err2: any) {
      if (err2.name === "AbortError") throw err2;
    }

    // 3. Resilient fallback: Instant client-side LGD and India Post directory resolution
    return resolveClientPincode(cleanPin);
  },

  // KYC Verification & Anti-Fraud Engine
  getKycSubmissions: async () => {
    const res = await fetch(`${API_BASE}/admin/kyc-submissions`);
    return res.json();
  },

  reviewKycSubmission: async (workerId: string, payload: { action: string; documentType?: string; rejectionReason?: string; newLevel?: number }) => {
    const res = await fetch(`${API_BASE}/admin/kyc/${workerId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // User Profile
  updateProfile: async (body: any) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  markNotificationRead: async (id: string) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Emergency Blood Network
  getBloodNetworkStats: async (district = "Vijayawada") => {
    try {
      const res = await fetch(`${API_BASE}/emergency/blood-network?district=${encodeURIComponent(district)}`);
      return res.json();
    } catch (e) {
      return { success: false, registeredDonors: 0 };
    }
  },

  workerLogin: async (employeeId: string, pass: string) => {
    const res = await fetch(`${API_BASE}/auth/worker/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, password: pass })
    });
    return res.json();
  },

  // Location & Service Area Availability
  checkPincode: async (pincode: string, service?: string) => {
    try {
      const q = service ? `&service=${encodeURIComponent(service)}` : "";
      const res = await fetch(`${API_BASE}/location/check-pincode?pincode=${encodeURIComponent(pincode)}${q}`);
      return res.json();
    } catch (e) {
      console.error("api.checkPincode error:", e);
      return { success: false, data: { available: false, status: "COMING_SOON" } };
    }
  },

  getServiceAreas: async () => {
    try {
      const res = await fetch(`${API_BASE}/location/service-areas`);
      return res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },

  // Admin Service Areas
  getAdminServiceAreas: async () => {
    const res = await fetch(`${API_BASE}/admin/service-areas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}` }
    });
    return res.json();
  },

  toggleServiceArea: async (id: string, isActive?: boolean) => {
    const res = await fetch(`${API_BASE}/admin/service-areas/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(typeof isActive === "boolean" ? { isActive } : {})
    });
    return res.json();
  },

  createServiceArea: async (payload: any) => {
    const res = await fetch(`${API_BASE}/admin/service-areas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Real-time Booking Messages
  getMessagesByBooking: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/messages/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  sendMessage: async (bookingId: string, text: string) => {
    const res = await fetch(`${API_BASE}/messages/booking/${bookingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  // Worker Escrow & Withdrawals
  requestWorkerWithdrawal: async (payload: {
    amount: number;
    payoutMethod: "BANK" | "UPI";
    accountDetails: string;
    bankName?: string;
    ifsc?: string;
    upiId?: string;
  }) => {
    const res = await fetch(`${API_BASE}/payments/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  releaseMatureEscrows: async () => {
    const res = await fetch(`${API_BASE}/payments/mature-check`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin Financial Ledger
  getAdminFinancialLedger: async () => {
    const res = await fetch(`${API_BASE}/payments/admin/ledger`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Worker Me Profile
  getWorkerMe: async () => {
    const res = await fetch(`${API_BASE}/workers/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin All Conversations Audit
  getAllBookingConversations: async () => {
    const res = await fetch(`${API_BASE}/messages/admin/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin All Bookings with Worker Acceptance & Fair Wage
  getAllBookingsAdmin: async () => {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin All Registered Users
  getAllUsersAdmin: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin All Reviews with Media & Ratings
  getAllReviewsAdmin: async () => {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin All Payments Ledger
  getAllPaymentsAdmin: async () => {
    const res = await fetch(`${API_BASE}/admin/payments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      }
    });
    return res.json();
  },

  // Admin Adjust / Award Worker Stars & Rating
  updateWorkerRatingAdmin: async (workerId: string, payload: { rating: number; reason?: string }) => {
    const res = await fetch(`${API_BASE}/admin/workers/${workerId}/rating`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};

export const apiService = api;



