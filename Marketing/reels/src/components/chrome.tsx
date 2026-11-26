/** Frame-level pieces shared by every reel: background, logo, title, captions, progress. */
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../brand.ts";
import { fontFamily } from "../fonts.ts";
import { words, type Word } from "../rich.ts";
import type { Theme } from "../reels.ts";
import { themes } from "../theme.ts";

export function LogoMark({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <path d="M8 40 L22 26" stroke={colors.logoRed} strokeWidth="8" strokeLinecap="square" />
      <path d="M26 22 L36 12" stroke={colors.logoRed} strokeWidth="8" strokeLinecap="square" />
      <path d="M33 6 L43 6 L43 16 Z" fill={colors.logoRed} />
      <path d="M13 13 L35 35" stroke="#fff" strokeWidth="12" />
      <path d="M13 13 L35 35" stroke={colors.logoBlue} strokeWidth="7" />
      <path d="M6 6 L19 8 L8 19 Z" fill={colors.logoBlue} />
      <path d="M42 42 L29 40 L40 29 Z" fill={colors.logoBlue} />
    </svg>
  );
}

export function Wordmark({ scale = 1, dark = true }: { scale?: number; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 * scale, fontFamily }}>
      <LogoMark size={62 * scale} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: 40 * scale, color: dark ? "#2b2b2b" : "#fff", letterSpacing: -1 }}>
          <b style={{ fontWeight: 900 }}>NXT</b>
          <span style={{ fontWeight: 600 }}>GEN</span>
        </span>
        <span style={{ fontSize: 12.5 * scale, fontWeight: 700, letterSpacing: 4 * scale, marginTop: 5 * scale, color: dark ? "#64748b" : "#b9def4" }}>
          AIR CONDITIONING
        </span>
      </div>
    </div>
  );
}

/** Small white logo pill, top-left — present on every frame for brand recall. */
export function LogoPill() {
  return (
    <div
      style={{
        position: "absolute",
        top: 92,
        left: 60,
        background: "#fff",
        borderRadius: 999,
        padding: "12px 30px 12px 18px",
        boxShadow: "0 10px 30px rgba(7,11,24,.25)",
      }}
    >
      <Wordmark scale={0.82} />
    </div>
  );
}

/** Story-style segmented progress bar: nudges viewers to watch to the end. */
export function Progress({ starts, total }: { starts: number[]; total: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 48, left: 60, right: 60, display: "flex", gap: 10 }}>
      {starts.map((s, i) => {
        const end = starts[i + 1] ?? total;
        const p = interpolate(frame, [s, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ flex: 1, height: 9, borderRadius: 9, background: "rgba(255,255,255,.35)", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.25)" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: "#fff" }} />
          </div>
        );
      })}
    </div>
  );
}

export function Background({ theme, seed }: { theme: Theme; seed: string }) {
  const frame = useCurrentFrame();
  const t = themes[theme];
  const angle = 160 + Math.sin(frame / 40) * 12;
  const blobX = 50 + Math.sin(frame / 35) * 18;
  const blobY = 35 + Math.cos(frame / 45) * 10;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, ${t.bg[0]}, ${t.bg[1]})` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${blobX}% ${blobY}%, ${t.glow}55, transparent 45%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${100 - blobX}% 85%, ${t.glow}33, transparent 40%)` }} />
      {Array.from({ length: 26 }, (_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const speed = 1.2 + random(`${seed}s${i}`) * 2.6;
        const size = 6 + random(`${seed}z${i}`) * 16;
        const dir = t.particle === "snow" ? 1 : -1;
        const y = (((random(`${seed}y${i}`) * 2100 + dir * frame * speed) % 2100) + 2100) % 2100 - 90;
        const sway = Math.sin(frame / 22 + i) * 22;
        return t.particle === "snow" ? (
          <svg key={i} width={size * 2} height={size * 2} viewBox="-12 -12 24 24" style={{ position: "absolute", left: x + sway, top: y, opacity: 0.35, transform: `rotate(${frame * speed}deg)` }}>
            <path d="M0-10V10M-8.7-5 8.7 5M-8.7 5 8.7-5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        ) : (
          <div key={i} style={{ position: "absolute", left: x + sway, top: y, width: size * 0.8, height: size * 0.8, borderRadius: 99, background: colors.yellow, opacity: 0.35, filter: "blur(1px)" }} />
        );
      })}
    </AbsoluteFill>
  );
}

function RichWord({ w, hi, plain }: { w: Word; hi: string; plain: string }) {
  return <span style={{ color: w.hi ? hi : plain }}>{w.text}</span>;
}

/** Big headline in the top third. Springs in, never starts invisible (frame 0 is the thumbnail). */
export function Title({ text, theme }: { text: string; theme: Theme }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = themes[theme];
  const ws = words(text);
  return (
    <div style={{ position: "absolute", top: 250, left: 70, right: 70, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: -3, textTransform: "uppercase" }}>
      {ws.map((w, i) => {
        const s = spring({ frame: frame - i * 2, fps, config: { damping: 11, stiffness: 190 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - s) * 50}px) scale(${0.7 + s * 0.3})`,
              textShadow: theme === "ice" ? "none" : "0 6px 24px rgba(7,11,24,.35)",
              marginRight: 24,
            }}
          >
            <RichWord w={w} hi={t.hi} plain={t.text} />
          </span>
        );
      })}
    </div>
  );
}

/** Kinetic captions: 1–3 word chunks timed across the spoken line. 85% of reels are watched muted. */
export function Captions({ text, speechFrames, wordFrames }: { text: string; speechFrames: number; wordFrames: number[] | null }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ws = words(text);

  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of ws) {
    cur.push(w);
    const len = cur.map((c) => c.text).join(" ").length;
    if (cur.length >= 3 || len > 13 || /[.,!?:;]$/.test(w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);

  // Weight by characters plus a pause allowance for punctuation.
  const weight = (c: Word[]) => c.reduce((n, w) => n + w.text.length + 1 + (/[.,!?:;]$/.test(w.text) ? 5 : 0), 0);
  const totalW = chunks.reduce((n, c) => n + weight(c), 0);
  let acc = 0;
  let wi = 0;
  const exact = wordFrames && wordFrames.length === ws.length;
  const startsAt = chunks.map((c) => {
    const s = exact ? wordFrames[wi] : (acc / totalW) * speechFrames;
    acc += weight(c);
    wi += c.length;
    return s;
  });
  let idx = startsAt.findIndex((s, i) => frame >= s && frame < (startsAt[i + 1] ?? Infinity));
  if (idx < 0) idx = 0;
  const chunk = chunks[idx];
  const local = frame - startsAt[idx];
  const s = spring({ frame: local, fps, config: { damping: 10, stiffness: 260 } });

  return (
    <div style={{ position: "absolute", top: 1330, left: 90, right: 150, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 82,
          lineHeight: 1.05,
          textAlign: "center",
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: -1.5,
          padding: "18px 34px 22px",
          borderRadius: 28,
          background: "rgba(7,11,24,.78)",
          boxShadow: "0 18px 40px rgba(7,11,24,.35)",
          transform: `scale(${0.82 + s * 0.18}) rotate(${(1 - s) * -3}deg)`,
        }}
      >
        {chunk.map((w, i) => (
          <span key={i} style={{ color: w.hi ? colors.yellow : "#fff" }}>
            {w.text}
            {i < chunk.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Quick white flash on each cut — a cheap, effective pattern interrupt. */
export function CutFlash() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5], [0.45, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
}
