"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/config/site";
import { areas } from "@/config/areas";
import { services } from "@/content";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type MegaKey = "aircon" | "areas";
type NavItem = { label: string; href: string; mega?: MegaKey; wideOnly?: boolean };

const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Air Con", href: "/services", mega: "aircon" },
  { label: "Servicing", href: "/services#servicing" },
  { label: "Commercial", href: "/services#commercial", wideOnly: true },
  { label: "Service Areas", href: "/areas", mega: "areas" },
  { label: "Advice", href: "/blog" },
];

const topLinks = [
  { label: "Reviews", href: "/#reviews", icon: "star" as IconName },
  { label: "Get a quote", href: "/get-a-quote" },
  { label: "Contact us", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close menus after navigation (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setMega(null);
  }

  // Slide the header away while scrolling down so it never covers content,
  // and bring it back as soon as the user scrolls up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) < 6) return; // ignore tiny jitters
      setHidden(y > lastY && y > 160);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Small delay on close so the pointer can travel from the tab into the panel.
  const openMega = (k: MegaKey) => {
    clearTimeout(closeTimer.current);
    setMega(k);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 160);
  };

  const isActive = (href: string) => !href.includes("#") && pathname === href;
  const concealed = hidden && !mobileOpen && !mega;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out ${concealed ? "-translate-y-[130%]" : ""}`}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6">
        {/* Red quick-links tab */}
        <div className={`hidden justify-end overflow-hidden transition-all duration-300 lg:flex ${scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}>
          <nav aria-label="Quick links" className="rounded-b-2xl bg-accent-600 px-6 py-1.5 text-white shadow-lg">
            <ul className="flex items-center divide-x divide-white/50 text-base font-medium uppercase">
              {topLinks.map((l) => (
                <li key={l.href} className="px-4 first:pl-0 last:pr-0">
                  <Link href={l.href} className="flex items-center gap-1.5 hover:text-white/80">
                    {l.icon && <Icon name={l.icon} className="size-4 fill-current" />}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logo pill overlapping the navy bar */}
        <div className={`relative transition-[margin] duration-300 ${scrolled ? "mt-2" : "mt-2 lg:mt-3"}`}>
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="absolute top-1/2 left-0 z-20 flex h-16 -translate-y-1/2 items-center rounded-full bg-white px-5 shadow-[0_10px_30px_-8px_rgba(7,11,24,0.35)] transition-transform hover:scale-[1.02] lg:h-[88px] lg:px-9"
          >
            <Logo />
          </Link>

          <div className="flex h-[60px] items-center justify-end rounded-full bg-navy-900 pr-2 pl-[214px] shadow-[0_10px_30px_-10px_rgba(7,11,24,0.5)] lg:h-[72px] lg:justify-between lg:pr-6 lg:pl-[270px] xl:pr-8 xl:pl-[290px]">
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center">
                <li onMouseEnter={scheduleClose}>
                  <Link
                    href="/"
                    aria-label="Home"
                    aria-current={pathname === "/" ? "page" : undefined}
                    className="grid size-11 place-items-center text-white transition-colors hover:text-brand-400 aria-[current=page]:text-brand-400"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                      <path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3L12 3Z" />
                    </svg>
                  </Link>
                </li>
                {navItems.map((item) => (
                  <li key={item.label} className={item.wideOnly ? "hidden xl:block" : ""} onMouseEnter={() => (item.mega ? openMega(item.mega) : scheduleClose())}>
                    {item.mega ? (
                      <button
                        type="button"
                        aria-expanded={mega === item.mega}
                        aria-controls={`mega-${item.mega}`}
                        onClick={() => setMega((m) => (m === item.mega ? null : item.mega!))}
                        className={`flex h-[72px] items-center gap-1 px-2.5 text-[0.95rem] font-medium whitespace-nowrap uppercase transition-colors xl:px-4 xl:text-[0.98rem] ${
                          mega === item.mega ? "bg-navy-950 text-brand-400" : pathname === item.href ? "text-brand-400" : "text-white hover:text-brand-400"
                        }`}
                      >
                        {item.label}
                        <Icon name="chevronDown" className={`size-4 transition-transform duration-300 ${mega === item.mega ? "rotate-180" : ""}`} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="flex h-[72px] items-center px-2.5 text-[0.95rem] font-medium whitespace-nowrap text-white uppercase transition-colors hover:text-brand-400 aria-[current=page]:text-brand-400 xl:px-4 xl:text-[0.98rem]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <a href={site.phoneHref} className="group hidden items-center gap-3 text-white lg:flex" onMouseEnter={scheduleClose}>
              <Icon name="phone" className="size-8 text-brand-400 transition-transform group-hover:rotate-12" strokeWidth={1.5} />
              <span className="hidden leading-tight whitespace-nowrap xl:block">
                <span className="block text-sm font-medium">Call Us Today</span>
                <span className="block text-xl font-bold tracking-wide">{site.phone}</span>
              </span>
            </a>

            <div className="flex items-center gap-1 lg:hidden">
              <a href={site.phoneHref} aria-label={`Call ${site.phone}`} className="grid size-11 place-items-center rounded-full text-brand-400">
                <Icon name="phone" className="size-6" />
              </a>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full text-white"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((o) => !o)}
              >
                <Icon name={mobileOpen ? "x" : "menu"} className="size-7" />
              </button>
            </div>
          </div>

          {/* Desktop mega menus */}
          {mega && (
            <div
              id={`mega-${mega}`}
              onMouseEnter={() => openMega(mega)}
              className="absolute inset-x-0 top-full mt-2 hidden animate-[fade-up_0.3s_ease_both] overflow-hidden rounded-3xl bg-navy-950 p-10 text-white shadow-2xl lg:block"
            >
              {mega === "aircon" ? <AirConMega /> : <AreasMega />}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" hidden={!mobileOpen} className="fixed inset-x-0 top-[76px] bottom-0 overflow-y-auto bg-navy-950 px-5 pt-4 pb-32 text-white lg:hidden">
        <nav aria-label="Mobile">
          <ul className="divide-y divide-white/10">
            <MobileLink href="/">Home</MobileLink>
            <MobileLink href="/about">About</MobileLink>
            <MobileGroup title="Air Con">
              {services.map((s) => (
                <MobileLink key={s.slug} href={`/services#${s.slug}`} small>
                  {s.title}
                </MobileLink>
              ))}
            </MobileGroup>
            <MobileGroup title="Service Areas">
              {areas.map((a) => (
                <MobileLink key={a.slug} href={`/areas#${a.slug}`} small>
                  {a.name}
                </MobileLink>
              ))}
            </MobileGroup>
            <MobileLink href="/blog">Advice</MobileLink>
            <MobileLink href="/contact">Contact</MobileLink>
          </ul>
        </nav>
        <div className="mt-8 grid gap-3">
          <Link href="/get-a-quote" className="flex min-h-14 items-center justify-center rounded-full bg-accent-600 text-lg font-bold uppercase">
            Get a quote
          </Link>
          <a href={site.phoneHref} className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand-600 text-lg font-bold">
            <Icon name="phone" className="size-5" /> {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}

function MegaTitle({ children }: { children: ReactNode }) {
  return (
    <p className="relative mb-4 inline-block pr-16 font-display text-3xl font-bold uppercase">
      {children}
      <span className="absolute right-0 -bottom-2 h-0.5 w-40 rounded-full bg-brand-400" />
    </p>
  );
}

function AirConMega() {
  return (
    <div className="grid grid-cols-[1fr_1.6fr] gap-10">
      <div>
        <MegaTitle>Air con services</MegaTitle>
        <ul className="mt-4">
          {services.map((s, i) => (
            <li key={s.slug} className="animate-[fade-up_0.4s_ease_both] border-b border-white/15" style={{ animationDelay: `${i * 40}ms` }}>
              <Link href={`/services#${s.slug}`} className="group flex items-center justify-between py-3.5 text-lg font-medium uppercase hover:text-brand-400">
                {s.title.replace("Air Conditioning ", "")}
                <Icon name="arrowRight" className="size-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <MegaCard title="Need a new air con system?" cta="Get an instant quote" href="/get-a-quote" wide />
        <MegaCard title="Annual service due?" cta="Book a service" href="/contact" />
        <MegaCard title="System not cooling?" cta="Book a repair" href="/contact" />
      </div>
    </div>
  );
}

function AreasMega() {
  return (
    <div className="grid grid-cols-[1fr_1.6fr] gap-10">
      <div>
        <MegaTitle>Areas we cover</MegaTitle>
        <ul className="mt-4 grid grid-cols-2 gap-x-8">
          {areas.map((a, i) => (
            <li key={a.slug} className="animate-[fade-up_0.4s_ease_both] border-b border-white/15" style={{ animationDelay: `${i * 35}ms` }}>
              <Link href={`/areas#${a.slug}`} className="block py-3 text-base font-medium uppercase hover:text-brand-400">
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[
          { icon: "mapPin" as IconName, big: "25", small: "mile radius", text: "Covering Nottingham & Nottinghamshire" },
          { icon: "clock" as IconName, big: "48", small: "hour surveys", text: "Fast surveys across our service area" },
          { icon: "shield" as IconName, big: "£0", small: "call-out fees", text: "Same fixed prices wherever you are" },
        ].map((c) => (
          <div key={c.small} className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 text-center text-navy-900">
            <span className="grid size-16 place-items-center rounded-full bg-gradient-to-b from-accent-600 to-brand-400 text-white">
              <Icon name={c.icon} className="size-8" />
            </span>
            <p className="mt-4 font-display text-4xl font-extrabold">{c.big}</p>
            <p className="font-semibold uppercase text-brand-600">{c.small}</p>
            <p className="mt-2 text-sm text-ink/70">{c.text}</p>
          </div>
        ))}
        <Link href="/areas" className="col-span-3 flex items-center justify-center gap-2 rounded-full bg-accent-600 py-3.5 font-bold uppercase hover:bg-accent-700">
          View all areas <Icon name="arrowRight" className="size-5" />
        </Link>
      </div>
    </div>
  );
}

function MegaCard({ title, cta, href, wide }: { title: string; cta: string; href: string; wide?: boolean }) {
  return (
    <div className={`flex flex-col justify-between rounded-2xl border-4 border-brand-400 bg-white p-7 text-navy-900 ${wide ? "col-span-2" : ""}`}>
      <p className="font-display text-2xl font-bold">{title}</p>
      <Link
        href={href}
        className="mt-5 inline-flex w-fit items-center rounded-full bg-accent-600 px-8 py-3 font-bold text-white uppercase transition-transform hover:-translate-y-0.5 hover:bg-accent-700"
      >
        {cta}
      </Link>
    </div>
  );
}

function MobileLink({ href, children, small }: { href: string; children: ReactNode; small?: boolean }) {
  return (
    <li>
      <Link href={href} className={`flex items-center justify-between font-medium uppercase ${small ? "min-h-11 pl-4 text-sm text-white/80" : "min-h-14 text-lg"}`}>
        {children}
        {!small && <Icon name="arrowRight" className="size-5 text-white/40" />}
      </Link>
    </li>
  );
}

function MobileGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li>
      <Accordion type="single" collapsible>
        <AccordionItem value={title} className="border-0">
          <AccordionTrigger className="min-h-14 items-center py-0 text-lg font-medium uppercase hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-white/60">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <ul>{children}</ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  );
}

/** Thumb-friendly call / quote bar fixed to the bottom of small screens. */
export function MobileCtaBar() {
  const pathname = usePathname();
  if (pathname === "/get-a-quote") return null; // the wizard has its own sticky price bar
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 sm:hidden">
      <a href={site.phoneHref} className="flex min-h-14 items-center justify-center gap-2 bg-brand-600 font-bold text-white">
        <Icon name="phone" className="size-5" /> Call us
      </a>
      <Link href="/get-a-quote" className="flex min-h-14 items-center justify-center gap-2 bg-accent-600 font-bold text-white uppercase">
        Get a quote
      </Link>
    </div>
  );
}
