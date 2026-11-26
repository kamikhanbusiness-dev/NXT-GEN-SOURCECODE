import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, Stars } from "@/components/ui/primitives";
import { Cloud, Skyline } from "@/components/illustrations/Skyline";

// Clouds drift slowly across the sky at different speeds and heights.
const clouds = [
  { top: "16%", w: "w-40 sm:w-56", dur: "70s", delay: "-10s" },
  { top: "32%", w: "w-28 sm:w-40", dur: "55s", delay: "-35s" },
  { top: "8%", w: "w-32 sm:w-44", dur: "85s", delay: "-60s" },
  { top: "48%", w: "w-36 sm:w-52", dur: "65s", delay: "-20s" },
];

export function Hero() {
  return (
    <section className="pt-header relative overflow-hidden bg-sky">
      {clouds.map((c, i) => (
        <Cloud
          key={i}
          className={`pointer-events-none absolute -left-[15%] animate-drift ${c.w}`}
          style={{ top: c.top, animationDuration: c.dur, animationDelay: c.delay }}
        />
      ))}

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="animate-fade-up font-display text-base font-semibold text-navy-900 sm:text-2xl">
          Your trusted air con, heat pump &amp; servicing experts for Nottingham
        </p>
        <h1 className="mt-5 animate-fade-up font-display text-[2.6rem] leading-[1.08] font-extrabold tracking-tight [animation-delay:100ms] sm:text-6xl lg:text-[5.25rem]">
          Trusted Air Conditioning Specialists For Nottingham &amp; Nottinghamshire
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <span className="animate-pop-in [animation-delay:250ms]">
            <ButtonLink href="/get-a-quote" size="lg">
              Get a quote
            </ButtonLink>
          </span>
          <span className="animate-pop-in [animation-delay:350ms]">
            <ButtonLink href="/services" variant="secondary" size="lg">
              Air conditioning
            </ButtonLink>
          </span>
          <span className="animate-pop-in [animation-delay:450ms]">
            <ButtonLink href="/services#servicing" variant="dark" size="lg">
              Servicing &amp; repairs
            </ButtonLink>
          </span>
        </div>

        <p className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base font-medium text-navy-900 [animation-delay:550ms]">
          <span className="flex items-center gap-2">
            <Stars className="size-5" /> {site.rating.value}/5 from {site.rating.count} Google reviews
          </span>
          <span className="flex items-center gap-2">
            <Icon name="shield" className="size-5 text-accent-600" /> F-Gas certified engineers
          </span>
        </p>
      </div>

      <Skyline className="relative mt-10 block h-[200px] w-full animate-fade-up [animation-delay:300ms] sm:h-[280px] lg:mt-14 lg:h-[360px]" />
    </section>
  );
}
