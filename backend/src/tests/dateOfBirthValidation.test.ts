import { describe, it, expect } from "vitest";

function calculateExactAge(dob: string | Date, referenceDate: Date = new Date()): number | null {
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

function validateDateOfBirth(
  dobString: string,
  referenceDate: Date = new Date()
) {
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

describe("Date of Birth & Exact 18+ Rule Verification", () => {
  // Fix reference date: 2026-09-13
  const refDate = new Date(2026, 8, 13); // September 13, 2026

  it("TEST C: rejects future DOB", () => {
    const res = validateDateOfBirth("2030-01-01", refDate);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("❌ Date of birth cannot be in the future. 📅");
  });

  it("TEST D: rejects user whose birthday has not occurred yet this year (age 17)", () => {
    // Born 2008-09-14: On 2026-09-13, birthday is tomorrow -> age is 17
    const res = validateDateOfBirth("2008-09-14", refDate);
    expect(res.isValid).toBe(false);
    expect(res.age).toBe(17);
    expect(res.error).toBe("🔴 Sorry! You must be at least 18 years old to register. 🎂");
  });

  it("TEST E: accepts user who turns exactly 18 today", () => {
    // Born 2008-09-13: On 2026-09-13, birthday is today -> age is 18
    const res = validateDateOfBirth("2008-09-13", refDate);
    expect(res.isValid).toBe(true);
    expect(res.age).toBe(18);
    expect(res.successMsg).toBe("✅ Age verified — you are eligible to register. 🎉");
  });

  it("TEST F: accepts valid adult (e.g. age 25)", () => {
    // Born 2001-05-15: age 25
    const res = validateDateOfBirth("2001-05-15", refDate);
    expect(res.isValid).toBe(true);
    expect(res.age).toBe(25);
  });

  it("rejects empty DOB", () => {
    const res = validateDateOfBirth("", refDate);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("❌ Please enter your date of birth. 📅");
  });

  it("rejects malformed date strings", () => {
    const res = validateDateOfBirth("not-a-date", refDate);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("❌ Please enter a valid date of birth. 📅");
  });

  it("rejects DOB older than 120 years", () => {
    const res = validateDateOfBirth("1890-01-01", refDate);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("❌ Please enter a valid date of birth. 📅");
  });
});

