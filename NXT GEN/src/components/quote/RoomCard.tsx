"use client";

import { pricingConfig as P, keysOf, type InsulationLevel, type RoomType, type SunExposure, type UnitType } from "@/config/pricing";
import { roomLoadWatts, sizeUnits, type LengthUnit } from "@/lib/quote/calc";
import { Icon } from "@/components/ui/Icon";
import { Field, TextInput, inputClass } from "@/components/forms/fields";
import { Segmented } from "./OptionCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type RoomState = {
  id: string;
  name: string;
  type: RoomType;
  length: string;
  width: string;
  ceilingHeight: string;
  insulation: InsulationLevel;
  sun: SunExposure;
  occupants: number;
};

export type RoomErrors = Partial<Record<"length" | "width" | "ceilingHeight", string>>;

export const parseRoom = (r: RoomState) => ({
  ...r,
  length: parseFloat(r.length),
  width: parseFloat(r.width),
  ceilingHeight: parseFloat(r.ceilingHeight),
});

export function RoomCard({
  room,
  index,
  unit,
  unitType,
  errors,
  canRemove,
  onChange,
  onRemove,
}: {
  room: RoomState;
  index: number;
  unit: LengthUnit;
  unitType: UnitType;
  errors?: RoomErrors;
  canRemove: boolean;
  onChange: (patch: Partial<RoomState>) => void;
  onRemove: () => void;
}) {
  const load = roomLoadWatts(parseRoom(room), unit);
  const kw = load ? load.watts / 1000 : 0;
  const units = load ? sizeUnits(kw, unitType) : [];
  const title = room.name.trim() || `${P.roomTypes[room.type].label} ${index + 1}`;

  return (
    <Card role="group" aria-label={title} className="animate-fade-up gap-0 rounded-3xl py-0 text-base shadow-sm ring-black/10">
      <CardHeader className="flex items-center gap-3 rounded-none border-b bg-muted px-5 py-3 [.border-b]:pb-3">
        <span className="grid size-8 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">{index + 1}</span>
        <CardTitle className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold text-navy-900">{title}</h3>
        </CardTitle>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-accent-600/10 hover:text-accent-700"
          >
            <Icon name="trash" className="size-4" /> Remove
          </button>
        )}
      </CardHeader>

      <CardContent className="grid gap-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Room type">
            {(a) => (
              <select {...a} value={room.type} onChange={(e) => onChange({ type: e.target.value as RoomType })} className={inputClass()}>
                {keysOf(P.roomTypes).map((k) => (
                  <option key={k} value={k}>
                    {P.roomTypes[k].label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Room name" hint="Optional, e.g. “Master bedroom”">
            {(a) => <TextInput {...a} value={room.name} maxLength={40} onChange={(e) => onChange({ name: e.target.value })} />}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(
            [
              ["length", "Length"],
              ["width", "Width"],
              ["ceilingHeight", "Ceiling height"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={`${label} (${unit})`} error={errors?.[key]} required={key !== "ceilingHeight"}>
              {(a) => (
                <div className="relative">
                  <TextInput
                    {...a}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    value={room[key]}
                    invalid={!!errors?.[key]}
                    placeholder={key === "ceilingHeight" ? (unit === "m" ? "2.4" : "8") : "0.0"}
                    onChange={(e) => onChange({ [key]: e.target.value })}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">{unit}</span>
                </div>
              )}
            </Field>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <Segmented
            legend="Insulation"
            value={room.insulation}
            onChange={(v) => onChange({ insulation: v })}
            options={keysOf(P.cooling.insulation).map((k) => ({ value: k, label: P.cooling.insulation[k].label, title: P.cooling.insulation[k].hint }))}
          />
          <Segmented
            legend="Sun exposure"
            value={room.sun}
            onChange={(v) => onChange({ sun: v })}
            options={keysOf(P.cooling.sunExposure).map((k) => ({ value: k, label: P.cooling.sunExposure[k].label, title: P.cooling.sunExposure[k].hint }))}
          />
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold text-navy-900">People</legend>
            <div className="flex items-center rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                aria-label="Fewer people"
                disabled={room.occupants <= 0}
                onClick={() => onChange({ occupants: room.occupants - 1 })}
                className="grid size-10 place-items-center rounded-lg text-navy-900 hover:bg-white disabled:opacity-40"
              >
                <Icon name="minus" className="size-4" />
              </button>
              <output className="w-10 text-center font-semibold text-navy-900" aria-live="polite">
                {room.occupants}
              </output>
              <button
                type="button"
                aria-label="More people"
                disabled={room.occupants >= 50}
                onClick={() => onChange({ occupants: room.occupants + 1 })}
                className="grid size-10 place-items-center rounded-lg text-navy-900 hover:bg-white disabled:opacity-40"
              >
                <Icon name="plus" className="size-4" />
              </button>
            </div>
          </fieldset>
        </div>

        {/* Live per-room result */}
        <div
          aria-live="polite"
          className={`grid grid-cols-3 gap-px overflow-hidden rounded-2xl transition-colors ${load ? "bg-brand-200" : "bg-slate-200"}`}
        >
          {[
            { icon: "ruler" as const, label: "Floor area", value: load ? `${load.areaM2.toFixed(1)} m²` : "—" },
            {
              icon: "thermometer" as const,
              label: "Cooling needed",
              value: load ? `${kw.toFixed(1)} kW` : "—",
              sub: load ? `${(Math.round((load.watts * 3.412) / 100) * 100).toLocaleString("en-GB")} BTU/h` : "Enter size",
            },
            { icon: "snowflake" as const, label: "Suggested unit", value: units.length ? units.map((u) => `${u.toFixed(1)}kW`).join(" + ") : "—" },
          ].map((s) => (
            <div key={s.label} className={`px-3 py-3 sm:px-4 ${load ? "bg-brand-50" : "bg-slate-50"}`}>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Icon name={s.icon} className="size-3.5" /> {s.label}
              </span>
              <span className="mt-1 block font-display text-base font-bold text-navy-900 sm:text-lg">{s.value}</span>
              {s.sub && <span className="block text-xs text-slate-500">{s.sub}</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
