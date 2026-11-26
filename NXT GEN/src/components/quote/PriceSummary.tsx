"use client";

import { useEffect, useRef, useState } from "react";
import { formatGBP, formatRange, type Estimate } from "@/lib/quote/calc";
import { Icon } from "@/components/ui/Icon";

/** Smoothly tweens a number when it changes (skipped under reduced motion). */
function useTweened(target: number, ms = 450) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      const v = origin + (target - origin) * eased;
      from.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return Math.round(value / 10) * 10;
}

const DISCLAIMER =
  "Indicative estimate only, based on the details you've entered. It isn't a formal quotation — your fixed price is confirmed after a free site survey.";

function RangeDisplay({ estimate, large = false }: { estimate: Estimate; large?: boolean }) {
  const min = useTweened(estimate.installRange?.[0] ?? 0);
  const max = useTweened(estimate.installRange?.[1] ?? 0);
  if (!estimate.installRange) {
    return <p className={`font-display font-bold text-white/60 ${large ? "text-2xl" : "text-lg"}`}>Add room sizes to see a price</p>;
  }
  return (
    <p className={`font-display font-extrabold tracking-tight text-white tabular-nums ${large ? "text-3xl xl:text-4xl" : "text-xl"}`}>
      {formatGBP(min)} <span className="font-medium text-brand-300">–</span> {formatGBP(max)}
    </p>
  );
}

function Breakdown({ estimate }: { estimate: Estimate }) {
  return (
    <>
      {estimate.rooms.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Rooms", estimate.rooms.length],
            ["Total kW", estimate.totalKw.toFixed(1)],
            ["BTU/h", estimate.totalBtu.toLocaleString("en-GB")],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-white/5 px-2 py-2.5">
              <p className="font-display text-base font-bold text-white">{v}</p>
              <p className="text-[0.7rem] text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      )}

      {estimate.lines.length > 0 && (
        <dl className="mt-5 space-y-2.5 text-sm">
          {estimate.lines.map((l) => (
            <div key={l.label} className="flex animate-fade-up justify-between gap-4">
              <dt className="text-slate-300">{l.label}</dt>
              <dd className="shrink-0 font-semibold text-white tabular-nums">{formatRange(l.range)}</dd>
            </div>
          ))}
        </dl>
      )}

      {estimate.annualRange && (
        <p className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-brand-500/15 px-3 py-2.5 text-sm text-brand-100">
          <span className="flex items-center gap-2">
            <Icon name="calendar" className="size-4" /> Maintenance plan
          </span>
          <strong className="text-white tabular-nums">{formatRange(estimate.annualRange)}/yr</strong>
        </p>
      )}

      {estimate.notes.map((n) => (
        <p key={n} className="mt-3 flex gap-2 text-xs text-amber-200">
          <Icon name="info" className="size-4 shrink-0" /> {n}
        </p>
      ))}
    </>
  );
}

/** Desktop: sticky sidebar card. */
export function PriceSummary({ estimate }: { estimate: Estimate }) {
  return (
    <aside aria-label="Your live estimate" className="sticky top-28 overflow-hidden rounded-3xl bg-navy-900 text-white shadow-2xl shadow-navy-900/20">
      <div className="relative bg-gradient-to-br from-brand-600 to-navy-900 p-6">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/10" aria-hidden="true" />
        <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-200">
          <span className="size-2 animate-pulse rounded-full bg-emerald-400" /> Live estimate
        </p>
        <div className="relative mt-3" aria-live="polite" aria-atomic="true">
          <RangeDisplay estimate={estimate} large />
          <p className="mt-1 text-sm text-brand-100">Fully installed, inc. VAT</p>
        </div>
      </div>
      <div className="p-6">
        <Breakdown estimate={estimate} />
        <p className="mt-6 flex gap-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-slate-400">
          <Icon name="info" className="size-4 shrink-0" /> {DISCLAIMER}
        </p>
      </div>
    </aside>
  );
}

/** Mobile: fixed bottom bar that expands into a sheet. */
export function MobilePriceBar({ estimate }: { estimate: Estimate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      {open && <button type="button" aria-label="Close estimate details" className="fixed inset-0 bg-navy-950/50" onClick={() => setOpen(false)} />}
      <div className="relative rounded-t-3xl bg-navy-900 text-white shadow-[0_-10px_40px_rgba(7,20,39,0.35)]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-estimate"
          className="flex w-full items-center gap-3 px-5 py-4 text-left"
        >
          <span className="flex-1" aria-live="polite">
            <span className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-300">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Live estimate
            </span>
            <RangeDisplay estimate={estimate} />
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-brand-200">
            {open ? "Hide" : "Details"}
            <Icon name="chevronDown" className={`size-5 transition-transform ${open ? "" : "rotate-180"}`} />
          </span>
        </button>
        <div id="mobile-estimate" hidden={!open} className="max-h-[60dvh] overflow-y-auto border-t border-white/10 px-5 pt-4 pb-6">
          <Breakdown estimate={estimate} />
          <p className="mt-5 text-xs leading-relaxed text-slate-400">{DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
}
