import type { Metadata } from "next";
import { site } from "@/config/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, PageHero, revealDelay } from "@/components/ui/primitives";
import { Scene } from "@/components/illustrations/Scenes";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} for air conditioning installation, servicing or repairs in Nottingham. Call ${site.phone}.`,
};

export default function ContactPage() {
  const cards: { icon: IconName; label: string; value: string; href?: string }[] = [
    { icon: "phone", label: "Call us today", value: site.phone, href: site.phoneHref },
    { icon: "mail", label: "Email us", value: site.email, href: `mailto:${site.email}` },
    { icon: "mapPin", label: "Visit us", value: `${site.address.street}, ${site.address.locality} ${site.address.postcode}` },
    { icon: "clock", label: "Opening hours", value: site.openingHours.map((h) => `${h.days}: ${h.hours}`).join(" · ") },
  ];
  return (
    <>
      <PageHero
        actions={false}
        title={
          <>
            Let&apos;s Talk About <em>Your Project</em>
          </>
        }
        art={<Scene name="remote" />}
      >
        <p>Questions, repairs or a brand-new installation — send us a message and we&apos;ll get back to you within one working day.</p>
      </PageHero>

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <ul className="space-y-4">
            {cards.map((c, i) => {
              const body = (
                <>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent-600 text-white transition-transform group-hover:scale-110">
                    <Icon name={c.icon} className="size-6" />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-navy-900">{c.label}</span>
                    <span className="block text-ink/80">{c.value}</span>
                  </span>
                </>
              );
              const cls = "group flex items-center gap-5 rounded-2xl bg-[#f7f8fa] p-5 transition-all";
              return (
                <li key={c.label} data-reveal="left" style={revealDelay(i * 90)}>
                  {c.href ? (
                    <a href={c.href} className={`${cls} hover:-translate-y-0.5 hover:bg-ice hover:shadow-md`}>
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <Card data-reveal="right" className="gap-0 rounded-[1.5rem] bg-mist p-6 text-base ring-0 sm:p-10">
            <CardHeader className="gap-2 px-0">
              <CardTitle>
                <h2 className="font-display text-3xl font-extrabold">Send us a message</h2>
              </CardTitle>
              <CardDescription className="text-base">Fields marked * are required.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <ContactForm />
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
