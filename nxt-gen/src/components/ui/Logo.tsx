/**
 * Horizontal NXTGEN lockup, redrawn as SVG from the supplied logo so it stays
 * crisp in the header. Swap for the client's vector logo (e.g. /brand/logo.svg
 * via next/image) once provided.
 */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {/* red ribbon, bottom-left → top-right */}
      <path d="M8 40 L22 26" stroke="#c8202b" strokeWidth="8" strokeLinecap="square" />
      <path d="M26 22 L36 12" stroke="#c8202b" strokeWidth="8" strokeLinecap="square" />
      <path d="M33 6 L43 6 L43 16 Z" fill="#c8202b" />
      {/* blue double arrow, top-left → bottom-right, drawn over the ribbon */}
      <path d="M13 13 L35 35" stroke="#fff" strokeWidth="12" />
      <path d="M13 13 L35 35" stroke="#1a9ad6" strokeWidth="7" />
      <path d="M6 6 L19 8 L8 19 Z" fill="#1a9ad6" />
      <path d="M42 42 L29 40 L40 29 Z" fill="#1a9ad6" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-10 shrink-0 sm:size-11" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.35rem] tracking-tight sm:text-2xl ${inverted ? "text-white" : "text-[#2b2b2b]"}`}>
          <span className="font-extrabold">NXT</span>
          <span className="font-medium">GEN</span>
        </span>
        <span className={`mt-1 text-[0.6rem] font-semibold tracking-[0.22em] ${inverted ? "text-brand-200" : "text-slate-500"}`}>
          AIR CONDITIONING
        </span>
      </span>
    </span>
  );
}
