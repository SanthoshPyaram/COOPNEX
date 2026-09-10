import { describe, it, expect } from "vitest";
import { saveDocument, getDocumentData } from "../services/documentService";

describe("Worker KYC Document Flow Tests", () => {
  it("should save and retrieve an authentic PDF document with correct MIME type and metadata", async () => {
    const originalName = "artisan_aadhaar_card.pdf";
    const samplePdfBase64 = "JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwKL1RpdGxlIChBcnRpc2FuIEFhZGhhYXIpCj4+CmVuZG9iago=";
    const rawContent = `data:application/pdf;base64,${samplePdfBase64}`;

    const saved = await saveDocument({
      rawContent,
      originalName,
      mimeType: "application/pdf",
      workerId: "WRK-TEST-001",
      documentType: "AADHAAR"
    });

    expect(saved.documentId).toMatch(/^DOC-/);
    expect(saved.storageReference).toBe(`/api/documents/${saved.documentId}`);
    expect(saved.originalName).toBe(originalName);
    expect(saved.mimeType).toBe("application/pdf");
    expect(saved.sizeBytes).toBeGreaterThan(0);

    // Retrieve the document
    const retrieved = await getDocumentData(saved.documentId);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.mimeType).toBe("application/pdf");
    expect(retrieved!.filename).toContain(saved.documentId);
    expect(retrieved!.buffer.length).toBe(saved.sizeBytes);
  });

  it("should save and retrieve an authentic image document (JPEG) accurately", async () => {
    const originalName = "pan_card_photo.jpg";
    const sampleJpgBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
    const rawContent = `data:image/jpeg;base64,${sampleJpgBase64}`;

    const saved = await saveDocument({
      rawContent,
      originalName,
      mimeType: "image/jpeg",
      workerId: "WRK-TEST-002",
      documentType: "PAN"
    });

    expect(saved.documentId).toMatch(/^DOC-/);
    expect(saved.mimeType).toBe("image/jpeg");

    const retrieved = await getDocumentData(saved.documentId);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.mimeType).toBe("image/jpeg");
    expect(retrieved!.buffer.length).toBe(saved.sizeBytes);
  });

  it("should strictly return null and NOT generate fake documents when document is missing or invalid", async () => {
    const fakeId = "DOC-NON-EXISTENT-RANDOM-123456";
    const retrieved = await getDocumentData(fakeId);
    expect(retrieved).toBeNull();
  });

  it("should reject documents that exceed the 10 MB limit", async () => {
    const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024);
    await expect(
      saveDocument({
        rawContent: oversizedBuffer,
        originalName: "giant_file.pdf",
        mimeType: "application/pdf"
      })
    ).rejects.toThrow(/exceeds the maximum permissible limit/);
  });
});
