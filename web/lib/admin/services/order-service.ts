import { Order, OrderItem, ExtractionJob } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";
import { mockExtract } from "../mock/mock-extract";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getOrdersService(): Promise<Order[]> {
  await delay();
  return [...getDummyState().orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderByIdService(id: string): Promise<Order | null> {
  await delay();
  const state = getDummyState();
  return state.orders.find((o) => o.id === id) || null;
}

export async function createOrderService(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">
): Promise<Order> {
  await delay();
  const state = getDummyState();
  const nextNum = state.orders.length + 1;
  const numStr = String(nextNum).padStart(4, "0");

  const newOrder: Order = {
    ...orderData,
    id: `ord_${numStr}`,
    orderNumber: `#ORD-${numStr}`,
    createdAt: new Date().toISOString(),
    status: "terkonfirmasi",
  };

  saveDummyState({
    ...state,
    orders: [newOrder, ...state.orders],
  });

  return newOrder;
}

export async function deleteOrderService(id: string): Promise<boolean> {
  await delay();
  const state = getDummyState();
  saveDummyState({
    ...state,
    orders: state.orders.filter((o) => o.id !== id),
  });
  return true;
}

export async function getExtractionJobsService(): Promise<ExtractionJob[]> {
  await delay();
  return [...getDummyState().extractionJobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getExtractionJobByIdService(id: string): Promise<ExtractionJob | null> {
  await delay();
  const state = getDummyState();
  return state.extractionJobs.find((j) => j.id === id) || null;
}

export async function processPhotoExtractionService(filename: string, photoDataUrl: string): Promise<ExtractionJob> {
  // Simulasikan delay langkah ekstraksi AI (1.5 detik)
  await delay(1500);
  const state = getDummyState();
  const job = mockExtract(filename, photoDataUrl);

  saveDummyState({
    ...state,
    extractionJobs: [job, ...state.extractionJobs],
  });

  return job;
}

export async function confirmOrderFromJobService(
  jobId: string,
  items: OrderItem[],
  total: number,
  createdBy: string,
  photoUrl?: string
): Promise<Order> {
  await delay();
  const state = getDummyState();
  const nextNum = state.orders.length + 1;
  const numStr = String(nextNum).padStart(4, "0");

  const newOrder: Order = {
    id: `ord_${numStr}`,
    orderNumber: `#ORD-${numStr}`,
    createdAt: new Date().toISOString(),
    items,
    total,
    source: photoUrl ? "foto" : "manual",
    status: "terkonfirmasi",
    createdBy,
    photoUrl,
  };

  // Update job status to terkonfirmasi
  const updatedJobs = state.extractionJobs.map((j) =>
    j.id === jobId ? { ...j, status: "terkonfirmasi" as const } : j
  );

  saveDummyState({
    ...state,
    orders: [newOrder, ...state.orders],
    extractionJobs: updatedJobs,
  });

  return newOrder;
}

