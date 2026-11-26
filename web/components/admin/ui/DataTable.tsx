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
      <div className="hidden overflow-x-auto rounded-[14px] border border-[#DED8D1] bg-white md:block">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#DED8D1] bg-[#F5F2EE] text-[11px] font-semibold text-[#51463E]">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3.5 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7E1] text-[#251C17]">
            {data.map((row, rIdx) => (
              <tr
                key={row.id ?? rIdx}
                onClick={() => onRowClick?.(row)}
                className={`min-h-[52px] transition-colors hover:bg-[#FAF8F5] ${
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
      <div className="space-y-3 md:hidden">
        {data.map((row, idx) => (
          <div
            key={row.id ?? idx}
            onClick={() => onRowClick?.(row)}
            className={`rounded-[14px] border border-[#DED8D1] bg-white p-4 ${
              onRowClick ? "cursor-pointer hover:border-[#8D0D00] active:bg-[#FAF8F5]" : ""
            }`}
          >
            {mobileRender ? (
              mobileRender(row, idx)
            ) : (
              <div className="space-y-2">
                {columns.map((col, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#71645B]">{col.header}</span>
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

