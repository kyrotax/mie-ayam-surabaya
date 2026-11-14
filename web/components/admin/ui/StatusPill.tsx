import React from "react";
import { JobStatus } from "@/lib/admin/types";
import { Loader2, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";

export function StatusPill({ status }: { status: JobStatus }) {
  if (status === "diproses") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F6E4C4] text-[#6B5240] border border-[#E5D2AF]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Diproses</span>
      </span>
    );
  }
  if (status === "perlu_review") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FBEBC8] text-[#8A5A00] border border-[#E8D19F]">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Perlu Review</span>
      </span>
    );
  }
  if (status === "terkonfirmasi") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E4F2E5] text-[#276B2B] border border-[#C2E4C4]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Terkonfirmasi</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FBE4E1] text-[#B42318] border border-[#F4BEB7]">
      <AlertCircle className="w-3.5 h-3.5" />
      <span>Gagal</span>
    </span>
  );
}

