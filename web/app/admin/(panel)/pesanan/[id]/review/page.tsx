"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ExtractionJob,
  MenuItem,
  OrderItem,
} from "@/lib/admin/types";
import {
  getExtractionJobByIdService,
  confirmOrderFromJobService,
  createOrderService,
} from "@/lib/admin/services/order-service";
import { getMenuListService } from "@/lib/admin/services/menu-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StepperField } from "@/components/admin/ui/Field";
import { ErrorState } from "@/components/admin/ui/ErrorState";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ui/Toast";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Camera,
  FileEdit,
  Save,
} from "lucide-react";

type ReviewRow = {
  rawText: string;
  menuItemId: number | null;
  name: string;
  qty: number;
  price: number;
  note: string;
  confidence: number;
};

export default function PesananReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { sukses, bahaya } = useToast();
  const jobId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<ExtractionJob | null>(null);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [isPhotoCollapsed, setIsPhotoCollapsed] = useState(false);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const menus = await getMenuListService();
        setMenuList(menus);

        if (jobId === "manual") {
          // Manual input: mulai dengan 1 baris kosong
          setRows([
            {
              rawText: "Input Manual",
              menuItemId: menus[0]?.id || 1,
              name: menus[0]?.name || "Mie Ayam Original",
              qty: 1,
              price: menus[0]?.price || 20000,
              note: "",
              confidence: 1.0,
            },
          ]);
          setIsLoading(false);
          return;
        }

        const jobData = await getExtractionJobByIdService(jobId);
        setJob(jobData);

        if (jobData && jobData.result) {
          const mappedRows: ReviewRow[] = jobData.result.items.map((item) => {
            const matchedMenu = menus.find((m) => m.id === item.menuItemId);
            return {
              rawText: item.name,
              menuItemId: item.menuItemId,
              name: matchedMenu ? matchedMenu.name : item.name,
              qty: item.qty || 1,
              price: matchedMenu ? matchedMenu.price : 0,
              note: item.note || "",
              confidence: item.confidence,
            };
          });
          setRows(mappedRows);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [jobId]);

  const handleMenuChange = (index: number, selectedIdStr: string) => {
    const selectedId = selectedIdStr ? Number(selectedIdStr) : null;
    const matched = menuList.find((m) => m.id === selectedId);

    const next = [...rows];
    next[index] = {
      ...next[index],
      menuItemId: selectedId,
      name: matched ? matched.name : next[index].rawText,
      price: matched ? matched.price : 0,
      confidence: matched ? Math.max(next[index].confidence, 0.95) : 0.3,
    };
    setRows(next);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const next = [...rows];
    next[index] = { ...next[index], qty };
    setRows(next);
  };

  const handleNoteChange = (index: number, note: string) => {
    const next = [...rows];
    next[index] = { ...next[index], note };
    setRows(next);
  };

  const handleAddRow = () => {
    const defaultMenu = menuList[0];
    const newRow: ReviewRow = {
      rawText: "Item Tambahan",
      menuItemId: defaultMenu ? defaultMenu.id : null,
      name: defaultMenu ? defaultMenu.name : "",
      qty: 1,
      price: defaultMenu ? defaultMenu.price : 0,
      note: "",
      confidence: 1.0,
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRetranscribe = () => {
    sukses("Simulasi baca ulang catatan berhasil dijalankan.");
  };

  // Validasi: Tidak boleh ada baris dengan menuItemId === null atau qty < 1
  const invalidRowsCount = rows.filter((r) => r.menuItemId === null || r.qty < 1).length;
  const needsCheckCount = rows.filter((r) => r.confidence < 0.85 || r.menuItemId === null).length;
  const totalAmount = rows.reduce((sum, r) => sum + r.price * r.qty, 0);

  const handleSaveOrder = async () => {
    if (invalidRowsCount > 0 || rows.length === 0) {
      bahaya("Ada item yang belum dipetakan ke menu resmi toko. Silakan pilih menu.");
      return;
    }

    setIsSaving(true);
    try {
      const orderItems: OrderItem[] = rows.map((r) => ({
        menuItemId: r.menuItemId,
        name: r.name,
        qty: r.qty,
        price: r.price,
        note: r.note,
        confidence: r.confidence,
      }));

      let savedOrder;
      if (jobId === "manual") {
        savedOrder = await createOrderService({
          items: orderItems,
          total: totalAmount,
          source: "manual",
          createdBy: "Admin Kasir",
        });
      } else {
        savedOrder = await confirmOrderFromJobService(
          jobId,
          orderItems,
          totalAmount,
          "Admin Kasir",
          job?.photoUrl
        );
      }

      sukses(`Pesanan ${savedOrder.orderNumber} berhasil dikonfirmasi dan disimpan!`);
      router.push(`/admin/pesanan/${savedOrder.id}`);
    } catch {
      bahaya("Gagal menyimpan pesanan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-5 h-96 rounded-2xl" />
          <Skeleton className="lg:col-span-7 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Kasus Job Gagal
  if (job && job.status === "gagal") {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <ErrorState
          title="Ekstraksi Catatan Gagal"
          message={job.errorMessage || "Foto catatan tidak dapat terbaca oleh sistem OCR."}
        />
        <div className="flex justify-center gap-3">
          <Link
            href="/admin/pesanan/baru"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8D0D00] text-white text-xs font-semibold hover:bg-[#6B0A00]"
          >
            <Camera className="w-4 h-4" />
            <span>Foto Ulang</span>
          </Link>
          <Link
            href="/admin/pesanan/manual/review"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#3B2416]/20 bg-white text-[#3B2416] text-xs font-semibold hover:bg-[#FAF8F5]"
          >
            <FileEdit className="w-4 h-4" />
            <span>Input Manual</span>
          </Link>
        </div>
      </div>
    );
  }

  const isManual = jobId === "manual";
  const photoUrl = job?.photoUrl || "/images/dummy-catatan-01.jpg";

  return (
    <div className="space-y-6 pb-28">
      <PageHeader
        title="Review & Verifikasi Pesanan"
        description="Periksa teks catatan asli, sesuaikan jumlah porsi, dan pastikan setiap hidangan terhubung dengan benar ke menu toko."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Foto Catatan Asli (Sticky di Desktop, Collapsible di Mobile) */}
        {!isManual && (
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#3B2416]/10">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#8D0D00]" />
                  <span className="font-serif font-bold text-xs text-[#3B2416]">
                    Foto Catatan Asli
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPhotoZoom((z) => Math.min(2, z + 0.25))}
                    className="p-1 rounded hover:bg-black/5 text-[#3B2416]"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoZoom((z) => Math.max(1, z - 0.25))}
                    className="p-1 rounded hover:bg-black/5 text-[#3B2416]"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPhotoCollapsed(!isPhotoCollapsed)}
                    className="lg:hidden p-1 rounded hover:bg-black/5 text-[#3B2416]"
                    title={isPhotoCollapsed ? "Buka foto" : "Lipat foto"}
                  >
                    {isPhotoCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Viewport Foto */}
              {!isPhotoCollapsed && (
                <div className="mt-3 relative w-full h-[280px] sm:h-[380px] bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <div
                    style={{ transform: `scale(${photoZoom})` }}
                    className="relative w-full h-full transition-transform duration-150"
                  >
                    <Image
                      src={photoUrl}
                      alt="Foto catatan pesanan"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kolom Kanan / Bawah: Tabel Hasil Ekstraksi */}
        <div className={isManual ? "lg:col-span-12" : "lg:col-span-7 space-y-4"}>
          {/* Bar Ringkasan Validasi */}
          <div className="p-4 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-[#3B2416]">
                {rows.length} Baris Item Terdeteksi
              </div>
              <div className="text-[11px] text-[#6B5240]">
                {needsCheckCount > 0 ? (
                  <span className="text-[#8A5A00] font-semibold flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{needsCheckCount} item perlu diperiksa ulang</span>
                  </span>
                ) : (
                  <span className="text-[#276B2B] font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Semua item cocok dengan menu resmi</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRetranscribe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B2416]/15 hover:bg-[#FAF8F5] text-[11px] font-semibold text-[#3B2416]"
              >
                <RefreshCw className="w-3 h-3 text-[#8D0D00]" />
                <span>Tulis Ulang</span>
              </button>
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#CBA857]/40 hover:bg-[#FFF4E0] text-[11px] font-semibold text-[#8D0D00]"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Item</span>
              </button>
            </div>
          </div>

          {/* Tabel / Kartu Item */}
          <div className="space-y-3">
            {rows.map((row, idx) => {
              const isInvalid = row.menuItemId === null;
              const isWarning = row.confidence < 0.85 && !isInvalid;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition shadow-xs ${
                    isInvalid
                      ? "bg-[#FBE4E1]/40 border-[#F4BEB7]"
                      : isWarning
                      ? "bg-[#FBEBC8]/30 border-[#E8D19F]"
                      : "bg-white border-[#3B2416]/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Teks Catatan Asli */}
                    <div className="sm:w-1/3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5240] block mb-1">
                        Teks Asli Catatan
                      </span>
                      <div className="font-mono text-xs font-semibold text-[#3B2416] bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#3B2416]/10 inline-block">
                        {row.rawText}
                      </div>

                      {/* Badge Keyakinan */}
                      <div className="mt-2">
                        {row.confidence >= 0.85 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#276B2B] bg-[#E4F2E5] px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Yakin ({(row.confidence * 100).toFixed(0)}%)</span>
                          </span>
                        ) : row.confidence >= 0.6 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8A5A00] bg-[#FBEBC8] px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Cek lagi ({(row.confidence * 100).toFixed(0)}%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B42318] bg-[#FBE4E1] px-2 py-0.5 rounded-md">
                            <AlertCircle className="w-3 h-3" />
                            <span>Tidak cocok</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pemilihan Menu & Jumlah */}
                    <div className="flex-1 space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#3B2416] block mb-1">
                          Cocokkan Menu Resmi
                        </label>
                        <select
                          value={row.menuItemId ?? ""}
                          onChange={(e) => handleMenuChange(idx, e.target.value)}
                          className={`w-full h-9 px-2.5 rounded-xl border text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#8D0D00] ${
                            isInvalid ? "border-[#B42318]" : "border-[#3B2416]/20"
                          }`}
                        >
                          <option value="">-- Pilih Menu Resmi --</option>
                          {menuList.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} (Rp {m.price.toLocaleString("id-ID")})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#3B2416]">Porsi:</span>
                          <StepperField
                            value={row.qty}
                            onChange={(q) => handleQtyChange(idx, q)}
                            min={1}
                          />
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#6B5240] block">Subtotal</span>
                          <span className="font-bold text-xs text-[#8D0D00]">
                            Rp {(row.price * row.qty).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={row.note}
                          onChange={(e) => handleNoteChange(idx, e.target.value)}
                          placeholder="Catatan porsi (mis. tanpa sawi, pedas)..."
                          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#3B2416]/15 bg-white placeholder:text-[#6B5240]/40"
                        />
                      </div>
                    </div>

                    {/* Tombol Hapus Baris */}
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(idx)}
                      className="p-1.5 rounded-lg text-[#B42318] hover:bg-[#FBE4E1] transition shrink-0"
                      title="Hapus baris item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar Simpan Pesanan */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#3B2416]/15 shadow-2xl p-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-[#6B5240]">Total Estimasi Pembayaran</div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-[#8D0D00]">
              Rp {totalAmount.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSaving || invalidRowsCount > 0 || rows.length === 0}
              onClick={handleSaveOrder}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] disabled:bg-[#8D0D00]/40 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan…" : "Konfirmasi & Simpan Pesanan"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

