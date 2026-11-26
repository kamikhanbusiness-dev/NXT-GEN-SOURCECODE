# Backlog

Last updated: 2026-11-26. Milestones follow the client plan (onboarding doc, 26 Nov) and `Client-docs/client-brain/timeline.md`.

Status: `todo` · `in-progress` · `blocked` (waiting on Q-xx / content / decision) · `done` · `out-of-scope` (change request, don't build unasked).
R-xx = `Client-docs/client-brain/requirements.md`, Q-xx = `open-questions.md`, D-xxx = `DECISIONS.md`.

| Milestone | Dates | Goal |
|---|---|---|
| **M1 Preview** | 26 Nov – **Wed 2 Dec** | Agreed content changes and real-content slots; nothing that depends on open questions |
| **M2 Review changes** | 2 – 9 Dec | Apply client feedback and answers; design approval (payment stage 1); provision infrastructure |
| **M3 Full build** | 9 – 23 Dec | Backend, forms + email, admin, SEO pages, legal, analytics, testing |
| **M4 Launch** | by 31 Dec | Go live, handover (payment stage 2) |

---

## M1 Preview (due Wed 2 Dec)

| ID | Task | R | Acceptance criteria | Status | Blocked by |
|---|---|---|---|---|---|
| M1-01 | Remove the air-to-air heat pump service | R-01 | `heat-pumps` removed from `content/index.ts` services and `sceneFor` in `app/services/page.tsx`. Hero tagline no longer says "heat pump". Heat-pumps blog card removed. Feature "A+++ efficient heat pumps" and area highlight "Heat-pump heating for winter" reworded without naming heat pumps. Nav/mega-menu/footer service lists show 5 services. `grep -ri "heat.pump" src` returns nothing outside comments. Lint + build pass | done | |
| M1-02 | Heating wording (do AC units "heat as well as cool"?) | R-01 | Domestic service body/benefits, FAQ "Can air conditioning heat my home too?", testimonial "warm in January", area "Year-round heating & cooling" all updated per the answer. Until answered, left as is and listed in the preview notes | blocked | Q-02 |
| M1-03 | Brands: Samsung, Daikin, Mitsubishi, Hitachi | R-03 | `brands` in `content/index.ts` = exactly these 4. Brand strip shown on the home page (not just About). Home copy "for all major brands" (repairs) kept, since repairs aren't limited to fitted brands. Text badges for now; logo files only if the client supplies them or usage is allowed | done | (confirm Mitsubishi Electric vs Mitsubishi Heavy Industries, proposed question) |
| M1-04 | Minimum install price mechanism | R-02 | `minimumInstallPrice` in `config/pricing.ts` (nullable). `calculateEstimate` floors `installRange` to it when set, with a note line. `from` prices read from data. **Values unchanged** until Q-01 is answered. Manual check: 2.0 kW wall split with floor set to 1600 shows ≥ £1,600 | done | (values: Q-01) |
| M1-05 | Photo slots | R-04 | `<Photo>` component: `next/image` when a `src` is set, else the existing `<Scene>`. Used for hero/service/about/split-section images. "Our work" gallery section scaffold on home and About that hides when empty. No layout shift (fixed aspect ratios) | todo | |
| M1-06 | Social links from config, hide empties | R-05 | `site.social.*` default to `""`. Footer and contact page render only non-empty links (no links to bare `instagram.com/`). Instagram link slot ready | todo | |
| M1-07 | Reviews structure | R-10 | Testimonial type gains `source`, optional `rating` and `date`. Reviews section, StatsBand rating and JSON-LD `aggregateRating` are each hidden when no real data is configured (flag on `site.rating`). Placeholders clearly marked in the preview | todo | |
| M1-08 | Trust-claim switches | R-09, R-10 | Every unverified claim (founded year, years' experience, installs count, rating, accreditations REFCOM/NICEIC, 7-year warranty, finance, VISA/Mastercard/PayPal badges, "Price Promise", team, opening hours, address) is driven by config and can be turned off. A list of these goes to the client-liaison for the client to confirm | todo | |
| M1-09 | Legal link stubs | R-13 | `/privacy` and `/cookies` routes exist with a "being finalised" holding page (noindex). Footer and consent-checkbox links point to them, not `/contact`. Terms link hidden unless the client supplies T&Cs | todo | |
| M1-10 | Repo hygiene | R-08 | `public/brand copy/` removed. `.gitignore` adds `!.env.example`. `.env.example` added with `NEXT_PUBLIC_SITE_URL`. Misleading comment in `config/areas.ts` ("generates /areas/[slug]") corrected | todo | |
| M1-11 | Security patch (D-009) | R-08 | `next` and `eslint-config-next` at ≥16.4.6. `shadcn` moved to `devDependencies`. `npm audit --omit=dev` shows no `next` advisory. Lint + build pass. All 7 routes return 200 on `next start` | in-progress | next 16.4.6 done on branch `chore/next-16.4.6-security`; shadcn → devDependencies still to do |
| M1-12 | Contact details and logo | R-09 | Real phone, email, address (or none) and logo in `config/site.ts` / `Logo.tsx`. Until then the preview shows placeholders, flagged in the preview notes | blocked | Q-04, logo file |
| M1-13 | Service areas list | R-09, R-12 | `config/areas.ts` matches the client's list, with unique intro per area | blocked | Q-05 |
| M1-14 | Preview QA and send | R-11 | Preview deployed to a Vercel preview URL (developer deploys). Checked at 375px, 768px, 1280px+. Lint + build pass. Short "what changed / still placeholder" note for the client | todo | |

## M2 Review changes (2 – 9 Dec)

| ID | Task | R | Acceptance criteria | Status | Blocked by |
|---|---|---|---|---|---|
| M2-01 | Triage client feedback | R-11 | Feedback ingested by client-liaison. Each change becomes a backlog item marked in-scope or `out-of-scope` | todo | client feedback |
| M2-02 | Apply minimum prices | R-02 | Values from the Q-01 answer set in pricing config and service `from` prices. FAQ price sentence ("£1,450 and £2,200") updated to match | blocked | Q-01 |
| M2-03 | Apply heating wording | R-01 | Per M1-02 | blocked | Q-02 |
| M2-04 | Real content in | R-04, R-05, R-09, R-10 | Logo, contact details, areas, 15–30 photos (resized, EXIF/GPS stripped), reviews (with permission), Instagram link, accreditations all in place. Placeholder switches from M1-08 set to real values or off | blocked | Q-04, Q-05, content |
| M2-05 | Instagram display | R-05 | Link/icon only, unless Q-03 is answered as "feed" (then see OOS-01) | blocked | Q-03 |
| M2-06 | Design approval | R-11 | Client approves the design in writing (Slack). Recorded in client-brain decisions. Triggers payment stage 1 | todo | client |
| M2-07 | Approve architecture decisions | R-06, R-07, R-08, R-13 | D-001 to D-008, D-010 marked `accepted` or changed by the developer | todo | developer |
| M2-08 | Provision infrastructure | R-08 | Vercel Pro project, Neon DB (prod + dev branch), Resend account with domain DNS records verified, GA4 property + Search Console (client-owned), env vars set in Vercel, `.env.example` complete. Started early because DNS verification can take days | todo | M2-07, domain/DNS access |

## M3 Full build (9 – 23 Dec)

| ID | Task | R | Acceptance criteria | Status | Blocked by |
|---|---|---|---|---|---|
| M3-01 | Data layer | R-06, R-07 | Drizzle schema + migrations for enquiries, services, reviews, pricing_versions, auth tables, rate_limits (ARCHITECTURE §2). Seed script reproduces the current site content exactly. `src/lib/data/*` server-only, cached with `'use cache'` + `cacheLife` + `cacheTag` | todo | M2-07, M2-08 |
| M3-02 | Pricing from DB | R-02, R-07 | `calculateEstimate(input, pricing)`. Quote page passes active pricing to `QuoteWizard`. Zod schema for the pricing document. Estimates identical to today for the seeded pricing (unit test or scripted comparison) | todo | M3-01 |
| M3-03 | Quote form backend | R-06 | Server Action: zod validation, server recompute, server reference, saved with pricing version. Business + customer emails in `after()`. Honeypot + time trap + rate limit. Errors shown inline. Works with JS slow or disabled where practical. A test submission lands in DB and both inboxes | todo | M3-01, M3-06 |
| M3-04 | Contact form backend | R-06 | Same pipeline, `type: contact`. Honeypot actually checked server-side | todo | M3-03 |
| M3-05 | Callback widget backend (D-014) | R-06 | Same pipeline, `type: callback`, name + phone only | todo | M3-03, D-014 |
| M3-06 | Email templates and deliverability | R-06 | Business email (all details, estimate lines, admin link, Reply-To customer). Customer confirmation (reference, range + disclaimer, phone, next steps). SPF/DKIM/DMARC pass. Arrives in Gmail and Outlook inboxes, not spam. Send status stored | todo | M2-08 |
| M3-07 | Admin auth (D-004) | R-07 | `/admin/login`. Two seeded users. Sign-up disabled. Login rate-limited. Password reset by email. `proxy.ts` optimistic redirect. **Every admin page and Server Action checks the session server-side** (tested by POSTing to an action without a cookie: rejected). Admin `noindex` | todo | M3-01 |
| M3-08 | Admin: enquiries | R-07 | List (newest first, filter by type/status), detail view, status change, delete (GDPR). Email status visible | todo | M3-07, M3-03 |
| M3-09 | Admin: services | R-07 | Edit title, summary, body, benefits, from price, order, visible. Validation. `updateTag('services')`, so the public site updates immediately | todo | M3-07 |
| M3-10 | Admin: prices | R-02, R-07 | Form for minimum install price, unit prices, extras. Validation (min ≤ max, non-negative). Saves a new pricing version. Sample estimate preview before saving. Estimator reflects the change immediately | todo | M3-07, M3-02 |
| M3-11 | Admin: reviews | R-07, R-10 | Add / edit / hide / reorder reviews. Public reviews section and rating update immediately | todo | M3-07 |
| M3-12 | Service pages `/services/[slug]` (D-012) | R-12 | One page per visible service. Unique metadata, `Service` + `BreadcrumbList` JSON-LD, CTA to quote, links to areas. Old `#anchor` links updated | todo | M3-01 |
| M3-13 | Area pages `/areas/[slug]` (D-012) | R-12 | One page per area from the client's list, with unique copy, metadata, JSON-LD and links to services | blocked | Q-05 |
| M3-14 | Sitemap, robots, OG, canonical | R-12 | `sitemap.ts` (all public pages, services, areas), `robots.ts` (disallow `/admin`, sitemap URL), OG image, canonical URLs. `aggregateRating` only if real reviews back it | todo | M3-12 |
| M3-15 | Privacy and cookie pages | R-13 | Final copy: controller (legal name, address), data collected per form, purpose, lawful basis, processors (Vercel, Neon, Resend, Google), retention (proposed 24 months), rights, ICO complaint route, cookie table. Client confirms company details | todo | company details from client |
| M3-16 | Cookie consent banner (D-008) | R-13 | Accept/Reject equal prominence. GA script absent from the network tab before consent. Choice remembered. "Cookie settings" in footer reopens it | todo | D-008 |
| M3-17 | GA4 + Search Console + conversions | R-13 | `phone_click`, `generate_lead` (`form_type`), `estimate_started`/`estimate_step` visible in GA4 DebugView. Key events configured. Search Console verified (DNS) | todo | M2-08, M3-16 |
| M3-18 | Data retention and security pass | R-06, R-08 | Retention delete action. Security headers (HSTS, frame-ancestors, referrer-policy; CSP if feasible with GA). `npm audit --omit=dev` clean of high. Secrets only in env | todo | |
| M3-19 | Cross-device testing | R-11 | Test matrix: iPhone Safari, Android Chrome, iPad, desktop Chrome/Safari/Edge/Firefox. Every route, the estimator, all 3 forms, admin flows. Lighthouse mobile ≥ 90 perf/a11y/SEO on home, quote, one service and one area page. Keyboard-only run of the quote wizard. Results logged | todo | M3-03..M3-17 |
| M3-20 | Automated checks (optional, D-003) | R-06 | Vitest unit tests for `calc.ts` (incl. minimum floor) and zod schemas | todo | D-003 |

## M4 Launch (before January)

| ID | Task | R | Acceptance criteria | Status | Blocked by |
|---|---|---|---|---|---|
| M4-01 | Production cutover | R-08 | Domain on Vercel, HTTPS, www/apex redirect, `NEXT_PUBLIC_SITE_URL` set. Redirects from any old site URLs if one exists | todo | domain access |
| M4-02 | Post-launch checks | R-06, R-13 | Live test enquiry of each type received by business + customer. GA real-time shows events. Sitemap submitted in Search Console | todo | M4-01 |
| M4-03 | Backups live (D-010) | R-08 | Nightly dump job green. One restore tested to a Neon branch | todo | D-010 |
| M4-04 | Monitoring | R-08 | Free uptime monitor on home + quote page, alerts to the developer. Vercel error notifications on | todo | |
| M4-05 | Handover and training | R-07 | Walkthrough with Ian (login, enquiries, prices, services, reviews). One-page admin guide. Admin accounts handed over. Ownership of domain, GA and Search Console confirmed in the client's name | todo | |
| M4-06 | Go-live sign-off | R-11 | Client approves go-live. Recorded in client-brain. Triggers payment stage 2 | todo | client |

## Out of scope (change requests: don't build unasked)

| ID | Item | Note |
|---|---|---|
| OOS-01 | Live Instagram feed on the site | Needs the Instagram API (Business/Creator account). Not itemised in the quote. Linking is in scope. Depends on Q-03 |
| OOS-02 | Online booking / calendar, online payments, customer accounts | Excluded in commercials |
| OOS-03 | Admin editing of areas, site details, FAQs, brands, photos | Quote says prices, services, reviews only. Handled via the maintenance hour |
| OOS-04 | Blog article pages / writing | SEO retainer (Phase 2), see D-013 |
| OOS-05 | Service × area combination pages | SEO retainer (Phase 2) |
| OOS-06 | Finance application integration, live Google/Checkatrade review widget | Not in the quote |
| OOS-07 | Terms & Conditions copy | Not in the quote. Client supplies, or the link is hidden |
| OOS-08 | Google Ads management | Optional add-on, £250/month |
