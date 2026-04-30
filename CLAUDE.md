# CLAUDE.md - Ameizin Agent Notes

Short project context for coding agents. Keep this file compact; prefer reading the relevant source files when details are needed.

## Project

Ameizin is a Vietnamese stock market dashboard built with Next.js App Router.

- Runtime: Next.js `16.2.4`, React `19.2.4`, TypeScript `5`
- UI: TailwindCSS `4`, Ant Design `6`, Recharts
- State/data: Zustand for persisted watchlist, TanStack Query for client fetching
- Data source: static JSON in `public/data`; crawlers refresh those files
- Tracked symbols: `VNM VIC VHM HPG FPT MBB MSN VCB TCB SSI VRE SAB GAS PLX BVH ACB STB TPB VPB HDB`
- Indices: `VNINDEX`, `HNXINDEX`, `UPCOMINDEX`

Important: this repo uses a newer Next.js version with possible breaking changes. Before changing Next-specific APIs or file conventions, read the relevant docs under `node_modules/next/dist/docs/`.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
npm run crawl    # TypeScript crawler -> public/data/*.json
python scripts/crawl.py  # Python/vnstock crawler, when Python deps are installed
```

Python deps are in `requirements.txt`. Local env examples are in `.env.example`.

## Key Paths

- `src/app/` - routes, layouts, pages
- `src/app/page.tsx` - homepage
- `src/app/stock/[symbol]/page.tsx` and `StockDetailPage.tsx` - stock detail route
- `src/app/watchlist/page.tsx` - watchlist route
- `src/features/market-overview/` - homepage feature UI
- `src/features/stock-detail/` - stock detail feature UI
- `src/features/watchlist/` - watchlist feature UI
- `src/components/charts/` - chart wrappers
- `src/components/ui/` - shared UI states/widgets
- `src/components/layout/` - header/footer/layout pieces
- `src/hooks/` - React Query and feature hooks
- `src/services/market.ts` - main data orchestration/fallback layer
- `src/services/providers/static-data.ts` - fetch JSON from `public/data`
- `src/services/providers/mock.ts` - fallback/demo data
- `src/stores/app-store.ts` - Zustand persisted app state
- `src/types/` - domain types
- `src/utils/` - formatting, finance, export helpers
- `scripts/crawl.ts` - Node/TypeScript crawler entry
- `scripts/crawl.py` and `scripts/crawlers/` - Python/vnstock crawler
- `public/data/` - generated market JSON served to the app
- `docs/tier2-ui-plan.md` - UI planning notes

## Data Files

Expected generated files:

- `market-indices.json`
- `stock-prices.json`
- `top-gainers.json`
- `top-losers.json`
- `top-volume.json`
- `history-{SYMBOL}.json`
- `_meta.json`

Python crawler modules may also generate financial/company data depending on the current implementation.

## Data Flow

1. Crawler fetches/derives market data.
2. JSON is written to `public/data`.
3. Provider layer reads `/data/*.json` from the browser/app.
4. `src/services/market.ts` normalizes orchestration and fallback behavior.
5. Hooks/features render indices, stock tables, charts, detail metrics, and watchlist state.

Top movers are derived from stock prices, not fetched as separate market endpoints unless the implementation changes.

## Coding Rules

- Follow existing file/module boundaries before adding new abstractions.
- Prefer typed domain models from `src/types`; avoid `any`.
- Use `@/*` imports for source files.
- Add `"use client"` only for components using hooks, browser APIs, event handlers, or client-only libraries.
- Keep data fetching and fallback logic in `src/services` or hooks, not scattered through components.
- Keep UI components focused on rendering; keep calculations in services/utils when shared.
- Preserve static-data-first behavior; mock data is fallback/dev support.
- Do not silently swallow crawler/data errors. Log enough context and continue per-symbol where possible.
- Do not break localStorage watchlist persistence in `src/stores/app-store.ts`.
- Run `npm run lint` and, for meaningful changes, `npm run build` when practical.

## UI Notes

- Dashboard UI should be dense, readable, and operational, not a marketing page.
- Use existing Ant Design, Tailwind, Recharts, and local component patterns.
- Keep color semantics consistent: positive/up is green, negative/down is red.
- Ensure table/chart states cover loading, error, empty, and stale data where relevant.
- Avoid layout shifts in tables, cards, chart containers, and compact controls.

## Env

Common variables:

```bash
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_BASE_PATH=
KBS_API_URL=
VNSTOCK_API_KEY=
```

Public `NEXT_PUBLIC_*` values are bundled into browser code. Keep secrets server-side only.

## Troubleshooting

- Data 404: check `public/data`, run `npm run crawl`, then restart dev server.
- Mock data appears unexpectedly: check `NEXT_PUBLIC_ENABLE_MOCK_DATA`.
- API crawler fails: verify `KBS_API_URL`; try `python scripts/crawl.py`.
- Python crawler import error: install `pip install -r requirements.txt`.
- `@/types` or alias errors: check `tsconfig.json` paths.
- React Query refetches too often: verify stable `queryKey`, `staleTime`, `gcTime`, and `enabled`.
- Watchlist lost after refresh: inspect Zustand persist key and browser localStorage.

## Commit Style

Use clear conventional-ish messages:

```text
feat: add stock detail metrics
fix: handle missing historical data
docs: shorten agent project notes
refactor: simplify market data provider
```
