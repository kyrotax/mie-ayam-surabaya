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
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
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

export default function AdminKontenPage() {
  const { sukses, bahaya } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [initialContent, setInitialContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<"profil" | "tentang" | "kontak" | "galeri" | "testimoni">("profil");
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
      url: "/images/fotomie.png",
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

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Konten Situs & Profil"
        description="Sesuaikan narasi cerita, profil usaha, kontak, galeri hidangan, dan ulasan pelanggan."
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#3B2416]/20 bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#8D0D00] transition"
          >
            <span>Pratinjau Situs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      />

      <div className="p-3.5 rounded-xl bg-[#FFF4E0] border border-[#CBA857]/40 text-xs text-[#8A5A00] flex items-center gap-2">
        <Info className="w-4 h-4 shrink-0" />
        <span>
          Perubahan pada dasbor dummy tersimpan di memori browser dan belum memengaruhi situs publik.
        </span>
      </div>

      {/* Tabs Navigasi */}
      <div className="flex border-b border-[#3B2416]/10 overflow-x-auto gap-2">
        {[
          { id: "profil", label: "Profil Usaha" },
          { id: "tentang", label: "Cerita & Tentang" },
          { id: "kontak", label: "Kontak & Lokasi" },
          { id: "galeri", label: "Galeri Hidangan" },
          { id: "testimoni", label: "Testimoni" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition border-b-2 ${
              activeTab === tab.id
                ? "border-[#8D0D00] text-[#8D0D00]"
                : "border-transparent text-[#6B5240] hover:text-[#3B2416]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Profil Usaha */}
      {activeTab === "profil" && (
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4 max-w-2xl">
          <InputField
            label="Nama Usaha"
            value={content.storeName}
            onChange={(e) => updateField("storeName", e.target.value)}
          />
          <InputField
            label="Tagline Resmi"
            value={content.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
          />
          <TextareaField
            label="Deskripsi Singkat"
            rows={4}
            value={content.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
      )}

      {/* Tab 2: Cerita & Tentang */}
      {activeTab === "tentang" && (
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-5 max-w-2xl">
          <InputField
            label="Tahun Berdiri"
            type="number"
            value={content.establishedYear}
            onChange={(e) => updateField("establishedYear", Number(e.target.value))}
          />
          <TextareaField
            label="Paragraf Cerita Usaha"
            rows={6}
            value={content.story}
            onChange={(e) => updateField("story", e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-[#3B2416]">
              3 Poin Keunggulan (Highlights)
            </label>
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

      {/* Tab 3: Kontak & Lokasi */}
      {activeTab === "kontak" && (
        <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4 max-w-2xl">
          <InputField
            label="Nomor WhatsApp (Awali dengan 62)"
            value={content.whatsapp}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            error={errors["whatsapp"]}
            helperText="Format resmi: 6282319195854"
          />
          <InputField
            label="URL Akun Instagram"
            value={content.instagram}
            onChange={(e) => updateField("instagram", e.target.value)}
            error={errors["instagram"]}
          />
          <TextareaField
            label="Alamat Lengkap Toko"
            rows={3}
            value={content.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
          <InputField
            label="Tautan Google Maps Langsung"
            value={content.mapsUrl}
            onChange={(e) => updateField("mapsUrl", e.target.value)}
            error={errors["mapsUrl"]}
          />
          <InputField
            label="URL Embed Peta Iframe"
            value={content.mapsEmbedUrl}
            onChange={(e) => updateField("mapsEmbedUrl", e.target.value)}
          />
        </div>
      )}

      {/* Tab 4: Galeri Hidangan */}
      {activeTab === "galeri" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[#6B5240]">
              Foto-foto hidangan yang tampil pada etalase galeri.
            </div>
            <button
              type="button"
              onClick={handleAddGalleryItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#3B2416]/20 text-xs font-semibold text-[#8D0D00] hover:bg-[#FFF4E0]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Foto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.gallery.map((g, idx) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs flex gap-4 items-start"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-[#3B2416]/10">
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
                        className="p-1 rounded hover:bg-black/5 disabled:opacity-20"
                        title="Geser naik"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === content.gallery.length - 1}
                        onClick={() => handleGalleryMove(idx, "down")}
                        className="p-1 rounded hover:bg-black/5 disabled:opacity-20"
                        title="Geser turun"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGalleryDelete(g.id)}
                      className="p-1 text-[#B42318] hover:bg-[#FBE4E1] rounded"
                      title="Hapus foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Testimoni */}
      {activeTab === "testimoni" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-3"
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
      )}

      {/* Bilah Simpan Melekat di Bawah (Floating Save Bar) */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#3B2416]/15 shadow-2xl p-4 animate-in slide-in-from-bottom duration-200">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#8A5A00]">
              Ada perubahan yang belum disimpan.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-[#3B2416]/20 text-xs font-semibold text-[#3B2416] hover:bg-[#FAF8F5] transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white text-xs font-semibold shadow-xs transition"
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
