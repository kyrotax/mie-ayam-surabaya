import { PublicLiveDataProvider } from "@/lib/public/LiveDataContext";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloating from "@/components/public/WhatsAppFloating";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLiveDataProvider>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppFloating />
    </PublicLiveDataProvider>
  );
}
