"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/admin/types";
import { getOrdersService } from "@/lib/admin/services/order-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DataTable, Column } from "@/components/admin/ui/DataTable";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  Camera,
  Download,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminPesananPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<"today" | "7d" | "30d" | "all">("30d");
  const [sourceFilter, setSourceFilter] = useState<"all" | "foto" | "manual">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrdersService();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filter logika
  const now = new Date("2026-11-14T23:59:59.999Z").getTime();
  const filteredOrders = orders.filter((order) => {
    const orderTime = new Date(order.createdAt).getTime();

    if (dateRangeFilter === "today") {
      if (!order.createdAt.startsWith("2026-11-14")) return false;
    } else if (dateRangeFilter === "7d") {
      if (now - orderTime > 7 * 24 * 60 * 60 * 1000) return false;
    } else if (dateRangeFilter === "30d") {
      if (now - orderTime > 30 * 24 * 60 * 60 * 1000) return false;
    }

    if (sourceFilter !== "all" && order.source !== sourceFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchMenu = order.items.some((i) => i.name.toLowerCase().includes(q));
      if (!matchNum && !matchMenu) return false;
    }

    return true;
  });

  // Paginasi
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Ekspor CSV Sisi Klien
  const handleExportCSV = () => {
    const headers = ["Nomor Pesanan", "Tanggal", "Sumber", "Jumlah Item", "Total (Rp)", "Dibuat Oleh"];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString("id-ID"),
      o.source,
      o.items.length,
      o.total,
      `"${o.createdBy}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pesanan-mie-ayam-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<Order>[] = [
    {
      header: "Nomor Pesanan",
      accessorKey: "orderNumber",
      className: "font-mono font-bold text-xs text-[#3B2416]",
    },
    {
      header: "Waktu",
      render: (o) => (
        <span className="text-xs text-[#6B5240]">
          {new Date(o.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      header: "Sumber",
      render: (o) => (
        <span className="text-xs font-medium">
          {o.source === "foto" ? "📸 Foto Catatan" : "✍️ Manual"}
        </span>
      ),
    },
    {
      header: "Item Terjual",
      render: (o) => (
        <span className="text-xs text-[#6B5240]">
          {o.items.reduce((sum, i) => sum + i.qty, 0)} porsi ({o.items.length} jenis)
        </span>
      ),
    },
    {
      header: "Total",
      render: (o) => (
        <span className="text-xs font-bold text-[#8D0D00]">
          Rp {o.total.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Status",
      render: (o) => (
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#E4F2E5] text-[#276B2B]">
          Terkonfirmasi
        </span>
      ),
    },
    {
      header: "Kasir",
      accessorKey: "createdBy",
      className: "text-xs text-[#6B5240]",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Pesanan"
        description="Daftar seluruh transaksi yang berhasil dicatat melalui verifikasi foto AI maupun input manual kasir."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#3B2416]/20 bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#3B2416] transition"
            >
              <Download className="w-4 h-4 text-[#8D0D00]" />
              <span>Ekspor CSV</span>
            </button>
            <Link
              href="/admin/pesanan/baru"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold shadow-xs transition"
            >
              <Camera className="w-4 h-4" />
              <span>Input Baru</span>
            </Link>
          </div>
        }
      />

      {/* Filter Kontrol */}
      <div className="p-4 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5240]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari No. #ORD atau nama menu..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#3B2416]/20 text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8D0D00]"
          />
        </div>

        {/* Date Filter & Source Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="inline-flex items-center rounded-xl border border-[#3B2416]/15 bg-[#FAF8F5] p-1 gap-1 text-xs">
            {[
              { id: "today", label: "Hari Ini" },
              { id: "7d", label: "7 Hari" },
              { id: "30d", label: "30 Hari" },
              { id: "all", label: "Semua" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setDateRangeFilter(d.id as any);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  dateRangeFilter === d.id
                    ? "bg-[#8D0D00] text-white"
                    : "text-[#6B5240] hover:text-[#3B2416]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center rounded-xl border border-[#3B2416]/15 bg-[#FAF8F5] p-1 gap-1 text-xs">
            {[
              { id: "all", label: "Semua Sumber" },
              { id: "foto", label: "📸 Foto" },
              { id: "manual", label: "✍️ Manual" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSourceFilter(s.id as any);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  sourceFilter === s.id
                    ? "bg-[#3B2416] text-white"
                    : "text-[#6B5240] hover:text-[#3B2416]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabel & Mobile List */}
      <DataTable
        data={paginatedOrders}
        columns={columns}
        onRowClick={(order) => router.push(`/admin/pesanan/${order.id}`)}
        emptyMessage="Belum ada pesanan pada rentang filter ini."
        emptyAction={
          <Link
            href="/admin/pesanan/baru"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8D0D00] text-white text-xs font-semibold"
          >
            <Camera className="w-4 h-4" />
            <span>Input Pesanan Baru</span>
          </Link>
        }
        mobileRender={(order) => (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-xs text-[#3B2416]">{order.orderNumber}</span>
              <span className="text-xs font-bold text-[#8D0D00]">
                Rp {order.total.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#6B5240]">
              <span>{order.source === "foto" ? "📸 Foto" : "✍️ Manual"}</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="text-[11px] text-[#6B5240]">
              {order.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
            </div>
          </div>
        )}
      />

      {/* Paginasi Kontrol */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#3B2416]/10 shadow-xs text-xs">
          <span className="text-[#6B5240]">
            Halaman {currentPage} dari {totalPages} ({filteredOrders.length} total pesanan)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[#3B2416]/15 disabled:opacity-30 hover:bg-[#FAF8F5]"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[#3B2416]/15 disabled:opacity-30 hover:bg-[#FAF8F5]"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

