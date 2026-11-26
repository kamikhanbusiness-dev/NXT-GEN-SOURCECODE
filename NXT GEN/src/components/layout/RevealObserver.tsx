"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * "Pop up as you scroll" for any element marked `data-reveal="up|pop|left|right|zoom"`.
 *
 * Uses the Web Animations API (`element.animate`) instead of toggling classes,
 * so it never changes attributes React rendered — no hydration mismatches,
 * even for sections that hydrate later. Elements start fully visible (nothing
 * hides without JS); ones below the fold play an entrance animation the
 * moment they reach the viewport. Optional stagger: `style={revealDelay(ms)}`.
 */
const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const variants: Record<string, { from: string; easing: string; duration: number }> = {
  up: { from: "translateY(48px)", easing: EASE, duration: 800 },
  left: { from: "translateX(-72px)", easing: EASE, duration: 850 },
  right: { from: "translateX(72px)", easing: EASE, duration: 850 },
  zoom: { from: "scale(0.92)", easing: EASE, duration: 800 },
  pop: { from: "scale(0.7) translateY(30px)", easing: BOUNCE, duration: 700 },
};

function play(el: HTMLElement) {
  const v = variants[el.dataset.reveal || "up"] ?? variants.up;
  const delay = parseFloat(getComputedStyle(el).getPropertyValue("--reveal-delay")) || 0;
  el.animate(
    [
      { opacity: 0, transform: v.from },
      { opacity: 1, transform: "none" },
    ],
    { duration: v.duration, delay, easing: v.easing, fill: "backwards" },
  );
}

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          play(entry.target as HTMLElement);
        }
      },
      { threshold: 0 },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Skip hidden elements and anything already on screen — animating those
      // would make visible content blink.
      if (rect.height === 0 || rect.top < window.innerHeight) return;
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
