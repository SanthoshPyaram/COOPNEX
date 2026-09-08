import { Request, Response } from "express";
import { z } from "zod";
import { ServerTtsService } from "../services/ttsService";

const synthesizeSchema = z.object({
  text: z.string().min(1, "Text cannot be empty").max(1000, "Text exceeds 1000 characters limit"),
  language: z.string().optional().default("en-IN"),
  speed: z.number().min(0.5).max(1.5).optional(),
  gender: z.enum(["FEMALE", "MALE"]).optional().default("FEMALE"),
  pitch: z.number().min(-10).max(10).optional()
});

export const synthesizeSpeech = async (req: Request, res: Response) => {
  try {
    const parseResult = synthesizeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid TTS request payload",
        errors: parseResult.error.format()
      });
      return;
    }

    const result = await ServerTtsService.synthesizeSpeech(parseResult.data);
    res.json(result);
  } catch (error: any) {
    console.error("[TTSController] Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error during speech synthesis"
    });
  }
};

export const getVoiceConfig = async (_req: Request, res: Response) => {
  try {
    const catalogue = ServerTtsService.getVoiceCatalogue();
    res.json({
      success: true,
      provider: process.env.GOOGLE_TTS_API_KEY ? "google-cloud" : "browser-fallback",
      hasCloudCredentials: !!process.env.GOOGLE_TTS_API_KEY,
      totalLanguages: catalogue.length,
      voices: catalogue
    });
  } catch (error: any) {
    console.error("[TTSController] Error fetching voice config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve voice catalogue"
    });
  }
};

