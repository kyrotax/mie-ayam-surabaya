"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { SessionUser } from "@/lib/admin/types";
import { Sidebar } from "./Sidebar";

export function MobileNavDrawer({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: SessionUser;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menu panel Owner">
      <button
        type="button"
        className="absolute inset-0 bg-[#251C17]/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Tutup menu"
      />
      <div ref={drawerRef} className="relative z-10 h-full w-[276px] max-w-[86vw] shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
        <Sidebar user={user} onNavigate={onClose} canCollapse={false} />
      </div>
    </div>
  );
}
