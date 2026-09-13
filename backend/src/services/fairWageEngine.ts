import { IFairWageBreakdown } from "../models/Booking";

export interface FairWageCalculationParams {
  serviceCategory: string;
  workerVerificationLevel: number;
  workerExperienceYears: number;
  distanceKm: number;
  isEmergency: boolean;
  hoursEstimated?: number;
}

export interface FairWagePolicyRules {
  baseWages: Record<string, number>;
  skillPremiums: Record<number, number>;
  experiencePremiumPerYear: number;
  maxExperiencePremium: number;
  travelTier1MaxKm: number;
  travelTier1Amount: number;
  travelTier2MaxKm: number;
  travelTier2Amount: number;
  travelTier3Amount: number;
  emergencyAllowanceStandard: number;
  cooperativeFundPercentage: number;
  gstTaxPercentage: number;
}

// Configurable Cooperative Policy Rules (Can be modified by Federation/Society Admins)
export const DEFAULT_WAGE_POLICY: FairWagePolicyRules = {
  baseWages: {
    "Electrician": 450,
    "Plumber": 400,
    "Carpenter": 420,
    "Painter": 380,
    "Cleaner": 350,
    "Caregiver": 480,
    "Driver": 400,
    "Gardener": 320,
    "Technician": 460,
    "Domestic Helper": 340
  },
  skillPremiums: {
    1: 0,   // Level 1: Basic Identity
    2: 20,  // Level 2: Society Member
    3: 40,  // Level 3: Trade Verified
    4: 70,  // Level 4: State / NSDC Certified
    5: 110  // Level 5: Master Craftsman
  },
  experiencePremiumPerYear: 10,
  maxExperiencePremium: 80,
  travelTier1MaxKm: 3.0,
  travelTier1Amount: 30,
  travelTier2MaxKm: 7.0,
  travelTier2Amount: 50,
  travelTier3Amount: 85,
  emergencyAllowanceStandard: 60,
  cooperativeFundPercentage: 0.12, // 12% goes directly to Cooperative Member Welfare Corpus
  gstTaxPercentage: 0.05          // 5% GST
};

export class FairWageEngine {
  private policy: FairWagePolicyRules;

  constructor(customPolicy?: Partial<FairWagePolicyRules>) {
    this.policy = { ...DEFAULT_WAGE_POLICY, ...customPolicy };
  }

  public calculate(params: FairWageCalculationParams): {
    breakdown: IFairWageBreakdown;
    explanations: string[];
    summaryMessage: string;
  } {
    const {
      serviceCategory,
      workerVerificationLevel,
      workerExperienceYears,
      distanceKm,
      isEmergency,
      hoursEstimated = 1
    } = params;

    const explanations: string[] = [];

    // 1. Base Worker Wage
    const baseUnitWage = this.policy.baseWages[serviceCategory] || 380;
    const baseWorkerWage = baseUnitWage * Math.max(1, hoursEstimated);
    explanations.push(`Base Wage: ₹${baseWorkerWage} (Standard union cooperative floor rate for ${serviceCategory})`);

    // 2. Skill Premium (Tied directly to verification tier)
    const skillPremium = this.policy.skillPremiums[workerVerificationLevel] || 0;
    if (skillPremium > 0) {
      explanations.push(`Skill Premium: +₹${skillPremium} (Level ${workerVerificationLevel} certified trade competence)`);
    }

    // 3. Experience Premium
    const qualifyingYears = Math.max(0, workerExperienceYears - 1);
    const experiencePremium = Math.min(
      this.policy.maxExperiencePremium,
      qualifyingYears * this.policy.experiencePremiumPerYear
    );
    if (experiencePremium > 0) {
      explanations.push(`Experience Premium: +₹${experiencePremium} (${workerExperienceYears} years on-field track record)`);
    }

    // 4. Travel Allowance (Compensates worker transport, not kept by company)
    let travelAllowance = this.policy.travelTier1Amount;
    if (distanceKm > this.policy.travelTier2MaxKm) {
      travelAllowance = this.policy.travelTier3Amount + Math.round((distanceKm - this.policy.travelTier2MaxKm) * 10);
    } else if (distanceKm > this.policy.travelTier1MaxKm) {
      travelAllowance = this.policy.travelTier2Amount;
    }

    // Return travel compensation if distance > 15 km
    const returnTravelThresholdKm = 15;
    const returnTravelCost = distanceKm > returnTravelThresholdKm ? Math.round((distanceKm - returnTravelThresholdKm) * 8) : 0;
    const transportCost = travelAllowance;

    explanations.push(`Travel Allowance: +₹${travelAllowance} (${distanceKm.toFixed(1)} km transit compensation)`);
    if (returnTravelCost > 0) {
      explanations.push(`Return Travel Compensation: +₹${returnTravelCost} (Distance exceeds ${returnTravelThresholdKm} km threshold)`);
    }

    // 5. Emergency Allowance
    const emergencyAllowance = isEmergency ? this.policy.emergencyAllowanceStandard : 0;
    if (isEmergency) {
      explanations.push(`Emergency Allowance: +₹${emergencyAllowance} (Immediate priority dispatch & hazard protocol)`);
    }

    // Service Amount (Worker labour components)
    const serviceAmount = baseWorkerWage + skillPremium + experiencePremium + emergencyAllowance;

    // Total Worker Earning (100% credited to Worker Wallet)
    const workerEarning = serviceAmount + transportCost + returnTravelCost;

    // 6. Cooperative Welfare Contribution (Funds health insurance, tool upgrades, child scholarships)
    const cooperativeContribution = Math.round(workerEarning * this.policy.cooperativeFundPercentage);
    explanations.push(`Cooperative Welfare Fund: +₹${cooperativeContribution} (12% retained by Society for member medical insurance & tool fund)`);

    // 7. Applicable GST
    const taxGst = Math.round((workerEarning + cooperativeContribution) * this.policy.gstTaxPercentage);

    // Total Paid by Customer
    const customerPaid = workerEarning + cooperativeContribution + taxGst;
    const totalAmount = customerPaid;
    const platformFee = 0; // 0% platform commission model

    // Long-distance & scheduling feasibility evaluation
    const maxSameDayDistanceKm = 25.0;
    const sameDayCutoffHour = 17;
    const currentHour = new Date().getHours();
    const isLongDistance = distanceKm > maxSameDayDistanceKm;
    const isPastCutoff = currentHour >= sameDayCutoffHour;

    let scheduleRecommendation: "SAME_DAY" | "SCHEDULE_TOMORROW" = "SAME_DAY";
    let scheduleReason: string | undefined = undefined;

    if (isLongDistance && isPastCutoff) {
      scheduleRecommendation = "SCHEDULE_TOMORROW";
      scheduleReason = `Worker is located ${distanceKm.toFixed(1)} km away and it is past ${sameDayCutoffHour}:00 PM. We recommend scheduling for tomorrow morning or choosing a closer artisan.`;
    } else if (isLongDistance) {
      scheduleRecommendation = "SCHEDULE_TOMORROW";
      scheduleReason = `Worker is located ${distanceKm.toFixed(1)} km away. For optimal preparation and safety, scheduling for tomorrow is recommended.`;
    } else if (isPastCutoff && !isEmergency) {
      scheduleRecommendation = "SCHEDULE_TOMORROW";
      scheduleReason = `It is past ${sameDayCutoffHour}:00 PM. Same-day non-emergency slots may experience delays; tomorrow morning is recommended.`;
    }

    const summaryMessage = `Worker receives ₹${workerEarning} (direct take-home with transit compensation). Society retains ₹${cooperativeContribution} for member healthcare. Total invoice: ₹${customerPaid}.`;

    return {
      breakdown: {
        customerPaid,
        baseWorkerWage,
        skillPremium,
        experiencePremium,
        travelAllowance,
        emergencyAllowance,
        workerEarning,
        cooperativeContribution,
        taxGst,
        serviceAmount,
        transportCost,
        returnTravelCost,
        platformFee,
        totalAmount,
        distanceKm,
        isLongDistance,
        scheduleRecommendation,
        scheduleReason
      },
      explanations,
      summaryMessage
    };
  }
}

export const fairWageEngine = new FairWageEngine();

