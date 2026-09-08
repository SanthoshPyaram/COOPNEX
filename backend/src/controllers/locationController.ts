import { Request, Response } from "express";
import { ServiceCoverageEngine } from "../services/serviceCoverageEngine";

export const checkPincode = async (req: Request, res: Response): Promise<void> => {
  try {
    const pincode = String(req.query.pincode || "");
    const service = req.query.service ? String(req.query.service) : undefined;

    if (!pincode) {
      res.status(400).json({
        success: false,
        message: "Pincode parameter is required."
      });
      return;
    }

    const result = ServiceCoverageEngine.checkAvailability(pincode, service);
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

