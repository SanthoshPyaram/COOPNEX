import mongoose, { Schema, Document } from "mongoose";

export interface IStoredDocument extends Document {
  documentId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  data: string; // Base64 encoded file content or Data URI
  isAvatar: boolean;
  workerId?: string;
  documentType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoredDocumentSchema = new Schema<IStoredDocument>(
  {
    documentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    mimeType: {
      type: String,
      default: "application/octet-stream"
    },
    sizeBytes: {
      type: Number,
      default: 0
    },
    data: {
      type: String,
      required: true
    },
    isAvatar: {
      type: Boolean,
      default: false
    },
    workerId: {
      type: String,
      index: true
    },
    documentType: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const StoredDocument = mongoose.model<IStoredDocument>(
  "StoredDocument",
  StoredDocumentSchema
);

