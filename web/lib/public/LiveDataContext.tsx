"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteConfig as defaultSiteConfig } from "@/data/site.config";
import { getDummyState, subscribeToStore } from "@/lib/admin/mock/store";
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
    function sync() {
      try {
        const dummy = getDummyState();
        if (!dummy) return;

        const { storeStatus, siteContent, menu } = dummy;

        // Map menu items from dummy store to public MenuItem[]
        const menuMakanan: MenuItem[] = (menu || [])
          .filter((m) => m.category === "Mie Ayam" || m.category === "Topping/Tambahan")
          .map((m) => ({
            id: String(m.id),
            nama: m.name,
            deskripsi: m.description || "",
            harga: m.price,
            foto: m.imageUrl || "/images/mie-ayam-komplit.png",
            badge: m.category === "Topping/Tambahan" ? "Topping" : m.name.toLowerCase().includes("komplit") ? "Paling Laris" : null,
            isAvailable: m.isAvailable,
            kategori: "makanan",
          }));

        const menuMinuman: MenuItem[] = (menu || [])
          .filter((m) => m.category === "Minuman")
          .map((m) => ({
            id: String(m.id),
            nama: m.name,
            deskripsi: m.description || "",
            harga: m.price,
            foto: m.imageUrl || "/images/es-teh.png",
            badge: m.name.toLowerCase().includes("teler") ? "Spesial" : null,
            isAvailable: m.isAvailable,
            kategori: "minuman",
          }));

        const sc = siteContent;
        const brandName = sc?.storeName || defaultSiteConfig.brandName;
        const tagline = sc?.tagline || defaultSiteConfig.tagline;
        const wa = sc?.whatsapp || defaultSiteConfig.kontak.wa;
        const alamat = sc?.address || defaultSiteConfig.kontak.alamat;
        const mapsLink = sc?.mapsUrl || defaultSiteConfig.kontak.mapsLink;
        const mapsEmbedUrl = sc?.mapsEmbedUrl || defaultSiteConfig.kontak.mapsEmbedUrl;
        const ig = sc?.instagram
          ? sc.instagram.replace(/https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")
          : defaultSiteConfig.sosmed.ig;
        const igUrl = sc?.instagram || defaultSiteConfig.sosmed.igUrl;

        setSiteData((prev) => ({
          ...prev,
          brandName,
          tagline,
          statusBuka: storeStatus ? storeStatus.isOpen : prev.statusBuka,
          statusBukaNote:
            storeStatus?.statusNote ||
            (storeStatus?.isOpen
              ? "Selasa - Minggu: 13.00 - Habis"
              : storeStatus?.overrideReason
              ? `Tutup sementara (${storeStatus.overrideReason})`
              : "Sedang Tutup"),
          kontak: {
            ...prev.kontak,
            wa,
            waDisplay: wa.startsWith("62")
              ? "0" + wa.slice(2).replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3")
              : wa,
            alamat,
            mapsLink,
            mapsEmbedUrl,
          },
          sosmed: {
            ...prev.sosmed,
            ig,
            igUrl,
          },
          menuMakanan: menuMakanan.length > 0 ? menuMakanan : prev.menuMakanan,
          menuMinuman: menuMinuman.length > 0 ? menuMinuman : prev.menuMinuman,
          copy: {
            ...prev.copy,
            hero: {
              ...prev.copy.hero,
              subteks: sc?.description || prev.copy.hero.subteks,
            },
            tentang: {
              ...prev.copy.tentang,
              p1: sc?.story || prev.copy.tentang.p1,
            },
          },
        }));
      } catch (err) {
        console.warn("Failed syncing live site data:", err);
      }
    }

    sync();

    const unsub = subscribeToStore(sync);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "mm_dummy_state_v1") {
        sync();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsub();
      window.removeEventListener("storage", onStorage);
    };
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
