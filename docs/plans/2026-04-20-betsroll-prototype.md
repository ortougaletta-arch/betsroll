# Betsroll Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working, shareable web prototype of Betsroll — 5 responsive screens (mobile feed with swipe, mobile market, mobile profile, desktop feed, desktop market) with local state mechanics, matching the Claude-Design JSX mocks pixel-close.

**Architecture:** Vite 5 + React 18 + TypeScript single-page app. Hash-based routing (GitHub Pages friendly). Single module-singleton store with `useSyncExternalStore`, persisted to localStorage. Primitives ported 1:1 from `Project/project/primitives.jsx`. Responsive split (mobile vs desktop) by CSS-media-query hook, not UA detection.

**Tech Stack:** Vite 5, React 18, TypeScript 5, React Router 6 (HashRouter), plain CSS with CSS variables, Vitest (for state-module unit tests only).

**Spec:** `/Users/Kyrylo/Desktop/betrolls/docs/superpowers/specs/2026-04-20-betsroll-design.md`
**Fidelity source:** `/Users/Kyrylo/Desktop/betrolls/Project/project/*.jsx` + `styles.css`
**Target dir:** `/Users/Kyrylo/Desktop/betrolls/betsroll-app/`

---

## File structure (all paths relative to `betsroll-app/`)

```
package.json                          — Vite + React + TS deps, scripts
vite.config.ts                        — base: './', server.port 5173
tsconfig.json, tsconfig.node.json     — TS config for app + build tooling
index.html                            — root div, Google Fonts link, title
.gitignore                            — node_modules, dist, .DS_Store
src/main.tsx                          — ReactDOM.createRoot + Router
src/App.tsx                           — Routes shell
src/styles/global.css                 — all :root vars + keyframes + utility classes
src/data/markets.ts                   — MARKETS array + COMMENTS array (types exported)
src/data/user.ts                      — ME, POSITIONS seed, CREATED, HISTORY seed
src/state/useStore.ts                 — module-singleton store, useSyncExternalStore hook, actions
src/state/useStore.test.ts            — Vitest units for store actions (Task 15)
src/hooks/useViewport.ts              — boolean isDesktop via matchMedia
src/components/primitives/icons.tsx   — Icon map (SVGs)
src/components/primitives/BRLogo.tsx
src/components/primitives/PricePill.tsx
src/components/primitives/Chip.tsx
src/components/primitives/TierBadge.tsx
src/components/primitives/Avatar.tsx
src/components/primitives/Sparkline.tsx
src/components/primitives/MiniChart.tsx
src/components/primitives/ValidationBar.tsx
src/components/primitives/SentimentBar.tsx
src/components/primitives/VIPRing.tsx
src/components/mobile/MobileFeed.tsx
src/components/mobile/SwipeableCard.tsx
src/components/mobile/MarketCardContent.tsx
src/components/mobile/MobileMarket.tsx
src/components/mobile/MobileProfile.tsx
src/components/mobile/BottomNav.tsx
src/components/desktop/DesktopSidebar.tsx
src/components/desktop/DesktopRightRail.tsx
src/components/desktop/DesktopMarketCard.tsx
src/components/desktop/DesktopFeed.tsx
src/components/desktop/DesktopMarket.tsx
src/routes/FeedPage.tsx
src/routes/MarketPage.tsx
src/routes/ProfilePage.tsx
```

---

## Task 1: Scaffold Vite project + init git

**Files:**
- Create: `betsroll-app/package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/vite-env.d.ts`
- Create: empty `.git/` at `betsroll-app/`

- [ ] **Step 1.1: Create project directory and cd into it**

```bash
mkdir -p /Users/Kyrylo/Desktop/betrolls/betsroll-app
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
```

- [ ] **Step 1.2: Write package.json**

File: `betsroll-app/package.json`

```json
{
  "name": "betsroll-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.10",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.6.2",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 1.3: Write vite.config.ts**

File: `betsroll-app/vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173 },
});
```

- [ ] **Step 1.4: Write tsconfig.json and tsconfig.node.json**

File: `betsroll-app/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

File: `betsroll-app/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 1.5: Write index.html**

File: `betsroll-app/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
    <title>Betsroll</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 1.6: Write .gitignore**

File: `betsroll-app/.gitignore`

```
node_modules
dist
.DS_Store
*.log
.vite
.env
```

- [ ] **Step 1.7: Write src/main.tsx and src/vite-env.d.ts**

File: `betsroll-app/src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

File: `betsroll-app/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
```

- [ ] **Step 1.8: Write a minimal src/App.tsx placeholder**

File: `betsroll-app/src/App.tsx`

```tsx
export default function App() {
  return <div style={{ padding: 40, color: '#f2f3ff' }}>Betsroll — scaffolding…</div>;
}
```

- [ ] **Step 1.9: Install deps**

Run: `cd /Users/Kyrylo/Desktop/betrolls/betsroll-app && npm install`
Expected: installs react, vite, etc., no errors.

- [ ] **Step 1.10: Initialise git and make initial commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git init -b main
git add -A
git commit -m "chore: scaffold Vite + React + TS project"
```

- [ ] **Step 1.11: Verify dev server boots**

Run: `npm run dev -- --host 127.0.0.1` in background, then `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5173/` → expect `200`. Kill the server afterward.

---

## Task 2: Port global CSS (design tokens, keyframes, utilities)

**Files:**
- Create: `betsroll-app/src/styles/global.css`

**Source:** `Project/project/styles.css`

- [ ] **Step 2.1: Write global.css (full port)**

File: `betsroll-app/src/styles/global.css`

```css
:root {
  --bg-deep: #08080f;
  --bg: #0c0c16;
  --bg-1: #11121f;
  --bg-2: #181a2b;
  --bg-3: #23253a;
  --line: rgba(255, 255, 255, 0.07);
  --line-2: rgba(255, 255, 255, 0.12);
  --ink: #f2f3ff;
  --ink-2: #b5b7d4;
  --ink-3: #6e7196;
  --yes: #9ef01a;
  --yes-glow: rgba(158, 240, 26, 0.35);
  --no: #ff2e84;
  --no-glow: rgba(255, 46, 132, 0.30);
  --brand: #7c5cff;
  --brand-2: #4cc9ff;
  --gold: #ffc24c;
  --display: 'Space Grotesk', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
}

* { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; height: 100%; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--display);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; padding: 0; }
input { font-family: inherit; }

.noscroll::-webkit-scrollbar { display: none; }
.noscroll { scrollbar-width: none; }

.ring-dots {
  background-image: radial-gradient(circle, currentColor 1px, transparent 1.5px);
  background-size: 6px 6px;
}

.glow-yes { box-shadow: 0 0 0 1px rgba(158, 240, 26, 0.4), 0 10px 40px var(--yes-glow); }
.glow-no  { box-shadow: 0 0 0 1px rgba(255, 46, 132, 0.4), 0 10px 40px var(--no-glow); }
.glow-brand { box-shadow: 0 0 0 1px rgba(124, 92, 255, 0.45), 0 10px 40px rgba(124, 92, 255, 0.35); }

@keyframes roll {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.roll { animation: roll 12s linear infinite; }

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.pulse { animation: pulse-glow 2s ease-in-out infinite; }

@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.ticker-track { animation: ticker 40s linear infinite; }

.mono { font-family: var(--mono); font-variant-numeric: tabular-nums; }

.stamp {
  position: absolute;
  font-family: var(--display);
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 8px 16px;
  border: 3px solid;
  border-radius: 8px;
  font-size: 28px;
  transform: rotate(-12deg);
  opacity: 0;
  transition: opacity .12s ease;
  pointer-events: none;
}
.stamp.show { opacity: 1; }
.stamp-yes { color: var(--yes); border-color: var(--yes); top: 40px; left: 24px; }
.stamp-no  { color: var(--no); border-color: var(--no); top: 40px; right: 24px; transform: rotate(12deg); }

.gradient-text {
  background: linear-gradient(90deg, #7c5cff, #4cc9ff, #9ef01a);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}

.hr-dash {
  border: none;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  margin: 0;
}

/* Prevent text selection on swipe area */
.no-select { user-select: none; -webkit-user-select: none; }
```

- [ ] **Step 2.2: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add src/styles/global.css
git commit -m "feat(styles): port design tokens, keyframes, utilities"
```

---

## Task 3: Port mock data (markets + user seed)

**Files:**
- Create: `betsroll-app/src/data/markets.ts`, `betsroll-app/src/data/user.ts`

- [ ] **Step 3.1: Write src/data/markets.ts**

File: `betsroll-app/src/data/markets.ts`

```ts
export type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'King';

export type Creator = {
  name: string;
  handle: string;
  tier: TierName;
  av: string;
  rep: number;
  markets: number;
  vol: string;
};

export type MarketStatus = 'live' | 'validating';

export type Market = {
  id: string;
  q: string;
  cat: string;
  creator: Creator;
  time: string;
  yes: number;
  no: number;
  vol24: number;
  liq: number;
  status: MarketStatus;
  resolvesIn?: string;
  progress?: number;
  comments: number;
  spark: number[];
  bull: number;
};

export type Comment = {
  id: string;
  av: string;
  name: string;
  time: string;
  text: string;
  up: number;
  tier: TierName;
};

export const MARKETS: Market[] = [
  {
    id: 'm1',
    q: 'Will Bitcoin close above $120,000 by end of April?',
    cat: 'Crypto',
    creator: { name: 'macro_vlad', handle: '@macro_vlad', tier: 'Gold', av: 'MV', rep: 94, markets: 62, vol: '2.4M' },
    time: '2h',
    yes: 0.67, no: 0.33,
    vol24: 312400, liq: 840000,
    status: 'live',
    resolvesIn: '3d 4h',
    comments: 284, spark: [40, 42, 45, 44, 48, 52, 55, 58, 61, 60, 64, 67],
    bull: 71,
  },
  {
    id: 'm2',
    q: 'Does the ECB cut rates by 50bps at its next meeting?',
    cat: 'Finance',
    creator: { name: 'euroHawk', handle: '@euroHawk', tier: 'Platinum', av: 'EH', rep: 88, markets: 41, vol: '1.8M' },
    time: '6h',
    yes: 0.24, no: 0.76,
    vol24: 128000, liq: 420000,
    status: 'validating', progress: 72,
    comments: 96, spark: [30, 28, 32, 27, 25, 24, 22, 24, 26, 25, 24, 24],
    bull: 28,
  },
  {
    id: 'm3',
    q: 'Will Lakers win the NBA Championship this season?',
    cat: 'Sports',
    creator: { name: 'courtSide', handle: '@courtSide', tier: 'Silver', av: 'CS', rep: 76, markets: 18, vol: '420K' },
    time: '18m',
    yes: 0.12, no: 0.88,
    vol24: 84000, liq: 210000,
    status: 'validating', progress: 34,
    comments: 412, spark: [18, 16, 15, 13, 14, 13, 12, 11, 13, 12, 11, 12],
    bull: 19,
  },
  {
    id: 'm4',
    q: 'Does Apple ship a foldable iPhone before December 2026?',
    cat: 'Tech',
    creator: { name: 'circuit.eth', handle: '@circuit', tier: 'King', av: 'CE', rep: 99, markets: 128, vol: '8.1M' },
    time: '1d',
    yes: 0.41, no: 0.59,
    vol24: 540000, liq: 1240000,
    status: 'live',
    resolvesIn: '243d',
    comments: 1204, spark: [38, 40, 43, 41, 39, 42, 44, 42, 40, 41, 42, 41],
    bull: 44,
  },
  {
    id: 'm5',
    q: '$PEPE hits a new ATH this month?',
    cat: 'Meme',
    creator: { name: 'ribbit', handle: '@ribbit', tier: 'Bronze', av: 'RB', rep: 61, markets: 9, vol: '92K' },
    time: '4h',
    yes: 0.58, no: 0.42,
    vol24: 48000, liq: 110000,
    status: 'validating', progress: 88,
    comments: 67, spark: [52, 54, 51, 56, 58, 55, 60, 61, 58, 57, 58, 58],
    bull: 62,
  },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', av: 'QA', name: '@quantjoy', time: '12m', text: "CME futures repricing hard after the CPI print. 67c feels rich — I still like YES to $120k but only above 70c you're overpaying.", up: 42, tier: 'Gold' },
  { id: 'c2', av: 'DK', name: '@dexking', time: '34m', text: 'Whale wallet just moved 4k BTC off Coinbase. Hmm.', up: 18, tier: 'Silver' },
  { id: 'c3', av: 'SW', name: '@softwire', time: '1h', text: 'Resolving via Chainlink oracle — so no resolution drama. Rolling 2k YES.', up: 11, tier: 'Platinum' },
];
```

- [ ] **Step 3.2: Write src/data/user.ts**

File: `betsroll-app/src/data/user.ts`

```ts
import type { TierName } from './markets';

export type MeProfile = {
  handle: string;
  bio: string;
  tier: TierName;
  winRate: number;
  marketsCreated: number;
  resolved: number;
  creatorEarnings: number;
  pnlLife: number;
  nextTier: TierName;
};

export const ME: MeProfile = {
  handle: '@macro_vlad',
  bio: 'Macro degen · 62 markets created · based in EU',
  tier: 'Gold',
  winRate: 0.634,
  marketsCreated: 62,
  resolved: 41,
  creatorEarnings: 614.80,
  pnlLife: 9840.22,
  nextTier: 'Platinum',
};

export const CREATED = [
  { q: 'Will BTC close above $120k by end of April?', status: 'Live', vol: 312400, fees: 156.20 },
  { q: 'Does the ECB cut rates 50bps?', status: 'Validating', vol: 128000, fees: 0 },
  { q: 'Nvidia beats Q2 earnings by >10%?', status: 'Resolved', vol: 640000, fees: 320.00, result: 'YES' },
  { q: 'Is there a government shutdown before June?', status: 'Draft', vol: 0, fees: 0 },
];

export const SEED_POSITIONS = [
  { id: 'p1', marketId: 'm2', q: 'Does the ECB cut rates 50bps?', side: 'NO' as const, size: 1200, entry: 0.71, cur: 0.76, pnl: 60.0, eta: '6d', createdAt: Date.now() - 86400000 },
  { id: 'p2', marketId: 'm0', q: 'Taylor Swift announces tour before May?', side: 'YES' as const, size: 400, entry: 0.42, cur: 0.31, pnl: -44.0, eta: '12d', createdAt: Date.now() - 172800000 },
];

export const SEED_HISTORY = [
  { id: 'h1', kind: 'tier' as const, icon: '⬆', txt: 'Reached VIP tier: Gold', v: '+240pts', time: '6h' },
  { id: 'h2', kind: 'market' as const, icon: '✓', txt: 'Market resolved: "Nvidia earnings" → YES', v: '+$320.00 fees', time: '2d' },
];
```

- [ ] **Step 3.3: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add src/data
git commit -m "feat(data): seed markets, comments, user profile"
```

---

## Task 4: Build state store (localStorage-persisted singleton)

**Files:**
- Create: `betsroll-app/src/state/useStore.ts`

- [ ] **Step 4.1: Write useStore.ts**

File: `betsroll-app/src/state/useStore.ts`

```ts
import { useSyncExternalStore } from 'react';
import type { TierName } from '../data/markets';
import { SEED_POSITIONS, SEED_HISTORY } from '../data/user';

export type Vote = 'yes' | 'no';
export type Side = 'YES' | 'NO';

export type Position = {
  id: string;
  marketId: string;
  q: string;
  side: Side;
  size: number;
  entry: number;
  cur: number;
  pnl: number;
  eta: string;
  createdAt: number;
};

export type HistoryEntry = {
  id: string;
  kind: 'trade' | 'market' | 'tier';
  icon: string;
  txt: string;
  v?: string;
  time: string;
};

export type Store = {
  balance: number;
  freebet: number;
  votes: Record<string, Vote>;
  validationBoost: Record<string, number>;
  positions: Position[];
  history: HistoryEntry[];
  vipPts: number;
  tier: TierName;
};

const STORAGE_KEY = 'betsroll_v1';

const INITIAL: Store = {
  balance: 4820.56,
  freebet: 5.0,
  votes: {},
  validationBoost: {},
  positions: SEED_POSITIONS,
  history: SEED_HISTORY,
  vipPts: 6160,
  tier: 'Gold',
};

function loadInitial(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw);
    return { ...INITIAL, ...parsed };
  } catch {
    return INITIAL;
  }
}

let state: Store = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('betsroll: persist failed', e); }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() { return state; }

export function useStore<T = Store>(selector: (s: Store) => T = (s) => s as unknown as T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export function tierFromPts(pts: number): TierName {
  if (pts >= 15000) return 'King';
  if (pts >= 6000) return 'Platinum';
  if (pts >= 3000) return 'Gold';
  if (pts >= 1000) return 'Silver';
  return 'Bronze';
}

export function pointsToNextTier(pts: number): { next: TierName; remaining: number; progress: number } {
  const tiers: [TierName, number][] = [
    ['Bronze', 0], ['Silver', 1000], ['Gold', 3000], ['Platinum', 6000], ['King', 15000],
  ];
  const cur = tierFromPts(pts);
  const curIdx = tiers.findIndex(([t]) => t === cur);
  if (curIdx === tiers.length - 1) return { next: 'King', remaining: 0, progress: 1 };
  const [, curThresh] = tiers[curIdx];
  const [nextTier, nextThresh] = tiers[curIdx + 1];
  const span = nextThresh - curThresh;
  const done = pts - curThresh;
  return { next: nextTier, remaining: Math.max(0, nextThresh - pts), progress: Math.min(1, done / span) };
}

// ---- Actions ----

export const actions = {
  voteMarket(marketId: string, vote: Vote) {
    if (state.votes[marketId]) return;
    const votes = { ...state.votes, [marketId]: vote };
    let { validationBoost, vipPts, tier, history } = state;
    if (vote === 'yes') {
      validationBoost = { ...validationBoost, [marketId]: (validationBoost[marketId] ?? 0) + 4 };
      vipPts = vipPts + 4;
      const prevTier = tier;
      tier = tierFromPts(vipPts);
      if (tier !== prevTier) {
        history = [{ id: `h-${Date.now()}`, kind: 'tier', icon: '⬆', txt: `Reached VIP tier: ${tier}`, v: '+tier', time: 'now' }, ...history];
      }
    }
    state = { ...state, votes, validationBoost, vipPts, tier, history };
    emit();
  },

  rollBet(args: { marketId: string; q: string; side: Side; amount: number; price: number; eta: string }) {
    const { marketId, q, side, amount, price, eta } = args;
    if (amount <= 0) return { ok: false, reason: 'amount' };
    if (amount > state.balance + state.freebet) return { ok: false, reason: 'balance' };

    let freebet = state.freebet;
    let balance = state.balance;
    if (freebet > 0) {
      const used = Math.min(freebet, amount);
      freebet -= used;
      balance -= Math.max(0, amount - used);
    } else {
      balance -= amount;
    }

    const position: Position = {
      id: `p-${Date.now()}`,
      marketId, q, side, size: amount,
      entry: price, cur: price, pnl: 0,
      eta, createdAt: Date.now(),
    };

    const history: HistoryEntry = {
      id: `h-${Date.now()}`,
      kind: 'trade',
      icon: side === 'YES' ? '↗' : '↘',
      txt: `Bought ${amount} ${side} on "${q.slice(0, 40)}${q.length > 40 ? '…' : ''}"`,
      v: `-$${amount.toFixed(2)}`,
      time: 'now',
    };

    const addedPts = Math.round(10 * (amount / 25));
    const prevTier = state.tier;
    const vipPts = state.vipPts + addedPts;
    const tier = tierFromPts(vipPts);

    let hist = [history, ...state.history];
    if (tier !== prevTier) {
      hist = [{ id: `h-${Date.now() + 1}`, kind: 'tier', icon: '⬆', txt: `Reached VIP tier: ${tier}`, v: '+tier', time: 'now' }, ...hist];
    }

    state = {
      ...state,
      balance, freebet,
      positions: [position, ...state.positions],
      history: hist,
      vipPts, tier,
    };
    emit();
    return { ok: true };
  },

  reset() {
    state = { ...INITIAL, positions: SEED_POSITIONS, history: SEED_HISTORY };
    emit();
  },
};
```

- [ ] **Step 4.2: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add src/state
git commit -m "feat(state): localStorage-persisted store with voteMarket/rollBet/reset"
```

---

## Task 5: Viewport hook + App shell with routes

**Files:**
- Create: `betsroll-app/src/hooks/useViewport.ts`, replace `src/App.tsx` contents
- Create: stub pages at `src/routes/FeedPage.tsx`, `src/routes/MarketPage.tsx`, `src/routes/ProfilePage.tsx`

- [ ] **Step 5.1: Write useViewport.ts**

File: `betsroll-app/src/hooks/useViewport.ts`

```ts
import { useEffect, useState } from 'react';

export function useViewport() {
  const [isDesktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}
```

- [ ] **Step 5.2: Write stub route pages**

File: `betsroll-app/src/routes/FeedPage.tsx`

```tsx
export default function FeedPage() {
  return <div style={{ padding: 40 }}>Feed (stub)</div>;
}
```

File: `betsroll-app/src/routes/MarketPage.tsx`

```tsx
import { useParams } from 'react-router-dom';

export default function MarketPage() {
  const { id } = useParams();
  return <div style={{ padding: 40 }}>Market (stub) — id: {id}</div>;
}
```

File: `betsroll-app/src/routes/ProfilePage.tsx`

```tsx
export default function ProfilePage() {
  return <div style={{ padding: 40 }}>Profile (stub)</div>;
}
```

- [ ] **Step 5.3: Replace App.tsx with real Routes**

File: `betsroll-app/src/App.tsx`

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from './routes/FeedPage';
import MarketPage from './routes/MarketPage';
import ProfilePage from './routes/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/market/:id" element={<MarketPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

- [ ] **Step 5.4: Run dev, smoke-test routes**

Run: `npm run dev -- --host 127.0.0.1` in background. Then `curl -s http://127.0.0.1:5173/ | grep -q root && echo OK`.
Manual verify: open `http://127.0.0.1:5173/#/`, `#/market/m1`, `#/profile`. Each shows stub text. Kill server.

- [ ] **Step 5.5: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit -m "feat(shell): router + viewport hook + stub pages"
```

---

## Task 6: Port icon primitives

**Files:**
- Create: `betsroll-app/src/components/primitives/icons.tsx`

- [ ] **Step 6.1: Write icons.tsx**

File: `betsroll-app/src/components/primitives/icons.tsx`

```tsx
type IconFn = (s?: number, c?: string) => JSX.Element;

export const Icon: Record<string, IconFn> = {
  search: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bell: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 004 0" stroke={c} strokeWidth="2" />
    </svg>
  ),
  chat: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v11H9l-5 4V5z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  share: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M12 3l-4 4M12 3l4 4M4 14v5h16v-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bookmark: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12v18l-6-4-6 4V3z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  back: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  close: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6l-12 12" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  check: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5 9-11" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  crown: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5L3 8z" />
    </svg>
  ),
  die: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke={c} strokeWidth="2" />
      <circle cx="8" cy="8" r="1.5" fill={c} />
      <circle cx="16" cy="16" r="1.5" fill={c} />
      <circle cx="16" cy="8" r="1.5" fill={c} />
      <circle cx="8" cy="16" r="1.5" fill={c} />
    </svg>
  ),
};
```

- [ ] **Step 6.2: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add src/components/primitives/icons.tsx
git commit -m "feat(primitives): icon set"
```

---

## Task 7: Port display primitives (Logo, Avatar, Chip, Badge, etc.)

**Files:**
- Create: `BRLogo.tsx`, `Avatar.tsx`, `Chip.tsx`, `TierBadge.tsx`, `PricePill.tsx`, `Sparkline.tsx`, `MiniChart.tsx`, `ValidationBar.tsx`, `SentimentBar.tsx`, `VIPRing.tsx` (all under `src/components/primitives/`)

- [ ] **Step 7.1: BRLogo.tsx**

File: `betsroll-app/src/components/primitives/BRLogo.tsx`

```tsx
type Props = { size?: number; spin?: boolean };

export function BRLogo({ size = 32, spin = false }: Props) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #9d7dff 0%, #4a2ed1 60%, #1a0f5e 100%)',
      position: 'relative',
      boxShadow: '0 0 20px rgba(124,92,255,0.5), inset 0 0 0 1.5px rgba(255,255,255,0.3)',
      flexShrink: 0,
    }}>
      <div className={spin ? 'roll' : ''} style={{
        position: 'absolute', inset: 3, borderRadius: '50%',
        border: '1.5px dashed rgba(255,255,255,0.4)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'var(--display)', fontWeight: 700,
        fontSize: size * 0.42, letterSpacing: -0.5,
      }}>B</div>
    </div>
  );
}
```

- [ ] **Step 7.2: Avatar.tsx**

File: `betsroll-app/src/components/primitives/Avatar.tsx`

```tsx
type Props = { name?: string; size?: number; ring?: string | null };

const PALETTE: [string, string][] = [
  ['#7c5cff', '#4cc9ff'],
  ['#9ef01a', '#4cc9ff'],
  ['#ff2e84', '#ffc24c'],
  ['#4cc9ff', '#9ef01a'],
  ['#ffc24c', '#ff2e84'],
];

export function Avatar({ name = 'NB', size = 32, ring = null }: Props) {
  const seed = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
  const [a, b] = PALETTE[seed % PALETTE.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#0a0a15', fontWeight: 700, fontSize: size * 0.38,
      fontFamily: 'var(--display)',
      boxShadow: ring ? `0 0 0 2px var(--bg), 0 0 0 4px ${ring}` : 'none',
      flexShrink: 0,
    }}>{name.slice(0, 2).toUpperCase()}</div>
  );
}
```

- [ ] **Step 7.3: Chip.tsx**

File: `betsroll-app/src/components/primitives/Chip.tsx`

```tsx
import type { ReactNode } from 'react';

type Tone = 'default' | 'brand' | 'live' | 'gold';
type Props = { label: string; icon?: ReactNode; tone?: Tone };

const TONES: Record<Tone, { bg: string; fg: string; bd: string }> = {
  default: { bg: 'rgba(255,255,255,0.05)', fg: '#b5b7d4', bd: 'rgba(255,255,255,0.08)' },
  brand:   { bg: 'rgba(124,92,255,0.12)', fg: '#a794ff', bd: 'rgba(124,92,255,0.3)' },
  live:    { bg: 'rgba(158,240,26,0.12)', fg: 'var(--yes)', bd: 'rgba(158,240,26,0.3)' },
  gold:    { bg: 'rgba(255,194,76,0.12)', fg: 'var(--gold)', bd: 'rgba(255,194,76,0.3)' },
};

export function Chip({ label, icon, tone = 'default' }: Props) {
  const t = TONES[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
      fontFamily: 'var(--display)',
    }}>{icon}{label}</span>
  );
}
```

- [ ] **Step 7.4: TierBadge.tsx**

File: `betsroll-app/src/components/primitives/TierBadge.tsx`

```tsx
import { Icon } from './icons';
import type { TierName } from '../../data/markets';

type Props = { tier?: TierName; size?: 'sm' | 'lg' };

const MAP: Record<TierName, [string, string]> = {
  Bronze: ['#cd7f32', '#8b5722'],
  Silver: ['#d7d9e0', '#8a8c95'],
  Gold:   ['#ffd86b', '#b8891a'],
  Platinum: ['#b8e6ff', '#4c7a94'],
  King:   ['#ff6bff', '#6b2a9b'],
};

export function TierBadge({ tier = 'Gold', size = 'sm' }: Props) {
  const [a, b] = MAP[tier];
  const h = size === 'sm' ? 22 : 32;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '0 8px' : '0 12px',
      height: h, borderRadius: h / 2,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      color: '#0a0a15', fontWeight: 700, fontSize: size === 'sm' ? 10 : 13,
      letterSpacing: 0.4, textTransform: 'uppercase',
      boxShadow: `0 2px 12px ${a}40`,
      fontFamily: 'var(--display)',
    }}>
      {Icon.crown(size === 'sm' ? 10 : 12, '#0a0a15')}{tier}
    </span>
  );
}
```

- [ ] **Step 7.5: PricePill.tsx**

File: `betsroll-app/src/components/primitives/PricePill.tsx`

```tsx
type Props = { side?: 'yes' | 'no'; price?: number; compact?: boolean };

export function PricePill({ side = 'yes', price = 0.5, compact = false }: Props) {
  const isYes = side === 'yes';
  const color = isYes ? 'var(--yes)' : 'var(--no)';
  const pct = Math.round(price * 100);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: compact ? '6px 10px' : '10px 14px',
      borderRadius: 10,
      background: isYes ? 'rgba(158,240,26,0.08)' : 'rgba(255,46,132,0.08)',
      border: `1px solid ${isYes ? 'rgba(158,240,26,0.25)' : 'rgba(255,46,132,0.25)'}`,
    }}>
      <span style={{
        fontFamily: 'var(--display)', fontWeight: 700,
        fontSize: compact ? 11 : 12, letterSpacing: 0.1, color,
      }}>{isYes ? 'YES' : 'NO'}</span>
      <span className="mono" style={{ color, fontWeight: 700, fontSize: compact ? 13 : 15 }}>
        {pct}¢
      </span>
    </div>
  );
}
```

- [ ] **Step 7.6: Sparkline.tsx**

File: `betsroll-app/src/components/primitives/Sparkline.tsx`

```tsx
type Props = { data: number[]; color?: string; width?: number; height?: number };

export function Sparkline({ data, color = 'var(--yes)', width = 100, height = 32 }: Props) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height,
  ]);
  const d = 'M ' + pts.map((p) => p.join(',')).join(' L ');
  const area = d + ` L ${width},${height} L 0,${height} Z`;
  const gid = `spark-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
```

- [ ] **Step 7.7: MiniChart.tsx**

File: `betsroll-app/src/components/primitives/MiniChart.tsx`

```tsx
type Props = { data: number[]; color?: string; width?: number; height?: number };

export function MiniChart({ data, color = 'var(--yes)', width = 340, height = 140 }: Props) {
  const pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (width - pad * 2),
    pad + (1 - (v - min) / range) * (height - pad * 2),
  ]);
  const d = 'M ' + pts.map((p) => p.join(',')).join(' L ');
  const area = d + ` L ${width - pad},${height - pad} L ${pad},${height - pad} Z`;
  const last = pts[pts.length - 1];
  const marker = pts[6] ?? pts[0];
  const gid = `mc-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={pad} x2={width - pad} y1={pad + p * (height - pad * 2)} y2={pad + p * (height - pad * 2)} stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="8" fill={color} opacity="0.2" />
      <g transform={`translate(${marker[0]},${marker[1]})`}>
        <circle r="3" fill="#7c5cff" />
        <line x1="0" y1="0" x2="0" y2="-22" stroke="rgba(124,92,255,0.5)" strokeDasharray="2 3" />
        <rect x="-42" y="-38" width="84" height="16" rx="4" fill="rgba(124,92,255,0.15)" stroke="rgba(124,92,255,0.4)" />
        <text x="0" y="-26" fill="#a794ff" textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fontWeight="700">CPI print +4.2%</text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 7.8: ValidationBar.tsx**

File: `betsroll-app/src/components/primitives/ValidationBar.tsx`

```tsx
type Props = { pct?: number };

export function ValidationBar({ pct = 0 }: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${clamped}%`,
          background: 'linear-gradient(90deg, #7c5cff 0%, #4cc9ff 60%, #9ef01a 100%)',
          borderRadius: 3,
          boxShadow: '0 0 12px rgba(124,92,255,0.6)',
        }} />
      </div>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 600 }}>
        {clamped}%
      </span>
    </div>
  );
}
```

- [ ] **Step 7.9: SentimentBar.tsx**

File: `betsroll-app/src/components/primitives/SentimentBar.tsx`

```tsx
type Props = { bull?: number };

export function SentimentBar({ bull = 50 }: Props) {
  const bear = 100 - bull;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)', boxShadow: '0 0 8px var(--yes)', flexShrink: 0 }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--yes)', fontWeight: 700 }}>{bull}% BULL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--no)', fontWeight: 700 }}>{bear}% BEAR</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--no)', boxShadow: '0 0 8px var(--no)', flexShrink: 0 }} />
        </div>
      </div>
      <div style={{
        height: 8, borderRadius: 4, overflow: 'hidden',
        background: 'rgba(255,255,255,0.06)', display: 'flex',
      }}>
        <div style={{ width: `${bull}%`, background: 'linear-gradient(90deg, var(--yes), rgba(158,240,26,0.4))' }} />
        <div style={{ width: `${bear}%`, background: 'linear-gradient(90deg, rgba(255,46,132,0.4), var(--no))' }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 7.10: VIPRing.tsx**

File: `betsroll-app/src/components/primitives/VIPRing.tsx`

```tsx
import type { TierName } from '../../data/markets';

type Props = { tier?: TierName; progress?: number };

const COLOR: Record<TierName, string> = {
  Bronze: '#cd7f32',
  Silver: '#d7d9e0',
  Gold: '#ffd86b',
  Platinum: '#b8e6ff',
  King: '#ff6bff',
};

export function VIPRing({ tier = 'Gold', progress = 0.5 }: Props) {
  const color = COLOR[tier];
  const r = 44, c = 2 * Math.PI * r, off = c * (1 - progress);
  return (
    <svg width="104" height="104" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="52" cy="52" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
      <circle cx="52" cy="52" r={r} stroke={color} strokeWidth="3" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
    </svg>
  );
}
```

- [ ] **Step 7.11: Verify compile**

Run: `cd /Users/Kyrylo/Desktop/betrolls/betsroll-app && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7.12: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add src/components/primitives
git commit -m "feat(primitives): Logo, Avatar, Chip, TierBadge, PricePill, Spark/Mini chart, Validation/Sentiment bar, VIPRing"
```

---

## Task 8: Mobile Feed — SwipeableCard, MarketCardContent, BottomNav, MobileFeed

**Files:**
- Create: `src/components/mobile/MarketCardContent.tsx`, `SwipeableCard.tsx`, `BottomNav.tsx`, `MobileFeed.tsx`

- [ ] **Step 8.1: BottomNav.tsx**

File: `betsroll-app/src/components/mobile/BottomNav.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { Icon } from '../primitives/icons';

type Props = { active: 'feed' | 'markets' | 'trade' | 'profile' };

export function BottomNav({ active }: Props) {
  const nav = useNavigate();
  const tabs: Array<{ id: Props['active']; label: string; path: string; icon: JSX.Element }> = [
    { id: 'feed', label: 'Feed', path: '/', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-9 9 9v9H3z" stroke="currentColor" strokeWidth="1.8" /><path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" /></svg>
    )},
    { id: 'markets', label: 'Markets', path: '/', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17l5-5 4 4 8-8M21 8v-3h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    )},
    { id: 'trade', label: 'Trade', path: '/', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 8h16M4 8l4-4M4 8l4 4M20 16H4M20 16l-4-4M20 16l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    )},
    { id: 'profile', label: 'Profile', path: '/profile', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    )},
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 84, paddingBottom: 24, paddingTop: 6,
      background: 'linear-gradient(180deg, rgba(12,12,22,0) 0%, rgba(12,12,22,0.98) 30%)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', zIndex: 30,
      backdropFilter: 'blur(8px)',
    }}>
      {tabs.slice(0, 2).map((t) => (
        <button key={t.id} onClick={() => nav(t.path)} style={{
          flex: 1, paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: active === t.id ? 'var(--ink)' : 'var(--ink-3)',
        }}>
          {t.icon}
          <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
        </button>
      ))}
      <button style={{
        position: 'relative', top: -20, width: 56, height: 56, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #9d7dff, #4a2ed1)',
        boxShadow: '0 0 0 4px rgba(12,12,22,1), 0 10px 30px rgba(124,92,255,0.5)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.plus(22, '#fff')}</button>
      {tabs.slice(2).map((t) => (
        <button key={t.id} onClick={() => nav(t.path)} style={{
          flex: 1, paddingTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: active === t.id ? 'var(--ink)' : 'var(--ink-3)',
        }}>
          {t.icon}
          <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 8.2: MarketCardContent.tsx**

File: `betsroll-app/src/components/mobile/MarketCardContent.tsx`

```tsx
import type { Market } from '../../data/markets';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { Sparkline } from '../primitives/Sparkline';
import { ValidationBar } from '../primitives/ValidationBar';

type Props = { m: Market; onOpen: () => void; liveProgress: number };

export function MarketCardContent({ m, onOpen, liveProgress }: Props) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={m.creator.av} size={34} ring={m.creator.tier === 'King' ? '#ff6bff' : m.creator.tier === 'Gold' ? 'var(--gold)' : null} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{m.creator.handle}</span>
            <span style={{ color: 'var(--gold)' }}>{Icon.crown(10, 'var(--gold)')}</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>· {m.time}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            <span className="mono">{m.creator.rep}</span> rep · {m.creator.markets} markets
          </div>
        </div>
        <Chip label={m.cat} tone="brand" />
      </div>

      <div style={{
        fontFamily: 'var(--display)', fontWeight: 600,
        fontSize: 22, lineHeight: 1.15, color: 'var(--ink)',
        letterSpacing: -0.5,
      }}>{m.q}</div>

      {m.status === 'live' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: 'var(--yes)', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)', boxShadow: '0 0 8px var(--yes)' }} />LIVE
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· resolves in</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 600 }}>{m.resolvesIn}</span>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginBottom: 4, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600 }}>
            Validating · <span style={{ color: 'var(--ink-2)' }}>{liveProgress}% to go live</span>
          </div>
          <ValidationBar pct={liveProgress} />
        </div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center',
        padding: '10px 12px', background: 'rgba(255,255,255,0.025)',
        border: '1px solid var(--line)', borderRadius: 12,
      }}>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
          <div className="mono" style={{ color: 'var(--yes)', fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{Math.round(m.yes * 100)}¢</div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
          <div className="mono" style={{ color: 'var(--no)', fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{Math.round(m.no * 100)}¢</div>
        </div>
        <Sparkline data={m.spark} color={m.bull > 50 ? 'var(--yes)' : 'var(--no)'} width={72} height={32} />
      </div>

      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--ink-3)' }}>
        <div><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${(m.vol24 / 1000).toFixed(0)}k</span> 24h vol</div>
        <div><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${(m.liq / 1000).toFixed(0)}k</span> liq</div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onOpen} style={{
          flex: 1, height: 44, borderRadius: 12,
          background: 'linear-gradient(180deg, rgba(158,240,26,0.2), rgba(158,240,26,0.08))',
          border: '1px solid rgba(158,240,26,0.4)',
          color: 'var(--yes)', fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
          fontFamily: 'var(--display)',
        }}>
          <span style={{ fontSize: 11, opacity: 0.7, marginRight: 6 }}>BUY</span>YES · {Math.round(m.yes * 100)}¢
        </button>
        <button onClick={onOpen} style={{
          flex: 1, height: 44, borderRadius: 12,
          background: 'linear-gradient(180deg, rgba(255,46,132,0.2), rgba(255,46,132,0.08))',
          border: '1px solid rgba(255,46,132,0.4)',
          color: 'var(--no)', fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
          fontFamily: 'var(--display)',
        }}>
          <span style={{ fontSize: 11, opacity: 0.7, marginRight: 6 }}>BUY</span>NO · {Math.round(m.no * 100)}¢
        </button>
      </div>

      <div style={{ display: 'flex', gap: 18, justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-3)', paddingTop: 2 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', fontSize: 12 }}>
          {Icon.chat(15)}<span className="mono" style={{ fontWeight: 600 }}>{m.comments}</span>
        </button>
        <button style={{ color: 'var(--ink-3)' }}>{Icon.share(15)}</button>
        <button style={{ color: 'var(--ink-3)' }}>{Icon.bookmark(15)}</button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--ink-3)' }}>
          <span>swipe to vote</span>
          <span style={{ color: 'var(--no)', fontSize: 12 }}>←</span>
          <span style={{ color: 'var(--yes)', fontSize: 12 }}>→</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8.3: SwipeableCard.tsx**

File: `betsroll-app/src/components/mobile/SwipeableCard.tsx`

```tsx
import { useRef, useState } from 'react';
import type { Market } from '../../data/markets';
import { MarketCardContent } from './MarketCardContent';

type Props = {
  m: Market;
  liveProgress: number;
  onOpen: () => void;
  onSwipe: (dir: 'yes' | 'no') => void;
  z: number;
  offset: number;
};

export function SwipeableCard({ m, liveProgress, onOpen, onSwipe, z, offset }: Props) {
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    startX.current = e.clientX;
  };
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDrag(e.clientX - startX.current);
  };
  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (drag > 90) {
      setDrag(500);
      setTimeout(() => onSwipe('yes'), 180);
    } else if (drag < -90) {
      setDrag(-500);
      setTimeout(() => onSwipe('no'), 180);
    } else {
      setDrag(0);
    }
  };

  const rot = drag / 20;
  const showYes = drag > 40;
  const showNo = drag < -40;

  return (
    <div
      className="no-select"
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      style={{
        position: 'absolute', inset: 0,
        transform: `translate(${drag}px, ${offset}px) rotate(${rot}deg) scale(${1 - offset / 300})`,
        transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(.2,.9,.3,1.2)',
        zIndex: z,
        borderRadius: 24,
        background: 'linear-gradient(180deg, var(--bg-1) 0%, var(--bg) 100%)',
        border: `1px solid ${showYes ? 'rgba(158,240,26,0.5)' : showNo ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`,
        boxShadow: showYes
          ? '0 20px 60px rgba(158,240,26,0.2)'
          : showNo
            ? '0 20px 60px rgba(255,46,132,0.2)'
            : '0 20px 60px rgba(0,0,0,0.5)',
        cursor: dragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        touchAction: 'pan-y',
      }}
    >
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.15)',
        pointerEvents: 'none',
      }} />
      <MarketCardContent m={m} onOpen={onOpen} liveProgress={liveProgress} />
      <div className={`stamp stamp-yes ${showYes ? 'show' : ''}`}>APPROVE</div>
      <div className={`stamp stamp-no ${showNo ? 'show' : ''}`}>SKIP</div>
    </div>
  );
}
```

- [ ] **Step 8.4: MobileFeed.tsx**

File: `betsroll-app/src/components/mobile/MobileFeed.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETS } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { BRLogo } from '../primitives/BRLogo';
import { Icon } from '../primitives/icons';
import { SwipeableCard } from './SwipeableCard';

export function MobileFeed() {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState<null | 'yes' | 'no'>(null);
  const [tab, setTab] = useState<'Top' | 'New' | 'Following'>('Top');
  const boosts = useStore((s) => s.validationBoost);

  const visible = MARKETS.slice(idx, idx + 3);

  const doSwipe = (dir: 'yes' | 'no') => {
    const m = MARKETS[idx];
    if (!m) return;
    actions.voteMarket(m.id, dir);
    setFlash(dir);
    setTimeout(() => setFlash(null), 600);
    setIdx((i) => Math.min(i + 1, MARKETS.length));
  };

  const liveProgress = (m: (typeof MARKETS)[number]) =>
    Math.min(100, (m.progress ?? 100) + (boosts[m.id] ?? 0));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', paddingBottom: 100 }}>
      <div style={{
        padding: '12px 16px 10px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--line)',
        background: 'rgba(12,12,22,0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <BRLogo size={32} spin />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Betsroll</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, marginTop: -1 }}>Roll the future</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.search(16)}</button>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {Icon.bell(16)}
          <span style={{ position: 'absolute', top: 8, right: 9, width: 6, height: 6, borderRadius: '50%', background: 'var(--no)' }} />
        </button>
      </div>

      <div style={{ padding: '10px 16px 4px', display: 'flex', gap: 6 }}>
        {(['Top', 'New', 'Following'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, height: 34, borderRadius: 10,
            background: tab === t ? 'var(--bg-2)' : 'transparent',
            border: tab === t ? '1px solid var(--line)' : '1px solid transparent',
            color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
            fontSize: 12.5, fontWeight: 600, letterSpacing: 0.2,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, position: 'relative', padding: '12px 14px 0' }}>
        <div style={{ position: 'relative', width: '100%', height: 520 }}>
          {idx >= MARKETS.length ? (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              background: 'var(--bg-1)', border: '1px dashed var(--line)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center',
            }}>
              <BRLogo size={56} />
              <div style={{ fontSize: 18, fontWeight: 600 }}>All caught up</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 240 }}>Fresh rolls drop every hour.</div>
              <button onClick={() => setIdx(0)} style={{
                marginTop: 8, padding: '10px 18px', borderRadius: 12,
                background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)',
                color: '#fff', fontWeight: 600, fontSize: 13,
              }}>Roll again</button>
            </div>
          ) : visible.map((m, i) => (
            <SwipeableCard
              key={m.id}
              m={m}
              liveProgress={liveProgress(m)}
              onOpen={() => nav(`/market/${m.id}`)}
              onSwipe={doSwipe}
              z={10 - i}
              offset={i * 8}
            />
          ))}
        </div>

        {idx < MARKETS.length && (
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', padding: '16px 0 14px' }}>
            <button onClick={() => doSwipe('no')} style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,46,132,0.2), rgba(255,46,132,0.05))',
              border: '1.5px solid rgba(255,46,132,0.5)',
              color: 'var(--no)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.close(22)}</button>
            <button onClick={() => nav(`/market/${MARKETS[idx].id}`)} style={{
              width: 44, height: 44, borderRadius: '50%', alignSelf: 'center',
              background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--ink-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.die(18)}</button>
            <button onClick={() => doSwipe('yes')} style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(158,240,26,0.25), rgba(158,240,26,0.05))',
              border: '1.5px solid rgba(158,240,26,0.5)',
              color: 'var(--yes)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.check(24)}</button>
          </div>
        )}
      </div>

      {flash && (
        <div style={{
          position: 'fixed', top: '45%', left: '50%', transform: 'translate(-50%,-50%)',
          padding: '10px 22px', borderRadius: 14,
          background: flash === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)',
          border: `1px solid ${flash === 'yes' ? 'rgba(158,240,26,0.5)' : 'rgba(255,46,132,0.5)'}`,
          color: flash === 'yes' ? 'var(--yes)' : 'var(--no)',
          fontWeight: 700, letterSpacing: 0.6,
          fontSize: 12, pointerEvents: 'none', zIndex: 100,
        }}>
          {flash === 'yes' ? '✓ APPROVED · +4pts' : '✕ SKIPPED'}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8.5: Wire MobileFeed into FeedPage**

File: `betsroll-app/src/routes/FeedPage.tsx` (replace)

```tsx
import { useViewport } from '../hooks/useViewport';
import { MobileFeed } from '../components/mobile/MobileFeed';
import { BottomNav } from '../components/mobile/BottomNav';

export default function FeedPage() {
  const isDesktop = useViewport();
  if (isDesktop) return <div style={{ padding: 40 }}>Desktop Feed coming next task</div>;
  return (
    <>
      <MobileFeed />
      <BottomNav active="feed" />
    </>
  );
}
```

- [ ] **Step 8.6: Dev smoke**

Run: `cd /Users/Kyrylo/Desktop/betrolls/betsroll-app && npm run dev -- --host 127.0.0.1` in background.
Manual verify: open `http://127.0.0.1:5173/` in narrow window (<768px). Swipe cards right/left, see stamps. Tap center die → routes to `/market/m1` stub. Kill server.

- [ ] **Step 8.7: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit -m "feat(mobile-feed): swipe-to-vote stack, action bar, toast"
```

---

## Task 9: Mobile Market detail screen

**Files:**
- Create: `src/components/mobile/MobileMarket.tsx`
- Modify: `src/routes/MarketPage.tsx`

- [ ] **Step 9.1: MobileMarket.tsx**

File: `betsroll-app/src/components/mobile/MobileMarket.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMENTS, type Market } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { MiniChart } from '../primitives/MiniChart';
import { SentimentBar } from '../primitives/SentimentBar';
import { TierBadge } from '../primitives/TierBadge';

type Props = { m: Market };

export function MobileMarket({ m }: Props) {
  const nav = useNavigate();
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(25);
  const [view, setView] = useState<'chart' | 'depth' | 'trades'>('chart');
  const [csort, setCsort] = useState<'Top' | 'Latest'>('Top');
  const [toast, setToast] = useState<string | null>(null);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);

  const price = side === 'yes' ? m.yes : m.no;
  const color = side === 'yes' ? 'var(--yes)' : 'var(--no)';
  const payout = amount / price;
  const total = balance + freebet;
  const canRoll = amount > 0 && amount <= total;

  const roll = () => {
    const res = actions.rollBet({
      marketId: m.id,
      q: m.q,
      side: side === 'yes' ? 'YES' : 'NO',
      amount,
      price,
      eta: m.resolvesIn ?? 'TBD',
    });
    if (res.ok) {
      setToast(`🎲 Rolled $${amount} on ${side.toUpperCase()}`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 120 }} className="noscroll">
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(12,12,22,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={() => nav(-1)} style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.back(18)}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Market · {m.cat}</div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.q}</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.share(16)}</button>
      </div>

      <div style={{ padding: '18px 18px 12px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <Chip label={m.cat} tone="brand" />
          <Chip label={m.status === 'live' ? `LIVE · ${m.resolvesIn}` : `Validating ${m.progress ?? 0}%`} tone={m.status === 'live' ? 'live' : 'default'} />
          <Chip label="Chainlink oracle" />
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--display)', fontSize: 24, lineHeight: 1.1,
          fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.6,
        }}>{m.q}</h1>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-3)' }}>
          Resolves <span className="mono" style={{ color: 'var(--ink-2)' }}>Apr 30, 2026</span> · via Chainlink
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        <div style={{
          padding: 14, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--bg-1), var(--bg-2))',
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Avatar name={m.creator.av} size={44} ring="var(--gold)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{m.creator.handle}</span>
              <TierBadge tier={m.creator.tier} size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: 'var(--ink-3)' }}>
              <span><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{m.creator.markets}</span> markets</span>
              <span><span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>${m.creator.vol}</span> vol</span>
              <span><span className="mono" style={{ color: 'var(--yes)', fontWeight: 600 }}>{m.creator.rep}%</span> acc.</span>
            </div>
          </div>
          <button style={{
            padding: '8px 14px', borderRadius: 10,
            background: 'rgba(124,92,255,0.15)', border: '1px solid rgba(124,92,255,0.4)',
            color: '#a794ff', fontWeight: 600, fontSize: 12,
          }}>Follow</button>
        </div>
      </div>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: 14, background: 'rgba(158,240,26,0.05)', border: '1px solid rgba(158,240,26,0.25)' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
            <div className="mono" style={{ color: 'var(--yes)', fontSize: 26, fontWeight: 700, lineHeight: 1, margin: '6px 0 2px' }}>{Math.round(m.yes * 100)}¢</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--yes)', opacity: 0.7 }}>↑ 4.2% · 24h</div>
          </div>
          <div style={{ flex: 1, padding: 14, borderRadius: 14, background: 'rgba(255,46,132,0.05)', border: '1px solid rgba(255,46,132,0.2)' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
            <div className="mono" style={{ color: 'var(--no)', fontSize: 26, fontWeight: 700, lineHeight: 1, margin: '6px 0 2px' }}>{Math.round(m.no * 100)}¢</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--no)', opacity: 0.7 }}>↓ 4.2% · 24h</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-2)', borderRadius: 10, marginBottom: 10 }}>
          {(['chart', 'depth', 'trades'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, height: 28, borderRadius: 8,
              background: view === v ? 'var(--bg-3)' : 'transparent',
              color: view === v ? 'var(--ink)' : 'var(--ink-3)',
              fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
            }}>{v === 'trades' ? 'Recent' : v}</button>
          ))}
        </div>

        <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
          {view === 'chart' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['1H', '1D', '1W', 'ALL'].map((r, i) => (
                    <button key={r} style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: i === 1 ? 'var(--bg-3)' : 'transparent',
                      color: i === 1 ? 'var(--ink)' : 'var(--ink-3)',
                    }}>{r}</button>
                  ))}
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>vol ${(m.vol24 / 1000).toFixed(0)}k</span>
              </div>
              <MiniChart data={m.spark} color="var(--yes)" width={320} height={140} />
            </>
          )}
          {view === 'depth' && <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12 }}>Order book — $840k liquidity · 34 levels</div>}
          {view === 'trades' && (
            <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>
              {[
                ['2m ago', 'BUY YES', '$420', '67¢'],
                ['4m ago', 'SELL NO', '$180', '33¢'],
                ['7m ago', 'BUY YES', '$1,240', '66¢'],
                ['11m ago', 'BUY NO', '$85', '34¢'],
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '6px 0', borderBottom: i < 3 ? '1px dashed var(--line)' : 'none' }}>
                  <span style={{ color: 'var(--ink-3)' }}>{r[0]}</span>
                  <span style={{ color: r[1].includes('YES') ? 'var(--yes)' : 'var(--no)', fontWeight: 600, fontSize: 10 }}>{r[1]}</span>
                  <span className="mono">{r[2]}</span>
                  <span className="mono" style={{ textAlign: 'right' }}>{r[3]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          padding: 16, borderRadius: 18,
          background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
          border: '1px solid var(--line)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', border: `1px dashed ${side === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)'}` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Place bet</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>
              Balance <span className="mono" style={{ color: 'var(--ink-2)' }}>${balance.toFixed(2)}</span>
              {freebet > 0 && <> · Freebet <span className="mono" style={{ color: 'var(--yes)' }}>${freebet.toFixed(2)}</span></>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button onClick={() => setSide('yes')} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: side === 'yes' ? 'rgba(158,240,26,0.18)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${side === 'yes' ? 'rgba(158,240,26,0.5)' : 'var(--line)'}`,
              color: side === 'yes' ? 'var(--yes)' : 'var(--ink-2)',
              fontWeight: 700, fontSize: 13,
            }}>YES <span className="mono" style={{ opacity: 0.7, marginLeft: 4 }}>{Math.round(m.yes * 100)}¢</span></button>
            <button onClick={() => setSide('no')} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: side === 'no' ? 'rgba(255,46,132,0.18)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${side === 'no' ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`,
              color: side === 'no' ? 'var(--no)' : 'var(--ink-2)',
              fontWeight: 700, fontSize: 13,
            }}>NO <span className="mono" style={{ opacity: 0.7, marginLeft: 4 }}>{Math.round(m.no * 100)}¢</span></button>
          </div>

          <div style={{ padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>Amount USDC</div>
            <input
              type="number" inputMode="decimal" value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="mono"
              style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 32, fontWeight: 700, width: '100%', outline: 'none', fontFamily: 'var(--mono)' }}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[10, 25, 50, 100].map((p) => (
                <button key={p} onClick={() => setAmount(p)} style={{
                  flex: 1, height: 28, borderRadius: 8,
                  background: amount === p ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--line)',
                  color: amount === p ? 'var(--ink)' : 'var(--ink-2)',
                  fontSize: 11, fontWeight: 600,
                }}>${p}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', fontSize: 12, marginBottom: 12 }}>
            {[
              ['You pay', `$${amount.toFixed(2)}`, 'var(--ink-2)' as string],
              ['Potential payout', `$${payout.toFixed(2)}`, color],
              ['Implied probability', `${Math.round(price * 100)}%`, 'var(--ink-2)'],
            ].map(([k, v, c], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                <span className="mono" style={{ color: c, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <button
            onClick={roll}
            disabled={!canRoll}
            style={{
              width: '100%', height: 50, borderRadius: 14,
              background: !canRoll
                ? 'rgba(255,255,255,0.05)'
                : side === 'yes'
                  ? 'linear-gradient(135deg, #9ef01a, #6dbf00)'
                  : 'linear-gradient(135deg, #ff2e84, #c41c5f)',
              color: !canRoll ? 'var(--ink-3)' : side === 'yes' ? '#0a0a15' : '#fff',
              fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
              boxShadow: !canRoll ? 'none' : side === 'yes' ? '0 10px 30px rgba(158,240,26,0.35)' : '0 10px 30px rgba(255,46,132,0.3)',
              cursor: canRoll ? 'pointer' : 'not-allowed',
            }}
          >
            {!canRoll && amount > total ? 'Insufficient balance' : `🎲 Roll $${amount} on ${side.toUpperCase()}`}
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button style={{ fontSize: 11, color: 'var(--ink-3)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Advanced options →</button>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>fee 1.0%</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>
            Crypto prediction markets involve risk. Only roll what you can afford to lose.
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 14px 0' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Swipe sentiment · 2,184 votes</div>
        <SentimentBar bull={m.bull} />
      </div>

      <div style={{ padding: '20px 14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Comments · {m.comments}</div>
          <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-2)', borderRadius: 8 }}>
            {(['Top', 'Latest'] as const).map((s) => (
              <button key={s} onClick={() => setCsort(s)} style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: csort === s ? 'var(--bg-3)' : 'transparent',
                color: csort === s ? 'var(--ink)' : 'var(--ink-3)',
              }}>{s}</button>
            ))}
          </div>
        </div>
        {COMMENTS.map((c) => (
          <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px dashed var(--line)', display: 'flex', gap: 10 }}>
            <Avatar name={c.av} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                <TierBadge tier={c.tier} size="sm" />
                <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>· {c.time}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--ink-2)' }}>{c.text}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>
                <button style={{ color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 3 }}>▲ <span className="mono">{c.up}</span></button>
                <button style={{ color: 'var(--ink-3)' }}>▼</button>
                <button style={{ color: 'var(--ink-3)' }}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          padding: '12px 20px', borderRadius: 12,
          background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)',
          color: 'var(--yes)', fontWeight: 700, fontSize: 13,
          zIndex: 200,
        }}>{toast}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 9.2: Update MarketPage.tsx**

File: `betsroll-app/src/routes/MarketPage.tsx`

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { MARKETS } from '../data/markets';
import { useViewport } from '../hooks/useViewport';
import { MobileMarket } from '../components/mobile/MobileMarket';
import { BottomNav } from '../components/mobile/BottomNav';

export default function MarketPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const isDesktop = useViewport();
  const m = MARKETS.find((x) => x.id === id);

  if (!m) {
    return (
      <div style={{ padding: 40, color: 'var(--ink)' }}>
        Market not found.
        <button onClick={() => nav('/')} style={{ marginLeft: 12, color: 'var(--brand)' }}>Back to Feed</button>
      </div>
    );
  }

  if (isDesktop) return <div style={{ padding: 40 }}>Desktop Market coming next task (id={m.id})</div>;
  return (
    <>
      <MobileMarket m={m} />
      <BottomNav active="markets" />
    </>
  );
}
```

- [ ] **Step 9.3: Smoke test**

Dev server, narrow window. From feed tap a card or die → opens market page. Toggle YES/NO, quick-sums, type custom amount. Click "Roll $25 on YES" → toast appears, balance drops in header widget. Kill server.

- [ ] **Step 9.4: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit -m "feat(mobile-market): detail screen with trade panel + state integration"
```

---

## Task 10: Mobile Profile screen (tabs: Overview / Positions / Created / History)

**Files:**
- Create: `src/components/mobile/MobileProfile.tsx`
- Modify: `src/routes/ProfilePage.tsx`

- [ ] **Step 10.1: MobileProfile.tsx**

File: `betsroll-app/src/components/mobile/MobileProfile.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CREATED, ME } from '../../data/user';
import { pointsToNextTier, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Icon } from '../primitives/icons';
import { TierBadge } from '../primitives/TierBadge';
import { VIPRing } from '../primitives/VIPRing';

type Tab = 'Overview' | 'Positions' | 'Created' | 'History';

export function MobileProfile() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('Overview');
  const store = useStore();
  const tierInfo = pointsToNextTier(store.vipPts);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingBottom: 120 }} className="noscroll">
      <div style={{
        height: 140, position: 'relative', overflow: 'hidden',
        background:
          'radial-gradient(circle at 20% 20%, rgba(255,216,107,0.35) 0%, rgba(12,12,22,0) 60%), ' +
          'radial-gradient(circle at 80% 80%, rgba(124,92,255,0.4), rgba(12,12,22,0) 70%), var(--bg)',
      }}>
        <div style={{ position: 'absolute', top: 12, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
          <button onClick={() => nav(-1)} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(12,12,22,0.6)', backdropFilter: 'blur(6px)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)' }}>{Icon.back(18)}</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(12,12,22,0.6)', backdropFilter: 'blur(6px)', color: 'var(--ink-2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.share(16)}</button>
            <button style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(12,12,22,0.6)', backdropFilter: 'blur(6px)', color: 'var(--ink-2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙</button>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 30, right: -40, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
      </div>

      <div style={{ padding: '0 16px', marginTop: -52, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <VIPRing tier={store.tier} progress={tierInfo.progress} />
            <div style={{ position: 'absolute', inset: 12 }}>
              <Avatar name="MV" size={80} />
            </div>
            <div style={{
              position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
              padding: '3px 8px', borderRadius: 8,
              background: '#ffd86b', color: '#0a0a15', fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
              boxShadow: '0 4px 10px rgba(255,216,107,0.4)',
              whiteSpace: 'nowrap',
            }}>{store.tier.toUpperCase()} · LVL 14</div>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.4 }}>{ME.handle}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{ME.bio}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 14px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <StatTile label="Balance USDC" value={`$${store.balance.toFixed(2)}`} sub={store.freebet > 0 ? `+$${store.freebet.toFixed(2)} freebet` : 'available to roll'} />
        <StatTile label="Lifetime PnL" value={`+$${ME.pnlLife.toFixed(0)}`} sub="all time" tone="yes" />
        <StatTile label="Win rate" value={`${Math.round(ME.winRate * 100)}%`} sub="last 90 days" />
        <StatTile label="Markets made" value={String(ME.marketsCreated)} sub={`${ME.resolved} resolved`} />
        <StatTile label="Creator fees" value={`$${ME.creatorEarnings.toFixed(0)}`} sub="as Betsroller" tone="yes" />
        <StatTile label="VIP pts" value={store.vipPts.toLocaleString()} sub={`${tierInfo.remaining.toLocaleString()} to ${tierInfo.next}`} />
      </div>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          padding: 16, borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(255,216,107,0.08), rgba(124,92,255,0.08))',
          border: '1px solid rgba(255,216,107,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 120, height: 120, borderRadius: '50%', border: '1px dashed rgba(255,216,107,0.2)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>VIP Program</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <TierBadge tier={store.tier} size="lg" />
                <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>→</span>
                <TierBadge tier={tierInfo.next} size="sm" />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{tierInfo.remaining.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>pts to {tierInfo.next}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              width: `${tierInfo.progress * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #ffd86b, #b8e6ff)',
              boxShadow: '0 0 12px rgba(255,216,107,0.5)',
            }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 14px 0' }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-2)', borderRadius: 12 }}>
          {(['Overview', 'Positions', 'Created', 'History'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, height: 32, borderRadius: 8,
              background: tab === t ? 'var(--bg-3)' : 'transparent',
              color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
              fontSize: 11.5, fontWeight: 600,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 14px 0' }}>
        {tab === 'Overview' && <OverviewTab totalValue={store.positions.reduce((a, p) => a + p.size, 0)} unrealized={store.positions.reduce((a, p) => a + p.pnl, 0)} />}
        {tab === 'Positions' && <PositionsTab />}
        {tab === 'Created' && <CreatedTab />}
        {tab === 'History' && <HistoryTab />}
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'yes' | 'no' }) {
  const color = tone === 'yes' ? 'var(--yes)' : tone === 'no' ? 'var(--no)' : 'var(--ink)';
  return (
    <div style={{
      padding: '10px 10px 12px', borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div className="mono" style={{ fontSize: 15, fontWeight: 700, color, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      {sub && <div style={{ fontSize: 9.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
    </div>
  );
}

function OverviewTab({ totalValue, unrealized }: { totalValue: number; unrealized: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Open positions</div>
        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>Total size</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>${totalValue.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>Unrealized PnL</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: unrealized >= 0 ? 'var(--yes)' : 'var(--no)' }}>
                {unrealized >= 0 ? '+' : ''}${unrealized.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Reputation badges</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['Crypto Oracle', '#9ef01a'],
            ['Macro Seer', '#7c5cff'],
            ['Early Roller', '#ffc24c'],
            ['Streak × 7', '#ff2e84'],
          ].map(([l, c]) => (
            <div key={l} style={{
              padding: '6px 10px', borderRadius: 10,
              background: `${c}1a`, border: `1px solid ${c}66`, color: c,
              fontSize: 11, fontWeight: 600,
            }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PositionsTab() {
  const positions = useStore((s) => s.positions);
  if (positions.length === 0) return <Empty label="No positions yet — roll something." />;
  return (
    <div>
      {positions.map((p, i) => {
        const profit = p.pnl >= 0;
        return (
          <div key={p.id} style={{ padding: '12px 0', borderBottom: i < positions.length - 1 ? '1px dashed var(--line)' : 'none' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{
                padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
                background: p.side === 'YES' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)',
                color: p.side === 'YES' ? 'var(--yes)' : 'var(--no)',
                marginTop: 2,
              }}>{p.side}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{p.q}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                  <span>size <span className="mono" style={{ color: 'var(--ink-2)' }}>${p.size}</span></span>
                  <span>entry <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(p.entry * 100)}¢</span></span>
                  <span>now <span className="mono" style={{ color: 'var(--ink-2)' }}>{Math.round(p.cur * 100)}¢</span></span>
                  <span>· {p.eta}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ color: profit ? 'var(--yes)' : 'var(--no)', fontWeight: 700, fontSize: 14 }}>
                  {profit ? '+' : ''}${p.pnl.toFixed(2)}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                  {profit ? '+' : ''}{p.size > 0 ? ((p.pnl / p.size) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreatedTab() {
  const statusColor: Record<string, string> = { Live: 'var(--yes)', Validating: '#a794ff', Resolved: 'var(--ink-2)', Draft: 'var(--ink-3)' };
  const statusBorder: Record<string, string> = { Live: 'rgba(158,240,26,0.4)', Validating: 'rgba(124,92,255,0.4)', Resolved: 'var(--line)', Draft: 'var(--line)' };
  return (
    <div>
      {CREATED.map((c, i) => (
        <div key={i} style={{ padding: '12px 0', borderBottom: i < CREATED.length - 1 ? '1px dashed var(--line)' : 'none' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{c.q}</div>
            <span style={{
              padding: '2px 8px', borderRadius: 6, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.04)',
              color: statusColor[c.status],
              border: `1px solid ${statusBorder[c.status]}`,
            }}>{c.status}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-3)' }}>
            <span>vol <span className="mono" style={{ color: 'var(--ink-2)' }}>${(c.vol / 1000).toFixed(0)}k</span></span>
            <span>fees earned <span className="mono" style={{ color: c.fees > 0 ? 'var(--yes)' : 'var(--ink-3)' }}>${c.fees.toFixed(2)}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab() {
  const history = useStore((s) => s.history);
  if (history.length === 0) return <Empty label="No activity yet." />;
  return (
    <div>
      {history.map((h, i) => (
        <div key={h.id} style={{ display: 'flex', gap: 10, padding: '12px 0', borderBottom: i < history.length - 1 ? '1px dashed var(--line)' : 'none', alignItems: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: h.kind === 'trade' ? 'rgba(124,92,255,0.12)' : h.kind === 'tier' ? 'rgba(255,216,107,0.12)' : 'rgba(76,201,255,0.12)',
            border: `1px solid ${h.kind === 'trade' ? 'rgba(124,92,255,0.3)' : h.kind === 'tier' ? 'rgba(255,216,107,0.3)' : 'rgba(76,201,255,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: h.kind === 'trade' ? '#a794ff' : h.kind === 'tier' ? 'var(--gold)' : '#8bd5ff',
            fontWeight: 700, fontSize: 14,
          }}>{h.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink)' }}>{h.txt}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{h.time}</div>
          </div>
          {h.v && <div className="mono" style={{ fontSize: 12, color: h.v.startsWith('+') ? 'var(--yes)' : h.v.startsWith('-') ? 'var(--no)' : 'var(--ink-2)', fontWeight: 600 }}>{h.v}</div>}
        </div>
      ))}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>{label}</div>;
}
```

- [ ] **Step 10.2: Update ProfilePage.tsx**

File: `betsroll-app/src/routes/ProfilePage.tsx`

```tsx
import { useViewport } from '../hooks/useViewport';
import { MobileProfile } from '../components/mobile/MobileProfile';
import { BottomNav } from '../components/mobile/BottomNav';

export default function ProfilePage() {
  const isDesktop = useViewport();
  if (isDesktop) return <div style={{ padding: 40 }}>Desktop Profile (uses desktop shell) — coming next tasks</div>;
  return (
    <>
      <MobileProfile />
      <BottomNav active="profile" />
    </>
  );
}
```

- [ ] **Step 10.3: Smoke**

Dev server, narrow viewport. Navigate bottom-nav → Profile. Tabs switch. After rolling a bet in Task 9 smoke, Positions tab should show your new position; History tab should show trade + tier-up entries.

- [ ] **Step 10.4: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit -m "feat(mobile-profile): VIP ring, tiers, tabs (overview/positions/created/history)"
```

---

## Task 11: Desktop Sidebar + DesktopMarketCard

**Files:**
- Create: `src/components/desktop/DesktopSidebar.tsx`, `DesktopMarketCard.tsx`, `DesktopRightRail.tsx`

- [ ] **Step 11.1: DesktopSidebar.tsx**

File: `betsroll-app/src/components/desktop/DesktopSidebar.tsx`

```tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { ME } from '../../data/user';
import { useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { BRLogo } from '../primitives/BRLogo';
import { Icon } from '../primitives/icons';

export function DesktopSidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const balance = useStore((s) => s.balance);
  const tier = useStore((s) => s.tier);
  const items: Array<[string, string, string]> = [
    ['/', 'Feed', '🎲'],
    ['/', 'Markets', '📊'],
    ['/profile', 'Profile', '👤'],
  ];

  return (
    <aside style={{
      width: 220, padding: 24, borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', gap: 6,
      background: 'var(--bg)', height: '100dvh', position: 'sticky', top: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 20px', borderBottom: '1px dashed var(--line)', marginBottom: 14 }}>
        <BRLogo size={34} spin />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Betsroll</div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Roll the future</div>
        </div>
      </div>
      {items.map(([path, label, ic], i) => {
        const active = pathname === path && (i === 0 ? label === 'Feed' : true);
        return (
          <button key={label} onClick={() => nav(path)} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            borderRadius: 10,
            background: active ? 'var(--bg-2)' : 'transparent',
            color: active ? 'var(--ink)' : 'var(--ink-2)',
            fontSize: 13.5, fontWeight: 600, textAlign: 'left',
          }}>
            <span style={{ fontSize: 16 }}>{ic}</span>{label}
          </button>
        );
      })}
      <div style={{ marginTop: 10 }}>
        <button style={{
          width: '100%', padding: '12px', borderRadius: 12,
          background: 'linear-gradient(135deg, #7c5cff, #4cc9ff)', color: '#fff',
          fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>{Icon.plus(16, '#fff')}Roll a market</button>
      </div>
      <div style={{ marginTop: 'auto', padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Avatar name="MV" size={32} ring="var(--gold)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{ME.handle}</div>
            <div style={{ fontSize: 9.5, color: 'var(--gold)' }}>● {tier.toUpperCase()} · LVL 14</div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 700 }}>${balance.toFixed(2)}</div>
        <div style={{ fontSize: 9.5, color: 'var(--ink-3)' }}>USDC balance</div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 11.2: DesktopMarketCard.tsx**

File: `betsroll-app/src/components/desktop/DesktopMarketCard.tsx`

```tsx
import { useState } from 'react';
import type { Market } from '../../data/markets';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { Icon } from '../primitives/icons';
import { Sparkline } from '../primitives/Sparkline';
import { TierBadge } from '../primitives/TierBadge';
import { ValidationBar } from '../primitives/ValidationBar';

type Props = { m: Market; liveProgress: number; onOpen: () => void };

export function DesktopMarketCard({ m, liveProgress, onOpen }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 20, borderRadius: 20,
        background: 'linear-gradient(180deg, var(--bg-1), var(--bg))',
        border: `1px solid ${hover ? 'rgba(124,92,255,0.3)' : 'var(--line)'}`,
        display: 'flex', flexDirection: 'column', gap: 14,
        position: 'relative', overflow: 'hidden',
        transition: 'transform .2s, border-color .2s',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(124,92,255,0.1)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={m.creator.av} size={30} ring={m.creator.tier === 'King' ? '#ff6bff' : m.creator.tier === 'Gold' ? 'var(--gold)' : null} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{m.creator.handle}</span>
        <TierBadge tier={m.creator.tier} size="sm" />
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· {m.time}</span>
        <div style={{ flex: 1 }} />
        <Chip label={m.cat} tone="brand" />
      </div>
      <div onClick={onOpen} style={{ cursor: 'pointer', fontSize: 18, fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)', letterSpacing: -0.4 }}>{m.q}</div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center',
        padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--line)', borderRadius: 12,
      }}>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
          <div className="mono" style={{ color: 'var(--yes)', fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{Math.round(m.yes * 100)}¢</div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
          <div className="mono" style={{ color: 'var(--no)', fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{Math.round(m.no * 100)}¢</div>
        </div>
        <Sparkline data={m.spark} color={m.bull > 50 ? 'var(--yes)' : 'var(--no)'} width={88} height={36} />
      </div>
      {m.status === 'live' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: 'var(--yes)', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yes)' }} />LIVE · {m.resolvesIn}
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 'auto' }}>${(m.vol24 / 1000).toFixed(0)}k / 24h</span>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Validating · {liveProgress}% to go live
          </div>
          <ValidationBar pct={liveProgress} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onOpen} style={{
          flex: 1, height: 40, borderRadius: 10,
          background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)',
          color: 'var(--yes)', fontWeight: 700, fontSize: 12.5, letterSpacing: 0.2,
        }}>BUY YES · {Math.round(m.yes * 100)}¢</button>
        <button onClick={onOpen} style={{
          flex: 1, height: 40, borderRadius: 10,
          background: 'rgba(255,46,132,0.12)', border: '1px solid rgba(255,46,132,0.35)',
          color: 'var(--no)', fontWeight: 700, fontSize: 12.5, letterSpacing: 0.2,
        }}>BUY NO · {Math.round(m.no * 100)}¢</button>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--ink-3)', fontSize: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{Icon.chat(14)}<span className="mono">{m.comments}</span></span>
        <span>{Icon.share(14)}</span>
        <span>{Icon.bookmark(14)}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5 }}>liq <span className="mono" style={{ color: 'var(--ink-2)' }}>${(m.liq / 1000).toFixed(0)}k</span></span>
      </div>
    </div>
  );
}
```

- [ ] **Step 11.3: DesktopRightRail.tsx**

File: `betsroll-app/src/components/desktop/DesktopRightRail.tsx`

```tsx
import { pointsToNextTier, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { TierBadge } from '../primitives/TierBadge';

export function DesktopRightRail() {
  const vipPts = useStore((s) => s.vipPts);
  const tier = useStore((s) => s.tier);
  const info = pointsToNextTier(vipPts);

  return (
    <aside style={{ width: 280, padding: 24, borderLeft: '1px solid var(--line)', overflow: 'auto', height: '100dvh', position: 'sticky', top: 0 }} className="noscroll">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>🔥 Rolling now</div>
        {[
          ['Strait of Hormuz traffic normal?', '23%', '↓', 46],
          ['Trump posts 200+ tweets by April 21?', '76%', '↑', 59],
          ['ETH flips BTC market cap in 2026?', '8%', '↓', 12],
        ].map(([q, p, d, c], i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px dashed var(--line)' : 'none', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 16 }}>{i + 1}</div>
            <div style={{ flex: 1, fontSize: 12, lineHeight: 1.3 }}>{q}</div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{p}</div>
              <div className="mono" style={{ fontSize: 9.5, color: d === '↑' ? 'var(--yes)' : 'var(--no)' }}>{d}{c}%</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 14, borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(255,216,107,0.08), rgba(124,92,255,0.08))',
        border: '1px solid rgba(255,216,107,0.25)',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Your tier</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
          <TierBadge tier={tier} size="lg" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 8 }}>
          {info.remaining.toLocaleString()} pts to <b style={{ color: '#b8e6ff' }}>{info.next}</b>
        </div>
        <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ width: `${info.progress * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ffd86b, #b8e6ff)' }} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Top Betsrollers · 7d</div>
        {[
          ['@circuit', 'King', '+$12.4k'],
          ['@macro_vlad', 'Gold', '+$4.8k'],
          ['@euroHawk', 'Plat', '+$3.1k'],
        ].map(([n, _t, p], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', width: 16 }}>{i + 1}</div>
            <Avatar name={n.slice(1, 3).toUpperCase()} size={28} />
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{n}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--yes)', fontWeight: 600 }}>{p}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 11.4: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add src/components/desktop
git commit -m "feat(desktop-parts): sidebar, market card, right rail"
```

---

## Task 12: Desktop Feed

**Files:**
- Create: `src/components/desktop/DesktopFeed.tsx`
- Modify: `src/routes/FeedPage.tsx`

- [ ] **Step 12.1: DesktopFeed.tsx**

File: `betsroll-app/src/components/desktop/DesktopFeed.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETS } from '../../data/markets';
import { useStore } from '../../state/useStore';
import { Icon } from '../primitives/icons';
import { DesktopMarketCard } from './DesktopMarketCard';
import { DesktopRightRail } from './DesktopRightRail';
import { DesktopSidebar } from './DesktopSidebar';

export function DesktopFeed() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'Top' | 'New' | 'Following'>('Top');
  const [cat, setCat] = useState('All');
  const cats = ['All', 'Politics', 'Crypto', 'Sports', 'Tech', 'Finance', 'Meme', 'Culture'];
  const boosts = useStore((s) => s.validationBoost);

  const liveProgress = (m: (typeof MARKETS)[number]) =>
    Math.min(100, (m.progress ?? 100) + (boosts[m.id] ?? 0));

  const filtered = cat === 'All' ? MARKETS : MARKETS.filter((m) => m.cat === cat);

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <DesktopSidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }} className="noscroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            flex: 1, height: 42, borderRadius: 12, background: 'var(--bg-1)',
            border: '1px solid var(--line)', padding: '0 14px',
            display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-3)', fontSize: 13,
          }}>
            {Icon.search(16)} Search markets, Betsrollers, categories…
            <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px', border: '1px solid var(--line)', borderRadius: 5 }}>⌘K</span>
          </div>
          <button style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--line)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {Icon.bell(16)}
            <span style={{ position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: '50%', background: 'var(--no)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Feed</h1>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-1)', borderRadius: 10 }}>
            {(['Top', 'New', 'Following'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: tab === t ? 'var(--bg-3)' : 'transparent',
                color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
            <span style={{ color: 'var(--yes)' }}>●</span> 2,184 betsrollers online
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              background: cat === c ? 'var(--bg-3)' : 'transparent',
              border: `1px solid ${cat === c ? 'transparent' : 'var(--line)'}`,
              color: cat === c ? 'var(--ink)' : 'var(--ink-2)',
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
          {filtered.map((m) => (
            <DesktopMarketCard key={m.id} m={m} liveProgress={liveProgress(m)} onOpen={() => nav(`/market/${m.id}`)} />
          ))}
        </div>
      </main>
      <DesktopRightRail />
    </div>
  );
}
```

- [ ] **Step 12.2: Update FeedPage.tsx**

File: `betsroll-app/src/routes/FeedPage.tsx`

```tsx
import { useViewport } from '../hooks/useViewport';
import { MobileFeed } from '../components/mobile/MobileFeed';
import { BottomNav } from '../components/mobile/BottomNav';
import { DesktopFeed } from '../components/desktop/DesktopFeed';

export default function FeedPage() {
  const isDesktop = useViewport();
  if (isDesktop) return <DesktopFeed />;
  return (
    <>
      <MobileFeed />
      <BottomNav active="feed" />
    </>
  );
}
```

- [ ] **Step 12.3: Smoke + commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit -m "feat(desktop-feed): sidebar + grid + right rail with live VIP widget"
```

---

## Task 13: Desktop Market view + desktop Profile wrapper

**Files:**
- Create: `src/components/desktop/DesktopMarket.tsx`
- Modify: `src/routes/MarketPage.tsx`, `src/routes/ProfilePage.tsx`

- [ ] **Step 13.1: DesktopMarket.tsx**

File: `betsroll-app/src/components/desktop/DesktopMarket.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMENTS, type Market } from '../../data/markets';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';
import { MiniChart } from '../primitives/MiniChart';
import { SentimentBar } from '../primitives/SentimentBar';
import { TierBadge } from '../primitives/TierBadge';
import { ValidationBar } from '../primitives/ValidationBar';
import { DesktopSidebar } from './DesktopSidebar';

type Props = { m: Market };

export function DesktopMarket({ m }: Props) {
  const nav = useNavigate();
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(50);
  const [toast, setToast] = useState<string | null>(null);
  const balance = useStore((s) => s.balance);
  const freebet = useStore((s) => s.freebet);
  const tier = useStore((s) => s.tier);

  const price = side === 'yes' ? m.yes : m.no;
  const total = balance + freebet;
  const canRoll = amount > 0 && amount <= total;

  const roll = () => {
    const res = actions.rollBet({
      marketId: m.id,
      q: m.q,
      side: side === 'yes' ? 'YES' : 'NO',
      amount,
      price,
      eta: m.resolvesIn ?? 'TBD',
    });
    if (res.ok) {
      setToast(`🎲 Rolled $${amount} on ${side.toUpperCase()}`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  const feeForTier = tier === 'Gold' ? 0.30 : tier === 'Platinum' ? 0.20 : tier === 'King' ? 0.10 : 0.60;

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <DesktopSidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }} className="noscroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: 'var(--ink-3)' }}>
          <button onClick={() => nav('/')} style={{ color: 'var(--ink-3)' }}>Feed</button>
          <span>/</span><span>{m.cat}</span><span>/</span>
          <span style={{ color: 'var(--ink-2)' }}>{m.q.slice(0, 50)}…</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <Chip label={m.cat} tone="brand" />
          {m.status === 'live' && <Chip label={`LIVE · ${m.resolvesIn}`} tone="live" />}
          <Chip label="Chainlink oracle" />
          <Chip label="Resolves Apr 30" />
        </div>
        <h1 style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.8, maxWidth: 780 }}>{m.q}</h1>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 24, maxWidth: 780 }}>
          <Avatar name={m.creator.av} size={44} ring="var(--gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700 }}>{m.creator.handle}</span>
              <TierBadge tier={m.creator.tier} size="sm" />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
              <span className="mono" style={{ color: 'var(--ink-2)' }}>{m.creator.markets}</span> markets ·
              <span className="mono" style={{ color: 'var(--ink-2)' }}> ${m.creator.vol}</span> vol ·
              <span className="mono" style={{ color: 'var(--yes)' }}> {m.creator.rep}%</span> accuracy
            </div>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(124,92,255,0.15)', border: '1px solid rgba(124,92,255,0.4)', color: '#a794ff', fontWeight: 600, fontSize: 12 }}>+ Follow</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: 16, borderRadius: 14, background: 'rgba(158,240,26,0.05)', border: '1px solid rgba(158,240,26,0.25)' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>YES</div>
                <div className="mono" style={{ color: 'var(--yes)', fontSize: 32, fontWeight: 700, lineHeight: 1, margin: '4px 0' }}>{Math.round(m.yes * 100)}¢</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--yes)', opacity: 0.7 }}>↑ 4.2% · 24h</div>
              </div>
              <div style={{ flex: 1, padding: 16, borderRadius: 14, background: 'rgba(255,46,132,0.05)', border: '1px solid rgba(255,46,132,0.2)' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>NO</div>
                <div className="mono" style={{ color: 'var(--no)', fontSize: 32, fontWeight: 700, lineHeight: 1, margin: '4px 0' }}>{Math.round(m.no * 100)}¢</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--no)', opacity: 0.7 }}>↓ 4.2% · 24h</div>
              </div>
            </div>

            <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Chart', 'Depth', 'Trades'].map((r, i) => (
                    <button key={r} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: i === 0 ? 'var(--bg-3)' : 'transparent', color: i === 0 ? 'var(--ink)' : 'var(--ink-3)' }}>{r}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['1H', '1D', '1W', 'ALL'].map((r, i) => (
                    <button key={r} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: i === 1 ? 'var(--bg-3)' : 'transparent', color: i === 1 ? 'var(--ink)' : 'var(--ink-3)' }}>{r}</button>
                  ))}
                </div>
              </div>
              <MiniChart data={m.spark} color="var(--yes)" width={600} height={220} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Swipe sentiment · 2,184 votes</div>
              <SentimentBar bull={m.bull} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Comments · {m.comments}</div>
              </div>
              {COMMENTS.map((c) => (
                <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px dashed var(--line)', display: 'flex', gap: 12 }}>
                  <Avatar name={c.av} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                      <TierBadge tier={c.tier} size="sm" />
                      <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>· {c.time}</span>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)' }}>{c.text}</div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>
                      <button style={{ color: 'var(--ink-3)' }}>▲ <span className="mono">{c.up}</span></button>
                      <button style={{ color: 'var(--ink-3)' }}>▼</button>
                      <button style={{ color: 'var(--ink-3)' }}>Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div style={{ padding: 18, borderRadius: 18, background: 'linear-gradient(180deg, var(--bg-1), var(--bg))', border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: '50%', border: `1px dashed ${side === 'yes' ? 'rgba(158,240,26,0.15)' : 'rgba(255,46,132,0.15)'}` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>Place bet</div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>${balance.toFixed(2)} USDC</div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <button onClick={() => setSide('yes')} style={{ flex: 1, height: 40, borderRadius: 10, background: side === 'yes' ? 'rgba(158,240,26,0.18)' : 'rgba(255,255,255,0.03)', border: `1px solid ${side === 'yes' ? 'rgba(158,240,26,0.5)' : 'var(--line)'}`, color: side === 'yes' ? 'var(--yes)' : 'var(--ink-2)', fontWeight: 700, fontSize: 13 }}>YES {Math.round(m.yes * 100)}¢</button>
                <button onClick={() => setSide('no')} style={{ flex: 1, height: 40, borderRadius: 10, background: side === 'no' ? 'rgba(255,46,132,0.18)' : 'rgba(255,255,255,0.03)', border: `1px solid ${side === 'no' ? 'rgba(255,46,132,0.5)' : 'var(--line)'}`, color: side === 'no' ? 'var(--no)' : 'var(--ink-2)', fontWeight: 700, fontSize: 13 }}>NO {Math.round(m.no * 100)}¢</button>
              </div>
              <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2 }}>Amount USDC</div>
                <input
                  type="number" value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="mono"
                  style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 28, fontWeight: 700, width: '100%', outline: 'none', fontFamily: 'var(--mono)' }}
                />
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[10, 25, 50, 100].map((p) => (
                    <button key={p} onClick={() => setAmount(p)} style={{ flex: 1, height: 26, borderRadius: 7, background: amount === p ? 'var(--bg-3)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}>${p}</button>
                  ))}
                  <button onClick={() => setAmount(Math.floor(total))} style={{ flex: 1, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 10.5, fontWeight: 600 }}>Max</button>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', fontSize: 12, marginBottom: 12 }}>
                {[
                  ['You pay', `$${amount.toFixed(2)}`, 'var(--ink-2)'],
                  ['Potential payout', `$${(amount / price).toFixed(2)}`, side === 'yes' ? 'var(--yes)' : 'var(--no)'],
                  ['Implied prob.', `${Math.round(price * 100)}%`, 'var(--ink-2)'],
                  [`Fee (${tier} tier)`, `${feeForTier.toFixed(2)}%`, 'var(--ink-2)'],
                ].map(([k, v, c], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                    <span className="mono" style={{ color: c, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={roll}
                disabled={!canRoll}
                style={{
                  width: '100%', height: 48, borderRadius: 12,
                  background: !canRoll ? 'rgba(255,255,255,0.05)' : side === 'yes' ? 'linear-gradient(135deg,#9ef01a,#6dbf00)' : 'linear-gradient(135deg,#ff2e84,#c41c5f)',
                  color: !canRoll ? 'var(--ink-3)' : side === 'yes' ? '#0a0a15' : '#fff',
                  fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
                  boxShadow: !canRoll ? 'none' : side === 'yes' ? '0 10px 30px rgba(158,240,26,0.3)' : '0 10px 30px rgba(255,46,132,0.25)',
                  cursor: canRoll ? 'pointer' : 'not-allowed',
                }}
              >{!canRoll && amount > total ? 'Insufficient balance' : `🎲 Roll $${amount} on ${side.toUpperCase()}`}</button>
              <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>Crypto prediction markets involve risk. Only roll what you can afford to lose.</div>
            </div>

            {m.status !== 'live' && (
              <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Validation · {m.progress ?? 0}%</div>
                <ValidationBar pct={m.progress ?? 0} />
              </div>
            )}
          </aside>
        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, padding: '12px 20px', borderRadius: 12, background: 'rgba(158,240,26,0.15)', border: '1px solid rgba(158,240,26,0.4)', color: 'var(--yes)', fontWeight: 700, fontSize: 13, zIndex: 200 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 13.2: Update MarketPage.tsx**

File: `betsroll-app/src/routes/MarketPage.tsx`

```tsx
import { useNavigate, useParams } from 'react-router-dom';
import { MARKETS } from '../data/markets';
import { useViewport } from '../hooks/useViewport';
import { MobileMarket } from '../components/mobile/MobileMarket';
import { BottomNav } from '../components/mobile/BottomNav';
import { DesktopMarket } from '../components/desktop/DesktopMarket';

export default function MarketPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const isDesktop = useViewport();
  const m = MARKETS.find((x) => x.id === id);

  if (!m) {
    return (
      <div style={{ padding: 40, color: 'var(--ink)' }}>
        Market not found.
        <button onClick={() => nav('/')} style={{ marginLeft: 12, color: 'var(--brand)' }}>Back to Feed</button>
      </div>
    );
  }

  if (isDesktop) return <DesktopMarket m={m} />;
  return (
    <>
      <MobileMarket m={m} />
      <BottomNav active="markets" />
    </>
  );
}
```

- [ ] **Step 13.3: Desktop Profile wrapper (reuse mobile profile within desktop shell)**

File: `betsroll-app/src/routes/ProfilePage.tsx` (replace)

```tsx
import { useViewport } from '../hooks/useViewport';
import { MobileProfile } from '../components/mobile/MobileProfile';
import { BottomNav } from '../components/mobile/BottomNav';
import { DesktopSidebar } from '../components/desktop/DesktopSidebar';

export default function ProfilePage() {
  const isDesktop = useViewport();
  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
        <DesktopSidebar />
        <main style={{ flex: 1, overflow: 'auto' }} className="noscroll">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <MobileProfile />
          </div>
        </main>
      </div>
    );
  }
  return (
    <>
      <MobileProfile />
      <BottomNav active="profile" />
    </>
  );
}
```

- [ ] **Step 13.4: Smoke: resize window across 768 threshold, both layouts should work. Commit.**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit -m "feat(desktop): market detail + profile wrapper; full responsive shell"
```

---

## Task 14: Full smoke matrix + build verification

- [ ] **Step 14.1: Run full dev smoke matrix**

Run: `cd /Users/Kyrylo/Desktop/betrolls/betsroll-app && npm run dev -- --host 127.0.0.1` in background. Open `http://127.0.0.1:5173/`.

Verify in narrow window (mobile):
1. Feed loads; 3 cards stacked; swipe right → stamp + toast APPROVED +4pts → next card.
2. Swipe 3 cards right → open Profile → VIP pts increased 12; History shows 3 entries (or a tier-up if threshold crossed).
3. Skip one card (swipe left) → no VIP change.
4. Center die button → opens that market's detail page.
5. On market page: change side, edit amount, click a quick-sum, click Roll → toast, balance drops. Freebet spent first.
6. Back (top-left arrow) → returns to feed preserving position.
7. Bottom-nav Profile → all tabs switch content. Positions tab shows seeded + new positions.

Resize to ≥768px:
8. Feed becomes desktop layout with sidebar + right rail + grid.
9. Click a card's title or buy-yes → opens desktop market view with sticky trade sidebar.
10. Roll on desktop → balance in sidebar widget updates.
11. Sidebar Profile link → desktop profile uses same tabbed content.

Reload page at any point: all state persists (balance, positions, history, VIP pts).

Kill server.

- [ ] **Step 14.2: Run production build**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
npm run build
```

Expected: `vite v5.x building for production…` then `✓ built in N ms`, no TS errors. Output in `dist/`.

- [ ] **Step 14.3: Preview build**

Run: `npm run preview -- --host 127.0.0.1 --port 4173` in background. `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4173/` → 200. Kill.

- [ ] **Step 14.4: Commit**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
git add -A
git commit --allow-empty -m "chore: full smoke matrix passed; prod build verified"
```

---

## Task 15 (optional): Vitest unit tests on useStore

**Files:**
- Create: `src/state/useStore.test.ts`
- Modify: `vite.config.ts` (add test config)

- [ ] **Step 15.1: Add vitest config in vite.config.ts**

File: `betsroll-app/vite.config.ts`

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

Install jsdom: `npm i -D jsdom @vitest/ui`

- [ ] **Step 15.2: Write tests**

File: `betsroll-app/src/state/useStore.test.ts`

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { actions, tierFromPts, pointsToNextTier } from './useStore';

beforeEach(() => {
  localStorage.clear();
  actions.reset();
});

describe('tierFromPts', () => {
  it('returns Bronze below 1000', () => {
    expect(tierFromPts(0)).toBe('Bronze');
    expect(tierFromPts(999)).toBe('Bronze');
  });
  it('returns Silver between 1000 and 2999', () => {
    expect(tierFromPts(1000)).toBe('Silver');
    expect(tierFromPts(2999)).toBe('Silver');
  });
  it('returns Platinum between 6000 and 14999', () => {
    expect(tierFromPts(6000)).toBe('Platinum');
    expect(tierFromPts(14999)).toBe('Platinum');
  });
  it('returns King at or above 15000', () => {
    expect(tierFromPts(15000)).toBe('King');
  });
});

describe('pointsToNextTier', () => {
  it('gives remaining and progress within tier', () => {
    const info = pointsToNextTier(2000); // Silver → Gold at 3000, 1000 after Silver threshold
    expect(info.next).toBe('Gold');
    expect(info.remaining).toBe(1000);
    expect(info.progress).toBeCloseTo(0.5, 2); // 1000 of 2000 span
  });
});

describe('actions.rollBet', () => {
  it('consumes freebet first then balance', () => {
    const res = actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: 10, price: 0.5, eta: '1d' });
    expect(res.ok).toBe(true);
    // initial freebet = 5, balance = 4820.56
    // $10 bet: freebet -> 0, balance -> 4820.56 - 5 = 4815.56
    const raw = JSON.parse(localStorage.getItem('betsroll_v1')!);
    expect(raw.freebet).toBe(0);
    expect(raw.balance).toBeCloseTo(4815.56, 2);
    expect(raw.positions[0].size).toBe(10);
  });

  it('rejects when amount exceeds freebet + balance', () => {
    const res = actions.rollBet({ marketId: 'x', q: 'Q', side: 'YES', amount: 999999, price: 0.5, eta: '1d' });
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('balance');
  });
});
```

- [ ] **Step 15.3: Run tests**

```bash
cd /Users/Kyrylo/Desktop/betrolls/betsroll-app
npm test
```

Expected: all tests pass (5+).

- [ ] **Step 15.4: Commit**

```bash
git add -A
git commit -m "test(store): unit tests for tier math + rollBet flow"
```

---

## Self-review checklist (run mentally before declaring done)

- [x] Spec coverage — every in-scope item has a task:
  - 5 screens → tasks 8, 9, 10, 12, 13 ✓
  - Swipe-to-vote mechanic → task 8 ✓
  - Trade-panel math + balance/freebet → task 9 + state in task 4 ✓
  - VIP tiers + progression → state task 4, UI task 10 ✓
  - Validation boost from swipe → voteMarket action in task 4, UI in task 8 (mobile) and task 11 (desktop card) ✓
  - localStorage persistence → task 4 ✓
  - Routing `#/`, `#/market/:id`, `#/profile` → task 5 ✓
  - Responsive split → task 5 hook + per-page pick in tasks 8/9/10/12/13 ✓
  - Error: missing market id → task 9's MarketPage handles it ✓
  - Disabled Roll button on insufficient funds → task 9 + 13 ✓

- [x] Placeholder scan — no TBD/TODO/"similar to". Every code block is complete runnable code.

- [x] Type consistency — `TierName`, `Market`, `Position`, `HistoryEntry` defined once, imported consistently. Function signatures (`voteMarket(marketId, vote)`, `rollBet(args)`) stay identical across all call sites.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-20-betsroll-prototype.md`. Two execution options:

**1. Subagent-Driven** — dispatch a fresh subagent per task, review between tasks. Slower but cleanest context separation.

**2. Inline Execution (recommended for this project)** — execute tasks in this session with checkpoints every 2-3 tasks for your review. Faster, and all the code is already planned; the bottleneck is just typing it out.

Which approach?
