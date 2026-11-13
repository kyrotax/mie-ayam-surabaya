import type { Metadata } from "next";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloating from "@/components/public/WhatsAppFloating";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Mie Ayam Surabaya: Autentik Mie Ayam Oriental",
    template: "%s | Mie Ayam Surabaya",
  },
  description:
    "Nikmati kelezatan mie ayam oriental otentik di Taman Pinang Indah, Sidoarjo. Topping ayam melimpah, bakso sapi gurih, dan pangsit renyah.",
  keywords: [
    "Mie Ayam Surabaya",
    "Mie Ayam Oriental",
    "Mie Ayam Sidoarjo",
    "Taman Pinang Indah",
    "Kuliner Sidoarjo",
  ],
  openGraph: {
    title: "Mie Ayam Surabaya: Autentik Mie Ayam Oriental",
    description: "Mie ayam bergaya oriental dengan bumbu khas dan topping melimpah di Sidoarjo.",
    siteName: "Mie Ayam Surabaya",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${oswald.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-stone-900 font-sans antialiased overflow-x-hidden selection:bg-[#BA382A] selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
