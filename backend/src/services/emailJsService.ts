import axios from "axios";

export interface EmailJsResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send real 6-digit verification OTP using EmailJS REST API
 * Dynamic template variables passed:
 * {{name}}, {{email}}, {{otp}}, {{expiry}}, {{app_name}}
 */
export async function sendEmailJsOtp(
  toEmail: string,
  otpCode: string,
  recipientName?: string,
  purpose: string = "VERIFY_ACCOUNT"
): Promise<EmailJsResult> {
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || "";
  
  // Resolve Universal Verification Template ID
  const verificationTemplateId =
    process.env.EMAILJS_VERIFICATION_TEMPLATE_ID ||
    process.env.VITE_EMAILJS_VERIFICATION_TEMPLATE_ID ||
    "";

  // Resolve Universal Password Reset Template ID
  const resetTemplateId =
    process.env.EMAILJS_RESET_TEMPLATE_ID ||
    process.env.VITE_EMAILJS_RESET_TEMPLATE_ID ||
    "";

  // Select appropriate template based on purpose
  const isResetFlow =
    purpose === "RESET_PASSWORD" ||
    purpose === "FORGOT_PASSWORD" ||
    purpose === "PASSWORD_RESET";

  const templateId = isResetFlow ? resetTemplateId : verificationTemplateId;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || "";
  const privateKey = process.env.EMAILJS_PRIVATE_KEY || "";

  // If EmailJS credentials are not yet configured or still placeholder in .env
  const isPlaceholder = (val: string) => !val || val.includes("xxxxxxx") || val.startsWith("<") || val.includes("your_");
  if (isPlaceholder(serviceId) || isPlaceholder(templateId) || isPlaceholder(publicKey)) {
    console.warn(
      `[EMAILJS] Configuration pending in .env. Service: ${serviceId || "missing"}, Template (${isResetFlow ? "RESET" : "VERIFICATION"}): ${templateId || "missing"}, Public Key: ${publicKey ? "present" : "missing"}.`
    );
    return {
      success: false,
      message: `EmailJS ${isResetFlow ? "Password Reset" : "Verification"} template is not yet configured in .env. Please set EMAILJS_SERVICE_ID, ${isResetFlow ? "EMAILJS_RESET_TEMPLATE_ID" : "EMAILJS_VERIFICATION_TEMPLATE_ID"}, and EMAILJS_PUBLIC_KEY.`,
      error: "MISSING_EMAILJS_CONFIG"
    };
  }

  const cleanEmail = toEmail.trim().toLowerCase();
  const displayName = recipientName?.trim() || "COOPNEX Member";

  const payload: Record<string, any> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      name: displayName,
      email: cleanEmail,
      otp: otpCode,
      expiry: 5,
      expiry_text: "5 minutes",
      app_name: "COOPNEX",
      purpose: isResetFlow ? "Password Reset" : purpose.replace(/_/g, " ")
    }
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "COOPNEX-Server/1.0"
        },
        timeout: 10000
      }
    );

    if (response.status === 200 || response.data === "OK") {
      console.log(`[EMAILJS] OTP email dispatched successfully to ${cleanEmail} for purpose: ${purpose}`);
      return {
        success: true,
        message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`
      };
    }

    return {
      success: false,
      message: `EmailJS responded with status: ${response.status}`,
      error: String(response.data)
    };
  } catch (error: any) {
    const errMsg = error.response?.data || error.message || "Failed to dispatch email via EmailJS";
    console.error(`[EMAILJS ERROR] Failed to send email to ${cleanEmail}:`, errMsg);
    return {
      success: false,
      message: "Failed to dispatch verification code via EmailJS.",
      error: String(errMsg)
    };
  }
}

