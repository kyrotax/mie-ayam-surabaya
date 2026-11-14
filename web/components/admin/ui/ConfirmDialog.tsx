"use client";

import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus",
  cancelText = "Batal",
  isDanger = true,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
            isDanger ? "bg-[#FBE4E1] text-[#B42318]" : "bg-[#FBEBC8] text-[#8A5A00]"
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-[#3B2416]">{title}</h3>
          <div className="text-sm text-[#6B5240] mt-1.5 leading-relaxed">{message}</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#3B2416]/10">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl border border-[#3B2416]/20 text-[#3B2416] font-medium text-sm hover:bg-[#FAF8F5] transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-5 py-2 rounded-xl text-white font-medium text-sm transition ${
            isDanger ? "bg-[#B42318] hover:bg-[#8D0D00]" : "bg-[#8D0D00] hover:bg-[#6B0A00]"
          }`}
        >
          {isLoading ? "Memproses…" : confirmText}
        </button>
      </div>
    </Modal>
  );
}
