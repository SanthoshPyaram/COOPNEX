import mongoose, { Schema, Document } from "mongoose";
import { USER_ROLES, UserRole } from "../config/constants";

export interface IUser extends Document {
  authProviderUserId?: string;
  employeeId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: number;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  state?: string;
  district: string;
  city: string;
  pincode?: string;
  address?: string;
  societyId?: mongoose.Types.ObjectId;
  federationId?: mongoose.Types.ObjectId;
  avatarUrl?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  phoneVerificationProvider?: string;
  phoneVerificationId?: string;
  phoneVerifiedAt?: Date;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  profileCompleted: boolean;
  lastLoginAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    authProviderUserId: { type: String, sparse: true, index: true },
    employeeId: { type: String, sparse: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], default: "Prefer not to say" },
    age: { type: Number },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: false, sparse: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
      required: true,
      index: true
    },
    state: { type: String, default: "Andhra Pradesh" },
    district: { type: String, required: true, default: "Vijayawada" },
    city: { type: String, required: true, default: "Vijayawada" },
    pincode: { type: String, trim: true, index: true },
    address: { type: String },
    societyId: { type: Schema.Types.ObjectId, ref: "Society" },
    federationId: { type: Schema.Types.ObjectId, ref: "Federation" },
    avatarUrl: { type: String },
    bloodGroup: { type: String, trim: true, default: "O+" },
    emergencyContactName: { type: String, trim: true },
    emergencyContactPhone: { type: String, trim: true },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneVerificationProvider: { type: String, trim: true },
    phoneVerificationId: { type: String, trim: true },
    phoneVerifiedAt: { type: Date },
    status: { type: String, enum: ["ACTIVE", "PENDING", "SUSPENDED"], default: "ACTIVE" },
    profileCompleted: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Compound Unique Indexes to support identical customer and worker emails without collision
UserSchema.index({ email: 1, role: 1 }, { unique: true });
UserSchema.index({ phone: 1, role: 1 }, { unique: true, sparse: true });

export const User = mongoose.model<IUser>("User", UserSchema);
