import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/admin/auth/session";
import { PanelShell } from "@/components/admin/shell/PanelShell";
import type { SessionUser } from "@/lib/admin/types";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = decodeSession(sessionToken);

  const fallbackUser: SessionUser = user || {
    uid: "usr_admin",
    name: "Pengelola Toko",
    email: "admin@mieayam.test",
    role: "owner" as const,
    exp: Math.floor(Date.now() / 1000) + 86400,
  };

  return <PanelShell user={fallbackUser}>{children}</PanelShell>;
}
