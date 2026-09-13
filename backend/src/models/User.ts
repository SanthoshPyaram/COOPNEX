import mongoose, { Schema, Document } from "mongoose";
import { USER_ROLES, UserRole } from "../config/constants";

export interface IUser extends Document {
  authProviderUserId?: string;
  employeeId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: Date;
  ageAtRegistration?: number;
  age?: number;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  roles?: UserRole[];
  state?: string;
  stateCode?: string;
  district: string;
  city: string;
  mandal?: string;
  village?: string;
  houseNumber?: string;
  street?: string;
  landmark?: string;
  pincode?: string;
  address?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
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
  languages?: string[];
  rejectionReason?: string;
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
    dateOfBirth: { type: Date, index: true },
    ageAtRegistration: { type: Number },
    age: { type: Number },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
      required: true,
      index: true
    },
    roles: {
      type: [String],
      enum: Object.values(USER_ROLES),
      default: [USER_ROLES.CUSTOMER],
      index: true
    },
    state: { type: String, trim: true },
    stateCode: { type: String, trim: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    mandal: { type: String, trim: true },
    village: { type: String, trim: true },
    houseNumber: { type: String, trim: true },
    street: { type: String, trim: true },
    landmark: { type: String, trim: true },
    pincode: { type: String, trim: true, index: true },
    address: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [80.6480, 16.5062] }
    },
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
    languages: { type: [String], default: ["Telugu", "English"] },
    rejectionReason: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "PENDING", "SUSPENDED"], default: "ACTIVE" },
    profileCompleted: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Person-Level Unique Indexes: One User account per email and phone
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

export const User = mongoose.model<IUser>("User", UserSchema);
