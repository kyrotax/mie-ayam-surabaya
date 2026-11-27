import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Bebas+Neue&family=Montserrat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#251C17] font-body antialiased overflow-x-hidden selection:bg-[#8D0D00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
