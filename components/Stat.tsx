"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated stat counter — counts up when scrolled into view.
 * value may include a suffix, e.g. "3+", "4", "12+" -> parses the number.
 */
export default function Stat({
  value,
  label,
  duration = 1400,
}: {
  value: string;
  label: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        run();
        cleanup();
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [target, duration]);

  return (
    <div ref={ref}>
      <span className="text-5xl sm:text-6xl font-thin tabular-nums">
        {count}
        {suffix}
      </span>
      <p className="tracking-wide mt-4 text-neutral-400">{label}</p>
    </div>
  );
}
