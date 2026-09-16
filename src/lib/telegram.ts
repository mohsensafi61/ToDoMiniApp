import { createHmac } from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Validate Telegram Mini App initData.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(
  initData: string
): { valid: boolean; userId?: number; firstName?: string; username?: string } {
  if (!BOT_TOKEN) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN");
  }

  const data = Object.fromEntries(new URLSearchParams(initData));

  const hash = data.hash;
  if (!hash) {
    return { valid: false };
  }

  // Remove hash from data before validation
  delete data.hash;

  // Sort and build data-check-string
  const dataCheckString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  // Compute HMAC-SHA256
  const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const computedHash = createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) {
    return { valid: false };
  }

  // Check auth_date freshness (5 minutes max)
  const authDate = Number(data.auth_date);
  if (Date.now() / 1000 - authDate > 300) {
    return { valid: false };
  }

  // Parse user from initData.user (JSON string)
  try {
    const user = JSON.parse(data.user || "{}");
    return {
      valid: true,
      userId: user.id,
      firstName: user.first_name,
      username: user.username,
    };
  } catch {
    return { valid: false };
  }
}
