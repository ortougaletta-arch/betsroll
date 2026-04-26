# Betsroll — Web3 Architecture Roadmap

**Date:** 2026-04-20
**Status:** Strategic / pre-spec — awaiting per-phase deep-dives
**Premise:** Betsroll is a sovereign Web3 prediction-market platform on its own smart contracts, **not** a Polymarket wrapper.
**Network:** Base mainnet (USDC native, Coinbase Smart Wallet, low fees)

This document is a high-level reference. Each numbered phase below should get its own design spec in this folder before implementation.

---

## Architecture overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                            Betsroll App                              │
│                  React + TypeScript + Vite (current)                 │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  useWallet   │  │  useStore    │  │  useChain    │               │
│  │ (Privy/CSW)  │  │ (optimistic) │  │ (USDC, gas)  │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
   │   Privy /    │  │  Backend API │  │  Pimlico /       │
   │ Coinbase SW  │  │  Postgres +  │  │  Coinbase        │
   │ (embedded    │  │  WebSocket + │  │  Paymaster       │
   │  wallet,     │  │  indexer     │  │  (gasless ERC-   │
   │  passkey)    │  │  → on-chain  │  │  4337 bundler)   │
   └──────┬───────┘  └──────┬───────┘  └──────┬───────────┘
          │                 │ writes/reads    │
          │                 ▼                 │
          │          ┌──────────────┐         │
          │          │  The Graph   │         │
          │          │   /Goldsky/  │         │
          │          │    Envio     │         │
          │          │  (indexer)   │         │
          │          └──────┬───────┘         │
          │                 │ subscribes      │
          ▼                 ▼                 ▼
   ┌────────────────────────────────────────────────┐
   │            Smart Contracts on Base             │
   │  ┌──────────────┐  ┌────────────────────────┐  │
   │  │MarketFactory │→ │ Market (LMSR + outcome│  │
   │  │              │  │ tokens YES/NO)        │  │
   │  └──────────────┘  └──────────┬────────────┘  │
   │  ┌──────────────┐  ┌──────────▼────────────┐  │
   │  │ValidationGate│  │     CreatorFees       │  │
   │  │ (N approvals │  │ (split: creator /     │  │
   │  │  → go live)  │  │  protocol / LP)       │  │
   │  └──────────────┘  └───────────────────────┘  │
   │  ┌────────────────────────────────────────┐   │
   │  │  Resolver  →  UMA OOv3 / Chainlink     │   │
   │  │             Functions                  │   │
   │  └────────────────────────────────────────┘   │
   └────────────────────────────────────────────────┘
```

---

## Phased roadmap

### Phase 0 — Prototype (DONE)
The current app at `betsroll-app/`. UI, mocks, localStorage persistence. Used for investor demos and product feedback.

### Phase 1 — Bootstrapped backend (4–6 weeks)
Move the singleton store off `localStorage` into a real backend. Multi-user, but **no blockchain yet** — all balances/positions are paper trading on the backend.

**New stack:**
- **Postgres** for markets, comments, swipes, follows, sentiment
- **Bun + Hono** (or Node + Fastify) for HTTP API
- **Soketi** (or Ably) for WebSocket — live prices, comments, notifications
- **Redis** for hot caches and leaderboards
- **S3 / Cloudflare R2** for market images, avatars
- **Auth:** session cookie + magic-link email (Resend / Postmark)

**Deliverables:**
- Same 5 screens as today, but data comes from API
- Markets created by users persist across devices
- Comments are submittable
- Real-time price updates pushed via WS (still paper, but the plumbing works)
- Search and pagination

### Phase 2 — Wallet + USDC custody (2–3 weeks)
Plug in an embedded wallet so users can deposit real USDC, but trades are still paper-resolved on the backend (faster iteration).

**Stack:**
- **Coinbase Smart Wallet** (free, native to Base, passkey login) as default
- **Privy** as fallback for non-passkey users
- USDC deposit address = user's Smart Wallet address on Base
- Withdraw → backend signs a transfer from a custodial vault (only for now; Phase 4 makes this trustless)

**Deliverables:**
- Onboarding screen: "Sign in with Apple" → wallet created in 2 sec
- Deposit screen: QR code + address, watch backend confirms USDC arrival
- Balance widget shows on-chain USDC + paper-trading P&L
- KYC nothing yet (US/UK gating via geo only)

### Phase 3 — Smart contracts MVP (6–8 weeks + audit)
Replace paper trading with on-chain markets. **This is the "we are a Web3 product" moment.**

**Contracts (Solidity, Foundry):**
- `MarketFactory.sol` — deploys new `Market` instances, registers metadata
- `Market.sol` — LMSR AMM, holds USDC reserves, mints YES/NO outcome tokens (ERC-1155)
- `ValidationGate.sol` — wraps `Market`, tracks approval signatures from voters off-chain, only opens trading after N approvals
- `CreatorFees.sol` — pulls 1% of every trade, splits creator/protocol/LP
- `Resolver.sol` — adapter to UMA OOv3 (general yes/no) or Chainlink Functions (price/sport)
- `BetsrollAccessControl.sol` — admin pauses, fee tweaks, oracle whitelist

**Process:**
1. Develop on local Anvil + testnet Base Sepolia (4 weeks)
2. Internal test with team (1 week)
3. **External audit** (CertiK / Halborn / Trail of Bits) — $15-30k, 2-4 weeks
4. Fix audit findings (1 week)
5. Bug-bounty program (Immunefi) before mainnet
6. Mainnet deploy on Base, capped TVL initially

**Important:** vote signatures stay off-chain. The backend collects them, Phase-3 contract verifies aggregated signature in a single `goLive(marketId, signatures[])` call when threshold is hit.

### Phase 4 — Real on-chain trading (2–3 weeks)
Migrate trading from backend paper to on-chain orders. This is mostly UI + state plumbing — contracts are already deployed in Phase 3.

**Changes:**
- `actions.rollBet` now signs an EIP-712 trade order, sends to Pimlico bundler with gas sponsorship
- Pending tx UI in corner (like Uniswap)
- Optimistic local update + rollback on revert
- Real positions = ERC-1155 outcome token balances; backend indexer materializes them into the Profile UI
- Withdraw becomes trustless: user signs from Smart Wallet directly

### Phase 5 — Resolution v1 (2–3 weeks)
Markets resolve to YES or NO and pay out the winning side.

**Mechanics:**
- For yes/no markets: anyone can call `Resolver.proposeAnswer(marketId, outcome)` → bond posted → 24h UMA dispute window → `Market.resolve(outcome)` pays out winners pro-rata
- For price/sport: `Chainlink Functions` callback, no dispute window (data is on-chain truth)
- Winners auto-claim: backend sends a tx batch to claim everyone in one go (or users self-claim)
- Loser positions just expire to zero, no extra UX

### Phase 6 — Creator economy (2 weeks)
Wire up the Betsroller-card promise: creators get paid.

- Creator-fee splits stream from `CreatorFees.sol` per trade
- Profile shows accrued fees, "Withdraw fees" button executes on-chain claim
- Leaderboard of top creators by fees-earned
- Optional: tier-gated access to "premium" market categories

### Phase 7 — Tokenomics (4–8 weeks, optional, juridically heavy)
Launch a `BSR` utility/governance token.

- Possible utilities: discount on fees, vote weight in protocol changes, validation rewards, LP incentives
- **Legal:** must be reviewed by securities lawyer in target jurisdictions (Cayman foundation typical for non-US issuers)
- Distribution: airdrop to early users + VIP tier multipliers + LP mining + team/treasury vesting
- Skip if scope creep — token is not required for the product to work

---

## Voting: on-chain or off-chain decision

**Decision: off-chain signatures, on-chain commitment.**

Rationale: swipes are massive (10-100/day per user). Each swipe as an on-chain tx would burn $$$ in gas-sponsorship without commensurate value. The vote weight that matters is the aggregate, which we commit on-chain when the market crosses N approvals.

Implementation:
1. Backend stores votes (Postgres)
2. When a swipe lands → backend asks user's wallet to sign `EIP-712(MarketVote{marketId, choice, deadline, nonce})` (free, no gas)
3. When `count(approvals) >= 100` → backend bundles signatures, sends one tx to `ValidationGate.goLive(marketId, signatures[])`
4. Contract verifies threshold and flips `Market.status = 'live'`

Payouts to validators (incentive): on `goLive`, contract emits `ValidatedMarket(marketId, validators[])` event; backend airdrops VIP-pts. Or pay tiny USDC per validation (only when market actually goes live, to fight spam).

---

## What stays from the prototype

These are real product foundations and don't need to be rewritten:
- Whole design system (CSS variables, primitives, motifs)
- All 5 screens and their interactions
- Swipe mechanics, Buy/Sell toggle, Trade screen
- React + TS + Vite + HashRouter
- Component split (mobile/desktop/primitives/routes)
- TypeScript types and store shape (extended with on-chain tx state)
- Vitest test scaffolding

The `useStore` evolves from a localStorage singleton to an optimistic-update layer on top of API + on-chain reads, but the **action signatures** (`voteMarket`, `rollBet`, `sellPosition`, `createMarket`) stay nearly identical — UI components don't need rewriting.

---

## What disappears

- Polymarket API (was placeholder, never relevant for sovereign rollup)
- localStorage as primary store (becomes optimistic cache only)
- Hardcoded MARKETS / SEED_POSITIONS / SEED_HISTORY (become DB seeds for dev)
- Static creator handles → real on-chain addresses + ENS / Basename resolution
- Static prices → live indexer-pushed updates

---

## Costs ballpark (USD, monthly at 10k MAU)

| Component | Cost |
|---|---|
| Backend hosting (Bun + Postgres + Redis on Render/Fly) | $200-500 |
| WebSocket (Soketi self-hosted) | $50 |
| Indexer (Goldsky / Envio managed) | $100-300 |
| Privy embedded wallets (free tier covers <1k MAU) | $0-500 |
| Pimlico paymaster (~$0.02 per tx, 50 tx/MAU/mo) | ~$10k for 10k MAU |
| UMA bonds (sometimes refundable) | $50-200 |
| S3/R2 storage | $20 |
| Cloudflare DNS + WAF | $20 |
| Domain, email, monitoring (Sentry, Vercel Logs) | $100 |
| **Total (pre-token, ignoring team payroll)** | **~$11k/month** |

Audit (one-time, Phase 3): $15-30k.

Team size to ship Phases 1-5 in 6 months: 2 fullstack + 1 Solidity + 1 designer. Assume $30-50k/month combined (depending on geography). Total burn through Phase 5: ~$300k.

---

## Questions to resolve before Phase 1

1. **Geo strategy:** which jurisdictions are in/out of bounds at launch? Affects Privy region settings, IP-block, T&Cs.
2. **Custody model in Phase 2:** custodial vault is fastest but creates regulatory exposure. Acceptable for closed beta?
3. **Token strategy:** decide early whether `BSR` is on the roadmap. Affects audit scope and contract design (ERC-20 hooks, governance).
4. **AMM choice:** LMSR vs CPMM. LMSR for low-liquidity bootstrap, CPMM if you have LP partners ready.
5. **Initial subsidy per market:** Polymarket subsidizes new markets with $50-500 LMSR liquidity. Where does our subsidy come from?
6. **Validation threshold N:** how many approval signatures to go live? Spec says "100" but no math behind it.
7. **Fee schedule:** 1% trade fee total, but 0.6% / 0.3% / 0.1% by tier — who eats the difference (LP/protocol/creator)?
8. **Market categories:** free-form or curated? Affects creator-spam risk.

---

## Next deliverables

When you're ready, take **one phase** and we write a per-phase implementation spec like the one in `2026-04-20-betsroll-design.md`. Recommended order:

1. **Phase 1 spec** — backend + auth + WebSocket + market list. Detailed schema, endpoints, migration plan.
2. **Phase 2 spec** — wallet integration. UX flows, deposit/withdraw screens.
3. **Phase 3 spec** — contracts. Per-contract interface, invariants, audit checklist.

Or: **dispatch Codex** to draft Phase 1 spec from a different angle and compare results.
