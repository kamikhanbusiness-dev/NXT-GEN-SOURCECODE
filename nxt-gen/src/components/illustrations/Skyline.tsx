import type { CSSProperties } from "react";

/**
 * Illustrated Nottingham-inspired street scene for the home hero: red-brick
 * terraces either side of a domed civic building (nod to the Council House).
 * Generated from simple shape data so it stays small and sharp at any width.
 */
const BRICK = "#b9553f";
const BRICK_DARK = "#9c4433";
const STONE = "#f4ddb0";
const STONE_DARK = "#e2c48c";
const SLATE = "#5d6f93";
const GLASS = "#cfeaf7";
const FRAME = "#2c3a5a";

// Far-off city blocks [x, width, height]
const far = [
  [0, 90, 150], [80, 70, 210], [140, 110, 170], [240, 60, 240], [290, 120, 160], [400, 80, 200],
  [470, 120, 140], [1040, 100, 180], [1130, 70, 230], [1190, 120, 150], [1300, 80, 210], [1370, 110, 170],
  [1470, 70, 220], [1530, 90, 150],
] as const;

// Trees [cx, r]
const trees = [
  [40, 46], [190, 56], [330, 50], [520, 58], [1080, 54], [1250, 60], [1420, 52], [1580, 48],
] as const;

function Terrace({ x, w, h, roof, variant }: { x: number; w: number; h: number; roof: "gable" | "flat"; variant: number }) {
  const base = 360;
  const top = base - h;
  const cols = Math.max(2, Math.floor(w / 46));
  const rows = Math.max(2, Math.floor((h - 40) / 52));
  const colW = w / cols;
  return (
    <g>
      {roof === "gable" ? (
        <path d={`M${x - 4} ${top + 2} L${x + w / 2} ${top - 46} L${x + w + 4} ${top + 2} Z`} fill={SLATE} />
      ) : (
        <rect x={x - 4} y={top - 10} width={w + 8} height={12} fill={STONE_DARK} />
      )}
      {roof === "gable" && <rect x={x + w * 0.72} y={top - 44} width={14} height={30} fill={BRICK_DARK} />}
      <rect x={x} y={top} width={w} height={h} fill={variant % 2 ? BRICK : BRICK_DARK} />
      {/* stone banding */}
      <rect x={x} y={top + 4} width={w} height={6} fill={STONE} />
      {Array.from({ length: rows }, (_, r) => (
        <rect key={`b${r}`} x={x} y={top + 52 + r * 52 - 8} width={w} height={3} fill={STONE} opacity={0.6} />
      ))}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const wx = x + c * colW + colW * 0.25;
          const wy = top + 22 + r * 52;
          const isDoor = r === rows - 1 && c === Math.floor(cols / 2) && variant % 3 === 0;
          return isDoor ? (
            <g key={`${r}-${c}`}>
              <path d={`M${wx} ${base} V${wy + 8} a${colW * 0.25} ${colW * 0.25} 0 0 1 ${colW * 0.5} 0 V${base}`} fill={FRAME} />
            </g>
          ) : (
            <g key={`${r}-${c}`}>
              <rect x={wx - 3} y={wy - 3} width={colW * 0.5 + 6} height={32} fill={STONE} rx={2} />
              <rect x={wx} y={wy} width={colW * 0.5} height={26} fill={GLASS} stroke={FRAME} strokeWidth={2} />
              <line x1={wx + colW * 0.25} y1={wy} x2={wx + colW * 0.25} y2={wy + 26} stroke={FRAME} strokeWidth={1.5} />
            </g>
          );
        }),
      )}
    </g>
  );
}

function CivicDome() {
  const cx = 800;
  return (
    <g>
      {/* dome & lantern */}
      <rect x={cx - 8} y={52} width={16} height={26} fill={STONE} />
      <circle cx={cx} cy={48} r={7} fill="#e8b84a" />
      <path d={`M${cx - 70} 160 Q${cx - 70} 74 ${cx} 74 Q${cx + 70} 74 ${cx + 70} 160 Z`} fill="#7c90b3" />
      <path d={`M${cx - 70} 160 Q${cx - 70} 74 ${cx} 74 Q${cx - 30} 100 ${cx - 36} 160 Z`} fill="#93a6c6" />
      <rect x={cx - 84} y={156} width={168} height={22} fill={STONE} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={cx - 74 + i * 20} y={160} width={8} height={14} fill={STONE_DARK} />
      ))}
      {/* main facade */}
      <rect x={cx - 200} y={178} width={400} height={182} fill={STONE} />
      <path d={`M${cx - 120} 200 L${cx} 150 L${cx + 120} 200 Z`} fill={STONE_DARK} />
      <rect x={cx - 210} y={196} width={420} height={12} fill={STONE_DARK} />
      {/* columns */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={cx - 112 + i * 30} y={208} width={14} height={110} fill="#fbeccc" stroke={STONE_DARK} strokeWidth={1} />
      ))}
      {/* side windows */}
      {[-180, -150, 136, 166].map((dx) => (
        <g key={dx}>
          <rect x={cx + dx} y={226} width={18} height={34} fill={GLASS} stroke={FRAME} strokeWidth={2} />
          <rect x={cx + dx} y={278} width={18} height={34} fill={GLASS} stroke={FRAME} strokeWidth={2} />
        </g>
      ))}
      <rect x={cx - 130} y={318} width={260} height={42} fill={STONE_DARK} />
      {[-90, -30, 30].map((dx) => (
        <path key={dx} d={`M${cx + dx} 360 V336 a30 18 0 0 1 60 0 V360`} fill={FRAME} opacity={0.85} />
      ))}
    </g>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {far.map(([x, w, h], i) => (
        <rect key={i} x={x} y={360 - h - 60} width={w} height={h + 60} fill="#a7e0e8" opacity={0.75} />
      ))}
      {trees.map(([cx, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={300 - r * 0.6} r={r} fill={i % 2 ? "#7fb35a" : "#6aa64c"} />
          <circle cx={cx + r * 0.5} cy={300 - r * 0.2} r={r * 0.7} fill="#5b9741" />
        </g>
      ))}
      <Terrace x={-20} w={150} h={210} roof="gable" variant={0} />
      <Terrace x={130} w={120} h={250} roof="gable" variant={1} />
      <Terrace x={250} w={170} h={200} roof="flat" variant={2} />
      <Terrace x={420} w={130} h={240} roof="gable" variant={3} />
      <Terrace x={550} w={70} h={190} roof="flat" variant={4} />
      <CivicDome />
      <Terrace x={1010} w={90} h={200} roof="flat" variant={5} />
      <Terrace x={1100} w={140} h={240} roof="gable" variant={6} />
      <Terrace x={1240} w={160} h={205} roof="flat" variant={7} />
      <Terrace x={1400} w={120} h={250} roof="gable" variant={8} />
      <Terrace x={1520} w={110} h={215} roof="gable" variant={9} />
      <rect x={0} y={352} width={1600} height={8} fill="#7c8aa6" />
    </svg>
  );
}

export function Cloud({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 80" className={className} style={style} aria-hidden="true">
      <path
        d="M30 70h140a26 26 0 0 0 0-52 30 30 0 0 0-14 3A38 38 0 0 0 88 12a34 34 0 0 0-32 24 22 22 0 0 0-26 34Z"
        fill="white"
        opacity="0.75"
      />
    </svg>
  );
}
