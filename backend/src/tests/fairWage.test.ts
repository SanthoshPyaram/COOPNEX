import { describe, it, expect } from "vitest";
import { fairWageEngine } from "../services/fairWageEngine";
import { GeoService } from "../services/geoService";

describe("Sahakari Seva - Fair Wage Engine", () => {
  it("should calculate transparent worker take-home and co-op contribution for Electrician", () => {
    const result = fairWageEngine.calculate({
      serviceCategory: "Electrician",
      workerVerificationLevel: 4, // State Certified
      workerExperienceYears: 6,
      distanceKm: 1.4,
      isEmergency: true
    });

    const b = result.breakdown;

    // Base Wage = 450
    expect(b.baseWorkerWage).toBe(450);
    // Skill Premium for Level 4 = 70
    expect(b.skillPremium).toBe(70);
    // Experience Premium = (6-1)*10 = 50 capped at 80
    expect(b.experiencePremium).toBe(50);
    // Travel Allowance for 1.4km (<3km) = 30
    expect(b.travelAllowance).toBe(30);
    // Emergency Allowance = 60
    expect(b.emergencyAllowance).toBe(60);

    // Total Worker Earning = 450 + 70 + 50 + 30 + 60 = 660
    expect(b.workerEarning).toBe(660);

    // Cooperative Welfare Fund (12% of worker earning) = Math.round(660 * 0.12) = 79
    expect(b.cooperativeContribution).toBe(79);

    // Customer Paid = Worker Earning + Co-op Fund + GST (5%)
    expect(b.customerPaid).toBeGreaterThan(b.workerEarning);
    expect(result.explanations.length).toBeGreaterThanOrEqual(5);
  });

  it("should calculate accurate Haversine distances in urban coordinates", () => {
    // Benz Circle (16.5062, 80.6480) to Gunadala (16.5120, 80.6540)
    const dist = GeoService.calculateDistanceKm(16.5062, 80.6480, 16.5120, 80.6540);
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(2.0);

    // Urban ETA for 1.4km in emergency mode should be under 10 minutes
    const eta = GeoService.calculateEtaMinutes(dist, true);
    expect(eta).toBeLessThanOrEqual(8);
  });
});

