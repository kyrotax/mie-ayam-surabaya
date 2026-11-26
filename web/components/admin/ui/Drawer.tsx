"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  maxWidth = "max-w-md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right";
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

  const isLeft = position === "left";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex transition-opacity animate-in fade-in duration-150"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 flex h-full w-full ${maxWidth} flex-col border-l border-[#D8D1C9] bg-white shadow-[0_24px_80px_rgba(37,28,23,0.22)] ${
          isLeft ? "mr-auto" : "ml-auto"
        } animate-in ${isLeft ? "slide-in-from-left" : "slide-in-from-right"} duration-200`}
      >
        <div className="flex items-center justify-between border-b border-[#E7E1DA] bg-[#FAF9F7] px-6 py-4">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[#251C17]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B4423] hover:text-[#2C1810] hover:bg-white transition"
            aria-label="Tutup panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

