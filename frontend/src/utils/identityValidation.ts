/**
 * COOPNEX Core Identity Validation Utility (Client-Side)
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

export interface ValidationResult {
  valid: boolean;
  status: "PASS" | "FAIL";
  message: string;
  isIdentityVerified: false;
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
      message: `Aadhaar must be exactly 12 digits (currently ${clean.length} digits).`,
      isIdentityVerified: false
    };
  }

  if (clean.startsWith("0") || clean.startsWith("1")) {
    return {
      valid: false,
      status: "FAIL",
      message: "Invalid Aadhaar: UIDAI numbers cannot begin with 0 or 1.",
      isIdentityVerified: false
    };
  }

  if (/^(\d)\1{11}$/.test(clean)) {
    return {
      valid: false,
      status: "FAIL",
      message: "Invalid Aadhaar: Repeated single-digit sequence is not permissible.",
      isIdentityVerified: false
    };
  }

  let c = 0;
  const digits = clean.split("").map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = dTable[c][pTable[i % 8][digits[i]]];
  }

  if (c !== 0) {
    return {
      valid: false,
      status: "FAIL",
      message: "Checksum failed: Aadhaar number violates UIDAI Verhoeff mathematical parity.",
      isIdentityVerified: false
    };
  }

  return {
    valid: true,
    status: "PASS",
    message: "Aadhaar checksum mathematically valid. (Manual document review pending).",
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

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!PAN_REGEX.test(clean)) {
    return {
      valid: false,
      status: "FAIL",
      message: "Invalid PAN format. Must match 5 letters, 4 numbers, and 1 letter (e.g. ABCDE1234F).",
      isIdentityVerified: false
    };
  }

  return {
    valid: true,
    status: "PASS",
    message: "PAN format structurally valid. (Manual document review pending).",
    isIdentityVerified: false
  };
}

/**
 * Evaluates the preliminary validation score without claiming authenticity.
 */
export function evaluatePreliminaryValidation(params: {
  aadhaarChecksumValid: boolean;
  panFormatValid: boolean;
  hasAadhaarDoc: boolean;
  hasPanDoc: boolean;
}): {
  status: "PRELIMINARY_PASSED" | "DOCUMENTS_MISSING" | "CHECKSUM_FAILED";
  summaryText: string;
  badgeLabel: string;
  badgeColor: string;
} {
  const { aadhaarChecksumValid, panFormatValid, hasAadhaarDoc, hasPanDoc } = params;

  if (!aadhaarChecksumValid || !panFormatValid) {
    return {
      status: "CHECKSUM_FAILED",
      summaryText: "Credential structural check failed. Correct the Aadhaar checksum or PAN format.",
      badgeLabel: "STRUCTURAL CHECK FAILED",
      badgeColor: "rose"
    };
  }

  if (!hasAadhaarDoc || !hasPanDoc) {
    return {
      status: "DOCUMENTS_MISSING",
      summaryText: "Identity numbers pass checksum. Please attach scan of Aadhaar & PAN to submit for review.",
      badgeLabel: "DOCUMENTS REQUIRED",
      badgeColor: "amber"
    };
  }

  return {
    status: "PRELIMINARY_PASSED",
    summaryText: "Aadhaar checksum & PAN format valid. Identity documents will be submitted for Super Admin review.",
    badgeLabel: "PRE-CHECK PASSED • REVIEW PENDING",
    badgeColor: "blue"
  };
}

