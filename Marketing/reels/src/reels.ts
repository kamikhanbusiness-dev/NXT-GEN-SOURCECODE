/**
 * The five reels: one scene per voiceover line. This file is plain data so
 * both the Remotion compositions and the TTS script (`scripts/voice.ts`) read it.
 *
 * - `voice` is spoken by Gemini TTS and shown as kinetic captions.
 *   Wrap words in *asterisks* to highlight them on screen (asterisks are not spoken).
 * - `title` is the big on-screen headline for the scene (optional).
 * - Scene length follows the generated audio, so edit freely, then re-run `npm run voice`.
 */
import { brand, testimonials } from "./brand.ts";

export type Theme = "sky" | "navy" | "red" | "ice" | "warm";

export type Visual =
  | { kind: "heater" }
  | { kind: "meter" }
  | { kind: "thermometer" }
  | { kind: "acunit"; mode: "cool" | "heat" | "swap" }
  | { kind: "bars" }
  | { kind: "seasons" }
  | { kind: "badges"; items: string[] }
  | { kind: "bigText"; text: string; sub?: string }
  | { kind: "priceCount"; from: number; to: number; label: string }
  | { kind: "multisplit" }
  | { kind: "priceTags"; items: { label: string; price: string }[] }
  | { kind: "stamp"; text: string }
  | { kind: "sizeGauge" }
  | { kind: "certificate" }
  | { kind: "filter" }
  | { kind: "checklist"; items: string[] }
  | { kind: "map" }
  | { kind: "review"; name: string; location: string; quote: string }
  | { kind: "stars" }
  | { kind: "bedroom" }
  | { kind: "calendar"; mode: "booked" | "open" }
  | { kind: "cta"; line: string };

export type Scene = { voice: string; title?: string; theme: Theme; visual: Visual };

export type Reel = {
  id: string;
  /** File name for the MP4 — keyword-rich for SEO. */
  slug: string;
  hook: string;
  /** Gemini prebuilt voice name. */
  voice: string;
  scenes: Scene[];
};

const review = (name: string) => {
  const t = testimonials.find((r) => r.name.startsWith(name));
  if (!t) throw new Error(`No testimonial for ${name}`);
  return t;
};
const sarah = review("Sarah");
const james = review("James");
const helen = review("Helen");

const priceNum = (p: string) => Number(p.replace(/[^0-9]/g, ""));

export const reels: Reel[] = [
  {
    id: "Reel1-WinterHeating",
    slug: "nottingham-air-conditioning-heats-your-home-winter",
    hook: "Pattern interrupt + seasonal pain (winter heating bills)",
    voice: "Puck",
    scenes: [
      {
        theme: "red",
        title: "STOP using *plug-in heaters*",
        voice: "Nottingham, stop heating your home with *plug-in heaters*.",
        visual: { kind: "heater" },
      },
      {
        theme: "warm",
        title: "Your meter *hates* them",
        voice: "They're one of the *most expensive* ways to heat a room.",
        visual: { kind: "meter" },
      },
      {
        theme: "sky",
        title: "Air con *heats* too",
        voice: "Here's what most people don't know. Air conditioning *heats too*.",
        visual: { kind: "acunit", mode: "swap" },
      },
      {
        theme: "navy",
        title: "1kW in → *4kW* of heat",
        voice: "One kilowatt of electricity in. Up to *four kilowatts* of heat out.",
        visual: { kind: "bars" },
      },
      {
        theme: "ice",
        title: "One system. *All year.*",
        voice: "Cool in July. *Warm in January.* One system, all year round.",
        visual: { kind: "seasons" },
      },
      {
        theme: "sky",
        voice: `NXTGEN fit it *in a day*, from ${brand.prices.install}, right across Nottingham.`,
        visual: { kind: "badges", items: ["Fitted in a day", `From ${brand.prices.install}`, "F-Gas certified"] },
      },
      {
        theme: "navy",
        voice: "Get your *instant estimate* in two minutes. Tap the link in our bio.",
        visual: { kind: "cta", line: "Instant online estimate" },
      },
    ],
  },
  {
    id: "Reel2-RealPrices",
    slug: "how-much-does-air-conditioning-cost-nottingham",
    hook: "Curiosity + price transparency (the #1 searched question)",
    voice: "Zephyr",
    scenes: [
      {
        theme: "navy",
        title: "How much does *air con* cost?",
        voice: "How much does air con *actually* cost in Nottingham?",
        visual: { kind: "bigText", text: "£ ? ? ?", sub: "Nottingham · 2026" },
      },
      {
        theme: "red",
        title: "No *“call for a price”*",
        voice: "No *call us for a price*. Here are the *real numbers*.",
        visual: { kind: "stamp", text: "REAL PRICES" },
      },
      {
        theme: "sky",
        title: "One room, *fully fitted*",
        voice: `One room, fully fitted, from *${brand.prices.install}* to around two thousand two hundred.`,
        visual: { kind: "priceCount", from: priceNum(brand.prices.install), to: 2200, label: "1 room · fully installed" },
      },
      {
        theme: "ice",
        title: "Whole house? *One* outdoor unit",
        voice: "More rooms? *One outdoor unit* can run up to five.",
        visual: { kind: "multisplit" },
      },
      {
        theme: "navy",
        title: "Already got air con?",
        voice: `Already have air con? Servicing from *${brand.prices.servicing}*. Repairs from *${brand.prices.repairs}*.`,
        visual: {
          kind: "priceTags",
          items: [
            { label: "Servicing", price: brand.prices.servicing },
            { label: "Repairs", price: brand.prices.repairs },
          ],
        },
      },
      {
        theme: "red",
        title: "*Fixed* price. No surprises.",
        voice: "Our free survey locks in a *fixed price*. No surprises.",
        visual: { kind: "stamp", text: "FIXED PRICE" },
      },
      {
        theme: "navy",
        voice: "Check *your exact price* in two minutes. Link in bio.",
        visual: { kind: "cta", line: "See your price in 2 minutes" },
      },
    ],
  },
  {
    id: "Reel3-ThreeMistakes",
    slug: "3-air-conditioning-mistakes-nottingham-homeowners",
    hook: "Listicle / expert authority (\"3 mistakes\") + save prompt",
    voice: "Puck",
    scenes: [
      {
        theme: "red",
        title: "*3 mistakes* that double your cost",
        voice: "*Three mistakes* that make air con cost you double.",
        visual: { kind: "bigText", text: "3", sub: "MISTAKES" },
      },
      {
        theme: "navy",
        title: "#1 The *wrong size*",
        voice: "One. The *wrong size*. Too big is noisy. Too small can't keep up.",
        visual: { kind: "sizeGauge" },
      },
      {
        theme: "sky",
        title: "We size *every room*",
        voice: "We size *every room*, so you get the quietest unit for the job.",
        visual: { kind: "acunit", mode: "cool" },
      },
      {
        theme: "red",
        title: "#2 *Uncertified* installers",
        voice: "Two. *Uncertified installers*. By law, they must be *F-Gas certified*.",
        visual: { kind: "certificate" },
      },
      {
        theme: "warm",
        title: "#3 *Never* servicing it",
        voice: "Three. *Never servicing it*. A dirty system can use up to *30% more* energy.",
        visual: { kind: "filter" },
      },
      {
        theme: "ice",
        title: "The NXTGEN way",
        voice: "NXTGEN. F-Gas certified, *fixed prices*, and up to a *seven-year warranty*.",
        visual: { kind: "checklist", items: ["Room-by-room sizing", "F-Gas certified team", "Fixed-price quotes", "Up to 7-year warranty"] },
      },
      {
        theme: "navy",
        voice: "*Save this* for later, and grab your free estimate. Link in bio.",
        visual: { kind: "cta", line: "Free estimate · no obligation" },
      },
    ],
  },
  {
    id: "Reel4-LocalProof",
    slug: "best-air-conditioning-installers-nottingham-reviews",
    hook: "Local social proof (neighbours' reviews + map)",
    voice: "Zephyr",
    scenes: [
      {
        theme: "sky",
        title: "Why is *Nottingham* switching?",
        voice: "Why are so many *Nottingham homes* switching to NXTGEN?",
        visual: { kind: "map" },
      },
      {
        theme: "navy",
        voice: `Over *${brand.installs.replace("+", "")}* systems installed across *Nottinghamshire*.`,
        visual: { kind: "bigText", text: brand.installs, sub: "systems installed" },
      },
      {
        theme: "ice",
        voice: `Sarah, in ${sarah.location}: our loft bedroom was *unbearable*. Done in a day, and it's *whisper quiet*.`,
        visual: { kind: "review", name: sarah.name, location: sarah.location, quote: "Our loft bedroom was unbearable in summer… finished in a day. It's whisper quiet at night." },
      },
      {
        theme: "ice",
        voice: "James, in the city centre: the online estimate was *spot on* with the final price.",
        visual: { kind: "review", name: james.name, location: james.location, quote: "The online estimate was spot on with the final price, which made the decision easy." },
      },
      {
        theme: "ice",
        voice: `Helen, in ${helen.location}: our conservatory is finally usable *all year round*.`,
        visual: { kind: "review", name: helen.name, location: helen.location, quote: "Our conservatory is finally usable all year round — cool in July and warm in January." },
      },
      {
        theme: "navy",
        voice: `Rated *${brand.rating} stars* on Google. F-Gas certified. Fully insured.`,
        visual: { kind: "stars" },
      },
      {
        theme: "red",
        voice: "Join your neighbours. Get your *instant estimate* today. Link in bio.",
        visual: { kind: "cta", line: `Join ${brand.installs} local homes` },
      },
    ],
  },
  {
    id: "Reel5-BeatTheRush",
    slug: "bedroom-air-conditioning-nottingham-beat-summer-rush",
    hook: "Relatable memory (sleepless heatwave) + scarcity / beat the rush",
    voice: "Puck",
    scenes: [
      {
        theme: "warm",
        title: "Remember *last summer*?",
        voice: "Remember trying to *sleep* last summer?",
        visual: { kind: "bedroom" },
      },
      {
        theme: "warm",
        title: "Still *roasting* at 3am",
        voice: "Windows open. Fan on full. Still *roasting* at three a.m.",
        visual: { kind: "thermometer" },
      },
      {
        theme: "red",
        title: "Then everyone *books at once*",
        voice: "When the heat hits, installers across Nottingham get *booked up fast*.",
        visual: { kind: "calendar", mode: "booked" },
      },
      {
        theme: "sky",
        title: "The smart move: *book now*",
        voice: "So here's the smart move. *Book now*, while install dates are *wide open*.",
        visual: { kind: "calendar", mode: "open" },
      },
      {
        theme: "ice",
        title: "Quiet. Fast. *Heats too.*",
        voice: "Whisper-quiet bedroom units, *fitted in a day*, that keep you warm this winter too.",
        visual: { kind: "acunit", mode: "swap" },
      },
      {
        theme: "navy",
        voice: "Next summer, *sleep cool*. Free survey, fixed price. Link in bio.",
        visual: { kind: "cta", line: "Book your free survey" },
      },
    ],
  },
];

/** Text sent to TTS: highlight markers removed. */
export const spoken = (s: string) => s.replace(/\*/g, "");
