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
        className={`relative z-10 w-full ${maxWidth} bg-white shadow-2xl h-full flex flex-col border-l border-[#D4AF37]/20 ${
          isLeft ? "mr-auto" : "ml-auto"
        } animate-in ${isLeft ? "slide-in-from-left" : "slide-in-from-right"} duration-200`}
      >
        <div className="px-6 py-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#FFF8E7]">
          <h3 className="font-heading text-lg text-[#2C1810]">{title}</h3>
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

