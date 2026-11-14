import { getDummyState } from "../mock/store";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export type ReportKPI = {
  totalOrders: number;
  totalItemsSold: number;
  estimatedRevenue: number;
  closedHoursChats: number;
};

export type DailyTrendPoint = {
  date: string;
  orderCount: number;
  revenue: number;
};

export type TopMenuItem = {
  name: string;
  qtySold: number;
  revenue: number;
};

export type PeakHourPoint = {
  hour: string;
  orderCount: number;
};

export type ReportData = {
  kpi: ReportKPI;
  dailyTrends: DailyTrendPoint[];
  topMenu: TopMenuItem[];
  peakHours: PeakHourPoint[];
  dailySummaryTable: {
    date: string;
    orderCount: number;
    itemsCount: number;
    revenue: number;
  }[];
};

export async function getReportDataService(days: number = 30): Promise<ReportData> {
  await delay();
  const state = getDummyState();
  const now = new Date("2026-11-14T23:59:59.999Z").getTime();
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  const filteredOrders = state.orders.filter(
    (o) => new Date(o.createdAt).getTime() >= cutoff
  );

  let totalItemsSold = 0;
  let estimatedRevenue = 0;
  const menuSalesMap: Record<string, { qty: number; revenue: number }> = {};
  const hourMap: Record<number, number> = {};
  const dailyMap: Record<string, { count: number; items: number; revenue: number }> = {};

  // Inisialisasi jam 09..21
  for (let h = 9; h <= 21; h++) {
    hourMap[h] = 0;
  }

  filteredOrders.forEach((o) => {
    estimatedRevenue += o.total;
    const d = new Date(o.createdAt);
    const dateKey = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    const hour = d.getUTCHours();

    if (hourMap[hour] !== undefined) {
      hourMap[hour] += 1;
    }

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { count: 0, items: 0, revenue: 0 };
    }
    dailyMap[dateKey].count += 1;
    dailyMap[dateKey].revenue += o.total;

    o.items.forEach((item) => {
      totalItemsSold += item.qty;
      dailyMap[dateKey].items += item.qty;
      if (!menuSalesMap[item.name]) {
        menuSalesMap[item.name] = { qty: 0, revenue: 0 };
      }
      menuSalesMap[item.name].qty += item.qty;
      menuSalesMap[item.name].revenue += item.price * item.qty;
    });
  });

  const closedHoursChats = state.chatLogs.filter(
    (c) => c.storeStatusAtTime === "tutup" && new Date(c.timestamp).getTime() >= cutoff
  ).length;

  const topMenu: TopMenuItem[] = Object.entries(menuSalesMap)
    .map(([name, data]) => ({ name, qtySold: data.qty, revenue: data.revenue }))
    .sort((a, b) => b.qtySold - a.qtySold)
    .slice(0, 5);

  const dailyTrends: DailyTrendPoint[] = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    orderCount: data.count,
    revenue: data.revenue,
  }));

  const peakHours: PeakHourPoint[] = Object.entries(hourMap).map(([h, count]) => ({
    hour: `${h.padStart(2, "0")}.00`,
    orderCount: count,
  }));

  const dailySummaryTable = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    orderCount: data.count,
    itemsCount: data.items,
    revenue: data.revenue,
  }));

  return {
    kpi: {
      totalOrders: filteredOrders.length,
      totalItemsSold,
      estimatedRevenue,
      closedHoursChats,
    },
    dailyTrends,
    topMenu,
    peakHours,
    dailySummaryTable,
  };
}
