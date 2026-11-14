"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Info, Loader2 } from "lucide-react";
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
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#3B2416]/10 p-7 sm:p-10 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-serif text-[#3B2416]">Masuk ke Dasbor</h2>
        <p className="text-sm text-[#6B5240] mt-1">
          Gunakan kredensial resmi Owner atau Admin Anda.
        </p>
      </div>

      {/* Banner Pesan Error */}
      {errorMsg && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-[#FBE4E1] border border-[#F4BEB7] text-[#B42318] text-sm flex items-start gap-2.5 font-medium animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-[#3B2416] mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5240]/60" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@mieayam.test"
              disabled={lockoutSeconds > 0}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#3B2416]/25 bg-white text-base text-[#1C1917] placeholder:text-[#6B5240]/40 focus:outline-none focus:ring-2 focus:ring-[#8D0D00] transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-[#3B2416] mb-1.5"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5240]/60" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={lockoutSeconds > 0}
              className="w-full h-11 pl-11 pr-11 rounded-xl border border-[#3B2416]/25 bg-white text-base text-[#1C1917] placeholder:text-[#6B5240]/40 focus:outline-none focus:ring-2 focus:ring-[#8D0D00] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B5240]/60 hover:text-[#3B2416] p-1"
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
            className="w-full h-11 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] disabled:bg-[#8D0D00]/50 text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
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

      <div className="mt-6 text-center text-xs text-[#6B5240]">
        Lupa kata sandi? Hubungi Owner.
      </div>

      {/* Kotak Akun Demo */}
      {showDemo && (
        <div className="mt-8 pt-6 border-t border-[#3B2416]/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A5A00] mb-2.5">
            <Info className="w-3.5 h-3.5" />
            <span>Akun Demo Cepat (Klik untuk Isi Otomatis)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillDemo("owner@mieayam.test", "Owner123!")}
              className="p-2.5 text-left rounded-lg bg-[#FAF8F5] border border-[#CBA857]/40 hover:border-[#8D0D00] hover:bg-[#FFF4E0] transition"
            >
              <div className="font-bold text-[#8D0D00]">👑 Owner</div>
              <div className="text-[11px] text-[#6B5240] truncate">owner@mieayam.test</div>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin@mieayam.test", "Admin123!")}
              className="p-2.5 text-left rounded-lg bg-[#FAF8F5] border border-[#CBA857]/40 hover:border-[#8D0D00] hover:bg-[#FFF4E0] transition"
            >
              <div className="font-bold text-[#3B2416]">👤 Admin Kasir</div>
              <div className="text-[11px] text-[#6B5240] truncate">admin@mieayam.test</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF8F5]">
      {/* Panel Kiri (Branding) */}
      <div className="lg:w-5/12 bg-[#8D0D00] text-[#FFF4E0] p-8 lg:p-14 flex flex-col justify-between items-center text-center relative overflow-hidden">
        {/* Ornamen Latar Tipis */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#CBA857_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="w-full max-w-sm my-auto py-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-4 border-[#CBA857] shadow-xl mb-6 relative">
            <Image
              src="/images/logo.jpg"
              alt="Logo Mie Ayam Surabaya"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Mie Ayam Surabaya
          </h1>
          <p className="text-sm sm:text-base text-[#F4CE90] font-medium leading-relaxed max-w-xs mx-auto">
            Panel Pengelolaan UMKM & Ekstraksi Pesanan Cerdas
          </p>

          <div className="w-24 h-0.5 bg-[#CBA857] mx-auto my-6" />

          <p className="text-xs text-[#FFF4E0]/80">
            Fase 2: Validasi Alur Kerja & Antarmuka Dasbor
          </p>
        </div>

        <div className="text-xs text-[#FFF4E0]/60 hidden lg:block">
          &copy; 2026 Mie Ayam Surabaya. Sistem Terproteksi.
        </div>
      </div>

      {/* Panel Kanan (Form Login dibungkus Suspense) */}
      <div className="lg:w-7/12 flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <Suspense fallback={<div className="text-xs text-[#6B5240]">Memuat form login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
