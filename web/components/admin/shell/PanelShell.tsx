"use client";

import React, { useState } from "react";
import { SessionUser } from "@/lib/admin/types";
import { DemoBanner } from "./DemoBanner";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNavDrawer } from "./MobileNavDrawer";

export function PanelShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* Banner Demo Permanen */}
      <DemoBanner />

      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block shrink-0">
          <div className="fixed top-0 bottom-0 left-0 w-64 z-40">
            <Sidebar user={user} />
          </div>
        </div>

        {/* Drawer Mobile */}
        <MobileNavDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          user={user}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Topbar
            user={user}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
