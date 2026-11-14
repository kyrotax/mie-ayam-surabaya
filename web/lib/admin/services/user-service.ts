import { User, Role } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUserListService(): Promise<User[]> {
  await delay();
  return getDummyState().users;
}

export async function createUserService(
  userData: Omit<User, "id">,
  actorRole: Role
): Promise<User> {
  await delay();
  if (actorRole !== "owner") {
    throw new Error("Hanya peran Owner yang berhak menambah pengguna.");
  }

  const state = getDummyState();
  const emailExists = state.users.some(
    (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
  );
  if (emailExists) {
    throw new Error(`Email "${userData.email}" sudah digunakan oleh akun lain.`);
  }

  const newUser: User = {
    ...userData,
    id: `usr_${Date.now()}`,
    status: userData.status || "active",
  };

  saveDummyState({
    ...state,
    users: [...state.users, newUser],
  });

  return newUser;
}

export async function updateUserService(
  id: string,
  updates: Partial<User>,
  currentUserId: string,
  actorRole: Role
): Promise<User> {
  await delay();
  if (actorRole !== "owner") {
    throw new Error("Hanya peran Owner yang berhak mengedit pengguna.");
  }

  const state = getDummyState();
  const target = state.users.find((u) => u.id === id);
  if (!target) throw new Error("Pengguna tidak ditemukan.");

  // Cek apakah mencoba menonaktifkan diri sendiri
  if (id === currentUserId && updates.status === "inactive") {
    throw new Error("Anda tidak dapat menonaktifkan akun Anda sendiri.");
  }

  // Cek jika mencoba mengubah role / status Owner terakhir
  if (target.role === "owner" && (updates.role === "admin" || updates.status === "inactive")) {
    const ownerCount = state.users.filter((u) => u.role === "owner" && u.status === "active").length;
    if (ownerCount <= 1) {
      throw new Error("Tidak dapat mengubah status Owner terakhir sistem.");
    }
  }

  const updated: User = { ...target, ...updates };
  saveDummyState({
    ...state,
    users: state.users.map((u) => (u.id === id ? updated : u)),
  });

  return updated;
}

export async function deleteUserService(
  id: string,
  currentUserId: string,
  actorRole: Role
): Promise<boolean> {
  await delay();
  if (actorRole !== "owner") {
    throw new Error("Hanya peran Owner yang berhak menghapus pengguna.");
  }

  if (id === currentUserId) {
    throw new Error("Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk.");
  }

  const state = getDummyState();
  const target = state.users.find((u) => u.id === id);
  if (!target) throw new Error("Pengguna tidak ditemukan.");

  if (target.role === "owner") {
    const ownerCount = state.users.filter((u) => u.role === "owner").length;
    if (ownerCount <= 1) {
      throw new Error("Tidak dapat menghapus Owner terakhir sistem.");
    }
  }

  saveDummyState({
    ...state,
    users: state.users.filter((u) => u.id !== id),
  });

  return true;
}
