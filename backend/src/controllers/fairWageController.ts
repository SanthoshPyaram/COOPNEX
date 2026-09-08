import { Request, Response } from "express";
import { fairWageEngine, DEFAULT_WAGE_POLICY } from "../services/fairWageEngine";

export const calculateWageBreakdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      serviceCategory = "Electrician",
      workerVerificationLevel = 4,
      workerExperienceYears = 5,
      distanceKm = 2.4,
      isEmergency = false,
      hoursEstimated = 1
    } = req.body;

    const result = fairWageEngine.calculate({
      serviceCategory: String(serviceCategory),
      workerVerificationLevel: Number(workerVerificationLevel),
      workerExperienceYears: Number(workerExperienceYears),
      distanceKm: Number(distanceKm),
      isEmergency: Boolean(isEmergency),
      hoursEstimated: Number(hoursEstimated)
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Fair wage calculation error.", error: error.message });
  }
};

export const getPolicyRules = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    policy: DEFAULT_WAGE_POLICY,
    principles: [
      "1. Worker-First Take-Home: 80-85% of customer invoice directly goes to worker take-home wage.",
      "2. Skill-Indexed Premium: Direct economic incentive for completing NSDC and state cooperative certifications.",
      "3. Fair Travel Allowance: Fuel and transit costs are explicitly paid by customer, never absorbed by the worker.",
      "4. Collective Welfare Pool: 12% is retained directly by the Labour Society for medical insurance, maternity benefits, and children's education scholarships."
    ]
  });
};

