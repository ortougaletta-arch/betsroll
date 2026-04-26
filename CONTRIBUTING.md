# Contributing to Betsroll

Short guide. The aim is to keep the codebase consistent, the dev loop fast, and the screens pixel-close to the design system.

## Setup

```bash
git clone https://github.com/ortougaletta-arch/betsroll.git
cd betsroll
npm install
npm run dev
```

Node 20+ recommended. Tested against Node 25 and npm 11.

## Code style

- **TypeScript strict** — no `any`, prefer discriminated unions over loose objects.
- **Plain CSS** with CSS variables from `src/styles/global.css`. **No Tailwind, no styled-components, no CSS-in-JS libraries.** Inline `style={{ … }}` objects and the existing utility classes (`.mono`, `.pulse`, `.roll`, `.gradient-text`, `.noscroll`, etc.) are the toolkit.
- **No dependency creep.** Before adding a npm package, ask: can the same be done in 30 lines of TS? Vite + React + React Router + Vitest is the foundation; everything else has to justify itself.
- **Components** — small files, one responsibility. If a component grows past ~250 lines, split it.
- **State** — global state goes through `src/state/useStore.ts`. Component-local UI state is fine (`useState` for toggles, modals, drag offsets). Avoid prop-drilling more than 2 levels.
- **No emojis in UI** unless they were already there in the design (🎲, 💰, 🔒, ⬆, etc.). Don't add new ones casually.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[body]
```

Types:
- `feat` — user-visible new feature
- `fix` — bug fix
- `chore` — build, deploy, deps
- `test` — only tests
- `docs` — only docs
- `refactor` — code change that doesn't add features or fix bugs
- `style` — visual polish

Scopes used so far: `mobile-feed`, `mobile-market`, `mobile-profile`, `markets`, `trade`, `desktop`, `desktop-feed`, `desktop-market`, `primitives`, `state`, `data`, `shell`, `seo`, `deploy`, `modal`, `guards`, `sell`, `markets+voting`.

The body should explain **why**, not just what. The diff is the what.

## Workflow

1. Pick something from `docs/superpowers/specs/2026-04-20-screens-roadmap.md` or open an issue.
2. Branch off `main`: `git checkout -b feat/scope-short-name`. (For solo dev, working on `main` is fine too — every push deploys.)
3. **Run tests before pushing:** `npm test && npm run build`. Both must pass.
4. **Keep commits small** — one logical change per commit. Squash later if needed.
5. Push. The GitHub Action builds and deploys to Pages automatically.

## Adding a new screen

1. Add the route in `src/App.tsx`.
2. Create the page wrapper in `src/routes/<Page>.tsx` — picks mobile/desktop variant via `useViewport()`.
3. Build the mobile component in `src/components/mobile/`.
4. Build the desktop component in `src/components/desktop/` (often you can reuse the mobile inside a desktop shell).
5. If you need new state, extend `Store` in `src/state/types.ts`, then add an action to `useStore.ts`.
6. Add a vitest unit if the action has logic worth testing.
7. Update `CHANGELOG.md` and the routes section in `README.md`.
8. Manually test the smoke matrix: load it, navigate to it from nav, refresh, check state persistence.

## Adding a new primitive

1. One file per primitive in `src/components/primitives/`.
2. Take props through a typed object, default values inline. No `forwardRef` unless the consumer truly needs it.
3. Use CSS variables for colours; never hardcode `#9ef01a` — write `var(--yes)`.
4. Keep the primitive small enough to read in one page (<150 lines). If it's bigger, it's not a primitive.

## Testing

- Unit tests live next to the file being tested as `*.test.ts`.
- Run `npm test` (vitest in watch mode: `npx vitest`).
- Test environment is `happy-dom` with a localStorage shim from `src/test-setup.ts`.
- For UI components we don't have automated tests — use the manual smoke matrix in the design spec.

## Pull requests (when collaborating)

- One feature per PR. Keep the diff under ~400 lines if possible; reviewers stop reading.
- PR description should answer:
  - **Why?** the user-facing or technical problem
  - **What?** key changes (file names + behaviour)
  - **How to test?** click-by-click steps
  - **Risks?** what could break, how to roll back
- Self-review with `git diff origin/main` before requesting review.

## Things to avoid

- **Don't change `Settings → Pages → Source`** away from "GitHub Actions" in the GitHub UI. It will break the live site. Use the `gh` CLI command in the README to fix if it happens.
- **Don't commit `node_modules`, `dist`, `.tsbuild`, `*.tsbuildinfo`.** They're already in `.gitignore`.
- **Don't add a new dep without removing two.** Bundle size is a feature.
- **Don't break the design system.** If you need a new colour or shadow, add it to `:root` in `global.css`, don't sprinkle it inline.
- **Don't hardcode market IDs in components.** All market lookups go through `useAllMarkets()` so user-created markets work too.

## Bug reports

- Repro steps
- Expected vs actual
- Browser + OS
- Screenshot or screen recording for UI bugs
- DevTools console for JS errors

## Questions?

Open an issue or DM the maintainer.
