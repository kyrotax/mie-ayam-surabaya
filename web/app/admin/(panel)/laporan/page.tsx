"use client";

import React, { useState, useEffect } from "react";
import { ReportData } from "@/lib/admin/services/report-service";
import { getReportDataService } from "@/lib/admin/services/report-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  Download,
  Printer,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MessageSquareOff,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminLaporanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState(30);
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getReportDataService(daysFilter);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [daysFilter]);

  const handleExportCSV = () => {
    if (!report) return;
    const headers = ["Tanggal", "Jumlah Pesanan", "Total Item", "Estimasi Pendapatan (Rp)"];
    const rows = report.dailySummaryTable.map((r) => [
      r.date,
      r.orderCount,
      r.itemsCount,
      r.revenue,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-penjualan-${daysFilter}hari-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !report) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 print:p-0">
      {/* Tombol Cetak / Ekspor */}
      <div className="print:hidden">
        <PageHeader
          title="Laporan & Analisis Penjualan"
          description="Statistik penjualan hidangan, estimasi omset harian, jam ramai pemesanan, dan analitik pesan WhatsApp."
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#3B2416]/20 bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#3B2416] transition"
              >
                <Printer className="w-4 h-4 text-[#8D0D00]" />
                <span>Cetak</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          }
        />

        {/* Filter Periode */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs mb-6 w-fit text-xs font-semibold">
          <Calendar className="w-4 h-4 text-[#8D0D00]" />
          <span>Rentang Periode:</span>
          {[
            { days: 7, label: "7 Hari Terakhir" },
            { days: 14, label: "14 Hari" },
            { days: 30, label: "30 Hari" },
          ].map((item) => (
            <button
              key={item.days}
              type="button"
              onClick={() => setDaysFilter(item.days)}
              className={`px-3 py-1.5 rounded-xl transition ${
                daysFilter === item.days
                  ? "bg-[#8D0D00] text-white"
                  : "bg-[#FAF8F5] text-[#3B2416] hover:bg-[#FFF4E0]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Kartu KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transaksi"
          value={report.kpi.totalOrders}
          icon={ShoppingBag}
          subtitle={`Pesanan selama ${daysFilter} hari`}
        />
        <StatCard
          title="Total Porsi Terjual"
          value={`${report.kpi.totalItemsSold} porsi`}
          icon={TrendingUp}
          subtitle="Akumulasi makanan & minuman"
        />
        <StatCard
          title="Estimasi Omset"
          value={`Rp ${report.kpi.estimatedRevenue.toLocaleString("id-ID")}`}
          icon={DollarSign}
          subtitle="*Estimasi nilai menu resmi"
        />
        <StatCard
          title="Chat Masuk Saat Tutup"
          value={report.kpi.closedHoursChats}
          icon={MessageSquareOff}
          subtitle="Potensi penjualan malam/libur"
        />
      </div>

      {/* 2 Grafik Atas: Tren Penjualan & Menu Terlaris */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tren Penjualan Harian (Line) */}
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-[#3B2416]">
              Tren Pesanan Harian
            </h3>
            <p className="text-xs text-[#6B5240]">Jumlah order yang tercatat per hari</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EA" />
                <XAxis dataKey="date" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E7E5E4",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orderCount"
                  name="Pesanan"
                  stroke="#8D0D00"
                  strokeWidth={2.5}
                  dot={{ fill: "#8D0D00", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 Menu Terlaris (Horizontal Bar) */}
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif font-bold text-base text-[#3B2416]">
              5 Menu Paling Laris
            </h3>
            <p className="text-xs text-[#6B5240]">Berdasarkan total porsi terjual</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report.topMenu}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <XAxis type="number" stroke="#78716C" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#78716C" fontSize={10} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E7E5E4",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="qtySold" name="Porsi Terjual" fill="#CBA857" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grafik Jam Ramai Pemesanan */}
      <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[#3B2416]">
            Distribusi Jam Ramai (Peak Hours)
          </h3>
          <p className="text-xs text-[#6B5240]">
            Kepadatan transaksi dari jam 09.00 hingga 21.00 WIB
          </p>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#78716C" fontSize={11} tickLine={false} />
              <YAxis stroke="#78716C" fontSize={11} allowDecimals={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E7E5E4",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="orderCount" name="Jumlah Pesanan" fill="#D97330" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabel Ringkasan Harian */}
      <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#3B2416]">
          Tabel Ringkasan Penjualan Harian
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#3B2416]/10 text-xs font-bold uppercase text-[#3B2416]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Total Pesanan</th>
                <th className="py-3 px-4">Total Porsi</th>
                <th className="py-3 px-4 text-right">Estimasi Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B2416]/10 text-xs">
              {report.dailySummaryTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5]/60 transition">
                  <td className="py-3 px-4 font-bold text-[#3B2416]">{row.date}</td>
                  <td className="py-3 px-4">{row.orderCount} pesanan</td>
                  <td className="py-3 px-4">{row.itemsCount} porsi</td>
                  <td className="py-3 px-4 text-right font-bold text-[#8D0D00]">
                    Rp {row.revenue.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
