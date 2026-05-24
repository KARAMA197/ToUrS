import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "ak_admin_session";
export const ADMIN_LOGIN_PATH = "/admin/login";

const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type AdminSessionPayload = {
  exp: number;
  fp: string;
};

function getCookieValueFromHeader(cookieHeader: string, name: string) {
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const matched = parts.find((part) => part.startsWith(`${name}=`));

  if (!matched) {
    return "";
  }

  return matched.slice(name.length + 1);
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
}

function getPasswordFingerprint() {
  return createHash("sha256").update(getAdminPassword()).digest("hex").slice(0, 16);
}

function signTokenPayload(payload: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(payload).digest("base64url");
}

function safeCompare(value: string, expected: string) {
  const left = Buffer.from(value);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function parseTokenPayload(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signTokenPayload(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as AdminSessionPayload;

    return payload;
  } catch {
    return null;
  }
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword() && getAdminSessionSecret());
}

export function validateAdminPassword(password: string) {
  return Boolean(password) && password === getAdminPassword();
}

export function createAdminSessionToken() {
  const payload: AdminSessionPayload = {
    exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
    fp: getPasswordFingerprint(),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signTokenPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!isAdminAuthConfigured() || !token) {
    return false;
  }

  const payload = parseTokenPayload(token);

  if (!payload) {
    return false;
  }

  return payload.exp > Date.now() && payload.fp === getPasswordFingerprint();
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export function clearAdminCookieOptions() {
  return {
    ...getAdminCookieOptions(),
    maxAge: 0,
  };
}

export function getSafeAdminRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifyAdminSessionToken(token);
}

export async function requireAdminAuth(nextPath = "/admin") {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect(`${ADMIN_LOGIN_PATH}?next=${encodeURIComponent(nextPath)}`);
  }
}

export function isAdminRequestAuthenticated(request: Request) {
  const token = getCookieValueFromHeader(
    request.headers.get("cookie") ?? "",
    ADMIN_SESSION_COOKIE
  );

  return verifyAdminSessionToken(token);
}
