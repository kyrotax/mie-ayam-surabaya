import { MenuItem } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";
import { supabase } from "@/src/supabaseClient";
import { getSignedFileUrl, deleteFileFromStorage } from "@/lib/storage";

export async function getMenuListService(): Promise<MenuItem[]> {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Supabase getMenuListService error:", error.message);
      return [...getDummyState().menu].sort((a, b) => a.order - b.order);
    }

    if (!data) return [];

    // Resolve signed URLs for private files
    const menuWithSignedUrls: MenuItem[] = await Promise.all(
      data.map(async (row) => ({
        id: Number(row.id),
        name: row.name,
        category: row.category,
        description: row.description || "",
        price: Number(row.price),
        isAvailable: Boolean(row.is_available),
        aliases: row.aliases || [],
        imageUrl: row.image_url ? await getSignedFileUrl(row.image_url) : undefined,
        order: Number(row.order_index ?? row.id),
      }))
    );

    return menuWithSignedUrls;
  } catch (err) {
    console.error("Failed to fetch menu list from Supabase:", err);
    return [...getDummyState().menu].sort((a, b) => a.order - b.order);
  }
}

export async function createMenuItemService(item: Omit<MenuItem, "id" | "order">): Promise<MenuItem> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        {
          user_id: user?.id,
          name: item.name,
          category: item.category,
          description: item.description,
          price: item.price,
          is_available: item.isAvailable,
          aliases: item.aliases,
          image_url: item.imageUrl,
        },
      ])
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to create menu item");

    const resolvedImageUrl = data.image_url ? await getSignedFileUrl(data.image_url) : undefined;

    return {
      id: Number(data.id),
      name: data.name,
      category: data.category,
      description: data.description,
      price: Number(data.price),
      isAvailable: Boolean(data.is_available),
      aliases: data.aliases || [],
      imageUrl: resolvedImageUrl,
      order: Number(data.order_index ?? data.id),
    };
  } catch {
    // Fallback to local store
    const state = getDummyState();
    const maxId = state.menu.reduce((max, m) => Math.max(max, m.id), 0);
    const maxOrder = state.menu.reduce((max, m) => Math.max(max, m.order), 0);
    const newItem: MenuItem = { ...item, id: maxId + 1, order: maxOrder + 1 };
    saveDummyState({ ...state, menu: [...state.menu, newItem] });
    return newItem;
  }
}

export async function updateMenuItemService(id: number, updates: Partial<MenuItem>): Promise<MenuItem> {
  try {
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.price !== undefined) updatePayload.price = updates.price;
    if (updates.isAvailable !== undefined) updatePayload.is_available = updates.isAvailable;
    if (updates.imageUrl !== undefined) updatePayload.image_url = updates.imageUrl;
    if (updates.order !== undefined) updatePayload.order_index = updates.order;

    const { data, error } = await supabase
      .from("menu_items")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to update menu item");

    const resolvedImageUrl = data.image_url ? await getSignedFileUrl(data.image_url) : undefined;

    return {
      id: Number(data.id),
      name: data.name,
      category: data.category,
      description: data.description,
      price: Number(data.price),
      isAvailable: Boolean(data.is_available),
      aliases: data.aliases || [],
      imageUrl: resolvedImageUrl,
      order: Number(data.order_index ?? data.id),
    };
  } catch {
    // Fallback to local store
    const state = getDummyState();
    const existing = state.menu.find((m) => m.id === id);
    if (!existing) throw new Error("Menu tidak ditemukan.");
    const updated: MenuItem = { ...existing, ...updates };
    saveDummyState({ ...state, menu: state.menu.map((m) => (m.id === id ? updated : m)) });
    return updated;
  }
}

/**
 * Delete logic: removes the file from Storage and removes its reference from the database
 */
export async function deleteMenuItemService(id: number): Promise<boolean> {
  try {
    // 1. Fetch file path before deletion
    const { data: itemData } = await supabase
      .from("menu_items")
      .select("image_url")
      .eq("id", id)
      .single();

    // 2. Remove file from Storage
    if (itemData?.image_url) {
      await deleteFileFromStorage(itemData.image_url);
    }

    // 3. Remove record from database
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
  } catch {
    const state = getDummyState();
    saveDummyState({ ...state, menu: state.menu.filter((m) => m.id !== id) });
  }
  return true;
}

export async function toggleMenuAvailabilityService(id: number, isAvailable: boolean): Promise<MenuItem> {
  return updateMenuItemService(id, { isAvailable });
}

export async function reorderMenuService(id: number, direction: "up" | "down"): Promise<MenuItem[]> {
  const currentList = await getMenuListService();
  const index = currentList.findIndex((m) => m.id === id);
  if (index === -1) return currentList;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= currentList.length) return currentList;

  const currentItem = currentList[index];
  const targetItem = currentList[targetIndex];

  await Promise.all([
    updateMenuItemService(currentItem.id, { order: targetItem.order }),
    updateMenuItemService(targetItem.id, { order: currentItem.order }),
  ]);

  return getMenuListService();
}
