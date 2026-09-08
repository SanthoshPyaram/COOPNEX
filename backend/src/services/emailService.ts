import nodemailer from "nodemailer";

let testAccountPromise: Promise<any> | null = null;

async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback to free Ethereal Email test account for real message dispatch and instant preview link
  try {
    if (!testAccountPromise) {
      testAccountPromise = Promise.race([
        nodemailer.createTestAccount(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Ethereal test account timeout")), 2500)
        )
      ]);
    }
    const testAccount = await testAccountPromise;
    if (testAccount) {
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
  } catch (err) {
    console.warn("[EmailService] Ethereal fallback skipped:", (err as any).message);
  }

  // Final fallback dummy json transport
  return nodemailer.createTransport({
    jsonTransport: true
  });
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string | false;
  error?: string;
}

export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  purpose: "LOGIN" | "FORGOT_PASSWORD" | "VERIFY_ACCOUNT" | string = "LOGIN"
): Promise<SendEmailResult> {
  try {
    const transporter = await getTransporter();

    const titleMap: Record<string, string> = {
      LOGIN: "One-Time Password (OTP) for COOPNEX Sign-In",
      FORGOT_PASSWORD: "Password Reset Verification Code - COOPNEX",
      VERIFY_ACCOUNT: "Account Verification OTP - COOPNEX"
    };

    const subject = titleMap[purpose] || "COOPNEX Security Verification Code";

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #0A66C2 0%, #059669 100%); padding: 28px 24px; text-align: center;">
          <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border-radius: 50%; padding: 12px; margin-bottom: 12px;">
            <span style="font-size: 32px;">🤝</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">COOPNEX</h1>
          <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 13px;">People. Skills. Cooperatives. Connected.</p>
        </div>
        
        <div style="padding: 32px 28px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 600;">Security Verification Code</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 12px 0 24px;">
            We received a request for <strong>${purpose.replace(/_/g, " ")}</strong> associated with your registered email address <strong>${toEmail}</strong>.
          </p>

          <div style="background: #f8fafc; border: 2px dashed #0A66C2; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 1.5px; margin: 0 0 8px;">Your 6-Digit One-Time Code</p>
            <div style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #0A66C2; font-family: monospace;">${otpCode}</div>
            <p style="color: #ef4444; font-size: 13px; margin: 12px 0 0; font-weight: 500;">⏱️ Valid for 5 minutes only. Do not share this code with anyone.</p>
          </div>

          <div style="background-color: #eff6ff; border-left: 4px solid #0A66C2; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
            <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
              <strong>National Security Note:</strong> COOPNEX officials will never ask for your OTP, password, or Aadhaar details over a phone call or SMS.
            </p>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
            If you did not initiate this request, you can safely disregard this email. Your account remains protected.
          </p>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 4px;">
            © ${new Date().getFullYear()} Sahakari Seva Portal • Ministry of Cooperation, Government of India
          </p>
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Sahakari Seva Auth" <no-reply@sahakariseva.gov.in>',
      to: toEmail,
      subject,
      text: `Your Sahakari Seva OTP code for ${purpose} is: ${otpCode}. Valid for 5 minutes. Do not share this code.`,
      html: htmlContent
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[EMAIL SERVICE] OTP email dispatched to ${toEmail}. Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[EMAIL SERVICE] Live Test Inbox Preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl
    };
  } catch (error: any) {
    console.error("[EMAIL SERVICE ERROR] Failed to send email:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
