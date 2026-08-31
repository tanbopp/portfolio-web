"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  useEffect(() => {
    const nav = document.getElementById("site-nav");
    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="site-nav" className="fixed top-0 left-0 right-0 z-[1000]">
      <div id="site-nav-bg" className="pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-[100rem] items-center justify-between px-4 py-6 sm:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-white">
          Tanbopp
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/#projects" className="text-sm text-neutral-300 transition-colors hover:text-white">
            Projects
          </Link>
          <Link href="/#contact" className="text-sm text-neutral-300 transition-colors hover:text-white">
            Contact Me
          </Link>
        </div>
      </div>
    </nav>
  );
}
