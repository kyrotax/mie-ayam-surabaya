"use client";

import React from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Belum ada data untuk ditampilkan.",
  emptyAction,
  mobileRender,
  onRowClick,
}: {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  mobileRender?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title="Tidak Ada Data" description={emptyMessage} action={emptyAction} />;
  }

  return (
    <div className="w-full">
      {/* Desktop View (Tabel) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#D4AF37]/20 bg-white shadow-xs">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#FAF0DC] border-b border-[#D4AF37]/20 text-xs font-bold uppercase tracking-wider text-[#2C1810]">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3.5 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3B2416]/5 text-[#2C1810]">
            {data.map((row, rIdx) => (
              <tr
                key={row.id ?? rIdx}
                onClick={() => onRowClick?.(row)}
                className={`min-h-[52px] hover:bg-[#FAF7F2] transition ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={`px-4 py-3.5 ${col.className || ""}`}>
                    {col.render
                      ? col.render(row, rIdx)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "-")
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Daftar Kartu atau Card List) */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => (
          <div
            key={row.id ?? idx}
            onClick={() => onRowClick?.(row)}
            className={`p-4 rounded-xl bg-white border border-[#D4AF37]/20 shadow-xs ${
              onRowClick ? "cursor-pointer hover:border-[#8B0000]" : ""
            }`}
          >
            {mobileRender ? (
              mobileRender(row, idx)
            ) : (
              <div className="space-y-2">
                {columns.map((col, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#6B4423]">{col.header}:</span>
                    <div>
                      {col.render
                        ? col.render(row, idx)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "-")
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

