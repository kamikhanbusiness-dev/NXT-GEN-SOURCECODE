/**
 * Pure estimate maths shared by the live price panel (client) and the API
 * route (server). The server always recomputes from submitted inputs, so the
 * emailed figure can't be tampered with in the browser.
 *
 * All rates come from `@/config/pricing` — don't put numbers in here.
 */
import {
  pricingConfig as P,
  unitSizesKw,
  type AddOn,
  type Electrics,
  type FloorLevel,
  type InstallType,
  type InsulationLevel,
  type OutdoorMounting,
  type PipeworkBand,
  type PropertyType,
  type Range,
  type RoomType,
  type SunExposure,
  type UnitSizeKw,
  type UnitType,
} from "@/config/pricing";

export type LengthUnit = "m" | "ft";

const FT_TO_M = 0.3048;
const W_TO_BTU = 3.412;

export const toMetres = (v: number, unit: LengthUnit) => (unit === "ft" ? v * FT_TO_M : v);
export const fromMetres = (v: number, unit: LengthUnit) => (unit === "ft" ? v / FT_TO_M : v);

/** Loose input shape: the live panel calls this with half-filled form values. */
export type EstimateInput = {
  propertyType?: PropertyType;
  unit?: LengthUnit;
  rooms?: Array<{
    id?: string;
    name?: string;
    type?: RoomType;
    length?: number;
    width?: number;
    ceilingHeight?: number;
    insulation?: InsulationLevel;
    sun?: SunExposure;
    occupants?: number;
  }>;
  unitType?: UnitType;
  installType?: InstallType;
  pipework?: PipeworkBand;
  outdoorMounting?: OutdoorMounting;
  floorLevel?: FloorLevel;
  electrics?: Electrics;
  addOns?: AddOn[];
};

export type RoomResult = {
  id: string;
  label: string;
  areaM2: number;
  loadKw: number;
  loadBtu: number;
  /** Indoor units fitted to this room (large rooms may need more than one). */
  indoorUnits: UnitSizeKw[];
};

export type LineItem = { label: string; range: Range };

export type Estimate = {
  rooms: RoomResult[];
  indoorUnitCount: number;
  systemCount: number;
  totalKw: number;
  totalBtu: number;
  lines: LineItem[];
  /** One-off installation price range, rounded. `null` until at least one room is complete. */
  installRange: Range | null;
  /** Recurring yearly cost (maintenance plan), or null if not selected. */
  annualRange: Range | null;
  notes: string[];
};

const finite = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;
const round1 = (n: number) => Math.round(n * 10) / 10;
const add = (a: Range, b: Range): Range => [a[0] + b[0], a[1] + b[1]];
const scale = (r: Range, k: number): Range => [r[0] * k, r[1] * k];
const ZERO: Range = [0, 0];

/** Cooling load for one room in watts. */
export function roomLoadWatts(room: NonNullable<EstimateInput["rooms"]>[number], unit: LengthUnit) {
  if (!finite(room.length) || !finite(room.width)) return null;
  const c = P.cooling;
  const length = toMetres(room.length, unit);
  const width = toMetres(room.width, unit);
  const height = finite(room.ceilingHeight) ? toMetres(room.ceilingHeight, unit) : 2.4;
  const areaM2 = length * width;

  let watts = areaM2 * height * c.wattsPerCubicMetre;
  watts *= c.insulation[room.insulation ?? "average"].multiplier;
  watts *= c.sunExposure[room.sun ?? "medium"].multiplier;
  watts *= P.roomTypes[room.type ?? "living"].loadMultiplier;
  watts += Math.max(0, (room.occupants ?? 0) - c.occupantsIncluded) * c.wattsPerPerson;
  watts *= c.safetyMargin;

  return { areaM2, watts };
}

/**
 * Pick indoor unit(s) for a load. Uses the smallest size the unit type offers
 * that covers the load; if the load exceeds the largest size, splits it
 * across several equal units.
 */
export function sizeUnits(loadKw: number, unitType: UnitType): UnitSizeKw[] {
  const offered = unitSizesKw.filter((s) => P.unitTypes[unitType].perIndoorUnit[s]);
  const largest = offered[offered.length - 1];
  const count = Math.max(1, Math.ceil(loadKw / largest));
  const each = loadKw / count;
  const size = offered.find((s) => s >= each) ?? largest;
  return Array.from({ length: count }, () => size);
}

export function calculateEstimate(input: EstimateInput): Estimate {
  const unit = input.unit ?? "m";
  const unitType = input.unitType ?? "wallSplit";
  const ut = P.unitTypes[unitType];

  const rooms: RoomResult[] = [];
  (input.rooms ?? []).forEach((room, i) => {
    const load = roomLoadWatts(room, unit);
    if (!load) return;
    const loadKw = load.watts / 1000;
    rooms.push({
      id: room.id ?? String(i),
      label: room.name?.trim() || `${P.roomTypes[room.type ?? "living"].label} ${i + 1}`,
      areaM2: round1(load.areaM2),
      loadKw: round1(loadKw),
      loadBtu: Math.round((load.watts * W_TO_BTU) / 100) * 100,
      indoorUnits: sizeUnits(loadKw, unitType),
    });
  });

  const indoorUnitCount = rooms.reduce((n, r) => n + r.indoorUnits.length, 0);
  const systemCount = indoorUnitCount ? Math.ceil(indoorUnitCount / ut.maxIndoorUnitsPerSystem) : 0;
  const totalKw = round1(rooms.reduce((n, r) => n + r.loadKw, 0));
  const totalBtu = rooms.reduce((n, r) => n + r.loadBtu, 0);

  const notes: string[] = [];
  if (!indoorUnitCount) {
    return { rooms, indoorUnitCount, systemCount, totalKw, totalBtu, lines: [], installRange: null, annualRange: null, notes };
  }

  const lines: LineItem[] = [];
  const push = (label: string, range: Range) => {
    if (range[1] > 0) lines.push({ label, range });
  };

  // Equipment + standard labour, scaled by install type and property type.
  const multiplier = P.installType[input.installType ?? "new"].multiplier * P.propertyMultiplier[input.propertyType ?? "domestic"];
  const indoor = rooms
    .flatMap((r) => r.indoorUnits)
    .reduce<Range>((sum, size) => add(sum, ut.perIndoorUnit[size] ?? ZERO), ZERO);
  push(
    `${ut.label}: ${systemCount} outdoor, ${indoorUnitCount} indoor unit${indoorUnitCount > 1 ? "s" : ""}`,
    scale(add(scale(ut.systemBase, systemCount), indoor), multiplier),
  );

  const perSystem = (label: string, r: Range) => push(systemCount > 1 ? `${label} (×${systemCount})` : label, scale(r, systemCount));
  perSystem("Removal of old system", P.installType[input.installType ?? "new"].perSystem);
  perSystem(`Extra pipework (${P.pipework[input.pipework ?? "upTo5"].label})`, P.pipework[input.pipework ?? "upTo5"].perSystem);
  perSystem(`Outdoor mounting (${P.outdoorMounting[input.outdoorMounting ?? "wallLow"].label})`, P.outdoorMounting[input.outdoorMounting ?? "wallLow"].perSystem);
  perSystem("Electrical supply", P.electrics[input.electrics ?? "existing"].perSystem);
  push(`Access (${P.floorLevel[input.floorLevel ?? "ground"].label})`, P.floorLevel[input.floorLevel ?? "ground"].perJob);

  let annualRange: Range | null = null;
  for (const key of input.addOns ?? []) {
    const a: { label: string; unit: string; price: Range } = P.addOns[key];
    if (!a) continue;
    if (a.unit === "annual") annualRange = scale(a.price, indoorUnitCount);
    else if (a.unit === "perIndoorUnit") push(a.label, scale(a.price, indoorUnitCount));
    else if (a.unit === "perSystem") push(a.label, scale(a.price, systemCount));
    else push(a.label, a.price);
  }

  const total = lines.reduce<Range>((sum, l) => add(sum, l.range), ZERO);
  const roundRange = (r: Range): Range => [Math.floor(r[0] / P.roundTo) * P.roundTo, Math.ceil(r[1] / P.roundTo) * P.roundTo];

  if (rooms.some((r) => r.indoorUnits.length > 1)) notes.push("Larger rooms have been split across more than one indoor unit.");
  if (input.electrics === "unsure" || input.pipework === "unsure") notes.push("“Not sure” answers widen the range until our surveyor confirms.");
  if (rooms.some((r) => r.loadKw > 10)) notes.push("Very large spaces usually suit ducted or cassette systems — we'll advise at survey.");

  return {
    rooms,
    indoorUnitCount,
    systemCount,
    totalKw,
    totalBtu,
    lines: lines.map((l) => ({ ...l, range: roundRange(l.range) })),
    installRange: roundRange(total),
    annualRange: annualRange && roundRange(annualRange),
    notes,
  };
}

export const formatGBP = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export const formatRange = ([min, max]: Range) => (min === max ? formatGBP(min) : `${formatGBP(min)} – ${formatGBP(max)}`);
