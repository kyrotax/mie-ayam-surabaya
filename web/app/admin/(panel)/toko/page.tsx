"use client";

import React, { useState, useEffect } from "react";
import { StoreStatus, StoreHour, StatusLogEntry } from "@/lib/admin/types";
import {
  getStoreStatusService,
  updateStoreStatusService,
  getStoreHoursService,
  updateStoreHoursService,
  getStatusLogsService,
} from "@/lib/admin/services/status-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { WhatsAppPreview } from "@/components/admin/features/WhatsAppPreview";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { Clock, Store, AlertCircle, Save, CheckCircle2 } from "lucide-react";

export default function AdminTokoPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [hours, setHours] = useState<StoreHour[]>([]);
  const [logs, setLogs] = useState<StatusLogEntry[]>([]);

  // Dialog Tutup
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeReasonCategory, setCloseReasonCategory] = useState("Bahan habis");
  const [customReason, setCustomReason] = useState("");
  const [estimatedReopen, setEstimatedReopen] = useState("");

  // Mode Override
  const [overrideMode, setOverrideMode] = useState<"none" | "force_open" | "force_closed">("none");

  // State Jadwal Edit
  const [isSavingHours, setIsSavingHours] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sData, hData, lData] = await Promise.all([
          getStoreStatusService(),
          getStoreHoursService(),
          getStatusLogsService(),
        ]);
        setStatus(sData);
        setOverrideMode(sData.manualOverride);
        setHours(hData);
        setLogs(lData);
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

  const handleChangeOverrideMode = async (mode: "none" | "force_open" | "force_closed") => {
    setOverrideMode(mode);
    const isOpen = mode === "force_open" ? true : mode === "force_closed" ? false : true;
    try {
      const updated = await updateStoreStatusService(
        {
          manualOverride: mode,
          isOpen,
          statusNote:
            mode === "none"
              ? "Status mengikuti jadwal otomatis."
              : mode === "force_open"
              ? "Dipaksa selalu buka oleh admin."
              : "Dipaksa tutup sementara.",
        },
        "Admin",
        `Ubah Mode: ${mode}`
      );
      setStatus(updated);
      sukses(`Mode operasional diperbarui: ${mode}`);
    } catch {
      bahaya("Gagal mengubah mode.");
    }
  };

  const handleHourChange = (index: number, field: keyof StoreHour, val: any) => {
    const next = [...hours];
    next[index] = { ...next[index], [field]: val };
    setHours(next);
  };

  const handleSaveHours = async () => {
    setIsSavingHours(true);
    try {
      await updateStoreHoursService(hours);
      sukses("Jadwal operasional berhasil disimpan.");
    } catch {
      bahaya("Gagal menyimpan jadwal.");
    } finally {
      setIsSavingHours(false);
    }
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
        title="Status Toko & Jam Operasional"
        description="Atur status buka warung secara instan, konfigurasi jadwal mingguan, dan pantau log perubahan."
      />

      {/* 1. Kartu Status Utama & Saklar Besar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#3B2416]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              status.isOpen
                ? "bg-[#E4F2E5] text-[#276B2B] border-[#C2E4C4]"
                : "bg-[#FBE4E1] text-[#B42318] border-[#F4BEB7]"
            }`}
          >
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2416]">
                {status.isOpen ? "Warung BUKA" : "Warung TUTUP"}
              </span>
              <span
                className={`w-3 h-3 rounded-full animate-ping ${
                  status.isOpen ? "bg-[#2E7D32]" : "bg-[#B42318]"
                }`}
              />
            </div>
            <p className="text-sm text-[#6B5240] mt-1">{status.statusNote}</p>
            <p className="text-xs text-[#8A5A00] font-medium mt-1">{status.nextOpenText}</p>
          </div>
        </div>

        {/* Saklar Besar (Minimal 64x36 px) */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <button
            type="button"
            onClick={handleToggleOpen}
            className={`w-20 h-11 rounded-full p-1.5 transition-colors duration-200 focus:outline-none focus:ring-3 focus:ring-[#8D0D00] ${
              status.isOpen ? "bg-[#2E7D32]" : "bg-[#B42318]"
            }`}
            aria-label="Ubah status toko"
          >
            <div
              className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold text-[#3B2416] ${
                status.isOpen ? "translate-x-9" : "translate-x-0"
              }`}
            >
              {status.isOpen ? "ON" : "OFF"}
            </div>
          </button>
          <span className="text-xs text-[#6B5240]">Klik untuk ubah cepat</span>
        </div>
      </div>

      {/* 2. Mode Kontrol Status & Pratinjau Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kontrol Segmen Override */}
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#3B2416]">Mode Kontrol Status</h3>
          <p className="text-xs text-[#6B5240]">
            Pilih bagaimana sistem menentukan apakah warung buka atau tutup:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "none", label: "Ikuti Jadwal", desc: "Otomatis sesuai jam" },
              { id: "force_open", label: "Paksa Buka", desc: "Selalu buka" },
              { id: "force_closed", label: "Paksa Tutup", desc: "Tutup sementara" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleChangeOverrideMode(m.id as any)}
                className={`p-3 rounded-xl border text-left transition ${
                  overrideMode === m.id
                    ? "bg-[#FFF4E0] border-[#8D0D00] text-[#8D0D00] font-bold shadow-xs"
                    : "bg-[#FAF8F5] border-[#3B2416]/10 text-[#3B2416] hover:bg-white"
                }`}
              >
                <div className="text-xs">{m.label}</div>
                <div className="text-[10px] font-normal text-[#6B5240] mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#3B2416]/10 text-xs text-[#6B5240] space-y-1">
            <div className="font-semibold text-[#3B2416]">Pratinjau Status Publik:</div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
                  status.isOpen ? "bg-[#E4F2E5] text-[#276B2B]" : "bg-[#FBE4E1] text-[#B42318]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {status.isOpen ? "SEDANG BUKA" : "SEDANG TUTUP"}
              </span>
              <span className="text-[11px] text-[#6B5240]">{status.statusNote}</span>
            </div>
          </div>
        </div>

        {/* Pratinjau WhatsApp Balasan Saat Tutup */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#3B2416]">
              Pratinjau Auto-Reply WhatsApp
            </h3>
            <span className="text-xs text-[#8A5A00] font-semibold">Simulasi Respons Chat</span>
          </div>
          <WhatsAppPreview message={generatedAutoReply} />
        </div>
      </div>

      {/* 3. Jadwal Operasional 7 Hari */}
      <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#3B2416]">Jadwal Mingguan Rutin</h3>
            <p className="text-xs text-[#6B5240]">
              Jam buka dan tutup reguler yang menjadi acuan mode otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveHours}
            disabled={isSavingHours}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white font-semibold text-xs transition shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingHours ? "Menyimpan…" : "Simpan Jadwal"}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#3B2416]/10 text-xs font-bold uppercase text-[#3B2416]">
                <th className="py-3 px-4">Hari</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Jam Buka</th>
                <th className="py-3 px-4">Jam Tutup</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B2416]/10">
              {hours.map((h, i) => {
                const isOvernight = h.closeTime < h.openTime && !h.isClosed;
                return (
                  <tr key={h.dayOfWeek} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="py-3 px-4 font-bold text-[#3B2416] text-xs">{h.dayName}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleHourChange(i, "isClosed", !h.isClosed)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          h.isClosed
                            ? "bg-[#FBE4E1] text-[#B42318]"
                            : "bg-[#E4F2E5] text-[#276B2B]"
                        }`}
                      >
                        {h.isClosed ? "Libur" : "Buka"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="time"
                        value={h.openTime}
                        disabled={h.isClosed}
                        onChange={(e) => handleHourChange(i, "openTime", e.target.value)}
                        className="h-9 px-2.5 rounded-lg border border-[#3B2416]/20 bg-white text-xs disabled:opacity-40"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="time"
                        value={h.closeTime}
                        disabled={h.isClosed}
                        onChange={(e) => handleHourChange(i, "closeTime", e.target.value)}
                        className="h-9 px-2.5 rounded-lg border border-[#3B2416]/20 bg-white text-xs disabled:opacity-40"
                      />
                    </td>
                    <td className="py-3 px-4 text-xs text-[#8A5A00]">
                      {isOvernight && "Melewati tengah malam"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Log Perubahan Status */}
      <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#8D0D00]" />
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#3B2416]">
            Riwayat Log Status
          </h3>
        </div>
        <div className="divide-y divide-[#3B2416]/10 max-h-64 overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between text-xs gap-4">
              <div>
                <div className="font-bold text-[#3B2416]">{log.action}</div>
                <div className="text-[11px] text-[#6B5240]">{log.actorName}</div>
                {log.note && <div className="text-[11px] text-[#8A5A00] italic">{log.note}</div>}
              </div>
              <div className="text-[10px] text-[#6B5240] shrink-0">
                {new Date(log.timestamp).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
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
            <label className="block text-xs font-bold text-[#3B2416] mb-1.5 uppercase">
              Alasan Penutupan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Bahan habis", "Libur", "Acara pribadi", "Lainnya"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCloseReasonCategory(cat)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    closeReasonCategory === cat
                      ? "bg-[#8D0D00] text-white border-[#8D0D00]"
                      : "bg-[#FAF8F5] border-[#3B2416]/15 text-[#3B2416] hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {closeReasonCategory === "Lainnya" && (
            <div>
              <label className="block text-xs font-bold text-[#3B2416] mb-1">
                Tulis Alasan Spesifik
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="mis. Renovasi dapur, cuaca buruk"
                className="w-full h-10 px-3 rounded-xl border border-[#3B2416]/20 text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#3B2416] mb-1">
              Estimasi Buka Kembali (Opsional)
            </label>
            <input
              type="text"
              value={estimatedReopen}
              onChange={(e) => setEstimatedReopen(e.target.value)}
              placeholder="mis. Besok pukul 10.00 WIB atau Pukul 17.00 WIB"
              className="w-full h-10 px-3 rounded-xl border border-[#3B2416]/20 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-[#3B2416]/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#3B2416]/20 text-xs font-medium text-[#3B2416]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmClose}
              className="px-5 py-2 rounded-xl bg-[#B42318] hover:bg-[#8D0D00] text-white text-xs font-semibold transition"
            >
              Konfirmasi Tutup Warung
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

