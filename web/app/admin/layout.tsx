import type { Metadata } from "next";
import { DummyStoreProvider } from "@/lib/admin/mock/store";
import { ToastProvider } from "@/components/admin/ui/Toast";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mie Ayam Surabaya",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DummyStoreProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased">
          {children}
        </div>
      </ToastProvider>
    </DummyStoreProvider>
  );
}
