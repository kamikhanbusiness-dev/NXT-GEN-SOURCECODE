/**
 * Frame-driven illustrations, one per `Visual` kind. Everything animates from
 * useCurrentFrame() (no CSS animations), so renders are deterministic.
 */
import type { CSSProperties, ReactNode } from "react";
import { interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors } from "../brand.ts";
import { fontFamily } from "../fonts.ts";
import type { Theme, Visual } from "../reels.ts";
import { themes } from "../theme.ts";
import { Wordmark } from "./chrome.tsx";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function useAnim() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (delay = 0, damping = 12, stiffness = 170) => spring({ frame: f - delay, fps, config: { damping, stiffness } });
  const lerp = (input: number[], output: number[]) => interpolate(f, input, output, clamp);
  return { f, fps, sp, lerp };
}

const card: CSSProperties = {
  background: "#fff",
  borderRadius: 40,
  boxShadow: "0 30px 70px -20px rgba(7,11,24,.55)",
  color: colors.navy,
  fontFamily,
};

/* ── tiny icon set ─────────────────────────────────────────────────────── */
const ICON = {
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  pin: "M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
  flame: "M12 22c4 0 7-2.9 7-7 0-3.5-2.4-6.3-4-8-.4 2.3-1.6 3.7-3 4.5C12 8 11 5 8.5 2 8 6 5 8.6 5 15c0 4.1 3 7 7 7Z",
  arrow: "M5 12h14m-7-7 7 7-7 7",
};

function Ico({ d, size = 48, color = "currentColor", fill = false, sw = 3 }: { d: string; size?: number; color?: string; fill?: boolean; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <path d={d} fill={fill ? color : "none"} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Snowflake({ size = 60, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24">
      <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none">
        {[0, 60, 120].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0-10V10M-3-7.5 0-5 3-7.5M-3 7.5 0 5 3 7.5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Sun({ size = 120, spin = 0 }: { size?: number; spin?: number }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100">
      <g transform={`rotate(${spin})`} stroke={colors.yellow} strokeWidth="7" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0-34V-46" transform={`rotate(${i * 45})`} />
        ))}
      </g>
      <circle r="24" fill={colors.yellow} />
    </svg>
  );
}

/* ── reusable wall unit ────────────────────────────────────────────────── */
function WallUnit({ w = 640, flow = "#86c5ea", glow = 1, flows = true }: { w?: number; flow?: string; glow?: number; flows?: boolean }) {
  const { f } = useAnim();
  const h = w * 0.62;
  return (
    <svg width={w} height={h} viewBox="0 0 640 400">
      <defs>
        <linearGradient id="unitg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#eef1f5" />
          <stop offset="1" stopColor="#cfd6df" />
        </linearGradient>
      </defs>
      <rect x="20" y="10" width="600" height="170" rx="40" fill="url(#unitg)" stroke="#d5dbe3" strokeWidth="3" />
      <rect x="60" y="150" width="520" height="16" rx="8" fill="#9aa6b5" />
      <circle cx="560" cy="62" r="9" fill={flow} opacity={0.6 + 0.4 * glow} />
      <text x="60" y="72" fontFamily={fontFamily} fontWeight={900} fontSize="30" fill="#2b2b2b">
        NXT<tspan fontWeight={600}>GEN</tspan>
      </text>
      {flows &&
        [0, 1, 2, 3, 4].map((i) => {
          const x = 110 + i * 105;
          return (
            <path
              key={i}
              d={`M${x} 190 q 30 50 0 100 q -30 50 0 100`}
              fill="none"
              stroke={flow}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="60 40"
              strokeDashoffset={-f * 4 - i * 17}
              opacity={0.85}
            />
          );
        })}
    </svg>
  );
}

/* ── visuals ───────────────────────────────────────────────────────────── */
function Heater() {
  const { f, sp } = useAnim();
  const glow = 0.5 + 0.5 * Math.sin(f / 4);
  const no = sp(14, 9, 200);
  return (
    <div style={{ position: "relative", width: 900, height: 680 }}>
      <svg width="900" height="680" viewBox="0 0 900 680" style={{ position: "absolute" }}>
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={250 + i * 58} y={150} width={46} height={360} rx={22} fill={interpolateColors(glow, [0, 1], ["#d9474b", "#ff8a3d"])} stroke="#7d1f22" strokeWidth="4" />
        ))}
        <rect x="240" y="500" width="420" height="30" rx="14" fill="#7d1f22" />
        <rect x="270" y="530" width="30" height="40" fill="#555" />
        <rect x="600" y="530" width="30" height="40" fill="#555" />
        <path d="M250 480 C 160 480 150 600 90 620" stroke="#333" strokeWidth="10" fill="none" />
        <rect x="50" y="600" width="70" height="50" rx="8" fill="#444" />
      </svg>
      {Array.from({ length: 12 }, (_, i) => {
        const t = (f * 1.4 + i * 9) % 70;
        const x = 280 + random(`c${i}`) * 340 + (random(`d${i}`) - 0.5) * t * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 170 - t * 2,
              width: 70,
              height: 70,
              borderRadius: 99,
              background: colors.yellow,
              border: "5px solid #c99a00",
              display: "grid",
              placeItems: "center",
              fontFamily,
              fontWeight: 900,
              fontSize: 40,
              color: "#7a5a00",
              opacity: interpolate(t, [0, 10, 55, 70], [0, 1, 1, 0]),
              transform: `rotate(${t * 6}deg)`,
            }}
          >
            £
          </div>
        );
      })}
      <svg width="620" height="620" viewBox="0 0 100 100" style={{ position: "absolute", left: 140, top: 30, transform: `scale(${no * 1})`, opacity: no }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#fff" strokeWidth="9" />
        <path d="M21 21 79 79" stroke="#fff" strokeWidth="9" />
      </svg>
    </div>
  );
}

function Meter() {
  const { f, lerp } = useAnim();
  const angle = lerp([0, 30], [-110, 95]) + Math.sin(f / 2.5) * 4;
  const cost = Math.floor(lerp([0, 60], [0, 999]));
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [450 + 260 * Math.cos(((a - 90) * Math.PI) / 180), 400 + 260 * Math.sin(((a - 90) * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0} ${y0} A260 260 0 0 1 ${x1} ${y1}`;
  };
  return (
    <svg width="900" height="680" viewBox="0 0 900 680">
      <circle cx="450" cy="400" r="320" fill="#fff" />
      <path d={arc(-120, -40)} stroke="#2fb36b" strokeWidth="44" fill="none" />
      <path d={arc(-40, 40)} stroke={colors.yellow} strokeWidth="44" fill="none" />
      <path d={arc(40, 120)} stroke={colors.red} strokeWidth="44" fill="none" />
      <g transform={`rotate(${angle} 450 400)`}>
        <path d="M440 400 L450 170 L460 400 Z" fill={colors.navy} />
      </g>
      <circle cx="450" cy="400" r="30" fill={colors.navy} />
      <rect x="300" y="470" width="300" height="100" rx="20" fill={colors.navy} />
      <text x="450" y="542" textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize="66" fill={colors.yellow}>
        £{cost.toString().padStart(3, "0")}
      </text>
    </svg>
  );
}

function Thermometer() {
  const { f, lerp } = useAnim();
  const temp = lerp([0, 40], [18, 29]);
  const level = interpolate(temp, [10, 32], [0, 1]);
  const colon = Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{ position: "relative", width: 900, height: 680, display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
      <svg width="220" height="640" viewBox="0 0 220 640">
        <rect x="70" y="20" width="80" height="480" rx="40" fill="#fff" />
        <circle cx="110" cy="540" r="80" fill="#fff" />
        <rect x="88" y={40 + (1 - level) * 440} width="44" height={level * 440 + 40} rx="22" fill={colors.red} />
        <circle cx="110" cy="540" r="60" fill={colors.red} />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x="160" y={60 + i * 50} width="30" height="6" rx="3" fill="#fff" opacity="0.8" />
        ))}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, fontFamily }}>
        <div style={{ fontSize: 200, fontWeight: 900, color: "#fff", lineHeight: 0.9, letterSpacing: -8, textShadow: "0 8px 30px rgba(0,0,0,.25)" }}>
          {Math.round(temp)}°C
        </div>
        <div style={{ ...card, background: colors.navy, color: "#ff5a5f", padding: "20px 40px", fontSize: 110, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: 4, textAlign: "center" }}>
          03<span style={{ opacity: colon ? 1 : 0.15 }}>:</span>00
          <div style={{ fontSize: 32, letterSpacing: 8, color: "#b9def4" }}>AM</div>
        </div>
      </div>
    </div>
  );
}

function AcUnit({ mode, dur }: { mode: "cool" | "heat" | "swap"; dur: number }) {
  const { f, lerp, sp } = useAnim();
  const switchAt = Math.round(dur * 0.45);
  const heat = mode === "heat" ? 1 : mode === "cool" ? 0 : lerp([switchAt, switchAt + 8], [0, 1]);
  const flow = interpolateColors(heat, [0, 1], ["#9fd8ff", colors.orange]);
  const pillPop = mode === "swap" ? sp(switchAt, 9, 220) : 1;
  return (
    <div style={{ position: "relative", width: 900, height: 680, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ transform: `scale(${0.85 + sp(0) * 0.15})` }}>
        <WallUnit w={760} flow={flow} />
      </div>
      {Array.from({ length: 10 }, (_, i) => {
        const t = (f * 2 + i * 13) % 90;
        const x = 120 + random(`p${i}`) * 660;
        const y = heat < 0.5 ? 150 + t * 5 : 560 - t * 4;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: interpolate(t, [0, 15, 75, 90], [0, 1, 1, 0]) }}>
            {heat < 0.5 ? <Snowflake size={46} /> : <Ico d={ICON.flame} size={46} color={colors.yellow} fill />}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "18px 44px",
          borderRadius: 999,
          background: heat < 0.5 ? colors.blue : colors.red,
          color: "#fff",
          fontFamily,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: 2,
          transform: `scale(${0.8 + 0.2 * pillPop})`,
          boxShadow: "0 18px 40px rgba(7,11,24,.35)",
        }}
      >
        {heat < 0.5 ? <Snowflake size={56} /> : <Ico d={ICON.flame} size={56} color={colors.yellow} fill />}
        {heat < 0.5 ? "COOLING" : "HEATING"}
      </div>
    </div>
  );
}

function Bars() {
  const { sp, lerp } = useAnim();
  const a = sp(2, 14, 120);
  const b = sp(10, 14, 90);
  const badge = sp(28, 8, 200);
  const bar = (h: number, color: string, label: string, value: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, fontFamily, color: "#fff" }}>
      <div style={{ fontSize: 76, fontWeight: 900 }}>{value}</div>
      <div style={{ width: 230, height: h, borderRadius: 30, background: color, boxShadow: `0 0 60px ${color}88` }} />
      <div style={{ fontSize: 40, fontWeight: 800, textAlign: "center", lineHeight: 1.1 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "relative", width: 900, height: 680, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 120 }}>
      {bar(110 * a, colors.sky, "Electricity in", `${lerp([2, 20], [0, 1]).toFixed(0)} kW`)}
      {bar(440 * b, colors.orange, "Heat out", `${lerp([10, 40], [0, 4]).toFixed(0)} kW`)}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 40,
          width: 230,
          height: 230,
          borderRadius: 999,
          background: colors.yellow,
          color: colors.navy,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          fontSize: 48,
          lineHeight: 1,
          transform: `scale(${badge}) rotate(${-12 + badge * 0}deg)`,
          boxShadow: "0 18px 40px rgba(0,0,0,.35)",
        }}
      >
        UP TO
        <br />
        <span style={{ fontSize: 100 }}>4×</span>
      </div>
    </div>
  );
}

function Seasons() {
  const { sp, f } = useAnim();
  const box = (d: number, bg: string, icon: ReactNode, month: string, mode: string) => {
    const s = sp(d, 11, 180);
    return (
      <div
        style={{
          ...card,
          width: 380,
          height: 460,
          background: bg,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          transform: `translateY(${(1 - s) * 200}px) rotate(${(1 - s) * 10}deg)`,
          opacity: Math.min(1, s * 2),
        }}
      >
        {icon}
        <div style={{ fontSize: 66, fontWeight: 900, letterSpacing: 1 }}>{month}</div>
        <div style={{ fontSize: 40, fontWeight: 800, padding: "8px 26px", borderRadius: 999, background: "rgba(255,255,255,.22)" }}>{mode}</div>
      </div>
    );
  };
  const pill = sp(22, 10, 200);
  return (
    <div style={{ width: 900, height: 680, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", gap: 40 }}>
        {box(0, `linear-gradient(160deg, ${colors.orange}, ${colors.red})`, <Sun size={150} spin={f * 2} />, "JULY", "Cooling")}
        {box(8, `linear-gradient(160deg, ${colors.sky}, ${colors.blueDark})`, <Snowflake size={150} />, "JANUARY", "Heating")}
      </div>
      <div style={{ ...card, padding: "18px 44px", borderRadius: 999, fontSize: 50, fontWeight: 900, transform: `scale(${pill})`, background: colors.navy, color: "#fff" }}>
        ONE SYSTEM <span style={{ color: colors.yellow }}>·</span> 12 MONTHS
      </div>
    </div>
  );
}

function Badges({ items }: { items: string[] }) {
  const { sp } = useAnim();
  const logo = sp(0, 12, 160);
  return (
    <div style={{ width: 900, height: 980, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
      <div style={{ ...card, padding: "40px 60px", transform: `scale(${0.6 + logo * 0.4})`, marginBottom: 30 }}>
        <Wordmark scale={1.9} />
      </div>
      {items.map((t, i) => {
        const s = sp(8 + i * 7, 12, 190);
        return (
          <div
            key={t}
            style={{
              ...card,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "22px 50px 22px 24px",
              fontSize: 60,
              fontWeight: 900,
              transform: `translateX(${(1 - s) * 900}px)`,
            }}
          >
            <span style={{ width: 84, height: 84, borderRadius: 99, background: colors.red, display: "grid", placeItems: "center" }}>
              <Ico d={ICON.check} size={54} color="#fff" sw={4} />
            </span>
            {t}
          </div>
        );
      })}
    </div>
  );
}

function BigText({ text, sub, theme }: { text: string; sub?: string; theme: Theme }) {
  const { f, sp, lerp } = useAnim();
  const t = themes[theme];
  const numeric = /^[\d,]{3,}\+?$/.test(text);
  let shown: ReactNode;
  if (numeric) {
    const target = Number(text.replace(/[^\d]/g, ""));
    const n = Math.round(lerp([0, 35], [0, target]));
    shown = n.toLocaleString("en-GB") + (text.endsWith("+") ? "+" : "");
  } else {
    shown = [...text].map((ch, i) => (
      <span key={i} style={{ display: "inline-block", transform: `translateY(${Math.sin(f / 4 + i) * 14}px) rotate(${Math.sin(f / 6 + i) * 6}deg)` }}>
        {ch === " " ? " " : ch}
      </span>
    ));
  }
  const s = sp(0, 8, 160);
  const size = text.length <= 2 ? 520 : text.length <= 7 ? 230 : 180;
  return (
    <div style={{ width: 900, height: 900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily, color: t.text }}>
      <div style={{ fontSize: size, fontWeight: 900, lineHeight: 0.9, letterSpacing: -8, transform: `scale(${0.7 + s * 0.3})`, color: text.length <= 2 ? t.hi : t.text, textShadow: "0 14px 50px rgba(0,0,0,.3)" }}>
        {shown}
      </div>
      {sub && (
        <div style={{ marginTop: 30, fontSize: 64, fontWeight: 900, letterSpacing: 10, padding: "10px 36px", borderRadius: 999, background: "rgba(255,255,255,.18)", transform: `translateY(${(1 - sp(8)) * 60}px)` }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PriceCount({ from, to, label }: { from: number; to: number; label: string }) {
  const { sp, lerp } = useAnim();
  const s = sp(0, 12, 160);
  const a = Math.round(lerp([0, 24], [0, from]) / 10) * 10;
  const b = Math.round(lerp([16, 40], [from, to]) / 10) * 10;
  return (
    <div style={{ ...card, width: 860, padding: "50px 40px", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.7 + s * 0.3})` }}>
      <WallUnit w={300} flows={false} />
      <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: 6, color: colors.blue, marginTop: -40 }}>FROM</div>
      <div style={{ fontSize: 190, fontWeight: 900, letterSpacing: -6, color: colors.red, lineHeight: 1 }}>£{a.toLocaleString("en-GB")}</div>
      <div style={{ fontSize: 80, fontWeight: 900, color: colors.navy, opacity: lerp([14, 20], [0, 1]) }}>to ~£{b.toLocaleString("en-GB")}</div>
      <div style={{ marginTop: 20, fontSize: 40, fontWeight: 700, color: "#64748b" }}>{label}</div>
    </div>
  );
}

function MultiSplit() {
  const { f, sp, lerp } = useAnim();
  const rooms = ["Bedroom", "Lounge", "Office", "Kitchen", "Loft"];
  const pos = [
    [110, 230],
    [270, 110],
    [450, 60],
    [630, 110],
    [790, 230],
  ];
  return (
    <div style={{ position: "relative", width: 900, height: 700 }}>
      <svg width="900" height="700" viewBox="0 0 900 700" style={{ position: "absolute" }}>
        {pos.map(([x, y], i) => {
          const p = lerp([4 + i * 5, 18 + i * 5], [0, 1]);
          return <path key={i} d={`M450 520 C 450 420 ${x} ${y + 200} ${x} ${y + 40}`} fill="none" stroke={colors.blue} strokeWidth="10" strokeDasharray="700" strokeDashoffset={700 * (1 - p)} strokeLinecap="round" />;
        })}
        <rect x="330" y="500" width="240" height="170" rx="20" fill="#fff" stroke="#cfd6df" strokeWidth="4" />
        <circle cx="420" cy="585" r="58" fill="#e7ebf0" />
        <g transform={`rotate(${f * 18} 420 585)`}>
          {[0, 120, 240].map((a) => (
            <ellipse key={a} cx="420" cy="555" rx="13" ry="28" fill="#9aa6b5" transform={`rotate(${a} 420 585)`} />
          ))}
        </g>
        <rect x="500" y="530" width="44" height="110" rx="8" fill="#e7ebf0" />
      </svg>
      {pos.map(([x, y], i) => {
        const s = sp(14 + i * 5, 10, 200);
        return (
          <div key={i} style={{ position: "absolute", left: x - 85, top: y - 30, width: 170, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${s})` }}>
            <div style={{ width: 170, height: 62, borderRadius: 18, background: "#fff", boxShadow: "0 10px 24px rgba(7,11,24,.25)", borderBottom: `8px solid ${colors.sky}` }} />
            <div style={{ marginTop: 10, fontFamily, fontWeight: 800, fontSize: 32, color: colors.navy, background: "#fff", padding: "4px 16px", borderRadius: 99 }}>{rooms[i]}</div>
          </div>
        );
      })}
    </div>
  );
}

function PriceTags({ items }: { items: { label: string; price: string }[] }) {
  const { f, sp } = useAnim();
  return (
    <div style={{ width: 900, height: 680, display: "flex", justifyContent: "center", gap: 70 }}>
      {items.map((it, i) => {
        const s = sp(i * 8, 10, 150);
        const swing = Math.sin((f - i * 8) / 7) * 14 * Math.exp(-Math.max(0, f - i * 8) / 35);
        return (
          <div key={it.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", transformOrigin: "50% 0", transform: `translateY(${(1 - s) * -500}px) rotate(${swing}deg)` }}>
            <div style={{ width: 6, height: 140, background: "#fff" }} />
            <div style={{ ...card, width: 360, height: 420, borderRadius: "60px 60px 36px 36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: i ? colors.yellow : "#fff" }}>
              <div style={{ width: 44, height: 44, borderRadius: 99, background: colors.navy, marginBottom: 20 }} />
              <div style={{ fontSize: 50, fontWeight: 800 }}>{it.label}</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: "#64748b" }}>from</div>
              <div style={{ fontSize: 130, fontWeight: 900, color: colors.red, letterSpacing: -4, lineHeight: 1 }}>{it.price}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Stamp({ text, theme }: { text: string; theme: Theme }) {
  const { f, sp } = useAnim();
  const s = sp(4, 9, 220);
  const scale = interpolate(s, [0, 1], [3, 1]);
  const shake = f > 8 && f < 18 ? Math.sin(f * 3) * 10 : 0;
  const c = theme === "ice" ? colors.red : "#fff";
  return (
    <div style={{ width: 900, height: 680, display: "grid", placeItems: "center", transform: `translateX(${shake}px)` }}>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 130,
          letterSpacing: 4,
          color: c,
          border: `14px solid ${c}`,
          outline: `5px solid ${c}`,
          outlineOffset: 10,
          borderRadius: 30,
          padding: "30px 50px",
          textAlign: "center",
          lineHeight: 1,
          transform: `rotate(-8deg) scale(${scale})`,
          opacity: Math.min(1, s * 3),
        }}
      >
        {text}
      </div>
    </div>
  );
}

function SizeGauge() {
  const { sp, f } = useAnim();
  const opts = [
    { label: "TOO SMALL", unit: 150, ok: false },
    { label: "JUST RIGHT", unit: 210, ok: true },
    { label: "TOO BIG", unit: 270, ok: false },
  ];
  const ring = sp(34, 10, 160);
  return (
    <div style={{ width: 900, height: 680, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
      {opts.map((o, i) => {
        const s = sp(i * 9, 11, 190);
        const pulse = o.ok ? 1 + ring * 0.08 + Math.sin(f / 5) * 0.02 * ring : 1 - ring * 0.06;
        return (
          <div
            key={o.label}
            style={{
              ...card,
              width: 280,
              height: 440,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "40px 0",
              transform: `translateY(${(1 - s) * 300}px) scale(${pulse})`,
              opacity: o.ok ? 1 : 1 - ring * 0.35,
              outline: o.ok ? `${10 * ring}px solid ${colors.yellow}` : "none",
            }}
          >
            <div style={{ height: 160, display: "grid", placeItems: "center" }}>
              <WallUnit w={o.unit} flows={false} />
            </div>
            <span style={{ width: 96, height: 96, borderRadius: 99, display: "grid", placeItems: "center", background: o.ok ? "#2fb36b" : colors.red }}>
              <Ico d={o.ok ? ICON.check : ICON.x} size={60} color="#fff" sw={4} />
            </span>
            <div style={{ fontSize: 38, fontWeight: 900 }}>{o.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Certificate() {
  const { f, sp } = useAnim();
  const warn = sp(0, 10, 200);
  const cert = sp(18, 11, 170);
  const shake = Math.sin(f * 1.8) * 4 * (1 - cert);
  return (
    <div style={{ position: "relative", width: 900, height: 680 }}>
      <div style={{ position: "absolute", left: 40, top: 60, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${warn}) translateX(${shake}px) rotate(-6deg)` }}>
        <svg width="360" height="320" viewBox="0 0 100 90">
          <path d="M50 4 96 86H4Z" fill={colors.yellow} stroke={colors.navy} strokeWidth="5" strokeLinejoin="round" />
          <path d="M50 32v24" stroke={colors.navy} strokeWidth="9" strokeLinecap="round" />
          <circle cx="50" cy="70" r="5" fill={colors.navy} />
        </svg>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 46, color: "#fff", marginTop: 10, textAlign: "center" }}>NOT CERTIFIED?</div>
      </div>
      <div
        style={{
          ...card,
          position: "absolute",
          right: 30,
          top: 150,
          width: 470,
          padding: "40px 30px",
          textAlign: "center",
          transform: `translateX(${(1 - cert) * 700}px) rotate(${4 * cert}deg)`,
          border: `10px double ${colors.blue}`,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6, color: "#64748b" }}>CERTIFICATE</div>
        <div style={{ fontSize: 96, fontWeight: 900, color: colors.blue, lineHeight: 1.05 }}>F-GAS</div>
        <div style={{ fontSize: 38, fontWeight: 800 }}>Certified engineers</div>
        <div style={{ margin: "24px auto 0", width: 130, height: 130, borderRadius: 99, background: colors.red, display: "grid", placeItems: "center", boxShadow: `0 0 0 10px ${colors.red}33` }}>
          <Ico d={ICON.check} size={80} color="#fff" sw={4} />
        </div>
      </div>
    </div>
  );
}

function Filter() {
  const { f, sp, lerp } = useAnim();
  const dirt = lerp([0, 30], [0, 0.85]);
  const bar = sp(14, 14, 90);
  return (
    <div style={{ position: "relative", width: 900, height: 680, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
      <div style={{ position: "relative", width: 440, height: 520, borderRadius: 30, overflow: "hidden", border: "16px solid #fff", boxShadow: "0 30px 70px -20px rgba(7,11,24,.55)" }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="mesh" width="22" height="22" patternUnits="userSpaceOnUse">
              <rect width="22" height="22" fill="#eef2f6" />
              <path d="M0 0l22 22M22 0 0 22" stroke="#b9c4d1" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 40%, #6b4a2b, #3d2a18)", opacity: dirt }} />
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: random(`f${i}`) * 400, top: ((random(`g${i}`) * 520 + f * 2) % 520), width: 14, height: 14, borderRadius: 9, background: "#2a1a0c", opacity: dirt }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, fontFamily, color: "#fff" }}>
        <div style={{ fontSize: 110, fontWeight: 900 }}>+{Math.round(30 * bar)}%</div>
        <div style={{ width: 160, height: 380, borderRadius: 30, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <div style={{ width: "100%", height: `${35 + 65 * bar}%`, background: `linear-gradient(0deg, ${colors.yellow}, ${colors.red})`, display: "grid", placeItems: "start center", paddingTop: 20 }}>
            <Ico d={ICON.bolt} size={70} color="#fff" fill />
          </div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 800 }}>energy use</div>
      </div>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  const { sp } = useAnim();
  const s0 = sp(0, 12, 170);
  return (
    <div style={{ ...card, width: 880, padding: "50px 50px", transform: `scale(${0.8 + 0.2 * s0})`, display: "flex", flexDirection: "column", gap: 34 }}>
      {items.map((t, i) => {
        const s = sp(6 + i * 7, 10, 220);
        return (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 54, fontWeight: 800, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 80}px)` }}>
            <span style={{ flexShrink: 0, width: 82, height: 82, borderRadius: 99, background: colors.red, display: "grid", placeItems: "center", transform: `scale(${s})` }}>
              <Ico d={ICON.check} size={52} color="#fff" sw={4} />
            </span>
            {t}
          </div>
        );
      })}
    </div>
  );
}

function AreaMap() {
  const { sp, lerp } = useAnim();
  const pins: [string, number, number][] = [
    ["Mansfield", 470, 90],
    ["Hucknall", 290, 210],
    ["Arnold", 560, 250],
    ["Carlton", 720, 310],
    ["Nottingham", 470, 400],
    ["Beeston", 250, 470],
    ["West Bridgford", 560, 540],
    ["Long Eaton", 140, 600],
  ];
  const river = lerp([0, 25], [0, 1]);
  return (
    <div style={{ position: "relative", width: 900, height: 700 }}>
      <svg width="900" height="700" viewBox="0 0 900 700" style={{ position: "absolute" }}>
        <g stroke="rgba(255,255,255,.35)" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M470 110 L470 400 L560 540" />
          <path d="M290 210 L470 400 L720 330" />
          <path d="M140 600 L250 470 L470 400 L560 250" />
        </g>
        <path d="M0 520 C 200 470 330 560 470 480 S 720 520 900 450" stroke="#bfe6f5" strokeWidth="26" fill="none" strokeLinecap="round" strokeDasharray="1100" strokeDashoffset={1100 * (1 - river)} />
        <text x="30" y="470" fontFamily={fontFamily} fontWeight={800} fontSize="26" fill="#eaf6fb" opacity={river}>
          River Trent
        </text>
      </svg>
      {pins.map(([name, x, y], i) => {
        const s = sp(4 + i * 4, 9, 210);
        const main = name === "Nottingham";
        return (
          <div key={name} style={{ position: "absolute", left: x - 40, top: y - 70, display: "flex", alignItems: "center", gap: 6, transform: `translateY(${(1 - s) * -120}px)`, opacity: Math.min(1, s * 3) }}>
            <Ico d={ICON.pin} size={main ? 96 : 72} color={main ? colors.red : "#fff"} fill sw={1} />
            <span style={{ fontFamily, fontWeight: 800, fontSize: main ? 40 : 30, background: main ? colors.red : "#fff", color: main ? "#fff" : colors.navy, padding: "6px 16px", borderRadius: 99, boxShadow: "0 8px 20px rgba(7,11,24,.25)", whiteSpace: "nowrap" }}>{name}</span>
          </div>
        );
      })}
    </div>
  );
}

function Stars({ size = 110, delay = 0 }: { size?: number; delay?: number }) {
  const { sp } = useAnim();
  return (
    <div style={{ display: "flex", gap: size * 0.12 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const s = sp(delay + i * 4, 9, 240);
        return (
          <div key={i} style={{ transform: `scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * -90}deg)` }}>
            <Ico d={ICON.star} size={size} color={colors.yellow} fill sw={1} />
          </div>
        );
      })}
    </div>
  );
}

function Review({ name, location, quote }: { name: string; location: string; quote: string }) {
  const { sp, f } = useAnim();
  const s = sp(0, 12, 170);
  const ws = quote.split(" ");
  return (
    <div style={{ ...card, width: 880, padding: "50px 54px", transform: `translateX(${(1 - s) * 900}px) rotate(${(1 - s) * 8 - 1.5}deg)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 120, height: 120, borderRadius: 99, background: colors.blue, color: "#fff", display: "grid", placeItems: "center", fontSize: 64, fontWeight: 900 }}>{name[0]}</div>
        <div>
          <div style={{ fontSize: 56, fontWeight: 900 }}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 36, fontWeight: 700, color: "#64748b" }}>
            <Ico d={ICON.pin} size={36} color={colors.red} fill sw={1} /> {location}
          </div>
        </div>
      </div>
      <div style={{ margin: "26px 0 20px" }}>
        <Stars size={74} delay={6} />
      </div>
      <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.22 }}>
        “
        {ws.map((w, i) => (
          <span key={i} style={{ opacity: interpolate(f, [8 + i * 1.3, 12 + i * 1.3], [0.12, 1], clamp) }}>
            {w}{" "}
          </span>
        ))}
        ”
      </div>
      <div style={{ marginTop: 20, fontSize: 30, fontWeight: 800, letterSpacing: 4, color: colors.blue }}>CUSTOMER REVIEW</div>
    </div>
  );
}

function Rating() {
  const { sp, lerp } = useAnim();
  const tags = ["F-Gas certified", "Fully insured"];
  return (
    <div style={{ width: 900, height: 980, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, fontFamily, color: "#fff" }}>
      <div style={{ fontSize: 300, fontWeight: 900, lineHeight: 0.9, letterSpacing: -10 }}>{lerp([0, 30], [0, brand.rating]).toFixed(1)}</div>
      <Stars size={130} delay={4} />
      <div style={{ fontSize: 52, fontWeight: 800 }}>{brand.reviewCount} Google reviews</div>
      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        {tags.map((t, i) => (
          <div key={t} style={{ ...card, borderRadius: 999, padding: "16px 34px", fontSize: 42, fontWeight: 900, transform: `scale(${sp(26 + i * 6, 10, 200)})` }}>
            ✓ {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function Bedroom() {
  const { f } = useAnim();
  const colon = Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{ ...card, width: 880, height: 680, overflow: "hidden", background: "linear-gradient(180deg,#2a2350,#171a33)" }}>
      <svg width="880" height="680" viewBox="0 0 880 680">
        <rect x="80" y="70" width="300" height="250" rx="12" fill="#0d1030" stroke="#5c5891" strokeWidth="10" />
        <path d="M230 70v250M80 195h300" stroke="#5c5891" strokeWidth="8" />
        <circle cx="300" cy="135" r="38" fill="#fff6c8" />
        <circle cx="318" cy="122" r="34" fill="#0d1030" />
        {[
          [120, 110],
          [180, 250],
          [340, 270],
          [150, 160],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4 + (Math.sin(f / 6 + i) + 1) * 2} fill="#fff" />
        ))}
        <rect x="60" y="430" width="620" height="170" rx="30" fill="#c8363a" />
        <rect x="60" y="400" width="200" height="90" rx="40" fill="#f1f3f6" />
        <path d="M250 430 q 120 -50 430 0 v 40 H250Z" fill="#e5484d" />
        <rect x="60" y="590" width="30" height="60" fill="#5c5891" />
        <rect x="650" y="590" width="30" height="60" fill="#5c5891" />
        <g transform="translate(740 330)">
          <rect x="-6" y="0" width="12" height="230" fill="#9aa6b5" />
          <circle r="70" fill="none" stroke="#9aa6b5" strokeWidth="6" />
          <g transform={`rotate(${f * 40})`}>
            {[0, 120, 240].map((a) => (
              <ellipse key={a} cx="0" cy="-36" rx="16" ry="34" fill="#cfd6df" transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r="12" fill="#5c5891" />
        </g>
        {[0, 1, 2, 3].map((i) => {
          const t = (f * 2 + i * 22) % 90;
          return <path key={i} d={`M${220 + i * 110} ${400 - t * 3} q 18 -25 0 -50 q -18 -25 0 -50`} stroke={colors.orange} strokeWidth="9" fill="none" strokeLinecap="round" opacity={interpolate(t, [0, 20, 70, 90], [0, 0.9, 0.9, 0])} />;
        })}
        <rect x="470" y="70" width="320" height="140" rx="22" fill="#000" stroke="#3a3f5a" strokeWidth="6" />
        <text x="630" y="172" textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize="100" fill="#ff5a5f">
          3{colon ? ":" : " "}07
        </text>
      </svg>
    </div>
  );
}

function Calendar({ mode }: { mode: "booked" | "open" }) {
  const { sp } = useAnim();
  const booked = mode === "booked";
  const s0 = sp(0, 12, 170);
  const stamp = sp(30, 9, 220);
  const days = Array.from({ length: 35 }, (_, i) => i);
  const openDays = new Set([1, 2, 4, 8, 9, 10, 11, 15, 16, 18, 22, 23, 24, 25, 29, 30, 31]);
  return (
    <div style={{ position: "relative", width: 880, height: 700, display: "grid", placeItems: "center" }}>
      <div style={{ ...card, width: 840, padding: "34px 40px", transform: `scale(${0.8 + 0.2 * s0})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 58, fontWeight: 900, color: booked ? colors.red : colors.blue }}>{booked ? "JULY" : "NOVEMBER"}</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#64748b" }}>Install dates</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
          {days.map((d) => {
            const s = sp(4 + d * (booked ? 0.7 : 0.9), 12, 240);
            const isOpen = !booked && openDays.has(d);
            const taken = booked && d % 7 !== 6;
            return (
              <div
                key={d}
                style={{
                  height: 84,
                  borderRadius: 16,
                  background: taken ? (s > 0.5 ? "#fde2e3" : "#f1f3f6") : isOpen ? (s > 0.5 ? "#dff5e8" : "#f1f3f6") : "#f1f3f6",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#94a3b8",
                }}
              >
                {taken || isOpen ? (
                  <span style={{ transform: `scale(${s})` }}>
                    <Ico d={taken ? ICON.x : ICON.check} size={50} color={taken ? colors.red : "#2fb36b"} sw={4} />
                  </span>
                ) : (
                  d + 1 <= 31 ? d + 1 : ""
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          fontFamily,
          fontWeight: 900,
          fontSize: booked ? 110 : 64,
          color: "#fff",
          background: booked ? colors.red : "#2fb36b",
          padding: booked ? "16px 40px" : "20px 44px",
          borderRadius: booked ? 22 : 999,
          border: booked ? "8px solid #fff" : "none",
          transform: `rotate(${booked ? -10 : 0}deg) scale(${booked ? interpolate(stamp, [0, 1], [2.6, 1]) : stamp}) translateY(${booked ? 0 : 330}px)`,
          opacity: Math.min(1, stamp * 3),
          boxShadow: "0 20px 50px rgba(7,11,24,.4)",
          whiteSpace: "nowrap",
        }}
      >
        {booked ? "FULLY BOOKED" : "✓ Dates free this month"}
      </div>
    </div>
  );
}

function Cta({ line }: { line: string }) {
  const { f, sp } = useAnim();
  const logo = sp(0, 11, 170);
  const btn = sp(8, 9, 200);
  const pulse = 1 + Math.sin(f / 5) * 0.035;
  const ripple = (f % 30) / 30;
  return (
    <div style={{ width: 960, height: 1040, display: "flex", flexDirection: "column", alignItems: "center", fontFamily, color: "#fff" }}>
      <div style={{ ...card, padding: "44px 64px", transform: `scale(${0.6 + 0.4 * logo})` }}>
        <Wordmark scale={2} />
      </div>
      <div style={{ marginTop: 56, fontSize: 66, fontWeight: 900, textAlign: "center", textTransform: "uppercase", letterSpacing: -1, lineHeight: 1.05 }}>{line}</div>
      <div style={{ position: "relative", marginTop: 50 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `6px solid ${colors.yellow}`, transform: `scale(${1 + ripple * 0.25})`, opacity: 1 - ripple }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: colors.red,
            padding: "34px 60px",
            borderRadius: 999,
            fontSize: 54,
            fontWeight: 900,
            boxShadow: "0 24px 60px rgba(200,54,58,.55)",
            transform: `scale(${btn * pulse})`,
            border: "5px solid #fff",
          }}
        >
          GET MY ESTIMATE <Ico d={ICON.arrow} size={60} color="#fff" sw={3.5} />
        </div>
      </div>
      <div style={{ marginTop: 60, fontSize: 50, fontWeight: 800, opacity: sp(14) }}>{brand.domain}</div>
      <div style={{ marginTop: 10, fontSize: 46, fontWeight: 700, opacity: sp(18), color: "#b9def4" }}>☎ {brand.phone} · Nottingham</div>
    </div>
  );
}

export function VisualView({ visual, theme, dur }: { visual: Visual; theme: Theme; dur: number }) {
  switch (visual.kind) {
    case "heater":
      return <Heater />;
    case "meter":
      return <Meter />;
    case "thermometer":
      return <Thermometer />;
    case "acunit":
      return <AcUnit mode={visual.mode} dur={dur} />;
    case "bars":
      return <Bars />;
    case "seasons":
      return <Seasons />;
    case "badges":
      return <Badges items={visual.items} />;
    case "bigText":
      return <BigText text={visual.text} sub={visual.sub} theme={theme} />;
    case "priceCount":
      return <PriceCount from={visual.from} to={visual.to} label={visual.label} />;
    case "multisplit":
      return <MultiSplit />;
    case "priceTags":
      return <PriceTags items={visual.items} />;
    case "stamp":
      return <Stamp text={visual.text} theme={theme} />;
    case "sizeGauge":
      return <SizeGauge />;
    case "certificate":
      return <Certificate />;
    case "filter":
      return <Filter />;
    case "checklist":
      return <Checklist items={visual.items} />;
    case "map":
      return <AreaMap />;
    case "review":
      return <Review name={visual.name} location={visual.location} quote={visual.quote} />;
    case "stars":
      return <Rating />;
    case "bedroom":
      return <Bedroom />;
    case "calendar":
      return <Calendar mode={visual.mode} />;
    case "cta":
      return <Cta line={visual.line} />;
  }
}
