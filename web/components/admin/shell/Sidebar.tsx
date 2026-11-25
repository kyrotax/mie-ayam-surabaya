"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Camera,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageSquare,
  RotateCcw,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import type { SessionUser } from "@/lib/admin/types";
import { resetDummyState } from "@/lib/admin/mock/store";
import { useToast } from "../ui/Toast";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

const primaryItems: NavItem[] = [
  {
    href: "/admin",
    label: "Ringkasan",
    icon: LayoutDashboard,
    match: (pathname) => pathname === "/admin",
  },
  {
    href: "/admin/pesanan",
    label: "Pesanan",
    icon: ClipboardList,
    match: (pathname) =>
      pathname.startsWith("/admin/pesanan") &&
      !pathname.startsWith("/admin/pesanan/baru"),
  },
  { href: "/admin/pesanan/baru", label: "Baca catatan foto", icon: Camera },
];

const managementItems: NavItem[] = [
  { href: "/admin/toko", label: "Toko dan jadwal", icon: Store },
  { href: "/admin/menu", label: "Menu dan harga", icon: UtensilsCrossed },
  { href: "/admin/konten", label: "Konten situs", icon: FileText },
  { href: "/admin/chatbot", label: "Pesan otomatis", icon: MessageSquare },
  { href: "/admin/laporan", label: "Laporan", icon: BarChart3 },
];

function NavigationItem({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const isActive = item.match
    ? item.match(pathname)
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={`flex min-h-10 items-center rounded-[10px] text-[13px] transition-colors ${
        collapsed ? "justify-center px-0" : "gap-2.5 px-3"
      } ${
        isActive
          ? "bg-[#8D0D00] font-semibold text-white shadow-[0_8px_20px_rgba(141,13,0,0.18)]"
          : "text-[#51463E] hover:bg-[#EEE9E3] hover:text-[#8D0D00]"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function Sidebar({
  user,
  collapsed = false,
  canCollapse = true,
  onToggleCollapsed,
  onNavigate,
}: {
  user: SessionUser;
  collapsed?: boolean;
  canCollapse?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { sukses } = useToast();

  const handleResetData = () => {
    if (!window.confirm("Kembalikan seluruh data demo ke kondisi awal?")) return;
    resetDummyState();
    sukses("Data demo sudah dikembalikan.");
    window.location.reload();
  };

  return (
    <aside className="flex h-full w-full select-none flex-col border-r border-[#DDD7D0] bg-[#FAF9F7] text-[#251C17]">
      <div className={`relative flex min-h-[68px] items-center border-b border-[#E7E1DA] ${collapsed ? "justify-center px-2" : "gap-2.5 px-3"}`}>
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[11px] border border-[#CDA35D] bg-[#FFF8ED]">
          <Image
            src="/images/logo-umkm.jpg"
            alt="Logo Mie Ayam Surabaya"
            fill
            sizes="36px"
            className="object-cover"
            priority
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold tracking-[-0.025em]">Mie Ayam Surabaya</p>
            <p className="mt-0.5 text-[11px] text-[#74675E]">Panel Owner</p>
          </div>
        )}
        {canCollapse && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="absolute -right-3 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#D8D1C9] bg-white text-[#5E5148] shadow-[0_4px_12px_rgba(46,31,21,0.1)] transition-colors hover:border-[#8D0D00] hover:text-[#8D0D00]"
            aria-label={collapsed ? "Tampilkan label navigasi" : "Sembunyikan label navigasi"}
            aria-expanded={!collapsed}
            title={collapsed ? "Buka sidebar" : "Ringkas sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <nav aria-label="Navigasi panel Owner" className="flex-1 overflow-y-auto px-2.5 py-3">
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className={`my-4 h-px bg-[#E5DFD8] ${collapsed ? "mx-1" : "mx-2.5"}`} />

        {!collapsed && <p className="px-3 pb-1.5 text-[11px] font-medium text-[#74675E]">Kelola warung</p>}
        <div className="space-y-1">
          {managementItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-[#E5DFD8] p-2.5">
        <button
          type="button"
          onClick={handleResetData}
          aria-label={collapsed ? "Kembalikan data demo" : undefined}
          title={collapsed ? "Kembalikan data demo" : undefined}
          className={`flex min-h-9 w-full items-center rounded-[10px] text-[11px] font-medium text-[#685B52] transition-colors hover:bg-[#EEE9E3] hover:text-[#8D0D00] ${
            collapsed ? "justify-center" : "gap-2.5 px-2.5"
          }`}
        >
          <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          {!collapsed && <span>Kembalikan data demo</span>}
        </button>

        <div className={`flex min-h-11 items-center rounded-[11px] bg-[#F1ECE6] ${collapsed ? "justify-center px-1" : "gap-2.5 px-2.5"}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#8D0D00] text-[11px] font-bold text-white">
            {user.name.charAt(0)}
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{user.name}</p>
              <p className="mt-0.5 text-[11px] text-[#74675E]">Owner</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
