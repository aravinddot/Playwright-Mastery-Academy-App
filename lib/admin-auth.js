import { createHmac, timingSafeEqual } from "crypto";

export const adminCookieName = "pma_admin_session";
const sessionTtlSeconds = 60 * 60 * 12;

function sanitize(value) {
  return String(value || "").trim();
}

function getExpectedCredentials() {
  return {
    username: sanitize(process.env.ADMIN_USERNAME || "Aravind"),
    password: sanitize(process.env.ADMIN_PASSWORD || "Vidhuran@251021")
  };
}

function getSessionSecret() {
  return (
    sanitize(process.env.ADMIN_SESSION_SECRET) ||
    sanitize(process.env.NEXTAUTH_SECRET) ||
    "pma-admin-session-secret-change-this"
  );
}

function signPayload(payload) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function safeEqualHex(a, b) {
  const aBuffer = Buffer.from(String(a || ""), "utf8");
  const bBuffer = Buffer.from(String(b || ""), "utf8");

  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

function parseCookieHeader(cookieHeader) {
  const jar = {};
  String(cookieHeader || "")
    .split(";")
    .forEach((entry) => {
      const [rawName, ...rest] = entry.split("=");
      const name = sanitize(rawName);
      if (!name) return;
      jar[name] = rest.join("=").trim();
    });
  return jar;
}

export function validateAdminCredentials(username, password) {
  const expected = getExpectedCredentials();
  return sanitize(username) === expected.username && sanitize(password) === expected.password;
}

export function createAdminSessionToken() {
  const expected = getExpectedCredentials();
  const expiresAt = Date.now() + sessionTtlSeconds * 1000;
  const payload = `${expected.username}|${expiresAt}`;
  const signature = signPayload(payload);
  const token = Buffer.from(`${payload}|${signature}`, "utf8").toString("base64url");
  return token;
}

export function verifyAdminSessionToken(token) {
  if (!token) return false;

  let decoded = "";
  try {
    decoded = Buffer.from(String(token), "base64url").toString("utf8");
  } catch {
    return false;
  }

  const [username, expiresAtRaw, signature] = decoded.split("|");
  const expiresAt = Number(expiresAtRaw);

  if (!username || !signature || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const expected = getExpectedCredentials();
  if (username !== expected.username) return false;

  const payload = `${username}|${expiresAt}`;
  const expectedSignature = signPayload(payload);
  return safeEqualHex(signature, expectedSignature);
}

export function isAdminAuthenticated(request) {
  const cookieHeader = request?.headers?.get("cookie") || "";
  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[adminCookieName] || "";
  return verifyAdminSessionToken(token);
}

export function buildAdminCookie(token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminCookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionTtlSeconds}${secure}`;
}

export function buildAdminLogoutCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
