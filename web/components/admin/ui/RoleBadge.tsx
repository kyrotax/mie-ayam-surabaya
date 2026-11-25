import { Crown, UserRound } from "lucide-react";
import type { Role } from "@/lib/admin/types";

export function RoleBadge({ role }: { role: Role }) {
  if (role === "owner") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#A8783A]/30 bg-[#CBA857] px-2.5 py-0.5 text-xs font-semibold text-[#3B2416]">
        <Crown className="h-3 w-3" aria-hidden="true" /> Owner
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#CBA857]/20 bg-[#F6E4C4] px-2.5 py-0.5 text-xs font-semibold text-[#3B2416]">
      <UserRound className="h-3 w-3" aria-hidden="true" /> Admin
    </span>
  );
}
