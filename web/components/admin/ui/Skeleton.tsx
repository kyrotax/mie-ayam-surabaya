import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#F6E4C4]/60 animate-pulse rounded-lg motion-reduce:animate-none ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
