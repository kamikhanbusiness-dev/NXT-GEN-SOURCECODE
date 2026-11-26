import { Hero } from "@/components/home/Hero";
import { BrandStrip, Faq, FeaturesGrid, ProcessSteps, QuickQuiz, Reviews, ServicesCards, SplitSection, StatsBand } from "@/components/home/sections";
import { faqs } from "@/content";
import { Container } from "@/components/ui/primitives";

// FAQ structured data helps the questions appear as rich results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <Hero />

      <SplitSection title="Air Conditioning Nottingham" scene="remote">
        <p>
          With the right air conditioner you control the temperature and air quality in any room. Work, relax and sleep better with
          filtered air that&apos;s cooled — or warmed — exactly how you like it.
        </p>
        <p>
          We design and install air conditioning for homes and businesses right across Nottingham, from a single bedroom unit to a
          complete multi-room system.
        </p>
        <p>Wall-mounted, ceiling cassette, ducted or floor-standing — we&apos;ll recommend exactly what your building needs.</p>
      </SplitSection>

      <QuickQuiz />

      <SplitSection title="Air Conditioning Installed" scene="angled" bg="ice" reverse>
        <p>
          Never had air con before? We&apos;ll guide you through every option in plain English. We only fit equipment from leading
          manufacturers, so your system stays reliable year after year.
        </p>
        <p>
          Every system we install is whisper-quiet, A+++ energy efficient and delivers clean, comfortable airflow — so you can take back
          control of your indoor climate.
        </p>
      </SplitSection>

      <section className="bg-white pt-16 sm:pt-20">
        <Container>
          <BrandStrip />
        </Container>
      </section>

      <SplitSection id="servicing" title="Air Conditioning Repairs & Servicing" scene="service">
        <p>
          We don&apos;t just install — we keep your system running at its best with annual servicing, maintenance plans and fast repairs
          for all major brands.
        </p>
        <p>
          Blocked filters, refrigerant leaks, fault codes, strange noises or weak airflow? Our engineers diagnose problems quickly and
          carry common parts, so most faults are fixed first time.
        </p>
      </SplitSection>

      <FeaturesGrid />
      <StatsBand />
      <ServicesCards />
      <ProcessSteps />
      <Reviews />
      <Faq />
    </>
  );
}
