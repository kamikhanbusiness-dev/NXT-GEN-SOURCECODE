# NXTGEN website: architecture

Last updated: 2026-11-26 (kick-off session). Owner: `nxtgen-dev`.

This doc describes **what exists today** (the prototype) and the **proposed target architecture** for the Phase 1 build. Everything under "Target" is `proposed` until approved; see `DECISIONS.md` for the reasoning behind each choice.

---

## 1. Current state (prototype, audited 2026-11-26)

### Stack

| Layer | What | Notes |
|---|---|---|
| Framework | Next.js **16.4.1** (App Router, Turbopack, `cacheComponents: true`, `partialPrefetching: true`) | 16.4.1 has 3 moderate advisories (fixed in 16.4.6). See D-009 |
| UI | React 19.3, TypeScript (strict), Tailwind CSS v4 via `@tailwindcss/turbopack`, shadcn/ui (Radix) in `src/components/ui/` | `cn` helper comes from the `cn` package (shadcn's clsx + tailwind-merge replacement) |
| Hosting | Vercel (prototype at `nxtgen-beta.vercel.app`) | No `vercel.json`; `.vercel/` is git-ignored |
| Backend | **None.** No API routes, Server Actions, database, email or auth | |
| Analytics | None | |

### Folder map

```
nxt-gen/
  src/app/            routes: / /services /areas /about /contact /blog /get-a-quote, not-found, icon.svg
  src/components/
    forms/            ContactForm, shared Field/Checkbox/validators (fields.tsx)
    quote/            QuoteWizard (4 steps, 661 lines), RoomCard, OptionCards, PriceSummary
    home/             Hero, sections (features, services cards, process, reviews, FAQ, CTA)
    layout/           Header (mega menus), Footer, RevealObserver
    interactive/      ChatWidget (callback form), CountUp, ReviewSlider, Ticker
    illustrations/    SVG scenes standing in for photos; Skyline; CoverageMap
    ui/               shadcn components + Icon, Logo, primitives
  src/config/         site.ts (business details), pricing.ts (estimator rates), areas.ts (service areas)
  src/content/        index.ts (services, testimonials, features, FAQs, brands, blog cards)
  src/lib/quote/      calc.ts (pure estimate maths, no hard-coded numbers)
  public/brand/       logo-stacked.jpg  (plus a duplicate folder "public/brand copy/")
```

### How things work today

- **Content and config.** All business data is static TypeScript: `config/site.ts`, `config/pricing.ts`, `config/areas.ts`, `content/index.ts`. Components import them directly. All pages prerender as static HTML except `/get-a-quote`, which is a partial prerender because it reads `searchParams` (`?size=` preset) inside `<Suspense>`.
- **Estimator.** `QuoteWizard` (client component) keeps all state in `useState` and calls `calculateEstimate()` from `lib/quote/calc.ts` on every change. `calc.ts` imports `pricingConfig` **statically**, so it cannot yet take prices from a database. Every rate is a `[min, max]` range; totals are rounded to £50.
- **Forms.** Three forms, all simulated with `simulateSubmit()` (a 1.2s timeout): contact form, quote wizard step 4, chat-widget callback. Nothing leaves the browser. Validation is client-side only. The quote "reference" is generated in the browser with `Math.random()`. The contact form has a honeypot `<input>` that is never read.
- **SEO.** Static `metadata` per page, `metadataBase` from `NEXT_PUBLIC_SITE_URL`, HVACBusiness JSON-LD in the root layout (includes an `aggregateRating` of 4.9 from 214 reviews, which is placeholder data), FAQPage JSON-LD on the home page. No `sitemap.ts`, `robots.ts`, OG image, per-area or per-service pages.

### Placeholder data still in the prototype

| Where | Placeholder |
|---|---|
| `config/site.ts` | phone `0115 000 0000`, email `sales@nxtgenairconltd.com` (was a made-up domain; fixed 26 Nov), address "Unit 1, Example Business Park", legal name, opening hours, founded 2012, 12 years, "1,500+" installs, rating 4.9/214, accreditations (F-Gas, REFCOM, NICEIC), social links to bare domains |
| `content/index.ts` | all 5 testimonials, brands list (7 brands, not the 4 agreed), 6 blog cards (no article pages), `from` prices, service copy incl. the `heat-pumps` service, "7-year warranty" and "finance" claims |
| `config/areas.ts` | 9 areas with invented copy (awaiting client list, Q-05) |
| `app/about/page.tsx` | team members and company story |
| `components/layout/Footer.tsx` | Terms, Privacy and Cookie links all point to `/contact`; VISA/Mastercard/PayPal/Finance badges; "Price Promise" link |
| `components/illustrations/Scenes.tsx` | illustrations in place of every photo |

### Gaps against Phase 1 scope

| Scope item (quote) | Status |
|---|---|
| Pages, responsive layout | Mostly there; content is placeholder |
| Quote + contact forms that save and email | Missing: no backend at all |
| Admin (prices, services, reviews; see enquiries; secure login) | Missing |
| Page per area and per service | Missing (only `/areas` and `/services` with `#anchors`; `areas.ts` comment wrongly says `/areas/[slug]` exists) |
| Logo, photos, text, privacy and cookie pages | Logo is an SVG redraw; no photos; no privacy/cookie pages |
| Google Analytics + Search Console, call/enquiry tracking | Missing; no consent banner |
| Testing, launch, handover | Not started |

### Code quality notes and risks

1. **Security patch due.** `next@16.4.1` is affected by advisories fixed in 16.4.6 (cache leak across root params, SVG bypass in image optimisation). `npm audit --omit=dev` lists 14 issues, most pulled in because the **`shadcn` CLI is a runtime dependency** (it brings hono, MCP SDK, body-parser, undici, zod 3, etc.). It belongs in `devDependencies` or should be invoked with `npx`. Next's own build also prints an upgrade warning (on the first run it stopped the build with exit 1; a rerun passed).
2. **The estimate is computed only on the client.** When the backend is added, the server must recompute from the submitted inputs (the `calc.ts` header comment already assumes this).
3. **`calc.ts` is coupled to static config.** It must accept the pricing config as an argument before prices can come from the admin.
4. **No minimum price floor.** The cheapest wall-split estimate is about £1,400 (2.0 kW: £650 + £750), below the requested £1,600 (R-02 / Q-01).
5. **Unverified trust claims** (rating, review count, installs, accreditations, warranty, finance, payment badges) are published as fact and in JSON-LD. They must be confirmed or removed before launch (misleading-claims and Google structured-data policy risk).
6. **Hygiene.** `.gitignore` has `.env*`, which would also ignore `.env.example` (needs `!.env.example`). Duplicate `public/brand copy/` folder is tracked. `QuoteWizard.tsx` is 661 lines: workable, but the server-action wiring should go in a separate hook/module rather than growing it.
7. **Legal links go to `/contact`.** Consent checkboxes link to a privacy policy that doesn't exist yet.

Positives: clean config/content separation, pure and well-commented estimate maths, good accessibility (labels, `aria-invalid`, focus management, reduced motion), strict TypeScript, lint clean.

### Baseline checks (2026-11-26)

- `npm run lint`: pass, 0 problems.
- `npm run build`: compiles, type-checks and prerenders 10 routes. First run exited 1 from Next's security-upgrade guard after page generation; a rerun exited 0 with a warning. Treat it as pass with a pending security patch.

---

## 2. Target architecture (proposed)

```
 Browser ──► Vercel (Next.js 16, Pro plan)                    D-001
              │  public pages: static shell + 'use cache' data (cacheTag per entity)
              │  forms: Server Actions → zod validate → rate-limit → save → after(): email
              │  /admin: Better Auth session (cookie), checked in every page + action
              │
              ├──► Neon Postgres (free tier) via Drizzle ORM    D-002, D-003
              │      enquiries, services, reviews, pricing_versions, users/sessions, rate_limits
              ├──► Resend (transactional email, client's domain) D-005
              └──► GA4 (loaded only after cookie consent)       D-008
 GitHub Actions nightly: pg_dump → private backup storage      D-010
```

### Hosting (D-001)

Stay on **Vercel**, on a **Pro** plan for production. The Hobby plan is for non-commercial use, so a business site should not launch on it. Preview deployments per branch give the client a preview URL for each review round (M1/M2). Production deploys from `main`; work happens on branches.

### Database (D-002, D-003)

**Neon Postgres**, free tier, provisioned through the Vercel Marketplace so `DATABASE_URL` is injected automatically. Access through **Drizzle ORM** (typed schema, SQL migrations in the repo) and **zod** for validation at every boundary.

Proposed tables:

| Table | Purpose |
|---|---|
| `enquiries` | id, type (`quote` / `contact` / `callback`), reference (server-generated, e.g. `NXG-7F3K2Q`), name, email, phone, postcode, message, payload JSON (wizard inputs), estimate JSON (server-computed), pricing_version_id, status (`new` / `contacted` / `quoted` / `won` / `lost`), email status, consent timestamp, created_at. No raw IP stored |
| `services` | slug, title, summary, body, benefits[], from_price (pence), sort order, visible, SEO title/description |
| `reviews` | name, town, text, job, source (`google` / `checkatrade` / `direct`), rating, visible, sort order, date |
| `pricing_versions` | id, JSON document matching the `pricingConfig` shape (zod-validated), created_by, created_at, active flag. Old versions are kept so each enquiry records the prices it was quoted against |
| `users`, `sessions`, `accounts`, `verifications` | Better Auth tables (admin only) |
| `rate_limits` | key (salted hash of IP + form), window start, count |

Areas, site details, FAQs and brands stay as **static config in git** for Phase 1. Admin editing is scoped to prices, services and reviews (quote). The developer changes the rest under the monthly maintenance hour.

### Admin-editable data replacing static config (D-007)

1. Seed the tables from today's `content/index.ts` and `config/pricing.ts` with a seed script, so nothing changes visually on day one.
2. Data access lives in `src/lib/data/*.ts` (server-only). Each read function uses `'use cache'` + `cacheLife('max')` + `cacheTag('services' | 'reviews' | 'pricing')`, so public pages stay in the static shell and cost no DB query per visit.
3. Admin Server Actions write to the DB, then call `updateTag('services')` (etc.). `updateTag` is Server-Action only and expires immediately, so Ian sees his change at once. In Next 16, `revalidateTag` needs a second profile argument (`'max'`).
4. `calc.ts` becomes `calculateEstimate(input, pricing)`. The quote page (server component) loads the active pricing and passes it to `QuoteWizard` as a prop. The quote Server Action loads the same version and recomputes.
5. A `minimumInstallPrice` field (and per-service `from` prices) lives in the pricing document, so the £1,600 rule (Q-01) is a data value, not code.
6. Service detail routes use `generateStaticParams` (must return at least one entry with Cache Components) reading from the DB at build, with `dynamicParams` left on so a service added in admin renders on demand.

### Admin auth (D-004)

**Better Auth** (open-source library, data in our own Postgres, no per-user fees), email + password, **sign-up disabled**, accounts created by seed script for Ian and the developer only, allowlist via `ADMIN_EMAILS`. Login is rate-limited; password reset is by email (Resend).

Enforcement, per the Next 16 docs:
- `src/proxy.ts` (Next 16's renamed middleware) does an **optimistic** cookie-presence redirect for `/admin/*`. It is not the security boundary.
- Every admin page reads the session server-side behind `<Suspense>` (with Cache Components, reading `cookies()` outside a boundary is a build error) and redirects if invalid.
- **Every admin Server Action re-checks the session** first. Server Actions are reachable by direct POST.
- Admin pages are `noindex` and excluded from the sitemap.

### Email (D-005)

**Resend**, free tier (3,000 emails/month, 100/day, which covers a local trades site). Sends from the client's own domain (e.g. `enquiries@<domain>`), which needs SPF/DKIM/DMARC DNS records. Two emails per enquiry:
- **To the business** (`ENQUIRY_NOTIFY_TO`): all details, estimate breakdown, reference, link to the admin record. `Reply-To` is set to the customer.
- **To the customer**: confirmation, reference, indicative range with the disclaimer, phone number, what happens next.

Emails are sent in `after()` once the enquiry is **saved**, so an email outage never loses a lead. Send status is recorded on the enquiry and shown in admin.

### Form handling and spam protection (D-006)

- **Server Actions** for quote, contact and callback forms (built-in Origin/Host CSRF check, 1 MB body cap). Client components call them with `useActionState`, keeping today's inline errors.
- **zod schemas** shared by client and server (`src/lib/validation/`). The server is the authority.
- **Spam layers:** (1) a honeypot field that the server checks (silently "succeed" without saving); (2) a time trap: a signed timestamp in a hidden field, rejecting submissions faster than ~3s; (3) a rate limit in Postgres of about 5 per hour per salted IP hash per form. A **Cloudflare Turnstile** (free) check is held in reserve if spam appears after launch.
- **Data minimisation:** collect only the fields already on the forms. Consent checkbox time recorded. Retention: delete enquiries after an agreed period (proposed 24 months) via an admin action. To be stated on the privacy page.

### Analytics and consent (D-008)

- **GA4**, property owned by the client's Google account, developer added as an editor. **Search Console** verified by DNS TXT record.
- A small first-party **cookie banner** (Accept / Reject, equal prominence, "Cookie settings" link in footer). GA's script is **not loaded at all** until the visitor accepts (strictest reading of PECR). Google Consent Mode v2 defaults are set to `denied` in any case. Choice is stored in a first-party cookie for 6 months.
- **Conversions:** `phone_click` (all `tel:` links, via one delegated listener), `generate_lead` (quote, contact and callback success, with `form_type`), `estimate_started` and `estimate_step` for funnel insight. Marked as key events in GA4.

### Environment variables (to document in `.env.example`)

| Var | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | all | canonical URL, metadataBase, sitemap, email links |
| `DATABASE_URL` | server | Neon pooled connection (set by Vercel integration) |
| `DATABASE_URL_UNPOOLED` | server/CI | migrations and backups |
| `RESEND_API_KEY` | server | email sending |
| `EMAIL_FROM` | server | e.g. `NXTGEN Air Conditioning <enquiries@domain>` |
| `ENQUIRY_NOTIFY_TO` | server | business inbox (Q-04) |
| `BETTER_AUTH_SECRET` | server | session signing |
| `BETTER_AUTH_URL` | server | base URL for auth callbacks |
| `ADMIN_EMAILS` | server | comma-separated allowlist |
| `RATE_LIMIT_SALT` | server | salt for IP hashing (no raw IPs stored) |
| `FORM_TIMESTAMP_SECRET` | server | signs the time-trap field |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | client | GA4 (loaded only after consent) |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | optional | only if D-006 escalation is triggered |

Secrets live in Vercel project settings and `.env.local` (git-ignored). `.gitignore` needs `!.env.example`.

### Running cost (estimate, verify at sign-up)

| Item | Monthly |
|---|---|
| Vercel Pro (1 seat; £0 extra if the developer already pays for a Pro team) | ~£16 ($20) |
| Neon free tier | £0 |
| Resend free tier | £0 |
| GA4, Search Console, Turnstile | £0 |
| Backup storage (GitHub Actions artifacts / private repo) | £0 |
| **Total** | **~£16 of the £30/month hosting fee** |

Domain (~£15/year) and business email are paid by the client directly (commercials). Upgrade triggers: Resend over 100 emails/day; Neon over 0.5 GB (unlikely for enquiries).

### SEO routes (target)

`/services/[slug]`, `/areas/[slug]` (static params from config/DB), `sitemap.ts`, `robots.ts` (disallow `/admin`), `opengraph-image`, canonical URLs, JSON-LD: HVACBusiness (no `aggregateRating` unless backed by real, on-page reviews), `Service` per service page, `BreadcrumbList`, FAQPage.
