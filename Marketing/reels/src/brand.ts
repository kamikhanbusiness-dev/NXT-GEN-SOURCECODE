/**
 * Brand facts for the reels. Pulled straight from the website config so the
 * videos never drift from the site — update `src/config/site.ts` and
 * `src/content/index.ts` in the Next app, then re-render.
 */
import { site } from "../../src/config/site.ts";
import { services, testimonials } from "../../src/content/index.ts";

export { site, testimonials };

const fromPrice = (slug: string) => services.find((s) => s.slug === slug)?.from ?? "";

export const brand = {
  name: site.shortName,
  phone: site.phone,
  domain: site.email.split("@")[1], // nxtgen-aircon.co.uk
  rating: site.rating.value,
  reviewCount: site.rating.count,
  installs: site.installsCompleted,
  prices: {
    install: fromPrice("installation"),
    servicing: fromPrice("servicing"),
    repairs: fromPrice("repairs"),
  },
  areas: ["Nottingham", "West Bridgford", "Beeston", "Arnold", "Carlton", "Hucknall", "Long Eaton", "Mansfield"],
} as const;

export const colors = {
  sky: "#4aa1d8",
  skyLight: "#cdf5f5",
  ice: "#e2eff8",
  blue: "#1f75b3",
  blueDark: "#16507d",
  red: "#c8363a",
  redBright: "#e5484d",
  navy: "#1c2033",
  navyDeep: "#070b18",
  ink: "#2b2f3a",
  white: "#ffffff",
  yellow: "#ffd23f",
  orange: "#ff8a3d",
  logoBlue: "#1a9ad6",
  logoRed: "#c8202b",
} as const;
