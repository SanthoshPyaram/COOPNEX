import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { getMongoUri, getMaskedUri } from "../config/db";
import { ServiceArea } from "../models/ServiceArea";

export const SERVICE_AREAS_DATA = [
  // --- ANDHRA PRADESH: ACTIVE LAUNCH HUBS ---
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "NTR District (Vijayawada)",
    city: "Vijayawada",
    pincodePrefixes: ["520", "521"],
    pincodes: ["520001", "520002", "520003", "520007", "520008", "520010", "520012", "520013"],
    location: { type: "Point", coordinates: [80.6480, 16.5062] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Vijayawada Central Labour Cooperative Society (PACS-04)",
    nearestHub: "Vijayawada Cooperative Kendra",
    nearestHubCoordinates: [80.6480, 16.5062] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 186
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Guntur District",
    city: "Guntur",
    pincodePrefixes: ["522"],
    pincodes: ["522001", "522002", "522004", "522006", "522019", "522501"],
    location: { type: "Point", coordinates: [80.4650, 16.2980] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Guntur East Labour Cooperative Society",
    nearestHub: "Guntur Labour Cooperative Hub",
    nearestHubCoordinates: [80.4650, 16.2980] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 142
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Visakhapatnam District",
    city: "Visakhapatnam",
    pincodePrefixes: ["530", "531"],
    pincodes: ["530001", "530002", "530013", "530016", "530026", "530048"],
    location: { type: "Point", coordinates: [83.3013, 17.7231] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Visakhapatnam Coastal Labour Cooperative Society",
    nearestHub: "Visakhapatnam Harbour Cooperative",
    nearestHubCoordinates: [83.3013, 17.7231] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 165
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Tirupati District",
    city: "Tirupati",
    pincodePrefixes: ["517"],
    pincodes: ["517501", "517502", "517507", "517520"],
    location: { type: "Point", coordinates: [79.4192, 13.6288] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Tirupati Temple City Labour Cooperative",
    nearestHub: "Tirupati Central Cooperative",
    nearestHubCoordinates: [79.4192, 13.6288] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 110
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Kurnool District",
    city: "Kurnool",
    pincodePrefixes: ["518"],
    pincodes: ["518001", "518002", "518003", "518004"],
    location: { type: "Point", coordinates: [78.0373, 15.8281] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Kurnool Central Primary Labour Cooperative",
    nearestHub: "Kurnool Central Cooperative Hub",
    nearestHubCoordinates: [78.0373, 15.8281] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 95
  },

  // --- TELANGANA: ACTIVE LAUNCH HUBS ---
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Hyderabad District",
    city: "Hyderabad",
    pincodePrefixes: ["500", "501"],
    pincodes: ["500001", "500003", "500016", "500034", "500081", "500082", "500090"],
    location: { type: "Point", coordinates: [78.4867, 17.3850] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Hyderabad Central Labour Cooperative Guild",
    nearestHub: "Hyderabad Central Cooperative Guild",
    nearestHubCoordinates: [78.4867, 17.3850] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 240
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Warangal District",
    city: "Warangal",
    pincodePrefixes: ["506"],
    pincodes: ["506001", "506002", "506004", "506007"],
    location: { type: "Point", coordinates: [79.5941, 17.9689] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Warangal Kakatiya Labour Cooperative Society",
    nearestHub: "Warangal Kakatiya Cooperative",
    nearestHubCoordinates: [79.5941, 17.9689] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 88
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Karimnagar District",
    city: "Karimnagar",
    pincodePrefixes: ["505"],
    pincodes: ["505001", "505002", "505209"],
    location: { type: "Point", coordinates: [79.1328, 18.4386] },
    isActive: true,
    launchPhase: "PHASE_1_LAUNCH" as const,
    cooperativeName: "Karimnagar Primary Labour Cooperative Kendra",
    nearestHub: "Karimnagar Labour Kendra",
    nearestHubCoordinates: [79.1328, 18.4386] as [number, number],
    slaMinutes: 15,
    activeWorkersCount: 72
  },

  // --- ANDHRA PRADESH: PLANNED EXPANSION DISTRICTS ---
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "SPSR Nellore District",
    city: "Nellore",
    pincodePrefixes: ["524"],
    pincodes: ["524001", "524002", "524003", "524004"],
    location: { type: "Point", coordinates: [79.9864, 14.4426] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Nellore District Cooperative Union",
    nearestHub: "Tirupati Central Cooperative",
    nearestHubCoordinates: [79.4192, 13.6288] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Prakasam District",
    city: "Ongole",
    pincodePrefixes: ["523"],
    pincodes: ["523001", "523002", "523225"],
    location: { type: "Point", coordinates: [80.0499, 15.5057] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Ongole Labour Guild Cooperative",
    nearestHub: "Guntur Labour Cooperative Hub",
    nearestHubCoordinates: [80.4650, 16.2980] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Srikakulam District",
    city: "Srikakulam",
    pincodePrefixes: ["532"],
    pincodes: ["532001", "532005"],
    location: { type: "Point", coordinates: [83.8967, 18.2949] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Srikakulam Primary Cooperative Kendra",
    nearestHub: "Visakhapatnam Harbour Cooperative",
    nearestHubCoordinates: [83.3013, 17.7231] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Kakinada District",
    city: "Kakinada",
    pincodePrefixes: ["533"],
    pincodes: ["533001", "533002", "533003"],
    location: { type: "Point", coordinates: [82.2475, 16.9891] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Kakinada Coastal Labour Federation",
    nearestHub: "Vijayawada Cooperative Kendra",
    nearestHubCoordinates: [80.6480, 16.5062] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Eluru District",
    city: "Eluru",
    pincodePrefixes: ["534"],
    pincodes: ["534001", "534002", "534005"],
    location: { type: "Point", coordinates: [81.1037, 16.7107] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Eluru Central Cooperative Society",
    nearestHub: "Vijayawada Cooperative Kendra",
    nearestHubCoordinates: [80.6480, 16.5062] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "Anantapur District",
    city: "Anantapur",
    pincodePrefixes: ["515"],
    pincodes: ["515001", "515002", "515004"],
    location: { type: "Point", coordinates: [77.6006, 14.6819] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Anantapur Rayalaseema Labour Kendra",
    nearestHub: "Kurnool Central Cooperative Hub",
    nearestHubCoordinates: [78.0373, 15.8281] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "YSR Kadapa District",
    city: "Kadapa",
    pincodePrefixes: ["516"],
    pincodes: ["516001", "516002", "516004"],
    location: { type: "Point", coordinates: [78.8242, 14.4673] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Kadapa Labour Cooperative Guild",
    nearestHub: "Tirupati Central Cooperative",
    nearestHubCoordinates: [79.4192, 13.6288] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },

  // --- TELANGANA: PLANNED EXPANSION DISTRICTS ---
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Medak District",
    city: "Sangareddy",
    pincodePrefixes: ["502"],
    pincodes: ["502001", "502032", "502285"],
    location: { type: "Point", coordinates: [78.0838, 17.6190] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Medak-Sangareddy Labour Cooperative",
    nearestHub: "Hyderabad Central Cooperative Guild",
    nearestHubCoordinates: [78.4867, 17.3850] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Nizamabad District",
    city: "Nizamabad",
    pincodePrefixes: ["503"],
    pincodes: ["503001", "503002", "503003"],
    location: { type: "Point", coordinates: [78.0988, 18.6725] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Nizamabad District Labour Guild",
    nearestHub: "Karimnagar Labour Kendra",
    nearestHubCoordinates: [79.1328, 18.4386] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Adilabad District",
    city: "Adilabad",
    pincodePrefixes: ["504"],
    pincodes: ["504001", "504002", "504208"],
    location: { type: "Point", coordinates: [78.5320, 19.6640] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Adilabad Tribal & Rural Labour Cooperative",
    nearestHub: "Karimnagar Labour Kendra",
    nearestHubCoordinates: [79.1328, 18.4386] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Khammam District",
    city: "Khammam",
    pincodePrefixes: ["507"],
    pincodes: ["507001", "507002", "507003"],
    location: { type: "Point", coordinates: [80.1514, 17.2473] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Khammam Primary Labour Kendra",
    nearestHub: "Warangal Kakatiya Cooperative",
    nearestHubCoordinates: [79.5941, 17.9689] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Nalgonda District",
    city: "Nalgonda",
    pincodePrefixes: ["508"],
    pincodes: ["508001", "508002", "508207"],
    location: { type: "Point", coordinates: [79.2684, 17.0577] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Nalgonda Labour Society",
    nearestHub: "Hyderabad Central Cooperative Guild",
    nearestHubCoordinates: [78.4867, 17.3850] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  },
  {
    state: "Telangana",
    stateCode: "TG",
    district: "Mahabubnagar District",
    city: "Mahabubnagar",
    pincodePrefixes: ["509"],
    pincodes: ["509001", "509002"],
    location: { type: "Point", coordinates: [77.9897, 16.7438] },
    isActive: false,
    launchPhase: "PLANNED_PHASE_2" as const,
    cooperativeName: "Palamuru Labour Cooperative Society",
    nearestHub: "Hyderabad Central Cooperative Guild",
    nearestHubCoordinates: [78.4867, 17.3850] as [number, number],
    slaMinutes: 20,
    activeWorkersCount: 0
  }
];

export async function seedServiceAreas(): Promise<void> {
  const uri = getMongoUri();
  console.log(`[SeedServiceAreas] Connecting to MongoDB: ${getMaskedUri(uri)}`);
  await mongoose.connect(uri);

  console.log("[SeedServiceAreas] Upserting hierarchical ServiceArea records for AP and Telangana...");
  for (const area of SERVICE_AREAS_DATA) {
    await ServiceArea.findOneAndUpdate(
      { state: area.state, district: area.district, city: area.city },
      { $set: area },
      { upsert: true, new: true }
    );
  }

  const activeCount = await ServiceArea.countDocuments({ isActive: true });
  const plannedCount = await ServiceArea.countDocuments({ isActive: false });
  console.log(`✓ Seeded Service Areas: ${activeCount} Active Launch Hubs, ${plannedCount} Planned Expansion Districts.`);
}

if (require.main === module) {
  seedServiceAreas()
    .then(() => {
      console.log("Service areas seed complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to seed service areas:", err);
      process.exit(1);
    });
}

