"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Save, Trash2 } from "lucide-react";
import { MenuItem, Order, OrderItem } from "@/lib/admin/types";
import { getMenuListService } from "@/lib/admin/services/menu-service";
import { createOrderService } from "@/lib/admin/services/order-service";
import { Modal } from "@/components/admin/ui/Modal";
import { useToast } from "@/components/admin/ui/Toast";

type DraftItem = {
  menuItemId: number | null;
  qty: number;
  note: string;
};

const emptyItem = (): DraftItem => ({ menuItemId: null, qty: 1, note: "" });

export function ManualOrderModal({
  isOpen,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (order: Order) => void;
}) {
  const { sukses, bahaya } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [items, setItems] = useState<DraftItem[]>([emptyItem()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    getMenuListService()
      .then((result) => setMenu(result.filter((item) => item.isAvailable)))
      .catch(() => bahaya("Daftar menu tidak dapat dimuat."))
      .finally(() => setIsLoading(false));
  }, [isOpen, bahaya]);

  const pricedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        menuItem: menu.find((menuItem) => menuItem.id === item.menuItemId),
      })),
    [items, menu]
  );
  const total = pricedItems.reduce(
    (sum, item) => sum + (item.menuItem?.price ?? 0) * item.qty,
    0
  );
  const canSave =
    items.length > 0 && items.every((item) => item.menuItemId !== null && item.qty > 0);

  const updateItem = (index: number, updates: Partial<DraftItem>) => {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...updates } : item))
    );
  };

  const closeAndReset = () => {
    setItems([emptyItem()]);
    onClose();
  };

  const handleSave = async () => {
    if (!canSave) {
      bahaya("Pilih menu untuk setiap baris pesanan.");
      return;
    }

    setIsSaving(true);
    try {
      const orderItems: OrderItem[] = pricedItems.map((item) => ({
        menuItemId: item.menuItem!.id,
        name: item.menuItem!.name,
        qty: item.qty,
        price: item.menuItem!.price,
        note: item.note.trim() || undefined,
        confidence: 1,
      }));
      const saved = await createOrderService({
        items: orderItems,
        total,
        source: "manual",
        createdBy: "H. Bambang (Owner)",
      });
      sukses(`Pesanan ${saved.orderNumber} berhasil disimpan.`);
      setItems([emptyItem()]);
      onSaved(saved);
      onClose();
    } catch {
      bahaya("Pesanan belum berhasil disimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAndReset}
      title="Input pesanan manual"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        <p className="max-w-2xl text-sm leading-6 text-[#71645B]">
          Pilih menu dan jumlah porsi. Pesanan yang disimpan langsung masuk ke riwayat.
        </p>

        {isLoading ? (
          <div className="rounded-[12px] border border-[#DED8D1] bg-[#FAF8F5] p-6 text-sm text-[#71645B]">
            Memuat daftar menu...
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const selected = menu.find((menuItem) => menuItem.id === item.menuItemId);
              return (
                <div key={index} className="rounded-[14px] border border-[#DED8D1] bg-[#FAF8F5] p-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
                    <div>
                      <label htmlFor={`manual-menu-${index}`} className="mb-1.5 block text-xs font-semibold text-[#3F352E]">
                        Menu
                      </label>
                      <select
                        id={`manual-menu-${index}`}
                        value={item.menuItemId ?? ""}
                        onChange={(event) =>
                          updateItem(index, {
                            menuItemId: event.target.value ? Number(event.target.value) : null,
                          })
                        }
                        className="h-11 w-full rounded-[10px] border border-[#CFC7BF] bg-white px-3 text-sm text-[#251C17] focus:border-[#8D0D00] focus:outline-none focus:ring-2 focus:ring-[#8D0D00]/15"
                      >
                        <option value="">Pilih menu</option>
                        {menu.map((menuItem) => (
                          <option key={menuItem.id} value={menuItem.id}>
                            {menuItem.name} · Rp {menuItem.price.toLocaleString("id-ID")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="mb-1.5 block text-xs font-semibold text-[#3F352E]">Porsi</span>
                      <div className="flex h-11 items-center rounded-[10px] border border-[#CFC7BF] bg-white">
                        <button
                          type="button"
                          onClick={() => updateItem(index, { qty: Math.max(1, item.qty - 1) })}
                          className="flex h-11 w-11 items-center justify-center text-[#51463E] hover:bg-[#F1ECE6]"
                          aria-label={`Kurangi porsi item ${index + 1}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateItem(index, { qty: item.qty + 1 })}
                          className="flex h-11 w-11 items-center justify-center text-[#51463E] hover:bg-[#F1ECE6]"
                          aria-label={`Tambah porsi item ${index + 1}`}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setItems((current) =>
                          current.length === 1
                            ? [emptyItem()]
                            : current.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E3BBB4] bg-white text-[#A9150A] hover:bg-[#F8E8E4]"
                      aria-label={`Hapus item ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <label htmlFor={`manual-note-${index}`} className="sr-only">Catatan item {index + 1}</label>
                      <input
                        id={`manual-note-${index}`}
                        value={item.note}
                        onChange={(event) => updateItem(index, { note: event.target.value })}
                        placeholder="Catatan, misalnya tanpa sawi"
                        className="h-10 w-full rounded-[9px] border border-[#D8D1C9] bg-white px-3 text-xs text-[#251C17] placeholder:text-[#93877E] focus:border-[#8D0D00] focus:outline-none focus:ring-2 focus:ring-[#8D0D00]/15"
                      />
                    </div>
                    <p className="text-right text-sm font-semibold text-[#8D0D00]">
                      Rp {((selected?.price ?? 0) * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setItems((current) => [...current, emptyItem()])}
          disabled={isLoading}
          className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-[#D9B0A8] bg-white px-4 text-sm font-semibold text-[#8D0D00] hover:bg-[#F8E8E4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah item
        </button>

        <div className="flex flex-col gap-4 border-t border-[#E7E1DA] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-[#71645B]">Total pesanan</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#8D0D00]">
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={closeAndReset}
              className="min-h-11 rounded-[10px] border border-[#CFC7BF] bg-white px-4 text-sm font-semibold text-[#51463E] hover:bg-[#F1ECE6]"
            >
              Kembali ke riwayat
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#8D0D00] px-5 text-sm font-semibold text-white hover:bg-[#6B0A00] disabled:cursor-not-allowed disabled:bg-[#BDAFA4]"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {isSaving ? "Menyimpan..." : "Simpan pesanan"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
