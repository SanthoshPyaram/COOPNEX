import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import mongoose from "mongoose";
import { LocationMaster } from "../models/LocationMaster";
import { ServiceArea } from "../models/ServiceArea";
import { ServiceCoverageEngine } from "../services/serviceCoverageEngine";

// In-memory cache of official dataset for ultra-fast response and graceful fallback
let inMemoryPincodesMap: Record<string, any> | null = null;

function getInMemoryPincode(pin: string) {
  if (!inMemoryPincodesMap) {
    try {
      const gzPath = path.resolve(__dirname, "../../data/official_india_pincodes.json.gz");
      if (fs.existsSync(gzPath)) {
        const buf = fs.readFileSync(gzPath);
        inMemoryPincodesMap = JSON.parse(zlib.gunzipSync(buf).toString("utf8"));
      }
    } catch (e) {
      console.warn("[Location] Failed to load in-memory pincodes dataset fallback:", e);
    }
  }
  return inMemoryPincodesMap ? inMemoryPincodesMap[pin] : null;
}

export const getPincodeDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawPin = String(req.params.pincode || req.query.pincode || "").trim();

    // 1. PIN code format validation
    if (!/^[1-9][0-9]{5}$/.test(rawPin)) {
      res.status(400).json({
        success: false,
        status: "INVALID_PINCODE",
        serviceAvailable: false,
        message: "Invalid Indian PIN code format. Please enter a valid 6-digit postal code."
      });
      return;
    }

    let records: any[] = [];

    // 2. Query MongoDB LocationMaster if connected
    if (mongoose.connection.readyState === 1) {
      records = await LocationMaster.find({ pincode: rawPin }).lean();
    }

    // 3. Fallback to in-memory official dataset if database query returns empty
    if (!records || records.length === 0) {
      const fallbackEntry = getInMemoryPincode(rawPin);
      if (fallbackEntry) {
        const offices = fallbackEntry.offices && fallbackEntry.offices.length > 0
          ? fallbackEntry.offices
          : [{ name: `${fallbackEntry.district} S.O`, type: fallbackEntry.officeType || "PO", delivery: fallbackEntry.deliveryStatus === "Delivery" }];

        records = offices.map((o: any) => ({
          pincode: rawPin,
          stateNameEnglish: fallbackEntry.stateName || fallbackEntry.state,
          districtNameEnglish: fallbackEntry.district,
          postOfficeName: o.name,
          officeType: o.type,
          deliveryStatus: o.delivery ? "Delivery" : "Non-Delivery",
          city: fallbackEntry.city,
          location: (fallbackEntry.lat && fallbackEntry.lng)
            ? { type: "Point", coordinates: [Number(fallbackEntry.lng), Number(fallbackEntry.lat)] }
            : undefined,
          precision: (fallbackEntry.lat && fallbackEntry.lng) ? "POST_OFFICE" : "PINCODE"
        }));
      }
    }

    if (!records || records.length === 0) {
      res.status(404).json({
        success: false,
        status: "INVALID_PINCODE",
        serviceAvailable: false,
        message: "Unrecognized Indian postal PIN code. Please verify your 6-digit code."
      });
      return;
    }

    const first = records[0];
    const stateName = first.stateNameEnglish || "";
    const districtName = first.districtNameEnglish || "";

    // 4. Availability Determination: All AP and Telangana districts are AVAILABLE
    const isApOrTs =
      /andhra\s*pradesh/i.test(stateName) ||
      /telangana/i.test(stateName) ||
      first.stateCode === "AP" ||
      first.stateCode === "TG";

    const status: "AVAILABLE" | "COMING_SOON" = isApOrTs ? "AVAILABLE" : "COMING_SOON";
    const serviceAvailable = isApOrTs;

    const message = isApOrTs
      ? `COOPNEX cooperative artisan services are active in ${districtName}, ${stateName}.`
      : `Sorry, COOPNEX isn't available in ${stateName} yet. We're currently serving communities across all districts of Andhra Pradesh and Telangana. We're working to expand soon!`;

    // 5. Aggregate distinct post offices, mandals, cities, villages
    const postOfficeMap = new Map<string, { name: string; type?: string; delivery?: boolean }>();
    const mandalsSet = new Set<string>();
    const citiesSet = new Set<string>();
    const villagesMap = new Map<string, { code?: string; name: string }>();
    let coordinates: [number, number] | undefined = undefined;
    let precision = "PINCODE";

    for (const r of records) {
      if (r.postOfficeName) {
        postOfficeMap.set(r.postOfficeName, {
          name: r.postOfficeName,
          type: r.officeType,
          delivery: r.deliveryStatus === "Delivery"
        });
      }
      if (r.subdistrictNameEnglish) mandalsSet.add(r.subdistrictNameEnglish);
      if (r.city) citiesSet.add(r.city);
      if (r.town) citiesSet.add(r.town);
      if (r.villageNameEnglish) {
        villagesMap.set(r.villageNameEnglish, {
          code: r.villageCode,
          name: r.villageNameEnglish
        });
      }
      if (!coordinates && r.location?.coordinates && r.location.coordinates.length === 2) {
        coordinates = r.location.coordinates;
        precision = r.precision || "POST_OFFICE";
      }
    }

    // Default coordinates fallback if missing
    if (!coordinates) {
      const fallbackEntry = getInMemoryPincode(rawPin);
      if (fallbackEntry?.lat && fallbackEntry?.lng) {
        coordinates = [Number(fallbackEntry.lng), Number(fallbackEntry.lat)];
        precision = "PINCODE";
      }
    }

    res.json({
      success: true,
      data: {
        pincode: rawPin,
        state: stateName,
        stateCode: isApOrTs ? (/andhra/i.test(stateName) ? "AP" : "TG") : first.stateCode,
        district: districtName,
        postOffices: Array.from(postOfficeMap.values()),
        mandals: Array.from(mandalsSet),
        cities: Array.from(citiesSet),
        villages: Array.from(villagesMap.values()),
        coordinates: coordinates || null,
        precision,
        status,
        serviceAvailable,
        availableServices: [
          "Electrician",
          "Plumber",
          "Carpenter",
          "Painter",
          "Cleaner",
          "Caregiver",
          "Driver",
          "Gardener",
          "Technician",
          "Domestic Helper"
        ],
        message
      }
    });
  } catch (error: any) {
    console.error("Pincode lookup error:", error);
    res.status(500).json({
      success: false,
      message: "Error resolving official postal location data.",
      error: error.message
    });
  }
};

export const searchLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = String(req.query.q || req.query.query || "").trim();
    if (!q || q.length < 2) {
      res.json({ success: true, data: [] });
      return;
    }

    const regex = new RegExp(q, "i");
    const matches = await LocationMaster.find({
      $or: [
        { pincode: regex },
        { postOfficeName: regex },
        { districtNameEnglish: regex },
        { subdistrictNameEnglish: regex },
        { villageNameEnglish: regex },
        { city: regex }
      ]
    })
      .limit(20)
      .lean();

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error searching locations.",
      error: error.message
    });
  }
};

export const checkPincode = async (req: Request, res: Response): Promise<void> => {
  try {
    const pincode = String(req.query.pincode || req.body?.pincode || "");
    const service = req.query.service ? String(req.query.service) : req.body?.service ? String(req.body.service) : undefined;

    if (!pincode) {
      res.status(400).json({
        success: false,
        message: "Pincode parameter is required."
      });
      return;
    }

    const result = await ServiceCoverageEngine.checkAvailabilityAsync(pincode, service);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error("Pincode check error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing pincode coverage check.",
      error: error.message
    });
  }
};

export const getStates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const states = ServiceCoverageEngine.getStatesList();
    res.json({
      success: true,
      states
    });
  } catch (error: any) {
    console.error("States list error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving states list.",
      error: error.message
    });
  }
};

export const getServiceAreas = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const areas = await ServiceArea.find({}).sort({ state: 1, city: 1 }).lean();
      if (areas && areas.length > 0) {
        res.json({
          success: true,
          count: areas.length,
          data: areas
        });
        return;
      }
    }
    res.json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving service areas.",
      error: error.message
    });
  }
};
