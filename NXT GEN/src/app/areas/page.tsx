import type { Metadata } from "next";
import { areas } from "@/config/areas";
import { Icon } from "@/components/ui/Icon";
import { Container, PageHero, SectionHeading, revealDelay } from "@/components/ui/primitives";
import { CoverageMap } from "@/components/illustrations/CoverageMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { CtaBand, Faq } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "Areas Covered — Air Conditioning Nottinghamshire",
  description:
    "Air conditioning installers covering Nottingham, West Bridgford, Beeston, Arnold, Carlton, Hucknall, Long Eaton, Mansfield and East Derby.",
};

const localFaqs = [
  {
    q: "Do you charge extra for travel outside Nottingham?",
    a: "No. Every area listed on this page is covered at the same fixed prices, with no travel or call-out surcharge for installations.",
  },
  {
    q: "My town isn't listed — can you still help?",
    a: "Probably! We regularly work up to around 25 miles from Nottingham. Give us a call or request a quote and we'll confirm straight away.",
  },
  {
    q: "How quickly can you survey in my area?",
    a: "Most surveys are booked within 2–5 working days. In peak summer weeks we prioritise vulnerable customers and breakdowns.",
  },
];

export default function AreasPage() {
  return (
    <>
      <PageHero
        tone="ice"
        title={
          <>
            Areas We <em>Cover</em>
          </>
        }
        art={
          <div className="overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-20px_rgba(28,32,51,0.45)]">
            <div className="aspect-[4/3]">
              <CoverageMap />
            </div>
          </div>
        }
      >
        <p>
          We&apos;re based in Nottingham and cover the whole of Nottinghamshire plus parts of Derbyshire — the same friendly team and the
          same fixed prices, wherever you are.
        </p>
      </PageHero>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            title={
              <>
                Towns &amp; Postcodes <em>We Cover</em>
              </>
            }
            intro="Don't see your area? We travel further for commercial projects — just ask."
          />
          <ul className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => (
              <li
                key={a.slug}
                id={a.slug}
                data-reveal="pop"
                style={revealDelay((i % 3) * 110)}
                className="group scroll-mt-40"
              >
                <Card className="h-full gap-0 rounded-2xl bg-muted p-8 text-base ring-0 transition-all duration-300 group-target:ring-4 group-target:ring-primary group-hover:-translate-y-1.5 group-hover:bg-white group-hover:shadow-xl group-hover:ring-2 group-hover:ring-brand-400">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent-600 text-white transition-transform group-hover:scale-110">
                    <Icon name="mapPin" className="size-7" />
                  </span>
                  <div>
                    <CardTitle>
                      <h2 className="font-display text-2xl font-bold">{a.name}</h2>
                    </CardTitle>
                    <p className="flex items-center gap-1.5 text-ink/70">
                      <Icon name="clock" className="size-4" /> {a.driveTime}
                    </p>
                  </div>
                </div>
                <p className="mt-5 flex-1 text-lg leading-relaxed text-ink/85">{a.intro}</p>
                <ul className="mt-5 space-y-2">
                  {a.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 font-medium">
                      <Icon name="check" className="size-5 text-brand-500" strokeWidth={3} /> {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-black/10 pt-5">
                  {a.postcodes.map((p) => (
                    <Badge key={p} className="h-7 bg-navy-900 px-3 text-sm font-bold text-white">
                      {p}
                    </Badge>
                  ))}
                </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq
        items={localFaqs}
        title={
          <>
            Local <em>Questions</em>
          </>
        }
      />
      <CtaBand />
    </>
  );
}
