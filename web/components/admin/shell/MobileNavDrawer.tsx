"use client";

import React, { useEffect } from "react";
import { SessionUser } from "@/lib/admin/types";
import { Sidebar } from "./Sidebar";
import { X } from "lucide-react";

export function MobileNavDrawer({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: SessionUser;
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
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 w-9 h-9 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition"
          aria-label="Tutup navigasi"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar user={user} onNavigate={onClose} />
      </div>
    </div>
  );
}

