import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Worker } from "../models/Worker";
import { Booking } from "../models/Booking";
import { Review } from "../models/Review";
import { Society } from "../models/Society";
import { Federation } from "../models/Federation";
import { WorkforceExchange } from "../models/WorkforceExchange";
import { ServiceArea } from "../models/ServiceArea";
import { Notification } from "../models/Notification";
import { AdminWallet } from "../models/AdminWallet";
import { AiService } from "../services/aiService";
import { AuthenticatedRequest } from "../middleware/auth";

export const getFederationIntelligence = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const activeWorkers = await Worker.countDocuments({ isAvailable: true });
    const verifiedWorkers = await Worker.countDocuments({ verificationLevel: { $gte: 3 } });
    const totalSocieties = await Society.countDocuments();
    const totalUsers = await User.countDocuments();

    // Aggregate worker earnings
    const earningsAgg = await Worker.aggregate([
      { $group: { _id: null, total: { $sum: "$totalEarnings" } } }
    ]);
    const totalWorkerEarnings = earningsAgg[0]?.total || 0;

    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: "COMPLETED" });
    const emergencyBookings = await Booking.countDocuments({ bookingType: "EMERGENCY" });
    
    // Today's completed jobs
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const jobsCompletedToday = await Booking.countDocuments({
      status: "COMPLETED",
      updatedAt: { $gte: startOfToday }
    });

    // Calculate cooperative welfare / maintenance fees accumulated
    const paidBookings = await Booking.find({ paymentStatus: "PAID" });
    const cooperativeWelfareCorpusINR = paidBookings.reduce((sum, b) => {
      const fee = b.fairWageBreakdown?.adminMaintenanceFee ?? b.fairWageBreakdown?.cooperativeContribution ?? 50;
      return sum + fee;
    }, 0);

    // Dynamic average customer satisfaction
    const avgReviewAgg = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const averageCustomerSatisfaction = avgReviewAgg[0]?.avgRating
      ? Math.round(avgReviewAgg[0].avgRating * 10) / 10
      : 0.0;

    // Utilization Index by trade
    const trades = ["Electrician", "Plumber", "Carpenter", "Painter", "Caregiver", "Cleaner"];
    const utilizationMetrics = await Promise.all(
      trades.map(async (trade) => {
        const totalInTrade = await Worker.countDocuments({ skills: trade });
        const activeInTrade = await Worker.countDocuments({ skills: trade, isAvailable: true });
        const busyInTrade = await Worker.countDocuments({ skills: trade, activeJobsToday: { $gt: 0 } });
        const utilPct = totalInTrade > 0 ? Math.round(((totalInTrade - activeInTrade + busyInTrade) / totalInTrade) * 100) : 0;

        return {
          trade,
          total: totalInTrade,
          available: activeInTrade,
          utilizationPercent: totalInTrade > 0 ? Math.min(100, Math.max(0, utilPct)) : 0,
          status: totalInTrade === 0 ? "BALANCED" : (utilPct > 80 ? "HIGH_DEFICIT" : (utilPct < 45 ? "SURPLUS" : "BALANCED"))
        };
      })
    );

    res.json({
      success: true,
      data: {
        kpis: {
          totalWorkers,
          activeWorkers,
          verifiedWorkers,
          totalUsers,
          jobsCompletedToday,
          monthlyJobsCount: totalBookings,
          completedBookingsCount: completedBookings,
          totalWorkerEarningsINR: totalWorkerEarnings,
          averageCustomerSatisfaction,
          emergencyRequestsToday: emergencyBookings,
          cooperativeWelfareCorpusINR,
          affiliatedSocietiesCount: totalSocieties
        },
        workforceUtilization: utilizationMetrics,
        recentSurgeAlert: {
          isSurge: emergencyBookings > 0,
          trade: "Electrician",
          zone: "Vijayawada Central & Auto Nagar",
          surgePercentage: emergencyBookings > 0 ? "+45%" : "Nominal",
          message: emergencyBookings > 0
            ? "Emergency dispatch activity detected in Vijayawada region."
            : "Platform operations nominal across all cooperative zones."
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error loading intelligence dashboard." });
  }
};

export const getDemandHeatmap = async (_req: Request, res: Response): Promise<void> => {
  // Realistic GIS zones across Andhra Pradesh capital region
  const zones = [
    {
      zoneId: "ZONE-01",
      zoneName: "Vijayawada Central / Benz Circle",
      district: "Vijayawada",
      coordinates: [80.6480, 16.5062], // [lon, lat]
      demandLevel: "CRITICAL",
      demandVolume: 74,
      availableWorkers: 42,
      shortage: 32,
      topService: "Plumbing & Electrical",
      forecastTrend: "+34% this weekend",
      aiRecommendation: "Trigger Workforce Exchange: deploy 6 plumbers from Guntur East."
    },
    {
      zoneId: "ZONE-02",
      zoneName: "Auto Nagar Industrial Corridor",
      district: "Vijayawada",
      coordinates: [80.6820, 16.4950],
      demandLevel: "HIGH",
      demandVolume: 61,
      availableWorkers: 45,
      shortage: 16,
      topService: "Electrician",
      forecastTrend: "+29% tomorrow",
      aiRecommendation: "Activate 5 standby Level-4 industrial electricians."
    },
    {
      zoneId: "ZONE-03",
      zoneName: "Mangalagiri Artisan & Residential Belt",
      district: "Guntur",
      coordinates: [80.5680, 16.4350],
      demandLevel: "LOW",
      demandVolume: 18,
      availableWorkers: 34,
      shortage: 0,
      topService: "Painter & Carpenter",
      forecastTrend: "Steady (-4%)",
      aiRecommendation: "Surplus capacity of 8 artisans available for reallocation."
    },
    {
      zoneId: "ZONE-04",
      zoneName: "Guntur East Market Yard",
      district: "Guntur",
      coordinates: [80.4650, 16.2980],
      demandLevel: "MEDIUM",
      demandVolume: 35,
      availableWorkers: 48,
      shortage: 0,
      topService: "Plumber & Sanitation",
      forecastTrend: "Balanced (+2%)",
      aiRecommendation: "Surplus of 8 qualified plumbers available for Vijayawada Central deployment."
    },
    {
      zoneId: "ZONE-05",
      zoneName: "Amaravati Secretariat Zone",
      district: "Amaravati",
      coordinates: [80.5150, 16.5420],
      demandLevel: "MEDIUM",
      demandVolume: 29,
      availableWorkers: 31,
      shortage: 0,
      topService: "Technician & Facility Care",
      forecastTrend: "Nominal",
      aiRecommendation: "Maintain standard shift rotations."
    }
  ];

  res.json({
    success: true,
    totalZones: zones.length,
    zones
  });
};

export const getWorkforceExchanges = async (_req: Request, res: Response): Promise<void> => {
  try {
    let exchanges = await WorkforceExchange.find().sort({ createdAt: -1 });

    if (exchanges.length === 0) {
      // Seed default exchange recommendations from AI
      const aiRecs = await AiService.getWorkforceExchangeRecommendations();
      res.json({ success: true, exchanges: aiRecs });
      return;
    }

    res.json({ success: true, exchanges });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching exchanges." });
  }
};

export const approveWorkforceExchange = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { exchangeId } = req.params;

    let exchange = await WorkforceExchange.findOne({
      $or: [{ _id: exchangeId }, { exchangeCode: exchangeId }]
    });

    if (!exchange) {
      // Create if approving from AI recommendation
      exchange = await WorkforceExchange.create({
        exchangeCode: exchangeId || "EXC-2026-AP-01",
        federationId: req.user?.federationId || "64fa10000000000000000001",
        trade: "Plumber",
        sourceSocietyId: "64fa10000000000000000002",
        sourceSocietyName: "Guntur East Labour Cooperative Society",
        targetSocietyId: "64fa10000000000000000003",
        targetSocietyName: "Vijayawada Central Labour Cooperative Society",
        recommendedWorkersCount: 6,
        distanceKm: 34.0,
        dailyTravelAllowanceINR: 180,
        estimatedSurplusCount: 8,
        estimatedShortageCount: 10,
        unmetDemandPreventionPct: 82.5,
        aiRationale: "High municipal water connection maintenance surge detected in Vijayawada Central. Guntur East possesses 8 idle certified plumbers within 35 km transit corridor.",
        status: "APPROVED",
        approvedBy: req.user?._id,
        approvedAt: new Date(),
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]
      });
    } else {
      exchange.status = "APPROVED";
      exchange.approvedBy = req.user?._id;
      exchange.approvedAt = new Date();
      await exchange.save();
    }

    res.json({
      success: true,
      message: `Cooperative Workforce Exchange ${exchange.exchangeCode} approved! 6 Plumbers mobilised with ₹180 daily travel allowance.`,
      exchange
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Approval failed.", error: error.message });
  }
};

// --- WORKER KYC & ANTI-FRAUD ENGINE ENDPOINTS ---
export const getKycSubmissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const workers = await Worker.find()
      .select("name gender phone email avatarUrl skills experienceYears societyName verificationLevel verificationStatus preliminaryRiskScore approvedBy approvedAt rejectionReason auditHistory kycDocuments certificates createdAt employeeId workerIdNumber")
      .sort({ updatedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: workers.length,
      submissions: workers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching KYC submissions.", error: error.message });
  }
};

export const reviewKycSubmission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workerId } = req.params;
    const { action, documentType, rejectionReason, newLevel = 4 } = req.body;

    let worker = null;
    if (mongoose.Types.ObjectId.isValid(workerId)) {
      worker = await Worker.findById(workerId);
    }
    if (!worker) {
      const cleanId = String(workerId).replace(/^WRK-/, "");
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        worker = await Worker.findById(cleanId);
      }
    }
    if (!worker) {
      const cleanId = String(workerId).replace(/^WRK-/, "");
      worker = await Worker.findOne({
        $or: [
          { employeeId: workerId },
          { employeeId: cleanId },
          { workerIdNumber: workerId },
          { workerIdNumber: cleanId },
          { phone: workerId },
          { email: workerId }
        ]
      });
    }

    if (!worker) {
      res.status(404).json({ success: false, message: `Worker profile '${workerId}' not found in MongoDB Atlas.` });
      return;
    }

    const adminId = req.user?._id;

    const isDocMatch = (docType: string, targetType?: string) => {
      if (!targetType) return true;
      const s1 = String(docType || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const s2 = String(targetType || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (s1 === s2 || s1.includes(s2) || s2.includes(s1)) return true;
      if (s1.includes("aadhaar") && s2.includes("aadhaar")) return true;
      if (s1.includes("pan") && s2.includes("pan")) return true;
      if ((s1.includes("police") || s1.includes("pcc")) && (s2.includes("police") || s2.includes("pcc"))) return true;
      return false;
    };

    if (action === "APPROVE") {
      let matchedDoc = false;
      if (worker.kycDocuments && worker.kycDocuments.length > 0) {
        worker.kycDocuments.forEach((doc) => {
          if (!documentType || isDocMatch(doc.documentType, documentType)) {
            doc.verificationStatus = "VERIFIED";
            doc.verifiedAt = new Date();
            doc.verifiedBy = adminId;
            doc.fraudRiskScore = Math.min(doc.fraudRiskScore || 0, 5); // Cleared
            doc.rejectionReason = "";
            matchedDoc = true;
          }
        });
      }

      if (!matchedDoc && documentType) {
        let mappedType: "AADHAAR" | "PAN" | "POLICE_CLEARANCE" = "AADHAAR";
        const dtUpper = documentType.toUpperCase();
        if (dtUpper.includes("PAN")) mappedType = "PAN";
        else if (dtUpper.includes("POLICE") || dtUpper.includes("PCC")) mappedType = "POLICE_CLEARANCE";

        worker.kycDocuments.push({
          documentType: mappedType,
          documentNumber: "VERIFIED-RECORD",
          fileUrl: "",
          verificationStatus: "VERIFIED",
          fraudRiskScore: 0,
          fraudFlags: [],
          aiVerificationNotes: "Manually verified by Super Admin.",
          submittedAt: new Date(),
          verifiedAt: new Date(),
          verifiedBy: adminId
        } as any);
      }

      // Check if all documents are verified or if this is overall worker certification
      const hasUnverifiedDocs = worker.kycDocuments.some((d) => d.verificationStatus !== "VERIFIED");
      if (!documentType || !hasUnverifiedDocs) {
        worker.verificationStatus = "VERIFIED";
        worker.verificationLevel = Math.min(5, Math.max(worker.verificationLevel || 1, Number(newLevel) || 4));
        worker.isAvailable = true;
        worker.approvedBy = adminId;
        worker.approvedAt = new Date();
        worker.rejectionReason = "";

        if (worker.userId) {
          await User.findByIdAndUpdate(worker.userId, { status: "ACTIVE" });
        }
      } else {
        worker.verificationStatus = "UNDER_REVIEW";
      }

      // Update timeline
      if (!worker.verificationTimeline) worker.verificationTimeline = [];
      worker.verificationTimeline.push({
        level: worker.verificationLevel,
        title: documentType ? `${documentType} Verified by Super Admin` : `KYC Dossier Fully Certified`,
        verified: true,
        verifiedAt: new Date(),
        notes: documentType
          ? `${documentType} manually inspected and verified.`
          : "Statutory documents manually inspected and certified by Super Admin."
      });

      // Append audit history
      if (!worker.auditHistory) worker.auditHistory = [];
      worker.auditHistory.push({
        action: documentType ? `DOCUMENT_APPROVED_${documentType.toUpperCase().replace(/\s+/g, "_")}` : "WORKER_APPROVED",
        performedBy: adminId || new mongoose.Types.ObjectId("65b900000000000000000001"),
        timestamp: new Date(),
        details: documentType
          ? `Document ${documentType} approved by Super Admin.`
          : `Approved by Super Admin with Level ${worker.verificationLevel} cooperative badge.`
      });

      await worker.save();

      res.json({
        success: true,
        message: documentType
          ? `${documentType} verified successfully.`
          : `Worker ${worker.name} successfully certified with Level ${worker.verificationLevel} badge!`,
        worker
      });
    } else if (action === "BLACKLIST") {
      worker.verificationStatus = "REJECTED";
      worker.isAvailable = false;
      const reason = rejectionReason || "Critical fraud: Tampered or forged credentials detected. Blacklisted under statutory bylaws.";
      worker.rejectionReason = reason;

      worker.kycDocuments.forEach((doc) => {
        if (!documentType || isDocMatch(doc.documentType, documentType)) {
          doc.verificationStatus = "REJECTED";
          doc.fraudRiskScore = 95;
          doc.fraudFlags = doc.fraudFlags || [];
          if (!doc.fraudFlags.includes("CRITICAL_FRAUD: BLACKLISTED")) {
            doc.fraudFlags.push("CRITICAL_FRAUD: BLACKLISTED");
          }
          doc.aiVerificationNotes = reason;
          doc.rejectionReason = reason;
        }
      });

      if (!worker.auditHistory) worker.auditHistory = [];
      worker.auditHistory.push({
        action: "WORKER_BLACKLISTED",
        performedBy: adminId || new mongoose.Types.ObjectId("65b900000000000000000001"),
        timestamp: new Date(),
        details: reason
      });

      await worker.save();

      if (worker.userId) {
        await User.findByIdAndUpdate(worker.userId, { status: "SUSPENDED" });
      }

      res.json({
        success: true,
        message: `Fraud alert enforced: Worker ${worker.name} has been blacklisted.`,
        worker
      });
    } else if (action === "REUPLOAD") {
      const feedback = rejectionReason || "Document scan has glare or low resolution. Please provide a clear original scan.";
      if (worker.kycDocuments && worker.kycDocuments.length > 0) {
        worker.kycDocuments.forEach((doc) => {
          if (!documentType || isDocMatch(doc.documentType, documentType)) {
            doc.verificationStatus = "REUPLOAD_REQUESTED";
            doc.aiVerificationNotes = feedback;
            doc.rejectionReason = feedback;
          }
        });
      }

      worker.verificationStatus = "REUPLOAD_REQUESTED";
      worker.rejectionReason = feedback;

      if (!worker.auditHistory) worker.auditHistory = [];
      worker.auditHistory.push({
        action: documentType ? `REUPLOAD_REQUESTED_${documentType.toUpperCase().replace(/\s+/g, "_")}` : "REUPLOAD_REQUESTED",
        performedBy: adminId || new mongoose.Types.ObjectId("65b900000000000000000001"),
        timestamp: new Date(),
        details: feedback
      });

      await worker.save();

      if (worker.userId) {
        await User.findByIdAndUpdate(worker.userId, { rejectionReason: feedback }).catch(() => {});
      }

      res.json({
        success: true,
        message: `Re-upload requested for ${documentType || "documents"}. Worker alerted.`,
        worker
      });
    } else {
      // General REJECT
      const reason = rejectionReason || "Document illegible or failed statutory verification criteria.";
      if (documentType) {
        worker.kycDocuments.forEach((doc) => {
          if (isDocMatch(doc.documentType, documentType)) {
            doc.verificationStatus = "REJECTED";
            doc.aiVerificationNotes = reason;
            doc.rejectionReason = reason;
          }
        });
        worker.verificationStatus = "UNDER_REVIEW";
        worker.rejectionReason = `Document ${documentType} rejected: ${reason}`;
      } else {
        worker.verificationStatus = "REJECTED";
        worker.isAvailable = false;
        worker.rejectionReason = reason;
        worker.kycDocuments.forEach((doc) => {
          doc.verificationStatus = "REJECTED";
          doc.rejectionReason = reason;
        });

        if (worker.userId) {
          await User.findByIdAndUpdate(worker.userId, { status: "SUSPENDED" });
        }
      }

      if (!worker.auditHistory) worker.auditHistory = [];
      worker.auditHistory.push({
        action: documentType ? `DOCUMENT_REJECTED_${documentType.toUpperCase().replace(/\s+/g, "_")}` : "WORKER_REJECTED",
        performedBy: adminId || new mongoose.Types.ObjectId("65b900000000000000000001"),
        timestamp: new Date(),
        details: reason
      });

      await worker.save();

      res.json({
        success: true,
        message: `Worker ${worker.name} KYC rejected.`,
        worker
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: "KYC review failed.", error: error.message });
  }
};

/**
 * Super Admin & Registrar: Fetch All Reviews with customer, worker, and work proof media
 */
export const getAllReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find()
      .populate("customerId", "name email phone district")
      .populate("workerId", "name primaryTrade phone rating reviewCount profilePhoto")
      .populate("bookingId", "bookingNumber serviceType scheduledDate scheduledTime totalAmount status paymentStatus")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error: any) {
    console.error("getAllReviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews.", error: error.message });
  }
};

/**
 * Super Admin & Registrar: Fetch All Payments with UPI/Escrow breakdown
 */
export const getAllPayments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "name email phone district")
      .populate("workerId", "name primaryTrade phone rating")
      .sort({ updatedAt: -1 });

    const totalCollected = bookings
      .filter((b) => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + (b.fairWageBreakdown?.customerPaid || 0), 0);

    const payments = bookings.map((b) => ({
      _id: b._id,
      bookingNumber: b.bookingNumber,
      serviceCategory: b.serviceCategory,
      scheduledAt: b.scheduledAt,
      customer: b.customerId,
      worker: b.workerId,
      amount: b.fairWageBreakdown?.customerPaid || 0,
      workerEarning: b.fairWageBreakdown?.workerEarning || 0,
      cooperativeFee: b.fairWageBreakdown?.cooperativeContribution || 0,
      taxGst: b.fairWageBreakdown?.taxGst || 0,
      paymentStatus: b.paymentStatus,
      paymentId: b.paymentId || `UPI-${b.bookingNumber?.slice(-6) || "REF"}`,
      bookingStatus: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    }));

    res.json({
      success: true,
      count: payments.length,
      totalCollectedINR: totalCollected,
      payments
    });
  } catch (error: any) {
    console.error("getAllPayments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch payments.", error: error.message });
  }
};

/**
 * Super Admin: Get all service areas with counts and metrics
 */
export const getAdminServiceAreas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const areas = await ServiceArea.find().sort({ state: 1, city: 1 });
    const activeCount = areas.filter((a) => a.isActive).length;
    const comingSoonCount = areas.filter((a) => !a.isActive).length;

    // Calculate total unique active pincodes covered
    const activePincodeSet = new Set<string>();
    areas.forEach((a) => {
      if (a.isActive && Array.isArray(a.pincodes)) {
        a.pincodes.forEach((p) => activePincodeSet.add(p));
      }
    });

    // Count registered users located in currently active pincodes
    let totalCoveredUsers = 0;
    try {
      if (activePincodeSet.size > 0) {
        totalCoveredUsers = await User.countDocuments({
          pincode: { $in: Array.from(activePincodeSet) }
        });
      }
    } catch {}

    res.json({
      success: true,
      data: {
        total: areas.length,
        activeCount,
        comingSoonCount,
        totalPincodes: activePincodeSet.size,
        totalCoveredUsers,
        areas
      }
    });
  } catch (error: any) {
    console.error("getAdminServiceAreas error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch service areas.", error: error.message });
  }
};

/**
 * Super Admin: Toggle or update service area active status
 */
export const toggleServiceArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const area = await ServiceArea.findById(id);
    if (!area) {
      res.status(404).json({ success: false, message: "Service area not found." });
      return;
    }

    if (typeof isActive === "boolean") {
      area.isActive = isActive;
    } else {
      area.isActive = !area.isActive;
    }

    if (area.isActive && area.launchPhase === "FUTURE_EXPANSION") {
      area.launchPhase = "PHASE_1_LAUNCH";
    }

    await area.save();

    // Inform existing customers & workers in that area's pincodes
    let notifiedCount = 0;
    try {
      if (Array.isArray(area.pincodes) && area.pincodes.length > 0) {
        const affectedUsers = await User.find({ pincode: { $in: area.pincodes } });
        if (affectedUsers.length > 0) {
          const notifs = affectedUsers.map((u) => ({
            userId: u._id,
            title: area.isActive
              ? `COOPNEX Service Now Active in ${area.city}`
              : `COOPNEX Service Temporarily Paused in ${area.city}`,
            message: area.isActive
              ? `Great news! Cooperative dispatch service in ${area.city}, ${area.district} (PIN: ${u.pincode}) is now active. Verified artisans are ready for dispatch!`
              : `Notice: Operations in ${area.city}, ${area.district} (PIN: ${u.pincode}) are temporarily suspended. We are coordinating with local cooperatives to resume coverage soon.`,
            type: "SYSTEM",
            read: false,
            metadata: { serviceAreaId: area._id, pincode: u.pincode, event: area.isActive ? "AREA_ACTIVATED" : "AREA_DEACTIVATED" }
          }));
          await Notification.insertMany(notifs);
          notifiedCount = affectedUsers.length;
        }
      }
    } catch (notifErr) {
      console.warn("Could not dispatch toggle notifications:", notifErr);
    }

    res.json({
      success: true,
      message: `Service area ${area.city}, ${area.district} is now ${area.isActive ? "ACTIVE" : "INACTIVE"}. Notified ${notifiedCount} user(s).`,
      data: area,
      notifiedCount
    });
  } catch (error: any) {
    console.error("toggleServiceArea error:", error);
    res.status(500).json({ success: false, message: "Failed to toggle service area.", error: error.message });
  }
};

/**
 * Super Admin: Expand service area with new pincodes
 */
export const expandServiceAreaPincodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid service area ID format." });
      return;
    }

    let rawPins = req.body.pincodes ?? req.body.pincode ?? req.body;
    if (typeof rawPins === "string") {
      try {
        const parsed = JSON.parse(rawPins);
        if (Array.isArray(parsed)) rawPins = parsed;
      } catch {
        // keep as string
      }
    }

    let newPins: string[] = [];
    if (Array.isArray(rawPins)) {
      newPins = rawPins.map((p) => String(p).trim()).filter((p) => /^[1-9][0-9]{5}$/.test(p));
    } else if (typeof rawPins === "string") {
      newPins = rawPins.split(/[,\s]+/).map((p) => p.trim()).filter((p) => /^[1-9][0-9]{5}$/.test(p));
    }

    if (newPins.length === 0) {
      res.status(400).json({ success: false, message: "Please enter at least one valid 6-digit Indian PIN code." });
      return;
    }

    const area = await ServiceArea.findById(id);
    if (!area) {
      res.status(404).json({ success: false, message: "Service area not found." });
      return;
    }

    const existingSet = new Set(area.pincodes || []);
    const addedPins: string[] = [];
    for (const pin of newPins) {
      if (!existingSet.has(pin)) {
        existingSet.add(pin);
        addedPins.push(pin);
      }
    }

    if (addedPins.length === 0) {
      res.json({
        success: true,
        message: "All provided pincodes are already part of this service area.",
        data: { area, addedPincodes: [] }
      });
      return;
    }

    area.pincodes = Array.from(existingSet);
    area.isActive = true;
    area.launchPhase = "PHASE_1_LAUNCH";
    await area.save();

    // Inform existing customers & workers already in database with these pincodes
    let notifiedUsersCount = 0;
    try {
      const affectedUsers = await User.find({ pincode: { $in: addedPins } });
      if (affectedUsers.length > 0) {
        const notifs = affectedUsers.map((u) => ({
          userId: u._id,
          title: `COOPNEX Service Now Live in Your Area (${u.pincode})`,
          message: `Great news! COOPNEX cooperative marketplace is now active in ${area.city} (PIN: ${u.pincode}). Verified artisans are ready for immediate dispatch!`,
          type: "SYSTEM",
          read: false,
          metadata: { serviceAreaId: area._id, pincode: u.pincode, event: "AREA_EXPANDED" }
        }));
        await Notification.insertMany(notifs);
        notifiedUsersCount = affectedUsers.length;
      }
    } catch (notifErr) {
      console.warn("Could not dispatch expansion notifications:", notifErr);
    }

    res.json({
      success: true,
      message: `Expanded ${area.city} with ${addedPins.length} new pincode(s) (${addedPins.join(", ")}). Notified ${notifiedUsersCount} registered user(s).`,
      data: {
        area,
        addedPincodes: addedPins,
        notifiedUsersCount
      }
    });
  } catch (error: any) {
    console.error("expandServiceAreaPincodes error:", error);
    res.status(500).json({ success: false, message: "Failed to expand service area.", error: error.message });
  }
};

/**
 * Super Admin: Remove a pincode from a service area
 */
export const removeServiceAreaPincode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, pincode } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid service area ID format." });
      return;
    }

    const cleanPin = String(pincode).trim();

    const area = await ServiceArea.findById(id);
    if (!area) {
      res.status(404).json({ success: false, message: "Service area not found." });
      return;
    }

    const prevList = area.pincodes || [];
    area.pincodes = prevList.filter((p) => p !== cleanPin);
    await area.save();

    // Inform customers & workers already in database for this pincode
    let notifiedUsersCount = 0;
    try {
      const affectedUsers = await User.find({ pincode: cleanPin });
      if (affectedUsers.length > 0) {
        const notifs = affectedUsers.map((u) => ({
          userId: u._id,
          title: `COOPNEX Service Update: PIN ${cleanPin}`,
          message: `Important notice: Cooperative dispatch service in PIN ${cleanPin} is currently unavailable. We are working with regional federations to restore active coverage soon.`,
          type: "SYSTEM",
          read: false,
          metadata: { serviceAreaId: area._id, pincode: cleanPin, event: "PINCODE_REMOVED" }
        }));
        await Notification.insertMany(notifs);
        notifiedUsersCount = affectedUsers.length;
      }
    } catch (notifErr) {
      console.warn("Could not dispatch removal notifications:", notifErr);
    }

    res.json({
      success: true,
      message: `Pincode ${cleanPin} removed from ${area.city}. Notified ${notifiedUsersCount} affected user(s).`,
      data: {
        area,
        removedPincode: cleanPin,
        notifiedUsersCount
      }
    });
  } catch (error: any) {
    console.error("removeServiceAreaPincode error:", error);
    res.status(500).json({ success: false, message: "Failed to remove pincode.", error: error.message });
  }
};

/**
 * Super Admin: Activate all service areas across the state
 */
export const activateAllServiceAreas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await ServiceArea.updateMany({}, { $set: { isActive: true, launchPhase: "PHASE_1_LAUNCH" } });
    const areas = await ServiceArea.find().sort({ state: 1, city: 1 });
    res.json({
      success: true,
      message: `All ${areas.length} service coverage sectors have been fully activated across Andhra Pradesh!`,
      modifiedCount: result.modifiedCount,
      areas
    });
  } catch (error: any) {
    console.error("activateAllServiceAreas error:", error);
    res.status(500).json({ success: false, message: "Failed to activate all service areas.", error: error.message });
  }
};

/**
 * Super Admin: Get Admin Treasury Wallet & Commission Corpus
 */
export const getAdminWallet = async (_req: Request, res: Response): Promise<void> => {
  try {
    let wallet = await AdminWallet.findOne();
    if (!wallet) {
      wallet = await AdminWallet.create({
        totalBalance: 0,
        totalCommissionCollected: 0,
        totalWelfareFundCollected: 0,
        totalTransactions: 0,
        transactions: []
      });
    }
    res.json({
      success: true,
      wallet
    });
  } catch (error: any) {
    console.error("getAdminWallet error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve admin wallet.", error: error.message });
  }
};

/**
 * Super Admin: Delete a service area
 */
export const deleteServiceArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const area = await ServiceArea.findByIdAndDelete(id);
    if (!area) {
      res.status(404).json({ success: false, message: "Service area not found." });
      return;
    }

    try {
      if (Array.isArray(area.pincodes) && area.pincodes.length > 0) {
        const affectedUsers = await User.find({ pincode: { $in: area.pincodes } });
        if (affectedUsers.length > 0) {
          const notifs = affectedUsers.map((u) => ({
            userId: u._id,
            title: `COOPNEX Notice for ${area.city}`,
            message: `Operations in ${area.city}, ${area.district} have been deactivated. We apologize for any inconvenience.`,
            type: "SYSTEM",
            read: false
          }));
          await Notification.insertMany(notifs);
        }
      }
    } catch {}

    res.json({ success: true, message: `Service area ${area.city} deleted successfully.` });
  } catch (error: any) {
    console.error("deleteServiceArea error:", error);
    res.status(500).json({ success: false, message: "Failed to delete service area.", error: error.message });
  }
};

/**
 * Super Admin: Create a new service area
 */
export const createServiceArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      state,
      stateCode,
      district,
      city,
      pincodePrefixes,
      pincodes,
      location,
      isActive,
      launchPhase,
      supportedServices,
      cooperativeName,
      nearestHub,
      nearestHubCoordinates,
      slaMinutes
    } = req.body;

    if (!state || !stateCode || !district || !city || !pincodePrefixes || !location?.coordinates) {
      res.status(400).json({
        success: false,
        message: "state, stateCode, district, city, pincodePrefixes, and location coordinates are required."
      });
      return;
    }

    const newArea = await ServiceArea.create({
      state,
      stateCode: stateCode.toUpperCase(),
      district,
      city,
      pincodePrefixes: Array.isArray(pincodePrefixes) ? pincodePrefixes : [pincodePrefixes],
      pincodes: pincodes || [],
      location: {
        type: "Point",
        coordinates: location.coordinates
      },
      isActive: Boolean(isActive),
      launchPhase: launchPhase || (isActive ? "PHASE_1_LAUNCH" : "FUTURE_EXPANSION"),
      supportedServices: supportedServices || [
        "Electrician", "Plumber", "Carpenter", "Painter", "Cleaner",
        "Caregiver", "Driver", "Gardener", "Technician", "Domestic Helper"
      ],
      cooperativeName,
      nearestHub,
      nearestHubCoordinates,
      slaMinutes: slaMinutes || 45
    });

    res.status(201).json({
      success: true,
      message: `Service area for ${city} created successfully.`,
      data: newArea
    });
  } catch (error: any) {
    console.error("createServiceArea error:", error);
    res.status(500).json({ success: false, message: "Failed to create service area.", error: error.message });
  }
};

/**
 * Super Admin: Track Every Single User Booking with Worker Acceptance & Payment Status
 */
export const getAllBookingsAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "name email phone district address city")
      .populate("workerId", "name phone primaryTrade skills rating avatarUrl employeeId societyName verificationLevel")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => {
      const isAccepted = ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(b.status);
      const isPending = ["REQUESTED", "MATCHING", "ASSIGNED"].includes(b.status);
      const isRejected = b.status === "REJECTED";
      const isCancelled = b.status === "CANCELLED";

      let acceptanceStatus = "PENDING_ACCEPTANCE";
      if (isAccepted) acceptanceStatus = "ACCEPTED";
      else if (isRejected) acceptanceStatus = "REJECTED_BY_WORKER";
      else if (isCancelled) acceptanceStatus = "CANCELLED";

      return {
        _id: b._id,
        bookingNumber: b.bookingNumber,
        serviceCategory: b.serviceCategory,
        requirementDescription: b.requirementDescription,
        serviceLocation: b.serviceLocation,
        bookingType: b.bookingType,
        status: b.status,
        workerAccepted: isAccepted,
        acceptanceStatus,
        customer: b.customerId || {
          name: b.customerName,
          phone: b.customerPhone || "Unspecified"
        },
        worker: b.workerId || (b.workerName ? {
          name: b.workerName,
          phone: b.workerPhone || "Unspecified",
          primaryTrade: b.serviceCategory
        } : null),
        scheduledAt: b.scheduledAt,
        fairWageBreakdown: {
          customerPaid: b.fairWageBreakdown?.customerPaid || 350,
          workerEarning: b.fairWageBreakdown?.workerEarning || 300,
          adminMaintenanceFee: b.fairWageBreakdown?.adminMaintenanceFee ?? 50,
          cooperativeContribution: b.fairWageBreakdown?.cooperativeContribution ?? 50,
          baseWorkerWage: b.fairWageBreakdown?.baseWorkerWage || 300
        },
        paymentStatus: b.paymentStatus || "PENDING",
        paymentId: b.paymentId,
        escrowStatus: b.escrowStatus || (b.paymentStatus === "PAID" ? "HELD_24H" : undefined),
        escrowMaturesAt: b.escrowMaturesAt,
        statusTimeline: b.statusTimeline,
        rating: b.rating,
        reviewComment: b.reviewComment,
        completedAt: b.completedAt,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      bookings: formatted
    });
  } catch (error: any) {
    console.error("getAllBookingsAdmin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings.", error: error.message });
  }
};

/**
 * Super Admin: Track Every Registered User (Citizen Customers, Workers, Society Admins)
 */
export const getAllUsersAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const bookingCounts = await Booking.aggregate([
      { $match: { customerId: { $in: userIds } } },
      { $group: { _id: "$customerId", count: { $sum: 1 } } }
    ]);
    const countMap = new Map(bookingCounts.map((b) => [String(b._id), b.count]));

    const formattedUsers = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || "Not provided",
      role: u.role,
      status: u.status || "ACTIVE",
      district: u.district || "Vijayawada",
      city: u.city || "",
      address: u.address || "",
      bookingCount: countMap.get(String(u._id)) || 0,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    }));

    res.json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers
    });
  } catch (error: any) {
    console.error("getAllUsersAdmin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch registered users.", error: error.message });
  }
};

/**
 * Super Admin: Adjust & Increase Worker Star Rating based on reviews & performance
 */
export const updateWorkerRatingAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workerId } = req.params;
    const { rating, stars, reason = "Official cooperative merit recognition" } = req.body;

    const rawRating = rating ?? stars;
    const newRating = Number(rawRating);
    if (isNaN(newRating) || newRating < 1 || newRating > 5) {
      res.status(400).json({ success: false, message: "Rating must be a valid number between 1.0 and 5.0." });
      return;
    }

    let worker = null;
    if (mongoose.Types.ObjectId.isValid(workerId)) {
      worker = await Worker.findById(workerId);
    }
    if (!worker) {
      const cleanId = String(workerId).replace(/^WRK-/, "");
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        worker = await Worker.findById(cleanId);
      }
    }
    if (!worker) {
      worker = await Worker.findOne({
        $or: [
          { employeeId: workerId },
          { workerIdNumber: workerId },
          { phone: workerId },
          { email: workerId }
        ]
      });
    }

    if (!worker) {
      res.status(404).json({ success: false, message: `Worker '${workerId}' not found in MongoDB.` });
      return;
    }

    const previousRating = worker.rating || 5.0;
    worker.rating = Math.round(newRating * 10) / 10;
    worker.reviewCount = Math.max(worker.reviewCount || 0, 1);

    if (!worker.auditHistory) worker.auditHistory = [];
    worker.auditHistory.push({
      action: "ADMIN_RATING_OVERRIDE",
      performedBy: req.user?._id || new mongoose.Types.ObjectId("65b900000000000000000001"),
      timestamp: new Date(),
      details: `Rating adjusted by Super Admin from ${previousRating} to ${worker.rating} stars. Reason: ${reason}`
    });

    await worker.save();

    res.json({
      success: true,
      message: `Worker ${worker.name} rating successfully updated to ${worker.rating} stars!`,
      worker: {
        _id: worker._id,
        name: worker.name,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        auditHistory: worker.auditHistory
      }
    });
  } catch (error: any) {
    console.error("updateWorkerRatingAdmin error:", error);
    res.status(500).json({ success: false, message: "Failed to update worker rating.", error: error.message });
  }
};



