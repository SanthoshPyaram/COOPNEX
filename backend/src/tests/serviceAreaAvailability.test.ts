import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ServiceCoverageEngine } from "../services/serviceCoverageEngine";
import { ServiceArea } from "../models/ServiceArea";
import mongoose from "mongoose";

describe("COOPNEX Service Area Availability System", () => {
  describe("1. Pincode Validation and Format Checks", () => {
    it("should reject non-numeric or malformed pincodes", () => {
      const emptyRes = ServiceCoverageEngine.checkAvailability("");
      expect(emptyRes.isValidPincode).toBe(false);
      expect(emptyRes.status).toBe("INVALID_PINCODE");

      const shortRes = ServiceCoverageEngine.checkAvailability("5200");
      expect(shortRes.isValidPincode).toBe(false);
      expect(shortRes.status).toBe("INVALID_PINCODE");

      const alphaRes = ServiceCoverageEngine.checkAvailability("52001A");
      expect(alphaRes.isValidPincode).toBe(false);
      expect(alphaRes.status).toBe("INVALID_PINCODE");

      const leadingZeroRes = ServiceCoverageEngine.checkAvailability("012345");
      expect(leadingZeroRes.isValidPincode).toBe(false);
      expect(leadingZeroRes.status).toBe("INVALID_PINCODE");
    });
  });

  describe("2. Active Launch Hub Coverage (AP & Telangana Primary Cities)", () => {
    it("should recognize Vijayawada (520xxx, 521xxx) as AVAILABLE", () => {
      const res = ServiceCoverageEngine.checkAvailability("520010");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(true);
      expect(res.status).toBe("AVAILABLE");
      expect(res.city).toBe("Vijayawada");
      expect(res.stateCode).toBe("AP");
      expect(res.coordinates).toBeDefined();
    });

    it("should recognize Hyderabad (500xxx, 501xxx) as AVAILABLE", () => {
      const res = ServiceCoverageEngine.checkAvailability("500034");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(true);
      expect(res.status).toBe("AVAILABLE");
      expect(res.city).toBe("Hyderabad");
      expect(res.stateCode).toBe("TG");
      expect(res.coordinates).toBeDefined();
    });

    it("should recognize Visakhapatnam (530xxx) as AVAILABLE", () => {
      const res = ServiceCoverageEngine.checkAvailability("530017");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(true);
      expect(res.status).toBe("AVAILABLE");
      expect(res.city).toBe("Visakhapatnam");
      expect(res.stateCode).toBe("AP");
    });

    it("should recognize Guntur (522xxx) as AVAILABLE", () => {
      const res = ServiceCoverageEngine.checkAvailability("522002");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(true);
      expect(res.status).toBe("AVAILABLE");
      expect(res.city).toBe("Guntur");
      expect(res.stateCode).toBe("AP");
    });
  });

  describe("3. Planned Expansion Areas (AP/TS Districts & Other States)", () => {
    it("should identify Kadapa (516xxx) as COMING_SOON with expansion corridor info", () => {
      const res = ServiceCoverageEngine.checkAvailability("516001");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(false);
      expect(res.status).toBe("COMING_SOON");
      expect(res.district).toContain("Kadapa");
      expect(res.nearestHub).toBeDefined();
      expect(res.nearestHubCoordinates).toBeDefined();
      expect(res.coordinates).toBeDefined();
    });

    it("should identify Nellore (524xxx) as COMING_SOON with expansion corridor info", () => {
      const res = ServiceCoverageEngine.checkAvailability("524001");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(false);
      expect(res.status).toBe("COMING_SOON");
      expect(res.district).toContain("Nellore");
      expect(res.nearestHub).toBeDefined();
    });

    it("should identify Nizamabad (503xxx) as COMING_SOON with expansion corridor info", () => {
      const res = ServiceCoverageEngine.checkAvailability("503001");
      expect(res.isValidPincode).toBe(true);
      expect(res.available).toBe(false);
      expect(res.status).toBe("COMING_SOON");
      expect(res.district).toContain("Nizamabad");
      expect(res.nearestHub).toBeDefined();
    });

    it("should handle locations outside AP/Telangana (e.g. Delhi 110001, Mumbai 400001) as COMING_SOON without error", () => {
      const delhiRes = ServiceCoverageEngine.checkAvailability("110001");
      expect(delhiRes.isValidPincode).toBe(true);
      expect(delhiRes.available).toBe(false);
      expect(delhiRes.status).toBe("COMING_SOON");

      const mumbaiRes = ServiceCoverageEngine.checkAvailability("400001");
      expect(mumbaiRes.isValidPincode).toBe(true);
      expect(mumbaiRes.available).toBe(false);
      expect(mumbaiRes.status).toBe("COMING_SOON");
    });
  });

  describe("4. Asynchronous Database Query & Fallback Mechanism", () => {
    it("should return valid coverage structure from checkAvailabilityAsync", async () => {
      const res = await ServiceCoverageEngine.checkAvailabilityAsync("520010");
      expect(res).toBeDefined();
      expect(res.status).toBe("AVAILABLE");
      expect(res.available).toBe(true);
      expect(res.city).toBe("Vijayawada");
    });

    it("should return COMING_SOON structure for expansion areas from checkAvailabilityAsync", async () => {
      const res = await ServiceCoverageEngine.checkAvailabilityAsync("516001");
      expect(res).toBeDefined();
      expect(res.status).toBe("COMING_SOON");
      expect(res.available).toBe(false);
      expect(res.nearestHub).toBeDefined();
    });
  });
});
