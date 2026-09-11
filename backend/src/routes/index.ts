import { Router } from "express";
import * as authCtrl from "../controllers/authController";
import * as workerCtrl from "../controllers/workerController";
import * as bookingCtrl from "../controllers/bookingController";
import * as emergencyCtrl from "../controllers/emergencyController";
import * as fairWageCtrl from "../controllers/fairWageController";
import * as paymentCtrl from "../controllers/paymentController";
import * as adminCtrl from "../controllers/adminController";
import * as adminAuthCtrl from "../controllers/adminAuthController";
import * as welfareCtrl from "../controllers/welfareController";
import * as notificationCtrl from "../controllers/notificationController";
import * as locationCtrl from "../controllers/locationController";
import * as ttsCtrl from "../controllers/ttsController";
import * as docCtrl from "../controllers/documentController";
import * as translationCtrl from "../controllers/translationController";
import { AiService } from "../services/aiService";
import { authenticateJwt } from "../middleware/auth";
import { requireRoles } from "../middleware/rbac";
import { USER_ROLES } from "../config/constants";

export const apiRouter = Router();

// --- LOCATION & SERVICE COVERAGE ENGINE ---
apiRouter.get("/location/check-pincode", locationCtrl.checkPincode);
apiRouter.get("/location/states", locationCtrl.getStates);

// --- AUTHENTICATION & REAL-TIME OTP ---
apiRouter.post("/auth/check-email", authCtrl.checkEmail);
apiRouter.get("/auth/check-email", authCtrl.checkEmail);
apiRouter.post("/auth/check-phone", authCtrl.checkPhone);
apiRouter.get("/auth/check-phone", authCtrl.checkPhone);
apiRouter.post("/auth/register", authCtrl.register);
apiRouter.post("/auth/login", authCtrl.login);
apiRouter.post("/auth/worker/login", authCtrl.workerLogin);
apiRouter.post("/auth/demo-login", authCtrl.demoLogin);
apiRouter.post("/auth/emailjs/record-otp", authCtrl.recordEmailJsOtp);
apiRouter.post("/auth/send-otp", authCtrl.sendOtp);
apiRouter.post("/auth/verify-otp", authCtrl.verifyOtp);
apiRouter.post("/auth/forgot-password/send-otp", authCtrl.forgotPasswordSendOtp);
apiRouter.post("/auth/forgot-password/reset", authCtrl.forgotPasswordReset);
apiRouter.get("/auth/me", authenticateJwt, authCtrl.getMe);
apiRouter.patch("/auth/profile", authenticateJwt, authCtrl.updateProfile);

// --- NOTIFICATIONS ---
apiRouter.get("/notifications", authenticateJwt, notificationCtrl.getNotifications);
apiRouter.patch("/notifications/read-all", authenticateJwt, notificationCtrl.markAllAsRead);
apiRouter.patch("/notifications/:id/read", authenticateJwt, notificationCtrl.markAsRead);

// --- WORKERS ---
apiRouter.get("/workers/categories", workerCtrl.getServiceCategories);
apiRouter.get("/workers", workerCtrl.getWorkers);
apiRouter.get("/workers/nearby", workerCtrl.getNearbyWorkers);
apiRouter.get("/workers/:id", workerCtrl.getWorkerById);
apiRouter.patch(
  "/workers/:workerId/verify",
  authenticateJwt,
  requireRoles(USER_ROLES.SOCIETY_ADMIN, USER_ROLES.FEDERATION_ADMIN, USER_ROLES.SUPER_ADMIN),
  workerCtrl.updateVerification
);
apiRouter.get("/workers/me", authenticateJwt, workerCtrl.getWorkerMe);
apiRouter.patch("/workers/me/availability", authenticateJwt, workerCtrl.updateAvailability);

// --- BOOKINGS ---
apiRouter.post("/bookings", authenticateJwt, bookingCtrl.createBooking);
apiRouter.get("/bookings/my", authenticateJwt, bookingCtrl.getMyBookings);
apiRouter.get("/bookings/:id", authenticateJwt, bookingCtrl.getBookingById);
apiRouter.patch("/bookings/:id/status", authenticateJwt, bookingCtrl.updateBookingStatus);
apiRouter.post("/reviews", authenticateJwt, bookingCtrl.submitReview);
apiRouter.get("/reviews/booking/:bookingId", authenticateJwt, bookingCtrl.getReviewByBookingId);

// --- EMERGENCY DISPATCH & BLOOD NETWORK ---
apiRouter.get("/emergency/blood-network", emergencyCtrl.getBloodNetworkStats);
apiRouter.post("/emergency", authenticateJwt, emergencyCtrl.triggerEmergencyRequest);
apiRouter.get("/emergency/:id/track", emergencyCtrl.getLiveEmergencyTracking);

// --- FAIR WAGE ENGINE ---
apiRouter.post("/fair-wage/calculate", fairWageCtrl.calculateWageBreakdown);
apiRouter.get("/fair-wage/policy", fairWageCtrl.getPolicyRules);

// --- PAYMENTS & INVOICES ---
apiRouter.post("/payments/create-order", authenticateJwt, paymentCtrl.createPaymentOrder);
apiRouter.post("/payments/verify", authenticateJwt, paymentCtrl.verifyPayment);
apiRouter.get("/invoices/:bookingId", paymentCtrl.getInvoiceByBooking);

// --- ADMIN AUTHENTICATION & SECURITY (SUPER_ADMIN ONLY) ---
apiRouter.post("/admin/auth/login", adminAuthCtrl.adminLogin);
apiRouter.post("/admin/auth/verify-mfa", adminAuthCtrl.verifyAdminMfa);
apiRouter.get("/admin/auth/me", authenticateJwt, adminAuthCtrl.getAdminMe);
apiRouter.post("/admin/auth/logout", authenticateJwt, adminAuthCtrl.adminLogout);
apiRouter.get("/admin/security/events", authenticateJwt, adminAuthCtrl.getSecurityEvents);
apiRouter.get("/admin/security/audit-logs", authenticateJwt, adminAuthCtrl.getAdminAuditLogs);
apiRouter.post("/admin/security/re-authenticate", authenticateJwt, adminAuthCtrl.reAuthenticateAdmin);

// --- ADMIN COMMAND CENTER (SUPER_ADMIN) ---
apiRouter.get("/admin/intelligence", adminCtrl.getFederationIntelligence);
apiRouter.get("/admin/heatmap", adminCtrl.getDemandHeatmap);
apiRouter.get("/admin/reviews", authenticateJwt, adminCtrl.getAllReviews);
apiRouter.get("/admin/payments", authenticateJwt, adminCtrl.getAllPayments);
apiRouter.get("/admin/workforce-exchanges", adminCtrl.getWorkforceExchanges);
apiRouter.post(
  "/admin/workforce-exchanges/:exchangeId/approve",
  authenticateJwt,
  requireRoles(USER_ROLES.SUPER_ADMIN),
  adminCtrl.approveWorkforceExchange
);
apiRouter.get("/admin/kyc-submissions", adminCtrl.getKycSubmissions);
apiRouter.post(
  "/admin/kyc/:workerId/review",
  authenticateJwt,
  requireRoles(USER_ROLES.SUPER_ADMIN),
  adminCtrl.reviewKycSubmission
);


// --- WORKER WELFARE & INSURANCE ---
apiRouter.get("/welfare", authenticateJwt, welfareCtrl.getWorkerWelfareOverview);
apiRouter.post("/welfare/claim", authenticateJwt, welfareCtrl.submitInsuranceClaim);
apiRouter.post("/complaints", authenticateJwt, welfareCtrl.fileComplaint);
apiRouter.get("/complaints", authenticateJwt, welfareCtrl.getComplaints);

// --- AI SERVICE PROXY / FALLBACKS ---
apiRouter.get("/ai/forecast", async (req, res) => {
  const service = String(req.query.service || "Electrician");
  const location = String(req.query.location || "Vijayawada");
  const days = Number(req.query.days || 7);
  const data = await AiService.getDemandForecast(service, location, days);
  res.json({ success: true, data });
});

apiRouter.get("/ai/skill-gap", async (req, res) => {
  const district = String(req.query.district || "Vijayawada");
  const data = await AiService.getSkillGap(district);
  res.json({ success: true, data });
});

apiRouter.get("/ai/surge", async (req, res) => {
  const service = String(req.query.service || "Electrician");
  const zone = String(req.query.zone || "Vijayawada Sector 4");
  const data = await AiService.getDemandSurge(service, zone);
  res.json({ success: true, data });
});

// --- MULTILINGUAL VOICE & TEXT-TO-SPEECH (TTS) ---
apiRouter.post("/tts", ttsCtrl.synthesizeSpeech);
apiRouter.get("/tts/voices", ttsCtrl.getVoiceConfig);

// --- STATUTORY IDENTITY DOCUMENTS & AVATARS ---
apiRouter.post("/documents/upload", authenticateJwt, docCtrl.uploadDocument);
apiRouter.get("/documents/:id", authenticateJwt, docCtrl.getDocument);
apiRouter.get("/documents/avatar/:id", docCtrl.getAvatar);

// --- AI4BHARAT (A14BHARAT) OPEN-SOURCE TRANSLATION ---
apiRouter.post("/translate", translationCtrl.translateText);
apiRouter.get("/translate/languages", translationCtrl.getSupportedLanguages);


