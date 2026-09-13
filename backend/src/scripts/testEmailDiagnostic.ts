import dotenv from "dotenv";
dotenv.config();
import { sendEmailJsOtp } from "../services/emailJsService";
import { sendOtpEmail } from "../services/emailService";

async function run() {
  console.log("=== EMAIL CONFIG DIAGNOSTIC ===");
  console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "CONFIGURED" : "NOT SET");
  console.log("SMTP_HOST:", process.env.SMTP_HOST || "NOT SET");
  console.log("SMTP_USER:", process.env.SMTP_USER || "NOT SET");
  console.log("EMAILJS_SERVICE_ID:", process.env.EMAILJS_SERVICE_ID || "NOT SET");
  console.log("EMAILJS_VERIFICATION_TEMPLATE_ID:", process.env.EMAILJS_VERIFICATION_TEMPLATE_ID || "NOT SET");
  console.log("EMAILJS_RESET_TEMPLATE_ID:", process.env.EMAILJS_RESET_TEMPLATE_ID || "NOT SET");
  console.log("EMAILJS_PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY ? "CONFIGURED" : "NOT SET");
  console.log("EMAILJS_PRIVATE_KEY:", process.env.EMAILJS_PRIVATE_KEY ? "CONFIGURED" : "NOT SET");

  console.log("\n--- Testing sendEmailJsOtp ---");
  try {
    const res1 = await sendEmailJsOtp("santhoshpyaram3021@gmail.com", "123456", "Santhosh", "REGISTER");
    console.log("sendEmailJsOtp result:", JSON.stringify(res1, null, 2));
  } catch (err: any) {
    console.error("sendEmailJsOtp thrown error:", err);
  }

  console.log("\n--- Testing sendOtpEmail (unified hierarchy) ---");
  try {
    const res2 = await sendOtpEmail("santhoshpyaram3021@gmail.com", "123456", "REGISTER", "Santhosh");
    console.log("sendOtpEmail result:", JSON.stringify(res2, null, 2));
  } catch (err: any) {
    console.error("sendOtpEmail thrown error:", err);
  }
}

run();

