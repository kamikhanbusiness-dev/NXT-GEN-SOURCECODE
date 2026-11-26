/**
 * Business details used across the whole site (header, footer, JSON-LD,
 * emails, metadata). Edit these values to rebrand or update contact info —
 * nothing else in the codebase hard-codes them.
 */
export const site = {
  name: "NXTGEN Air Conditioning",
  shortName: "NXTGEN",
  legalName: "NXTGEN Air Conditioning Ltd", // placeholder — confirm with client
  tagline: "Air conditioning installation, servicing & repair in Nottingham",
  description:
    "F-Gas certified air conditioning installers in Nottingham. Fixed-price home and commercial AC installation, servicing and repairs across Nottinghamshire. Get an instant online estimate.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Contact — placeholders until confirmed by the client
  phone: "0115 000 0000",
  phoneHref: "tel:+441150000000",
  email: "hello@nxtgen-aircon.co.uk",
  whatsapp: "", // e.g. "https://wa.me/447000000000" — leave empty to hide

  address: {
    street: "Unit 1, Example Business Park",
    locality: "Nottingham",
    region: "Nottinghamshire",
    postcode: "NG1 1AA",
    country: "GB",
  },
  geo: { latitude: 52.9548, longitude: -1.1581 }, // Nottingham city centre

  openingHours: [
    { days: "Mon – Fri", hours: "8:00am – 6:00pm" },
    { days: "Saturday", hours: "9:00am – 2:00pm" },
    { days: "Sunday", hours: "Emergency call-outs only" },
  ],
  // schema.org format for the opening hours above
  openingHoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
    { days: ["Saturday"], opens: "09:00", closes: "14:00" },
  ],

  // Trust indicators — replace with real figures
  foundedYear: 2012,
  yearsExperience: 12,
  installsCompleted: "1,500+",
  rating: { value: 4.9, count: 214, source: "Google" },
  accreditations: ["F-Gas Certified", "REFCOM Registered", "NICEIC Approved", "Fully Insured"],

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    google: "https://g.page/",
  },
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas Covered" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Advice" },
  { href: "/contact", label: "Contact" },
] as const;
