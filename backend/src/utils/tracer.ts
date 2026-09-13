/**
 * Safe Server-Side Timing Instrumentation for OTP & Auth Requests
 * STRICT RULE: NEVER log OTP, passwords, tokens, private keys, or URIs.
 */

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***";
  const [user, domain] = email.split("@");
  if (user.length <= 2) return `${user[0] || "*"}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

export class OtpRequestTracer {
  private startTime: number;
  private marks: { label: string; elapsedMs: number }[] = [];
  private identifier: string;

  constructor(identifier: string) {
    this.startTime = Date.now();
    this.identifier = maskEmail(identifier);
    this.mark("request received");
  }

  mark(label: string) {
    const elapsed = Date.now() - this.startTime;
    this.marks.push({ label, elapsedMs: elapsed });
  }

  finish(outcome: string): number {
    const total = Date.now() - this.startTime;
    const details = this.marks.map((m) => `${m.label}: +${m.elapsedMs}ms`).join(", ");
    console.log(`[OTP TIMING] [${this.identifier}] Outcome: ${outcome} | Total: ${total}ms | ${details}`);
    return total;
  }
}

