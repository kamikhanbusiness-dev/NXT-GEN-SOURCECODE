import type { Metadata } from "next";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import {
  Container,
  PageHero,
  SectionHeading,
  revealDelay,
} from "@/components/ui/primitives";
import { Scene } from "@/components/illustrations/Scenes";
import {
  BrandStrip,
  CtaBand,
  FeaturesGrid,
  Reviews,
  SplitSection,
  StatsBand,
} from "@/components/home/sections";
// import { CtaBand, FeaturesGrid, Reviews, SplitSection, StatsBand } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "About Us",
  description: `Meet ${site.name} — a Nottingham family business installing and servicing air conditioning since ${site.foundedYear}.`,
};

// Placeholder team — swap for real names and photos.
const team = [
  { name: "Team member", role: "Founder & Lead Engineer" },
  { name: "Team member", role: "Senior Installation Engineer" },
  { name: "Team member", role: "Service & Repairs Engineer" },
  { name: "Team member", role: "Customer Coordinator" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={
          <>
            NXTGEN: Nottingham&apos;s <em>Air Conditioning</em> Experts
          </>
        }
        art={<Scene name="van" />}
      >
        <p>
          At {site.shortName} we bring expert knowledge and a trusted local
          reputation to every home and business we work with across
          Nottinghamshire.{" "}
          {/* Placeholder copy — replace with the client's real story */}
        </p>
        <p>
          We take pride in outstanding service and workmanship. From your first
          call to the final commissioning check, we guide you through every step
          of the process.
        </p>
      </PageHero>

      <StatsBand />

      <SplitSection
        title="Built On Recommendations"
        scene="angled"
        bg="ice"
        reverse
        actions={false}
      >
        <p>
          {site.shortName} started with a simple idea: air conditioning should
          be easy to buy, properly installed and backed by people who answer the
          phone.
        </p>
        <p>
          Today our team fits everything from single bedroom units to multi-room
          systems for offices, shops and restaurants — and most of our work
          still comes from customer recommendations.
        </p>
        <ul className="flex flex-wrap gap-3 pt-2">
          {site.accreditations.map((a, i) => (
            <li
              key={a}
              data-reveal="pop"
              style={revealDelay(i * 90)}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-base font-bold text-navy-900 shadow-sm"
            >
              <Icon name="award" className="size-5 text-accent-600" /> {a}
            </li>
          ))}
        </ul>
      </SplitSection>

      <FeaturesGrid />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            title={
              <>
                Meet The <em>Team</em>
              </>
            }
          />
          <ul className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {team.map((t, i) => (
              <li
                key={t.role}
                data-reveal="pop"
                style={revealDelay(i * 110)}
                className="group text-center"
              >
                <div className="relative mx-auto grid aspect-square w-full place-items-center overflow-hidden rounded-[1.25rem] bg-ice">
                  <span className="absolute inset-x-0 top-0 h-1/2 rounded-b-[50%] bg-accent-600/90 transition-transform duration-500 group-hover:-translate-y-4" />
                  <span className="relative grid size-3/5 place-items-center rounded-full bg-white text-brand-400 shadow-lg ring-8 ring-brand-400">
                    <Icon
                      name="engineer"
                      className="size-1/2"
                      strokeWidth={1.25}
                    />
                  </span>
                </div>
                <p className="mt-4 font-display text-lg font-bold text-navy-900">
                  {t.name}
                </p>
                <p className="text-ink/70">{t.role}</p>
              </li>
            ))}
          </ul>

          <BrandStrip className="mt-20" />
        </Container>
      </section>

      <Reviews />
      <CtaBand />
    </>
  );
}
