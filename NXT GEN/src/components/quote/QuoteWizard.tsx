"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import Link from "next/link";
import {
  pricingConfig as P,
  keysOf,
  type AddOn,
  type Electrics,
  type FloorLevel,
  type InstallType,
  type OutdoorMounting,
  type PipeworkBand,
  type PropertyType,
  type UnitType,
} from "@/config/pricing";
import { site } from "@/config/site";
import { calculateEstimate, formatRange, fromMetres, toMetres, type LengthUnit } from "@/lib/quote/calc";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";
import { Checkbox as UiCheckbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Spinner, TextArea, TextInput, isEmail, isUkPhone, isUkPostcode, simulateSubmit } from "@/components/forms/fields";
import { OptionCards, Segmented, type Option } from "./OptionCards";
import { RoomCard, parseRoom, type RoomErrors, type RoomState } from "./RoomCard";
import { MobilePriceBar, PriceSummary } from "./PriceSummary";

/* ── Step-1 options (copy only, no pricing impact beyond property type) ── */
const buildingTypes: Record<PropertyType, Option<string>[]> = {
  domestic: [
    { value: "detached", label: "Detached", icon: "home" },
    { value: "semi", label: "Semi-detached", icon: "home" },
    { value: "terrace", label: "Terrace", icon: "home" },
    { value: "flat", label: "Flat / apartment", icon: "building" },
    { value: "bungalow", label: "Bungalow", icon: "home" },
    { value: "static", label: "Static / park home", icon: "home" },
  ],
  commercial: [
    { value: "office", label: "Office", icon: "building" },
    { value: "retail", label: "Shop / retail", icon: "building" },
    { value: "hospitality", label: "Restaurant / hospitality", icon: "building" },
    { value: "industrial", label: "Warehouse / industrial", icon: "building" },
    { value: "server", label: "Server / comms room", icon: "server" },
    { value: "other", label: "Other commercial", icon: "building" },
  ],
};
const propertySizes: Record<PropertyType, Option<string>[]> = {
  domestic: [
    { value: "small", label: "1 – 2 bedrooms" },
    { value: "medium", label: "3 bedrooms" },
    { value: "large", label: "4 – 5 bedrooms" },
    { value: "xl", label: "6+ bedrooms" },
  ],
  commercial: [
    { value: "small", label: "Under 100 m²" },
    { value: "medium", label: "100 – 300 m²" },
    { value: "large", label: "300 – 1,000 m²" },
    { value: "xl", label: "Over 1,000 m²" },
  ],
};
const callbackTimes = [
  { value: "morning", label: "Morning", hint: "8am – 12pm" },
  { value: "afternoon", label: "Afternoon", hint: "12pm – 5pm" },
  { value: "evening", label: "Evening", hint: "5pm – 7pm" },
  { value: "anytime", label: "Any time", hint: "" },
];
const unitTypeIcons: Record<UnitType, IconName> = { wallSplit: "wind", multiSplit: "snowflake", ducted: "home", cassette: "building" };
const addOnIcons: Record<AddOn, IconName> = { wifi: "sparkles", condensatePump: "wrench", extendedWarranty: "shield", maintenancePlan: "calendar" };

// Hero "quick start" presets (?size=small|medium|large) → first room dimensions in metres.
const sizePresets: Record<string, [number, number]> = { small: [3.5, 3.2], medium: [5, 4.5], large: [8, 5.5] };

const steps = [
  { title: "Property" },
  { title: "Rooms" },
  { title: "Options" },
  { title: "Your details" },
] as const;

let roomSeq = 0;
const newRoom = (patch: Partial<RoomState> = {}): RoomState => ({
  id: `room-${++roomSeq}`,
  name: "",
  type: "bedroom",
  length: "",
  width: "",
  ceilingHeight: "2.4",
  insulation: "average",
  sun: "medium",
  occupants: 2,
  ...patch,
});

type Contact = { firstName: string; lastName: string; email: string; phone: string; postcode: string; callbackTime: string; notes: string; consent: boolean };

export function QuoteWizard({ initialSize }: { initialSize?: string }) {
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState<boolean[]>([false, false, false, false]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [reference, setReference] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [propertyType, setPropertyType] = useState<PropertyType>("domestic");
  const [buildingType, setBuildingType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [unit, setUnit] = useState<LengthUnit>("m");
  const [rooms, setRooms] = useState<RoomState[]>(() => {
    // Pre-fill the first room when arriving from the home page quick-start card.
    const preset = initialSize ? sizePresets[initialSize] : undefined;
    return [preset ? newRoom({ type: "living", length: String(preset[0]), width: String(preset[1]) }) : newRoom()];
  });
  const [unitType, setUnitType] = useState<UnitType>("wallSplit");
  const [installType, setInstallType] = useState<InstallType>("new");
  const [pipework, setPipework] = useState<PipeworkBand>("upTo5");
  const [outdoorMounting, setOutdoorMounting] = useState<OutdoorMounting>("wallLow");
  const [floorLevel, setFloorLevel] = useState<FloorLevel>("ground");
  const [electrics, setElectrics] = useState<Electrics>("existing");
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [contact, setContact] = useState<Contact>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    callbackTime: "",
    notes: "",
    consent: false,
  });


  const estimate = useMemo(
    () =>
      calculateEstimate({
        propertyType,
        unit,
        rooms: rooms.map(parseRoom),
        unitType,
        installType,
        pipework,
        outdoorMounting,
        floorLevel,
        electrics,
        addOns,
      }),
    [propertyType, unit, rooms, unitType, installType, pipework, outdoorMounting, floorLevel, electrics, addOns],
  );

  /* ── Validation ───────────────────────────────────────────────────── */
  const errors = useMemo(() => {
    const s1: Record<string, string> = {};
    if (!buildingType) s1.buildingType = "Choose the type of property";
    if (!propertySize) s1.propertySize = "Choose the property size";

    const roomErrors: Record<string, RoomErrors> = {};
    const range = (raw: string, [min, max]: [number, number], label: string, required = true) => {
      if (!raw.trim()) return required ? `Enter the ${label}` : undefined;
      const v = parseFloat(raw);
      if (!Number.isFinite(v) || v <= 0) return `Enter a number greater than 0`;
      const m = toMetres(v, unit);
      if (m < min || m > max) {
        const c = (x: number) => (unit === "ft" ? Math.round(fromMetres(x, "ft")) : x);
        return `Must be between ${c(min)} and ${c(max)} ${unit}`;
      }
    };
    for (const r of rooms) {
      const e: RoomErrors = {
        length: range(r.length, [1, 60], "length"),
        width: range(r.width, [1, 60], "width"),
        ceilingHeight: range(r.ceilingHeight, [2, 8], "ceiling height", false),
      };
      if (e.length || e.width || e.ceilingHeight) roomErrors[r.id] = e;
    }

    const s4: Partial<Record<keyof Contact, string>> = {};
    if (!contact.firstName.trim()) s4.firstName = "Enter your first name";
    if (!contact.lastName.trim()) s4.lastName = "Enter your last name";
    if (!isEmail(contact.email)) s4.email = "Enter a valid email address, e.g. name@example.com";
    if (!isUkPhone(contact.phone)) s4.phone = "Enter a UK phone number, e.g. 07700 900123";
    if (!isUkPostcode(contact.postcode)) s4.postcode = "Enter a valid UK postcode, e.g. NG1 5FS";
    if (!contact.callbackTime) s4.callbackTime = "Choose a time for us to call";
    if (!contact.consent) s4.consent = "Please agree so we can contact you about your quote";

    return { s1, roomErrors, s4, valid: [!Object.keys(s1).length, !Object.keys(roomErrors).length, true, !Object.keys(s4).length] };
  }, [buildingType, propertySize, rooms, unit, contact]);

  const shown = <T,>(i: number, v: T) => (attempted[i] ? v : undefined);

  /* ── Navigation ───────────────────────────────────────────────────── */
  const goTo = (i: number) => {
    setStep(i);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    setAttempted((a) => a.map((v, i) => (i === step ? true : v)));
    if (!errors.valid[step]) {
      requestAnimationFrame(() => (document.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus());
      return;
    }
    if (step < steps.length - 1) goTo(step + 1);
    else submit();
  };

  async function submit() {
    setStatus("loading");
    await simulateSubmit(); // Prototype: no data leaves the browser.
    setReference("NXG-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    setStatus("success");
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const updateRoom = (id: string, patch: Partial<RoomState>) => setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const switchUnit = (to: LengthUnit) => {
    if (to === unit) return;
    // Convert entered dimensions so switching units never loses data.
    const conv = (v: string) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? String(Math.round(fromMetres(toMetres(n, unit), to) * 10) / 10) : v;
    };
    setRooms((rs) => rs.map((r) => ({ ...r, length: conv(r.length), width: conv(r.width), ceilingHeight: conv(r.ceilingHeight) })));
    setUnit(to);
  };

  const setC = <K extends keyof Contact>(k: K, v: Contact[K]) => setContact((c) => ({ ...c, [k]: v }));

  /* ── Success screen ───────────────────────────────────────────────── */
  if (status === "success") {
    return (
      <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-28 animate-fade-up py-4">
        <Card className="gap-0 rounded-3xl py-0 text-base shadow-2xl shadow-navy-900/10 ring-black/5">
          <div className="bg-gradient-to-br from-brand-600 to-navy-900 px-6 py-10 text-center text-white sm:px-10">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-brand-600 shadow-lg">
              <Icon name="check" className="size-8" strokeWidth={3} />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-white">Thanks, {contact.firstName}!</h2>
            <p className="mt-2 text-brand-100">
              Your reference is <strong className="text-white">{reference}</strong>
            </p>
            <p className="mt-6 text-sm text-brand-100">Your estimated installation cost</p>
            <p className="font-display text-4xl font-extrabold">{estimate.installRange && formatRange(estimate.installRange)}</p>
            {estimate.annualRange && <p className="mt-1 text-sm text-brand-100">+ maintenance plan {formatRange(estimate.annualRange)} per year</p>}
          </div>
          <div className="p-6 sm:p-10">
            <h3 className="text-xl font-bold">What happens next?</h3>
            <ol className="mt-6 space-y-5">
              {[
                ["mail", "Check your inbox", `We've emailed a copy of your estimate to ${contact.email}.`],
                ["phone", "We'll give you a call", `An engineer will call you ${callbackTimes.find((c) => c.value === contact.callbackTime)?.label.toLowerCase()} on the next working day.`],
                ["calendar", "Free site survey", "We'll visit, confirm the details and give you a fixed, no-obligation price."],
              ].map(([icon, title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
                    <Icon name={icon as IconName} />
                    <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-accent-600 text-[0.65rem] font-bold text-white">{i + 1}</span>
                  </span>
                  <span>
                    <span className="block font-semibold text-navy-900">{title}</span>
                    <span className="block text-slate-600">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row">
              <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy-900 px-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-navy-800">
                Back to home
              </Link>
              <a href={site.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-brand-600 px-6 text-sm font-semibold uppercase tracking-wide text-brand-700 hover:bg-brand-50">
                <Icon name="phone" className="size-4" /> Can&apos;t wait? Call {site.phone}
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /* ── Wizard ───────────────────────────────────────────────────────── */
  return (
    <div ref={topRef} className="scroll-mt-28">
      <Progress step={step} valid={errors.valid} onJump={(i) => i < step && goTo(i)} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <form onSubmit={next} noValidate className="min-w-0">
          <Card key={step} className="animate-fade-up gap-0 rounded-3xl p-4 text-base shadow-xl shadow-navy-900/5 ring-black/5 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-600">
              Step {step + 1} of {steps.length}
            </p>

            {step === 0 && (
              <div className="space-y-10">
                <StepHeading ref={headingRef} title={<>Tell us about your <em>property</em></>} intro="This helps us recommend the right type of system." />
                <OptionCards
                  legend="Is this for a home or a business?"
                  value={propertyType}
                  onChange={(v) => {
                    setPropertyType(v);
                    setBuildingType("");
                  }}
                  options={[
                    { value: "domestic", label: "My home", hint: "Houses, flats, bungalows", icon: "home" },
                    { value: "commercial", label: "My business", hint: "Offices, shops, hospitality", icon: "building" },
                  ]}
                />
                <OptionCards
                  legend="What type of property is it?"
                  value={buildingType}
                  onChange={setBuildingType}
                  options={buildingTypes[propertyType]}
                  columns={3}
                  size="sm"
                  error={shown(0, errors.s1.buildingType)}
                />
                <OptionCards
                  legend={propertyType === "domestic" ? "How many bedrooms?" : "Approximate floor area?"}
                  value={propertySize}
                  onChange={setPropertySize}
                  options={propertySizes[propertyType]}
                  columns={4}
                  size="sm"
                  error={shown(0, errors.s1.propertySize)}
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <StepHeading
                    ref={headingRef}
                    title={<>Which <em>rooms</em> need air conditioning?</>}
                    intro="Add each room and its size — we'll work out the cooling power needed as you type."
                  />
                  <div className="w-44 shrink-0">
                    <Segmented
                      legend="Units"
                      value={unit}
                      onChange={switchUnit}
                      options={[
                        { value: "m", label: "Metres" },
                        { value: "ft", label: "Feet" },
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  {rooms.map((r, i) => (
                    <RoomCard
                      key={r.id}
                      room={r}
                      index={i}
                      unit={unit}
                      unitType={unitType}
                      errors={shown(1, errors.roomErrors[r.id])}
                      canRemove={rooms.length > 1}
                      onChange={(patch) => updateRoom(r.id, patch)}
                      onRemove={() => setRooms((rs) => rs.filter((x) => x.id !== r.id))}
                    />
                  ))}
                </div>

                {rooms.length < 12 ? (
                  <button
                    type="button"
                    onClick={() => setRooms((rs) => [...rs, newRoom({ ceilingHeight: unit === "m" ? "2.4" : "7.9" })])}
                    className="flex min-h-16 w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand-300 font-semibold text-brand-700 transition-colors hover:border-brand-500 hover:bg-brand-50"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-white">
                      <Icon name="plus" className="size-4" strokeWidth={3} />
                    </span>
                    Add another room
                  </button>
                ) : (
                  <p className="text-sm text-slate-500">For more than 12 rooms, please call us on {site.phone}.</p>
                )}

                <p className="flex gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900">
                  <Icon name="info" className="size-5 shrink-0 text-brand-600" />
                  Not sure of exact sizes? A rough measurement is fine — we&apos;ll measure properly at the free survey.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <StepHeading ref={headingRef} title={<>Choose your <em>system &amp; options</em></>} intro="Not sure? Leave the defaults — they suit most homes." />
                <OptionCards
                  legend="Type of system"
                  value={unitType}
                  onChange={setUnitType}
                  options={keysOf(P.unitTypes).map((k) => ({
                    value: k,
                    label: P.unitTypes[k].label,
                    hint: P.unitTypes[k].description,
                    icon: unitTypeIcons[k],
                    badge: k === "wallSplit" ? "Popular" : undefined,
                  }))}
                />
                <OptionCards
                  legend="Is this a new install or a replacement?"
                  value={installType}
                  onChange={setInstallType}
                  options={keysOf(P.installType).map((k) => ({ value: k, label: P.installType[k].label, hint: P.installType[k].hint, icon: k === "new" ? "sparkles" : "wrench" }))}
                />
                <OptionCards
                  legend="How far will the outdoor unit be from the indoor unit?"
                  description="The pipe run — up to 5m is included as standard."
                  value={pipework}
                  onChange={setPipework}
                  options={keysOf(P.pipework).map((k) => ({ value: k, label: P.pipework[k].label }))}
                  columns={3}
                  size="sm"
                />
                <OptionCards
                  legend="Where will the outdoor unit go?"
                  value={outdoorMounting}
                  onChange={setOutdoorMounting}
                  options={keysOf(P.outdoorMounting).map((k) => ({ value: k, label: P.outdoorMounting[k].label }))}
                  size="sm"
                />
                <OptionCards
                  legend="Which floor are the rooms on?"
                  description="Choose the highest floor."
                  value={floorLevel}
                  onChange={setFloorLevel}
                  options={keysOf(P.floorLevel).map((k) => ({ value: k, label: P.floorLevel[k].label }))}
                  columns={4}
                  size="sm"
                />
                <OptionCards
                  legend="Electrical supply"
                  description="Each outdoor unit needs its own circuit from your consumer unit."
                  value={electrics}
                  onChange={setElectrics}
                  options={keysOf(P.electrics).map((k) => ({ value: k, label: P.electrics[k].label }))}
                  columns={3}
                  size="sm"
                />
                <fieldset>
                  <legend className="font-display text-lg font-bold text-navy-900">Optional extras</legend>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {keysOf(P.addOns).map((k) => {
                      const a = P.addOns[k];
                      const on = addOns.includes(k);
                      return (
                        <label
                          key={k}
                          htmlFor={`addon-${k}`}
                          className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 bg-white p-4 transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/40 ${
                            on ? "border-brand-500 bg-brand-50/60" : "border-border hover:-translate-y-0.5 hover:border-brand-300"
                          }`}
                        >
                          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${on ? "bg-secondary text-white" : "bg-brand-100 text-brand-600"}`}>
                            <Icon name={addOnIcons[k]} className="size-5" />
                          </span>
                          <span className="flex-1">
                            <span className="block font-semibold text-navy-900">{a.label}</span>
                            <span className="block text-sm text-muted-foreground">{a.hint}</span>
                            <Badge variant="secondary" className="mt-2 h-6 bg-brand-100 px-2.5 text-sm font-semibold text-brand-800">
                              +{formatRange(a.price)}
                              {a.unit === "perIndoorUnit" ? " per unit" : a.unit === "perSystem" ? " per system" : a.unit === "annual" ? " per unit / year" : ""}
                            </Badge>
                          </span>
                          <UiCheckbox
                            id={`addon-${k}`}
                            checked={on}
                            onCheckedChange={() => setAddOns((s) => (on ? s.filter((x) => x !== k) : [...s, k]))}
                            className="mt-1 size-6 rounded-md border-2 border-input data-checked:border-secondary data-checked:bg-secondary [&_svg]:size-4"
                          />
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <StepHeading
                  ref={headingRef}
                  title={<>Where should we send your <em>estimate</em>?</>}
                  intro="We'll email you a copy and call to arrange your free, no-obligation survey."
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" required error={shown(3, errors.s4.firstName)}>
                    {(a) => <TextInput {...a} autoComplete="given-name" value={contact.firstName} invalid={!!shown(3, errors.s4.firstName)} onChange={(e) => setC("firstName", e.target.value)} />}
                  </Field>
                  <Field label="Last name" required error={shown(3, errors.s4.lastName)}>
                    {(a) => <TextInput {...a} autoComplete="family-name" value={contact.lastName} invalid={!!shown(3, errors.s4.lastName)} onChange={(e) => setC("lastName", e.target.value)} />}
                  </Field>
                  <Field label="Email address" required error={shown(3, errors.s4.email)}>
                    {(a) => <TextInput {...a} type="email" autoComplete="email" value={contact.email} invalid={!!shown(3, errors.s4.email)} onChange={(e) => setC("email", e.target.value)} />}
                  </Field>
                  <Field label="Phone number" required error={shown(3, errors.s4.phone)}>
                    {(a) => <TextInput {...a} type="tel" autoComplete="tel" value={contact.phone} invalid={!!shown(3, errors.s4.phone)} onChange={(e) => setC("phone", e.target.value)} />}
                  </Field>
                  <Field label="Postcode" required error={shown(3, errors.s4.postcode)} hint="So we can check you're in our service area">
                    {(a) => (
                      <TextInput
                        {...a}
                        autoComplete="postal-code"
                        placeholder="e.g. NG1 5FS"
                        value={contact.postcode}
                        invalid={!!shown(3, errors.s4.postcode)}
                        onChange={(e) => setC("postcode", e.target.value.toUpperCase())}
                      />
                    )}
                  </Field>
                </div>

                <OptionCards
                  legend="When's the best time to call you?"
                  value={contact.callbackTime}
                  onChange={(v) => setC("callbackTime", v)}
                  options={callbackTimes.map((c) => ({ ...c, icon: "clock" as const }))}
                  columns={4}
                  size="sm"
                  error={shown(3, errors.s4.callbackTime)}
                />

                <Field label="Anything else we should know?" hint="Optional — access, parking, preferred dates…">
                  {(a) => <TextArea {...a} rows={3} value={contact.notes} onChange={(e) => setC("notes", e.target.value)} />}
                </Field>

                <div className="rounded-2xl border-2 border-brand-500/30 bg-brand-50/50 p-5">
                  <p className="flex items-center gap-2 font-display font-bold text-navy-900">
                    <Icon name="shield" className="size-5 text-brand-600" /> Our promise to you
                  </p>
                  <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                    {["We won't inundate you", "We'll keep it relevant", "We'll never share your details"].map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <Icon name="checkCircle" className="size-4 text-brand-600" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <Checkbox
                  checked={contact.consent}
                  onCheckedChange={(v) => setC("consent", v)}
                  error={shown(3, errors.s4.consent)}
                  label={
                    <>
                      I agree to the{" "}
                      <Link href="/contact" className="font-semibold text-accent-700 underline">
                        terms &amp; conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/contact" className="font-semibold text-accent-700 underline">
                        privacy policy
                      </Link>
                      .
                    </>
                  }
                />
              </div>
            )}

            {attempted[step] && !errors.valid[step] && (
              <p role="alert" className="mt-8 flex items-center gap-2 rounded-xl bg-accent-600/10 px-4 py-3 text-sm font-medium text-accent-700">
                <Icon name="info" className="size-5 shrink-0" /> Please fix the highlighted fields to continue.
              </p>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold text-slate-600 hover:bg-slate-100 hover:text-navy-900"
                >
                  <Icon name="arrowLeft" className="size-5" /> Back
                </button>
              ) : (
                <span />
              )}
              <Button type="submit" size="lg" disabled={status === "loading"} icon={status === "loading" ? undefined : "arrowRight"}>
                {status === "loading" ? (
                  <>
                    <Spinner /> Sending…
                  </>
                ) : step === steps.length - 1 ? (
                  "Get my estimate"
                ) : (
                  `Continue to ${steps[step + 1].title.toLowerCase()}`
                )}
              </Button>
            </div>
          </Card>
        </form>

        <div className="hidden lg:block">
          <PriceSummary estimate={estimate} />
        </div>
      </div>

      {/* spacer so the fixed mobile price bar never covers the buttons */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <MobilePriceBar estimate={estimate} />
    </div>
  );
}

function StepHeading({ title, intro, ref }: { title: ReactNode; intro: string; ref: Ref<HTMLHeadingElement> }) {
  return (
    <div>
      <h2 ref={ref} tabIndex={-1} className="mt-2 text-2xl font-bold outline-none sm:text-3xl [&_em]:text-accent-600 [&_em]:not-italic">
        {title}
      </h2>
      <p className="mt-2 text-slate-600">{intro}</p>
    </div>
  );
}

function Progress({ step, valid, onJump }: { step: number; valid: boolean[]; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Quote progress">
      <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const done = i < step && valid[i];
          const current = i === step;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => onJump(i)}
                disabled={i >= step}
                aria-current={current ? "step" : undefined}
                className="group flex w-full flex-col items-center gap-1.5 text-center disabled:cursor-default sm:flex-row sm:text-left"
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-all ${
                    done ? "bg-brand-600 text-white group-hover:bg-brand-700" : current ? "bg-accent-600 text-white ring-4 ring-accent-600/20" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? <Icon name="check" className="size-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className={`text-xs font-semibold sm:text-sm ${current ? "text-navy-900" : "text-slate-500"}`}>{s.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
