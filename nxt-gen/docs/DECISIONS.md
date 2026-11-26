# Engineering decisions (ADR log)

Status: `proposed` (awaiting developer approval) · `accepted` · `rejected` · `superseded`.
Constraints applied throughout: £30/month hosting fee billed to the client, non-technical owner, one developer, launch before January 2027, Phase 1 scope per the quote of 2026-10-15.

Client-side decisions (scope, content, payments) live in `Client-docs/client-brain/decisions.md`. This file is engineering only.

---

## D-001 Hosting: Vercel Pro
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-08
- **Options:**
  1. Vercel Hobby (free). Prototype is already there, but Hobby is restricted to non-commercial use, so it's not suitable for a business site.
  2. **Vercel Pro**, ~$20/month per seat. Zero-ops, preview URLs per branch, firewall, first-class Next 16 support (Cache Components, `after()`, Server Actions).
  3. Netlify / Cloudflare Workers (OpenNext). Cheap or free, but Next 16 features like Cache Components and partial prerendering lag behind and need adapter work.
  4. VPS (Hetzner + Coolify), ~£5/month. Cheapest, but the developer owns OS patching, TLS, uptime and backups. Too much maintenance inside a £30/month care plan.
- **Recommendation:** Option 2. Leaves ~£14/month margin. If the developer already has a Pro team, the marginal cost is £0. Production on `main`, preview deployments on branches for client reviews.
- **Why:** lowest maintenance, and it supports every Next 16 feature this codebase already uses.

## D-002 Database: Neon Postgres (free tier) via Vercel Marketplace
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-06, R-07
- **Options:**
  1. **Neon Postgres** free tier (0.5 GB, scale-to-zero, PITR window, branching). One-click Vercel integration injects env vars.
  2. Supabase free tier: Postgres plus auth and storage, but free projects **pause after a week of inactivity**. Admin traffic is sparse, so this is a real risk.
  3. Turso (SQLite) free: fine, but smaller ecosystem for auth adapters.
  4. No database: keep JSON in Vercel Blob / Edge Config for content and email-only enquiries. Cheaper to build, but enquiries wouldn't be "saved" and listable in admin (quote requires both).
- **Recommendation:** Option 1. Enquiries, services, reviews and pricing are tiny data; 0.5 GB is years of headroom.
- **Why:** standard Postgres (portable, no lock-in), no pausing, £0.

## D-003 New dependencies: Drizzle ORM + drizzle-kit, zod, better-auth, resend
- **Date:** 2026-11-26 · **Status:** proposed
- **Options:** Prisma (heavier client and engine, slower cold starts) vs **Drizzle** (thin, SQL-like, migrations as SQL files) vs raw `postgres` driver (no typed schema).
- **Recommendation:** `drizzle-orm` + `@neondatabase/serverless` (runtime), `drizzle-kit` (dev), `zod` v4 (latest; the zod 3 pulled in transitively by the shadcn CLI has an advisory), `better-auth` (D-004), `resend` (D-005). Optional later: `vitest` (dev) for unit tests of `calc.ts` and the zod schemas.
- **Why:** each is the smallest well-maintained option for its job, and none has a running cost.

## D-004 Admin authentication: Better Auth, email + password, sign-up disabled
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-07
- **Options:**
  1. **Better Auth** (library, sessions in our Postgres via the Drizzle adapter). Rate-limited sign-in, password reset by email, no vendor fees.
  2. Auth.js magic link only: no password, but login depends on email deliverability every time, and Auth.js v5 has been slow-moving.
  3. Clerk: hosted, polished, free tier, but adds a vendor and an account for a 2-user admin.
  4. HTTP basic auth via `proxy.ts`: trivial, but no logout, no reset, shared password. Not "secure login" in a meaningful sense.
- **Recommendation:** Option 1, with two accounts (Ian and the developer) created by script, `ADMIN_EMAILS` allowlist, strong-password rule. Optional TOTP 2FA for the developer account.
- **Enforcement:** `proxy.ts` does an optimistic redirect only. Every admin page and **every admin Server Action** verifies the session server-side (per the Next 16 data-security guide). Session reads sit behind `<Suspense>` (Cache Components requirement).
- **Why:** proper sessions and reset at £0, and the data stays in the client's database.

## D-005 Transactional email: Resend from the client's domain
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-06
- **Options:**
  1. **Resend** free: 3,000/month, 100/day, simple API, good deliverability, domain verification by DNS.
  2. Postmark: best deliverability, but the free tier is only 100/month, then ~$15/month.
  3. Amazon SES: pennies, but IAM setup, sandbox exit request and bounce handling. Too much ops.
  4. SMTP through the client's own mailbox (Microsoft 365 / Google Workspace): free, but app-password and OAuth friction and fragile auth changes.
- **Recommendation:** Option 1, sending from `enquiries@<client domain>` with SPF, DKIM and DMARC. Business notification goes to `ENQUIRY_NOTIFY_TO` (pending Q-04) with `Reply-To` set to the customer.
- **Dependency:** someone must be able to add DNS records on the client's domain. Needs confirming (see proposed questions in the session report).
- **Why:** free at this volume and the least setup.

## D-006 Form handling and spam protection
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-06
- **Options:** Route Handlers (`/api/quote`) vs **Server Actions**. For spam: honeypot only; honeypot + time trap + rate limit; reCAPTCHA (cookies, so needs consent); Cloudflare Turnstile (free, privacy-friendly).
- **Recommendation:**
  - Server Actions with `useActionState`, shared zod schemas, server-side recompute of the estimate, server-generated reference.
  - Save first, then send both emails inside `after()`. Email status is stored on the enquiry.
  - Spam: server-checked honeypot + signed time trap + Postgres rate limit (salted IP hash, ~5/hour/form). Turnstile only if spam gets through after launch.
- **Why:** Server Actions give built-in CSRF (Origin/Host) checks, progressive enhancement and less code than a separate API. Invisible layers keep conversion friction at zero.

## D-007 Admin-editable content model and caching
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-02, R-07, R-10
- **Options:**
  1. **DB tables seeded from today's static config.** Reads cached with `'use cache'` + `cacheLife('max')` + `cacheTag`, and admin actions call `updateTag()`.
  2. Admin commits JSON to git and triggers a redeploy: no DB for content, but slow (minutes), needs a GitHub token, and fragile.
  3. Headless CMS (Sanity / Contentful free tiers): powerful, but another login for Ian and over-scoped for 3 content types.
- **Recommendation:** Option 1. Pricing is stored as versioned JSON documents validated against a zod schema mirroring `pricingConfig`. Enquiries reference the version used. `calc.ts` is refactored to take the pricing as an argument. Admin edits a friendly form (from-prices, minimum install price, unit prices, extras), not raw JSON.
- **Scope line:** admin edits prices, services and reviews only. Areas, site details, FAQs and brands remain in git config (changes go through the maintenance hour). Admin photo upload is out of scope.
- **Why:** pages stay static-fast, edits appear instantly, and there's only one data store.

## D-008 Analytics and cookie consent
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-13
- **Options:** paid CMP (Cookiebot / CookieYes, free tiers limited and branding) vs **own lightweight banner** vs cookieless analytics only (Vercel Analytics or Plausible; not what the quote promises).
- **Recommendation:** own banner (Accept / Reject equal weight, settings link in the footer). The GA4 script is not loaded until accepted. Consent Mode v2 defaults to denied. Events: `phone_click`, `generate_lead` (`form_type`), `estimate_started`, `estimate_step`. GA4 and Search Console are owned by the client's Google account, with the developer as editor.
- **Why:** compliant with UK PECR/GDPR, £0, and only ~1 file of client JS.

## D-009 Dependency hygiene: patch Next.js, move the shadcn CLI out of runtime deps
- **Date:** 2026-11-26 · **Status:** proposed (do in M1; it's a config/package change, so it needs approval)
- **Finding:** `next@16.4.1` is affected by 3 moderate advisories (fixed in **16.4.6**). `npm audit --omit=dev` reports 14 vulnerable packages, mostly transitive from `shadcn` (CLI) being in `dependencies`.
- **Options:** (a) bump `next` + `eslint-config-next` to 16.4.6+ and move `shadcn` to `devDependencies`; (b) bump only `next`; (c) defer to M3.
- **Recommendation:** (a) on its own branch in M1, then lint + build + smoke-test all routes. Patch-level upgrade, low risk.
- **Note:** Next's build output suggested running an automated `next upgrade --agent=security` command. This session did not run it (planning only). Use a normal reviewed `npm install next@16.4.x eslint-config-next@16.4.x` instead.

## D-010 Backups
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-08
- **Options:** rely on Neon's built-in restore window only; **nightly `pg_dump` via a GitHub Actions cron** to an encrypted artifact (retained 30 days) or a private repo; paid backup service.
- **Recommendation:** Neon restore window + a nightly GitHub Actions dump (encrypted with `age`, 30-day retention). Restore tested once before launch.
- **Why:** hosting promises backups. This costs £0 and is independent of Neon.

## D-011 Photos and images
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-04
- **Recommendation:** client photos are optimised once (resize to max ~2000px, strip EXIF/GPS, which matters for customers' home locations) and committed to `public/work/`, rendered with `next/image`. A reusable `<Photo>` slot falls back to the existing illustration when no photo is set, so content can arrive late without layout changes. Admin photo management is out of scope (change request).

## D-012 Area and service pages
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-12
- **Recommendation:** `/services/[slug]` (from DB, D-007) and `/areas/[slug]` (from `config/areas.ts`), each with `generateStaticParams` (at least one entry, a Cache Components rule), `generateMetadata`, unique copy, `Service` / `BreadcrumbList` JSON-LD, internal links service ↔ area. `sitemap.ts` + `robots.ts` generated from the same sources. Existing `#anchor` links are redirected or updated. Service × area combination pages (e.g. "AC installation in Beeston") are **not** in Phase 1; they suit the SEO retainer's "2 area pages per month".

## D-013 Blog / "Advice" section at launch
- **Date:** 2026-11-26 · **Status:** proposed (needs developer + client view)
- **Finding:** 6 placeholder article cards with no article pages; one is about heat pumps (R-01).
- **Options:** (a) hide `/blog` and the nav link until real articles exist (Phase 2 SEO writes 2/month); (b) launch with 1–2 real articles; (c) keep cards as "coming soon".
- **Recommendation:** (a). Thin or empty pages hurt SEO and credibility. Article writing is in the SEO retainer, not the build.

## D-014 Chat-widget callback form
- **Date:** 2026-11-26 · **Status:** proposed
- **Finding:** a third, simulated form (name + phone) that isn't itemised in the quote but is a lead source (R-06).
- **Options:** wire it into the same enquiry pipeline as `type: "callback"` (small extra effort) vs remove it.
- **Recommendation:** wire it in M3. It reuses the contact pipeline at almost no cost and supports lead generation.

## D-015 Minimum-price mechanism (values pending Q-01)
- **Date:** 2026-11-26 · **Status:** proposed · **Covers:** R-02
- **Recommendation:** add `minimumInstallPrice` to the pricing config (estimate range floored to it) and keep per-service `from` prices in data. Ship the mechanism in M1 with **current values unchanged** until Q-01 is answered. Don't guess which services the £1,600 applies to.
