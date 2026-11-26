# Requirements

Status: `agreed` · `interpretation` (needs client confirmation) · `pending-content` · `done` · `removed` · `superseded`

| ID | Requirement | Status | Source | Notes / where in code |
|---|---|---|---|---|
| R-01 | Remove air-to-air (source) heat pumps completely. "We don't do them." | done (2026-11-26; heating wording pending Q-02) | Ian, WhatsApp 2026-11-25 22:16 | `nxt-gen/src/content/index.ts` service `heat-pumps`; also heat-pump wording in About value (~L122), FAQ (~L140), blog post (~L157), Hero tagline `components/home/Hero.tsx:27`, Domestic service body. See Q-02 |
| R-02 | Minimum ("from") prices set to £1,600 | done as interpretation: install prices + estimator floor; confirm Q-01 | Ian, 2026-11-25 22:16 | Currently £1,450 (installation, domestic), £2,200 commercial, £95 servicing, £89 repairs. Likely means install prices only. See Q-01. Also check estimator floor in `config/pricing.ts` |
| R-03 | Show equipment brands fitted: Samsung, Daikin, Mitsubishi, Hitachi | done (2026-11-26) | Ian, 2026-11-25 22:16 | Not on site yet |
| R-04 | Use photos of previous installations / completed jobs | pending-content | Ian 22:29, agreed 22:39 | Waiting on photos |
| R-05 | Link Instagram page; consider displaying Instagram content on site | agreed (display = "look at") | Ian 22:29, dev 22:39 | Waiting on link |
| R-06 | Site built for lead generation: turn visitors into enquiries and quote requests | agreed | Ian 22:29 "need good sales"; dev 22:39 | Quote form + contact form in build scope |
| R-07 | Admin area for client to change prices, services and reviews | agreed | Quote; dev message 22:22 | |
| R-08 | Developer hosts and maintains the site (hosting, security, backups, fixes, ~1 hr small changes/month) | agreed | Ian asked 22:16, dev 22:22, quote | £30/month |
| R-09 | Real logo, contact number, email, service areas on site | pending-content | Dev list 2026-11-25 | `config/site.ts` still has placeholder phone/email/address; `config/areas.ts` |
| R-10 | Customer reviews / testimonials on site | pending-content | Dev list 2026-11-25 | Placeholders in `content/index.ts` |
| R-11 | Client reviews a preview and requests changes before full development | agreed | Ian 21:58, dev 22:46 | |
| R-12 | Area and service pages for local SEO | agreed | Quote | |
| R-13 | Privacy and cookie pages; Google Analytics + Search Console | agreed | Quote | |
