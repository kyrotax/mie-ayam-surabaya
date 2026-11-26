"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, CalendarDays, Download, MessageSquareOff, PackageCheck, Printer, ReceiptText, ShoppingBag, TrendingUp } from "lucide-react";
import type { ReportData } from "@/lib/admin/services/report-service";
import { getReportDataService } from "@/lib/admin/services/report-service";
import { Skeleton } from "@/components/admin/ui/Skeleton";

const rupiah = new Intl.NumberFormat("id-ID");

function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof ShoppingBag }) {
  return (
    <article className="flex min-h-[132px] flex-col justify-between rounded-[18px] border border-[#DED7CF] bg-white p-4 shadow-[0_6px_18px_rgba(46,31,21,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-medium text-[#71645B]">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F4F0EB] text-[#8D0D00]">
          <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="text-[26px] font-semibold tracking-[-0.045em] text-[#251C17]">{value}</p>
        <p className="mt-1 text-[11px] text-[#81746B]">{detail}</p>
      </div>
    </article>
  );
}

export default function AdminLaporanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState(30);
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        setReport(await getReportDataService(daysFilter));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [daysFilter]);

  const strongestDay = useMemo(() => {
    if (!report?.dailyTrends.length) return null;
    return report.dailyTrends.reduce((best, day) => day.orderCount > best.orderCount ? day : best);
  }, [report]);

  const busiestHour = useMemo(() => {
    if (!report?.peakHours.length) return null;
    return report.peakHours.reduce((best, hour) => hour.orderCount > best.orderCount ? hour : best);
  }, [report]);

  const handleExportCSV = () => {
    if (!report) return;
    const headers = ["Tanggal", "Jumlah Pesanan", "Total Item", "Estimasi Pendapatan (Rp)"];
    const rows = report.dailySummaryTable.map((row) => [row.date, row.orderCount, row.itemsCount, row.revenue]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `laporan-penjualan-${daysFilter}hari-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !report) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-24 rounded-[18px]" />
        <div className="grid gap-4 lg:grid-cols-3"><Skeleton className="h-48 rounded-[20px]" /><Skeleton className="h-48 rounded-[20px] lg:col-span-2" /></div>
        <Skeleton className="h-80 rounded-[20px]" />
      </div>
    );
  }

  const maxMenuQty = Math.max(...report.topMenu.map((item) => item.qtySold), 1);
  const maxHourOrders = Math.max(...report.peakHours.map((item) => item.orderCount), 1);

  return (
    <div className="space-y-5 pb-8 print:p-0">
      <section className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8D0D00]"><ReceiptText className="h-3.5 w-3.5" aria-hidden="true" />Laporan penjualan</div>
          <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#251C17] sm:text-[36px]">Performa warung</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-5 text-[#71645B]">Ringkasan transaksi, menu terlaris, dan waktu pemesanan untuk membantu keputusan operasional.</p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-[11px] border border-[#D7D0C8] bg-white px-3.5 text-xs font-semibold text-[#51463E] transition-colors hover:border-[#8D0D00] hover:text-[#8D0D00]"><Printer className="h-4 w-4" aria-hidden="true" />Cetak</button>
          <button type="button" onClick={handleExportCSV} className="inline-flex h-10 items-center gap-2 rounded-[11px] bg-[#8D0D00] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#710B02]"><Download className="h-4 w-4" aria-hidden="true" />Ekspor CSV</button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 rounded-[15px] border border-[#DED7CF] bg-white p-2 print:hidden">
        <div className="flex items-center gap-2 pl-2 text-xs font-medium text-[#62564D]"><CalendarDays className="h-4 w-4 text-[#8D0D00]" aria-hidden="true" /><span className="hidden sm:inline">Rentang laporan</span></div>
        <div className="flex items-center rounded-[10px] bg-[#F3F0EC] p-1">
          {[{ days: 7, label: "7 hari" }, { days: 14, label: "14 hari" }, { days: 30, label: "30 hari" }].map((item) => (
            <button key={item.days} type="button" onClick={() => setDaysFilter(item.days)} className={`min-h-8 rounded-[8px] px-3 text-[11px] font-semibold transition-colors ${daysFilter === item.days ? "bg-white text-[#8D0D00] shadow-[0_2px_7px_rgba(46,31,21,0.08)]" : "text-[#71645B] hover:text-[#251C17]"}`}>{item.label}</button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_1.95fr]">
        <article className="relative min-h-[284px] overflow-hidden rounded-[22px] bg-[#8D0D00] p-6 text-white shadow-[0_16px_34px_rgba(93,20,10,0.13)]">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/15" /><div className="absolute -right-6 -top-8 h-40 w-40 rounded-full border border-white/15" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/75">Estimasi omset</p><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12"><TrendingUp className="h-4 w-4" aria-hidden="true" /></span></div>
            <div className="py-8"><p className="text-[13px] text-white/70">{daysFilter} hari terakhir</p><p className="mt-1 text-[38px] font-semibold tracking-[-0.055em] sm:text-[44px]">Rp {rupiah.format(report.kpi.estimatedRevenue)}</p></div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-[11px]"><div><p className="text-white/60">Hari terpadat</p><p className="mt-1 font-semibold">{strongestDay?.date ?? "Belum ada data"}</p></div><div><p className="text-white/60">Jam terpadat</p><p className="mt-1 font-semibold">{busiestHour?.hour ?? "Belum ada data"} WIB</p></div></div>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Total transaksi" value={rupiah.format(report.kpi.totalOrders)} detail={`Tercatat selama ${daysFilter} hari`} icon={ShoppingBag} />
          <MetricCard label="Porsi terjual" value={rupiah.format(report.kpi.totalItemsSold)} detail="Akumulasi seluruh menu" icon={PackageCheck} />
          <MetricCard label="Pesan saat tutup" value={rupiah.format(report.kpi.closedHoursChats)} detail="Perlu ditinjau sebagai peluang" icon={MessageSquareOff} />
          <article className="rounded-[18px] border border-[#DED7CF] bg-[#251C17] p-4 text-white sm:col-span-3">
            <div className="flex items-center justify-between gap-4"><div><p className="text-[11px] text-white/60">Rata-rata nilai transaksi</p><p className="mt-1 text-[24px] font-semibold tracking-[-0.04em]">Rp {rupiah.format(Math.round(report.kpi.estimatedRevenue / Math.max(report.kpi.totalOrders, 1)))}</p></div><div className="hidden items-center gap-2 text-right text-[11px] text-white/65 sm:flex">Berdasarkan transaksi tercatat<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></div></div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.65fr_0.85fr]">
        <article className="rounded-[22px] border border-[#DED7CF] bg-white p-5 shadow-[0_6px_18px_rgba(46,31,21,0.035)] sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-[17px] font-semibold tracking-[-0.025em]">Tren pesanan</h2><p className="mt-1 text-[11px] text-[#81746B]">Jumlah transaksi yang tercatat per hari</p></div><span className="rounded-full bg-[#F5EAE7] px-3 py-1.5 text-[10px] font-semibold text-[#8D0D00]">{report.kpi.totalOrders} transaksi</span></div>
          <div className="mt-6 h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={report.dailyTrends} margin={{ top: 10, right: 8, left: -25, bottom: 0 }}><defs><linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A91D10" stopOpacity={0.24} /><stop offset="100%" stopColor="#A91D10" stopOpacity={0.015} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#EEE9E3" strokeDasharray="3 4" /><XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} stroke="#8B7F76" minTickGap={24} /><YAxis axisLine={false} tickLine={false} allowDecimals={false} fontSize={10} stroke="#8B7F76" /><Tooltip cursor={{ stroke: "#B9AFA7", strokeDasharray: "3 4" }} contentStyle={{ border: "1px solid #DED7CF", borderRadius: 12, fontSize: 11, boxShadow: "0 10px 24px rgba(46,31,21,.08)" }} formatter={(value) => [`${value} pesanan`, "Total"]} /><Area type="monotone" dataKey="orderCount" stroke="#8D0D00" strokeWidth={2.5} fill="url(#ordersFill)" dot={false} activeDot={{ r: 4, fill: "#8D0D00", stroke: "#fff", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div>
        </article>

        <article className="rounded-[22px] border border-[#DED7CF] bg-white p-5 shadow-[0_6px_18px_rgba(46,31,21,0.035)] sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-[17px] font-semibold tracking-[-0.025em]">Menu terlaris</h2><p className="mt-1 text-[11px] text-[#81746B]">Porsi terjual pada periode ini</p></div><PackageCheck className="h-5 w-5 text-[#8D0D00]" aria-hidden="true" /></div>
          <div className="mt-6 space-y-5">{report.topMenu.map((item, index) => <div key={item.name}><div className="mb-2 flex items-center justify-between gap-3 text-[12px]"><div className="flex min-w-0 items-center gap-2.5"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#F3F0EC] text-[10px] font-semibold text-[#71645B]">{index + 1}</span><span className="truncate font-medium text-[#3F352E]">{item.name}</span></div><span className="shrink-0 font-semibold text-[#251C17]">{item.qtySold} porsi</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#EEE9E3]"><div className="h-full rounded-full bg-[#C69B4A]" style={{ width: `${(item.qtySold / maxMenuQty) * 100}%` }} /></div></div>)}</div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[22px] border border-[#DED7CF] bg-[#FBFAF8] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-[17px] font-semibold tracking-[-0.025em]">Jam pemesanan</h2><p className="mt-1 text-[11px] text-[#81746B]">Kepadatan transaksi pukul 09.00–21.00 WIB</p></div><span className="rounded-[9px] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#8D0D00] shadow-sm">Puncak {busiestHour?.hour}</span></div>
          <div className="mt-7 flex h-[152px] items-end gap-1.5" aria-label="Grafik kepadatan pesanan per jam">{report.peakHours.map((item) => <div key={item.hour} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] font-semibold text-[#71645B]">{item.orderCount || ""}</span><div className={`w-full min-w-[6px] rounded-t-[5px] ${item.hour === busiestHour?.hour ? "bg-[#8D0D00]" : "bg-[#D9C6A0]"}`} style={{ height: `${Math.max(7, (item.orderCount / maxHourOrders) * 100)}px` }} /><span className="hidden text-[8px] text-[#8B7F76] sm:block">{item.hour.slice(0, 2)}</span></div>)}</div>
        </article>

        <article className="overflow-hidden rounded-[22px] border border-[#DED7CF] bg-white shadow-[0_6px_18px_rgba(46,31,21,0.035)]">
          <div className="flex items-center justify-between border-b border-[#E8E2DB] px-5 py-4 sm:px-6"><div><h2 className="text-[17px] font-semibold tracking-[-0.025em]">Ringkasan harian</h2><p className="mt-1 text-[11px] text-[#81746B]">Rincian hari yang memiliki transaksi</p></div><span className="text-[10px] font-medium text-[#81746B]">{report.dailySummaryTable.length} hari aktif</span></div>
          <div className="max-h-[286px] overflow-auto"><table className="w-full min-w-[560px] border-collapse text-left"><thead className="sticky top-0 bg-[#F7F4F0] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#81746B]"><tr><th className="px-6 py-3">Tanggal</th><th className="px-4 py-3">Pesanan</th><th className="px-4 py-3">Porsi</th><th className="px-6 py-3 text-right">Omset</th></tr></thead><tbody className="divide-y divide-[#EEE9E3] text-[12px]">{report.dailySummaryTable.map((row) => <tr key={row.date} className="transition-colors hover:bg-[#FBF9F6]"><td className="px-6 py-3.5 font-semibold text-[#3F352E]">{row.date}</td><td className="px-4 py-3.5 text-[#71645B]">{row.orderCount}</td><td className="px-4 py-3.5 text-[#71645B]">{row.itemsCount}</td><td className="px-6 py-3.5 text-right font-semibold text-[#8D0D00]">Rp {rupiah.format(row.revenue)}</td></tr>)}</tbody></table></div>
        </article>
      </section>
    </div>
  );
}
