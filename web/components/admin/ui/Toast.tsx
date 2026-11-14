"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "sukses" | "peringatan" | "bahaya" | "netral";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  sukses: (message: string) => void;
  peringatan: (message: string) => void;
  bahaya: (message: string) => void;
  netral: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  sukses: () => {},
  peringatan: () => {},
  bahaya: () => {},
  netral: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "netral") => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toast: addToast,
        sukses: (msg) => addToast(msg, "sukses"),
        peringatan: (msg) => addToast(msg, "peringatan"),
        bahaya: (msg) => addToast(msg, "bahaya"),
        netral: (msg) => addToast(msg, "netral"),
      }}
    >
      {children}
      {/* Toast container */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:bottom-6 sm:translate-x-0 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((t) => {
          let bgClass = "bg-[#F6E4C4] text-[#6B5240] border-[#E5D2AF]";
          let Icon = Info;
          if (t.type === "sukses") {
            bgClass = "bg-[#E4F2E5] text-[#276B2B] border-[#C2E4C4]";
            Icon = CheckCircle2;
          } else if (t.type === "peringatan") {
            bgClass = "bg-[#FBEBC8] text-[#8A5A00] border-[#E8D19F]";
            Icon = AlertTriangle;
          } else if (t.type === "bahaya") {
            bgClass = "bg-[#FBE4E1] text-[#B42318] border-[#F4BEB7]";
            Icon = AlertCircle;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm font-medium transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${bgClass}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">{t.message}</div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="opacity-70 hover:opacity-100 p-0.5 rounded transition"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
