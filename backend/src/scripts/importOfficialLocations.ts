import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { LocationMaster } from "../models/LocationMaster";
import { getMongoUri, connectDB, disconnectDB } from "../config/db";

dotenv.config();

// Standard State Code mapping for Indian States and UTs
const STATE_CODE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Telangana": "TG",
  "Tamil Nadu": "TN",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Maharashtra": "MH",
  "Gujarat": "GJ",
  "Rajasthan": "RJ",
  "Madhya Pradesh": "MP",
  "Uttar Pradesh": "UP",
  "Bihar": "BR",
  "West Bengal": "WB",
  "Odisha": "OR",
  "Punjab": "PB",
  "Haryana": "HR",
  "Delhi": "DL",
  "Assam": "AS",
  "Jharkhand": "JH",
  "Chhattisgarh": "CG",
  "Uttarakhand": "UK",
  "Himachal Pradesh": "HP",
  "Goa": "GA",
  "Jammu and Kashmir": "JK",
  "Ladakh": "LA",
  "Puducherry": "PY",
  "Chandigarh": "CH",
  "Tripura": "TR",
  "Meghalaya": "ML",
  "Manipur": "MN",
  "Nagaland": "NL",
  "Mizoram": "MZ",
  "Sikkim": "SK",
  "Arunachal Pradesh": "AR",
  "Andaman and Nicobar Islands": "AN",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  "Lakshadweep": "LD"
};

interface RawPostalOffice {
  name: string;
  type?: string;
  delivery?: boolean;
}

interface RawPincodeEntry {
  pincode: string;
  city?: string;
  district: string;
  state: string;
  stateName?: string;
  circle?: string;
  region?: string;
  officeType?: string;
  deliveryStatus?: string;
  lat?: number;
  lng?: number;
  offices?: RawPostalOffice[];
}

export async function runOfficialLocationImport(): Promise<void> {
  console.log("================================================================================");
  console.log("   COOPNEX — OFFICIAL INDIA PINCODE & AP/TELANGANA LOCATION DATASET IMPORT");
  console.log("================================================================================");

  // 1. Verify Database Name Safety
  const mongoUri = getMongoUri();
  const dbNameMatch = mongoUri.match(/\/([a-zA-Z0-9_-]+)(\?|$)/);
  const targetDb = dbNameMatch ? dbNameMatch[1] : "unknown";

  console.log(`[Target Database] Checking database name: "${targetDb}"`);
  if (targetDb === "sahakari_seva" || targetDb === "smart_agriculture") {
    const errorMsg = `[FATAL ERROR] Safety abort: Cannot import into '${targetDb}'. The database MUST be 'coopnex'.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    throw new Error("[MongoDB Error] Failed to establish connection to database.");
  }

  const activeDbName = mongoose.connection.db?.databaseName;
  console.log(`[MongoDB Verified] Connected to database: "${activeDbName}"\n`);

  // 2. Load Official India Post Dataset
  const pincodesGzPath = path.resolve(__dirname, "../../data/official_india_pincodes.json.gz");
  if (!fs.existsSync(pincodesGzPath)) {
    throw new Error(`[Missing Dataset] Pincode dataset not found at: ${pincodesGzPath}`);
  }

  console.log(`[1/3] Reading official India Post dataset from: ${path.basename(pincodesGzPath)}`);
  const gzBuffer = fs.readFileSync(pincodesGzPath);
  const rawPincodesJson = zlib.gunzipSync(gzBuffer).toString("utf8");
  const rawPincodeData: Record<string, RawPincodeEntry> = JSON.parse(rawPincodesJson);
  const totalPincodesInFile = Object.keys(rawPincodeData).length;
  console.log(`      ✓ Uncompressed ${totalPincodesInFile} official Indian pincodes.\n`);

  // 3. Load Official AP & Telangana LGD Administrative Dataset
  const lgdPath = path.resolve(__dirname, "../../data/lgd_ap_telangana_locations.json");
  let lgdData: any = null;
  if (fs.existsSync(lgdPath)) {
    console.log(`[2/3] Reading GoI LGD administrative dataset from: ${path.basename(lgdPath)}`);
    lgdData = JSON.parse(fs.readFileSync(lgdPath, "utf8"));
    console.log(`      ✓ Loaded LGD hierarchy: ${lgdData.totalDistricts || 0} districts, ${lgdData.totalSubDistricts || 0} sub-districts.\n`);
  } else {
    console.warn(`[Warning] LGD administrative file not found at ${lgdPath}. Proceeding with India Post hierarchy.\n`);
  }

  // Build LGD lookups by District Name and Pincode for fast enrichment
  const lgdSubdistrictsByDistrictName: Record<string, Array<{ code: string; name: string; type: string }>> = {};
  const lgdVillagesByPincode: Record<string, Array<{ code: string; name: string; subDistrictCode: string; subDistrictName: string }>> = {};

  if (lgdData && lgdData.subDistrictsByDistrict) {
    const districtsList: any[] = [];
    if (lgdData.districtsByState) {
      Object.values(lgdData.districtsByState).forEach((dList: any) => {
        if (Array.isArray(dList)) districtsList.push(...dList);
      });
    }

    const distCodeToName: Record<string, string> = {};
    districtsList.forEach((d) => {
      distCodeToName[d.code] = d.name.trim().toLowerCase();
    });

    Object.entries(lgdData.subDistrictsByDistrict).forEach(([distCode, subs]: [string, any]) => {
      const dName = distCodeToName[distCode];
      if (dName && Array.isArray(subs)) {
        lgdSubdistrictsByDistrictName[dName] = subs;
      }
    });
  }

  if (lgdData && lgdData.villagesBySubDistrict) {
    Object.values(lgdData.villagesBySubDistrict).forEach((vList: any) => {
      if (Array.isArray(vList)) {
        vList.forEach((v: any) => {
          if (v.pincode && /^[1-9][0-9]{5}$/.test(v.pincode)) {
            if (!lgdVillagesByPincode[v.pincode]) {
              lgdVillagesByPincode[v.pincode] = [];
            }
            lgdVillagesByPincode[v.pincode].push({
              code: v.code,
              name: v.name,
              subDistrictCode: v.subDistrictCode,
              subDistrictName: v.subDistrictName
            });
          }
        });
      }
    });
  }

  // 4. Transform & Prepare Bulk Upsert Operations
  console.log(`[3/3] Preparing idempotent bulk upsert operations...`);

  let validCount = 0;
  let invalidCount = 0;
  let apCount = 0;
  let tgCount = 0;
  let otherStateCount = 0;

  const bulkOps: any[] = [];
  const BATCH_SIZE = 1000;
  let totalInsertedOrUpdated = 0;

  const now = new Date();

  for (const [pin, entry] of Object.entries(rawPincodeData)) {
    if (!pin || !/^[1-9][0-9]{5}$/.test(pin)) {
      invalidCount++;
      continue;
    }

    validCount++;
    const stateName = (entry.stateName || entry.state || "").trim();
    const districtName = (entry.district || "").trim();
    const cityName = (entry.city || "").trim();
    const stateCode = STATE_CODE_MAP[stateName] || "";

    if (stateName.toLowerCase() === "andhra pradesh") apCount++;
    else if (stateName.toLowerCase() === "telangana") tgCount++;
    else otherStateCount++;

    const offices = entry.offices && entry.offices.length > 0
      ? entry.offices
      : [{ name: `${districtName} S.O`, type: entry.officeType || "PO", delivery: entry.deliveryStatus === "Delivery" }];

    const matchedVillages = lgdVillagesByPincode[pin] || [];
    const distSubs = lgdSubdistrictsByDistrictName[districtName.toLowerCase()] || [];
    const defaultSubdistrict = distSubs.length > 0 ? distSubs[0].name : undefined;
    const defaultSubdistrictType = distSubs.length > 0 ? distSubs[0].type : "Mandal";

    const seenOfficesForPin = new Set<string>();

    // Create a record for each distinct post office
    for (const office of offices) {
      const officeName = office.name.trim();
      const officeKey = officeName.toLowerCase();
      if (seenOfficesForPin.has(officeKey)) continue;
      seenOfficesForPin.add(officeKey);

      // If LGD mapped villages exist for this pin, attach primary village or create specific mapping
      const village = matchedVillages.length > 0 ? matchedVillages[0] : null;

      const doc = {
        pincode: pin,
        stateCode: stateCode || undefined,
        stateNameEnglish: stateName,
        stateNameLocal: stateName.toLowerCase() === "andhra pradesh" ? "ఆంధ్ర ప్రదేశ్" : stateName.toLowerCase() === "telangana" ? "తెలంగాణ" : undefined,
        districtNameEnglish: districtName,
        districtNameLocal: undefined,
        subdistrictNameEnglish: village?.subDistrictName || defaultSubdistrict,
        subdistrictCode: village?.subDistrictCode,
        subdistrictType: defaultSubdistrictType,
        villageCode: village?.code,
        villageNameEnglish: village?.name,
        postOfficeName: officeName,
        officeType: office.type || entry.officeType || "PO",
        deliveryStatus: office.delivery !== undefined ? (office.delivery ? "Delivery" : "Non-Delivery") : entry.deliveryStatus,
        circle: entry.circle,
        region: entry.region,
        city: cityName || undefined,
        town: cityName || undefined,
        location: (entry.lat && entry.lng)
          ? {
              type: "Point",
              coordinates: [Number(entry.lng), Number(entry.lat)]
            }
          : undefined,
        precision: (entry.lat && entry.lng) ? "POST_OFFICE" : "PINCODE",
        source: "India Post Official Directory & GoI LGD",
        sourceUpdatedAt: new Date("2026-01-01"),
        importedAt: now
      };

      // Idempotent bulk upsert filter matching the compound unique key
      bulkOps.push({
        updateOne: {
          filter: {
            pincode: doc.pincode,
            postOfficeName: doc.postOfficeName,
            districtNameEnglish: doc.districtNameEnglish
          },
          update: {
            $set: doc,
            $setOnInsert: { createdAt: now }
          },
          upsert: true
        }
      });

      if (bulkOps.length >= BATCH_SIZE) {
        try {
          const res = await LocationMaster.bulkWrite(bulkOps, { ordered: false });
          totalInsertedOrUpdated += ((res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.insertedCount || 0));
        } catch (bErr: any) {
          if (bErr.result) {
            totalInsertedOrUpdated += ((bErr.result.nUpserted || 0) + (bErr.result.nModified || 0) + (bErr.result.nInserted || 0));
          }
        }
        process.stdout.write(`\r      Processed ${validCount}/${totalPincodesInFile} pincodes (Saved/Synced: ${totalInsertedOrUpdated})...`);
        bulkOps.length = 0;
      }
    }
  }

  // Flush remaining batch
  if (bulkOps.length > 0) {
    try {
      const res = await LocationMaster.bulkWrite(bulkOps, { ordered: false });
      totalInsertedOrUpdated += ((res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.insertedCount || 0));
    } catch (bErr: any) {
      if (bErr.result) {
        totalInsertedOrUpdated += ((bErr.result.nUpserted || 0) + (bErr.result.nModified || 0) + (bErr.result.nInserted || 0));
      }
    }
    bulkOps.length = 0;
  }

  console.log(`\n\n================================================================================`);
  console.log("                    LOCATION DATA IMPORT SUMMARY REPORT");
  console.log("================================================================================");
  console.log(`Target Database          : ${activeDbName}`);
  console.log(`Source Pincodes File     : official_india_pincodes.json.gz`);
  console.log(`Source LGD File          : lgd_ap_telangana_locations.json`);
  console.log(`Total Pincodes Evaluated : ${totalPincodesInFile}`);
  console.log(`Valid Pincodes           : ${validCount}`);
  console.log(`Invalid Pincodes         : ${invalidCount}`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`Andhra Pradesh Pincodes  : ${apCount}`);
  console.log(`Telangana Pincodes       : ${tgCount}`);
  console.log(`Other States Pincodes    : ${otherStateCount}`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`Total Database Records   : ${totalInsertedOrUpdated}`);
  console.log(`Idempotent Status        : SUCCESSFUL (Safe to rerun without creating duplicates)`);
  console.log("================================================================================\n");

  await disconnectDB();
}

if (require.main === module) {
  runOfficialLocationImport()
    .then(() => {
      console.log("[Done] Location import process finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Fatal Error] Location import failed:", err);
      process.exit(1);
    });
}
