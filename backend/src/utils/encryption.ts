import crypto from "crypto";

const SECRET = process.env.ENCRYPTION_SECRET || process.env.JWT_SECRET || "hydra_secret_key_2026";
const KEY = crypto.createHash("sha256").update(SECRET).digest(); // 32-byte key

/**
 * Simple AES-256-CBC Encryption
 * Output format: "enc:ivHex:encryptedHex"
 */
export function encrypt(text: string): string {
  if (!text || typeof text !== "string") return "";
  if (text.startsWith("enc:")) return text; // already encrypted

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `enc:${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt an AES-256-CBC encrypted string.
 * Falls back to returning original text if string is unencrypted.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || typeof encryptedText !== "string") return "";
  if (!encryptedText.startsWith("enc:")) {
    return encryptedText; // Legacy unencrypted plain text
  }

  try {
    const parts = encryptedText.slice(4).split(":");
    if (parts.length !== 2) return encryptedText;

    const iv = Buffer.from(parts[0], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(parts[1], "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    return encryptedText;
  }
}
