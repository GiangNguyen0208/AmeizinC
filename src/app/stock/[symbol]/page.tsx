import { StockDetailPage } from "./StockDetailPage";

const KNOWN_SYMBOLS = [
  "VNM", "VIC", "VHM", "HPG", "FPT",
  "MBB", "MSN", "VCB", "TCB", "SSI",
  "VRE", "SAB", "GAS", "PLX", "BVH",
  "ACB", "STB", "TPB", "VPB", "HDB",
];

export const dynamicParams = false;

export function generateStaticParams() {
  return KNOWN_SYMBOLS.map((symbol) => ({ symbol }));
}

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  return <StockDetailPage symbol={symbol} />;
}
