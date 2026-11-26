import { Order, OrderItem, ExtractionJob } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";
import { mockExtract } from "../mock/mock-extract";
import { supabase } from "@/src/supabaseClient";
import { getSignedFileUrl, deleteFileFromStorage } from "@/lib/storage";

export async function getOrdersService(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getOrdersService error:", error.message);
      return [...getDummyState().orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (!data) return [];

    // Resolve signed URLs for private files
    const ordersWithSignedUrls: Order[] = await Promise.all(
      data.map(async (row) => ({
        id: String(row.id),
        orderNumber: row.order_number || `#ORD-${String(row.id).slice(-4)}`,
        createdAt: row.created_at,
        items: (row.items as OrderItem[]) || [],
        total: Number(row.total || 0),
        source: row.source || "manual",
        status: row.status || "terkonfirmasi",
        createdBy: row.created_by || "Kasir / Admin",
        notes: row.notes || undefined,
        photoUrl: row.photo_url ? await getSignedFileUrl(row.photo_url) : undefined,
      }))
    );

    return ordersWithSignedUrls;
  } catch (err) {
    console.error("Failed to fetch orders from Supabase:", err);
    return [...getDummyState().orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export async function getOrderByIdService(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const state = getDummyState();
      return state.orders.find((o) => o.id === id) || null;
    }

    const resolvedPhotoUrl = data.photo_url ? await getSignedFileUrl(data.photo_url) : undefined;

    return {
      id: String(data.id),
      orderNumber: data.order_number,
      createdAt: data.created_at,
      items: (data.items as OrderItem[]) || [],
      total: Number(data.total || 0),
      source: data.source || "manual",
      status: data.status || "terkonfirmasi",
      createdBy: data.created_by || "Admin",
      notes: data.notes || undefined,
      photoUrl: resolvedPhotoUrl,
    };
  } catch {
    const state = getDummyState();
    return state.orders.find((o) => o.id === id) || null;
  }
}

export async function createOrderService(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">
): Promise<Order> {
  const numStr = String(Date.now()).slice(-4);
  const orderNumber = `#ORD-${numStr}`;

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user?.id,
          order_number: orderNumber,
          items: orderData.items,
          total: orderData.total,
          source: orderData.source || "manual",
          status: "terkonfirmasi",
          created_by: orderData.createdBy || user?.email || "Admin",
          notes: orderData.notes,
          photo_url: orderData.photoUrl,
        },
      ])
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to insert order");

    const resolvedPhotoUrl = data.photo_url ? await getSignedFileUrl(data.photo_url) : undefined;

    return {
      id: String(data.id),
      orderNumber: data.order_number,
      createdAt: data.created_at,
      items: data.items,
      total: Number(data.total),
      source: data.source,
      status: data.status,
      createdBy: data.created_by,
      notes: data.notes,
      photoUrl: resolvedPhotoUrl,
    };
  } catch {
    const state = getDummyState();
    const newOrder: Order = {
      ...orderData,
      id: `ord_${numStr}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "terkonfirmasi",
    };

    saveDummyState({
      ...state,
      orders: [newOrder, ...state.orders],
    });

    return newOrder;
  }
}

/**
 * Delete logic: removes the file from Storage and removes its reference from the database
 */
export async function deleteOrderService(id: string): Promise<boolean> {
  try {
    // 1. Fetch file path from database before deletion
    const { data: orderData } = await supabase
      .from("orders")
      .select("photo_url")
      .eq("id", id)
      .single();

    // 2. Remove file from Supabase Storage
    if (orderData?.photo_url) {
      await deleteFileFromStorage(orderData.photo_url);
    }

    // 3. Remove order record from database
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;
  } catch {
    const state = getDummyState();
    saveDummyState({
      ...state,
      orders: state.orders.filter((o) => o.id !== id),
    });
  }
  return true;
}

export async function getExtractionJobsService(): Promise<ExtractionJob[]> {
  const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay();
  return [...getDummyState().extractionJobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getExtractionJobByIdService(id: string): Promise<ExtractionJob | null> {
  const state = getDummyState();
  return state.extractionJobs.find((j) => j.id === id) || null;
}

export async function processPhotoExtractionService(filename: string, photoDataUrl: string): Promise<ExtractionJob> {
  const delay = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay();
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
  return createOrderService({
    items,
    total,
    createdBy,
    source: photoUrl ? "foto" : "manual",
    photoUrl,
  });
}
