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
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-[#DED8D1] bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#DED8D1] bg-[#F5F2EE] text-[#71645B]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="mb-1 text-base font-semibold tracking-[-0.02em] text-[#251C17]">{title}</h3>
      {description && <p className="text-sm text-[#6B4423] max-w-sm mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

