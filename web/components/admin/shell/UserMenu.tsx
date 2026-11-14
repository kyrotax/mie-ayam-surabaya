"use client";

import React, { useState, useRef, useEffect } from "react";
import { SessionUser } from "@/lib/admin/types";
import { RoleBadge } from "../ui/RoleBadge";
import { LogOut, ChevronDown } from "lucide-react";
import { logoutAction } from "@/app/admin/login/actions";

export function UserMenu({ user }: { user: SessionUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 rounded-xl hover:bg-black/5 transition"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-full bg-[#8D0D00] text-[#FFF4E0] border-2 border-[#CBA857] flex items-center justify-center font-bold text-xs shadow-xs">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs font-bold text-[#3B2416] leading-tight line-clamp-1">
            {user.name}
          </span>
          <RoleBadge role={user.role} />
        </div>
        <ChevronDown className="w-4 h-4 text-[#6B5240] hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#3B2416]/10 shadow-lg py-2 z-50 animate-in fade-in duration-100">
          <div className="px-4 py-2 border-b border-[#3B2416]/10 sm:hidden">
            <div className="font-bold text-xs text-[#3B2416]">{user.name}</div>
            <div className="mt-1">
              <RoleBadge role={user.role} />
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-4 py-2 text-left text-xs font-semibold text-[#B42318] hover:bg-[#FBE4E1] flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
