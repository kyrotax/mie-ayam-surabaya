import React from "react";

export type BadgeVariant = "sukses" | "peringatan" | "bahaya" | "netral" | "emas";

export function Badge({
  children,
  variant = "netral",
  className = "",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  let styleClass = "bg-[#FAF0DC] text-[#6B4423] border-[#D4AF37]/30";
  if (variant === "sukses") {
    styleClass = "bg-[#E4F2E5] text-[#276B2B] border-[#C2E4C4]";
  } else if (variant === "peringatan") {
    styleClass = "bg-[#FBEBC8] text-[#8A5A00] border-[#E8D19F]";
  } else if (variant === "bahaya") {
    styleClass = "bg-[#FBE4E1] text-[#B42318] border-[#F4BEB7]";
  } else if (variant === "emas") {
    styleClass = "bg-[#FAF0DC] text-[#8B0000] border-[#D4AF37]/40";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass} ${className}`}
    >
      {children}
    </span>
  );
}

