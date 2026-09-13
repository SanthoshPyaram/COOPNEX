import { Request, Response } from "express";
import mongoose from "mongoose";
import { Worker } from "../models/Worker";
import { User } from "../models/User";
import { GeoService } from "../services/geoService";
import { AiService } from "../services/aiService";
import { AuthenticatedRequest } from "../middleware/auth";
import { ServiceCoverageEngine } from "../services/serviceCoverageEngine";
import { saveDocument } from "../services/documentService";

export const getWorkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill, district, minRating, verificationLevel, isAvailable, emergencyReady, gender, pincode } = req.query;

    const filter: any = {};
    if (skill) {
      filter.skills = { $in: [new RegExp(String(skill), "i")] };
    }
    if (gender && gender !== "ALL") {
      filter.gender = gender;
    }
    if (district) {
      filter.district = new RegExp(String(district), "i");
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    if (verificationLevel) {
      filter.verificationLevel = { $gte: Number(verificationLevel) };
    }
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }
    if (emergencyReady !== undefined) {
      filter.emergencyReady = emergencyReady === "true";
    }

    if (req.query.includeUnverified !== "true") {
      filter.verificationStatus = { $in: ["VERIFIED", "APPROVED"] };
    }

    // Resolve location info if pincode or district provided
    const pinStr = pincode ? String(pincode).trim() : "";
    const distStr = district ? String(district).trim() : "";
    let locationMeta: any = null;

    if (pinStr && pinStr.length === 6) {
      locationMeta = await ServiceCoverageEngine.checkAvailabilityAsync(pinStr);
    } else if (distStr) {
      locationMeta = await ServiceCoverageEngine.checkAvailabilityAsync(distStr);
    }

    // Protection: If area is unsupported / coming soon, strictly return empty workers
    if (locationMeta && !locationMeta.available) {
      res.json({
        success: true,
        count: 0,
        available: false,
        locationStatus: "COMING_SOON",
        pincode: pinStr || undefined,
        district: locationMeta.district || distStr,
        city: locationMeta.city || distStr,
        workers: [],
        message: "Workers aren't available in your locality yet. We're working to bring COOPNEX services to your area."
      });
      return;
    }

    if (locationMeta?.district) {
      const cleanDist = locationMeta.district.replace(/\s*District.*$/i, "").trim();
      filter.$or = [
        { district: new RegExp(cleanDist, "i") },
        { district: new RegExp(locationMeta.city, "i") }
      ];
    } else if (distStr) {
      filter.district = new RegExp(distStr, "i");
    }

    let workers = await Worker.find(filter).sort({ rating: -1, verificationLevel: -1 }).limit(50);

    const targetCity = locationMeta?.city || distStr || "";
    const targetDistrict = locationMeta?.district || distStr || "";

    const sanitizedWorkers = workers.map((w: any) => {
      const doc = typeof w.toObject === "function" ? w.toObject() : { ...w };

      if (doc.kycDocuments) {
        doc.kycDocuments = doc.kycDocuments.map((k: any) => ({
          documentType: k.documentType,
          verificationStatus: k.verificationStatus,
          verifiedAt: k.verifiedAt
        }));
      }
      return doc;
    });

    res.json({
      success: true,
      count: sanitizedWorkers.length,
      available: true,
      locationStatus: "AVAILABLE",
      pincode: pinStr || undefined,
      district: targetDistrict,
      city: targetCity,
      workers: sanitizedWorkers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to retrieve workers.", error: error.message });
  }
};

export const getServiceCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const standardTrades = [
      { id: "electrician", name: "Electrician", icon: "⚡", description: "Wiring, circuit boards, appliance installation & power safety" },
      { id: "plumber", name: "Plumber", icon: "🔧", description: "Leak repairs, pipe fitting, drainage & sanitation systems" },
      { id: "carpenter", name: "Carpenter", icon: "🪚", description: "Furniture fabrication, door/window fitting & structural woodwork" },
      { id: "painter", name: "Painter", icon: "🎨", description: "Interior & exterior wall painting, waterproof coatings & plastering" },
      { id: "cleaner", name: "Cleaner", icon: "🧹", description: "Deep home sanitization, kitchen/bathroom hygiene & debris clearance" },
      { id: "technician", name: "Technician", icon: "⚙️", description: "AC servicing, inverter maintenance & electronics diagnostics" },
      { id: "caregiver", name: "Caregiver", icon: "🤝", description: "Elderly home assistance, patient nursing support & mobility aid" },
      { id: "domestic-helper", name: "Domestic Helper", icon: "✨", description: "Daily household support, laundry, kitchen aid & meal preparation" },
      { id: "driver", name: "Driver", icon: "🚗", description: "Certified passenger transit, commercial logistics & emergency vehicle ops" },
      { id: "gardener", name: "Gardener", icon: "🌱", description: "Landscape curation, horticultural care & seasonal terrace maintenance" }
    ];

    // Aggregations from real Worker database collection
    const allWorkers = await Worker.find({}, "skills isAvailable baseHourlyRate rating reviewCount").lean();

    const categories = standardTrades.map((trade) => {
      const matchingWorkers = allWorkers.filter((w: any) =>
        Array.isArray(w.skills) && w.skills.some((s: string) => s.toLowerCase().includes(trade.name.toLowerCase()))
      );

      const availableCount = matchingWorkers.filter((w: any) => w.isAvailable).length;
      const hourlyRates = matchingWorkers.map((w: any) => w.baseHourlyRate).filter((r: any) => typeof r === "number" && r > 0);
      const floorPrice = hourlyRates.length > 0 ? Math.min(...hourlyRates) : 350;
      const ratings = matchingWorkers.map((w: any) => w.rating).filter((r: any) => typeof r === "number" && r > 0);
      const avgRating = ratings.length > 0 ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)) : 4.8;

      return {
        ...trade,
        workerCount: matchingWorkers.length,
        availableCount,
        floorPrice,
        avgRating,
        cooperativeGuarantee: "100% Direct Pay • 0% Commission"
      };
    });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error: any) {
    console.error("getServiceCategories error:", error);
    res.status(500).json({ success: false, message: "Failed to load service categories." });
  }
};

export const getNearbyWorkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      lat,
      lon,
      radiusKm = 10,
      service = "Electrician",
      isEmergency = "false"
    } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        success: false,
        message: "Customer coordinates (lat, lon) are required to locate nearby artisans."
      });
      return;
    }

    const customerLat = Number(lat);
    const customerLon = Number(lon);
    const maxDistMeters = Number(radiusKm) * 1000;
    const emergencyMode = isEmergency === "true";

    let candidateWorkers = [];

    // Try MongoDB native 2dsphere $near query
    try {
      candidateWorkers = await Worker.find({
        skills: { $in: [new RegExp(String(service), "i")] },
        isAvailable: true,
        verificationStatus: "VERIFIED",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [customerLon, customerLat]
            },
            $maxDistance: maxDistMeters
          }
        }
      }).limit(20);
    } catch (geoErr) {
      // Resilient fallback: fetch active workers for this trade and filter via spherical distance
      const allForTrade = await Worker.find({
        skills: { $in: [new RegExp(String(service), "i")] },
        isAvailable: true,
        verificationStatus: "VERIFIED"
      }).limit(30);

      candidateWorkers = allForTrade.filter(w => {
        const coords = w.location?.coordinates || [80.648, 16.506];
        const dist = GeoService.calculateDistanceKm(customerLat, customerLon, coords[1], coords[0]);
        return dist <= Number(radiusKm);
      });
    }

    if (candidateWorkers.length === 0) {
      // Broaden search if radius is tight
      candidateWorkers = await Worker.find({
        skills: { $in: [new RegExp(String(service), "i")] },
        verificationStatus: "VERIFIED"
      }).limit(10);
    }

    // Pass through AI Matching & Ranking Engine
    const aiRanking = await AiService.rankCandidateWorkers(
      candidateWorkers,
      String(service),
      customerLat,
      customerLon,
      emergencyMode
    );

    res.json({
      success: true,
      service,
      customerLocation: { latitude: customerLat, longitude: customerLon },
      isEmergency: emergencyMode,
      matchedCount: candidateWorkers.length,
      data: aiRanking
    });
  } catch (error: any) {
    console.error("getNearbyWorkers error:", error);
    res.status(500).json({ success: false, message: "Geospatial worker search failed.", error: error.message });
  }
};

export const getWorkerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate("societyId", "name district officeLocation serviceRadiusKm contactPhone")
      .populate("federationId", "name headquarters state");

    if (!worker) {
      res.status(404).json({ success: false, message: "Worker not found." });
      return;
    }

    const sanitized: any = worker.toObject();
    delete sanitized.location;

    res.json({ success: true, worker: sanitized });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching worker profile." });
  }
};

export const updateVerification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workerId } = req.params;
    const { level, status, notes } = req.body;

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
      res.status(404).json({ success: false, message: "Worker not found." });
      return;
    }

    if (level !== undefined) worker.verificationLevel = level;
    if (status !== undefined) worker.verificationStatus = status;

    if (status === "VERIFIED" || status === "APPROVED") {
      worker.verificationStatus = "VERIFIED";
      worker.approvedBy = req.user?._id;
      worker.approvedAt = new Date();
      if (worker.userId) {
        await User.findByIdAndUpdate(worker.userId, { status: "ACTIVE" });
      }
    }

    if (notes) {
      worker.verificationTimeline.push({
        level: level || worker.verificationLevel,
        title: `Verification level updated to ${level || worker.verificationLevel}`,
        verified: status === "VERIFIED" || status === "APPROVED",
        verifiedAt: new Date(),
        notes
      });
    }

    await worker.save();

    res.json({
      success: true,
      message: "Worker verification status updated successfully.",
      worker
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update verification." });
  }
};

export const updateAvailability = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { isAvailable, emergencyReady } = req.body;
    const worker = await Worker.findOne({
      $or: [
        { userId: req.user?._id },
        ...(req.user?.email ? [{ email: req.user.email.toLowerCase() }] : [])
      ]
    });

    if (!worker) {
      res.status(404).json({ success: false, message: "Worker profile not found for this account." });
      return;
    }

    if (isAvailable !== undefined) worker.isAvailable = isAvailable;
    if (emergencyReady !== undefined) worker.emergencyReady = emergencyReady;

    await worker.save();

    res.json({
      success: true,
      message: "Availability preferences saved.",
      isAvailable: worker.isAvailable,
      emergencyReady: worker.emergencyReady
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating availability." });
  }
};

export const getWorkerMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const worker = await Worker.findOne({
      $or: [
        { userId: req.user._id },
        ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
        ...(req.user.employeeId ? [{ employeeId: req.user.employeeId }, { workerIdNumber: req.user.employeeId }] : []),
        ...(req.user.phone ? [{ phone: req.user.phone }] : [])
      ]
    })
      .populate("societyId", "name district officeLocation serviceRadiusKm contactPhone")
      .populate("federationId", "name headquarters state");

    if (!worker) {
      res.status(404).json({ success: false, message: "Worker profile not found in cooperative records." });
      return;
    }

    if (!worker.userId) {
      worker.userId = req.user._id;
      await worker.save();
    }

    res.json({
      success: true,
      worker
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error retrieving worker profile.", error: error.message });
  }
};

export const reuploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const { documentType, documentNumber, fileBase64, originalFilename, notes } = req.body;

    if (!documentType || !fileBase64) {
      res.status(400).json({ success: false, message: "documentType and fileBase64 are required." });
      return;
    }

    const worker = await Worker.findOne({
      $or: [
        { userId: req.user._id },
        ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
        ...(req.user.employeeId ? [{ employeeId: req.user.employeeId }, { workerIdNumber: req.user.employeeId }] : [])
      ]
    });

    if (!worker) {
      res.status(404).json({ success: false, message: "Worker record not found in cooperative database." });
      return;
    }

    let savedRef = "";
    try {
      const savedDoc = await saveDocument({
        rawContent: fileBase64,
        originalName: originalFilename || `${documentType.toLowerCase()}_reupload.pdf`,
        mimeType: fileBase64.startsWith("data:") ? fileBase64.split(";")[0].replace("data:", "") : "application/pdf"
      });
      savedRef = savedDoc.storageReference;
    } catch (e: any) {
      console.warn("Storage warning during re-upload:", e);
      savedRef = fileBase64.startsWith("data:") ? fileBase64 : "";
    }

    if (!worker.kycDocuments) worker.kycDocuments = [];

    const existingIdx = worker.kycDocuments.findIndex(
      (d: any) => d.documentType?.toUpperCase() === documentType.toUpperCase()
    );

    const docPayload: any = {
      documentType: documentType.toUpperCase(),
      documentNumber: documentNumber || (existingIdx >= 0 ? worker.kycDocuments[existingIdx].documentNumber : ""),
      fileUrl: savedRef || fileBase64,
      storageReference: savedRef,
      originalFilename: originalFilename || `${documentType.toLowerCase()}_reupload.pdf`,
      submittedAt: new Date(),
      verificationStatus: "PENDING",
      aiVerificationNotes: notes ? `Re-uploaded by worker: ${notes}` : "Re-uploaded by worker for admin scrutiny",
      rejectionReason: ""
    };

    if (existingIdx >= 0) {
      const existingDoc = (worker.kycDocuments[existingIdx] as any)?.toObject ? (worker.kycDocuments[existingIdx] as any).toObject() : worker.kycDocuments[existingIdx];
      worker.kycDocuments[existingIdx] = { ...existingDoc, ...docPayload };
    } else {
      worker.kycDocuments.push(docPayload);
    }

    worker.verificationStatus = "UNDER_REVIEW";
    worker.rejectionReason = "";

    if (!worker.auditHistory) worker.auditHistory = [];
    worker.auditHistory.push({
      action: `DOCUMENT_REUPLOADED_${documentType.toUpperCase()}`,
      performedBy: req.user._id,
      timestamp: new Date(),
      details: notes || "Worker submitted revised document for administrator audit."
    });

    await worker.save();

    if (worker.userId) {
      await User.findByIdAndUpdate(worker.userId, { rejectionReason: "" }).catch(() => {});
    }

    res.json({
      success: true,
      message: "Document successfully re-uploaded. It is now queued for administrator review.",
      worker
    });
  } catch (err: any) {
    console.error("reuploadDocument error:", err);
    res.status(500).json({ success: false, message: "Failed to re-upload document.", error: err.message });
  }
};



