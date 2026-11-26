"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/primitives";
import { Card } from "@/components/ui/card";

type Review = { name: string; location: string; text: string; job: string };

/** Auto-advancing review carousel. Pauses on hover/focus; arrows, dots and swipe supported. */
export function ReviewSlider({ reviews }: { reviews: readonly Review[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const go = useCallback((d: number) => setIndex((i) => (i + d + reviews.length) % reviews.length), [reviews.length]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
    >
      <div className="overflow-hidden rounded-[2rem]">
        <ul className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
          {reviews.map((r, i) => (
            <li
              key={r.name}
              className="w-full shrink-0 px-1"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${reviews.length}`}
              aria-hidden={i !== index}
            >
              <Card className="relative gap-0 rounded-[2rem] px-7 py-10 text-center text-base shadow-[0_20px_50px_-20px_rgba(28,32,51,0.3)] ring-0 sm:px-16 sm:py-14">
              <figure>
                <Icon name="quote" className="mx-auto size-12 text-brand-200" />
                <div className="mt-4 flex justify-center">
                  <Stars className="size-6" />
                </div>
                <blockquote className="mx-auto mt-6 max-w-3xl font-display text-xl leading-relaxed font-semibold text-navy-900 sm:text-2xl">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-center gap-1">
                  <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-accent-600 to-brand-400 font-display text-xl font-bold text-white">
                    {r.name[0]}
                  </span>
                  <span className="mt-2 font-bold text-navy-900">{r.name}</span>
                  <span className="text-sm text-ink/70">
                    {r.location} · {r.job}
                  </span>
                </figcaption>
              </figure>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid size-12 place-items-center rounded-full bg-white text-navy-900 shadow-md transition-all hover:-translate-x-0.5 hover:bg-accent-600 hover:text-white">
          <Icon name="arrowLeft" />
        </button>
        <div className="flex gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review ${i + 1}`}
              aria-current={i === index}
              className={`h-3 rounded-full transition-all duration-300 ${i === index ? "w-10 bg-accent-600" : "w-3 bg-navy-900/20 hover:bg-navy-900/40"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid size-12 place-items-center rounded-full bg-white text-navy-900 shadow-md transition-all hover:translate-x-0.5 hover:bg-accent-600 hover:text-white">
          <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  );
}
