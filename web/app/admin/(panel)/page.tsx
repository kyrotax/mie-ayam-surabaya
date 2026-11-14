"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  StoreStatus,
  Order,
  ExtractionJob,
  StatusLogEntry,
  Role,
} from "@/lib/admin/types";
import { getStoreStatusService, updateStoreStatusService } from "@/lib/admin/services/status-service";
import { getOrdersService, getExtractionJobsService } from "@/lib/admin/services/order-service";
import { getChatLogsService } from "@/lib/admin/services/chatbot-service";
import { getStatusLogsService } from "@/lib/admin/services/status-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { RoleBadge } from "@/components/admin/ui/RoleBadge";
import { StatusPill } from "@/components/admin/ui/StatusPill";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  Camera,
  Store,
  ShoppingBag,
  AlertTriangle,
  MessageSquareOff,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AdminDashboardPage() {
  const { sukses } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [jobs, setJobs] = useState<ExtractionJob[]>([]);
  const [statusLogs, setStatusLogs] = useState<StatusLogEntry[]>([]);
  const [closedChatsCount, setClosedChatsCount] = useState(0);

  // Dialog konfirmasi ubah status cepat
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statusData, ordersData, jobsData, logsData, chatsData] = await Promise.all([
          getStoreStatusService(),
          getOrdersService(),
          getExtractionJobsService(),
          getStatusLogsService(),
          getChatLogsService(),
        ]);

        setStoreStatus(statusData);
        setOrders(ordersData);
        setJobs(jobsData);
        setStatusLogs(logsData);

        // Pesan masuk saat tutup 7 hari terakhir
        const now = new Date("2026-11-14T23:59:59.999Z").getTime();
        const cutoff7d = now - 7 * 24 * 60 * 60 * 1000;
        const count = chatsData.filter(
          (c) => c.storeStatusAtTime === "tutup" && new Date(c.timestamp).getTime() >= cutoff7d
        ).length;
        setClosedChatsCount(count);
      } catch (err) {
        console.error("Failed loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleStatusQuick = (targetOpen: boolean) => {
    setPendingStatus(targetOpen);
    setIsConfirmOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (pendingStatus === null || !storeStatus) return;
    try {
      const updated = await updateStoreStatusService(
        {
          isOpen: pendingStatus,
          statusNote: pendingStatus
            ? "Warung sedang buka melayani pelanggan."
            : "Warung sedang tutup sementara.",
        },
        "Admin",
        pendingStatus ? "Buka Toko Cepat" : "Tutup Toko Cepat"
      );
      setStoreStatus(updated);
      sukses(`Status toko berhasil diubah menjadi: ${pendingStatus ? "BUKA" : "TUTUP"}`);
    } catch {
      // handle error
    } finally {
      setIsConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  // Hitung metrik
  const todayStr = "2026-11-14";
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const yesterdayStr = "2026-11-13";
  const yesterdayOrders = orders.filter((o) => o.createdAt.startsWith(yesterdayStr));
  const diffOrders = todayOrders.length - yesterdayOrders.length;

  const pendingReviewJobs = jobs.filter((j) => j.status === "perlu_review");

  // Grafik 7 hari terakhir
  const last7DaysData = Array.from({ length: 7 })
    .map((_, i) => {
      const d = new Date("2026-11-14T12:00:00Z");
      d.setDate(d.getDate() - (6 - i));
      const isoPrefix = d.toISOString().split("T")[0];
      const count = orders.filter((o) => o.createdAt.startsWith(isoPrefix)).length;
      return {
        day: d.toLocaleDateString("id-ID", { weekday: "short" }),
        date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        pesanan: count,
      };
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Ringkasan Dasbor"
        description="Pantau performa penjualan, status operasional, dan antrean review catatan AI."
        action={
          <Link
            href="/admin/pesanan/baru"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white font-semibold text-sm transition shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Input Pesanan Baru</span>
          </Link>
        }
      />

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Toko */}
        <StatCard
          title="Status Toko"
          value={
            <span className={storeStatus?.isOpen ? "text-[#276B2B]" : "text-[#B42318]"}>
              {storeStatus?.isOpen ? "Buka" : "Tutup"}
            </span>
          }
          icon={Store}
          subtitle={
            <button
              type="button"
              onClick={() => handleToggleStatusQuick(!storeStatus?.isOpen)}
              className="mt-2 text-xs font-semibold text-[#8D0D00] hover:underline"
            >
              Ubah ke {storeStatus?.isOpen ? "Tutup" : "Buka"} &rarr;
            </button>
          }
        />

        {/* Pesanan Hari Ini */}
        <StatCard
          title="Pesanan Hari Ini"
          value={todayOrders.length}
          icon={ShoppingBag}
          badge={
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                diffOrders >= 0 ? "text-[#276B2B]" : "text-[#B42318]"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{diffOrders >= 0 ? `+${diffOrders}` : diffOrders} dr kemarin</span>
            </span>
          }
          subtitle="Estimasi pesanan tercatat"
        />

        {/* Perlu Review */}
        <StatCard
          title="Perlu Review AI"
          value={pendingReviewJobs.length}
          icon={AlertTriangle}
          subtitle={
            pendingReviewJobs.length > 0 ? (
              <Link
                href={`/admin/pesanan/${pendingReviewJobs[0].id}/review`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8A5A00] hover:underline"
              >
                <span>Buka review ({pendingReviewJobs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              "Semua catatan beres"
            )
          }
        />

        {/* Chat Masuk Saat Tutup */}
        <StatCard
          title="Chat Saat Tutup (7 Hari)"
          value={closedChatsCount}
          icon={MessageSquareOff}
          subtitle={
            <Link
              href="/admin/chatbot"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8D0D00] hover:underline"
            >
              <span>Lihat log pesan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
      </div>

      {/* Grafik Pesanan 7 Hari Terakhir */}
      <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#3B2416]">
              Tren Pesanan (7 Hari Terakhir)
            </h3>
            <p className="text-xs text-[#6B5240]">Jumlah pesanan harian terkonfirmasi</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF4E0] text-[#8D0D00] border border-[#CBA857]/30">
            Aktif
          </span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#78716C" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716C" fontSize={12} allowDecimals={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E7E5E4",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="pesanan" fill="#8D0D00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Kolom: Pesanan Terbaru & Aktivitas Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesanan Terbaru (5 Baris) */}
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-[#3B2416]">Pesanan Terbaru</h3>
              <Link
                href="/admin/pesanan"
                className="text-xs font-semibold text-[#8D0D00] hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="divide-y divide-[#3B2416]/10">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/pesanan/${order.id}`}
                  className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] px-2 rounded-lg transition"
                >
                  <div>
                    <div className="text-xs font-bold text-[#3B2416]">{order.orderNumber}</div>
                    <div className="text-[11px] text-[#6B5240]">
                      {order.items.length} item • {order.source === "foto" ? "📸 Foto" : "✍️ Manual"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#8D0D00]">
                      Rp {order.total.toLocaleString("id-ID")}
                    </div>
                    <div className="text-[10px] text-[#6B5240]">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Aktivitas Terakhir */}
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-base text-[#3B2416]">Aktivitas Terakhir</h3>
            <span className="text-xs text-[#6B5240] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Log Riwayat</span>
            </span>
          </div>
          <div className="space-y-3">
            {statusLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#FAF8F5] border border-[#3B2416]/5 text-xs flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#CBA857] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between font-bold text-[#3B2416]">
                    <span>{log.action}</span>
                    <span className="text-[10px] font-normal text-[#6B5240]">
                      {new Date(log.timestamp).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B5240] mt-0.5">{log.actorName}</div>
                  {log.note && <div className="text-[11px] italic text-[#8A5A00] mt-1">{log.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog Konfirmasi Status Toko Cepat */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmToggleStatus}
        title={pendingStatus ? "Buka Warung Sekarang?" : "Tutup Warung Sementara?"}
        message={
          pendingStatus
            ? "Status toko akan berubah menjadi BUKA. Halaman publik dan chatbot akan menginfokan bahwa pesanan sedang dilayani."
            : "Status toko akan berubah menjadi TUTUP. Chatbot akan merespons pesan pelanggan dengan balasan otomatis saat tutup."
        }
        confirmText={pendingStatus ? "Buka Sekarang" : "Tutup Sekarang"}
        isDanger={!pendingStatus}
      />
    </div>
  );
}
