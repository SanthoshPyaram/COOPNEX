import { Request, Response } from "express";
import fs from "fs";
import { AuthenticatedRequest } from "../middleware/auth";
import { saveDocument, getDocumentData, getDocumentFilePath } from "../services/documentService";
import { USER_ROLES } from "../config/constants";
import { Worker } from "../models/Worker";

/**
 * Upload a document (Aadhaar, PAN, PCC, or avatar).
 */
export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { fileData, originalName, mimeType, isAvatar, workerId, documentType } = req.body;

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
      isAvatar: Boolean(isAvatar),
      workerId: workerId || req.user?._id?.toString(),
      documentType
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
 * Accessible by authenticated SUPER_ADMIN or the document owner.
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
      const worker = await Worker.findOne({
        $or: [
          { userId: req.user._id },
          { _id: req.user._id },
          { workerIdNumber: req.user.workerIdNumber }
        ]
      });
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

    // Retrieve document (Disk cache -> MongoDB Atlas -> SVG generator fallback)
    const result = await getDocumentData(id);
    if (!result) {
      res.status(404).json({ success: false, message: "Requested document was not found or has expired." });
      return;
    }

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(result.filename)}"`);
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.send(result.buffer);
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
    const result = await getDocumentData(id);

    if (!result) {
      res.status(404).json({ success: false, message: "Profile photo not found." });
      return;
    }

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(result.buffer);
  } catch (error: any) {
    console.error("getAvatar streaming error:", error);
    res.status(500).json({ success: false, message: "Failed to stream profile photo." });
  }
};
