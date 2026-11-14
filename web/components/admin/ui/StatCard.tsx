import React from "react";

export function StatCard({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  className = "",
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: any;
  className?: string;
}) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-sm flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B5240]">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#CBA857]/30 flex items-center justify-center text-[#8D0D00] shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2416]">
          {value}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      {subtitle && <div className="text-xs text-[#6B5240]">{subtitle}</div>}
    </div>
  );
}
