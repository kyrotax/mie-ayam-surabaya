"use client";

import React, { useState, useEffect } from "react";
import { AutoReplyTemplate, Faq, ChatLog } from "@/lib/admin/types";
import {
  getAutoReplyService,
  updateAutoReplyService,
  getFaqListService,
  createFaqService,
  updateFaqService,
  deleteFaqService,
  getChatLogsService,
} from "@/lib/admin/services/chatbot-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { WhatsAppPreview } from "@/components/admin/features/WhatsAppPreview";
import { InputField, TextareaField, SwitchField } from "@/components/admin/ui/Field";
import { Modal } from "@/components/admin/ui/Modal";
import { Drawer } from "@/components/admin/ui/Drawer";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  MessageSquare,
  HelpCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  Filter,
  Info,
} from "lucide-react";

export default function AdminChatbotPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"autoreply" | "faq" | "logs">("autoreply");

  // State Auto-Reply
  const [autoReply, setAutoReply] = useState<AutoReplyTemplate | null>(null);
  const [isSavingAutoReply, setIsSavingAutoReply] = useState(false);

  // State FAQ
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [deleteFaqTarget, setDeleteFaqTarget] = useState<Faq | null>(null);

  // State Log Percakapan
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [onlyClosedFilter, setOnlyClosedFilter] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [ar, fList, lList] = await Promise.all([
          getAutoReplyService(),
          getFaqListService(),
          getChatLogsService(),
        ]);
        setAutoReply(ar);
        setFaqs(fList);
        setLogs(lList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleInsertVariable = (variable: string) => {
    if (!autoReply) return;
    setAutoReply({
      ...autoReply,
      message: autoReply.message + ` ${variable} `,
    });
  };

  const handleSaveAutoReply = async () => {
    if (!autoReply) return;
    setIsSavingAutoReply(true);
    try {
      await updateAutoReplyService(autoReply);
      sukses("Template pesan otomatis berhasil disimpan.");
    } catch {
      bahaya("Gagal menyimpan auto-reply.");
    } finally {
      setIsSavingAutoReply(false);
    }
  };

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: Faq) => {
    setEditingFaq(f);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    try {
      if (editingFaq) {
        const updated = await updateFaqService(editingFaq.id, {
          question: faqQuestion,
          answer: faqAnswer,
        });
        setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        sukses("FAQ berhasil diperbarui.");
      } else {
        const created = await createFaqService({
          question: faqQuestion,
          answer: faqAnswer,
          isActive: true,
        });
        setFaqs((prev) => [...prev, created]);
        sukses("FAQ baru berhasil ditambahkan.");
      }
      setIsFaqModalOpen(false);
    } catch {
      bahaya("Gagal menyimpan FAQ.");
    }
  };

  const handleToggleFaqActive = async (f: Faq) => {
    try {
      const nextActive = !f.isActive;
      await updateFaqService(f.id, { isActive: nextActive });
      setFaqs((prev) => prev.map((item) => (item.id === f.id ? { ...item, isActive: nextActive } : item)));
      sukses(`FAQ "${f.question.slice(0, 20)}..." diubah ke ${nextActive ? "Aktif" : "Nonaktif"}`);
    } catch {
      bahaya("Gagal mengubah status FAQ.");
    }
  };

  const handleDeleteFaq = async () => {
    if (!deleteFaqTarget) return;
    try {
      await deleteFaqService(deleteFaqTarget.id);
      setFaqs((prev) => prev.filter((f) => f.id !== deleteFaqTarget.id));
      sukses("FAQ berhasil dihapus.");
      setDeleteFaqTarget(null);
    } catch {
      bahaya("Gagal menghapus FAQ.");
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (onlyClosedFilter && l.storeStatusAtTime !== "tutup") return false;
    return true;
  });

  if (isLoading || !autoReply) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const samplePreviewText = autoReply.message
    .replace("{jam_buka_kembali}", "besok pukul 09.00 WIB")
    .replace("{alasan}", "Luar Jam Operasional");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chatbot & Asisten WhatsApp"
        description="Konfigurasi pesan balasan otomatis saat warung tutup, daftar tanya-jawab umum (FAQ), dan pantau riwayat obrolan."
      />

      <div className="p-3.5 rounded-xl bg-[#FFF4E0] border border-[#CBA857]/40 text-xs text-[#8A5A00] flex items-center gap-2">
        <Info className="w-4 h-4 shrink-0" />
        <span>
          Layanan Bot saat ini dalam simulasi dummy (belum terhubung ke WhatsApp Cloud API produksi).
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#3B2416]/10 gap-2">
        {[
          { id: "autoreply", label: "Auto-Reply Saat Tutup", icon: MessageSquare },
          { id: "faq", label: "Tanya-Jawab (FAQ)", icon: HelpCircle },
          { id: "logs", label: "Log Percakapan", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 ${
                activeTab === tab.id
                  ? "border-[#8D0D00] text-[#8D0D00]"
                  : "border-transparent text-[#6B5240] hover:text-[#3B2416]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Auto Reply */}
      {activeTab === "autoreply" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3B2416]">
              Template Pesan Balasan Otomatis
            </h3>
            <p className="text-xs text-[#6B5240]">
              Pesan ini otomatis dikirim ke pelanggan yang mengirim pesan WhatsApp ketika toko dalam status TUTUP.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3B2416] mb-1">
                Isi Pesan Template
              </label>
              <TextareaField
                rows={6}
                value={autoReply.message}
                onChange={(e) => setAutoReply({ ...autoReply, message: e.target.value })}
              />
            </div>

            {/* Tombol Sisipkan Variabel */}
            <div>
              <span className="text-[11px] font-semibold text-[#6B5240] block mb-1.5">
                Sisipkan Variabel Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleInsertVariable("{jam_buka_kembali}")}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#CBA857]/40 text-xs font-bold text-[#8D0D00] hover:bg-[#FFF4E0]"
                >
                  + {"{jam_buka_kembali}"}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVariable("{alasan}")}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#CBA857]/40 text-xs font-bold text-[#8D0D00] hover:bg-[#FFF4E0]"
                >
                  + {"{alasan}"}
                </button>
              </div>
            </div>

            <InputField
              label="Jeda Balasan per Nomor (Menit)"
              type="number"
              min={1}
              value={autoReply.cooldownMinutes}
              onChange={(e) =>
                setAutoReply({ ...autoReply, cooldownMinutes: Number(e.target.value) })
              }
              helperText="Mencegah spam jika pelanggan mengirim banyak pesan berturut-turut."
            />

            <button
              type="button"
              onClick={handleSaveAutoReply}
              disabled={isSavingAutoReply}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingAutoReply ? "Menyimpan…" : "Simpan Pengaturan"}</span>
            </button>
          </div>

          {/* Pratinjau Gelembung WhatsApp */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#3B2416]">
              Pratinjau Percakapan Langsung
            </h3>
            <WhatsAppPreview message={samplePreviewText} />
          </div>
        </div>
      )}

      {/* Tab 2: FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#6B5240]">
              Pertanyaan yang otomatis dijawab oleh chatbot jika terdeteksi kata kunci serupa.
            </p>
            <button
              type="button"
              onClick={openCreateFaq}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah FAQ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-[#3B2416] leading-snug">
                      {f.question}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        f.isActive ? "bg-[#E4F2E5] text-[#276B2B]" : "bg-[#FBE4E1] text-[#B42318]"
                      }`}
                    >
                      {f.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5240] mt-2 leading-relaxed">{f.answer}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#3B2416]/5">
                  <button
                    type="button"
                    onClick={() => handleToggleFaqActive(f)}
                    className="text-xs font-semibold text-[#8A5A00] hover:underline"
                  >
                    {f.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditFaq(f)}
                      className="p-1.5 rounded-lg text-[#6B5240] hover:text-[#3B2416] hover:bg-[#FAF8F5]"
                      title="Ubah FAQ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteFaqTarget(f)}
                      className="p-1.5 rounded-lg text-[#B42318] hover:bg-[#FBE4E1]"
                      title="Hapus FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Log Percakapan */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOnlyClosedFilter(!onlyClosedFilter)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                onlyClosedFilter
                  ? "bg-[#8D0D00] text-white border-[#8D0D00]"
                  : "bg-white text-[#3B2416] border-[#3B2416]/15 hover:bg-[#FAF8F5]"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Hanya Pesan Saat Toko Tutup ({logs.filter((l) => l.storeStatusAtTime === "tutup").length})</span>
            </button>
            <span className="text-xs text-[#6B5240]">Menampilkan {filteredLogs.length} riwayat</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#3B2416]/10 bg-white shadow-xs">
            <table className="w-full text-left text-sm hidden md:table">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#3B2416]/10 text-xs font-bold uppercase text-[#3B2416]">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Nomor Pelanggan</th>
                  <th className="py-3 px-4">Pesan Pelanggan</th>
                  <th className="py-3 px-4">Status Toko</th>
                  <th className="py-3 px-4">Respons Bot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3B2416]/10">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-[#FAF8F5] cursor-pointer transition text-xs"
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-[#6B5240]">
                      {new Date(log.timestamp).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#3B2416]">
                      {log.customerPhone}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#3B2416] max-w-xs truncate">
                      {log.customerMessage}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          log.storeStatusAtTime === "buka"
                            ? "bg-[#E4F2E5] text-[#276B2B]"
                            : "bg-[#FBE4E1] text-[#B42318]"
                        }`}
                      >
                        {log.storeStatusAtTime === "buka" ? "Buka" : "Tutup"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6B5240] max-w-xs truncate">
                      {log.botReply}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#3B2416]/10">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="p-4 space-y-2 cursor-pointer hover:bg-[#FAF8F5] text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#3B2416]">{log.customerPhone}</span>
                    <span className="text-[10px] text-[#6B5240]">
                      {new Date(log.timestamp).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="font-medium text-[#3B2416]">{log.customerMessage}</div>
                  <div className="text-[11px] text-[#6B5240] italic line-clamp-1">
                    Bot: {log.botReply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drawer Detail Percakapan Log */}
      <Drawer
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Detail Percakapan WhatsApp"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#3B2416]/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6B5240]">Nomor Pelanggan:</span>
                <span className="font-mono font-bold text-[#3B2416]">
                  {selectedLog.customerPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5240]">Waktu Kirim:</span>
                <span className="text-[#3B2416]">
                  {new Date(selectedLog.timestamp).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5240]">Kondisi Toko:</span>
                <span className="font-bold capitalize">{selectedLog.storeStatusAtTime}</span>
              </div>
            </div>

            <WhatsAppPreview
              message={selectedLog.botReply}
              time={new Date(selectedLog.timestamp).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>
        )}
      </Drawer>

      {/* Modal Tambah/Ubah FAQ */}
      <Modal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        title={editingFaq ? "Ubah Tanya-Jawab (FAQ)" : "Tambah FAQ Baru"}
      >
        <form onSubmit={handleSaveFaq} className="space-y-4">
          <InputField
            label="Pertanyaan Pelanggan"
            required
            value={faqQuestion}
            onChange={(e) => setFaqQuestion(e.target.value)}
            placeholder="mis. Apakah Mie Ayam halal?"
          />
          <TextareaField
            label="Jawaban Resmi Chatbot"
            required
            rows={4}
            value={faqAnswer}
            onChange={(e) => setFaqAnswer(e.target.value)}
            placeholder="Jawaban ramah dan jelas..."
          />
          <div className="pt-3 border-t border-[#3B2416]/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFaqModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#3B2416]/20 text-xs font-semibold text-[#3B2416]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold transition"
            >
              Simpan FAQ
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog Hapus FAQ */}
      <ConfirmDialog
        isOpen={!!deleteFaqTarget}
        onClose={() => setDeleteFaqTarget(null)}
        onConfirm={handleDeleteFaq}
        title="Hapus FAQ?"
        message={`Apakah Anda yakin ingin menghapus FAQ "${deleteFaqTarget?.question}"?`}
        confirmText="Hapus FAQ"
        isDanger={true}
      />
    </div>
  );
}

