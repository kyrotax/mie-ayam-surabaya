import { FlaskConical } from "lucide-react";

export function DemoBanner() {
  const isDummy = process.env.NEXT_PUBLIC_DUMMY_MODE !== "false";
  if (!isDummy) return null;

  return (
    <div className="hidden min-h-9 items-center gap-2 border-r border-[#E5DED6] px-3 text-xs font-medium text-[#674B23] lg:flex">
      <FlaskConical className="h-3.5 w-3.5 text-[#8D0D00]" strokeWidth={1.8} aria-hidden="true" />
      Data demo
    </div>
  );
}
