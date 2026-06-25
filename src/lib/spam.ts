import sql from "@/lib/db";

const RATE_LIMIT = Number(process.env.COMMENT_RATE_LIMIT) || 3;
const RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW) || 60;

export function checkHoneypot(body: Record<string, unknown>): boolean {
  return Boolean(body.website);
}

export async function logSpam(
  ipAddress: string,
  triggerType: "honeypot" | "rate_limit" | "captcha_fail",
  requestData?: string
): Promise<void> {
  try {
    await sql`INSERT INTO spam_logs (ip_address, trigger_type, request_data) VALUES (${ipAddress}, ${triggerType}, ${requestData || null})`;
  } catch {
    // 로그 실패는 무시
  }
}

export async function checkRateLimit(
  ipAddress: string,
  endpoint: string
): Promise<{ limited: boolean; requireCaptcha: boolean }> {
  try {
    const rows = await sql`SELECT hit_count, window_start FROM rate_limits WHERE ip_address = ${ipAddress} AND endpoint = ${endpoint}`;
    const row = rows[0];
    const now = new Date();

    if (row) {
      const windowStart = new Date(row.window_start);
      const diffSeconds = (now.getTime() - windowStart.getTime()) / 1000;

      if (diffSeconds > RATE_WINDOW) {
        await sql`UPDATE rate_limits SET hit_count = 1, window_start = NOW() WHERE ip_address = ${ipAddress} AND endpoint = ${endpoint}`;
        return { limited: false, requireCaptcha: false };
      }

      if (row.hit_count >= RATE_LIMIT) {
        await logSpam(ipAddress, "rate_limit");
        return { limited: true, requireCaptcha: true };
      }

      await sql`UPDATE rate_limits SET hit_count = hit_count + 1 WHERE ip_address = ${ipAddress} AND endpoint = ${endpoint}`;
    } else {
      await sql`INSERT INTO rate_limits (ip_address, endpoint, hit_count, window_start) VALUES (${ipAddress}, ${endpoint}, 1, NOW())`;
    }

    return { limited: false, requireCaptcha: false };
  } catch {
    return { limited: false, requireCaptcha: false };
  }
}

export async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  if (!secretKey) return false;

  if (secretKey === "0x0000000000000000000000000000000000000000") return true;

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}
