# Betsroll

> Social prediction-market prototype with swipe-to-vote validation, creator economy, VIP tiers.

**Live demo:** https://ortougaletta-arch.github.io/betsroll/
**Status:** UI prototype with localStorage state. No backend, no blockchain — yet.

## Stack

Vite 5 · React 18 · TypeScript · React Router (HashRouter) · plain CSS with CSS variables · Vitest with happy-dom.

## Features (current)

- 5 responsive screens: Feed (swipe stack), Markets (list), Market detail, Trade (portfolio), Profile (VIP)
- Create-market modal (rendered via React Portal so sticky-aside z-index can't trap it)
- **Swipe-to-vote** mechanic on mobile, **Approve/Skip** buttons on desktop
- **Buy / Sell** flow with merge-on-buy (weighted-avg entry) and partial sell (25/50/75/Max)
- Trading **locked** on validating markets — vote-only until 100% approval
- Freebet $5 consumed before USDC, VIP tier progression (Bronze → King)
- Quick-close from Trade screen
- Everything persists in `localStorage` per visitor

See `CHANGELOG.md` for full history.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173/ — narrow window shows mobile UI, ≥768px shows desktop.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | TypeScript check + production build to `dist/` (~74 KB gzip) |
| `npm run preview` | Serve built `dist/` locally |
| `npm test` | Run vitest units (20 tests on state store) |

## Project structure

```
src/
  main.tsx, App.tsx            — router shell, route definitions
  styles/global.css            — design tokens, keyframes, utility classes
  data/
    markets.ts                 — MARKETS + COMMENTS seed, types Market/Comment/TierName
    user.ts                    — ME profile, CREATED, SEED_POSITIONS, SEED_HISTORY
  state/
    types.ts                   — Store / Position / HistoryEntry / Vote / Side
    useStore.ts                — singleton via useSyncExternalStore + actions
                                 (voteMarket, rollBet, sellPosition, createMarket, reset)
    useStore.test.ts           — 20 vitest units (tier math, sell, merge, vote)
    test-setup.ts              — happy-dom + localStorage shim
  hooks/useViewport.ts         — isDesktop via matchMedia(min-width: 768px)
  components/
    CreateMarketModal.tsx      — Portal-based modal (escapes sticky stacking ctx)
    primitives/                — BRLogo, Avatar, Chip, TierBadge, PricePill,
                                 Sparkline, MiniChart, ValidationBar, SentimentBar,
                                 VIPRing, icons
    mobile/                    — MobileFeed, MobileMarket, MobileProfile,
                                 MobileMarkets, MobileTrade, BottomNav,
                                 SwipeableCard, MarketCardContent
    desktop/                   — DesktopFeed, DesktopMarket, DesktopSidebar,
                                 DesktopRightRail, DesktopMarketCard
  routes/                      — FeedPage, MarketsPage, MarketPage,
                                 TradePage, ProfilePage
                                 (each picks mobile/desktop by viewport)
public/
  robots.txt                   — Disallow: / (no search indexing)
.github/workflows/
  deploy.yml                   — auto-deploy to GitHub Pages on push to main
```

## State model

A single `useStore()` hook over a module-singleton, persisted to `localStorage` under key `betsroll_v1`. State shape:

- `balance: number` — USDC, starts $4820.56
- `freebet: number` — $5, consumed before USDC on first bets
- `votes: Record<marketId, 'yes'|'no'>` — one vote per market
- `validationBoost: Record<marketId, number>` — `+4%` per yes-vote
- `positions: Position[]` — open positions, merged per market+side
- `history: HistoryEntry[]` — feed of trade/market/tier events
- `vipPts, tier` — VIP progression
- `userMarkets: Market[]` — markets created in-session

Trading is gated by `market.status === 'live'` — validating markets can only be voted on.

## Routes

```
/               Feed
/markets        Markets list
/market/:id     Market detail (404 page if id not found)
/trade          Portfolio + positions
/profile        VIP profile + 4 tabs
*               redirect to /
```

## Deploy to GitHub Pages

> The repo already ships with `.github/workflows/deploy.yml`. Once enabled, `git push origin main` auto-deploys.

### One-time setup

1. **Create empty public repo** at https://github.com/new — name it `betsroll`. Do **not** initialise with README/gitignore.

2. **Push the project:**
   ```bash
   git remote add origin https://github.com/<your-username>/betsroll.git
   git push -u origin main
   ```
   First push prompts for credentials. Use a Personal Access Token (Settings → Developer settings → Personal access tokens → classic → scope `repo` and `workflow`).

3. **Enable Pages with Actions:** repo → **Settings → Pages** → **Source: GitHub Actions** (not "Deploy from a branch"!). Save.

4. **Wait for the deploy:** repo → **Actions** tab. ~1 min build. Live URL printed in the deploy job log:
   `https://<your-username>.github.io/betsroll/`

### Subsequent deploys

Any `git push origin main` re-runs the workflow and redeploys. No manual steps.

### If Pages stops working

Most likely cause: someone changed **Settings → Pages → Source** away from "GitHub Actions". To fix:

```bash
gh api --method PUT /repos/<your-username>/betsroll/pages -f build_type=workflow
gh workflow run "Deploy to GitHub Pages" --repo <your-username>/betsroll
```

## Path & routing notes

- `vite.config.ts` uses `base: './'` — relative asset URLs, works under any subpath (including `/betsroll/`).
- `HashRouter` keeps routes in the URL hash (`#/market/m1`) so static hosts don't need a SPA rewrite rule for nested routes.
- No search indexing: `<meta name="robots" content="noindex, nofollow">` + `public/robots.txt` (`Disallow: /`).

## Documentation

- `../docs/superpowers/specs/2026-04-20-betsroll-design.md` — initial prototype design spec
- `../docs/superpowers/specs/2026-04-20-screens-roadmap.md` — what screens exist, what's missing (MVP/V1/V2)
- `../docs/superpowers/specs/2026-04-20-betsroll-web3-architecture.md` — Web3 roadmap (contracts, oracles, wallets) for the production version
- `../docs/superpowers/plans/2026-04-20-betsroll-prototype.md` — full implementation plan for the current prototype (every step, every commit)
- `CHANGELOG.md` — version history
- `CONTRIBUTING.md` — code style, commit conventions, how to add a feature
