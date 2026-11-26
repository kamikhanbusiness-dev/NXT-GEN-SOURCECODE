import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import { Container, Stars } from "@/components/ui/primitives";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { Ticker } from "@/components/interactive/Ticker";

export const metadata: Metadata = {
  title: "Get a Free Air Conditioning Quote",
  description: "Get an instant air conditioning price estimate for your Nottingham home or business in under two minutes. No obligation.",
};

// Reads ?size= from the home page quick-start links. searchParams is request
// data, so it's read inside <Suspense> to keep the rest of the page static.
async function WizardWithPreset({ searchParams }: { searchParams: PageProps<"/get-a-quote">["searchParams"] }) {
  const { size } = await searchParams;
  return <QuoteWizard initialSize={typeof size === "string" ? size : undefined} />;
}

export default function QuotePage({ searchParams }: PageProps<"/get-a-quote">) {
  return (
    <div className="bg-mist">
      <section className="pt-header bg-white pb-10 text-center">
        <Container>
          <h1 className="animate-fade-up font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Your Instant <span className="text-accent-600">Air Con</span> Quote
          </h1>
          <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-xl text-ink/80 [animation-delay:100ms]">
            Answer a few quick questions and watch your price update live. It takes about two minutes and there&apos;s no obligation.
          </p>
          <ul className="mt-6 flex animate-fade-up flex-wrap justify-center gap-x-6 gap-y-2 font-medium [animation-delay:200ms]">
            <li className="flex items-center gap-2">
              <Stars className="size-5" /> {site.rating.value}/5 from {site.rating.count} reviews
            </li>
            <li className="flex items-center gap-2">
              <Icon name="shield" className="size-5 text-accent-600" /> F-Gas certified engineers
            </li>
          </ul>
        </Container>
      </section>
      <Ticker messages={["Fast And Easy", "Fixed Price Guarantee", "Professional Installations", "No Obligation Survey"]} />
      <Container className="py-12 pb-24">
        <Suspense fallback={<QuoteWizard />}>
          <WizardWithPreset searchParams={searchParams} />
        </Suspense>
      </Container>
    </div>
  );
}
