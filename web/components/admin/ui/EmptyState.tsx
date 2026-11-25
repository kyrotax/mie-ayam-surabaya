import React from "react";
import { FolderOpen } from "lucide-react";

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
}: {
  icon?: any;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#D4AF37]/20">
      <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/20 flex items-center justify-center text-[#8A5A00] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading text-lg text-[#2C1810] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#6B4423] max-w-sm mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

