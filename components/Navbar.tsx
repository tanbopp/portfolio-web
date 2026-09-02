"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const nav = document.getElementById("site-nav");
    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
      // Reveal the menu once the hero section has been scrolled past.
      // On pages without a hero (e.g. project detail) keep the menu visible.
      const hero = document.getElementById("hero");
      if (!hero) {
        setPastHero(true);
        return;
      }
      setPastHero(hero.getBoundingClientRect().bottom <= 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const reveal = pastHero
    ? "translate-y-0 opacity-100"
    : "pointer-events-none -translate-y-2 opacity-0";

  return (
    <nav id="site-nav" className="fixed top-0 left-0 right-0 z-[1000]">
      <div id="site-nav-bg" className="pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-5 pb-10 sm:px-8">
        <Link href="/" aria-label="Tanbopp — home" className="flex items-center">
          {/* Desktop: full wordmark logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Tanbopp" className="hidden h-[13px] w-auto sm:block" />
          {/* Mobile: favicon mark, inverted so it stands out on the dark bar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.svg"
            alt="Tanbopp"
            className="block h-7 w-auto invert sm:hidden"
          />
        </Link>
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Projects: hidden on mobile, desktop only — revealed first */}
          <Link
            href="/#projects"
            style={{ transitionDelay: pastHero ? "0ms" : "0ms" }}
            className={`hidden text-sm text-neutral-300 transition-all duration-500 ease-out hover:text-white sm:inline-flex ${reveal}`}
          >
            Projects
          </Link>
          {/* Contact Me: shown on all sizes — revealed second (100ms delay) */}
          <Link
            href="/#contact"
            style={{ transitionDelay: pastHero ? "100ms" : "0ms" }}
            className={`text-sm text-neutral-300 transition-all duration-500 ease-out hover:text-white ${reveal}`}
          >
            Contact Me
          </Link>
        </div>
      </div>
    </nav>
  );
}
