"use client";

import React, { useState, useEffect } from "react";
import { StoreStatus } from "@/lib/admin/types";
import {
  getStoreStatusService,
  updateStoreStatusService,
} from "@/lib/admin/services/status-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { WhatsAppPreview } from "@/components/admin/features/WhatsAppPreview";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { Store } from "lucide-react";

export default function AdminTokoPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<StoreStatus | null>(null);

  // Dialog Tutup
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeReasonCategory, setCloseReasonCategory] = useState("Bahan habis");
  const [customReason, setCustomReason] = useState("");
  const [estimatedReopen, setEstimatedReopen] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const sData = await getStoreStatusService();
        setStatus(sData);
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
        description="Atur status buka warung secara instan. Perubahan langsung terhubung ke website utama dan respon bot WhatsApp."
      />

      {/* 1. Kartu Status Utama & Saklar Besar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#2C1810]">
                {status.isOpen ? "Warung BUKA" : "Warung TUTUP"}
              </span>
              <span
                className={`w-3 h-3 rounded-full animate-ping ${
                  status.isOpen ? "bg-[#2E7D32]" : "bg-[#B42318]"
                }`}
              />
            </div>
            <p className="text-sm text-[#6B4423] mt-1 font-body">{status.statusNote}</p>
            <p className="text-xs text-[#8A5A00] font-medium mt-1 font-body">{status.nextOpenText}</p>
          </div>
        </div>

        {/* Saklar Besar (Minimal 64x36 px) */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <button
            type="button"
            onClick={handleToggleOpen}
            className={`w-20 h-11 rounded-full p-1.5 transition-colors duration-200 focus:outline-none focus:ring-3 focus:ring-[#8B0000] ${
              status.isOpen ? "bg-[#2E7D32]" : "bg-[#B42318]"
            }`}
            aria-label="Ubah status toko"
          >
            <div
              className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold text-[#2C1810] ${
                status.isOpen ? "translate-x-9" : "translate-x-0"
              }`}
            >
              {status.isOpen ? "ON" : "OFF"}
            </div>
          </button>
          <span className="text-xs text-[#6B4423]">Klik untuk ubah cepat status</span>
        </div>
      </div>

      {/* 2. Pratinjau Chatbot & Status Publik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Publik Saat Ini */}
        <div className="p-6 rounded-2xl bg-white border border-[#D4AF37]/20 shadow-xs space-y-4">
          <h3 className="font-heading text-xl text-[#2C1810]">Status di Website Publik</h3>
          <p className="text-xs text-[#6B4423] leading-relaxed">
            Status ini terhubung langsung ke hero section dan badge operasional di company profile pengunjung:
          </p>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/20 text-xs text-[#6B4423] space-y-2">
            <div className="font-semibold text-[#2C1810]">Tampilan Badge Publik:</div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
                  status.isOpen ? "bg-[#E4F2E5] text-[#276B2B]" : "bg-[#FBE4E1] text-[#B42318]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {status.isOpen ? "SEDANG BUKA" : "SEDANG TUTUP"}
              </span>
              <span className="text-xs text-[#6B4423] font-medium">{status.statusNote}</span>
            </div>
          </div>
        </div>

        {/* Pratinjau WhatsApp Balasan Saat Tutup */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg text-[#2C1810]">
              Pratinjau Auto-Reply WhatsApp
            </h3>
            <span className="text-xs text-[#8A5A00] font-semibold">Simulasi Respons Chat</span>
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
            <label className="block text-xs font-bold text-[#2C1810] mb-1.5 uppercase">
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
              <label className="block text-xs font-bold text-[#2C1810] mb-1">
                Tulis Alasan Spesifik
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="mis. Renovasi dapur, cuaca buruk"
                className="w-full h-10 px-3 rounded-xl border border-[#2C1810]/20 text-xs bg-white text-[#2C1810]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2C1810] mb-1">
              Estimasi Buka Kembali (Opsional)
            </label>
            <input
              type="text"
              value={estimatedReopen}
              onChange={(e) => setEstimatedReopen(e.target.value)}
              placeholder="mis. Besok pukul 10.00 WIB atau Pukul 17.00 WIB"
              className="w-full h-10 px-3 rounded-xl border border-[#2C1810]/20 text-xs bg-white text-[#2C1810]"
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
