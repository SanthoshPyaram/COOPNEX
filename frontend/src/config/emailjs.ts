/**
 * COOPNEX Universal EmailJS Configuration
 * Used for real Email OTP delivery across Customer and Worker registration and Password Reset
 * 
 * Template 1 (Universal Verification OTP):
 * import.meta.env.VITE_EMAILJS_VERIFICATION_TEMPLATE_ID
 * 
 * Template 2 (Password Reset OTP):
 * import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID
 * 
 * Dynamic Template Variables:
 * {{name}}, {{email}}, {{otp}}, {{expiry}}
 */

export const emailJsConfig = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_9t0h2rw").trim(),
  verificationTemplateId: (import.meta.env.VITE_EMAILJS_VERIFICATION_TEMPLATE_ID || "template_fp4f1mm").trim(),
  resetTemplateId: (import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID || "template_be8rx9d").trim(),
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "tl2Adrvyaq949VsOc").trim()
};

/**
 * Check if an environment variable is configured (non-empty string)
 */
export const isValidEmailJsValue = (val: string | undefined): boolean => {
  return typeof val === "string" && val.trim().length > 0;
};

export interface EmailJsStatus {
  isConfigured: boolean;
  isVerificationConfigured: boolean;
  isResetConfigured: boolean;
  missingVariables: string[];
  errorMessage: string | null;
}

/**
 * Safe development-only configuration diagnostic.
 * Reports ONLY whether each variable is "configured" or "missing".
 * NEVER prints the actual values or exposes credentials.
 */
export const getEmailJsDiagnostic = () => {
  return {
    "Service ID": emailJsConfig.serviceId ? "configured" : "missing",
    "Verification Template": emailJsConfig.verificationTemplateId ? "configured" : "missing",
    "Reset Template": emailJsConfig.resetTemplateId ? "configured" : "missing",
    "Public Key": emailJsConfig.publicKey ? "configured" : "missing"
  };
};

// Safe runtime diagnostic logger
if (typeof window !== "undefined") {
  const diagnostic = getEmailJsDiagnostic();
  console.info("[EmailJS Configuration Diagnostic]:", diagnostic);
}

/**
 * Centralized safe configuration check that inspects all required EmailJS variables
 * without exposing sensitive credentials.
 */
export const getEmailJsStatus = (): EmailJsStatus => {
  const missing: string[] = [];

  if (!isValidEmailJsValue(emailJsConfig.serviceId)) {
    missing.push("VITE_EMAILJS_SERVICE_ID");
  }
  if (!isValidEmailJsValue(emailJsConfig.verificationTemplateId)) {
    missing.push("VITE_EMAILJS_VERIFICATION_TEMPLATE_ID");
  }
  if (!isValidEmailJsValue(emailJsConfig.resetTemplateId)) {
    missing.push("VITE_EMAILJS_RESET_TEMPLATE_ID");
  }
  if (!isValidEmailJsValue(emailJsConfig.publicKey)) {
    missing.push("VITE_EMAILJS_PUBLIC_KEY");
  }

  const isVerificationConfigured =
    isValidEmailJsValue(emailJsConfig.serviceId) &&
    isValidEmailJsValue(emailJsConfig.verificationTemplateId) &&
    isValidEmailJsValue(emailJsConfig.publicKey);

  const isResetConfigured =
    isValidEmailJsValue(emailJsConfig.serviceId) &&
    isValidEmailJsValue(emailJsConfig.resetTemplateId) &&
    isValidEmailJsValue(emailJsConfig.publicKey);

  const isConfigured = isVerificationConfigured && isResetConfigured;

  let errorMessage: string | null = null;
  if (missing.length > 0) {
    errorMessage = `EmailJS is not configured. Please set ${missing.join(", ")} in frontend .env.`;
  }

  return {
    isConfigured,
    isVerificationConfigured,
    isResetConfigured,
    missingVariables: missing,
    errorMessage
  };
};

/**
 * Check if EmailJS verification template is configured
 */
export const isEmailJsConfigured = (): boolean => {
  return (
    isValidEmailJsValue(emailJsConfig.serviceId) &&
    isValidEmailJsValue(emailJsConfig.verificationTemplateId) &&
    isValidEmailJsValue(emailJsConfig.publicKey)
  );
};

/**
 * Check if EmailJS password reset template is configured
 */
export const isEmailJsResetConfigured = (): boolean => {
  return (
    isValidEmailJsValue(emailJsConfig.serviceId) &&
    isValidEmailJsValue(emailJsConfig.resetTemplateId) &&
    isValidEmailJsValue(emailJsConfig.publicKey)
  );
};

