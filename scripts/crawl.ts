import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "../public/data");

const KBS_BASE = process.env.KBS_API_URL;
if (!KBS_BASE) {
  console.error("ERROR: KBS_API_URL environment variable is required");
  process.exit(1);
}

const TRACKED_SYMBOLS = [
  "VNM", "VIC", "VHM", "HPG", "FPT",
  "MBB", "MSN", "VCB", "TCB", "SSI",
  "VRE", "SAB", "GAS", "PLX", "BVH",
  "ACB", "STB", "TPB", "VPB", "HDB",
];

const INDEX_TICKERS = [
  { ticker: "VNINDEX", name: "VN-Index" },
  { ticker: "HNXINDEX", name: "HNX-Index" },
  { ticker: "UPCOMINDEX", name: "UPCOM-Index" },
];

function writeJSON(filename: string, data: unknown) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  -> ${filename}`);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parseDateRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { sdate: formatDate(start), edate: formatDate(end) };
}

interface KbsBar {
  t: string;
  o: number | string;
  h: number | string;
  l: number | string;
  c: number | string;
  v: number | string;
}

interface StockPriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  updatedAt: string;
}

function parseNum(val: number | string): number {
  return typeof val === "string" ? parseFloat(val) : val;
}

// ─── Market Indices ────────────────────────────────────────────
async function crawlMarketIndices() {
  console.log("\n[1/4] Crawling market indices...");
  const results = [];
  const { sdate, edate } = parseDateRange(7);

  for (const { ticker, name } of INDEX_TICKERS) {
    try {
      const { data } = await axios.get(
        `${KBS_BASE}/index/${ticker}/data_day`,
        { params: { sdate, edate } }
      );

      const bars: KbsBar[] = data?.data_day || [];
      if (bars.length >= 2) {
        const latest = bars[0];
        const prev = bars[1];
        const closeNow = parseNum(latest.c);
        const closePrev = parseNum(prev.c);
        const change = +(closeNow - closePrev).toFixed(2);
        const changePercent = +((change / closePrev) * 100).toFixed(2);

        results.push({
          name,
          value: +closeNow.toFixed(2),
          change,
          changePercent,
          volume: parseNum(latest.v),
          updatedAt: latest.t?.split(" ")[0] || new Date().toISOString(),
        });
        console.log(`  ${name}: ${closeNow.toFixed(2)} (${change >= 0 ? "+" : ""}${change})`);
      }
      await sleep(300);
    } catch (err) {
      console.warn(`  WARN: ${name}:`, err instanceof Error ? err.message : err);
    }
  }

  writeJSON("market-indices.json", {
    data: results,
    crawledAt: new Date().toISOString(),
  });
}

// ─── Stock Prices ──────────────────────────────────────────────
async function crawlStockPrices() {
  console.log("\n[2/4] Crawling stock prices...");
  const allPrices: Record<string, StockPriceData> = {};
  const { sdate, edate } = parseDateRange(7);

  for (const symbol of TRACKED_SYMBOLS) {
    try {
      const { data } = await axios.get(
        `${KBS_BASE}/stocks/${symbol}/data_day`,
        { params: { sdate, edate } }
      );

      const bars: KbsBar[] = data?.data_day || [];
      if (bars.length >= 2) {
        const latest = bars[0];
        const prev = bars[1];
        const closeNow = parseNum(latest.c);
        const closePrev = parseNum(prev.c);
        const change = +(closeNow - closePrev).toFixed(2);
        const changePercent = +((change / closePrev) * 100).toFixed(2);

        allPrices[symbol] = {
          symbol,
          price: closeNow,
          change,
          changePercent,
          volume: parseNum(latest.v),
          high: parseNum(latest.h),
          low: parseNum(latest.l),
          open: parseNum(latest.o),
          previousClose: closePrev,
          updatedAt: latest.t?.split(" ")[0] || new Date().toISOString(),
        };
        console.log(`  ${symbol}: ${closeNow} (${change >= 0 ? "+" : ""}${change})`);
      }
      await sleep(200);
    } catch (err) {
      console.warn(`  WARN: ${symbol}:`, err instanceof Error ? err.message : err);
    }
  }

  writeJSON("stock-prices.json", {
    data: allPrices,
    crawledAt: new Date().toISOString(),
  });

  return allPrices;
}

// ─── Top Movers (derived from stock prices) ────────────────────
function deriveTopMovers(allPrices: Record<string, StockPriceData>) {
  console.log("\n[3/4] Deriving top movers...");
  const stocks = Object.values(allPrices).map((s) => ({
    symbol: s.symbol,
    companyName: s.symbol,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
    volume: s.volume,
  }));

  const gainers = stocks
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);

  const losers = stocks
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 10);

  const topVol = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  const now = new Date().toISOString();
  writeJSON("top-gainers.json", { data: gainers, crawledAt: now });
  writeJSON("top-losers.json", { data: losers, crawledAt: now });
  writeJSON("top-volume.json", { data: topVol, crawledAt: now });

  console.log(`  Gainers: ${gainers.length}, Losers: ${losers.length}, TopVol: ${topVol.length}`);
}

// ─── Historical Prices ─────────────────────────────────────────
async function crawlHistoricalPrices() {
  console.log("\n[4/4] Crawling historical prices (365 days)...");
  const { sdate, edate } = parseDateRange(365);

  for (const symbol of TRACKED_SYMBOLS) {
    try {
      const { data } = await axios.get(
        `${KBS_BASE}/stocks/${symbol}/data_day`,
        { params: { sdate, edate } }
      );

      const bars: KbsBar[] = data?.data_day || [];
      const history = bars
        .map((bar) => ({
          date: bar.t?.split(" ")[0],
          open: parseNum(bar.o),
          high: parseNum(bar.h),
          low: parseNum(bar.l),
          close: parseNum(bar.c),
          volume: parseNum(bar.v),
        }))
        .reverse();

      writeJSON(`history-${symbol}.json`, {
        symbol,
        data: history,
        crawledAt: new Date().toISOString(),
      });
      console.log(`  ${symbol}: ${history.length} bars`);
      await sleep(200);
    } catch (err) {
      console.warn(`  WARN: ${symbol}:`, err instanceof Error ? err.message : err);
    }
  }
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  console.log("=== Ameizin Data Crawler ===");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Data dir:  ${DATA_DIR}`);
  console.log(`KBS API:   ${KBS_BASE}`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  await crawlMarketIndices();
  const allPrices = await crawlStockPrices();
  deriveTopMovers(allPrices);
  await crawlHistoricalPrices();

  writeJSON("_meta.json", {
    crawledAt: new Date().toISOString(),
    trackedSymbols: TRACKED_SYMBOLS,
    source: "KBS (KB Securities)",
  });

  console.log("\n=== Crawl complete ===");
}

main().catch((err) => {
  console.error("Crawl failed:", err);
  process.exit(1);
});
