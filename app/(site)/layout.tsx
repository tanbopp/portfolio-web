import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";
import AOSProvider from "@/components/AOSProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <AOSProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </AOSProvider>
    </LenisProvider>
  );
}
