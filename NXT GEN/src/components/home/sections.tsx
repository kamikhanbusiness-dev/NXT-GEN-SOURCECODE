import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { faqs, features, processSteps, services, testimonials } from "@/content";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink, Container, SectionHeading, revealDelay } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scene, type SceneName } from "@/components/illustrations/Scenes";
import { CountUp } from "@/components/interactive/CountUp";
import { ReviewSlider } from "@/components/interactive/ReviewSlider";

const bgs = { white: "bg-white", ice: "bg-ice", grey: "bg-[#f7f8fa]" } as const;

/** Text + illustration two-column block; the image slides in from its side. */
export function SplitSection({
  id,
  title,
  children,
  scene,
  reverse = false,
  bg = "white",
  actions = true,
}: {
  id?: string;
  title: ReactNode;
  children: ReactNode;
  scene: SceneName;
  reverse?: boolean;
  bg?: keyof typeof bgs;
  actions?: boolean;
}) {
  return (
    <section id={id} className={`overflow-hidden py-20 sm:py-28 ${bgs[bg]}`}>
      <Container className={`grid items-center gap-12 lg:gap-16 ${reverse ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-[1.35fr_1fr]"}`}>
        <div data-reveal={reverse ? "right" : "left"} className={reverse ? "lg:order-2" : ""}>
          <h2 className="font-display text-[2.25rem] leading-[1.12] font-extrabold tracking-tight sm:text-5xl [&_em]:text-accent-600 [&_em]:not-italic">
            {title}
          </h2>
          <div className="mt-7 space-y-6 text-lg leading-relaxed text-ink/85 sm:text-xl">{children}</div>
          {actions && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/get-a-quote" size="lg">
                Get a quote
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Speak to our experts
              </ButtonLink>
            </div>
          )}
        </div>
        <div data-reveal={reverse ? "left" : "right"} className={reverse ? "lg:order-1" : ""}>
          <Scene name={scene} />
        </div>
      </Container>
    </section>
  );
}

/** Quiz-style quick start that deep-links into the estimator. */
export function QuickQuiz() {
  const options: { size: string; label: string; detail: string; icon: IconName }[] = [
    { size: "small", label: "6 – 15 m²", detail: "Small · bedroom, study", icon: "home" },
    { size: "medium", label: "16 – 34 m²", detail: "Medium · living room, loft", icon: "ruler" },
    { size: "large", label: "35 – 49 m²", detail: "Large · open plan, office", icon: "building" },
  ];
  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container>
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {["Fast and easy", "Fixed price guarantee", "Professional installations"].map((t, i) => (
            <Badge key={t} data-reveal="pop" style={revealDelay(i * 100)} className="h-9 gap-2 px-5 text-base">
              <Icon name="check" className="size-4 text-brand-200" strokeWidth={3} /> {t}
            </Badge>
          ))}
        </div>
        <SectionHeading
          title={
            <>
              How <em>Large</em> Is The Room Or Area You Want Air Conditioned?
            </>
          }
          intro="Pick a size to start your instant online estimate — it only takes a couple of minutes."
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
          {options.map((o, i) => (
            <li key={o.size} data-reveal="pop" style={revealDelay(i * 120)}>
              <Link href={`/get-a-quote?size=${o.size}`} className="group block h-full rounded-2xl focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:outline-none">
                <Card className="h-full flex-row items-center gap-5 rounded-2xl p-6 shadow-sm ring-0 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-brand-400 md:flex-col md:py-10 md:text-center">
                  <span className="grid size-20 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-400 group-hover:text-white">
                    <Icon name={o.icon} className="size-9" strokeWidth={1.5} />
                  </span>
                  <CardHeader className="w-full flex-1 gap-1 px-0 md:flex-none">
                    <CardTitle className="font-display text-2xl font-bold text-navy-900">{o.label}</CardTitle>
                    <CardDescription className="text-base">{o.detail}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Bright blue band of feature cards that pop up one by one. */
export function FeaturesGrid() {
  return (
    <section className="bg-brand-400 py-20 sm:py-24">
      <Container>
        <SectionHeading
          light
          title={
            <>
              Why Nottingham Chooses <em>NXTGEN</em>
            </>
          }
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((f, i) => (
            <li key={f.title} data-reveal="pop" style={revealDelay((i % 4) * 110)}>
              <Card className="group h-full gap-0 rounded-2xl p-6 text-base ring-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_-20px_rgba(7,11,24,0.5)]">
                <span className="grid size-24 place-items-center rounded-full bg-brand-100 text-brand-500 transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-brand-400 group-hover:text-white">
                  <Icon name={f.icon} className="size-11" strokeWidth={1.4} />
                </span>
                <CardHeader className="mt-5 gap-3 px-0">
                  <CardTitle>
                    <h3 className="font-display text-xl font-bold">{f.title}</h3>
                  </CardTitle>
                  <CardDescription className="text-[1.0625rem] leading-relaxed text-foreground/85">{f.text}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function StatsBand() {
  const stats = [
    { to: site.yearsExperience, suffix: "+", label: "Years' experience" },
    { to: 1500, suffix: "+", label: "Systems installed" },
    { to: site.rating.value, decimals: 1, suffix: "★", label: `${site.rating.count} Google reviews` },
    { to: 7, suffix: " yrs", label: "Warranty available" },
  ];
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 text-white">
      <div className="absolute -top-20 -right-20 size-80 rounded-full bg-accent-600/20 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 size-80 rounded-full bg-brand-400/20 blur-2xl" aria-hidden="true" />
      <Container className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} data-reveal="up" style={revealDelay(i * 100)} className="text-center">
            <p className="font-display text-5xl font-extrabold text-white sm:text-6xl">
              <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-lg font-medium text-brand-300">{s.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

export function ServicesCards() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={
            <>
              Our Air Conditioning <em>Services</em>
            </>
          }
          intro="Design, installation, servicing and repairs — all delivered by our own certified engineers."
        />
        <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal="up" style={revealDelay((i % 3) * 120)}>
              <Link href={`/services#${s.slug}`} className="group block h-full rounded-2xl focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:outline-none">
                <Card className="relative h-full gap-0 rounded-2xl border-2 border-transparent bg-muted p-8 has-data-[slot=card-footer]:pb-8 text-base ring-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand-400 group-hover:bg-white group-hover:shadow-xl">
                  <span className="absolute -top-10 -right-10 size-32 rounded-full bg-brand-100 transition-transform duration-500 group-hover:scale-[2.5]" aria-hidden="true" />
                  <span className="relative grid size-16 place-items-center rounded-full bg-white text-primary shadow-md transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon name={s.icon} className="size-8" strokeWidth={1.6} />
                  </span>
                  <CardHeader className="relative mt-6 gap-3 px-0">
                    <CardTitle>
                      <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                    </CardTitle>
                    <CardDescription className="text-lg leading-relaxed text-foreground/80">{s.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter className="relative mt-auto justify-between rounded-none border-0 bg-transparent px-0 pt-6 pb-0">
                    <Badge variant="outline" className="h-8 border-navy-900/15 bg-white px-3 text-sm">
                      From <span className="font-bold text-navy-900">{s.from}</span>
                    </Badge>
                    <span className="flex items-center gap-1 font-bold text-primary uppercase">
                      More <Icon name="arrowRight" className="size-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <section className="bg-ice py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={
            <>
              From Quote To Cool In <em>Four Simple Steps</em>
            </>
          }
        />
        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span className="absolute top-12 right-[12%] left-[12%] hidden h-1 rounded-full bg-[repeating-linear-gradient(90deg,#4aa1d8_0_14px,transparent_14px_26px)] lg:block" aria-hidden="true" />
          {processSteps.map((s, i) => (
            <li key={s.title} data-reveal="pop" style={revealDelay(i * 150)} className="relative text-center">
              <span className="relative mx-auto grid size-24 place-items-center rounded-full bg-white text-brand-600 shadow-lg ring-8 ring-ice">
                <Icon name={s.icon} className="size-10" strokeWidth={1.6} />
                <span className="absolute -top-1 -right-1 grid size-9 place-items-center rounded-full bg-accent-600 font-display font-bold text-white">{i + 1}</span>
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-64 text-lg text-ink/80">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="bg-ice py-20 sm:py-28">
      <Container className="max-w-5xl">
        <SectionHeading
          title={
            <>
              What Our <em>Customers</em> Say
            </>
          }
          intro={`Rated ${site.rating.value} out of 5 from ${site.rating.count} reviews on ${site.rating.source}.`}
        />
        <div data-reveal="zoom" className="mt-12">
          <ReviewSlider reviews={testimonials} />
        </div>
      </Container>
    </section>
  );
}

export function Faq({ items = faqs, title }: { items?: readonly { q: string; a: string }[]; title?: ReactNode }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            title={
              title ?? (
                <>
                  Frequently Asked <em>Questions</em>
                </>
              )
            }
            intro="Can't find what you're looking for? Our friendly team is happy to help."
          />
          <div data-reveal="up" className="mt-8 flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href="/get-a-quote">Get a quote</ButtonLink>
            <ButtonLink href={site.phoneHref} variant="secondary">
              Call {site.phone}
            </ButtonLink>
          </div>
        </div>
        <Accordion type="single" collapsible defaultValue="faq-0" className="gap-4">
          {items.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              data-reveal="up"
              style={revealDelay(i * 70)}
              className="rounded-2xl bg-muted px-6 transition-colors not-last:border-b-0 data-[state=open]:bg-ice"
            >
              <AccordionTrigger className="items-center gap-4 py-5 font-display text-lg font-bold text-navy-900 hover:no-underline **:data-[slot=accordion-trigger-icon]:size-6 **:data-[slot=accordion-trigger-icon]:text-primary">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-lg leading-relaxed text-foreground/85">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

/** Closing call-to-action on the illustrated sky background. */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-sky py-20 sm:py-24">
      <Container className="relative text-center">
        <h2 data-reveal="up" className="font-display text-4xl font-extrabold sm:text-5xl">
          Ready To Beat The Heat?
        </h2>
        <p data-reveal="up" className="mx-auto mt-5 max-w-2xl text-xl text-ink/85">
          Get an instant price online, then book your free, no-obligation survey with our Nottingham team.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <span data-reveal="pop">
            <ButtonLink href="/get-a-quote" size="lg">
              Get a quote
            </ButtonLink>
          </span>
          <span data-reveal="pop" style={revealDelay(120)}>
            <ButtonLink href={site.phoneHref} variant="dark" size="lg">
              {site.phone}
            </ButtonLink>
          </span>
        </div>
      </Container>
    </section>
  );
}
