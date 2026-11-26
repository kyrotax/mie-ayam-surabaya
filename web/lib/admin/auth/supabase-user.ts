import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Role, SessionUser } from "../types";

export function resolveUserRole(user: SupabaseUser): Role | null {
  const metadataRole = String(
    user.user_metadata?.role || user.app_metadata?.role || ""
  ).toLowerCase();

  if (metadataRole === "owner" || metadataRole === "admin") {
    return metadataRole;
  }

  const email = (user.email || "").toLowerCase();
  if (email.includes("owner")) return "owner";
  if (email.includes("admin")) return "admin";
  return null;
}

export function toSessionUser(user: SupabaseUser, role: Role): SessionUser {
  const email = user.email || "";
  const metadataName = String(
    user.user_metadata?.name || user.user_metadata?.full_name || ""
  ).trim();

  return {
    uid: user.id,
    name: metadataName || email.split("@")[0] || "Pengelola Toko",
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
}
