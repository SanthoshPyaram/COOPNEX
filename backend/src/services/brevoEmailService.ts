import axios from "axios";

export interface BrevoSendResult {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

export async function sendBrevoOtpEmail(
  toEmail: string,
  otpCode: string,
  recipientName?: string,
  purpose: string = "VERIFY_ACCOUNT"
): Promise<BrevoSendResult> {
  const apiKey = (process.env.BREVO_API_KEY || process.env.SIB_API_KEY || "").trim();

  const isPlaceholder = (val: string) =>
    !val || val.includes("xxxxxxx") || val.startsWith("<") || val.includes("your_");

  if (isPlaceholder(apiKey)) {
    return {
      success: false,
      error: "MISSING_BREVO_CONFIG",
      message: "Brevo API key is not configured in environment variables."
    };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@coopnex.org";
  const senderName = process.env.BREVO_SENDER_NAME || "COOPNEX Security";
  const cleanEmail = toEmail.trim().toLowerCase();
  const displayName = recipientName?.trim() || "COOPNEX Member";

  const isResetFlow =
    purpose === "RESET_PASSWORD" ||
    purpose === "FORGOT_PASSWORD" ||
    purpose === "PASSWORD_RESET";

  const subject = isResetFlow
    ? "COOPNEX Password Reset Verification Code"
    : "COOPNEX Account Verification Code";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0A66C2 0%, #10B981 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">COOPNEX</h1>
            <p style="color: #dbeafe; margin: 6px 0 0; font-size: 13px; font-weight: 500;">National Cooperative Labour Marketplace</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px;">
            <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">Hello <strong>${displayName}</strong>,</p>
            <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
              Please use the verification code below to complete your ${isResetFlow ? "password reset" : "account verification"} request for <strong>${cleanEmail}</strong>.
            </p>

            <!-- 6-Digit OTP Box -->
            <div style="background: #f8fafc; border: 2px dashed #0A66C2; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px;">
                Your 6-Digit One-Time Code
              </span>
              <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0A66C2; font-family: monospace;">
                ${otpCode}
              </div>
              <p style="margin: 12px 0 0; font-size: 12px; color: #ef4444; font-weight: 600;">
                ⏱️ Valid for 5 minutes only. Never share this code with anyone.
              </p>
            </div>

            <!-- Security Notice -->
            <div style="background: #eff6ff; border-left: 4px solid #0A66C2; padding: 12px 16px; border-radius: 4px; margin-top: 24px;">
              <p style="margin: 0; font-size: 12px; color: #1e40af; line-height: 1.5;">
                <strong>Security Reminder:</strong> COOPNEX officials will never ask for your verification code, password, or Aadhaar credentials over phone calls, SMS, or social media.
              </p>
            </div>

            <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
              If you did not request this verification code, you can safely disregard this message.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
            &copy; 2026 COOPNEX. Ministry of Cooperation • Government of India Initiative.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: cleanEmail,
            name: displayName
          }
        ],
        subject,
        htmlContent,
        tags: ["otp", purpose.toLowerCase()]
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        timeout: 10000
      }
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        messageId: res.data?.messageId || "brevo-sent",
        message: "OTP successfully sent via Brevo."
      };
    }

    return {
      success: false,
      error: "BREVO_UNEXPECTED_STATUS",
      message: `Brevo returned unexpected status ${res.status}`
    };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message || "Failed to send email via Brevo";
    console.error("[Brevo] Dispatch error:", errorMsg);
    return {
      success: false,
      error: "BREVO_DISPATCH_FAILED",
      message: errorMsg
    };
  }
}

