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
        className={`relative z-10 w-full ${maxWidth} bg-white shadow-2xl h-full flex flex-col border-l border-[#3B2416]/10 ${
          isLeft ? "mr-auto" : "ml-auto"
        } animate-in ${isLeft ? "slide-in-from-left" : "slide-in-from-right"} duration-200`}
      >
        <div className="px-6 py-4 border-b border-[#3B2416]/10 flex items-center justify-between bg-[#FAF8F5]">
          <h3 className="font-serif text-lg font-bold text-[#3B2416]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B5240] hover:text-[#3B2416] hover:bg-white transition"
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
