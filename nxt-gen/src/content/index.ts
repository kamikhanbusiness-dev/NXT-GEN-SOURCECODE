/**
 * Placeholder marketing copy for the prototype. Replace with the client's
 * real testimonials, FAQs and articles before launch.
 */
import type { IconName } from "@/components/ui/Icon";

export type Service = {
  slug: string;
  icon: IconName;
  title: string;
  summary: string;
  body: string;
  benefits: string[];
  from: string;
};

export const services: Service[] = [
  {
    slug: "installation",
    icon: "snowflake",
    title: "Air Conditioning Installation",
    summary: "Wall-mounted, multi-split, ducted and cassette systems, sized properly for each room.",
    body: "We survey every room, calculate the real cooling load and recommend the smallest, quietest system that will do the job. Installs are usually completed in a single day with neat, colour-matched trunking and no mess left behind.",
    benefits: ["Free home survey & heat-load calculation", "Most homes fitted in one day", "Up to 7-year manufacturer warranty", "A+++ energy-efficient units"],
    from: "£1,450",
  },
  {
    slug: "servicing",
    icon: "gauge",
    title: "Servicing & Maintenance",
    summary: "Annual servicing that keeps your system efficient, hygienic and within warranty.",
    body: "A dirty system can use up to 30% more energy. Our service covers filter and coil cleaning, anti-bacterial treatment, refrigerant pressure checks and a full performance report.",
    benefits: ["Keeps your warranty valid", "Lower running costs", "Cleaner, healthier air", "Priority booking for plan members"],
    from: "£95",
  },
  {
    slug: "repairs",
    icon: "wrench",
    title: "Repairs & Breakdowns",
    summary: "Fast diagnosis and repair for all major brands, whoever installed it.",
    body: "Fault codes, leaks, strange noises or no cooling at all — our F-Gas certified engineers carry common parts on the van so most faults are fixed on the first visit.",
    benefits: ["Same or next-day call-outs", "All major brands repaired", "Leak detection & re-gas", "Upfront, fixed repair pricing"],
    from: "£89",
  },
  {
    slug: "domestic",
    icon: "home",
    title: "Home Air Conditioning",
    summary: "Bedrooms, lofts, home offices and conservatories that stay comfortable all year.",
    body: "Modern air conditioners are also highly efficient heat pumps, so the same unit that keeps you cool in July can heat the room in January for a fraction of the cost of electric heaters.",
    benefits: ["Whisper-quiet bedroom units", "Heating & cooling in one", "Smart Wi-Fi control", "Discreet, tidy installs"],
    from: "£1,450",
  },
  {
    slug: "commercial",
    icon: "building",
    title: "Commercial Air Conditioning",
    summary: "Offices, shops, restaurants and server rooms across Nottinghamshire.",
    body: "We design and install systems for businesses of every size, with out-of-hours fitting to avoid disruption and planned maintenance contracts to keep everything running.",
    benefits: ["Out-of-hours installation", "TM44 & F-Gas compliance", "Planned maintenance contracts", "Server & comms room cooling"],
    from: "£2,200",
  },
  {
    slug: "heat-pumps",
    icon: "leaf",
    title: "Air-to-Air Heat Pumps",
    summary: "Low-carbon heating that can cut running costs compared with electric heaters.",
    body: "Every system we fit can heat as well as cool. For every 1kW of electricity used, a heat pump can deliver 3–4kW of heat — a big saving for rooms that rely on plug-in heaters.",
    benefits: ["Up to 4× more efficient than electric heaters", "One system for all seasons", "Lower carbon footprint", "Ideal for extensions & garden rooms"],
    from: "£1,450",
  },
];

export const processSteps = [
  { icon: "pound", title: "Get an instant estimate", text: "Answer a few quick questions online and see a price range straight away." },
  { icon: "calendar", title: "Free home survey", text: "An engineer visits, measures up and confirms a fixed price — no obligation." },
  { icon: "snowflake", title: "Professional install", text: "Most homes are fitted in a single day by our own F-Gas certified team." },
  { icon: "shield", title: "Aftercare & warranty", text: "Up to 7 years' warranty, annual servicing and a local team on call." },
] as const satisfies readonly { icon: IconName; title: string; text: string }[];

export const testimonials = [
  {
    name: "Sarah M.",
    location: "West Bridgford",
    text: "Our loft bedroom was unbearable in summer. The team turned up on time, finished in a day and you'd hardly know the pipework was there. It's whisper quiet at night.",
    job: "Loft conversion · Wall-mounted split",
  },
  {
    name: "James P.",
    location: "Nottingham City Centre",
    text: "Great communication from quote to install. The online estimate was spot on with the final price, which made the decision easy.",
    job: "Apartment · 2-room multi-split",
  },
  {
    name: "Priya K.",
    location: "Beeston",
    text: "We had air con fitted in our dental practice. They worked over a weekend so we didn't lose a single appointment. Highly recommend.",
    job: "Commercial · 3 ceiling cassettes",
  },
  {
    name: "Mark T.",
    location: "Arnold",
    text: "Two bedrooms and the office done from one outdoor unit. The engineers explained everything, tidied up perfectly and the app control is brilliant.",
    job: "Semi-detached · 3-room multi-split",
  },
  {
    name: "Helen W.",
    location: "Long Eaton",
    text: "Our conservatory is finally usable all year round — cool in July and warm in January. Fair price and a really friendly team.",
    job: "Conservatory · Wall-mounted split",
  },
] as const;

export const features = [
  { icon: "engineer", title: "Experts in the industry", text: "F-Gas certified engineers with years of hands-on air conditioning experience." },
  { icon: "trophy", title: "Quality of workmanship", text: "Neat pipe routes, colour-matched trunking and meticulous attention to detail." },
  { icon: "globe", title: "Local coverage", text: "Based in Nottingham with fast surveys and call-outs across the county." },
  { icon: "star", title: "Google reviews", text: "Rated 4.9 out of 5 by hundreds of happy homeowners and businesses." },
  { icon: "card", title: "Finance & payment", text: "Flexible ways to pay, with finance options available on new systems." },
  { icon: "briefcase", title: "Guaranteed work", text: "Up to 7-year manufacturer warranties and our own workmanship guarantee." },
  { icon: "shield", title: "Fully accredited", text: "F-Gas, REFCOM and NICEIC accredited, and fully insured for every job." },
  { icon: "leaf", title: "Sustainable practices", text: "A+++ efficient heat pumps and responsible refrigerant recovery and recycling." },
] as const satisfies readonly { icon: IconName; title: string; text: string }[];

export const faqs = [
  {
    q: "How much does air conditioning cost in Nottingham?",
    a: "A single wall-mounted system for one room typically costs between £1,450 and £2,200 fully installed, depending on the unit size, brand and how far the outdoor unit is from the indoor unit. Use our online estimator for a tailored range.",
  },
  {
    q: "How long does installation take?",
    a: "Most single-room installations are completed in one day. Multi-room and commercial systems usually take two to four days. We'll give you a clear timeline at survey.",
  },
  {
    q: "Do I need planning permission?",
    a: "Most domestic installations fall under permitted development, provided the outdoor unit meets size and noise rules. Listed buildings and conservation areas may need consent — we'll check for you.",
  },
  {
    q: "Can air conditioning heat my home too?",
    a: "Yes. Every system we install is a reversible heat pump, providing efficient heating in winter as well as cooling in summer.",
  },
  {
    q: "Is air conditioning noisy?",
    a: "Modern indoor units run as low as 19dB on night mode — quieter than a whisper. Outdoor units are positioned carefully to keep noise away from bedrooms and neighbours.",
  },
  {
    q: "Are your engineers certified?",
    a: "All of our engineers hold F-Gas certification, as required by law to handle refrigerants, and we are fully insured for domestic and commercial work.",
  },
] as const;

export const brands = ["Daikin", "Mitsubishi Electric", "Fujitsu", "Toshiba", "LG", "Samsung", "Panasonic"] as const;

export const posts = [
  { title: "How to choose the right size air conditioner for your room", excerpt: "kW, BTU and why bigger isn't better — a plain-English guide to sizing.", tag: "Buying guide", read: "6 min" },
  { title: "Air conditioning running costs in the UK: what to expect", excerpt: "Real-world running costs for bedrooms, living rooms and offices.", tag: "Running costs", read: "5 min" },
  { title: "Can an air conditioner replace my heating?", excerpt: "How air-to-air heat pumps compare to gas and electric heating.", tag: "Heat pumps", read: "7 min" },
  { title: "Keeping a loft conversion cool in summer", excerpt: "Why lofts overheat and the best ways to fix it for good.", tag: "Home comfort", read: "4 min" },
  { title: "Does air conditioning need planning permission?", excerpt: "Permitted development rules explained for homeowners.", tag: "Regulations", read: "5 min" },
  { title: "Office air conditioning: a guide for small businesses", excerpt: "Comfort, compliance and keeping staff productive.", tag: "Commercial", read: "8 min" },
] as const;
