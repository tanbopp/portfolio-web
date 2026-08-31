import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sultan Rahmatulloh — Tanbopp | AI Automation & Custom Software Developer",
  description:
    "AI automation and custom software developer portfolio. I build systems that cut manual work and help businesses run more efficiently.",
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
