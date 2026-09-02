import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sultan Rahmatulloh — Tanbopp | AI Automation & Custom Software Developer",
  description:
    "AI automation and custom software developer portfolio. I build systems that cut manual work and help businesses run more efficiently.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  themeColor: "#0a0a0a",
  appleWebApp: {
    capable: true,
    title: "Tanbopp",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white antialiased">{children}</body>
    </html>
  );
}
