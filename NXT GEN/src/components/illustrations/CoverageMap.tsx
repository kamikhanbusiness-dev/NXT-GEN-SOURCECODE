/**
 * Stylised road map of the service area with a pulsing radius ring.
 * Swap for an embedded Google Map (iframe) in production if preferred.
 */
const towns = [
  { name: "Nottingham", x: 400, y: 190, main: true },
  { name: "Mansfield", x: 380, y: 40 },
  { name: "Hucknall", x: 350, y: 110 },
  { name: "Arnold", x: 435, y: 145 },
  { name: "Carlton", x: 480, y: 190 },
  { name: "West Bridgford", x: 420, y: 245 },
  { name: "Beeston", x: 320, y: 225 },
  { name: "Long Eaton", x: 250, y: 275 },
  { name: "Derby", x: 150, y: 225 },
  { name: "Newark", x: 690, y: 110 },
  { name: "Loughborough", x: 360, y: 340 },
  { name: "Grantham", x: 720, y: 290 },
];

const roads = [
  "M400 190 L380 40",
  "M400 190 L150 225",
  "M400 190 L690 110",
  "M400 190 L360 340",
  "M400 190 L720 290",
  "M150 225 L250 275 L360 340",
  "M60 120 Q 250 170 380 40",
  "M0 300 Q 300 260 800 330",
  "M520 0 Q 560 200 480 380",
];

export function CoverageMap() {
  return (
    <div className="relative min-h-64 bg-[#eef3e8]">
      <svg viewBox="0 0 800 380" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of our Nottinghamshire service area">
        {/* parks & water */}
        <ellipse cx="560" cy="250" rx="90" ry="40" fill="#d5e8c7" />
        <ellipse cx="200" cy="80" rx="110" ry="50" fill="#d5e8c7" />
        <path d="M0 250 Q 200 200 400 215 T 800 230" stroke="#b8dcef" strokeWidth="10" fill="none" />
        {roads.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#f2c94c" strokeWidth={i < 5 ? 7 : 4} fill="none" strokeLinecap="round" />
            <path d={d} stroke="#fff6d6" strokeWidth={i < 5 ? 2 : 1} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <circle cx="400" cy="190" r="150" fill="#c8363a" fillOpacity="0.06" stroke="#c8363a" strokeWidth="4" />
        <circle cx="400" cy="190" r="150" fill="none" stroke="#c8363a" strokeWidth="3" opacity="0.5">
          <animate attributeName="r" values="150;175;150" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        {towns.map((t) => (
          <g key={t.name}>
            {t.main ? (
              <path d={`M${t.x} ${t.y} c-14 -18 -14 -36 0 -36 c14 0 14 18 0 36 Z`} fill="#c8363a" stroke="#fff" strokeWidth="2" />
            ) : (
              <circle cx={t.x} cy={t.y} r="4" fill="#5b6576" />
            )}
            <text
              x={t.x + (t.main ? 14 : 8)}
              y={t.y + (t.main ? -18 : 4)}
              fontSize={t.main ? 18 : 13}
              fontWeight={t.main ? 800 : 500}
              fill="#1c2033"
              fontFamily="var(--font-roboto)"
              stroke="#eef3e8"
              strokeWidth="3"
              paintOrder="stroke"
            >
              {t.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
