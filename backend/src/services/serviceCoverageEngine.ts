import mongoose from "mongoose";
import { INDIA_STATES_DATA, ALL_SERVICES, StateInfo, DistrictInfo } from "../config/indiaLocationData";
import { ServiceArea, IServiceArea } from "../models/ServiceArea";

export interface ServiceAvailabilityResult {
  pincode: string;
  isValidPincode: boolean;
  available: boolean;
  status: "AVAILABLE" | "COMING_SOON" | "INVALID_PINCODE";
  isCovered: boolean;
  activeCooperative: boolean;
  state?: string;
  stateCode?: string;
  district?: string;
  city?: string;
  coordinates?: [number, number]; // [longitude, latitude]
  services: string[];
  servicesAvailable: string[];
  serviceSupported?: boolean;
  cooperativeName?: string;
  slaMinutes?: number;
  nearestHub?: string;
  nearestHubCoordinates?: [number, number]; // [longitude, latitude]
  nearestServiceArea?: string;
  cooperativeFederation?: string;
  launchPhase?: string;
  message: string;
}

// Active launch 3-digit prefixes in Andhra Pradesh & Telangana
export const ACTIVE_LAUNCH_PREFIXES = new Set([
  // Andhra Pradesh Launch Hubs
  "520", // Vijayawada / NTR
  "521", // Machilipatnam / Krishna
  "522", // Guntur
  "530", // Visakhapatnam
  "531", // Anakapalle / Vizag Rural
  "517", // Tirupati
  "518", // Kurnool

  // Telangana Launch Hubs
  "500", // Hyderabad
  "501", // Secunderabad / Ranga Reddy
  "505", // Karimnagar
  "506"  // Warangal / Hanamkonda
]);

// Master dictionary of postal prefixes with accurate geospatial coordinates
export const POSTAL_PREFIX_DATA: Record<
  string,
  {
    city: string;
    district: string;
    state: string;
    stateCode: string;
    coordinates: [number, number]; // [lon, lat]
    nearestHub: string;
    nearestHubCoordinates: [number, number];
  }
> = {
  // Andhra Pradesh — Active Launch Hubs
  "520": { city: "Vijayawada", district: "NTR District (Vijayawada)", state: "Andhra Pradesh", stateCode: "AP", coordinates: [80.6480, 16.5062], nearestHub: "Vijayawada Cooperative Kendra", nearestHubCoordinates: [80.6480, 16.5062] },
  "521": { city: "Machilipatnam", district: "Krishna District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [81.1388, 16.1875], nearestHub: "Vijayawada Cooperative Kendra", nearestHubCoordinates: [80.6480, 16.5062] },
  "522": { city: "Guntur", district: "Guntur District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [80.4650, 16.2980], nearestHub: "Guntur Labour Cooperative Hub", nearestHubCoordinates: [80.4650, 16.2980] },
  "530": { city: "Visakhapatnam", district: "Visakhapatnam District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [83.3013, 17.7231], nearestHub: "Visakhapatnam Harbour Cooperative", nearestHubCoordinates: [83.3013, 17.7231] },
  "531": { city: "Anakapalle", district: "Anakapalle District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [83.0039, 17.6913], nearestHub: "Visakhapatnam Harbour Cooperative", nearestHubCoordinates: [83.3013, 17.7231] },
  "517": { city: "Tirupati", district: "Tirupati District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [79.4192, 13.6288], nearestHub: "Tirupati Temple City Cooperative", nearestHubCoordinates: [79.4192, 13.6288] },
  "518": { city: "Kurnool", district: "Kurnool District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [78.0373, 15.8281], nearestHub: "Kurnool Central Cooperative Hub", nearestHubCoordinates: [78.0373, 15.8281] },

  // Andhra Pradesh — Future Expansion Districts
  "515": { city: "Anantapur", district: "Anantapur District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [77.6006, 14.6819], nearestHub: "Kurnool Central Cooperative Hub", nearestHubCoordinates: [78.0373, 15.8281] },
  "516": { city: "Kadapa", district: "YSR Kadapa District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [78.8242, 14.4673], nearestHub: "Tirupati Temple City Cooperative", nearestHubCoordinates: [79.4192, 13.6288] },
  "523": { city: "Ongole", district: "Prakasam District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [80.0499, 15.5057], nearestHub: "Guntur Labour Cooperative Hub", nearestHubCoordinates: [80.4650, 16.2980] },
  "524": { city: "Nellore", district: "SPSR Nellore District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [79.9864, 14.4426], nearestHub: "Tirupati Temple City Cooperative", nearestHubCoordinates: [79.4192, 13.6288] },
  "532": { city: "Srikakulam", district: "Srikakulam District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [83.8967, 18.2949], nearestHub: "Visakhapatnam Harbour Cooperative", nearestHubCoordinates: [83.3013, 17.7231] },
  "533": { city: "Kakinada", district: "Kakinada District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [82.2475, 16.9891], nearestHub: "Vijayawada Cooperative Kendra", nearestHubCoordinates: [80.6480, 16.5062] },
  "534": { city: "Eluru", district: "Eluru District", state: "Andhra Pradesh", stateCode: "AP", coordinates: [81.1037, 16.7107], nearestHub: "Vijayawada Cooperative Kendra", nearestHubCoordinates: [80.6480, 16.5062] },

  // Telangana — Active Launch Hubs
  "500": { city: "Hyderabad", district: "Hyderabad District", state: "Telangana", stateCode: "TG", coordinates: [78.4867, 17.3850], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "501": { city: "Secunderabad", district: "Ranga Reddy District", state: "Telangana", stateCode: "TG", coordinates: [78.5011, 17.4399], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "505": { city: "Karimnagar", district: "Karimnagar District", state: "Telangana", stateCode: "TG", coordinates: [79.1328, 18.4386], nearestHub: "Karimnagar Labour Kendra", nearestHubCoordinates: [79.1328, 18.4386] },
  "506": { city: "Warangal", district: "Warangal District", state: "Telangana", stateCode: "TG", coordinates: [79.5941, 17.9689], nearestHub: "Warangal Kakatiya Cooperative", nearestHubCoordinates: [79.5941, 17.9689] },

  // Telangana — Future Expansion Districts
  "502": { city: "Sangareddy", district: "Medak District", state: "Telangana", stateCode: "TG", coordinates: [78.0838, 17.6190], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "503": { city: "Nizamabad", district: "Nizamabad District", state: "Telangana", stateCode: "TG", coordinates: [78.0988, 18.6725], nearestHub: "Karimnagar Labour Kendra", nearestHubCoordinates: [79.1328, 18.4386] },
  "504": { city: "Adilabad", district: "Adilabad District", state: "Telangana", stateCode: "TG", coordinates: [78.5320, 19.6640], nearestHub: "Karimnagar Labour Kendra", nearestHubCoordinates: [79.1328, 18.4386] },
  "507": { city: "Khammam", district: "Khammam District", state: "Telangana", stateCode: "TG", coordinates: [80.1514, 17.2473], nearestHub: "Warangal Kakatiya Cooperative", nearestHubCoordinates: [79.5941, 17.9689] },
  "508": { city: "Nalgonda", district: "Nalgonda District", state: "Telangana", stateCode: "TG", coordinates: [79.2684, 17.0577], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "509": { city: "Mahabubnagar", district: "Mahabubnagar District", state: "Telangana", stateCode: "TG", coordinates: [77.9897, 16.7438], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },

  // Karnataka & South
  "560": { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", stateCode: "KA", coordinates: [77.5946, 12.9716], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "570": { city: "Mysuru", district: "Mysuru District", state: "Karnataka", stateCode: "KA", coordinates: [76.6394, 12.2958], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "600": { city: "Chennai", district: "Chennai District", state: "Tamil Nadu", stateCode: "TN", coordinates: [80.2707, 13.0827], nearestHub: "Tirupati Temple City Cooperative", nearestHubCoordinates: [79.4192, 13.6288] },
  "682": { city: "Kochi", district: "Ernakulam District", state: "Kerala", stateCode: "KL", coordinates: [76.2673, 9.9312], nearestHub: "Tirupati Temple City Cooperative", nearestHubCoordinates: [79.4192, 13.6288] },

  // Maharashtra & West
  "400": { city: "Mumbai", district: "Mumbai Metropolitan", state: "Maharashtra", stateCode: "MH", coordinates: [72.8777, 19.0760], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "411": { city: "Pune", district: "Pune District", state: "Maharashtra", stateCode: "MH", coordinates: [73.8567, 18.5204], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "380": { city: "Ahmedabad", district: "Ahmedabad District", state: "Gujarat", stateCode: "GJ", coordinates: [72.5714, 23.0225], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },

  // North & East
  "110": { city: "New Delhi", district: "Central Delhi", state: "Delhi", stateCode: "DL", coordinates: [77.2090, 28.6139], nearestHub: "Hyderabad Central Cooperative Guild", nearestHubCoordinates: [78.4867, 17.3850] },
  "700": { city: "Kolkata", district: "Kolkata District", state: "West Bengal", stateCode: "WB", coordinates: [88.3639, 22.5726], nearestHub: "Visakhapatnam Harbour Cooperative", nearestHubCoordinates: [83.3013, 17.7231] },
  "751": { city: "Bhubaneswar", district: "Khurda District", state: "Odisha", stateCode: "OD", coordinates: [85.8245, 20.2961], nearestHub: "Visakhapatnam Harbour Cooperative", nearestHubCoordinates: [83.3013, 17.7231] }
};

export class ServiceCoverageEngine {
  /**
   * Async database-driven availability check.
   * Prioritizes live MongoDB ServiceArea collection configured by SUPER_ADMIN.
   * Falls back gracefully to the authoritative geographical engine if database is unreachable.
   */
  public static async checkAvailabilityAsync(
    pincode: string,
    requestedService?: string
  ): Promise<ServiceAvailabilityResult> {
    const raw = (pincode || "").replace(/\D/g, "").trim();

    // 1. Strict Pincode Format Validation
    if (!raw || raw.length !== 6 || !/^[1-9][0-9]{5}$/.test(raw)) {
      return {
        pincode: raw,
        isValidPincode: false,
        available: false,
        status: "INVALID_PINCODE",
        isCovered: false,
        activeCooperative: false,
        services: [],
        servicesAvailable: [],
        message: "❌ Please enter a valid 6-digit Indian PIN code. 📍"
      };
    }

    const cleaned = raw;
    const prefix3 = cleaned.substring(0, 3);

    // 2. Query MongoDB live ServiceArea collection as authoritative source
    if (mongoose.connection.readyState === 1) {
      try {
        const { ServiceArea } = await import("../models/ServiceArea");

        // Priority A: Direct match on specific 6-digit pincode in ServiceArea
        const directPincodeArea = await ServiceArea.findOne({ pincodes: cleaned }).lean();
        if (directPincodeArea) {
          const coords = directPincodeArea.location?.coordinates || [79.0, 16.5];
          const nearestCoords = directPincodeArea.nearestHubCoordinates || coords;
          if (directPincodeArea.isActive) {
            return {
              pincode: cleaned,
              isValidPincode: true,
              available: true,
              status: "AVAILABLE",
              isCovered: true,
              activeCooperative: true,
              state: directPincodeArea.state,
              stateCode: directPincodeArea.stateCode,
              district: directPincodeArea.district,
              city: directPincodeArea.city,
              coordinates: coords,
              services: directPincodeArea.supportedServices || ALL_SERVICES,
              servicesAvailable: directPincodeArea.supportedServices || ALL_SERVICES,
              serviceSupported: requestedService ? directPincodeArea.supportedServices?.includes(requestedService) : true,
              cooperativeName: directPincodeArea.cooperativeName || `${directPincodeArea.city} Central Labour Cooperative Society`,
              slaMinutes: directPincodeArea.slaMinutes || 15,
              nearestHub: directPincodeArea.nearestHub || `${directPincodeArea.city} Cooperative Kendra`,
              nearestHubCoordinates: nearestCoords,
              nearestServiceArea: `${directPincodeArea.city} Cooperative Kendra`,
              cooperativeFederation: `${directPincodeArea.state} Primary Labour Cooperative Federation`,
              launchPhase: directPincodeArea.launchPhase || "PHASE_1_LAUNCH",
              message: `✓ COOPNEX is actively operating in ${directPincodeArea.city}, ${directPincodeArea.state}. Verified cooperative artisans are available for dispatch.`
            };
          } else {
            return {
              pincode: cleaned,
              isValidPincode: true,
              available: false,
              status: "COMING_SOON",
              isCovered: false,
              activeCooperative: false,
              state: directPincodeArea.state,
              stateCode: directPincodeArea.stateCode,
              district: directPincodeArea.district,
              city: directPincodeArea.city,
              coordinates: coords,
              services: [],
              servicesAvailable: [],
              serviceSupported: false,
              nearestHub: directPincodeArea.nearestHub || "Regional Cooperative Kendra",
              nearestHubCoordinates: nearestCoords,
              launchPhase: "FUTURE_EXPANSION",
              message: `COOPNEX service in ${directPincodeArea.city} (PIN ${cleaned}) is currently paused or coming soon. Our cooperative federation is working to expand coverage.`
            };
          }
        }

        // Priority B: Check if matching prefix area exists
        const prefixArea = await ServiceArea.findOne({ pincodePrefixes: prefix3 }).lean();
        if (prefixArea) {
          const coords = prefixArea.location?.coordinates || [79.0, 16.5];
          const nearestCoords = prefixArea.nearestHubCoordinates || coords;

          // If the area has explicit pincodes configured, and this pincode is NOT among them,
          // then this pincode has either been removed or not yet expanded.
          const hasExplicitPincodes = Array.isArray(prefixArea.pincodes) && prefixArea.pincodes.length > 0;
          const isIncludedInPincodes = hasExplicitPincodes ? prefixArea.pincodes.includes(cleaned) : true;

          if (prefixArea.isActive && isIncludedInPincodes) {
            return {
              pincode: cleaned,
              isValidPincode: true,
              available: true,
              status: "AVAILABLE",
              isCovered: true,
              activeCooperative: true,
              state: prefixArea.state,
              stateCode: prefixArea.stateCode,
              district: prefixArea.district,
              city: prefixArea.city,
              coordinates: coords,
              services: prefixArea.supportedServices || ALL_SERVICES,
              servicesAvailable: prefixArea.supportedServices || ALL_SERVICES,
              serviceSupported: requestedService ? prefixArea.supportedServices?.includes(requestedService) : true,
              cooperativeName: prefixArea.cooperativeName || `${prefixArea.city} Central Labour Cooperative Society`,
              slaMinutes: prefixArea.slaMinutes || 15,
              nearestHub: prefixArea.nearestHub || `${prefixArea.city} Cooperative Kendra`,
              nearestHubCoordinates: nearestCoords,
              nearestServiceArea: `${prefixArea.city} Cooperative Kendra`,
              cooperativeFederation: `${prefixArea.state} Primary Labour Cooperative Federation`,
              launchPhase: prefixArea.launchPhase || "PHASE_1_LAUNCH",
              message: `✓ COOPNEX is actively operating in ${prefixArea.city}, ${prefixArea.state}. Verified cooperative artisans are available for dispatch.`
            };
          } else {
            return {
              pincode: cleaned,
              isValidPincode: true,
              available: false,
              status: "COMING_SOON",
              isCovered: false,
              activeCooperative: false,
              state: prefixArea.state,
              stateCode: prefixArea.stateCode,
              district: prefixArea.district,
              city: prefixArea.city,
              coordinates: coords,
              services: [],
              servicesAvailable: [],
              serviceSupported: false,
              nearestHub: prefixArea.nearestHub || "Regional Cooperative Kendra",
              nearestHubCoordinates: nearestCoords,
              launchPhase: "FUTURE_EXPANSION",
              message: `Sorry, COOPNEX service is currently not available in PIN ${cleaned} (${prefixArea.district}). We are actively working with local cooperatives to expand coverage.`
            };
          }
        }

        // Priority C: LocationMaster fallback
        const { LocationMaster } = await import("../models/LocationMaster");
        const locRecord = await LocationMaster.findOne({ pincode: cleaned }).lean();
        if (locRecord) {
          const isApOrTs =
            /andhra\s*pradesh/i.test(locRecord.stateNameEnglish) ||
            /telangana/i.test(locRecord.stateNameEnglish) ||
            locRecord.stateCode === "AP" ||
            locRecord.stateCode === "TG";

          const coords = locRecord.location?.coordinates || [79.0, 16.5];
          const distName = locRecord.districtNameEnglish || "District";
          const stateName = locRecord.stateNameEnglish || (isApOrTs ? "Andhra Pradesh" : "India");
          const cityName = locRecord.city || locRecord.town || locRecord.postOfficeName || distName;

          if (isApOrTs) {
            return {
              pincode: cleaned,
              isValidPincode: true,
              available: true,
              status: "AVAILABLE",
              isCovered: true,
              activeCooperative: true,
              state: stateName,
              stateCode: /andhra/i.test(stateName) ? "AP" : "TG",
              district: distName,
              city: cityName,
              coordinates: coords,
              services: ALL_SERVICES,
              servicesAvailable: ALL_SERVICES,
              serviceSupported: true,
              cooperativeName: `${distName} Primary Labour Cooperative Society`,
              slaMinutes: 15,
              nearestHub: `${distName} Cooperative Kendra`,
              nearestHubCoordinates: coords,
              nearestServiceArea: `${distName} Cooperative Kendra`,
              cooperativeFederation: `${stateName} State Labour Cooperative Federation`,
              launchPhase: "PHASE_1_LAUNCH",
              message: `✓ COOPNEX is actively operating in ${cityName}, ${stateName}. Verified cooperative artisans are available for dispatch.`
            };
          } else {
            return {
              pincode: cleaned,
              isValidPincode: true,
              available: false,
              status: "COMING_SOON",
              isCovered: false,
              activeCooperative: false,
              state: stateName,
              stateCode: locRecord.stateCode || "IN",
              district: distName,
              city: cityName,
              coordinates: coords,
              services: [],
              servicesAvailable: [],
              serviceSupported: false,
              nearestHub: "Andhra Pradesh & Telangana Cooperative Network",
              nearestHubCoordinates: coords,
              launchPhase: "FUTURE_EXPANSION",
              message: `Sorry, COOPNEX isn't available in ${stateName} yet. We're currently serving communities across all districts of Andhra Pradesh and Telangana. We're working to expand soon!`
            };
          }
        }
      } catch (dbErr) {
        console.warn("MongoDB service area query error, falling back to geography engine:", dbErr);
      }
    }

    // 3. Fallback to Geographical Postal Lookup Engine
    return ServiceCoverageEngine.checkAvailability(cleaned, requestedService);
  }

  /**
   * Synchronous geographical fallback lookup.
   * Distinguishes:
   * - Andhra Pradesh & Telangana districts (AVAILABLE)
   * - Other Indian states outside AP/TS (COMING_SOON)
   * - Invalid Pincode (INVALID_PINCODE)
   */
  public static checkAvailability(pincode: string, requestedService?: string): ServiceAvailabilityResult {
    const raw = (pincode || "").replace(/\D/g, "").trim();

    if (!raw || raw.length !== 6 || !/^[1-9][0-9]{5}$/.test(raw)) {
      return {
        pincode: raw,
        isValidPincode: false,
        available: false,
        status: "INVALID_PINCODE",
        isCovered: false,
        activeCooperative: false,
        services: [],
        servicesAvailable: [],
        message: "❌ Please enter a valid 6-digit Indian PIN code. 📍"
      };
    }

    const cleaned = raw;
    const prefix3 = cleaned.substring(0, 3);

    // Check direct 3-digit table
    const directMatch = POSTAL_PREFIX_DATA[prefix3];
    if (directMatch) {
      const isApOrTs =
        directMatch.stateCode === "AP" ||
        directMatch.stateCode === "TG" ||
        /andhra/i.test(directMatch.state) ||
        /telangana/i.test(directMatch.state);

      if (isApOrTs) {
        return {
          pincode: cleaned,
          isValidPincode: true,
          available: true,
          status: "AVAILABLE",
          isCovered: true,
          activeCooperative: true,
          state: directMatch.state,
          stateCode: directMatch.stateCode,
          district: directMatch.district,
          city: directMatch.city,
          coordinates: directMatch.coordinates,
          services: ALL_SERVICES,
          servicesAvailable: ALL_SERVICES,
          serviceSupported: true,
          cooperativeName: `${directMatch.city} Central Labour Cooperative Society`,
          slaMinutes: 15,
          nearestHub: directMatch.nearestHub,
          nearestHubCoordinates: directMatch.nearestHubCoordinates,
          nearestServiceArea: directMatch.nearestHub,
          cooperativeFederation: `${directMatch.state} State Labour Cooperative Federation`,
          launchPhase: "PHASE_1_LAUNCH",
          message: `✓ COOPNEX is actively operating in ${directMatch.city}, ${directMatch.state}. Verified cooperative artisans are available for dispatch.`
        };
      } else {
        return {
          pincode: cleaned,
          isValidPincode: true,
          available: false,
          status: "COMING_SOON",
          isCovered: false,
          activeCooperative: false,
          state: directMatch.state,
          stateCode: directMatch.stateCode,
          district: directMatch.district,
          city: directMatch.city,
          coordinates: directMatch.coordinates,
          services: [],
          servicesAvailable: [],
          serviceSupported: false,
          nearestHub: directMatch.nearestHub,
          nearestHubCoordinates: directMatch.nearestHubCoordinates,
          launchPhase: "FUTURE_EXPANSION",
          message: `Sorry, COOPNEX isn't available in ${directMatch.state} yet. We're currently serving communities across all districts of Andhra Pradesh and Telangana. We're working to expand soon!`
        };
      }
    }

    // Broad circle fallback for other Indian regions
    const prefix2 = cleaned.substring(0, 2);
    let matchedStateName = "India";
    let matchedStateCode = "IN";
    let approxCity = `Locality ${prefix3}`;
    let approxCoords: [number, number] = [80.6480, 16.5062];

    if (prefix2.startsWith("50")) {
      matchedStateName = "Telangana";
      matchedStateCode = "TG";
      approxCity = "Telangana Expansion Circle";
      approxCoords = [78.4867, 17.3850];
    } else if (prefix2.startsWith("51") || prefix2.startsWith("52") || prefix2.startsWith("53")) {
      matchedStateName = "Andhra Pradesh";
      matchedStateCode = "AP";
      approxCity = "Andhra Pradesh Expansion Circle";
      approxCoords = [80.6480, 16.5062];
    } else if (prefix2.startsWith("56") || prefix2.startsWith("57") || prefix2.startsWith("58")) {
      matchedStateName = "Karnataka";
      matchedStateCode = "KA";
      approxCity = "Karnataka Region";
      approxCoords = [77.5946, 12.9716];
    } else if (prefix2.startsWith("60") || prefix2.startsWith("62") || prefix2.startsWith("64")) {
      matchedStateName = "Tamil Nadu";
      matchedStateCode = "TN";
      approxCity = "Tamil Nadu Region";
      approxCoords = [80.2707, 13.0827];
    } else if (prefix2.startsWith("40") || prefix2.startsWith("41")) {
      matchedStateName = "Maharashtra";
      matchedStateCode = "MH";
      approxCity = "Maharashtra Region";
      approxCoords = [72.8777, 19.0760];
    } else if (prefix2.startsWith("11")) {
      matchedStateName = "Delhi";
      matchedStateCode = "DL";
      approxCity = "National Capital Region";
      approxCoords = [77.2090, 28.6139];
    }

    const isApOrTs = matchedStateCode === "AP" || matchedStateCode === "TG";

    return {
      pincode: cleaned,
      isValidPincode: true,
      available: false,
      status: "COMING_SOON",
      isCovered: false,
      activeCooperative: false,
      state: matchedStateName,
      stateCode: matchedStateCode,
      district: `${approxCity} District`,
      city: approxCity,
      coordinates: approxCoords,
      services: [],
      servicesAvailable: [],
      serviceSupported: false,
      nearestHub: "Vijayawada Cooperative Kendra",
      nearestHubCoordinates: [80.6480, 16.5062],
      launchPhase: isApOrTs ? "PLANNED_PHASE_2" : "FUTURE_EXPANSION",
      message: isApOrTs
        ? `We're expanding across Andhra Pradesh and Telangana, district by district. We'd love to bring trusted cooperative services to your locality soon.`
        : `COOPNEX is currently operational in selected hubs across Andhra Pradesh & Telangana. Stay tuned — COOPNEX is coming your way!`
    };
  }

  /**
   * Returns states list with active/inactive district indicator.
   */
  public static getStatesList() {
    return INDIA_STATES_DATA.map((s) => ({
      name: s.name,
      code: s.code,
      capital: s.capital,
      districts: s.districts.map((d) => ({
        name: d.name,
        headquarters: d.headquarters,
        active: d.cooperativeActive
      }))
    }));
  }
}
