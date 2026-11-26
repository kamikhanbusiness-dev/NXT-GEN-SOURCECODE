# NXTGEN Air Conditioning — website prototype

Clickable design prototype of a Nottingham air conditioning website, used to show the client the look, page structure and quote estimator before the full build. Layout and section flow are inspired by kjgroup.uk/air-con. All copy and components are original.

> **Prototype status:** every page and interaction works in the browser, but **forms do not send anything**. Submissions are simulated (loading → success). No emails, database or API routes yet.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# or a production preview
npm run build && npm start
```

Requires Node 20.9+. Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript and Tailwind CSS v4. No other runtime dependencies.

## Design & interaction

The design language follows kjgroup.uk, using the NXTGEN brand and original copy and illustrations:

- **Floating header:** a white logo pill overlapping a navy pill bar, a red quick-links tab (hides on scroll), mega-menu dropdowns for *Air Con* and *Service Areas*, and a "Call Us Today" block.
- **Home hero:** a sky background with drifting clouds, a large headline, three pill CTAs, and an illustrated Nottingham street scene (`src/components/illustrations/Skyline.tsx`).
- **Alternating text and illustration sections**, a bright-blue "Why choose us" card grid, a quiz-style room-size picker, animated stat counters, a review carousel and an FAQ accordion.
- **Footer:** a dark footer with a red contact block and an animated coverage map, link columns, payment badges and a blue legal bar.
- **Scroll animations:** add `data-reveal="up | pop | left | right | zoom"` to any element; stagger with `style={revealDelay(ms)}`.
- **Interactive pieces:** the chat bubble with a callback form, count-up stats, swipeable reviews, the rotating red message strip on the quote page, and hover lifts on cards and buttons. All respect reduced-motion settings.
- **Photos:** illustrated scenes stand in for photos (`src/components/illustrations/Scenes.tsx`). Swap any `<Scene />` for a `next/image` photo once the client supplies one.

## UI components (shadcn/ui)

Buttons, cards, inputs, labels, textareas, checkboxes, badges and accordions are [shadcn/ui](https://ui.shadcn.com) components in `src/components/ui/` (Radix-based, `components.json` holds the config). They're themed to the brand through the CSS variables in the `:root` block of `src/app/globals.css` (`--primary` = red, `--secondary` = blue, `--ring` = sky blue, `--radius`). The Button variants are customised in `src/components/ui/button.tsx`. Add more with `npx shadcn@latest add <component>`.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Hero with quick-start estimate card, trust stats, benefits, services, process, brands, reviews, coverage map, FAQ, CTA |
| `/services` | Installation, servicing, repairs, domestic, commercial, heat pumps: each with benefits and a CTA |
| `/areas` | Nottingham and surrounding towns with local copy and postcodes |
| `/about` | Story, values, team placeholders, accreditations |
| `/contact` | Contact details, opening hours, validated contact form (simulated send) |
| `/blog` | Advice article cards (placeholders) |
| `/get-a-quote` | 4-step estimator with live price panel |

## The quote estimator

1. **Property:** home or business, building type, size.
2. **Rooms:** add or remove rooms, length × width × ceiling height (metres/feet toggle converts existing values), insulation, sun exposure and occupants. Floor area, cooling load (kW and BTU/h) and a suggested unit size are calculated live for each room.
3. **Options:** system type, new or replacement, pipe run, outdoor unit position, floor level, electrics, add-ons.
4. **Contact details** and preferred callback time.

The price range updates as you type: a sticky sidebar on desktop, an expandable bottom bar on mobile. A clear "indicative estimate" disclaimer is always shown. Each step validates inline before moving on.

### Editing prices

All rates live in **`src/config/pricing.ts`**. Every price is a `[min, max]` range, and the estimate adds up the mins and the maxes separately. You can change, add or remove options there; the wizard renders whatever is defined. The maths is in `src/lib/quote/calc.ts`, which contains no hard-coded numbers.

## Replacing placeholder content

| What | Where |
| --- | --- |
| Business name, phone, email, address, hours, rating, accreditations | `src/config/site.ts` |
| Service areas and local copy | `src/config/areas.ts` |
| Services, testimonials, FAQs, brands, blog cards | `src/content/index.ts` |
| Brand colours | `@theme` block at the top of `src/app/globals.css` |
| Logo | `src/components/ui/Logo.tsx` is an SVG redraw of the supplied logo. Swap it for the client's vector file when available. The original is in `public/brand/` |
| Favicon | `src/app/icon.svg` |
| Photos | Look for "PHOTO PLACEHOLDER" / "Replace with a real photo" comments and use `next/image` |

## Already in place

- Responsive, mobile-first layout with large tap targets, a sticky header and a mobile call/quote bar.
- Accessibility: skip link, semantic landmarks, labelled fields with `aria-invalid` and `aria-describedby`, radio and checkbox cards using real inputs, focus management between wizard steps, and full support for reduced-motion settings.
- SEO: per-page metadata, LocalBusiness (HVACBusiness) and FAQPage JSON-LD.

## To do for production

- API route(s) for the quote and contact forms: validate on the server, **recompute the estimate server-side**, then store and email it (e.g. Resend or Postmark) to both the business and the customer.
- Spam protection (honeypot fields are already in the forms; add rate limiting or a captcha).
- Real logo, photos, copy, reviews and legal pages (privacy, terms).
- `NEXT_PUBLIC_SITE_URL` env var, `sitemap.ts`, `robots.ts`, Open Graph image, analytics.
- Individual area pages and blog posts.
