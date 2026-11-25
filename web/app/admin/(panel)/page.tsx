"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Camera,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  ReceiptText,
} from "lucide-react";
import type {
  ChatLog,
  ExtractionJob,
  Order,
  StatusLogEntry,
  StoreStatus,
} from "@/lib/admin/types";
import {
  getExtractionJobsService,
  getOrdersService,
} from "@/lib/admin/services/order-service";
import {
  getStatusLogsService,
  getStoreStatusService,
  updateStoreStatusService,
} from "@/lib/admin/services/status-service";
import { getChatLogsService } from "@/lib/admin/services/chatbot-service";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { ErrorState } from "@/components/admin/ui/ErrorState";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ui/Toast";

type DashboardData = {
  storeStatus: StoreStatus;
  orders: Order[];
  jobs: ExtractionJob[];
  statusLogs: StatusLogEntry[];
  chats: ChatLog[];
  today: string;
};

const wibDate = (date: Date) =>
  new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

const addDays = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000)
    .toISOString()
    .slice(0, 10);

const shortDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

const longDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const orderTime = (date: string) =>
  new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

const rupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

export default function AdminDashboardPage() {
  const { sukses, bahaya } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [storeStatus, orders, jobs, statusLogs, chats] = await Promise.all([
        getStoreStatusService(),
        getOrdersService(),
        getExtractionJobsService(),
        getStatusLogsService(),
        getChatLogsService(),
      ]);
      setData({ storeStatus, orders, jobs, statusLogs, chats, today: wibDate(new Date()) });
    } catch {
      setData(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const confirmStatusChange = async () => {
    if (pendingStatus === null || !data) return;
    setIsUpdatingStatus(true);
    try {
      const storeStatus = await updateStoreStatusService(
        {
          isOpen: pendingStatus,
          statusNote: pendingStatus
            ? "Warung sedang buka melayani pelanggan."
            : "Warung sedang tutup sementara.",
        },
        "Owner",
        pendingStatus ? "Buka warung" : "Tutup warung"
      );
      const statusLogs = await getStatusLogsService().catch(() => data.statusLogs);
      setData((current) => current && { ...current, storeStatus, statusLogs });
      sukses(pendingStatus ? "Warung sekarang buka." : "Warung sekarang tutup.");
      setPendingStatus(null);
    } catch {
      bahaya("Status toko gagal diubah. Coba lagi.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" aria-label="Memuat ringkasan Owner">
        <Skeleton className="h-20 rounded-[18px]" />
        <Skeleton className="h-[360px] rounded-[30px]" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.65fr)]">
          <Skeleton className="h-[370px] rounded-[24px]" />
          <Skeleton className="h-[370px] rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <ErrorState
        title="Ringkasan belum dapat dimuat"
        message="Data warung dan pesanan gagal diambil. Muat ulang untuk mencoba lagi."
        onRetry={() => void loadData()}
      />
    );
  }

  const { storeStatus, orders, jobs, statusLogs, chats, today } = data;
  const firstDay = addDays(today, -29);
  const chatStart = addDays(today, -6);
  const todayOrders = orders.filter((order) => wibDate(new Date(order.createdAt)) === today);
  const periodOrders = orders.filter((order) => {
    const date = wibDate(new Date(order.createdAt));
    return date >= firstDay && date <= today;
  });
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const todayItems = todayOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0),
    0
  );
  const periodRevenue = periodOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingJobs = jobs.filter((job) => job.status === "perlu_review");
  const closedChats = chats.filter((chat) => {
    const date = wibDate(new Date(chat.timestamp));
    return chat.storeStatusAtTime === "tutup" && date >= chatStart && date <= today;
  });
  const chartData = Array.from({ length: 30 }, (_, index) => {
    const date = addDays(firstDay, index);
    const dayOrders = orders.filter(
      (order) => wibDate(new Date(order.createdAt)) === date
    );
    return {
      date,
      label: shortDate(date),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
    };
  });
  const busiestDay = chartData.reduce(
    (highest, day) => (day.orders > highest.orders ? day : highest),
    chartData[0]
  );
  const maxDailyOrders = Math.max(...chartData.map((day) => day.orders), 1);
  const recentFourteenDays = chartData.slice(-14);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#6E6259]">{longDate(today)}</p>
          <h1 className="mt-1 text-[clamp(2.15rem,4vw,3.15rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-[#251C17]">
            Operasional hari ini
          </h1>
        </div>
        <Link
          href="/admin/pesanan/baru"
          className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-[14px] bg-[#8D0D00] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(141,13,0,0.18)] transition-colors hover:bg-[#6F0A00] sm:self-auto"
        >
          <Camera className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          Catat pesanan
        </Link>
      </header>

      <section
        aria-labelledby="store-status-heading"
        className="grid overflow-hidden rounded-[30px] border border-[#D7CEC4] bg-[#FFF9F0] shadow-[0_14px_40px_rgba(57,38,26,0.07)] xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.72fr)]"
      >
        <div className="relative min-h-[340px] overflow-hidden bg-[#7B1007] p-7 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-14 top-8 h-56 w-72 rotate-[-12deg] opacity-70" aria-hidden="true">
            <span className="absolute left-0 top-2 h-20 w-72 rounded-[50%] border-t-2 border-[#D6AC58]" />
            <span className="absolute left-5 top-12 h-20 w-72 rounded-[50%] border-t-2 border-[#D6AC58]" />
            <span className="absolute left-10 top-[88px] h-20 w-72 rounded-[50%] border-t-2 border-[#D6AC58]" />
          </div>

          <div className="relative flex h-full max-w-2xl flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#F2D7C4]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F0C87D]" aria-hidden="true" />
                Status warung saat ini
              </div>
              <h2 id="store-status-heading" className="mt-5 font-display text-[clamp(4.5rem,9vw,7.5rem)] font-semibold uppercase leading-[.86] tracking-[-0.045em]">
                {storeStatus.isOpen ? "Buka" : "Tutup"}
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[#F2D7C4] sm:text-base">
                {storeStatus.statusNote ||
                  (storeStatus.isOpen
                    ? "Warung siap menerima pelanggan dan pesanan baru."
                    : "Warung sedang tidak menerima pesanan baru.")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPendingStatus(!storeStatus.isOpen)}
              className="mt-8 min-h-12 self-start rounded-[14px] bg-[#FFF9F0] px-5 text-sm font-semibold text-[#731208] transition-colors hover:bg-[#F0C87D]"
            >
              {storeStatus.isOpen ? "Tutup warung sementara" : "Buka warung sekarang"}
            </button>
          </div>
        </div>

        <div className="flex min-h-[340px] flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.025em] text-[#251C17]">Perlu perhatian</h2>
              <p className="mt-1 text-sm leading-6 text-[#6E6259]">Tugas yang belum selesai hari ini.</p>
            </div>
            <span className="font-display text-5xl font-semibold leading-none text-[#8D0D00]">
              {pendingJobs.length + closedChats.length}
            </span>
          </div>

          <div className="mt-7 flex-1 divide-y divide-[#DED5CB] border-y border-[#DED5CB]">
            <div className="flex min-h-[86px] items-center gap-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F3E4DE] text-[#8D0D00]">
                <ClipboardCheck className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#251C17]">Catatan foto</p>
                <p className="mt-1 text-xs text-[#6E6259]">
                  {pendingJobs.length > 0
                    ? `${pendingJobs.length} hasil perlu diperiksa`
                    : "Semua hasil sudah diperiksa"}
                </p>
              </div>
              {pendingJobs.length > 0 ? (
                <Link
                  href={`/admin/pesanan/${pendingJobs[0].id}/review`}
                  className="min-h-11 shrink-0 px-2 py-3 text-xs font-semibold text-[#8D0D00] hover:underline"
                >
                  Periksa
                </Link>
              ) : (
                <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" strokeWidth={1.8} aria-label="Selesai" />
              )}
            </div>

            <div className="flex min-h-[86px] items-center gap-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F3E4DE] text-[#8D0D00]">
                <MessageSquareText className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#251C17]">Pesan saat tutup</p>
                <p className="mt-1 text-xs text-[#6E6259]">
                  {closedChats.length > 0
                    ? `${closedChats.length} pesan dalam 7 hari terakhir`
                    : "Tidak ada pesan yang tertinggal"}
                </p>
              </div>
              <Link
                href="/admin/chatbot"
                className="min-h-11 shrink-0 px-2 py-3 text-xs font-semibold text-[#8D0D00] hover:underline"
              >
                Buka log
              </Link>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-[#6E6259]">
            {statusLogs[0]
              ? `Status terakhir diubah ${orderTime(statusLogs[0].timestamp)}.`
              : "Belum ada perubahan status yang tercatat."}
          </p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,.65fr)]">
        <section
          aria-labelledby="order-chart-heading"
          className="min-w-0 rounded-[26px] border border-[#DCD5CD] bg-white p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="order-chart-heading" className="max-w-xl text-xl font-semibold tracking-[-0.025em] text-[#251C17] sm:text-2xl">
                Kapan pesanan paling ramai?
              </h2>
              <p className="mt-2 text-sm text-[#6E6259]">
                {shortDate(firstDay)} sampai {shortDate(today)}, berdasarkan pesanan tercatat.
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-[#6E6259]">Hari terpadat</p>
              <p className="mt-1 text-sm font-semibold text-[#251C17]">
                {busiestDay.orders > 0
                  ? `${shortDate(busiestDay.date)}, ${busiestDay.orders} pesanan`
                  : "Belum ada data"}
              </p>
            </div>
          </div>

          {chartData.every((day) => day.orders === 0) ? (
            <div className="mt-8 flex h-56 flex-col items-center justify-center border-t border-[#E5DED7] text-center">
              <ReceiptText className="h-7 w-7 text-[#8D0D00]" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#251C17]">Belum ada pesanan dalam periode ini</p>
              <p className="mt-1 max-w-sm text-xs leading-5 text-[#6E6259]">Catat pesanan pertama untuk mulai melihat pola penjualan.</p>
            </div>
          ) : (
            <div className="mt-7 h-64 w-full" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8D0D00" stopOpacity={0.26} />
                      <stop offset="100%" stopColor="#8D0D00" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#EEE8E1" />
                  <XAxis
                    dataKey="label"
                    stroke="#796D64"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={36}
                  />
                  <YAxis
                    stroke="#796D64"
                    fontSize={11}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [value ?? 0, "Pesanan"]}
                    contentStyle={{
                      border: "1px solid #DCD5CD",
                      borderRadius: 12,
                      fontSize: 12,
                      boxShadow: "0 12px 30px rgba(63,36,22,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#8D0D00"
                    strokeWidth={2.5}
                    fill="url(#orderFill)"
                    activeDot={{ r: 5, fill: "#D6AC58", stroke: "#731208", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="sr-only">
            <table>
              <caption>Jumlah pesanan per hari selama 30 hari terakhir</caption>
              <thead>
                <tr><th scope="col">Tanggal</th><th scope="col">Pesanan</th></tr>
              </thead>
              <tbody>
                {chartData.map((day) => (
                  <tr key={day.date}><th scope="row">{day.label}</th><td>{day.orders}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex min-h-[360px] flex-col overflow-hidden rounded-[26px] border border-[#D7D0C8] bg-[#FAF9F7] p-6 text-[#251C17] shadow-[0_12px_34px_rgba(57,38,26,0.07)] sm:p-7" aria-labelledby="sales-today-heading">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Penjualan hari ini</p>
              <span className="text-xs text-[#74675E]">30 hari terakhir</span>
            </div>
            <h2 id="sales-today-heading" className="mt-4 break-words text-[clamp(2.5rem,5vw,3.8rem)] font-semibold leading-none tracking-[-0.045em]">
              {rupiah(todayRevenue)}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6E6259]">
              {todayOrders.length > 0
                ? `${todayOrders.length} pesanan dengan ${todayItems} porsi atau item.`
                : "Belum ada pesanan yang dicatat hari ini."}
            </p>
          </div>

          <div className="mt-6 border-y border-[#DFD9D2] py-5">
            <div className="flex items-center justify-between gap-3 text-xs text-[#74675E]">
              <span>Aktivitas pesanan</span>
              <span>{periodOrders.length} transaksi</span>
            </div>
            <div className="mt-4 flex h-16 items-end gap-1.5" aria-hidden="true">
              {recentFourteenDays.map((day) => (
                <span
                  key={day.date}
                  className={`min-w-0 flex-1 rounded-t-[4px] ${day.orders > 0 ? "bg-[#8D0D00]" : "bg-[#DDD7D0]"}`}
                  style={{ height: `${Math.max(8, (day.orders / maxDailyOrders) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-1 flex-col justify-between">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-[#74675E]">Jumlah pesanan</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{periodOrders.length}</p>
                <p className="mt-1 text-xs text-[#6E6259]">30 hari</p>
              </div>
              <div>
                <p className="text-xs text-[#74675E]">Nilai tercatat</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">{rupiah(periodRevenue)}</p>
                <p className="mt-1 text-xs text-[#6E6259]">30 hari</p>
              </div>
            </div>
            <Link href="/admin/laporan" className="mt-6 inline-flex min-h-11 items-center justify-center self-start rounded-[12px] bg-[#251C17] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#8D0D00]">
              Buka laporan lengkap
            </Link>
          </div>
        </section>
      </div>

      <section className="rounded-[26px] border border-[#DCD5CD] bg-white" aria-labelledby="recent-orders-heading">
        <div className="grid xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.65fr)]">
          <div className="min-w-0 p-6 sm:p-8 xl:border-r xl:border-[#E3DDD6]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 id="recent-orders-heading" className="text-xl font-semibold tracking-[-0.025em] text-[#251C17]">Pesanan terakhir</h2>
                <p className="mt-1 text-sm text-[#6E6259]">Riwayat terbaru dari semua sumber pencatatan.</p>
              </div>
              <Link href="/admin/pesanan" className="min-h-11 shrink-0 px-2 py-3 text-xs font-semibold text-[#8D0D00] hover:underline">
                Lihat riwayat
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="mt-6 border-t border-[#E3DDD6] py-10">
                <p className="text-sm font-semibold text-[#251C17]">Belum ada pesanan</p>
                <p className="mt-2 text-xs leading-5 text-[#6E6259]">Gunakan tombol Catat pesanan untuk menambahkan transaksi pertama.</p>
              </div>
            ) : (
              <div className="mt-6 divide-y divide-[#E3DDD6] border-t border-[#E3DDD6]">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pesanan/${order.id}`}
                    className="grid min-h-[78px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 transition-colors hover:bg-[#FBF8F4] sm:grid-cols-[minmax(140px,.7fr)_minmax(140px,1fr)_auto] sm:px-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#251C17]">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-[#6E6259]">{orderTime(order.createdAt)}</p>
                    </div>
                    <div className="hidden min-w-0 sm:block">
                      <p className="truncate text-sm text-[#443831]">
                        {order.items.slice(0, 2).map((item) => item.name).join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-[#6E6259]">
                        {order.items.reduce((sum, item) => sum + item.qty, 0)} item, {order.source === "foto" ? "catatan foto" : "input manual"}
                      </p>
                    </div>
                    <p className="text-right text-sm font-semibold text-[#251C17]">{rupiah(order.total)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="border-t border-[#E3DDD6] bg-[#FBF8F4] p-6 sm:p-8 xl:border-t-0" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="text-lg font-semibold tracking-[-0.02em] text-[#251C17]">Aktivitas warung</h2>
            <p className="mt-1 text-sm text-[#6E6259]">Perubahan status terbaru.</p>
            {statusLogs.length === 0 ? (
              <p className="mt-7 text-sm leading-6 text-[#6E6259]">Belum ada aktivitas yang tercatat.</p>
            ) : (
              <ol className="mt-7 space-y-6">
                {statusLogs.slice(0, 3).map((log, index) => (
                  <li key={log.id} className="relative pl-6">
                    {index < Math.min(statusLogs.length, 3) - 1 && (
                      <span className="absolute left-[5px] top-4 h-[calc(100%+12px)] w-px bg-[#D8CFC6]" aria-hidden="true" />
                    )}
                    <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-[#FBF8F4] bg-[#8D0D00] ring-1 ring-[#8D0D00]" aria-hidden="true" />
                    <p className="text-sm font-semibold text-[#251C17]">{log.action}</p>
                    <p className="mt-1 text-xs leading-5 text-[#6E6259]">{log.actorName}, {orderTime(log.timestamp)}</p>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </section>

      <ConfirmDialog
        isOpen={pendingStatus !== null}
        onClose={() => setPendingStatus(null)}
        onConfirm={confirmStatusChange}
        isLoading={isUpdatingStatus}
        title={pendingStatus ? "Buka warung sekarang?" : "Tutup warung sementara?"}
        message={pendingStatus
          ? "Status warung akan berubah menjadi buka."
          : "Status warung akan berubah menjadi tutup."}
        confirmText={pendingStatus ? "Buka warung" : "Tutup warung"}
        isDanger={!pendingStatus}
      />
    </div>
  );
}
