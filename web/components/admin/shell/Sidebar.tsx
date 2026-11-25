"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/admin/types";
import {
  LayoutDashboard,
  Store,
  FileText,
  UtensilsCrossed,
  MessageSquare,
  Camera,
  ClipboardList,
  BarChart3,
  Users,
  LogOut,
  RotateCcw,
} from "lucide-react";
import { logoutAction } from "@/app/admin/login/actions";
import { useToast } from "../ui/Toast";
import { resetDummyState } from "@/lib/admin/mock/store";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  ownerOnly?: boolean;
}

export function Sidebar({
  user,
  onNavigate,
}: {
  user: SessionUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { sukses } = useToast();

  const groups: NavGroup[] = [
    {
      title: "Ringkasan",
      items: [
        { href: "/admin", label: "Ringkasan Dasbor", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: "Profil & Toko",
      items: [
        { href: "/admin/toko", label: "Status Toko & Jadwal", icon: Store },
        { href: "/admin/konten", label: "Konten Situs", icon: FileText },
        { href: "/admin/menu", label: "Menu & Harga", icon: UtensilsCrossed },
        { href: "/admin/chatbot", label: "Chatbot & FAQ", icon: MessageSquare },
      ],
    },
    {
      title: "Pesanan & AI",
      items: [
        { href: "/admin/pesanan/baru", label: "Input Pesanan (Foto)", icon: Camera },
        { href: "/admin/pesanan", label: "Riwayat Pesanan", icon: ClipboardList, exact: true },
        { href: "/admin/laporan", label: "Laporan & Analitik", icon: BarChart3 },
      ],
    },
    {
      title: "Pengaturan",
      ownerOnly: true,
      items: [{ href: "/admin/akun", label: "Kelola Pengguna", icon: Users }],
    },
  ];

  const handleResetData = () => {
    if (confirm("Reset seluruh data dummy ke kondisi awal bawaan?")) {
      resetDummyState();
      sukses("Data dummy berhasil di-reset.");
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 bg-[#8B0000] text-[#FFF8E7] flex flex-col h-full select-none shadow-xl border-r border-[#6B0000]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#6B0000] flex items-center gap-3 bg-[#7A0000]">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] relative shrink-0 shadow-sm">
          <Image
            src="/images/logo-umkm.jpg"
            alt="Logo Mie Ayam"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-heading font-bold text-lg tracking-wider text-[#FFD700] leading-tight">
            Mie Ayam Surabaya
          </div>
          <div className="text-[11px] text-[#FFF8E7]/80 font-subheading font-medium tracking-wide">
            Panel Pengelola
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {groups.map((group) => {
          if (group.ownerOnly && user.role !== "owner") return null;

          return (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#FFD700]/90 font-subheading">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                        isActive
                          ? "bg-[#6B0000] text-white font-bold border-l-4 border-[#D4AF37] shadow-sm"
                          : "text-[#FFF8E7]/85 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Reset Data Button (Owner Only) */}
        {user.role === "owner" && (
          <div className="pt-2 px-1">
            <button
              type="button"
              onClick={handleResetData}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#FFD700] hover:bg-[#6B0000] transition"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Reset Data Dummy</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer User Info */}
      <div className="p-3.5 border-t border-[#6B0000] bg-[#6B0000]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#2C1810] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            {user.name[0]}
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-[#FFD700] capitalize font-medium">{user.role}</div>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="p-1.5 rounded-lg text-[#FFF8E7]/70 hover:text-white hover:bg-[#8B0000] transition"
            title="Keluar"
            aria-label="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}

