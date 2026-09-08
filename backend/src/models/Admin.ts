import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  adminId: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "SUPER_ADMIN";
  status: "ACTIVE" | "LOCKED" | "SUSPENDED";
  mfaEnabled: boolean;
  mfaSecret?: string;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    adminId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, default: "Platform Administrator" },
    role: { type: String, enum: ["SUPER_ADMIN"], default: "SUPER_ADMIN", required: true },
    status: { type: String, enum: ["ACTIVE", "LOCKED", "SUSPENDED"], default: "ACTIVE", index: true },
    mfaEnabled: { type: Boolean, default: true },
    mfaSecret: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String }
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export interface ISecurityEvent extends Document {
  eventId: string;
  adminId: string;
  eventType: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "MFA_FAILED" | "LOCKOUT" | "PASSWORD_CHANGE" | "MFA_RESET" | "CRITICAL_ACTION" | "SESSION_REVOKED";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ipAddress: string;
  userAgent?: string;
  device?: string;
  actionTaken?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const SecurityEventSchema = new Schema<ISecurityEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    adminId: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: ["LOGIN_SUCCESS", "LOGIN_FAILED", "MFA_FAILED", "LOCKOUT", "PASSWORD_CHANGE", "MFA_RESET", "CRITICAL_ACTION", "SESSION_REVOKED"],
      required: true
    },
    riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "LOW" },
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    device: { type: String },
    actionTaken: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

export const SecurityEvent = mongoose.model<ISecurityEvent>("SecurityEvent", SecurityEventSchema);

export interface IAdminAuditLog extends Document {
  logId: string;
  adminId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

const AdminAuditLogSchema = new Schema<IAdminAuditLog>(
  {
    logId: { type: String, required: true, unique: true, index: true },
    adminId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    resourceType: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    previousState: { type: Schema.Types.Mixed },
    newState: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

export const AdminAuditLog = mongoose.model<IAdminAuditLog>("AdminAuditLog", AdminAuditLogSchema);

