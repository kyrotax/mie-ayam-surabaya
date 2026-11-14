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
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#3B2416]/10">
      <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#CBA857]/20 flex items-center justify-center text-[#8A5A00] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-lg font-bold text-[#3B2416] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#6B5240] max-w-sm mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

