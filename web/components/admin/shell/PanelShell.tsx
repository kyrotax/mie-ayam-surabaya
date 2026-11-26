"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/admin/types";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PanelShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(window.localStorage.getItem("mm_sidebar_collapsed") === "true");
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("mm_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F2EFEA] font-sans text-[#251C17]">
      <div
        className={`fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 lg:block ${
          sidebarCollapsed ? "w-[72px]" : "w-[224px]"
        }`}
      >
        <Sidebar user={user} collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebar} />
      </div>

      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />

      <div
        className={`min-h-screen transition-[padding] duration-200 ${
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[224px]"
        }`}
      >
        <Topbar user={user} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1540px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 xl:px-10 xl:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
