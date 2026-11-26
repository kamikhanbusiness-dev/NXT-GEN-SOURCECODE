import Link from "next/link";
import { site } from "@/config/site";
import { services } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { CoverageMap } from "@/components/illustrations/CoverageMap";

const info = [
  { label: "Terms & Conditions", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "Cookie Policy", href: "/contact" },
  { label: "Price Promise", href: "/get-a-quote" },
  { label: "Areas Covered", href: "/areas" },
];

export function Footer() {
  const { address } = site;
  return (
    <footer className="relative overflow-hidden bg-navy-950 pb-14 text-white sm:pb-0">
      {/* Red & blue swooshes behind the map card */}
      <div className="absolute -top-24 -left-24 h-72 w-[60%] rotate-[-6deg] rounded-[50%] bg-accent-600/90" aria-hidden="true" />
      <div className="absolute -top-28 -right-24 h-64 w-[50%] rotate-[8deg] rounded-[50%] bg-brand-400/80" aria-hidden="true" />

      <Container className="relative pt-14">
        <div data-reveal="zoom" className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1fr_1.6fr]">
          <div className="relative bg-accent-600 p-8 sm:p-10">
            <div className="absolute inset-x-6 -bottom-3 h-6 rounded-b-3xl bg-brand-400 lg:hidden" aria-hidden="true" />
            <h2 className="font-display text-3xl font-extrabold text-white">Get in touch</h2>
            <ul className="mt-6 space-y-5 text-lg">
              <li className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-accent-600">
                  <Icon name="phone" className="size-5" />
                </span>
                <a href={site.phoneHref} className="font-bold hover:underline">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-accent-600">
                  <Icon name="mail" className="size-5" />
                </span>
                <a href={`mailto:${site.email}`} className="break-all hover:underline">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-accent-600">
                  <Icon name="clock" className="size-5" />
                </span>
                <span>Mon – Sat: 8:00 AM to 6:00 PM</span>
              </li>
            </ul>
          </div>
          <CoverageMap />
        </div>
      </Container>

      <Container className="relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Address</h2>
          <address className="mt-5 text-lg leading-relaxed not-italic text-white/90">
            {address.street},
            <br />
            {address.locality},
            <br />
            {address.region},
            <br />
            {address.postcode}
          </address>
          <h2 className="mt-8 font-display text-2xl font-bold text-white">Schedule a call</h2>
          <a href={site.phoneHref} className="mt-4 block text-lg hover:text-brand-400">
            {site.phone}
          </a>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white">Quick links</h2>
          <ul className="mt-5 space-y-3 text-lg text-white/90">
            {services.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="transition-colors hover:text-brand-400">
                  {s.title.replace("Air Conditioning ", "")}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="transition-colors hover:text-brand-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white">Information</h2>
          <ul className="mt-5 space-y-3 text-lg text-white/90">
            {info.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-brand-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white">We accept</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {[
              ["VISA", "bg-[#1a1f71] text-white italic"],
              ["Mastercard", "bg-white text-[#eb001b]"],
              ["PayPal", "bg-white text-[#003087] italic"],
              ["Finance", "bg-brand-400 text-white"],
            ].map(([label, cls]) => (
              <li key={label} className={`grid h-10 min-w-16 place-items-center rounded-lg px-3 text-sm font-extrabold ${cls}`}>
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-12 w-full max-w-72 items-center justify-center rounded-full bg-accent-600 font-bold uppercase transition-all hover:-translate-y-0.5 hover:bg-accent-700"
          >
            Make a payment
          </Link>
          <h2 className="mt-8 font-display text-2xl font-bold text-white">Follow us</h2>
          <ul className="mt-4 flex gap-3">
            {(
              [
                ["facebook", site.social.facebook, "Facebook"],
                ["instagram", site.social.instagram, "Instagram"],
              ] as const
            ).map(([icon, href, label]) => (
              <li key={icon}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid size-12 place-items-center rounded-full bg-white text-navy-950 transition-all hover:-translate-y-1 hover:bg-brand-400 hover:text-white"
                >
                  <Icon name={icon} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="relative bg-brand-400 text-center text-navy-950">
        <Container className="space-y-4 py-7 text-[0.95rem] leading-relaxed">
          <p>
            {site.legalName} is fully insured and F-Gas certified. Finance options, where offered, are subject to status and credit
            checks. {/* Placeholder — replace with the client's regulatory wording */}
          </p>
          <p className="font-medium">© {site.legalName}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
