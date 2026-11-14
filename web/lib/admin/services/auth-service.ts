import { User } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginService(email: string, password: string): Promise<User> {
  await delay();
  const state = getDummyState();
  const user = state.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error("Email atau kata sandi salah.");
  }

  if (user.status === "inactive") {
    throw new Error("Akun dinonaktifkan. Silakan hubungi Owner.");
  }

  // Update last login
  const updatedUsers = state.users.map((u) =>
    u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
  );
  saveDummyState({ ...state, users: updatedUsers });

  return { ...user, lastLogin: new Date().toISOString() };
}

export async function getCurrentUserService(userId: string): Promise<User | null> {
  await delay(150);
  const state = getDummyState();
  const found = state.users.find((u) => u.id === userId);
  return found || null;
}

