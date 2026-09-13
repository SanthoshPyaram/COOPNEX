import { Request, Response } from "express";
import { ServiceCoverageEngine } from "../services/serviceCoverageEngine";
import { ServiceArea } from "../models/ServiceArea";
import mongoose from "mongoose";

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
    // In-memory fallback
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
