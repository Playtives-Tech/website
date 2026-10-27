# Playtives website

Next.js App Router conversion of the supplied marketing website. The opportunities catalogue is a React component; the wealth calculator retains its browser script.

## Run

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3003. Production: `pnpm build` then `pnpm start`.

Routes: `/`, `/opportunities/`, `/opportunities/[slug]/`, `/opportunities/view/?slug=...` (legacy link), `/blog/`, `/blog/[slug]/`, `/wealthplan/`.

Set `API_URL` to the reachable Playtives backend origin in the website deployment (or `NEXT_PUBLIC_API_URL` for compatibility). The website proxies the public backend catalogue and loads public opportunity details and published blog posts server-side, so the browser does not need backend CORS access. Do not deploy with `localhost:3001` as the production backend URL. Opportunity details link members to dashboard.playtives.com when they choose to participate. The calculator retains the supplied illustrative exchange rates and calculations.

Pages use regular anchors to preserve full-document navigation. Logo is served from public/logo-navbar-light.png. Source files under Pictures/website are not modified.

The supplied source links to `wealthplan/The_Predictable_Wealth_Plan.pdf`, but that PDF was not included. Add it at `public/wealthplan/The_Predictable_Wealth_Plan.pdf` to enable the existing download button.
