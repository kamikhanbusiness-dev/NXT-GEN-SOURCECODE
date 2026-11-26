"use client";

import { useEffect, useRef, useState } from "react";

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({ to, decimals = 0, prefix = "", suffix = "", duration = 1600 }: { to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const start = performance.now();
        const tick = (now: number) => {
          const t = reduce ? 1 : Math.min(1, (now - start) / duration);
          setValue(to * (1 - Math.pow(1 - t, 4)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {/* Screen readers get the final value straight away */}
      <span className="sr-only">
        {prefix}
        {to.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </span>
      <span aria-hidden="true">
        {prefix}
        {value.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </span>
    </span>
  );
}
