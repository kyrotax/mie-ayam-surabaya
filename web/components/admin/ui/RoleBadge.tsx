import React from "react";
import { Role } from "@/lib/admin/types";

export function RoleBadge({ role }: { role: Role }) {
  if (role === "owner") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4AF37] text-[#2C1810] border border-[#9A6B00]/30">
        👑 Owner
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF0DC] text-[#2C1810] border border-[#D4AF37]/20">
      👤 Admin
    </span>
  );
}
