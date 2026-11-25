import React from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 pt-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#251C17] sm:text-[36px]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#71645B]">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

