import type { Metadata } from "next";
import { services } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { PageHero, revealDelay } from "@/components/ui/primitives";
import { Scene, type SceneName } from "@/components/illustrations/Scenes";
import { CtaBand, FeaturesGrid, ProcessSteps, SplitSection } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "Air Conditioning Services Nottingham",
  description: "Air conditioning installation, servicing, repairs and maintenance for homes and businesses across Nottingham and Nottinghamshire.",
};

const sceneFor: Record<string, SceneName> = {
  installation: "angled",
  servicing: "service",
  repairs: "outdoor",
  domestic: "remote",
  commercial: "office",
  "heat-pumps": "outdoor",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Air Conditioning <em>Services</em> In Nottingham
          </>
        }
        art={<Scene name="remote" />}
      >
        <p>
          From design and installation to servicing and emergency repairs, our own F-Gas certified engineers look after homes and
          businesses right across Nottinghamshire.
        </p>
        <ul className="flex flex-wrap gap-2 pt-2">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal="pop" style={revealDelay(300 + i * 70)}>
              <a
                href={`#${s.slug}`}
                className="flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-base font-medium text-navy-900 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-brand-400 hover:text-white"
              >
                <Icon name={s.icon} className="size-4" /> {s.title.replace("Air Conditioning ", "").replace(" Air Conditioning", "")}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      {services.map((s, i) => (
        <SplitSection key={s.slug} id={s.slug} title={s.title} scene={sceneFor[s.slug] ?? "remote"} reverse={i % 2 === 1} bg={i % 2 ? "ice" : "white"}>
          <p>{s.body}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {s.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-lg">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-accent-600 text-white">
                  <Icon name="check" className="size-3.5" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2 text-base font-bold text-white">
            Prices from <span className="text-brand-300">{s.from}</span>
          </p>
        </SplitSection>
      ))}

      <FeaturesGrid />
      <ProcessSteps />
      <CtaBand />
    </>
  );
}
