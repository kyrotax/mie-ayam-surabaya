import { User } from "../types";

export const INITIAL_DUMMY_USERS: User[] = [
  {
    id: "usr_owner_1",
    name: "H. Bambang (Owner)",
    email: "owner@mieayam.test",
    role: "owner",
    status: "active",
    password: "Owner123!",
    lastLogin: "2026-11-14T08:30:00.000Z",
  },
  {
    id: "usr_admin_1",
    name: "Siti Rahma (Admin Kasir)",
    email: "admin@mieayam.test",
    role: "admin",
    status: "active",
    password: "Admin123!",
    lastLogin: "2026-11-14T10:15:00.000Z",
  },
  {
    id: "usr_admin_2",
    name: "Budi Santoso (Nonaktif)",
    email: "admin2@mieayam.test",
    role: "admin",
    status: "inactive",
    password: "Admin123!",
    lastLogin: "2026-10-25T14:00:00.000Z",
  },
];

