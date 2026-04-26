# Betsroll — Prototype Design Spec

**Date:** 2026-04-20
**Status:** Approved (scope B, GitHub Pages deployment deferred)
**Source of truth for design fidelity:** `Project/project/*.jsx` + `Project/project/styles.css`

## Purpose

A shareable web prototype of Betsroll — a social prediction-market app with swipe-to-vote market validation, a creator-economy "Betsroller" card, and VIP tiers. The prototype demonstrates UX/UI fidelity and core interaction mechanics with local state, but does not integrate blockchain, wallets, or a real market backend.

## Scope

**In scope:**
- Five screens, pixel-close to the Claude-Design JSX mocks:
  1. Mobile Feed (swipe-stack)
  2. Mobile Market (detail)
  3. Mobile Profile (VIP + tabs)
  4. Desktop Feed (grid + right rail)
  5. Desktop Market (2-column + sticky trade sidebar)
- Working interactions: swipe-to-vote, Yes/No toggle + amount input in trade panel, tab switching, hash-based routing.
- Local state persisted to `localStorage`:
  - USDC balance (starts at $4,820.56 per mock data)
  - Freebet balance ($5, spent on first bets before USDC)
  - Per-market validation progress (incremented on swipe-right)
  - User positions (appended when a trade is rolled)
  - History entries (appended on trades, tier-ups, market resolutions)
  - VIP points + tier progression
  - User's vote record per market (prevents double-voting)
- Responsive: mobile UI under 768px, desktop UI at ≥768px. No viewport toggle.
- Roll motif (rotating dashed ring) on logo and certain card backgrounds.

**Out of scope (explicit YAGNI):**
- Embedded wallets, gasless transactions, account-abstraction UI stubs.
- Polymarket or any real order-book integration.
- Chainlink/UMA oracle verification UI.
- Live-streaming price updates. Prices are static per mock data.
- Comment submission form (comments are read-only from mock data).
- Real market creation (the "+ Roll a market" button is visual only).
- Auth, sign-in, sign-up screens.
- Server-side components, API routes, backend.

## Architecture

**Stack:** Vite 5 + React 18 + TypeScript, React Router 6 (HashRouter), no CSS framework — plain CSS with CSS variables carried over from `styles.css`.

**Rationale:**
- Vite: fast dev loop, static build, trivial to host on GH Pages / Vercel / Netlify.
- HashRouter: works on any static host without server-side SPA fallback.
- No Tailwind: the mock uses inline-style objects with CSS variables. Porting to plain CSS preserves fidelity without fighting a framework's utility classes.
- TypeScript: prevents shape mismatches between mock data and components.

**Directory layout (new project at `betsroll-app/`):**

```
betsroll-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx               # Router + viewport shell
    ├── styles/
    │   └── global.css        # :root vars, keyframes, grain, stamps
    ├── data/
    │   ├── markets.ts        # MARKETS, COMMENTS
    │   └── user.ts           # ME initial state, POSITIONS, CREATED, HISTORY initial
    ├── state/
    │   └── useStore.ts       # Single Zustand-style hook over localStorage
    ├── hooks/
    │   └── useViewport.ts    # boolean isDesktop
    ├── components/
    │   ├── primitives/
    │   │   ├── BRLogo.tsx
    │   │   ├── PricePill.tsx
    │   │   ├── Chip.tsx
    │   │   ├── TierBadge.tsx
    │   │   ├── Avatar.tsx
    │   │   ├── Sparkline.tsx
    │   │   ├── MiniChart.tsx
    │   │   ├── ValidationBar.tsx
    │   │   ├── SentimentBar.tsx
    │   │   ├── VIPRing.tsx
    │   │   └── icons.tsx
    │   ├── mobile/
    │   │   ├── MobileShell.tsx    # device-independent mobile wrapper (no phone chrome)
    │   │   ├── MobileFeed.tsx
    │   │   ├── MobileMarket.tsx
    │   │   ├── MobileProfile.tsx
    │   │   ├── SwipeableCard.tsx
    │   │   ├── MarketCardContent.tsx
    │   │   └── BottomNav.tsx
    │   └── desktop/
    │       ├── DesktopShell.tsx   # sidebar + main + right rail
    │       ├── DesktopFeed.tsx
    │       ├── DesktopMarket.tsx
    │       ├── DesktopSidebar.tsx
    │       ├── DesktopRightRail.tsx
    │       └── DesktopMarketCard.tsx
    └── routes/
        ├── FeedPage.tsx      # picks Mobile/Desktop Feed
        ├── MarketPage.tsx    # picks Mobile/Desktop Market by viewport + :id
        └── ProfilePage.tsx   # picks Mobile/Desktop Profile
```

**Routes:**
- `#/` — Feed
- `#/market/:id` — Market detail for given id
- `#/profile` — Profile

## State design

Single `useStore()` hook (plain React state + `useSyncExternalStore` over a module singleton, persisted to `localStorage` under key `betsroll_v1`):

```ts
type Vote = 'yes' | 'no';
type Side = 'YES' | 'NO';

type Position = {
  id: string;
  marketId: string;
  q: string;
  side: Side;
  size: number;
  entry: number;   // price at time of bet (0..1)
  cur: number;     // current price snapshot
  pnl: number;
  eta: string;
  createdAt: number;
};

type HistoryEntry = {
  id: string;
  kind: 'trade' | 'market' | 'tier';
  icon: string;
  txt: string;
  v?: string;
  time: string;
};

type State = {
  balance: number;           // USDC, starts 4820.56
  freebet: number;           // starts 5.00, spent before balance
  votes: Record<string, Vote>;     // marketId -> vote
  validationBoost: Record<string, number>; // marketId -> pts added by me
  positions: Position[];
  history: HistoryEntry[];
  vipPts: number;            // progression toward Platinum
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'King';
};
```

**Actions:**
- `voteMarket(marketId, vote)` — records vote (no-op if already voted); on 'yes', adds 4 to `validationBoost[marketId]` and 4 to `vipPts`; pushes history entry on 'yes'.
- `rollBet(marketId, side, amount)` — debits freebet first then balance; creates position; pushes history; adds 10 * (amount / 25) to vipPts; promotes tier if threshold crossed.
- `reset()` — clears localStorage, restores initial values (for demo).

**Derived:**
- `marketWithProgress(m)` — returns `m` with `progress = min(100, m.progress + validationBoost[m.id])`.
- `tierFromPts(pts)` — Bronze<1000<Silver<3000<Gold<6000<Platinum<15000<King.

## Interactions per screen

**Mobile Feed:**
- 3 cards stacked (z-offset 8px each). Top card draggable.
- Drag threshold 90px → commit swipe; else spring back.
- On commit: off-screen translate, then advance `idx`, flash toast ("APPROVED +4pts" or "SKIPPED"), call `voteMarket`.
- Buttons (×, die, ✓) in action bar trigger the same commit flow.
- "All caught up" empty state at end with "Roll again" → `reset-idx` locally (votes persist).

**Mobile Market:**
- Side toggle (YES/NO), amount input, quick-sum buttons [$10, $25, $50, $100].
- "Roll $X on YES/NO" button → `rollBet`; shows success toast with position summary.
- Chart/Depth/Trades view toggle — content swaps, no real data for depth/trades (static placeholders matching mock).
- Sentiment bar + comments are read-only mock.

**Mobile Profile:**
- VIP-ring progress derived from `vipPts / pointsToNextTier`.
- Balance & freebet reflect live store.
- Tabs: Overview (static highlights + badges), Positions (live from store), Created (mock from data), History (live from store, newest first).
- Back button returns to Feed (`navigate(-1)` or `/`).

**Desktop Feed:**
- Grid of 2 columns on ≥1200px, single column on 768–1199px.
- Cards are clickable; hover tilts.
- Right rail shows Rolling Now (mock), Tier widget (live), Top Betsrollers (mock).
- Sidebar's "Roll a market" button is visual only.

**Desktop Market:**
- Sticky trade sidebar (position:sticky, top:0).
- Same interactions as mobile market for trade panel.
- Breadcrumb: Feed / {cat} / {q}.

## Responsive strategy

`useViewport()` hook:
```ts
function useViewport() {
  const [isDesktop, setDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}
```

Each route page picks mobile or desktop component. No server-side viewport detection. On resize we re-render.

## Visual system

Carried over verbatim from `Project/project/styles.css`:
- CSS variables: `--bg-deep`, `--bg`, `--bg-1..3`, `--line*`, `--ink*`, `--yes`, `--no`, `--brand`, `--gold`, `--display`, `--mono`.
- Fonts: Space Grotesk (display), JetBrains Mono (mono) — from Google Fonts.
- Classes: `.noscroll`, `.ring-dots`, `.grain`, `.glow-yes`, `.glow-no`, `.glow-brand`, `.roll`, `.pulse`, `.ticker-track`, `.mono`, `.stamp*`, `.gradient-text`, `.hr-dash`.
- Roll keyframe (12s linear infinite), pulse-glow (2s), ticker (40s).

Primitives port the inline-style blocks from `primitives.jsx` into React.FC components, swapping `React.createElement`-style JSX for normal TSX.

## Testing

Manual smoke matrix before "done":
1. Mobile feed: swipe 3 cards right — VIP pts should increment 12 in Profile.
2. Swipe one card left — no VIP change, no history entry.
3. Open a market, roll $25 YES — balance drops, freebet drops first (first $5), position appears in Profile's Positions tab, history entry appears.
4. Resize window: 767 ↔ 768 toggles mobile/desktop layouts.
5. Reload page: all state persists from localStorage.
6. Navigate feed → market → back → profile → back to feed: routing works with browser back button.
7. All 5 screens visually match mocks at default viewport (iPhone size for mobile, 1440px for desktop).

Automated tests deferred; prototype is manually verified. (If time permits at the end, add 1-2 Vitest unit tests for `useStore` actions.)

## Error handling

Prototype-level only:
- Negative balance: trade panel's Roll button is disabled if `amount > balance + freebet`.
- Empty amount: button disabled.
- Missing market by id (bad URL): route renders "Market not found" with Back link.
- localStorage write failure (quota/privacy mode): silently fall back to in-memory state with a console.warn — do not crash.

## Deployment

Deferred. Build command will be `npm run build`, output to `betsroll-app/dist/`. When ready, add GitHub Action that builds and deploys to `gh-pages` branch, with `base: '/betsroll/'` in `vite.config.ts`.

## Open questions

None — all resolved in brainstorming:
- scope = B
- GitHub Pages deployment = deferred
- visual fidelity source = JSX mocks (don't copy internal structure, match output)
