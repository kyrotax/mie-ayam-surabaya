import { supabase } from "@/src/supabaseClient";
import { uploadFileToStorage, getSignedFileUrl, deleteFileFromStorage } from "@/lib/storage";

export { uploadFileToStorage, getSignedFileUrl, deleteFileFromStorage };

// ==============================================================================
// 1. MENU ITEMS
// ==============================================================================

export async function loadMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;

  return Promise.all(
    data.map(async (item) => ({
      ...item,
      image_url: item.image_url ? await getSignedFileUrl(item.image_url) : null,
    }))
  );
}

export async function createMenuItem(itemData: {
  name: string;
  category: "Mie Ayam" | "Topping/Tambahan" | "Minuman";
  description?: string;
  price: number;
  isAvailable?: boolean;
  aliases?: string[];
  imageUrl?: string;
  orderIndex?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("menu_items")
    .insert([
      {
        user_id: user?.id,
        name: itemData.name,
        category: itemData.category,
        description: itemData.description || "",
        price: itemData.price,
        is_available: itemData.isAvailable ?? true,
        aliases: itemData.aliases || [],
        image_url: itemData.imageUrl || null,
        order_index: itemData.orderIndex || 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: number | string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("menu_items")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: number | string) {
  // 1. Fetch file reference
  const { data: item } = await supabase
    .from("menu_items")
    .select("image_url")
    .eq("id", id)
    .single();

  // 2. Remove file from storage
  if (item?.image_url) {
    await deleteFileFromStorage(item.image_url);
  }

  // 3. Delete record from database
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

// ==============================================================================
// 2. ORDERS
// ==============================================================================

export async function loadOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return Promise.all(
    data.map(async (order) => ({
      ...order,
      photo_url: order.photo_url ? await getSignedFileUrl(order.photo_url) : null,
    }))
  );
}

export async function createOrder(orderData: {
  orderNumber?: string;
  items: any[];
  total: number;
  source?: "manual" | "foto";
  status?: "terkonfirmasi" | "dibatalkan";
  createdBy?: string;
  notes?: string;
  photoUrl?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  const orderNumber = orderData.orderNumber || `#ORD-${String(Date.now()).slice(-4)}`;

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: user?.id,
        order_number: orderNumber,
        items: orderData.items || [],
        total: orderData.total || 0,
        source: orderData.source || "manual",
        status: orderData.status || "terkonfirmasi",
        created_by: orderData.createdBy || user?.email || "Admin",
        notes: orderData.notes || null,
        photo_url: orderData.photoUrl || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrder(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOrder(id: string) {
  // 1. Fetch file reference
  const { data: order } = await supabase
    .from("orders")
    .select("photo_url")
    .eq("id", id)
    .single();

  // 2. Remove file from storage
  if (order?.photo_url) {
    await deleteFileFromStorage(order.photo_url);
  }

  // 3. Delete record from database
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
