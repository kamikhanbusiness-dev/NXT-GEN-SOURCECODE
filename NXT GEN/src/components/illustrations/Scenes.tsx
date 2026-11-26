/**
 * Illustrated "photo" cards. They stand in for real photography in the
 * prototype — replace any <Scene /> with
 *   <Image src="/images/your-photo.jpg" alt="…" fill className="object-cover" />
 * inside the same rounded frame once the client supplies photos.
 */
import type { ReactNode } from "react";

export type SceneName = "remote" | "angled" | "outdoor" | "service" | "van" | "office";

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="group relative overflow-hidden rounded-[1.25rem] bg-white shadow-[0_24px_60px_-20px_rgba(28,32,51,0.45)] ring-1 ring-black/5">
      <svg viewBox="0 0 600 640" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" role="img" aria-label={label}>
        <defs>
          <linearGradient id="wall" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f3f5f8" />
            <stop offset="1" stopColor="#d9dee6" />
          </linearGradient>
          <linearGradient id="unit" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.7" stopColor="#f1f3f6" />
            <stop offset="1" stopColor="#d8dde5" />
          </linearGradient>
          <linearGradient id="skyfade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#bfe6f5" />
            <stop offset="1" stopColor="#eaf6fb" />
          </linearGradient>
          <pattern id="brick" width="60" height="30" patternUnits="userSpaceOnUse">
            <rect width="60" height="30" fill="#b9553f" />
            <path d="M0 15h60M30 0v15M0 15v15M60 15v15" stroke="#d9b8a6" strokeWidth="2" />
          </pattern>
          <pattern id="fins" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#2b7fb1" />
            <path d="M0 0v8" stroke="#7fc3e8" strokeWidth="2" />
          </pattern>
          <pattern id="mesh" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#f6f8fa" />
            <path d="M0 0l10 10M10 0 0 10" stroke="#c9d3de" strokeWidth="1" />
          </pattern>
        </defs>
        {children}
      </svg>
    </figure>
  );
}

function Airflow({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={x + (i * w) / 6 + w / 12}
          y={y}
          width={5}
          height={70}
          rx={2.5}
          fill="#9fd4f0"
          className="origin-top animate-blow"
          style={{ animationDelay: `${i * 0.25}s`, transformBox: "fill-box" }}
        />
      ))}
    </g>
  );
}

function IndoorUnit({ x, y, w = 420 }: { x: number; y: number; w?: number }) {
  const h = w * 0.27;
  return (
    <g>
      <rect x={x + 6} y={y + 14} width={w} height={h} rx={22} fill="#000" opacity={0.08} />
      <rect x={x} y={y} width={w} height={h} rx={22} fill="url(#unit)" stroke="#d3d9e2" />
      <rect x={x} y={y + h * 0.72} width={w} height={h * 0.28} rx={0} fill="#e3e8ee" />
      <rect x={x + w * 0.08} y={y + h * 0.8} width={w * 0.84} height={h * 0.09} rx={4} fill="#5b6576" />
      <rect x={x + w * 0.74} y={y + h * 0.24} width={w * 0.12} height={h * 0.2} rx={5} fill="#1c2033" />
      <text x={x + w * 0.8} y={y + h * 0.39} textAnchor="middle" fontSize={h * 0.13} fontWeight="700" fill="#7fd0f5" fontFamily="var(--font-roboto)">
        21°
      </text>
      <text x={x + w * 0.07} y={y + h * 0.36} fontSize={h * 0.14} fontWeight="800" fill="#2b2b2b" fontFamily="var(--font-montserrat)">
        NXT<tspan fontWeight="500">GEN</tspan>
      </text>
      <circle cx={x + w * 0.9} cy={y + h * 0.34} r={4} fill="#4aa1d8" />
    </g>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[-40, -15, 10, 35].map((r, i) => (
        <ellipse key={i} cx={x} cy={y - 60} rx={16} ry={64} fill={i % 2 ? "#5d9b48" : "#78b45c"} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d={`M${x - 36} ${y} h72 l-10 70 h-52 Z`} fill="#1c2033" />
    </g>
  );
}

const scenes: Record<SceneName, { label: string; body: ReactNode }> = {
  remote: {
    label: "Wall-mounted air conditioner set to 21 degrees",
    body: (
      <>
        <rect width="600" height="640" fill="url(#wall)" />
        <rect x="0" y="560" width="600" height="80" fill="#cfd6df" />
        <IndoorUnit x={90} y={110} />
        <Airflow x={110} y={232} w={380} />
        <Plant x={70} y={520} />
        {/* remote */}
        <g className="origin-center animate-float" style={{ transformBox: "fill-box" }}>
          <g transform="rotate(-18 420 470)">
            <rect x="380" y="380" width="80" height="190" rx="22" fill="#f8fafc" stroke="#cfd6df" strokeWidth="3" />
            <rect x="394" y="400" width="52" height="40" rx="6" fill="#1c2033" />
            <text x="420" y="428" textAnchor="middle" fontSize="20" fontWeight="700" fill="#7fd0f5" fontFamily="var(--font-roboto)">
              21°
            </text>
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => <circle key={`${r}${c}`} cx={405 + c * 30} cy={470 + r * 28} r={9} fill={r === 0 && c === 0 ? "#c8363a" : "#dfe5ec"} />),
            )}
          </g>
        </g>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${398 - i * 6} ${360 - i * 28} q 20 -20 40 0`} fill="none" stroke="#4aa1d8" strokeWidth="4" strokeLinecap="round" opacity={0.8 - i * 0.2} transform="rotate(-30 420 330)" />
        ))}
      </>
    ),
  },
  angled: {
    label: "Close-up of a sleek white indoor air conditioning unit",
    body: (
      <>
        <rect width="600" height="640" fill="url(#wall)" />
        <path d="M0 0 L600 0 L600 120 L0 300 Z" fill="#ffffff" opacity="0.5" />
        <g transform="rotate(-24 300 320)">
          <rect x="40" y="250" width="620" height="170" rx="40" fill="#000" opacity="0.07" />
          <rect x="20" y="220" width="620" height="170" rx="40" fill="url(#unit)" stroke="#d3d9e2" strokeWidth="2" />
          <path d="M20 340 h620 v10 a40 40 0 0 1 -40 40 h-540 a40 40 0 0 1 -40 -40 Z" fill="#dfe4eb" />
          <rect x="70" y="352" width="520" height="14" rx="7" fill="#4b5465" />
          <rect x="70" y="352" width="520" height="5" rx="2.5" fill="#1c2033" />
          <rect x="520" y="250" width="70" height="40" rx="8" fill="#e9edf2" />
        </g>
        <Airflow x={160} y={430} w={300} />
      </>
    ),
  },
  outdoor: {
    label: "Outdoor air conditioning condenser mounted on a brick wall",
    body: (
      <>
        <rect width="600" height="640" fill="url(#brick)" />
        <rect x="0" y="560" width="600" height="80" fill="#7c8aa6" />
        <rect x="0" y="548" width="600" height="14" fill="#9aa6bd" />
        {/* pipes into wall */}
        <path d="M470 60 V230 Q470 250 450 250 H420" stroke="#f4f4f4" strokeWidth="26" fill="none" strokeLinecap="round" />
        <rect x="455" y="40" width="30" height="30" rx="6" fill="#e6e9ee" />
        {/* bracket */}
        <path d="M110 420 V470 M410 420 V470" stroke="#4b5465" strokeWidth="10" />
        <path d="M90 470 H430" stroke="#4b5465" strokeWidth="10" />
        {/* condenser */}
        <rect x="96" y="210" width="330" height="214" rx="14" fill="#f4f6f9" stroke="#c9d1dc" strokeWidth="3" />
        <circle cx="230" cy="317" r="84" fill="#2b313f" />
        <circle cx="230" cy="317" r="84" fill="none" stroke="#c9d1dc" strokeWidth="6" />
        <g className="origin-center animate-[spin_1.6s_linear_infinite]" style={{ transformBox: "fill-box" }}>
          {[0, 120, 240].map((r) => (
            <path key={r} d="M230 317 C 250 270, 290 270, 296 300 C 280 310, 250 315, 230 317 Z" fill="#8c97ab" transform={`rotate(${r} 230 317)`} />
          ))}
          <circle cx="230" cy="317" r="12" fill="#cfd6df" />
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={146 + i * 0} y1={317 - 84 + i * 33} x2={314} y2={317 - 84 + i * 33} stroke="#c9d1dc" strokeWidth="2" opacity="0.5" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x="340" y={236 + i * 17} width="66" height="7" rx="3" fill="#dde3ea" />
        ))}
        <text x="112" y="240" fontSize="14" fontWeight="800" fill="#2b2b2b" fontFamily="var(--font-montserrat)">
          NXT<tspan fontWeight="500">GEN</tspan>
        </text>
      </>
    ),
  },
  service: {
    label: "Engineer servicing an air conditioner with the filter removed",
    body: (
      <>
        <rect width="600" height="640" fill="url(#wall)" />
        <rect x="70" y="120" width="460" height="150" rx="24" fill="url(#unit)" stroke="#d3d9e2" strokeWidth="2" />
        <rect x="100" y="150" width="400" height="80" rx="8" fill="url(#fins)" />
        {/* lifted front panel */}
        <g transform="rotate(-14 70 120)">
          <rect x="70" y="40" width="460" height="90" rx="22" fill="#ffffff" stroke="#d3d9e2" strokeWidth="2" opacity="0.95" />
        </g>
        {/* filter being removed */}
        <g className="animate-float" style={{ transformBox: "fill-box" }}>
          <rect x="250" y="300" width="250" height="110" rx="10" fill="url(#mesh)" stroke="#9aa6bd" strokeWidth="4" />
          <rect x="350" y="296" width="50" height="14" rx="5" fill="#9aa6bd" />
        </g>
        {/* tools */}
        <g transform="rotate(32 160 470)">
          <rect x="140" y="380" width="32" height="170" rx="10" fill="#c8363a" />
          <path d="M156 380 c -40 -10 -40 -60 -10 -70 v 30 h 20 v -30 c 30 10 30 60 -10 70 Z" fill="#8c97ab" />
        </g>
        <g>
          <rect x="420" y="470" width="70" height="110" rx="14" fill="#4aa1d8" />
          <rect x="436" y="440" width="38" height="34" rx="6" fill="#1c2033" />
          <path d="M474 450 h40 v14 h-40" fill="#1c2033" />
          <rect x="432" y="505" width="46" height="34" rx="6" fill="#ffffff" opacity="0.85" />
        </g>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={530 + i * 18} cy={448 - i * 10} r={5 - i} fill="#9fd4f0" opacity={0.8} />
        ))}
      </>
    ),
  },
  van: {
    label: "NXTGEN branded service van",
    body: (
      <>
        <rect width="600" height="640" fill="url(#skyfade)" />
        {[60, 170, 300, 420, 540].map((x, i) => (
          <circle key={x} cx={x} cy={300 - (i % 2) * 30} r={70 + (i % 3) * 14} fill={i % 2 ? "#6aa64c" : "#7fb35a"} />
        ))}
        <rect x="0" y="380" width="600" height="260" fill="#8a96ad" />
        <rect x="0" y="380" width="600" height="10" fill="#a9b3c6" />
        {/* van body */}
        <path d="M40 270 h360 q30 0 50 26 l70 84 q20 6 20 30 v70 q0 14 -14 14 h-512 q-14 0 -14 -14 v-196 q0 -14 14 -14 Z" fill="#ffffff" stroke="#cfd6df" strokeWidth="3" />
        <path d="M402 290 l58 74 h-74 v-74 Z" fill="#cfe9f7" stroke="#1c2033" strokeWidth="4" />
        <rect x="26" y="420" width="560" height="54" fill="#1c2033" />
        {/* livery swoosh */}
        <path d="M200 474 C 260 380, 330 330, 386 300 L 386 474 Z" fill="#c8363a" />
        <path d="M240 474 C 300 410, 350 370, 386 350 L 386 474 Z" fill="#4aa1d8" />
        <text x="60" y="340" fontSize="38" fontWeight="800" fill="#2b2b2b" fontFamily="var(--font-montserrat)">
          NXT<tspan fontWeight="500">GEN</tspan>
        </text>
        <text x="62" y="368" fontSize="13" fontWeight="700" letterSpacing="4" fill="#64748b" fontFamily="var(--font-roboto)">
          AIR CONDITIONING
        </text>
        <text x="62" y="455" fontSize="20" fontWeight="700" fill="#ffffff" fontFamily="var(--font-roboto)">
          nxtgen-aircon.co.uk
        </text>
        {[130, 470].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={492} r={46} fill="#1c2033" />
            <circle cx={cx} cy={492} r={20} fill="#c4ccd8" />
          </g>
        ))}
      </>
    ),
  },
  office: {
    label: "Ceiling cassette air conditioning in a modern office",
    body: (
      <>
        <rect width="600" height="640" fill="url(#wall)" />
        <rect x="0" y="0" width="600" height="150" fill="#f8f9fb" />
        <path d="M0 150 H600" stroke="#d3d9e2" strokeWidth="3" />
        {/* cassette */}
        <rect x="180" y="110" width="240" height="50" rx="6" fill="#ffffff" stroke="#cfd6df" strokeWidth="3" />
        <rect x="230" y="122" width="140" height="26" rx="4" fill="url(#mesh)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i % 2 ? 196 : 380} y={i < 2 ? 116 : 140} width="24" height="6" rx="3" fill="#4b5465" />
        ))}
        <Airflow x={190} y={170} w={220} />
        {/* desks */}
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${i * 300} 0)`}>
            <rect x="40" y="430" width="220" height="16" rx="4" fill="#1c2033" />
            <rect x="60" y="446" width="10" height="120" fill="#1c2033" />
            <rect x="230" y="446" width="10" height="120" fill="#1c2033" />
            <rect x="100" y="350" width="110" height="74" rx="6" fill="#2b313f" />
            <rect x="108" y="358" width="94" height="58" rx="3" fill="#4aa1d8" opacity="0.6" />
            <rect x="148" y="424" width="14" height="8" fill="#2b313f" />
          </g>
        ))}
        <Plant x={300} y={560} />
        <rect x="0" y="566" width="600" height="74" fill="#cfd6df" />
      </>
    ),
  },
};

export function Scene({ name }: { name: SceneName }) {
  const s = scenes[name];
  return <Frame label={s.label}>{s.body}</Frame>;
}
