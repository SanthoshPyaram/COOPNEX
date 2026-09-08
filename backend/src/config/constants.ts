export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  WORKER: "WORKER",
  SOCIETY_ADMIN: "SOCIETY_ADMIN",
  FEDERATION_ADMIN: "FEDERATION_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const BOOKING_STATUS = {
  REQUESTED: "REQUESTED",
  MATCHING: "MATCHING",
  ASSIGNED: "ASSIGNED",
  ACCEPTED: "ACCEPTED",
  ON_THE_WAY: "ON_THE_WAY",
  ARRIVED: "ARRIVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const;

export type BookingStatus = keyof typeof BOOKING_STATUS;

export const VERIFICATION_LEVELS = {
  LEVEL_1: { level: 1, name: "Identity Verified", desc: "Aadhaar / National ID verified" },
  LEVEL_2: { level: 2, name: "Cooperative Member", desc: "Registered member of certified Labour Cooperative Society" },
  LEVEL_3: { level: 3, name: "Trade Skill Verified", desc: "Trade assessment passed by cooperative technical committee" },
  LEVEL_4: { level: 4, name: "Govt / State Certified", desc: "NSDC / State Skill Development Corporation certified" },
  LEVEL_5: { level: 5, name: "Master Craftsman / Trainer", desc: "7+ years verified experience & safety supervisor certification" }
} as const;

export const SERVICE_CATEGORIES = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Caregiver",
  "Driver",
  "Gardener",
  "Technician",
  "Domestic Helper"
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

export const EMERGENCY_CATEGORIES = [
  "Electrical Short Circuit / Hazard",
  "Severe Water Pipe Burst / Leakage",
  "Urgent Elderly / Patient Care",
  "Critical Appliance Breakdown",
  "Emergency Drainage / Sanitation Issue"
] as const;

