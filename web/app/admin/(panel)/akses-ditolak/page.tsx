import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AksesDitolakPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-[#FBE4E1] text-[#B42318] flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2416] mb-2">
        Akses Ditolak
      </h1>
      <p className="text-sm text-[#6B5240] max-w-sm mb-6">
        Kamu tidak punya akses ke halaman ini. Halaman ini hanya diperuntukkan bagi peran Owner.
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8D0D00] hover:bg-[#6B0A00] text-white font-medium text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Ringkasan</span>
      </Link>
    </div>
  );
}

