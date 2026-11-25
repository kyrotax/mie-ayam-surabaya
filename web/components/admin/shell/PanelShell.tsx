"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/admin/types";
import { supabase } from "@/src/supabaseClient";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PanelShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Protect private pages with supabase.auth.getSession() — if no session, redirect to /login
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
          return;
        }
        setIsCheckingAuth(false);
      } catch {
        window.location.href = "/login";
      }
    }

    checkAuthSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          window.location.href = "/login";
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2EFEA] text-[#251C17]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#7B1007] border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-[#6E6259]">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EFEA] text-[#251C17]">
      <div
        className={`fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 lg:block ${
          sidebarCollapsed ? "w-[72px]" : "w-[224px]"
        }`}
      >
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
        />
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
        <main className="mx-auto w-full max-w-[1540px] px-4 pb-12 pt-3 sm:px-6 sm:pt-4 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
