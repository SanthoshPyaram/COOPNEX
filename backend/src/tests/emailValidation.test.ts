import { describe, it, expect } from "vitest";
import {
  validateEmailSyntax,
  checkMxRecords,
  validateEmailAddress
} from "../services/emailValidationService";

describe("Email Validation Service", () => {
  describe("Syntax Validation", () => {
    it("rejects non-string or empty inputs", () => {
      expect(validateEmailSyntax("").isValid).toBe(false);
      expect(validateEmailSyntax("   ").isValid).toBe(false);
      expect(validateEmailSyntax(null as any).isValid).toBe(false);
    });

    it("rejects incomplete syntax: abc, abc@, @test.com, abc.com@", () => {
      expect(validateEmailSyntax("abc").isValid).toBe(false);
      expect(validateEmailSyntax("abc@").isValid).toBe(false);
      expect(validateEmailSyntax("@test.com").isValid).toBe(false);
      expect(validateEmailSyntax("abc.com@").isValid).toBe(false);
      expect(validateEmailSyntax("test").isValid).toBe(false);
    });

    it("rejects emails containing spaces or forbidden dot placements", () => {
      expect(validateEmailSyntax("user @domain.com").isValid).toBe(false);
      expect(validateEmailSyntax("user@domain .com").isValid).toBe(false);
      expect(validateEmailSyntax(".user@domain.com").isValid).toBe(false);
      expect(validateEmailSyntax("user.@domain.com").isValid).toBe(false);
      expect(validateEmailSyntax("user..name@domain.com").isValid).toBe(false);
    });

    it("accepts structurally valid email formats", () => {
      expect(validateEmailSyntax("santhosh@gmail.com").isValid).toBe(true);
      expect(validateEmailSyntax("test.user+tag@domain.co.in").isValid).toBe(true);
      expect(validateEmailSyntax("artisan.member@coopnex.org").isValid).toBe(true);
    });
  });

  describe("Disposable Domain Detection", () => {
    it("rejects known temporary disposable email addresses", async () => {
      const res1 = await validateEmailAddress("throwaway123@mailinator.com");
      expect(res1.status).toBe("disposable");
      expect(res1.safeToSendOtp).toBe(false);
      expect(res1.message).toContain("disposable");

      const res2 = await validateEmailAddress("tempuser@tempmail.com");
      expect(res2.status).toBe("disposable");
      expect(res2.safeToSendOtp).toBe(false);
    });
  });

  describe("Non-existent Domain MX Resolution", () => {
    it("rejects domains that do not exist or have zero MX records", async () => {
      const res = await validateEmailAddress("fakeaddress@nonexistentdomain987654321xyz.org");
      expect(res.status).toBe("invalid");
      expect(res.safeToSendOtp).toBe(false);
      expect(res.reason).toBe("no_dns_entries");
      expect(res.message).toContain("couldn't verify this email address");
    });
  });

  describe("Overall validateEmailAddress Decision Engine", () => {
    it("fails safely if syntax is invalid", async () => {
      const res = await validateEmailAddress("invalid-email-address");
      expect(res.safeToSendOtp).toBe(false);
      expect(res.status).toBe("invalid");
      expect(res.message).toBe("❌ Please enter a valid email address. 📧");
    });
  });
});

