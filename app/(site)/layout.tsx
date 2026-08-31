import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisProvider from "@/components/LenisProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </LenisProvider>
  );
}
