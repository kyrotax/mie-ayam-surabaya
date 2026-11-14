"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MenuItem, MenuCategoryType, Role } from "@/lib/admin/types";
import {
  getMenuListService,
  createMenuItemService,
  updateMenuItemService,
  deleteMenuItemService,
  toggleMenuAvailabilityService,
  reorderMenuService,
} from "@/lib/admin/services/menu-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Drawer } from "@/components/admin/ui/Drawer";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { InputField, TextareaField, SelectField, SwitchField, TagInputField } from "@/components/admin/ui/Field";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  UtensilsCrossed,
  Tag,
} from "lucide-react";

export default function AdminMenuPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<MenuCategoryType>("Mie Ayam");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState<number>(20000);
  const [formAvailable, setFormAvailable] = useState(true);
  const [formAliases, setFormAliases] = useState<string[]>([]);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Dialog Hapus
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMenuListService();
        setMenuList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const openCreateDrawer = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Mie Ayam");
    setFormDescription("");
    setFormPrice(20000);
    setFormAvailable(true);
    setFormAliases([]);
    setFormImageUrl("/images/menu/mie-ayam.png");
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description || "");
    setFormPrice(item.price);
    setFormAvailable(item.isAvailable);
    setFormAliases(item.aliases || []);
    setFormImageUrl(item.imageUrl || "");
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const nextVal = !item.isAvailable;
      await toggleMenuAvailabilityService(item.id, nextVal);
      setMenuList((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, isAvailable: nextVal } : m))
      );
      sukses(`Status menu "${item.name}" diubah: ${nextVal ? "Tersedia" : "Habis"}`);
    } catch {
      bahaya("Gagal mengubah ketersediaan.");
    }
  };

  const handleReorder = async (id: number, direction: "up" | "down") => {
    try {
      const reordered = await reorderMenuService(id, direction);
      setMenuList(reordered);
    } catch {
      bahaya("Gagal mengubah urutan.");
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Nama menu wajib diisi.");
      return;
    }
    if (formPrice < 0) {
      setFormError("Harga tidak boleh negatif.");
      return;
    }

    // Validasi alias tidak boleh dobel dengan menu lain
    for (const alias of formAliases) {
      const conflicting = menuList.find(
        (m) =>
          m.id !== editingItem?.id &&
          m.aliases.some((a) => a.toLowerCase() === alias.toLowerCase())
      );
      if (conflicting) {
        setFormError(
          `Alias "${alias}" sudah digunakan oleh menu "${conflicting.name}". Gunakan singkatan lain.`
        );
        return;
      }
    }

    try {
      if (editingItem) {
        const updated = await updateMenuItemService(editingItem.id, {
          name: formName,
          category: formCategory,
          description: formDescription,
          price: formPrice,
          isAvailable: formAvailable,
          aliases: formAliases,
          imageUrl: formImageUrl,
        });
        setMenuList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        sukses(`Menu "${updated.name}" berhasil diperbarui.`);
      } else {
        const created = await createMenuItemService({
          name: formName,
          category: formCategory,
          description: formDescription,
          price: formPrice,
          isAvailable: formAvailable,
          aliases: formAliases,
          imageUrl: formImageUrl || "/images/fotomie.png",
        });
        setMenuList((prev) => [...prev, created]);
        sukses(`Menu "${created.name}" berhasil ditambahkan.`);
      }
      setIsDrawerOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Gagal menyimpan menu.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMenuItemService(deleteTarget.id);
      setMenuList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      sukses(`Menu "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    } catch {
      bahaya("Gagal menghapus menu.");
    }
  };

  const filteredMenu = menuList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Menu & Harga"
        description="Kelola item sajian makanan, minuman, harga, stok habis/tersedia, dan alias catatan AI."
        action={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white font-semibold text-xs transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Baru</span>
          </button>
        }
      />

      {/* Filter & Pencarian */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5240]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau alias (mis. ma)..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#3B2416]/20 text-xs text-[#1C1917] placeholder:text-[#6B5240]/40 focus:outline-none focus:ring-2 focus:ring-[#8D0D00]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["Semua", "Mie Ayam", "Topping/Tambahan", "Minuman"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-[#8D0D00] text-white"
                  : "bg-[#FAF8F5] text-[#3B2416] hover:bg-[#F6E4C4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Menu Desktop & Kartu Mobile */}
      <div className="overflow-hidden rounded-2xl border border-[#3B2416]/10 bg-white shadow-xs">
        <table className="w-full text-left text-sm hidden md:table">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#3B2416]/10 text-xs font-bold uppercase text-[#3B2416]">
              <th className="py-3 px-4 w-12 text-center">Urutan</th>
              <th className="py-3 px-4">Menu & Foto</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Tersedia</th>
              <th className="py-3 px-4">Alias AI</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3B2416]/10">
            {filteredMenu.map((item, idx) => (
              <tr key={item.id} className="hover:bg-[#FAF8F5]/60 transition">
                <td className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleReorder(item.id, "up")}
                      className="p-1 rounded hover:bg-black/5 disabled:opacity-20"
                      aria-label="Geser ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === filteredMenu.length - 1}
                      onClick={() => handleReorder(item.id, "down")}
                      className="p-1 rounded hover:bg-black/5 disabled:opacity-20"
                      aria-label="Geser ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-[#3B2416]/10">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 m-auto text-[#6B5240]/40" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#3B2416]">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-[#6B5240] line-clamp-1 max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs font-semibold text-[#6B5240]">
                  {item.category}
                </td>
                <td className="py-3 px-4 text-xs font-bold text-[#8D0D00]">
                  Rp {item.price.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(item)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      item.isAvailable
                        ? "bg-[#E4F2E5] text-[#276B2B]"
                        : "bg-[#FBE4E1] text-[#B42318]"
                    }`}
                  >
                    {item.isAvailable ? "Tersedia" : "Habis"}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.aliases.map((a) => (
                      <span
                        key={a}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8D0D00] border border-[#CBA857]/30 font-semibold"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditDrawer(item)}
                      className="p-1.5 rounded-lg text-[#6B5240] hover:text-[#3B2416] hover:bg-[#FAF8F5] transition"
                      title="Ubah menu"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-[#B42318] hover:bg-[#FBE4E1] transition"
                      title="Hapus menu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#3B2416]/10">
          {filteredMenu.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-[#3B2416]/10">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <UtensilsCrossed className="w-6 h-6 m-auto text-[#6B5240]/40" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[#3B2416]">{item.name}</div>
                  <div className="text-xs font-bold text-[#8D0D00]">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[11px] text-[#6B5240]">{item.category}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleAvailable(item)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.isAvailable
                      ? "bg-[#E4F2E5] text-[#276B2B]"
                      : "bg-[#FBE4E1] text-[#B42318]"
                  }`}
                >
                  {item.isAvailable ? "Ada" : "Habis"}
                </button>
              </div>

              {item.aliases.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.aliases.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8D0D00] border border-[#CBA857]/30"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#3B2416]/5">
                <button
                  type="button"
                  onClick={() => openEditDrawer(item)}
                  className="px-3 py-1.5 rounded-lg border border-[#3B2416]/15 text-xs font-semibold text-[#3B2416]"
                >
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="px-3 py-1.5 rounded-lg bg-[#FBE4E1] text-[#B42318] text-xs font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer Tambah / Ubah Menu */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "Ubah Menu" : "Tambah Menu Baru"}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-[#FBE4E1] border border-[#F4BEB7] text-[#B42318] text-xs font-semibold">
              {formError}
            </div>
          )}

          <InputField
            label="Nama Menu"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="mis. Mie Ayam Original"
          />

          <SelectField
            label="Kategori"
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value as MenuCategoryType)}
          >
            <option value="Mie Ayam">Mie Ayam</option>
            <option value="Topping/Tambahan">Topping/Tambahan</option>
            <option value="Minuman">Minuman</option>
          </SelectField>

          <InputField
            label="Harga (Rupiah)"
            type="number"
            min={0}
            required
            value={formPrice}
            onChange={(e) => setFormPrice(Number(e.target.value))}
            placeholder="20000"
          />

          <TextareaField
            label="Deskripsi Sajian"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Deskripsi singkat rasa dan topping..."
          />

          <InputField
            label="URL Foto Menu"
            value={formImageUrl}
            onChange={(e) => setFormImageUrl(e.target.value)}
            placeholder="/images/menu/mie-ayam.png"
            helperText="Gunakan path gambar publik lokal"
          />

          <SwitchField
            checked={formAvailable}
            onChange={setFormAvailable}
            label="Status Ketersediaan"
            description="Jika dimatikan, menu akan ditandai HABIS"
          />

          <TagInputField
            tags={formAliases}
            onChange={setFormAliases}
            label="Alias / Singkatan AI"
            helperText="Dipakai AI untuk mengenali tulisan di catatan, mis. 'MA' untuk Mie Ayam."
          />

          <div className="pt-4 border-t border-[#3B2416]/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#3B2416]/20 text-xs font-semibold text-[#3B2416]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold transition"
            >
              Simpan Menu
            </button>
          </div>
        </form>
      </Drawer>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Menu?"
        message={`Apakah Anda yakin ingin menghapus menu "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Menu"
        isDanger={true}
      />
    </div>
  );
}
