"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloating() {
  const whatsappUrl =
    "https://wa.me/6282319195854?text=Halo%20Mie%20Ayam%20Surabaya%2C%20saya%20ingin%20bertanya%20menu%20dan%20memesan.";

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pesan via WhatsApp (buka di tab baru)"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] min-h-[44px]"
      >
        <MessageCircle className="w-5 h-5 text-white shrink-0" aria-hidden="true" />
        <span className="text-xs uppercase tracking-wider font-bold hidden sm:inline-block">
          Pesan via WhatsApp
        </span>
      </a>
    </div>
  );
}
