"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encodeSession, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/admin/auth/session";
import { INITIAL_DUMMY_USERS } from "@/lib/admin/mock/users";

export type LoginResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

export async function loginAction(prevState: any, formData: FormData): Promise<LoginResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = formData.get("next") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  // Cari di dummy users
  const user = INITIAL_DUMMY_USERS.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!user) {
    return { success: false, error: "Email atau kata sandi salah." };
  }

  if (user.status === "inactive") {
    return { success: false, error: "Akun dinonaktifkan. Silakan hubungi Owner." };
  }

  // Buat session token
  const token = encodeSession({
    uid: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  // Validasi target redirect
  let targetUrl = "/admin";
  if (next && next.startsWith("/admin") && !next.startsWith("//")) {
    targetUrl = next;
  }

  return { success: true, redirectTo: targetUrl };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

