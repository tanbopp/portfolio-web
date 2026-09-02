"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";

export default function Hero() {
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (bgRef.current) {
          const y = window.scrollY * 0.5;
          bgRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" className="bg-neutral-800 tracking-tight w-full py-8 flex justify-center items-center relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgRef}
        src="/images/hero-background-2.png"
        alt=""
        className="absolute top-0 left-0 w-full h-[120%] object-cover pointer-events-none will-change-transform"
      />
      <div className="absolute z-10 w-full h-full bg-gradient-to-r from-black/70 via-transparent to-transparent" />
      <div className="absolute z-10 w-full h-[150px] bottom-0 bg-gradient-to-b from-transparent to-black/80" />

      <div className="w-full max-w-6xl p-8 flex flex-col justify-center z-50" data-aos="fade-up">
        <div className="py-20">
          <h1 className="text-4xl sm:text-7xl font-thin tracking-[-3.5%] mb-2 sm:mb-3">
            Sultan <br /> Rahmatulloh
          </h1>
          <h3 className="text-neutral-100/70 text-xl sm:text-2xl">
            I help your business run more <br />
            efficiently
          </h3>
          <div className="flex items-center gap-x-2.5 mt-8 sm:mt-10">
            <Button href="#projects" variant="primary" icon="chevron_right">
              View Projects
            </Button>
            <Button href="#" variant="secondary" icon="chevron_right">
              View CV
            </Button>
          </div>
        </div>

        <div className="w-full border-t border-neutral-500/50 pt-10">
          <div className="flex gap-x-12">
            <span className="text-2xl font-semibold tracking-tight text-white">Tanbopp</span>
          </div>
        </div>
      </div>
    </section>
  );
}
