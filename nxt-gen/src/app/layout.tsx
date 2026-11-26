import type { Metadata, Viewport } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { site } from "@/config/site";
import { areas } from "@/config/areas";
import { Header, MobileCtaBar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { ChatWidget } from "@/components/interactive/ChatWidget";
import "./globals.css";
import { cn } from "@/lib/utils";

const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["400", "500", "700"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Air Conditioning Nottingham | ${site.name}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "en_GB", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#0b1d36" };

// LocalBusiness structured data for local SEO.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postcode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", ...site.geo },
  areaServed: areas.map((a) => ({ "@type": "City", name: a.name })),
  openingHoursSpecification: site.openingHoursSpec.map((o) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: o.days,
    opens: o.opens,
    closes: o.closes,
  })),
  aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={cn(roboto.variable, montserrat.variable)}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-navy-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
        <ChatWidget />
        <RevealObserver />
      </body>
    </html>
  );
}
