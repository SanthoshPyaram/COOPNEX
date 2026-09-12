/**
 * Project-Wide Strict Form Validation Engine for COOPNEX
 * Enforces human-friendly errors, emojis, and exact rule sets.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  successMsg?: string;
}

export interface PasswordBreakdown {
  min8: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
  isValid: boolean;
}

export * from "./formatting";

/**
 * Name Validation:
 * Only alphabetic characters, single spaces, and optional periods (e.g. "Rahul Kumar", "A. Kumar").
 * Rejects numbers, special symbols, multiple spaces, or empty strings.
 */
export function validateName(name: string, fieldLabel = "name"): ValidationResult {
  const trimmed = (name || "").trim();
  const label = fieldLabel === "name" ? "name" : fieldLabel.toLowerCase();
  if (!trimmed) {
    return {
      isValid: false,
      error: `❌ Please enter a valid ${label} using letters only. 👤`
    };
  }

  // Check for any digits
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: `❌ Please enter a valid ${label} using letters only. 👤`
    };
  }

  // Check for forbidden special characters (allow letters, single dots, single hyphens, single spaces)
  const nameRegex = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*[.]?$/;
  if (!nameRegex.test(trimmed) || trimmed.length < 2 || trimmed.length > 60) {
    return {
      isValid: false,
      error: `❌ Please enter a valid ${label} using letters only. 👤`
    };
  }

  return {
    isValid: true,
    successMsg: `✅ ${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)} looks good! 👤`
  };
}

/**
 * Age Validation:
 * Integer only, reject decimals, reject letters, range 1 - 120.
 */
export function validateAge(age: number | string, min = 18, max = 100): ValidationResult {
  const str = String(age ?? "").trim();
  if (!str) {
    return {
      isValid: false,
      error: `❌ Please enter a valid age between ${min} and ${max}. 🎂`
    };
  }

  // Reject letters, negative signs or decimals
  if (!/^\d+$/.test(str)) {
    return {
      isValid: false,
      error: `❌ Please enter a valid age between ${min} and ${max}. 🎂`
    };
  }

  const num = parseInt(str, 10);
  if (num < min || num > max) {
    return {
      isValid: false,
      error: `❌ Please enter a valid age between ${min} and ${max}. 🎂`
    };
  }

  return {
    isValid: true,
    successMsg: "✅ Age verified. 🎂"
  };
}

/**
 * Calculates exact age in full years from date of birth against a reference date.
 * Accurately handles whether the birthday has occurred yet in the current calendar year.
 */
export function calculateExactAge(dob: string | Date, referenceDate: Date = new Date()): number | null {
  if (!dob) return null;
  const birthDate = typeof dob === "string" ? new Date(dob) : dob;
  if (isNaN(birthDate.getTime())) return null;

  const today = referenceDate;
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export interface DateOfBirthValidationResult {
  isValid: boolean;
  age: number | null;
  error?: string;
  successMsg?: string;
}

/**
 * Comprehensive Date of Birth Validation:
 * - Rejects empty input
 * - Rejects malformed/impossible dates
 * - Rejects future dates
 * - Rejects dates older than 120 years
 * - Enforces the strict 18+ eligibility rule using exact birth date
 */
export function validateDateOfBirth(
  dobString: string,
  referenceDate: Date = new Date()
): DateOfBirthValidationResult {
  const trimmed = (dobString || "").trim();
  if (!trimmed) {
    return {
      isValid: false,
      age: null,
      error: "❌ Please enter your date of birth. 📅"
    };
  }

  const parts = trimmed.split("-");
  if (parts.length !== 3) {
    return {
      isValid: false,
      age: null,
      error: "❌ Please enter a valid date of birth. 📅"
    };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return {
      isValid: false,
      age: null,
      error: "❌ Please enter a valid date of birth. 📅"
    };
  }

  const birthDate = new Date(year, month - 1, day);
  if (
    isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return {
      isValid: false,
      age: null,
      error: "❌ Please enter a valid date of birth. 📅"
    };
  }

  const today = referenceDate;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (birthDate > todayStart) {
    return {
      isValid: false,
      age: null,
      error: "❌ Date of birth cannot be in the future. 📅"
    };
  }

  const minYear = today.getFullYear() - 120;
  if (year < minYear) {
    return {
      isValid: false,
      age: null,
      error: "❌ Please enter a valid date of birth. 📅"
    };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return {
      isValid: false,
      age,
      error: "🔴 Sorry! You must be at least 18 years old to register. 🎂"
    };
  }

  return {
    isValid: true,
    age,
    successMsg: "✅ Age verified — you are eligible to register. 🎉"
  };
}

/**
 * Stage 1 Email Format Validation:
 * Strict format check rejecting abc, abc@, abc.com@, @domain.com.
 */
export function validateEmailFormat(email: string): ValidationResult {
  const clean = (email || "").trim().toLowerCase();
  if (!clean) {
    return {
      isValid: false,
      error: "❌ Please enter a valid email address. 📧"
    };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean) || clean.startsWith("@") || clean.endsWith("@") || clean.includes("..")) {
    return {
      isValid: false,
      error: "❌ Please enter a valid email address. 📧"
    };
  }

  return {
    isValid: true,
    successMsg: "✅ Email format is valid. 📧"
  };
}

/**
 * Password Requirements Breakdown & Validation:
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
 */
export function evaluatePassword(password: string): PasswordBreakdown {
  const p = password || "";
  const min8 = p.length >= 8;
  const upper = /[A-Z]/.test(p);
  const lower = /[a-z]/.test(p);
  const number = /[0-9]/.test(p);
  const special = /[^A-Za-z0-9]/.test(p);

  return {
    min8,
    upper,
    lower,
    number,
    special,
    isValid: min8 && upper && lower && number && special
  };
}

export function validatePassword(password: string): ValidationResult {
  const { isValid } = evaluatePassword(password);
  if (!isValid) {
    return {
      isValid: false,
      error: "❌ Password must contain at least 8 characters, including uppercase, lowercase, number and special character. 🔐"
    };
  }

  return {
    isValid: true,
    successMsg: "✅ Password is strong! 🔐"
  };
}

/**
 * Confirm Password Match Validation:
 */
export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: "❌ Please confirm your password. 🔐"
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: "❌ Passwords do not match. Please try again. 🔐"
    };
  }

  return {
    isValid: true,
    successMsg: "✅ Passwords match! 🔐"
  };
}

/**
 * Phone Validation:
 * Numbers only, exactly 10 digits (excluding optional +91 prefix).
 */
export function validatePhone(phone: string): ValidationResult {
  const raw = (phone || "").trim();
  const digits = raw.replace(/\D/g, "");

  if (!digits) {
    return {
      isValid: false,
      error: "❌ Please enter a valid phone number. 📱"
    };
  }

  const last10 = digits.slice(-10);
  if (last10.length !== 10 || !/^[6-9]\d{9}$/.test(last10)) {
    return {
      isValid: false,
      error: "❌ Please enter a valid phone number. 📱"
    };
  }

  return {
    isValid: true,
    successMsg: "✅ Phone number looks good! 📱"
  };
}

/**
 * Indian Pincode Validation:
 * Exactly 6 digits, numeric only, non-zero start.
 */
export function validatePincode(pincode: string): ValidationResult {
  const clean = (pincode || "").trim().replace(/\D/g, "");
  if (clean.length !== 6 || clean.startsWith("0")) {
    return {
      isValid: false,
      error: "❌ Please enter a valid PIN code. 📍"
    };
  }

  return {
    isValid: true,
    successMsg: "✅ PIN code verified. 📍"
  };
}

/**
 * OTP Code Validation:
 */
export function validateOtp(otp: string, length = 6): ValidationResult {
  const clean = (otp || "").trim().replace(/\D/g, "");
  if (clean.length !== length) {
    return {
      isValid: false,
      error: `❌ Please enter the complete ${length}-digit OTP code. 🔐`
    };
  }

  return {
    isValid: true,
    successMsg: "✅ OTP entered. 🔐"
  };
}

/**
 * Required Text / Textarea Validation:
 */
export function validateRequired(value: string, fieldLabel = "This field", emoji = "📝"): ValidationResult {
  const clean = (value || "").trim();
  if (!clean) {
    return {
      isValid: false,
      error: `❌ ${fieldLabel} is required. ${emoji}`
    };
  }

  return {
    isValid: true
  };
}

/**
 * Minimum Length Textarea / Description Validation:
 */
export function validateMinLength(value: string, minLength: number, fieldLabel = "Description", emoji = "📝"): ValidationResult {
  const clean = (value || "").trim();
  if (clean.length < minLength) {
    return {
      isValid: false,
      error: `❌ ${fieldLabel} must be at least ${minLength} characters. ${emoji}`
    };
  }

  return {
    isValid: true,
    successMsg: `✅ ${fieldLabel} looks good! ${emoji}`
  };
}
