import type { Metadata } from "next";
import { posts } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { Container, PageHero, revealDelay } from "@/components/ui/primitives";
import { Scene, type SceneName } from "@/components/illustrations/Scenes";
import { CtaBand } from "@/components/home/sections";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Air Conditioning Advice & Guides",
  description: "Buying guides, running costs and maintenance tips for air conditioning in UK homes and businesses.",
};

const covers: SceneName[] = ["remote", "outdoor", "angled", "office", "service", "van"];

export default function BlogPage() {
  return (
    <>
      <PageHero
        actions={false}
        title={
          <>
            Advice &amp; <em>Guides</em>
          </>
        }
        art={<Scene name="office" />}
      >
        <p>Plain-English advice from our engineers on choosing, running and looking after air conditioning in UK homes and businesses.</p>
      </PageHero>
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.title} data-reveal="pop" style={revealDelay((i % 3) * 110)}>
                <Card className="group h-full gap-0 rounded-2xl bg-muted py-0 text-base ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-xl">
                  <div className="relative">
                    <Scene name={covers[i % covers.length]} />
                    <Badge className="absolute top-4 left-4 h-8 px-4 text-sm font-bold uppercase">{p.tag}</Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <CardTitle>
                      <h2 className="font-display text-xl leading-snug font-bold">{p.title}</h2>
                    </CardTitle>
                    <p className="mt-3 flex-1 text-lg text-ink/80">{p.excerpt}</p>
                    <p className="mt-6 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-ink/70">
                        <Icon name="clock" className="size-4" /> {p.read} read
                      </span>
                      <Badge variant="outline" className="h-7 border-navy-900/20 px-3 font-bold tracking-wide uppercase">Coming soon</Badge>
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
