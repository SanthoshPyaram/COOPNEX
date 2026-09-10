import { describe, it, expect } from "vitest";
import {
  validateAadhaarVerhoeff,
  validatePanFormat,
  evaluatePreliminaryValidation
} from "../utils/identityValidation";

describe("Identity Validation Engine - UIDAI Verhoeff & NSDL PAN", () => {
  describe("Aadhaar Verhoeff D5 Algorithm", () => {
    it("should reject Aadhaar numbers starting with 0 or 1 per UIDAI rules", () => {
      // 0-prefixed or 1-prefixed numbers are invalid in UIDAI specs
      expect(validateAadhaarVerhoeff("012345678901").valid).toBe(false);
      expect(validateAadhaarVerhoeff("123456789012").valid).toBe(false);
    });

    it("should reject numbers that are not exactly 12 digits", () => {
      expect(validateAadhaarVerhoeff("").valid).toBe(false);
      expect(validateAadhaarVerhoeff("12345").valid).toBe(false);
      expect(validateAadhaarVerhoeff("2345678901234").valid).toBe(false); // 13 digits
      expect(validateAadhaarVerhoeff("23456789012A").valid).toBe(false); // alphabetic
    });

    it("should reject dummy sequential Aadhaar 123456789123", () => {
      expect(validateAadhaarVerhoeff("123456789123").valid).toBe(false);
    });

    it("should validate a genuine Verhoeff checksum", () => {
      const validAadhaar = "999999990019";
      expect(validateAadhaarVerhoeff(validAadhaar).valid).toBe(true);

      // Mutating any single digit must fail
      const tampered = "999999990018";
      expect(validateAadhaarVerhoeff(tampered).valid).toBe(false);

      // Swapping adjacent digits must fail (Verhoeff transposition detection)
      const transposed = "999999990109";
      expect(validateAadhaarVerhoeff(transposed).valid).toBe(false);
    });

    it("should handle formatting with spaces gracefully", () => {
      expect(validateAadhaarVerhoeff("9999 9999 0019").valid).toBe(true);
      expect(validateAadhaarVerhoeff(" 9999 9999 0019 ").valid).toBe(true);
    });
  });

  describe("PAN Format Validation", () => {
    it("should validate standard individual PAN formats", () => {
      expect(validatePanFormat("ABCDE1234F").valid).toBe(false); // 'E' is not a valid 4th char
      expect(validatePanFormat("ABCPE12345F").valid).toBe(false); // 11 chars
      expect(validatePanFormat("ABCP1234F").valid).toBe(false); // 9 chars

      // Valid entity codes
      expect(validatePanFormat("ABCPS1234F").valid).toBe(true); // P = Individual
      expect(validatePanFormat("ABCCH1234F").valid).toBe(true); // C = Company
      expect(validatePanFormat("ABCFG1234F").valid).toBe(true); // F = Firm
      expect(validatePanFormat("ABCTH1234F").valid).toBe(true); // T = Trust
    });

    it("should reject invalid 4th character (entity type)", () => {
      // 'X', 'Z', 'M', 'E' are not valid 4th characters in Indian PAN
      expect(validatePanFormat("ABCXZ1234F").valid).toBe(false);
      expect(validatePanFormat("ABCZZ1234F").valid).toBe(false);
      expect(validatePanFormat("ABCMZ1234F").valid).toBe(false);
    });

    it("should reject dummy PAN like ABCDEF1234", () => {
      expect(validatePanFormat("ABCDEF1234").valid).toBe(false);
    });

    it("should normalize lowercase input", () => {
      expect(validatePanFormat("abcps1234f").valid).toBe(true);
    });
  });

  describe("Preliminary Validation Evaluation", () => {
    it("should assess risk for valid structural credentials honestly", () => {
      const result = evaluatePreliminaryValidation({
        aadhaarChecksumValid: true,
        panFormatValid: true,
        hasAadhaarDoc: true,
        hasPanDoc: true
      });

      // Crucial: Must NEVER assign 0% risk based only on preliminary syntax check
      expect(result.preliminaryRiskScore).toBeGreaterThanOrEqual(10);
      expect(result.status).toBe("PRELIMINARY_PASSED");
      expect(result.verificationStatus).toBe("PENDING");
      expect(result.summaryText).toContain("review");
    });

    it("should penalize missing or invalid Aadhaar/PAN heavily", () => {
      const badResult = evaluatePreliminaryValidation({
        aadhaarChecksumValid: false,
        panFormatValid: false,
        hasAadhaarDoc: false,
        hasPanDoc: false
      });

      expect(badResult.preliminaryRiskScore).toBeGreaterThanOrEqual(70);
      expect(badResult.status).toBe("CHECKSUM_FAILED");
      expect(badResult.verificationStatus).toBe("PENDING");
    });
  });
});
