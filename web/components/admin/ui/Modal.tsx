"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className={`w-full ${maxWidth} bg-white rounded-2xl border border-[#3B2416]/10 shadow-xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-[#3B2416]/10 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#3B2416]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B5240] hover:text-[#3B2416] hover:bg-[#FAF8F5] transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

