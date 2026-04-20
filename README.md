# Betsroll — Prototype

Social prediction-market prototype. 5 responsive screens (mobile feed with swipe-to-vote, market detail, VIP profile, desktop feed, desktop market). State persisted to `localStorage`. No backend.

Stack: Vite 5 + React 18 + TypeScript + React Router (HashRouter).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173/ — narrow window shows mobile UI, ≥768px shows desktop.

## Scripts

- `npm run dev` — dev server on port 5173
- `npm run build` — prod build to `dist/`
- `npm run preview` — serve built `dist/`
- `npm test` — run vitest units (13 tests on state store)

## Deploy to GitHub Pages (step by step)

This assumes you don't have the repo on GitHub yet.

### 1. Create an empty public repo on github.com

Go to https://github.com/new and create `betsroll` (public, don't initialize with README/gitignore).

### 2. Push this project

From inside `betsroll-app/` (the git repo is already initialised here):

```bash
git remote add origin https://github.com/<your-username>/betsroll.git
git push -u origin main
```

Replace `<your-username>` with your GitHub handle. First push asks for GitHub credentials — use a Personal Access Token (Settings → Developer settings → Personal access tokens → "classic" → scope `repo`) as the password.

### 3. Enable GitHub Pages with Actions

On github.com, go to your repo → **Settings → Pages**:
- **Source**: pick **"GitHub Actions"** (not "Deploy from a branch").

That's it — the workflow at `.github/workflows/deploy.yml` already runs on every push to `main`, builds with `npm run build`, and publishes `dist/` to Pages.

### 4. Watch the deploy

Go to repo → **Actions** tab. The "Deploy to GitHub Pages" workflow should be running (or completed). When it finishes, the job log prints a URL like:

```
https://<your-username>.github.io/betsroll/
```

Click it — that's your live prototype link to share.

### Subsequent deploys

Any `git push` to `main` re-runs the workflow and redeploys. No manual steps.

## Notes on paths

- `vite.config.ts` uses `base: './'` (relative paths) — works under any subpath including `/betsroll/`.
- Routing uses `HashRouter` (`#/market/m1`), so no 404 issues on static hosts.

## Project structure

```
src/
  main.tsx, App.tsx          — router shell
  styles/global.css          — design tokens, keyframes, utilities
  data/                      — MARKETS, COMMENTS, ME, CREATED seed
  state/
    types.ts                 — Store/Position/HistoryEntry types
    useStore.ts              — localStorage-persisted singleton via useSyncExternalStore
    useStore.test.ts         — 13 vitest units
  hooks/useViewport.ts       — isDesktop via matchMedia(768px)
  components/
    primitives/              — Logo, Avatar, Chip, TierBadge, PricePill, charts, bars, icons
    mobile/                  — MobileFeed, MobileMarket, MobileProfile, SwipeableCard, BottomNav
    desktop/                 — DesktopFeed, DesktopMarket, DesktopSidebar, DesktopRightRail, DesktopMarketCard
  routes/                    — FeedPage, MarketPage, ProfilePage (pick mobile/desktop by viewport)
```
