"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SiteContent, GalleryItem, Testimonial } from "@/lib/admin/types";
import { getSiteContentService, updateSiteContentService } from "@/lib/admin/services/content-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { InputField, TextareaField } from "@/components/admin/ui/Field";
import { useToast } from "@/components/admin/ui/Toast";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import {
  Save,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle2,
  Home,
  BookOpen,
  MapPin,
  Globe,
} from "lucide-react";
import { z } from "zod";

const contentSchema = z.object({
  whatsapp: z
    .string()
    .regex(/^62\d+$/, "Nomor WhatsApp harus diawali angka 62 dan hanya berisi digit angka."),
  instagram: z.string().url("URL Instagram harus berupa tautan valid."),
  mapsUrl: z.string().url("URL Google Maps harus berupa tautan valid."),
  gallery: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      alt: z.string().min(3, "Teks alternatif (alt) foto wajib diisi minimal 3 karakter."),
      order: z.number(),
    })
  ),
});

type ContentTab = "beranda" | "tentang" | "kontak" | "brand";

export default function AdminKontenPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [initialContent, setInitialContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>("beranda");
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteContentService();
        setContent(JSON.parse(JSON.stringify(data)));
        setInitialContent(JSON.parse(JSON.stringify(data)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const updateField = (field: keyof SiteContent, val: any) => {
    if (!content) return;
    setContent({ ...content, [field]: val });
    setHasChanges(true);
  };

  const handleHighlightChange = (index: number, val: string) => {
    if (!content) return;
    const next = [...content.highlights];
    next[index] = val;
    setContent({ ...content, highlights: next });
    setHasChanges(true);
  };

  const handleGalleryAltChange = (id: string, alt: string) => {
    if (!content) return;
    const next = content.gallery.map((g) => (g.id === id ? { ...g, alt } : g));
    setContent({ ...content, gallery: next });
    setHasChanges(true);
  };

  const handleGalleryMove = (index: number, direction: "up" | "down") => {
    if (!content) return;
    const next = [...content.gallery];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= next.length) return;

    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    setContent({ ...content, gallery: next });
    setHasChanges(true);
  };

  const handleGalleryDelete = (id: string) => {
    if (!content) return;
    setContent({ ...content, gallery: content.gallery.filter((g) => g.id !== id) });
    setHasChanges(true);
  };

  const handleAddGalleryItem = () => {
    if (!content) return;
    const newItem: GalleryItem = {
      id: `g_${Date.now()}`,
      url: "/images/mie-ayam-komplit.png",
      alt: "Foto sajian baru",
      order: content.gallery.length + 1,
    };
    setContent({ ...content, gallery: [...content.gallery, newItem] });
    setHasChanges(true);
  };

  const handleTestimonialChange = (index: number, field: keyof Testimonial, val: any) => {
    if (!content) return;
    const next = [...content.testimonials];
    next[index] = { ...next[index], [field]: val };
    setContent({ ...content, testimonials: next });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!content) return;
    setErrors({});

    // Validasi Zod
    const result = contentSchema.safeParse({
      whatsapp: content.whatsapp,
      instagram: content.instagram,
      mapsUrl: content.mapsUrl,
      gallery: content.gallery,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        errMap[path] = err.message;
      });
      setErrors(errMap);
      bahaya("Terdapat kesalahan format data. Silakan periksa kembali formulir.");
      return;
    }

    try {
      await updateSiteContentService(content);
      setInitialContent(JSON.parse(JSON.stringify(content)));
      setHasChanges(false);
      sukses("Konten situs berhasil diperbarui.");
    } catch {
      bahaya("Gagal menyimpan perubahan konten.");
    }
  };

  const handleReset = () => {
    if (initialContent) {
      setContent(JSON.parse(JSON.stringify(initialContent)));
      setHasChanges(false);
      setErrors({});
    }
  };

  if (isLoading || !content) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-1/3" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const tabs = [
    {
      id: "beranda" as ContentTab,
      label: "Beranda",
      icon: Home,
      desc: "Hero Section, Galeri Foto, & Ulasan Pelanggan",
    },
    {
      id: "tentang" as ContentTab,
      label: "Tentang warung",
      icon: BookOpen,
      desc: "Cerita Warung, Sejarah, & Keunggulan",
    },
    {
      id: "kontak" as ContentTab,
      label: "Lokasi dan kontak",
      icon: MapPin,
      desc: "Alamat, WhatsApp, Instagram, & Maps",
    },
    {
      id: "brand" as ContentTab,
      label: "Identitas situs",
      icon: Globe,
      desc: "Nama Usaha, Tagline di Header & Footer",
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Konten situs"
        description="Kelola tulisan, galeri, lokasi, dan identitas yang tampil pada situs pelanggan."
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#D8D1C9] bg-white px-4 text-xs font-semibold text-[#8D0D00] transition-colors hover:bg-[#F8E8E4]"
          >
            <span>Lihat situs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      />

      <div className="flex items-center gap-2 rounded-[12px] border border-[#E2D5C5] bg-[#F7F1E9] p-3.5 text-xs text-[#51463E]">
        <CheckCircle2 className="w-4 h-4 text-[#8B0000] shrink-0" />
        <span>
          Setiap perubahan yang disimpan langsung diterapkan ke situs pelanggan.
        </span>
      </div>

      {/* Tabs Navigasi Berdasarkan Halaman */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            className={`min-h-14 rounded-[12px] border p-3.5 text-left transition-colors ${
                isActive
                  ? "bg-[#8B0000] text-white border-[#8B0000] shadow-sm"
                  : "border-[#DED8D1] bg-white text-[#3F352E] hover:border-[#BDAFA4] hover:bg-[#F7F4F0]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#FFD700]" : "text-[#8B0000]"}`} />
                <span className="text-sm font-semibold tracking-[-0.015em]">{tab.label}</span>
              </div>
              <p className={`text-[11px] leading-tight line-clamp-1 ${isActive ? "text-white/80" : "text-[#6B4423]"}`}>
                {tab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* ════════════════ TAB 1: HALAMAN BERANDA ════════════════ */}
      {activeTab === "beranda" && (
        <div className="space-y-6">
          {/* Card 1: Hero Section */}
          <div className="space-y-4 rounded-[16px] border border-[#DED8D1] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Bagian utama situs</h3>
                <p className="text-xs text-[#6B4423]">
                  Teks sambutan dan deskripsi yang tampil di layar paling pertama saat pengunjung membuka website.
                </p>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF0DC] text-[#8B0000] border border-[#D4AF37]/30">
                Muncul di: Beranda Atas
              </span>
            </div>

            <TextareaField
              label="Deskripsi Sambutan Hero"
              rows={3}
              value={content.description}
              onChange={(e) => updateField("description", e.target.value)}
              helperText="Teks pengantar di bawah judul utama beranda, menjelaskan mie kenyal buatan sendiri dan kelezatan bumbu ayam."
            />
          </div>

          {/* Card 2: Galeri Foto Beranda */}
          <div className="space-y-4 rounded-[16px] border border-[#DED8D1] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Galeri beranda</h3>
                <p className="text-xs text-[#6B4423]">
                  Foto-foto hidangan dan suasana warung pada carousel slider di halaman beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-[#FFF8E7] text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Foto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.gallery.map((g, idx) => (
                <div
                  key={g.id}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/20 shadow-xs flex gap-4 items-start"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white relative shrink-0 border border-[#D4AF37]/20">
                    <Image src={g.url} alt={g.alt} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <InputField
                      label={`Teks Alt Foto #${idx + 1}`}
                      value={g.alt}
                      onChange={(e) => handleGalleryAltChange(g.id, e.target.value)}
                      placeholder="Deskripsi foto untuk aksesibilitas"
                      error={errors[`gallery.${idx}.alt`]}
                    />
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleGalleryMove(idx, "up")}
                          className="p-1 rounded hover:bg-black/5 disabled:opacity-20 text-[#2C1810]"
                          title="Geser posisi naik"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.gallery.length - 1}
                          onClick={() => handleGalleryMove(idx, "down")}
                          className="p-1 rounded hover:bg-black/5 disabled:opacity-20 text-[#2C1810]"
                          title="Geser posisi turun"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGalleryDelete(g.id)}
                        className="p-1 text-[#B42318] hover:bg-[#FBE4E1] rounded transition"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Ulasan & Testimoni Pelanggan */}
          <div className="space-y-4 rounded-[16px] border border-[#DED8D1] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Ulasan pelanggan</h3>
                <p className="text-xs text-[#6B4423]">
                  Kartu testimoni bintang 5 yang ditampilkan pada slider review pelanggan di beranda.
                </p>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF0DC] text-[#8B0000] border border-[#D4AF37]/30">
                Muncul di: Seksi Testimoni
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.testimonials.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/20 shadow-xs space-y-3"
                >
                  <InputField
                    label={`Nama Pelanggan #${idx + 1}`}
                    value={t.name}
                    onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                  />
                  <TextareaField
                    label="Isi Ulasan"
                    rows={4}
                    value={t.content}
                    onChange={(e) => handleTestimonialChange(idx, "content", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ TAB 2: TENTANG KAMI ════════════════ */}
      {activeTab === "tentang" && (
        <div className="max-w-3xl space-y-5 rounded-[16px] border border-[#DED8D1] bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Tentang warung</h3>
              <p className="text-xs text-[#6B4423]">
                Narasi sejarah, tahun berdirinya warung, dan 3 poin keunggulan utama produk.
              </p>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF0DC] text-[#8B0000] border border-[#D4AF37]/30">
              Muncul di: /tentang & Seksi Tentang
            </span>
          </div>

          <InputField
            label="Tahun Berdiri Usaha"
            type="number"
            value={content.establishedYear}
            onChange={(e) => updateField("establishedYear", Number(e.target.value))}
            helperText="Muncul pada stempel warung dan narasi profil."
          />

          <TextareaField
            label="Paragraf Cerita Warung (Story)"
            rows={6}
            value={content.story}
            onChange={(e) => updateField("story", e.target.value)}
            helperText="Ceritakan resep otentik, proses pembuatan mie segar setiap pagi, dan komitmen rasa."
          />

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#3F352E]">
                3 Poin Keunggulan Utama (Highlights)
              </label>
              <p className="text-xs text-[#6B4423] mt-0.5">
                Muncul sebagai poin checklist keunggulan warung.
              </p>
            </div>
            {content.highlights.map((h, i) => (
              <InputField
                key={i}
                value={h}
                onChange={(e) => handleHighlightChange(i, e.target.value)}
                placeholder={`Keunggulan ke-${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════ TAB 3: LOKASI & KONTAK ════════════════ */}
      {activeTab === "kontak" && (
        <div className="max-w-3xl space-y-5 rounded-[16px] border border-[#DED8D1] bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Lokasi dan pemesanan</h3>
              <p className="text-xs text-[#6B4423]">
                Informasi nomor pemesanan WhatsApp, link peta Google Maps, dan akun media sosial resmi.
              </p>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF0DC] text-[#8B0000] border border-[#D4AF37]/30">
              Muncul di: Seksi Lokasi & Footer
            </span>
          </div>

          <InputField
            label="Nomor WhatsApp Resmi (Awali dengan 62)"
            value={content.whatsapp}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            error={errors["whatsapp"]}
            helperText="Nomor tujuan saat pelanggan klik tombol 'Pesan Sekarang' di Navbar, Beranda, dan Tombol Melayang."
          />

          <InputField
            label="URL Akun Instagram Resmi"
            value={content.instagram}
            onChange={(e) => updateField("instagram", e.target.value)}
            error={errors["instagram"]}
            helperText="Tautan akun Instagram yang tampil di kartu kontak dan footer."
          />

          <TextareaField
            label="Alamat Lengkap Toko"
            rows={3}
            value={content.address}
            onChange={(e) => updateField("address", e.target.value)}
            helperText="Alamat fisik warung yang tertera di kartu lokasi dan footer website."
          />

          <InputField
            label="Tautan Langsung Google Maps"
            value={content.mapsUrl}
            onChange={(e) => updateField("mapsUrl", e.target.value)}
            error={errors["mapsUrl"]}
            helperText="Link rute saat pelanggan klik tombol 'Buka rute di Google Maps'."
          />

          <InputField
            label="URL Embed Peta Google Maps"
            value={content.mapsEmbedUrl}
            onChange={(e) => updateField("mapsEmbedUrl", e.target.value)}
            helperText="URL iframe peta interaktif pada seksi Lokasi & Jam Buka."
          />
        </div>
      )}

      {/* ════════════════ TAB 4: IDENTITAS BRAND ════════════════ */}
      {activeTab === "brand" && (
        <div className="max-w-3xl space-y-5 rounded-[16px] border border-[#DED8D1] bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#251C17]">Identitas situs</h3>
              <p className="text-xs text-[#6B4423]">
                Nama brand dan tagline utama yang ditampilkan di bagian navigasi atas, footer bawah, dan judul tab browser.
              </p>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF0DC] text-[#8B0000] border border-[#D4AF37]/30">
              Muncul di: Navbar, Footer & SEO
            </span>
          </div>

          <InputField
            label="Nama Brand / Usaha"
            value={content.storeName}
            onChange={(e) => updateField("storeName", e.target.value)}
            helperText="Nama warung yang tampil di logo samping navbar, judul website, dan hak cipta footer."
          />

          <InputField
            label="Tagline Resmi"
            value={content.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            helperText="Slogan singkat di bawah logo brand pada footer dan profil UMKM."
          />
        </div>
      )}

      {/* Bilah Simpan Melekat di Bawah (Floating Save Bar) */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D4AF37]/30 shadow-2xl p-4 animate-in slide-in-from-bottom duration-200">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#8A5A00]">
              Ada perubahan konten yang belum disimpan.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-[#2C1810]/20 text-xs font-semibold text-[#2C1810] hover:bg-[#FAF7F2] transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white text-xs font-semibold shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
