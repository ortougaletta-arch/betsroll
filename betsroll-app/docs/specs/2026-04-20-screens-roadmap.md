# Betsroll — Screens Roadmap

**Date:** 2026-04-20
**Purpose:** Frontend-only inventory. What's built, what's missing, prioritised by tier (MVP / V1 / V2).
**Companion docs:** `2026-04-20-betsroll-design.md` (current prototype), `2026-04-20-betsroll-web3-architecture.md` (backend/contracts).

---

## ✅ Currently shipped (5 routes + 1 modal)

| Screen | Route | Mobile | Desktop |
|---|---|---|---|
| **Feed** | `/` | swipe stack with action bar (× / 🎲 / ✓) | sidebar + grid + right rail |
| **Markets list** | `/markets` | vertical scroll with sort (Top/New/Closing) + 6-cat filter | reuses `DesktopFeed` grid |
| **Market detail** | `/market/:id` | full screen with creator card, prices, chart/depth/trades tabs, trade panel or validation lock, sentiment, comments | sidebar + breadcrumb + chart + sticky trade sidebar |
| **Trade** | `/trade` | portfolio summary, stats, positions list with Adjust + Close | desktop shell wrapper |
| **Profile** | `/profile` | VIP ring, stat tiles, VIP progress, 4 tabs | desktop shell wrapper |
| **Create market** | overlay | React Portal modal | React Portal modal |

Catch-all `*` redirects to `/`. Missing markets render an inline "Market not found" with a Back link.

---

## ❌ MVP-tier — blocking real launch

### Onboarding & auth (5 screens)
| Screen | Why | Notes |
|---|---|---|
| **Welcome / splash** | First impression, "Roll the future" + sign-in CTA | First visit only |
| **Sign-in modal** | Apple / Google / email passkey | Use Privy or Coinbase Smart Wallet |
| **Wallet-created success** | Reassure user a wallet exists | 1× post-signin |
| **Onboarding tutorial** | Explain swipe validation, freebet, tiers | 3-4 swipes max, can skip |
| **Geo-block screen** | Blocked countries (US, UK, etc.) | IP-gated; T&Cs requirement |

### Money (4 screens)
| Screen | Why |
|---|---|
| **Deposit USDC** | QR code + on-chain address + confirmation polling |
| **Withdraw USDC** | Form + sign + status |
| **Wallet / Balances** | Aggregate USDC balance + on-chain history (deposits/withdraws/trades/payouts) |
| **Tx status modal** | Pending → Confirmed flow with explorer link |

### Markets (4 screens)
| Screen | Why |
|---|---|
| **Market resolved** | "YES won — claim $X" with Claim payout button |
| **Comment composer** | Currently read-only; need input + reply + reactions |
| **Search results** | Existing search bar is dead; needs results page |
| **Empty Feed state** | Already exists ("All caught up") — can be improved |

### Social (3 screens)
| Screen | Why |
|---|---|
| **Other user profile** | `/u/:handle` — their markets, win rate, follow button |
| **Notifications** | Centralised inbox: market resolved, new follower, your market approved |
| **Settings** | Edit bio/avatar, notification prefs, security (export key), language, theme, logout |

### Errors & states (4 screens)
| Screen | Why |
|---|---|
| **Loading skeletons** | Hardcoded data = instant; real API needs placeholders |
| **Network error** | "No connection — retry" |
| **Generic 404** | Currently catches `/market/:id` only |
| **Tx failed/rejected** | Insufficient gas, wrong network, user cancelled |

**MVP total: ~20 new screens.**

---

## ⚡ V1-tier — 1-3 months after MVP

### Discovery
- **Leaderboard** — top traders + top creators (right-rail stub today)
- **Trending / Hot markets** — separate Feed tab
- **Following feed** — only people I follow
- **Category landing** — `/markets/crypto`, `/markets/sports` with curated headers

### Creator economy
- **Creator dashboard** — accrued fees, top markets, withdraw fees button
- **Creator analytics** — engagement per market (views, swipes, trades, sentiment over time)
- **Creator subscribers list** — followers / following

### Markets deeper
- **Dispute view** — UMA challenge window with countdown, bond input
- **Order book / depth** — real levels (current: stub text)
- **Trades history per market** — real ledger with side/size filters
- **Holders view** — anonymous % distribution

### Social
- **Comment thread** — expand replies
- **DM / Inbox** (optional) — peer messaging
- **Share market** — OG image + copy link

---

## 🔮 V2-tier — 6+ months

- **Referral / invite** — friend bonus
- **Achievements / streaks** — gamification layer
- **Token / governance** — only if `BSR` happens
- **Risk disclosure / T&Cs** — legal long-form
- **Help / FAQ** — knowledge base
- **Multi-language** — EN/RU/ES/CN
- **Theme switcher** — light mode (currently dark-only)

---

## Navigation proposal (post-MVP)

### Mobile bottom-nav (5 max)
- Feed · Markets · `+` (create) · Trade · **Inbox** (notifications)
- Profile moves to header hamburger / left swipe

### Desktop sidebar
Top section:
- Feed · Markets · Trade · Profile · Notifications (with badge)

Bottom section:
- "Roll a market" CTA (kept)
- Wallet widget with USDC balance + Deposit button
- Settings cog + user-card

### URL inventory after MVP
```
/                Feed                              ✓
/markets         Markets list                      ✓
/market/:id      Market detail                     ✓
/trade           Portfolio                         ✓
/profile         My profile                        ✓
/u/:handle       Other user profile                NEW MVP
/wallet          Deposit/withdraw/balances         NEW MVP
/notifications   Inbox                             NEW MVP
/settings        Settings                          NEW MVP
/search?q=       Search results                    NEW MVP
/welcome         Splash                            NEW MVP
/terms           Legal                             NEW MVP
/leaderboard     Top users                         NEW V1
/creator         Creator dashboard                 NEW V1
/help            FAQ                               NEW V2
```

---

## Suggested sprint split

**Sprint 1 — Auth & Wallet (1.5 weeks)**
1. Welcome / splash
2. Sign-in modal
3. Wallet-created success
4. Deposit USDC
5. Withdraw USDC
6. Tx status modal
7. Settings (minimal: bio, logout, export key)

**Sprint 2 — Social MVP (1 week)**
1. Other user profile
2. Notifications
3. Comment composer
4. Follow / unfollow

**Sprint 3 — Resolution & money flow (1 week)**
1. Market resolved view
2. Claim payout flow
3. Wallet history (deposits/withdraws/payouts)

**Sprint 4 — Discovery (1 week)**
1. Search results
2. Leaderboard
3. Trending / Following tabs in Feed

**Sprint 5 — Creator & polish (1 week)**
1. Creator dashboard
2. Tx-failed / network-error states
3. Skeletons everywhere
4. Geo-block screen
5. T&Cs / Risk disclosure

**Total: ~5 weeks of frontend-only work to a launch-ready V1.**
Backend (Phase 1 of web3 roadmap) can run in parallel.

---

## Quick-win prototype enhancements

If you only want the demo to feel more "complete" (without building real auth/wallet/backend):

1. **Welcome / sign-in modal** (visual stub, no real auth) — 1h
2. **Other user profile** `/u/macro_vlad` — reuse `MobileProfile` with different data — 1h
3. **Notifications** `/notifications` — list of 5 hardcoded events — 30min
4. **Settings stub** — 4 sections with toggles — 30min

These four take an afternoon and bring the demo to **9 screens visible**, much more credible to investors.
