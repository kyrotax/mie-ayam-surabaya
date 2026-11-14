import { SessionUser, Role } from "../types";

export const SESSION_COOKIE_NAME = "mm_session";
export const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 jam

export function encodeSession(user: { uid: string; name: string; email: string; role: Role }): string {
  const payload: SessionUser = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const jsonStr = JSON.stringify(payload);
  return Buffer.from(jsonStr, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeSession(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  try {
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonStr = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionUser;
    if (!payload.exp || Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

