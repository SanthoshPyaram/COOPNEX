import { Request, Response } from "express";
import fs from "fs";
import { AuthenticatedRequest } from "../middleware/auth";
import { saveDocument, getDocumentFilePath } from "../services/documentService";
import { USER_ROLES } from "../config/constants";
import { Worker } from "../models/Worker";

/**
 * Upload a document (Aadhaar, PAN, PCC, or avatar).
 */
export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { fileData, originalName, mimeType, isAvatar } = req.body;

    if (!fileData || !originalName) {
      res.status(400).json({
        success: false,
        message: "Missing required file data or filename."
      });
      return;
    }

    const saved = await saveDocument({
      rawContent: fileData,
      originalName,
      mimeType,
      isAvatar: Boolean(isAvatar)
    });

    res.status(201).json({
      success: true,
      message: "Document stored securely in protected storage repository.",
      document: saved
    });
  } catch (error: any) {
    console.error("uploadDocument error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to store document."
    });
  }
};

/**
 * Protected document streaming endpoint.
 * STRICT RBAC: Accessible ONLY by authenticated SUPER_ADMIN or the document owner.
 */
export const getDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required to access statutory identity documents." });
      return;
    }

    const userRole = req.user.role;
    const isSuperAdmin = userRole === USER_ROLES.SUPER_ADMIN;

    // Check if worker owns this document
    let isOwner = false;
    if (!isSuperAdmin) {
      const worker = await Worker.findOne({ userId: req.user._id });
      if (worker && Array.isArray(worker.kycDocuments)) {
        isOwner = worker.kycDocuments.some(
          (doc) => doc.fileUrl?.includes(id) || (doc as any).storageReference?.includes(id)
        );
      }
    }

    if (!isSuperAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message: "Access Denied: Statutory KYC documents can only be inspected by authorized Super Administrators."
      });
      return;
    }

    const result = getDocumentFilePath(id);
    if (!result || !fs.existsSync(result.filePath)) {
      res.status(404).json({ success: false, message: "Requested document was not found or has expired." });
      return;
    }

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");

    const stream = fs.createReadStream(result.filePath);
    stream.pipe(res);
  } catch (error: any) {
    console.error("getDocument streaming error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve identity document." });
  }
};

/**
 * Public/Profile avatar streaming endpoint.
 */
export const getAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = getDocumentFilePath(id);

    if (!result || !fs.existsSync(result.filePath)) {
      res.status(404).json({ success: false, message: "Profile photo not found." });
      return;
    }

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    const stream = fs.createReadStream(result.filePath);
    stream.pipe(res);
  } catch (error: any) {
    console.error("getAvatar streaming error:", error);
    res.status(500).json({ success: false, message: "Failed to stream profile photo." });
  }
};

