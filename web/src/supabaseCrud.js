import { supabase } from "./supabaseClient";

// ==============================================================================
// 1. MENU ITEMS CRUD (Create, Read, Update, Delete)
// ==============================================================================

/**
 * 1. Read: Load all menu items
 */
export async function loadMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error loading menu items:", error.message);
    throw error;
  }
  return data;
}

/**
 * 2. Create: Add a new menu item
 */
export async function createMenuItem(itemData) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("menu_items")
    .insert([
      {
        user_id: user?.id,
        name: itemData.name,
        category: itemData.category, // 'Mie Ayam', 'Topping/Tambahan', 'Minuman'
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

  if (error) {
    console.error("Error creating menu item:", error.message);
    throw error;
  }
  return data;
}

/**
 * 3. Update: Modify an existing menu item by ID
 */
export async function updateMenuItem(id, updates) {
  const { data, error } = await supabase
    .from("menu_items")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error.message);
    throw error;
  }
  return data;
}

/**
 * 4. Delete: Remove a menu item by ID
 */
export async function deleteMenuItem(id) {
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error.message);
    throw error;
  }
  return true;
}


// ==============================================================================
// 2. ORDERS CRUD (Create, Read, Update, Delete)
// ==============================================================================

/**
 * 1. Read: Load all orders (sorted newest first)
 */
export async function loadOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading orders:", error.message);
    throw error;
  }
  return data;
}

/**
 * 2. Create: Record a new order
 */
export async function createOrder(orderData) {
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
        source: orderData.source || "manual", // 'manual' | 'foto'
        status: orderData.status || "terkonfirmasi",
        created_by: orderData.createdBy || user?.email || "Admin",
        notes: orderData.notes || null,
        photo_url: orderData.photoUrl || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error.message);
    throw error;
  }
  return data;
}

/**
 * 3. Update: Modify an order's status or notes by ID
 */
export async function updateOrder(id, updates) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating order:", error.message);
    throw error;
  }
  return data;
}

/**
 * 4. Delete: Remove an order by ID
 */
export async function deleteOrder(id) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
  return true;
}
