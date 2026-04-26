# Changelog

All notable changes to Betsroll. Format roughly follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.6] — 2026-04-20

### Added
- Trading lock on validating markets — buy/sell disabled until 100% community approval
- "Trading locked" panel in market detail with progress bar and Approve-to-go-live CTA
- Lock banners replacing BUY YES/NO buttons on validating cards (mobile feed + desktop grid)
- Disabled Close button on Trade screen for positions on validating markets

### Changed
- Seed positions moved from validating markets (m2/m3) to live markets (m1/m4) so they remain tradable

## [0.1.5] — 2026-04-20

### Fixed
- `CreateMarketModal` no longer hidden under sticky asides in Chrome — now rendered via React Portal at `document.body`
- Modal card has solid + gradient background to prevent transparency
- Body scroll locked while modal open

## [0.1.4] — 2026-04-20

### Added
- Create-market flow: modal with question, category, resolves-in, initial YES price
- Triggered from mobile `+` button (BottomNav) and desktop "Roll a market" CTA (Sidebar)
- New action `createMarket()` in store with `userMarkets` state
- `useAllMarkets()` hook combines user-created + seed markets
- Approve-to-go-live / Skip buttons on validating cards in `DesktopMarketCard` (desktop equivalent of mobile swipe)

## [0.1.3] — 2026-04-20

### Added
- Sell-position flow: Buy/Sell mode toggle in market detail trade panel
- `sellPosition()` action with discriminated-union return type (`{ok, cashOut, realizedPnl}` or `{ok: false, reason}`)
- 25% / 50% / 75% / Max quick buttons in sell mode
- Realized PnL display in sell summary
- Quick "Close" button on Trade screen positions
- 7 new vitest units for sell + merge-on-buy (20 total)

### Changed
- `rollBet()` now merges same market+side positions into one row with weighted-avg entry (no more duplicate position rows)

## [0.1.2] — 2026-04-20

### Added
- `/markets` route with vertical scrollable list, sort (Top/New/Closing), category filter
- `/trade` route with portfolio summary, win/loss stats, positions list with Adjust + Close
- BottomNav "Markets" and "Trade" tabs now functional
- Desktop sidebar "Trade" link with 💹 icon

## [0.1.1] — 2026-04-20

### Fixed
- Card clicks no longer hijacked by SwipeableCard pointer capture
- Drag now activates only after 5px movement, allowing inner button clicks to propagate
- Mobile market card title now clickable (parity with desktop)

### Added
- `meta robots="noindex, nofollow"` and `public/robots.txt` to disable search indexing
- GitHub Actions workflow `.github/workflows/deploy.yml` for auto-deploy to GitHub Pages

## [0.1.0] — 2026-04-20

### Added
- Initial prototype: 5 responsive screens (Mobile Feed with swipe, Mobile Market, Mobile Profile, Desktop Feed, Desktop Market)
- LocalStorage-persisted store via `useSyncExternalStore`
- Mock data for 5 markets, 3 comments, user profile
- Vitest test setup with happy-dom + 13 unit tests on store
- Design tokens carried over from Claude Design handoff (`Project/project/styles.css`)
- 10 primitives (BRLogo, Avatar, Chip, TierBadge, PricePill, Sparkline, MiniChart, ValidationBar, SentimentBar, VIPRing) + Icon set
- Vite + React 18 + TypeScript + React Router (HashRouter)
- README with deploy guide

### Mechanics
- Swipe-to-vote: right approves (+4 VIP pts, +4% validation), left skips
- Buy YES/NO with USDC + freebet ($5) — freebet consumed first
- VIP tier progression: Bronze < Silver < Gold < Platinum < King by points
- All state persists across reload

---

## Live deployment

Latest live build: https://ortougaletta-arch.github.io/betsroll/
Auto-deploys on push to `main` via GitHub Actions.
