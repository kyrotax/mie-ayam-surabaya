import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#E7E1DA] motion-reduce:animate-none ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-[14px] border border-[#DED8D1] bg-white p-6">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

