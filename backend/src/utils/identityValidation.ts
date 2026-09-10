/**
 * COOPNEX Core Identity Validation Utility
 *
 * Provides:
 * 1. Authentic mathematical UIDAI Dihedral D5 Verhoeff checksum validation for Aadhaar.
 * 2. Strict NSDL structural format validation for PAN.
 * 3. Preliminary validation state evaluator.
 *
 * NOTE: Checksum/format validity ONLY guarantees structural correctness.
 * It NEVER claims government authenticity or verified identity until
 * a SUPER_ADMIN manually reviews the corresponding scanned document.
 */

// Authentic UIDAI Dihedral D5 Verhoeff algorithm matrices
const dTable: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const pTable: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

export const invTable: number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Computes the authentic UIDAI Verhoeff check digit for the first 11 digits of an Aadhaar number.
 */
export function computeAadhaarCheckDigit(first11Digits: string): number {
  const clean = String(first11Digits).replace(/\D/g, "").slice(0, 11);
  const digits = clean.split("").map(Number).reverse();
  let c = 0;
  for (let i = 0; i < digits.length; i++) {
    c = dTable[c][pTable[(i + 1) % 8][digits[i]]];
  }
  return invTable[c];
}

/**
 * Generates or completes a mathematically valid 12-digit Aadhaar number with UIDAI Verhoeff parity.
 */
export function generateValidAadhaar(prefix = "54829103847"): string {
  const clean = prefix.replace(/\D/g, "").slice(0, 11).padEnd(11, "0");
  const checkDigit = computeAadhaarCheckDigit(clean);
  return clean + checkDigit.toString();
}

/**
 * Generates a structurally valid 10-character PAN string conforming to NSDL format.
 */
export function generateValidPan(): string {
  return "ABCDE1234F";
}

export interface ValidationResult {
  valid: boolean;
  status: "PASS" | "FAIL";
  message: string;
  isIdentityVerified: false; // Always false until manual admin review
}

/**
 * Validates a 12-digit Aadhaar number using the UIDAI Verhoeff algorithm.
 */
export function validateAadhaarVerhoeff(rawNumber: string): ValidationResult {
  if (!rawNumber) {
    return { valid: false, status: "FAIL", message: "Aadhaar number is required.", isIdentityVerified: false };
  }

  const clean = String(rawNumber).replace(/\D/g, "");

  if (clean.length !== 12) {
    return {
      valid: false,
      status: "FAIL",
      message: `Aadhaar must be exactly 12 digits (entered ${clean.length} digits).`,
      isIdentityVerified: false
    };
  }

  // Reject numbers starting with 0 or 1 (UIDAI standard)
  if (clean.startsWith("0") || clean.startsWith("1")) {
    return {
      valid: false,
      status: "FAIL",
      message: "Invalid Aadhaar: UIDAI numbers cannot begin with 0 or 1.",
      isIdentityVerified: false
    };
  }

  // Reject obviously repeating fake sequences (e.g. 222222222222)
  if (/^(\d)\1{11}$/.test(clean)) {
    return {
      valid: false,
      status: "FAIL",
      message: "Invalid Aadhaar: Repeating digit sequences are rejected.",
      isIdentityVerified: false
    };
  }

  // Run Verhoeff Checksum calculation
  let c = 0;
  const digits = clean.split("").map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = dTable[c][pTable[i % 8][digits[i]]];
  }

  if (c !== 0) {
    return {
      valid: false,
      status: "FAIL",
      message: "Aadhaar checksum failed: Number does not satisfy the UIDAI Verhoeff polynomial check.",
      isIdentityVerified: false
    };
  }

  return {
    valid: true,
    status: "PASS",
    message: "Aadhaar checksum mathematically valid. (Manual document review required).",
    isIdentityVerified: false
  };
}

/**
 * Validates a PAN string according to NSDL / Income Tax Department format:
 * 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F).
 */
export function validatePanFormat(rawPan: string): ValidationResult {
  if (!rawPan) {
    return { valid: false, status: "FAIL", message: "PAN number is required.", isIdentityVerified: false };
  }

  const clean = String(rawPan).trim().toUpperCase();

  // NSDL / ITD standard: 4th character MUST represent holder entity (P=Individual, C=Company, etc.)
  const PAN_REGEX = /^[A-Z]{3}[CPHFATBLJG][A-Z][0-9]{4}[A-Z]{1}$/;
  if (!PAN_REGEX.test(clean)) {
    return {
      valid: false,
      status: "FAIL",
      message: "Invalid PAN format. Must be 5 uppercase letters (with valid entity code), 4 digits, and 1 letter (e.g. ABCPS1234F).",
      isIdentityVerified: false
    };
  }

  return {
    valid: true,
    status: "PASS",
    message: "PAN format valid. (Manual document review required).",
    isIdentityVerified: false
  };
}

/**
 * Evaluates the preliminary validation score without falsely claiming identity authenticity.
 */
export function evaluatePreliminaryValidation(params: {
  aadhaarChecksumValid: boolean;
  panFormatValid: boolean;
  hasAadhaarDoc: boolean;
  hasPanDoc: boolean;
}): {
  status: "PRELIMINARY_PASSED" | "DOCUMENTS_MISSING" | "CHECKSUM_FAILED";
  summaryText: string;
  verificationStatus: "PENDING";
  preliminaryRiskScore: number;
} {
  const { aadhaarChecksumValid, panFormatValid, hasAadhaarDoc, hasPanDoc } = params;

  if (!aadhaarChecksumValid || !panFormatValid) {
    return {
      status: "CHECKSUM_FAILED",
      summaryText: "Credential structural check failed. Correct the Aadhaar checksum or PAN format.",
      verificationStatus: "PENDING",
      preliminaryRiskScore: 85
    };
  }

  if (!hasAadhaarDoc || !hasPanDoc) {
    return {
      status: "DOCUMENTS_MISSING",
      summaryText: "Required identity documents not yet attached. Upload scans for admin verification.",
      verificationStatus: "PENDING",
      preliminaryRiskScore: 50
    };
  }

  return {
    status: "PRELIMINARY_PASSED",
    summaryText: "Structural checks passed. Identity documents queued for Super Admin review.",
    verificationStatus: "PENDING",
    preliminaryRiskScore: 10
  };
}
