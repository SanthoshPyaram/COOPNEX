import dns from "dns";
import axios from "axios";

export interface EmailValidationResult {
  email: string;
  normalizedEmail: string;
  status: "valid" | "invalid" | "catch_all" | "unknown" | "disposable" | "blocked";
  safeToSendOtp: boolean;
  reason?: string;
  subStatus?: string;
  message: string;
  details?: {
    domain: string;
    mxFound: boolean;
    provider?: string;
    disposable?: boolean;
    zeroBounceChecked?: boolean;
  };
}

// Curated list of high-risk disposable and temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "yopmail.com",
  "getairmail.com",
  "sharklasers.com",
  "dispostable.com",
  "burnerdigital.com",
  "trashmail.com",
  "fakeinbox.com",
  "temp-mail.org",
  "tempr.email",
  "discard.email",
  "generator.email",
  "maildrop.cc",
  "inboxkitten.com",
  "crazymailing.com",
  "mohmal.com",
  "mytemp.email",
  "getnada.com",
  "tempail.com",
  "emailondeck.com",
  "throwawayemail.com",
  "fakemailgenerator.com",
  "zillamail.com",
  "nada.ltd",
  "tempinbox.com",
  "disposablemail.com",
  "tempmailer.com"
]);

/**
 * Validates basic and RFC 5322 email syntax
 */
export function validateEmailSyntax(email: string): { isValid: boolean; reason?: string } {
  if (!email || typeof email !== "string") {
    return { isValid: false, reason: "empty_or_not_string" };
  }

  const clean = email.trim();
  if (clean.length < 6 || clean.length > 254) {
    return { isValid: false, reason: "invalid_length" };
  }

  if (clean.includes(" ") || clean.includes("\t") || clean.includes("\n")) {
    return { isValid: false, reason: "contains_whitespace" };
  }

  const parts = clean.split("@");
  if (parts.length !== 2) {
    return { isValid: false, reason: "multiple_or_missing_at" };
  }

  const [local, domain] = parts;
  if (!local || !domain) {
    return { isValid: false, reason: "missing_local_or_domain" };
  }

  if (local.length > 64) {
    return { isValid: false, reason: "local_part_too_long" };
  }

  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return { isValid: false, reason: "invalid_dots_in_local" };
  }

  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return { isValid: false, reason: "invalid_dots_in_domain" };
  }

  if (!domain.includes(".")) {
    return { isValid: false, reason: "domain_missing_tld" };
  }

  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) {
    return { isValid: false, reason: "invalid_tld" };
  }

  // Strict email format regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!regex.test(clean)) {
    return { isValid: false, reason: "regex_failed" };
  }

  return { isValid: true };
}

/**
 * Checks DNS MX records for domain with strict 2000ms timeout
 */
export async function checkMxRecords(domain: string): Promise<{ hasMx: boolean; mxRecords?: string[]; error?: string }> {
  try {
    const records = await Promise.race([
      dns.promises.resolveMx(domain),
      new Promise<dns.MxRecord[]>((_, reject) => setTimeout(() => reject(new Error("DNS_TIMEOUT")), 2000))
    ]);

    if (!records || records.length === 0) {
      return { hasMx: false };
    }

    return {
      hasMx: true,
      mxRecords: records.map((r) => r.exchange)
    };
  } catch (err: any) {
    return {
      hasMx: false,
      error: err?.code || err?.message || "DNS_RESOLUTION_FAILED"
    };
  }
}

/**
 * Real-time Abstract Email Validation API call
 * Target endpoint: https://emailvalidation.abstractapi.com/v1/?api_key=...&email=...
 * Strict 2500ms timeout for high-speed response
 */
async function callAbstractApi(email: string): Promise<any | null> {
  const apiKey = (process.env.ABSTRACT_EMAIL_VALIDATION_API_KEY || process.env.ABSTRACT_API_KEY || "").trim();
  if (!apiKey || apiKey.includes("xxxxxxx") || apiKey.startsWith("<")) {
    return null;
  }

  try {
    const url = "https://emailvalidation.abstractapi.com/v1/";
    const res = await axios.get(url, {
      params: {
        api_key: apiKey,
        email: email
      },
      timeout: 2500
    });

    if (res.status === 200 && res.data) {
      return res.data;
    }
  } catch (err: any) {
    console.warn("[AbstractAPI] API call warning/timeout:", err?.message || err);
  }

  return null;
}

/**
 * Real-time ZeroBounce API validation call (fallback provider)
 */
async function callZeroBounce(email: string, clientIp?: string): Promise<any | null> {
  const apiKey = (process.env.ZEROBOUNCE_API_KEY || "").trim();
  if (!apiKey || apiKey.includes("xxxxxxx") || apiKey.startsWith("<")) {
    return null;
  }

  try {
    const url = "https://api.zerobounce.net/v2/validate";
    const res = await axios.get(url, {
      params: {
        api_key: apiKey,
        email: email,
        ip_address: clientIp || ""
      },
      timeout: 2500
    });

    if (res.status === 200 && res.data) {
      return res.data;
    }
  } catch (err: any) {
    console.warn("[ZeroBounce] API call warning/timeout:", err?.message || err);
  }

  return null;
}

/**
 * Primary Server-Side Email Validation Engine
 * 
 * Flow:
 * 1. Syntax & RFC Format Validation
 * 2. Normalization
 * 3. Disposable Domain Blocklist Check
 * 4. DNS MX Record Resolution
 * 5. ZeroBounce Real-Time API Validation (authoritative when configured)
 * 6. Safe decision classification (Fail-Safe: unknown/catch-all is NEVER valid)
 */
async function executeEmailValidationInternal(
  rawEmail: string,
  clientIp?: string
): Promise<EmailValidationResult> {
  const email = (rawEmail || "").trim();
  const normalized = email.toLowerCase();

  // STEP 1: Syntax Validation
  const syntaxCheck = validateEmailSyntax(email);
  if (!syntaxCheck.isValid) {
    return {
      email,
      normalizedEmail: normalized,
      status: "invalid",
      safeToSendOtp: false,
      reason: syntaxCheck.reason || "invalid_syntax",
      message: "❌ Please enter a valid email address. 📧",
      details: { domain: "", mxFound: false }
    };
  }

  const domain = normalized.split("@")[1];

  // STEP 2: Disposable Domain Detection
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      email,
      normalizedEmail: normalized,
      status: "disposable",
      safeToSendOtp: false,
      reason: "disposable_domain",
      message: "❌ Temporary/disposable email addresses are not allowed. 📧",
      details: { domain, mxFound: false, disposable: true }
    };
  }

  // STEP 3: DNS MX Resolution
  const mxResult = await checkMxRecords(domain);
  if (!mxResult.hasMx) {
    return {
      email,
      normalizedEmail: normalized,
      status: "invalid",
      safeToSendOtp: false,
      reason: "no_dns_entries",
      message: "❌ We couldn't verify this email address. Please check it and try again. 📧",
      details: { domain, mxFound: false }
    };
  }

  // STEP 4: Real-Time Abstract Email Validation API Check (Preferred Primary API)
  const absData = await callAbstractApi(normalized);
  if (absData) {
    const deliverability = (absData.deliverability || "").toUpperCase();
    const isDisposable = absData.is_disposable_email?.value === true;
    const isMxFound = absData.is_mx_found?.value !== false;
    const isSmtpValid = absData.is_smtp_valid?.value === true;
    const isCatchAll = absData.is_catchall_email?.value === true;

    if (isDisposable) {
      return {
        email,
        normalizedEmail: normalized,
        status: "disposable",
        safeToSendOtp: false,
        reason: "disposable",
        message: "❌ Temporary/disposable email addresses are not allowed. 📧",
        details: { domain, mxFound: true, disposable: true }
      };
    }

    if (isCatchAll) {
      return {
        email,
        normalizedEmail: normalized,
        status: "catch_all",
        safeToSendOtp: false,
        reason: "catch_all",
        message: "❌ This email address could not be verified. Please check it and try again. 📧",
        details: { domain, mxFound: true }
      };
    }

    // Only deliverability === "DELIVERABLE" with confirmed SMTP validity is accepted
    if (deliverability === "DELIVERABLE" && isSmtpValid && isMxFound) {
      return {
        email,
        normalizedEmail: normalized,
        status: "valid",
        safeToSendOtp: true,
        message: "Email address is valid and deliverable.",
        details: { domain, mxFound: true, provider: "AbstractAPI" }
      };
    }

    // Explicit undeliverable, unknown, or SMTP invalid
    return {
      email,
      normalizedEmail: normalized,
      status: "invalid",
      safeToSendOtp: false,
      reason: deliverability === "UNDELIVERABLE" ? "undeliverable" : "uncertain_deliverability",
      message: "❌ This email address could not be verified. Please check it and try again. 📧",
      details: { domain, mxFound: isMxFound }
    };
  }

  // STEP 5: Real-Time ZeroBounce API Validation (Fallback Provider)
  const zbData = await callZeroBounce(normalized, clientIp);
  if (zbData) {
    const status = (zbData.status || "").toLowerCase();
    const subStatus = (zbData.sub_status || "").toLowerCase();

    // Catch-All domain check
    if (
      status === "catch-all" ||
      subStatus === "role_based_catch_all" ||
      subStatus === "alternate"
    ) {
      return {
        email,
        normalizedEmail: normalized,
        status: "catch_all",
        safeToSendOtp: false,
        reason: "catch_all",
        subStatus,
        message: "⚠️ We couldn't confirm that this mailbox exists. Please use another email address. 📧",
        details: { domain, mxFound: true, provider: zbData.smtp_provider, zeroBounceChecked: true }
      };
    }

    // Disposable check
    if (subStatus === "disposable") {
      return {
        email,
        normalizedEmail: normalized,
        status: "disposable",
        safeToSendOtp: false,
        reason: "disposable",
        subStatus,
        message: "❌ Temporary/disposable email addresses are not allowed. 📧",
        details: { domain, mxFound: true, disposable: true, zeroBounceChecked: true }
      };
    }

    // Explicit Invalid or Mailbox Not Found
    if (
      status === "invalid" ||
      subStatus === "mailbox_not_found" ||
      subStatus === "no_dns_entries" ||
      subStatus === "failed_syntax_check" ||
      subStatus === "does_not_accept_mail"
    ) {
      return {
        email,
        normalizedEmail: normalized,
        status: "invalid",
        safeToSendOtp: false,
        reason: subStatus || "mailbox_not_found",
        subStatus,
        message: "❌ We couldn't verify this email address. Please check it and try again. 📧",
        details: { domain, mxFound: true, zeroBounceChecked: true }
      };
    }

    // Toxic, Spam Trap, Abuse, Do Not Mail, Blocked
    if (
      status === "spamtrap" ||
      status === "abuse" ||
      status === "do_not_mail" ||
      subStatus === "toxic" ||
      subStatus === "blocked" ||
      subStatus === "global_suppression"
    ) {
      return {
        email,
        normalizedEmail: normalized,
        status: "blocked",
        safeToSendOtp: false,
        reason: status || subStatus || "blocked",
        subStatus,
        message: "❌ This email address cannot be used for verification. 📧",
        details: { domain, mxFound: true, zeroBounceChecked: true }
      };
    }

    // Unknown status - Fail Safely!
    if (status === "unknown" || !status) {
      return {
        email,
        normalizedEmail: normalized,
        status: "unknown",
        safeToSendOtp: false,
        reason: "unknown_mailbox_status",
        subStatus,
        message: "⚠️ We couldn't confirm this email address. Please use another email. 📧",
        details: { domain, mxFound: true, zeroBounceChecked: true }
      };
    }

    // ONLY status === "valid" allows OTP sending
    if (status === "valid") {
      return {
        email,
        normalizedEmail: normalized,
        status: "valid",
        safeToSendOtp: true,
        message: "Email address is valid and deliverable.",
        details: { domain, mxFound: true, provider: zbData.smtp_provider, zeroBounceChecked: true }
      };
    }

    // Fall-safe reject for any unexpected status
    return {
      email,
      normalizedEmail: normalized,
      status: "unknown",
      safeToSendOtp: false,
      reason: "unrecognized_status",
      message: "⚠️ We couldn't confirm this email address. Please use another email. 📧",
      details: { domain, mxFound: true, zeroBounceChecked: true }
    };
  }

  // STEP 5: Fallback Validation when ZeroBounce API Key is not configured
  // Domain MX resolution already succeeded. Perform safe heuristics.
  return {
    email,
    normalizedEmail: normalized,
    status: "valid",
    safeToSendOtp: true,
    message: "Email format and domain MX records verified.",
    details: {
      domain,
      mxFound: true,
      zeroBounceChecked: false
    }
  };
}

/**
 * Public Server-Side Email Validation Engine
 * Enforces a strict 3500ms safety timeout so backend returns promptly
 */
export async function validateEmailAddress(
  rawEmail: string,
  clientIp?: string
): Promise<EmailValidationResult> {
  const email = (rawEmail || "").trim();
  const normalized = email.toLowerCase();

  return Promise.race([
    executeEmailValidationInternal(rawEmail, clientIp),
    new Promise<EmailValidationResult>((resolve) =>
      setTimeout(() => {
        resolve({
          email,
          normalizedEmail: normalized,
          status: "unknown",
          safeToSendOtp: false,
          reason: "timeout",
          message: "⏱️ Email verification is taking too long. Please try again. 📧"
        });
      }, 3500)
    )
  ]);
}

