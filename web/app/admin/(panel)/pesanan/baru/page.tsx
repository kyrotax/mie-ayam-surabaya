"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { processPhotoExtractionService } from "@/lib/admin/services/order-service";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Camera,
  Upload,
  RotateCw,
  RotateCcw,
  RefreshCw,
  Sparkles,
  FileEdit,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

export default function AdminPesananBaruPage() {
  const router = useRouter();
  const { bahaya } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Client-side image compression
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(e.target?.result as string);

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setErrorMessage(null);

    // Validasi tipe file & ukuran
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      setErrorMessage("Format file tidak didukung. Mohon unggah file JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar (maksimal 10 MB).");
      return;
    }

    try {
      const compressedDataUrl = await compressImage(file);
      setSelectedFile(file);
      setPhotoPreview(compressedDataUrl);
      setRotation(0);
    } catch {
      setErrorMessage("Gagal memproses gambar. Silakan coba lagi.");
    }
  };

  const handleRotate = (dir: "left" | "right") => {
    setRotation((prev) => (dir === "right" ? (prev + 90) % 360 : (prev - 90 + 360) % 360));
  };

  const handleProcessAI = async () => {
    if (!selectedFile || !photoPreview) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      setProcessingStep("Mengunggah foto catatan…");
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep("Membaca tulisan tangan dengan OCR…");
      await new Promise((r) => setTimeout(r, 800));

      setProcessingStep("Mencocokkan menu & menghitung keyakinan…");
      const job = await processPhotoExtractionService(selectedFile.name, photoPreview);

      // Selesai -> navigasi ke review
      router.push(`/admin/pesanan/${job.id}/review`);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses ekstraksi catatan.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Input Pesanan Baru"
        description="Ambil foto catatan tangan pesanan meja atau bungkus untuk diekstraksi secara otomatis oleh AI."
      />

      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FBE4E1] border border-[#F4BEB7] text-[#B42318] text-xs flex items-center gap-3 font-semibold"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* State Processing Bertahap */}
      {isProcessing && (
        <div className="p-8 rounded-2xl bg-white border border-[#3B2416]/10 text-center shadow-md space-y-4 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border-2 border-[#CBA857] flex items-center justify-center text-[#8D0D00] animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B2416]">
            Sedang Memproses Catatan Pesanan
          </h3>
          <p className="text-xs font-semibold text-[#8A5A00] animate-pulse">
            {processingStep}
          </p>
          <div className="w-48 h-1.5 bg-[#FAF8F5] rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-[#8D0D00] animate-pulse" />
          </div>
        </div>
      )}

      {!isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Dropzone & Pratinjau */}
          <div className="lg:col-span-7 space-y-4">
            {!photoPreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
                }}
                className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-[#CBA857] bg-white hover:bg-[#FAF8F5] transition text-center flex flex-col items-center justify-center min-h-[300px] shadow-xs"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#8D0D00] flex items-center justify-center mb-4 border border-[#CBA857]/30">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#3B2416] mb-1">
                  Ambil Foto atau Tarik File Catatan
                </h3>
                <p className="text-xs text-[#6B5240] max-w-xs mb-6">
                  Mendukung foto kamera langsung, JPG, PNG, atau WebP (maksimal 10 MB).
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  {/* Tombol Kamera Utama (Mobile) */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white font-bold text-xs shadow-xs transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto HP</span>
                  </button>

                  {/* Tombol File */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#3B2416]/20 bg-white hover:bg-[#FAF8F5] text-[#3B2416] font-bold text-xs transition"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Pilih Berkas</span>
                  </button>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </div>
            ) : (
              /* Pratinjau Foto dengan Kontrol */
              <div className="p-5 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
                <div className="relative w-full h-[360px] bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <div
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="relative w-full h-full transition-transform duration-200"
                  >
                    <Image
                      src={photoPreview}
                      alt="Pratinjau catatan"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRotate("left")}
                      className="p-2 rounded-xl border border-[#3B2416]/15 hover:bg-[#FAF8F5] text-[#3B2416] text-xs font-semibold flex items-center gap-1"
                      title="Putar Kiri"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Putar Kiri</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRotate("right")}
                      className="p-2 rounded-xl border border-[#3B2416]/15 hover:bg-[#FAF8F5] text-[#3B2416] text-xs font-semibold flex items-center gap-1"
                      title="Putar Kanan"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Putar Kanan</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPhotoPreview(null);
                    }}
                    className="text-xs font-semibold text-[#8D0D00] hover:underline"
                  >
                    Ganti Foto
                  </button>
                </div>

                {/* Tombol Eksekusi AI */}
                <button
                  type="button"
                  onClick={handleProcessAI}
                  className="w-full py-3.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F4CE90]" />
                  <span>Proses dengan AI Sekarang</span>
                </button>
              </div>
            )}

            {/* Tautan Manual */}
            <div className="text-center pt-2">
              <Link
                href="/admin/pesanan/manual/review"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B5240] hover:text-[#8D0D00] transition"
              >
                <FileEdit className="w-4 h-4" />
                <span>Input Pesanan Manual Tanpa Foto</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Panduan Tips Foto Catatan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#3B2416]/10 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#8D0D00]">
                <Lightbulb className="w-5 h-5 text-[#CBA857]" />
                <h3 className="font-serif text-base font-bold text-[#3B2416]">
                  Tips Agar AI Akurat 100%
                </h3>
              </div>
              <ul className="space-y-3 text-xs text-[#6B5240] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#FFF4E0] text-[#8D0D00] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    <strong>Pencahayaan terang:</strong> Pastikan kertas catatan tidak tertutup bayangan badan atau ponsel.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#FFF4E0] text-[#8D0D00] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    <strong>Tegak lurus:</strong> Ambil foto dari sudut atas sejajar kertas, jangan terlalu miring.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#FFF4E0] text-[#8D0D00] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>Gunakan singkatan standar:</strong> Tulis <em>MA</em> (Mie Ayam), <em>MAP</em> (Pangsit), atau <em>MAK</em> (Komplit).
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CBA857]/30 text-xs text-[#6B5240] space-y-1">
              <div className="font-bold text-[#8D0D00]">Catatan Demo Pengujian:</div>
              <p>
                Gunakan nama file yang mengandung kata <code>gagal</code> (mis. <em>catatan-gagal.jpg</em>) untuk menguji simulasi error handling.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

