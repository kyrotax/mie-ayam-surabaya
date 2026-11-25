"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Info, Loader2, ArrowLeft } from "lucide-react";
import { loginAction } from "./actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Rate limit / lockout simulasi: 5 kali gagal -> kunci 30 detik
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    if (reason === "expired") {
      setErrorMsg("Sesi berakhir, silakan masuk lagi.");
    }
  }, [reason]);

  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0 || isLoading) return;

    setErrorMsg(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("next", next);

    try {
      const res = await loginAction(null, formData);
      if (!res.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setLockoutSeconds(30);
          setErrorMsg("Terlalu banyak percobaan gagal. Tombol masuk dikunci selama 30 detik.");
        } else {
          setErrorMsg(res.error || "Email atau kata sandi salah.");
        }
        setIsLoading(false);
      } else {
        setFailedAttempts(0);
        router.push(res.redirectTo || "/admin");
        router.refresh();
      }
    } catch {
      setErrorMsg("Terjadi kesalahan sistem. Silakan coba kembali.");
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  const showDemo = process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS !== "false";

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#D4AF37]/25 p-6 sm:p-9 shadow-md">
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B0000] hover:text-[#C41E3A] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website Utama</span>
        </Link>
        <h2 className="text-3xl font-heading text-[#2C1810] tracking-wide">Masuk ke Dasbor</h2>
        <p className="text-xs sm:text-sm text-[#6B4423] mt-1 font-body">
          Gunakan kredensial resmi Owner atau Admin Kasir Anda.
        </p>
      </div>

      {/* Banner Pesan Error */}
      {errorMsg && (
        <div
          role="alert"
          className="mb-4 p-3 rounded-xl bg-[#FBE4E1] border border-[#F4BEB7] text-[#B42318] text-xs sm:text-sm flex items-start gap-2.5 font-medium animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-[#2C1810] mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4423]/60" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@mieayam.test"
              disabled={lockoutSeconds > 0}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#2C1810]/20 bg-white text-sm text-[#2C1810] placeholder:text-[#6B4423]/40 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-[#2C1810] mb-1.5"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4423]/60" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={lockoutSeconds > 0}
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#2C1810]/20 bg-white text-sm text-[#2C1810] placeholder:text-[#6B4423]/40 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B4423]/60 hover:text-[#2C1810] p-1"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || lockoutSeconds > 0}
            className="w-full h-11 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] disabled:bg-[#8B0000]/50 text-[#FFF8E7] font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memeriksa…</span>
              </>
            ) : lockoutSeconds > 0 ? (
              <span>Terkunci ({lockoutSeconds} detik)</span>
            ) : (
              <span>Masuk ke Dasbor</span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-5 text-center text-xs text-[#6B4423]">
        Lupa kata sandi? Hubungi Owner.
      </div>

      {/* Kotak Akun Demo */}
      {showDemo && (
        <div className="mt-6 pt-5 border-t border-[#D4AF37]/20">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A5A00] mb-2.5">
            <Info className="w-3.5 h-3.5" />
            <span>Akun Demo Cepat (Klik untuk Isi Otomatis)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillDemo("owner@mieayam.test", "Owner123!")}
              className="p-2.5 text-left rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/30 hover:border-[#8B0000] hover:bg-[#FAF0DC] transition"
            >
              <div className="font-bold text-[#8B0000]">👑 Owner</div>
              <div className="text-[11px] text-[#6B4423] truncate">owner@mieayam.test</div>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin@mieayam.test", "Admin123!")}
              className="p-2.5 text-left rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/30 hover:border-[#8B0000] hover:bg-[#FAF0DC] transition"
            >
              <div className="font-bold text-[#2C1810]">👤 Admin Kasir</div>
              <div className="text-[11px] text-[#6B4423] truncate">admin@mieayam.test</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF7F2]">
      {/* Panel Kiri (Branding) */}
      <div className="lg:w-5/12 bg-gradient-to-br from-[#6B0000] via-[#8B0000] to-[#C41E3A] text-[#FFF8E7] p-6 sm:p-10 lg:p-14 flex flex-col justify-between items-center text-center relative overflow-hidden">
        {/* Ornamen Latar Tipis */}
        <div className="absolute inset-0 bg-chinese-lattice pointer-events-none opacity-20" />

        <div className="w-full max-w-sm my-auto py-4 lg:py-8 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl mb-4 lg:mb-6 relative">
            <Image
              src="/images/logo-umkm.jpg"
              alt="Logo Mie Ayam Surabaya"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-wide text-[#FFD700] mb-2 lg:mb-3">
            Mie Ayam Surabaya
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[#FFF8E7]/90 font-medium leading-relaxed max-w-xs mx-auto">
            Panel Pengelolaan UMKM & Ekstraksi Pesanan Cerdas
          </p>

          <div className="w-20 lg:w-24 h-0.5 bg-[#D4AF37] mx-auto my-4 lg:my-6" />

          <p className="text-[11px] sm:text-xs text-[#FFF8E7]/80">
            Sistem Manajemen Warung & Pesanan
          </p>
        </div>

        <div className="text-[11px] lg:text-xs text-[#FFF8E7]/65 hidden lg:block relative z-10">
          &copy; 2026 Mie Ayam Surabaya. Sistem Terproteksi.
        </div>
      </div>

      {/* Panel Kanan (Form Login dibungkus Suspense) */}
      <div className="lg:w-7/12 flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-16">
        <Suspense fallback={<div className="text-xs text-[#6B4423]">Memuat form login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
