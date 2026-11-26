"use client";

import React, { useState, useEffect } from "react";
import { StoreClosure, StoreStatus } from "@/lib/admin/types";
import {
  getStoreClosuresService,
  getStoreStatusService,
  updateStoreClosuresService,
  updateStoreStatusService,
} from "@/lib/admin/services/status-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { WhatsAppPreview } from "@/components/admin/features/WhatsAppPreview";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { CalendarDays, ChevronLeft, ChevronRight, Store, Trash2 } from "lucide-react";

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const monthCells = (month: Date) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const count = new Date(year, monthIndex + 1, 0).getDate();
  return [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: count }, (_, index) => new Date(year, monthIndex, index + 1)),
  ];
};

export default function AdminTokoPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [closures, setClosures] = useState<StoreClosure[]>([]);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [closureReason, setClosureReason] = useState("Libur rutin");

  // Dialog Tutup
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeReasonCategory, setCloseReasonCategory] = useState("Bahan habis");
  const [customReason, setCustomReason] = useState("");
  const [estimatedReopen, setEstimatedReopen] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [sData, closureData] = await Promise.all([
          getStoreStatusService(),
          getStoreClosuresService(),
        ]);
        setStatus(sData);
        setClosures(closureData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleOpen = async () => {
    if (!status) return;
    if (status.isOpen) {
      // Buka modal untuk isi alasan tutup
      setIsCloseModalOpen(true);
    } else {
      // Langsung buka kembali
      try {
        const updated = await updateStoreStatusService(
          {
            isOpen: true,
            statusNote: "Warung sedang buka. Melayani pesanan Anda.",
            nextOpenText: "Buka setiap hari pukul 09.00 - 21.00 WIB",
            overrideReason: undefined,
          },
          "Admin",
          "Buka Warung Kembali"
        );
        setStatus(updated);
        sukses("Warung berhasil dibuka kembali.");
      } catch {
        bahaya("Gagal memperbarui status.");
      }
    }
  };

  const handleConfirmClose = async () => {
    const finalReason = closeReasonCategory === "Lainnya" ? customReason : closeReasonCategory;
    try {
      const updated = await updateStoreStatusService(
        {
          isOpen: false,
          overrideReason: finalReason,
          statusNote: `Warung sedang tutup sementara (${finalReason}).`,
          nextOpenText: estimatedReopen ? `Estimasi buka: ${estimatedReopen}` : "Buka kembali besok pukul 09.00 WIB",
        },
        "Admin",
        `Tutup Warung: ${finalReason}`
      );
      setStatus(updated);
      setIsCloseModalOpen(false);
      sukses("Status warung berhasil diubah ke TUTUP.");
    } catch {
      bahaya("Gagal menutup warung.");
    }
  };

  const openClosureEditor = (date: Date) => {
    const dateKey = toDateKey(date);
    const existing = closures.find((item) => item.date === dateKey);
    setSelectedDate(dateKey);
    setClosureReason(existing?.reason || "Libur rutin");
  };

  const saveClosure = async () => {
    if (!selectedDate || !closureReason.trim()) return;
    const next = [
      ...closures.filter((item) => item.date !== selectedDate),
      { date: selectedDate, reason: closureReason.trim() },
    ].sort((a, b) => a.date.localeCompare(b.date));
    await updateStoreClosuresService(next);
    setClosures(next);
    setStatus(await getStoreStatusService());
    sukses("Tanggal tutup berhasil disimpan.");
  };

  const removeClosure = async () => {
    if (!selectedDate) return;
    const next = closures.filter((item) => item.date !== selectedDate);
    await updateStoreClosuresService(next);
    setClosures(next);
    setStatus(await getStoreStatusService());
    setClosureReason("Libur rutin");
    sukses("Tanggal kembali mengikuti jadwal buka biasa.");
  };

  if (isLoading || !status) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const generatedAutoReply = `Halo! Terima kasih telah menghubungi Mie Ayam Surabaya.\nSaat ini warung kami sedang tutup (${
    status.overrideReason || "Luar jam kerja"
  }).\n${status.nextOpenText || "Buka kembali pukul 09.00 WIB."}`;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Toko dan jadwal"
        description="Atur status warung yang tampil di situs dan pesan otomatis saat warung tutup."
      />

      <section className="grid overflow-hidden rounded-[18px] border border-[#D8D1C9] bg-white lg:grid-cols-[1.45fr_.75fr]" aria-labelledby="status-toko-title">
        <div className="bg-[#8D0D00] p-6 text-white sm:p-8 lg:p-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5D28B]">
            <Store className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Status warung saat ini
          </div>
          <h2 id="status-toko-title" className="mt-7 text-[clamp(3.5rem,8vw,6.5rem)] font-semibold uppercase leading-[.85] tracking-[-0.055em]">
            {status.isOpen ? "Buka" : "Tutup"}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-6 text-[#FFF5EE] sm:text-base">{status.statusNote}</p>
          <p className="mt-2 text-xs font-medium text-[#F5D28B]">{status.nextOpenText}</p>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold text-[#251C17]">Ubah status operasional</p>
            <p className="mt-2 text-xs leading-5 text-[#71645B]">
              Perubahan langsung dipakai oleh situs dan balasan WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleOpen}
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-[11px] px-4 text-sm font-semibold transition-colors ${
              status.isOpen
                ? "border border-[#D9B0A8] bg-white text-[#8D0D00] hover:bg-[#F8E8E4]"
                : "bg-[#8D0D00] text-white hover:bg-[#6B0A00]"
            }`}
          >
            {status.isOpen ? "Tutup warung sementara" : "Buka warung kembali"}
          </button>
        </div>
      </section>

      <section className="grid overflow-hidden rounded-[16px] border border-[#DED8D1] bg-white lg:grid-cols-[1.35fr_.65fr]" aria-labelledby="calendar-title">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#8D0D00]" strokeWidth={1.8} aria-hidden="true" />
                <h2 id="calendar-title" className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">
                  Kalender operasional
                </h2>
              </div>
              <p className="mt-1 text-xs leading-5 text-[#71645B]">
                Pilih tanggal ketika warung libur atau tidak menerima pesanan.
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#CFC7BF] text-[#51463E] hover:border-[#8D0D00] hover:text-[#8D0D00]"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="min-w-36 text-center text-sm font-semibold text-[#251C17]">
                {visibleMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </p>
              <button
                type="button"
                onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#CFC7BF] text-[#51463E] hover:border-[#8D0D00] hover:text-[#8D0D00]"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
              <div key={day} className="py-2 text-[11px] font-semibold text-[#71645B]">{day}</div>
            ))}
            {monthCells(visibleMonth).map((date, index) => {
              if (!date) return <div key={`empty-${index}`} aria-hidden="true" />;
              const dateKey = toDateKey(date);
              const closure = closures.find((item) => item.date === dateKey);
              const isSelected = selectedDate === dateKey;
              const isToday = dateKey === toDateKey(new Date());
              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => openClosureEditor(date)}
                  aria-pressed={isSelected}
                  aria-label={`${date.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}${closure ? `, tutup: ${closure.reason}` : ", buka seperti biasa"}`}
                  className={`relative flex min-h-12 flex-col items-center justify-center rounded-[9px] border text-sm font-semibold transition-colors sm:min-h-14 ${
                    closure
                      ? "border-[#8D0D00] bg-[#8D0D00] text-white"
                      : isSelected
                      ? "border-[#8D0D00] bg-[#F8E8E4] text-[#8D0D00]"
                      : "border-transparent text-[#3F352E] hover:border-[#D9B0A8] hover:bg-[#FAF7F3]"
                  }`}
                >
                  {date.getDate()}
                  {isToday && <span className={`mt-1 h-1 w-1 rounded-full ${closure ? "bg-white" : "bg-[#8D0D00]"}`} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-[#71645B]">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-[#8D0D00]" />Tutup terjadwal</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] border border-[#D9B0A8] bg-[#F8E8E4]" />Tanggal dipilih</span>
          </div>
        </div>

        <div className="border-t border-[#E7E1DA] bg-[#FAF8F5] p-5 sm:p-6 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-semibold text-[#251C17]">Atur tanggal tutup</h3>
          {selectedDate ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[11px] text-[#71645B]">Tanggal dipilih</p>
                <p className="mt-1 text-base font-semibold text-[#251C17]">
                  {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("id-ID", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <label htmlFor="closure-reason" className="mb-1.5 block text-xs font-semibold text-[#3F352E]">
                  Alasan tutup
                </label>
                <input
                  id="closure-reason"
                  value={closureReason}
                  onChange={(event) => setClosureReason(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-[#CFC7BF] bg-white px-3 text-sm text-[#251C17] focus:border-[#8D0D00] focus:outline-none focus:ring-2 focus:ring-[#8D0D00]/15"
                  placeholder="Contoh: libur rutin atau acara keluarga"
                />
              </div>
              <button
                type="button"
                onClick={saveClosure}
                disabled={!closureReason.trim()}
                className="min-h-11 w-full rounded-[10px] bg-[#8D0D00] px-4 text-sm font-semibold text-white hover:bg-[#6B0A00] disabled:cursor-not-allowed disabled:bg-[#BDAFA4]"
              >
                Simpan tanggal tutup
              </button>
              {closures.some((item) => item.date === selectedDate) && (
                <button
                  type="button"
                  onClick={removeClosure}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[#D9B0A8] bg-white px-4 text-sm font-semibold text-[#8D0D00] hover:bg-[#F8E8E4]"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Hapus jadwal tutup
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-[12px] border border-dashed border-[#CFC7BF] bg-white p-5 text-sm leading-6 text-[#71645B]">
              Pilih satu tanggal pada kalender. Tanggal yang tidak ditandai tetap mengikuti jam operasional biasa.
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[.85fr_1.15fr]">
        {/* Status Publik Saat Ini */}
        <div className="space-y-5 rounded-[16px] border border-[#DED8D1] bg-white p-6">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Tampilan di situs</h3>
            <p className="mt-1 text-xs leading-5 text-[#71645B]">
              Pengunjung melihat status ini sebelum membuka menu atau menghubungi warung.
            </p>
          </div>

          <div className="rounded-[12px] border border-[#E7E1DA] bg-[#F7F4F0] p-4 text-xs text-[#71645B]">
            <div className="mb-3 font-semibold text-[#3F352E]">Status yang sedang tayang</div>
            <div className="flex flex-col items-start gap-3">
              <span
                className={`inline-flex min-h-8 items-center gap-2 rounded-[9px] px-3 text-xs font-semibold ${
                  status.isOpen ? "bg-[#E4F2E5] text-[#276B2B]" : "bg-[#FBE4E1] text-[#B42318]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                {status.isOpen ? "Warung buka" : "Warung tutup"}
              </span>
              <span className="leading-5">{status.statusNote}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-[#DED8D1] bg-white p-5 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">
              Balasan WhatsApp saat tutup
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#71645B]">Pesan ini dikirim ketika pelanggan menghubungi warung di luar waktu operasional.</p>
          </div>
          <WhatsAppPreview message={generatedAutoReply} />
        </div>
      </div>

      {/* Modal Tutup Warung Sementara */}
      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        title="Tutup Warung Sementara"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#3F352E]">
              Alasan penutupan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Bahan habis", "Libur", "Acara pribadi", "Lainnya"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCloseReasonCategory(cat)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    closeReasonCategory === cat
                      ? "bg-[#8B0000] text-white border-[#8B0000]"
                      : "bg-[#FAF7F2] border-[#2C1810]/15 text-[#2C1810] hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {closeReasonCategory === "Lainnya" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#3F352E]">
                Tulis alasan spesifik
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="mis. Renovasi dapur, cuaca buruk"
                className="h-11 w-full rounded-[10px] border border-[#CFC7BF] bg-white px-3 text-sm text-[#251C17] focus:border-[#8D0D00] focus:outline-none focus:ring-2 focus:ring-[#8D0D00]/15"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3F352E]">
              Estimasi buka kembali (opsional)
            </label>
            <input
              type="text"
              value={estimatedReopen}
              onChange={(e) => setEstimatedReopen(e.target.value)}
              placeholder="mis. Besok pukul 10.00 WIB atau Pukul 17.00 WIB"
              className="h-11 w-full rounded-[10px] border border-[#CFC7BF] bg-white px-3 text-sm text-[#251C17] focus:border-[#8D0D00] focus:outline-none focus:ring-2 focus:ring-[#8D0D00]/15"
            />
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#2C1810]/20 text-xs font-medium text-[#2C1810] hover:bg-[#FAF7F2]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmClose}
              className="px-5 py-2 rounded-xl bg-[#C41E3A] hover:bg-[#8B0000] text-white text-xs font-semibold transition"
            >
              Konfirmasi Tutup Warung
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
