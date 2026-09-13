# COOPNEX — Location Data Architecture & Pincode Integration

This document outlines the official geographic and administrative hierarchy datasets integrated into **COOPNEX**, how pincodes are resolved across Indian states, and how service coverage and transport logistics are determined.

---

## 1. Official Data Sources

COOPNEX completely eliminates arbitrary fallbacks, generated dummy pincodes, and hardcoded default locations. All location intelligence is built upon authoritative sources:

1. **India Post Postal Directory (All-India)**:
   - Complete national directory containing **19,586 authentic pincodes** across all 36 Indian States and Union Territories.
   - Preserved and compressed in `backend/data/official_india_pincodes.json.gz`.
   - Includes post office name, pincode, district name, state name, office type (Head Post Office, Sub Post Office, Branch Office), delivery status, circle, region, and official coordinates.

2. **Government of India Local Government Directory (LGD)**:
   - Deep administrative hierarchy for **Andhra Pradesh (all 26 districts)** and **Telangana (all 33 districts)**.
   - Sourced from `lgd.gov.in` and preserved in `backend/data/lgd_ap_telangana_locations.json`.
   - Maps State → District → Sub-District (Mandal/Tehsil) → Revenue Village / Post Office.

---

## 2. Database Schema: `LocationMaster`

All postal and administrative boundaries are indexed in the `coopnex` MongoDB database under the `locationmasters` collection:

```typescript
{
  pincode: string;                   // 6-digit India Post PIN (indexed)
  stateCode: string;                 // Two-letter postal code (e.g., "AP", "TS", "MH")
  stateNameEnglish: string;          // Official state name (e.g., "Andhra Pradesh", "Telangana")
  stateNameLocal?: string;           // Local script name (Telugu, Hindi, etc.)
  districtCode: string;              // Standardized district code
  districtNameEnglish: string;       // Official district name (all 26 AP & 33 TS districts)
  subdistrictCode?: string;          // LGD Tehsil/Mandal code
  subdistrictNameEnglish?: string;   // Mandal name (e.g., "Vijayawada Urban", "Gajuwaka", "Serilingampally")
  subdistrictType?: string;          // "Mandal", "Tehsil", or "Taluk"
  villageCode?: string;              // LGD Village code
  villageNameEnglish?: string;       // Revenue Village name
  postOfficeName: string;            // India Post branch/sub-office name
  officeType: string;                // "PO", "SO", "BO", "HO"
  deliveryStatus: string;            // "Delivery" | "Non-Delivery"
  circle?: string;                   // Postal circle (e.g., "Andhra Pradesh Circle")
  region?: string;                   // Postal region
  city?: string;                     // Primary urban center / municipal area
  town?: string;                     // Census town
  location: {
    type: "Point",
    coordinates: [number, number]    // [longitude, latitude] (WGS 84)
  };
  precision: string;                 // "VILLAGE" | "POST_OFFICE" | "SUBDISTRICT" | "DISTRICT"
  source: string;                    // "INDIA_POST" | "LGD" | "OFFICIAL_PINCODE_DATASET"
  importedAt: Date;
}
```

### Compound & Geospatial Indexing
- **Compound Unique Index**: `{ pincode: 1, postOfficeName: 1, districtNameEnglish: 1 }`
  *In India, a single pincode serves 5 to 30 distinct post offices and villages. The compound index guarantees idempotent updates without duplicating post office records.*
- **Geospatial Index**: `{ location: "2dsphere" }`
  *Enables rapid radial queries for nearby workers, cooperative societies, and emergency blood donors.*

---

## 3. Service Coverage & Availability Rules

| Region / State | Service Status | User Experience |
| :--- | :---: | :--- |
| **Andhra Pradesh** (All 26 districts) | `AVAILABLE` | Instant booking, automated worker dispatch, fair statutory floor wage. |
| **Telangana** (All 33 districts) | `AVAILABLE` | Instant booking, automated worker dispatch, fair statutory floor wage. |
| **Other 34 Indian States & UTs** | `COMING_SOON` | Users can register, log in, view full dashboard, and save preferences. Animated service alert explains expansion roadmap and cooperative outreach. |
| **Invalid / Non-Existent PIN** | `INVALID_PINCODE` | Inline error indicating "Invalid PIN code. Please check your 6-digit India Post PIN." |

---

## 4. Resolving 1:N Pincode Relationships

In real-world Indian postal geography, pincodes are rarely 1:1 with a single village or post office:
- Example: PIN `520001` serves `Vijayawada H.O`, `Governorpet S.O`, `Buckinghampet S.O`, and adjacent divisions.
- Rural PINs often encompass 15+ revenue villages across multiple mandal boundaries.

### How COOPNEX Handles Non-1:1 Resolution:
1. When the user enters a 6-digit PIN, `GET /api/location/pincode/:pincode` fetches all linked postal offices and revenue villages.
2. The UI (`HierarchicalAddressForm.tsx`) presents a selectable dropdown of **Post Offices / Localities** and **Mandals**.
3. If the user's specific hamlet or street is not listed, the form provides a clean free-text input ("Other / Not listed — enter manually") without blocking the flow.
4. The system never guesses or substitutes arbitrary localities.

---

## 5. Fair Wage Transport Pricing & Long-Distance Dispatch

To ensure fair take-home pay for gig workers traveling across rural or expansive urban districts:

### Distance Calculation
Distances are computed using the spherical Haversine formula based on actual coordinates:
$$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$

### Tiered Travel Compensation
- **Local Radius ($\le 5\text{ km}$)**: Included in base cooperative statutory wage ($\text{₹}0$ travel surcharge).
- **Standard Travel ($5\text{ km} < d \le 15\text{ km}$)**: Transit allowance of $\text{₹}12/\text{km}$ above 5 km.
- **Extended Travel ($15\text{ km} < d \le 25\text{ km}$)**: $\text{₹}15/\text{km}$ plus mandatory return travel buffer ($\text{₹}8/\text{km}$).
- **Long-Distance ($d > 25\text{ km}$)**:
  - Long-distance status flagged (`isLongDistance: true`).
  - Next-day morning scheduling recommended (`scheduleRecommendation: "NEXT_DAY_MORNING"`) if booking is placed after 17:00 IST to ensure worker safety.
  - Return transit allowance guaranteed.
- **Platform Fee**: **0%** (100% of the customer's payment goes directly to the cooperative worker's bank account).

---

## 6. How to Re-Run or Refresh Location Data

The ingestion script is idempotent and can be executed anytime to verify or update postal data:

```bash
cd backend
npm run import:locations
```

Total execution time: ~15 seconds across all 19,586 pincodes and 162,602 postal records.

