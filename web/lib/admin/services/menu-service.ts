import { MenuItem } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMenuListService(): Promise<MenuItem[]> {
  await delay();
  return [...getDummyState().menu].sort((a, b) => a.order - b.order);
}

export async function createMenuItemService(item: Omit<MenuItem, "id" | "order">): Promise<MenuItem> {
  await delay();
  const state = getDummyState();
  const maxId = state.menu.reduce((max, m) => Math.max(max, m.id), 0);
  const maxOrder = state.menu.reduce((max, m) => Math.max(max, m.order), 0);

  const newItem: MenuItem = {
    ...item,
    id: maxId + 1,
    order: maxOrder + 1,
  };

  saveDummyState({
    ...state,
    menu: [...state.menu, newItem],
  });

  return newItem;
}

export async function updateMenuItemService(id: number, updates: Partial<MenuItem>): Promise<MenuItem> {
  await delay();
  const state = getDummyState();
  const existing = state.menu.find((m) => m.id === id);
  if (!existing) throw new Error("Menu tidak ditemukan.");

  const updated: MenuItem = { ...existing, ...updates };
  const updatedList = state.menu.map((m) => (m.id === id ? updated : m));

  saveDummyState({
    ...state,
    menu: updatedList,
  });

  return updated;
}

export async function deleteMenuItemService(id: number): Promise<boolean> {
  await delay();
  const state = getDummyState();
  const filtered = state.menu.filter((m) => m.id !== id);
  saveDummyState({ ...state, menu: filtered });
  return true;
}

export async function toggleMenuAvailabilityService(id: number, isAvailable: boolean): Promise<MenuItem> {
  await delay(200);
  return updateMenuItemService(id, { isAvailable });
}

export async function reorderMenuService(id: number, direction: "up" | "down"): Promise<MenuItem[]> {
  await delay(200);
  const state = getDummyState();
  const list = [...state.menu].sort((a, b) => a.order - b.order);
  const index = list.findIndex((m) => m.id === id);
  if (index === -1) return list;

  if (direction === "up" && index > 0) {
    const temp = list[index].order;
    list[index].order = list[index - 1].order;
    list[index - 1].order = temp;
  } else if (direction === "down" && index < list.length - 1) {
    const temp = list[index].order;
    list[index].order = list[index + 1].order;
    list[index + 1].order = temp;
  }

  saveDummyState({ ...state, menu: list });
  return [...list].sort((a, b) => a.order - b.order);
}
