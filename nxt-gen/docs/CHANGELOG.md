# Changelog

Newest first. One entry per working session.

## 2026-11-26 (Thu): Real domain nxtgenairconltd.com

- New `site.domain = "nxtgenairconltd.com"`. `site.url` now falls back to `https://nxtgenairconltd.com` instead of localhost, so canonical, Open Graph and JSON-LD URLs are right even without `NEXT_PUBLIC_SITE_URL`.
- Email placeholder `hello@nxtgen-aircon.co.uk` (made-up domain) replaced by the client's `sales@nxtgenairconltd.com` (Q-04: confirm it's the public address).
- Van illustration: domain now read from config, and moved from the dark band (where the front wheel covered it) onto the white panel under "AIR CONDITIONING". Checked with a rendered preview.

## 2026-11-26 (Thu): Next.js security upgrade (M1-11, part)

- Next.js and eslint-config-next 16.4.1 → 16.4.6 via `next upgrade --agent=security`, plus `experimental.agentUpgrade: "security"` in `next.config.ts`. Done in worktree `../NXTGEN-next-upgrade` on branch `chore/next-16.4.6-security` (commit 796c8eb), not yet merged into main.
- Verified there: lint, tsc, build passes first run (no security stop), all 7 routes 200. `npm audit --omit=dev` no longer lists `next`; 13 advisories remain, all via the `shadcn` CLI in runtime dependencies (rest of M1-11).

## 2026-11-26 (Thu): Ian's first round of changes (M1-01, M1-03, M1-04)

- **R-01 Heat pumps removed:** `heat-pumps` service deleted (site now lists 5 services), heat-pumps blog card removed, "heat pump" dropped from Hero tagline, Domestic body, feature card, FAQ answer and West Bridgford highlight. The site still says units heat as well as cool (Q-02 open).
- **R-02 £1,600 minimum:** Installation and Home AC "from" prices £1,450 → £1,600; FAQ cost answer updated. Commercial (£2,200), servicing (£95) and repairs (£89) unchanged. New `pricingConfig.minimumInstallPrice = 1600`; `calculateEstimate` floors `installRange` to it and adds a note (a 3×3m bedroom went from £1,400–£1,900 to £1,600–£1,900).
- **R-03 Brands:** `brands` = Samsung, Daikin, Mitsubishi, Hitachi. New shared `BrandStrip` section on the home page and About.
- Services grid on the home page now centres the last row (5 cards).
- Lint, `tsc`, build pass (build needs a rerun because of the Next security guard, M1-11). Pages checked on `next start`.

## 2026-11-26 (Thu): Kick-off and planning session

**Type:** planning only. No changes to `src/`, config or packages. Nothing committed.

- Read the client brain (requirements R-01..R-13, open questions Q-01..Q-07, decisions, commercials, timeline) and the onboarding plan sent to the client (preview Wed 2 Dec, review 2–9 Dec, build 9–23 Dec, launch before January).
- Audited the prototype: structure, config/content model, estimator maths, the three simulated forms, SEO, placeholders, and gaps against Phase 1 scope. Findings are in `ARCHITECTURE.md` §1.
- Read the Next 16 docs for Server Actions, caching with Cache Components (`use cache`, `cacheTag`, `updateTag`, `revalidateTag(tag, 'max')`), auth with Cache Components, `proxy.ts`, sitemap and `generateStaticParams`.
- Baseline: `npm run lint` passes. `npm run build` compiles and prerenders all routes. The first run exited 1 from Next's security-upgrade guard; a rerun passed with a warning. `npm audit --omit=dev`: `next@16.4.1` has 3 moderate advisories (fix 16.4.6); 14 vulnerable packages in total, mostly via the `shadcn` CLI in runtime dependencies.
- Created `docs/ARCHITECTURE.md` (current state + proposed target), `docs/DECISIONS.md` (D-001..D-015, all `proposed`), `docs/BACKLOG.md` (M1–M4 + out-of-scope), and this changelog.
