"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteConfig as defaultSiteConfig } from "@/data/site.config";
import { supabase } from "@/src/supabaseClient";
import { getSignedFileUrl } from "@/lib/storage";
import { SiteConfig, MenuItem } from "@/types/site";

interface LiveDataContextType {
  siteData: SiteConfig;
}

const LiveDataContext = createContext<LiveDataContextType>({
  siteData: defaultSiteConfig,
});

export function PublicLiveDataProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const [menuRes, statusRes] = await Promise.all([
          supabase.from("menu_items").select("*").order("order_index", { ascending: true }),
          supabase.from("store_status").select("*").order("id", { ascending: false }).limit(1).single(),
        ]);

        const menuRows = menuRes.data || [];
        const statusRow = statusRes.data;

        if (menuRows.length > 0) {
          const resolvedRows = await Promise.all(
            menuRows.map(async (m) => ({
              ...m,
              resolvedPhoto: m.image_url ? await getSignedFileUrl(m.image_url) : null,
            }))
          );

          const menuMakanan: MenuItem[] = resolvedRows
            .filter((m) => m.category !== "Minuman")
            .map((m) => ({
              id: String(m.id),
              nama: m.name,
              deskripsi: m.description || "",
              harga: Number(m.price),
              foto: m.resolvedPhoto || "/images/mie-ayam-komplit.png",
              badge: m.name.toLowerCase().includes("komplit") ? "Paling Laris" : null,
              isAvailable: Boolean(m.is_available),
              kategori: "makanan",
            }));

          const menuMinuman: MenuItem[] = resolvedRows
            .filter((m) => m.category === "Minuman")
            .map((m) => ({
              id: String(m.id),
              nama: m.name,
              deskripsi: m.description || "",
              harga: Number(m.price),
              foto: m.resolvedPhoto || "/images/es-teh.png",
              badge: m.name.toLowerCase().includes("teler") ? "Spesial" : null,
              isAvailable: Boolean(m.is_available),
              kategori: "minuman",
            }));

          setSiteData((prev) => ({
            ...prev,
            statusBuka: statusRow ? Boolean(statusRow.is_open) : prev.statusBuka,
            statusBukaNote:
              statusRow?.status_note ||
              (statusRow?.is_open
                ? "Selasa - Minggu: 13.00 - Habis"
                : "Sedang Tutup"),
            menuMakanan: menuMakanan.length > 0 ? menuMakanan : prev.menuMakanan,
            menuMinuman: menuMinuman.length > 0 ? menuMinuman : prev.menuMinuman,
          }));
        } else if (statusRow) {
          setSiteData((prev) => ({
            ...prev,
            statusBuka: Boolean(statusRow.is_open),
            statusBukaNote: statusRow.status_note || (statusRow.is_open ? "Buka" : "Tutup"),
          }));
        }
      } catch (err) {
        console.warn("Failed syncing Supabase live site data:", err);
      }
    }

    fetchFromSupabase();
  }, []);

  return (
    <LiveDataContext.Provider value={{ siteData }}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  return useContext(LiveDataContext);
}
