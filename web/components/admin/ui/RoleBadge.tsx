import React from "react";
import { Role } from "@/lib/admin/types";

export function RoleBadge({ role }: { role: Role }) {
  if (role === "owner") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CBA857] text-[#3B2416] border border-[#A8783A]/30">
        👑 Owner
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F6E4C4] text-[#3B2416] border border-[#CBA857]/20">
      👤 Admin
    </span>
  );
}
