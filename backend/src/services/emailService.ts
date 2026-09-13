import nodemailer, { Transporter } from "nodemailer";
import { sendBrevoOtpEmail } from "./brevoEmailService";
import { sendEmailJsOtp } from "./emailJsService";

let cachedSmtpTransporter: Transporter | null = null;

function getSmtpTransporter(): Transporter | null {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    if (!cachedSmtpTransporter) {
      cachedSmtpTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
    return cachedSmtpTransporter;
  }
  return null;
}

export interface SendEmailResult {
  success: boolean;
  provider?: "brevo" | "emailjs" | "smtp";
  messageId?: string;
  previewUrl?: string | false;
  message?: string;
  error?: string;
}

/**
 * Robust Multi-Provider Email Dispatch Hierarchy with Zero Unnecessary Latency:
 * Priority 1: Brevo Transactional Email API (if BREVO_API_KEY configured)
 * Priority 2: EmailJS Server-Side REST API (if EMAILJS_SERVICE_ID configured)
 * Priority 3: Nodemailer SMTP with connection pooling (if SMTP_HOST configured)
 */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  purpose: "LOGIN" | "FORGOT_PASSWORD" | "VERIFY_ACCOUNT" | "REGISTER" | string = "LOGIN",
  recipientName?: string
): Promise<SendEmailResult> {
  const cleanEmail = toEmail.trim().toLowerCase();

  // 1. Try Brevo First (Only when API key is configured)
  const brevoKey = (process.env.BREVO_API_KEY || process.env.SIB_API_KEY || "").trim();
  if (brevoKey && !brevoKey.includes("xxxxxxx") && !brevoKey.startsWith("<")) {
    try {
      const brevoRes = await sendBrevoOtpEmail(cleanEmail, otpCode, recipientName, purpose);
      if (brevoRes.success) {
        return {
          success: true,
          provider: "brevo",
          messageId: brevoRes.messageId,
          message: "Verification code sent via Brevo."
        };
      }
    } catch (brevoErr: any) {
      console.warn("[EMAIL DISPATCH] Brevo attempt failed, falling back:", brevoErr?.message);
    }
  }

  // 2. Try EmailJS Server REST API
  try {
    const emailJsRes = await sendEmailJsOtp(cleanEmail, otpCode, recipientName, purpose);
    if (emailJsRes.success) {
      return {
        success: true,
        provider: "emailjs",
        message: emailJsRes.message || "Verification code sent via EmailJS."
      };
    }
    if (emailJsRes.error === "TIMEOUT") {
      return {
        success: false,
        provider: "emailjs",
        error: "TIMEOUT",
        message: "The OTP service is taking too long to respond. Please try again."
      };
    }
  } catch (emailJsErr: any) {
    console.warn("[EMAIL DISPATCH] EmailJS attempt failed:", emailJsErr?.message);
  }

  // 3. Try Nodemailer SMTP with connection pooling
  const smtpTransporter = getSmtpTransporter();
  if (smtpTransporter) {
    try {
      const titleMap: Record<string, string> = {
        LOGIN: "One-Time Password (OTP) for COOPNEX Sign-In",
        FORGOT_PASSWORD: "Password Reset Verification Code - COOPNEX",
        VERIFY_ACCOUNT: "Account Verification OTP - COOPNEX",
        REGISTER: "Account Verification OTP - COOPNEX"
      };

      const subject = titleMap[purpose] || "COOPNEX Security Verification Code";

      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #0A66C2 0%, #059669 100%); padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">COOPNEX</h1>
            <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 13px;">People. Skills. Cooperatives. Connected.</p>
          </div>
          <div style="padding: 32px 28px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 600;">Security Verification Code</h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 12px 0 24px;">
              We received a request for <strong>${purpose.replace(/_/g, " ")}</strong> associated with your registered email address <strong>${cleanEmail}</strong>.
            </p>
            <div style="background: #f8fafc; border: 2px dashed #0A66C2; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 600; margin: 0 0 8px;">Your 6-Digit One-Time Code</p>
              <div style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #0A66C2; font-family: monospace;">${otpCode}</div>
              <p style="color: #ef4444; font-size: 13px; margin: 12px 0 0; font-weight: 500;">⏱️ Valid for 5 minutes only. Do not share this code.</p>
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
              If you did not initiate this request, you can safely disregard this email.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} COOPNEX Portal • Ministry of Cooperation, Government of India
            </p>
          </div>
        </div>
      `;

      const info = await smtpTransporter.sendMail({
        from: process.env.SMTP_FROM || '"COOPNEX Verification" <no-reply@coopnex.org>',
        to: cleanEmail,
        subject,
        text: `Your COOPNEX OTP code for ${purpose} is: ${otpCode}. Valid for 5 minutes. Do not share this code.`,
        html: htmlContent
      });

      return {
        success: true,
        provider: "smtp",
        messageId: info.messageId
      };
    } catch (smtpErr: any) {
      console.error("[EMAIL DISPATCH ERROR] SMTP channel failed:", smtpErr?.message);
    }
  }

  return {
    success: false,
    error: "OTP_PROVIDER_FAILURE",
    message: "We couldn't send the OTP right now. Please try again."
  };
}
