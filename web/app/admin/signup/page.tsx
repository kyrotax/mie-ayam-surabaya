"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { supabase } from "@/src/supabaseClient";

function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setErrorMsg(null);
    setInfoMsg(null);
    setIsLoading(true);

    try {
      // 1) For Sign Up: Use supabase.auth.signUp({ email, password })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      // If data.session is null, don’t redirect to the dashboard.
      // Just show: "Check your email and confirm your account before logging in."
      if (!data?.session) {
        setInfoMsg("Check your email and confirm your account before logging in.");
        setIsLoading(false);
        return;
      }

      // Only redirect when a real session exists
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Pendaftaran tidak dapat diproses. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px]">
      <div className="mb-9">
        <p className="text-sm font-semibold text-[#8D0D00]">Pendaftaran Akun</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#251C17]">
          Buat akun baru
        </h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#6E6259]">
          Daftarkan email dan kata sandi Anda untuk mengakses sistem Mie Ayam Surabaya.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#251C17]">
            Email
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
              placeholder="nama@email.com"
              className="h-14 w-full rounded-[14px] border border-[#CFC6BC] bg-white pl-12 pr-4 text-base text-[#251C17] placeholder:text-[#8A7E75] focus:border-[#8D0D00] focus:ring-2 focus:ring-[#8D0D00]/15"
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi minimal 6 karakter"
              className="h-14 w-full rounded-[14px] border border-[#CFC6BC] bg-white pl-12 pr-14 text-base text-[#251C17] placeholder:text-[#8A7E75] focus:border-[#8D0D00] focus:ring-2 focus:ring-[#8D0D00]/15"
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
          disabled={isLoading}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#7B1007] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5C0D06] active:bg-[#4B0A04] disabled:bg-[#A99E96]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Mendaftarkan akun...
            </>
          ) : (
            "Daftar Akun"
          )}
        </button>
      </form>

      {/* Confirmation notification when session is null */}
      {infoMsg && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-[12px] border border-[#3E8E5B]/30 bg-[#EDF7F1] p-3.5 text-sm font-medium leading-5 text-[#1F6B3B]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1F6B3B]" strokeWidth={2} aria-hidden="true" />
          <span>{infoMsg}</span>
        </div>
      )}

      {/* Simple error handling: small error message under the form */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-4 flex items-start gap-2.5 rounded-[12px] border border-[#E7B9B2] bg-[#F9E8E5] p-3 text-sm font-medium leading-5 text-[#8D0D00]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <p className="mt-5 text-center text-xs leading-5 text-[#6E6259]">
        Sudah punya akun?{" "}
        <Link href="/admin/login" className="font-semibold text-[#8D0D00] hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

export default function AdminSignUpPage() {
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
            <p className="mt-0.5 text-xs text-[#F0C87D]">Pendaftaran Akun</p>
          </div>
        </div>

        <div className="relative ml-auto max-w-[280px] self-center text-right lg:ml-0 lg:max-w-md lg:self-auto lg:text-left">
          <h1 id="brand-heading" className="font-display text-[clamp(2.5rem,6vw,5.8rem)] font-semibold uppercase leading-[.9] tracking-[-0.035em]">
            Bergabung bersama kami.
          </h1>
          <p className="mt-5 hidden max-w-sm text-sm leading-6 text-[#F0D8C7] sm:block">
            Daftarkan akun untuk sistem operasional Mie Ayam Surabaya.
          </p>
        </div>

        <p className="relative hidden text-xs text-[#D9B6A0] lg:block">Mie Ayam Surabaya, Sidoarjo</p>
      </section>

      <section className="relative flex min-h-[calc(100vh-250px)] items-center justify-center rounded-t-[30px] bg-[#F2EFEA] px-6 py-12 sm:px-10 lg:min-h-screen lg:rounded-l-[38px] lg:rounded-tr-none lg:px-14 xl:px-20">
        <Suspense fallback={<p className="text-sm text-[#6E6259]">Memuat halaman pendaftaran...</p>}>
          <SignUpForm />
        </Suspense>
      </section>
    </main>
  );
}
