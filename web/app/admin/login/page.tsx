"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
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
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    if (reason === "expired") setErrorMsg("Sesi berakhir. Masuk kembali untuk melanjutkan.");
    if (reason === "owner-only") setErrorMsg("Panel ini hanya dapat dibuka oleh Owner.");
  }, [reason]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = window.setTimeout(
      () => setLockoutSeconds((current) => current - 1),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lockoutSeconds > 0 || isLoading) return;

    setErrorMsg(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("next", next);

    try {
      const result = await loginAction(null, formData);
      if (!result.success) {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 5) {
          setLockoutSeconds(30);
          setErrorMsg("Terlalu banyak percobaan gagal. Coba lagi dalam 30 detik.");
        } else {
          setErrorMsg(result.error || "Email atau kata sandi salah.");
        }
        setIsLoading(false);
        return;
      }

      setFailedAttempts(0);
      router.push(result.redirectTo || "/admin");
      router.refresh();
    } catch {
      setErrorMsg("Login tidak dapat diproses. Coba lagi.");
      setIsLoading(false);
    }
  };

  const fillOwnerDemo = () => {
    setEmail("owner@mieayam.test");
    setPassword("Owner123!");
    setErrorMsg(null);
  };

  const showDemo = process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS !== "false";

  return (
    <div className="w-full max-w-[480px]">
      <div className="mb-9">
        <p className="text-sm font-semibold text-[#8D0D00]">Akses khusus Owner</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#251C17]">
          Masuk ke ruang kerja
        </h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#6E6259]">
          Gunakan akun Owner untuk mengelola operasional Mie Ayam Surabaya.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 flex items-start gap-3 rounded-[14px] border border-[#E7B9B2] bg-[#F9E8E5] p-4 text-sm font-medium leading-6 text-[#8D0D00]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#251C17]">
            Email Owner
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7B6E64]" strokeWidth={1.7} aria-hidden="true" />
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="owner@mieayam.test"
              disabled={lockoutSeconds > 0}
              className="h-14 w-full rounded-[14px] border border-[#CFC6BC] bg-white pl-12 pr-4 text-base text-[#251C17] placeholder:text-[#8A7E75] focus:border-[#8D0D00] focus:ring-2 focus:ring-[#8D0D00]/15 disabled:bg-[#EEE9E4]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#251C17]">
            Kata sandi
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7B6E64]" strokeWidth={1.7} aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi"
              disabled={lockoutSeconds > 0}
              className="h-14 w-full rounded-[14px] border border-[#CFC6BC] bg-white pl-12 pr-14 text-base text-[#251C17] placeholder:text-[#8A7E75] focus:border-[#8D0D00] focus:ring-2 focus:ring-[#8D0D00]/15 disabled:bg-[#EEE9E4]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[10px] text-[#6E6259] transition-colors hover:bg-[#F2EFEA] hover:text-[#251C17]"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || lockoutSeconds > 0}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#7B1007] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5C0D06] active:bg-[#4B0A04] disabled:bg-[#A99E96]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Memeriksa akun
            </>
          ) : lockoutSeconds > 0 ? (
            `Coba lagi dalam ${lockoutSeconds} detik`
          ) : (
            "Masuk sebagai Owner"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-[#6E6259]">
        Jika lupa kata sandi, hubungi pengelola sistem.
      </p>

      {showDemo && (
        <div className="mt-8 border-t border-[#D9D1C9] pt-6">
          <button
            type="button"
            onClick={fillOwnerDemo}
            className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[14px] border border-[#CFC2AE] bg-[#FFF9F0] px-4 text-left transition-colors hover:border-[#8D0D00] hover:bg-white"
          >
            <span>
              <span className="block text-xs font-semibold text-[#8D0D00]">Isi akun demo Owner</span>
              <span className="mt-1 block text-xs text-[#6E6259]">owner@mieayam.test</span>
            </span>
            <span className="text-xs font-semibold text-[#251C17]">Isi otomatis</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#7B1007] lg:grid lg:grid-cols-[minmax(360px,.82fr)_minmax(560px,1.18fr)]">
      <section className="relative flex min-h-[250px] overflow-hidden px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-16" aria-labelledby="brand-heading">
        <div className="pointer-events-none absolute -bottom-16 -left-24 h-80 w-[620px] rotate-[-8deg] opacity-75" aria-hidden="true">
          <span className="absolute left-0 top-6 h-28 w-[620px] rounded-[50%] border-t-2 border-[#D6AC58]" />
          <span className="absolute left-8 top-20 h-28 w-[620px] rounded-[50%] border-t-2 border-[#D6AC58]" />
          <span className="absolute left-16 top-[136px] h-28 w-[620px] rounded-[50%] border-t-2 border-[#D6AC58]" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-[14px] border border-[#D6AC58] bg-[#FFF9F0]">
            <Image
              src="/images/logo-umkm.jpg"
              alt="Logo Mie Ayam Surabaya"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-bold">Mie Ayam Surabaya</p>
            <p className="mt-0.5 text-xs text-[#F0C87D]">Panel Owner</p>
          </div>
        </div>

        <div className="relative ml-auto max-w-[280px] self-center text-right lg:ml-0 lg:max-w-md lg:self-auto lg:text-left">
          <h1 id="brand-heading" className="font-display text-[clamp(2.5rem,6vw,5.8rem)] font-semibold uppercase leading-[.9] tracking-[-0.035em]">
            Kendali warung, satu tempat.
          </h1>
          <p className="mt-5 hidden max-w-sm text-sm leading-6 text-[#F0D8C7] sm:block">
            Kelola status toko, pesanan, menu, dan laporan dari satu panel.
          </p>
        </div>

        <p className="relative hidden text-xs text-[#D9B6A0] lg:block">Mie Ayam Surabaya, Sidoarjo</p>
      </section>

      <section className="relative flex min-h-[calc(100vh-250px)] items-center justify-center rounded-t-[30px] bg-[#F2EFEA] px-6 py-12 sm:px-10 lg:min-h-screen lg:rounded-l-[38px] lg:rounded-tr-none lg:px-14 xl:px-20">
        <Suspense fallback={<p className="text-sm text-[#6E6259]">Memuat halaman login...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
