import { WorkerProfile, Booking, WorkforceExchangeProposal, HeatmapZone } from "../types";

const API_BASE = "/api";

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
    return res.json();
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
  }
};

export const apiService = api;



