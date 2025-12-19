// Generate realistic OHLCV data for AAPL
export interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CorporateAction {
  timestamp: number
  type: "earnings" | "dividend" | "split"
  text: string
  description: string
}

export interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  category: "index" | "stock"
}

// Generate EOD data from August 2024 to December 2024
export function generateCandleData(): CandleData[] {
  const data: CandleData[] = []
  let basePrice = 195
  const startDate = new Date("2024-07-01")
  const endDate = new Date("2024-12-10")

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue

    const volatility = 0.02 + Math.random() * 0.02
    const trend = Math.sin(data.length / 30) * 0.3 + 0.15
    const change = (Math.random() - 0.5 + trend) * volatility

    const open = basePrice
    const close = basePrice * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.015)
    const low = Math.min(open, close) * (1 - Math.random() * 0.015)
    const volume = Math.floor(30000000 + Math.random() * 50000000)

    data.push({
      timestamp: d.getTime(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    })

    basePrice = close
  }

  return data
}

// Corporate actions for AAPL
export function getCorporateActions(): CorporateAction[] {
  return [
    {
      timestamp: new Date("2024-08-01").getTime(),
      type: "earnings",
      text: "E",
      description: "Q3 2024 Earnings Release - EPS: $1.40 vs $1.35 expected",
    },
    {
      timestamp: new Date("2024-08-09").getTime(),
      type: "dividend",
      text: "D",
      description: "Quarterly Dividend: $0.25 per share",
    },
    {
      timestamp: new Date("2024-11-01").getTime(),
      type: "earnings",
      text: "E",
      description: "Q4 2024 Earnings Release - EPS: $1.64 vs $1.60 expected",
    },
    {
      timestamp: new Date("2024-11-08").getTime(),
      type: "dividend",
      text: "D",
      description: "Quarterly Dividend: $0.25 per share",
    },
  ]
}

// Watchlist data
export function getWatchlistData(): WatchlistItem[] {
  return [
    { symbol: "SPX", name: "S&P 500", price: 6901.01, change: 14.32, changePercent: 0.21, category: "index" },
    { symbol: "NDQ", name: "NASDAQ 100", price: 25686.68, change: -89.75, changePercent: -0.35, category: "index" },
    { symbol: "DJI", name: "Dow Jones", price: 48704.07, change: 646.26, changePercent: 1.34, category: "index" },
    { symbol: "VIX", name: "Volatility Index", price: 14.85, change: -0.92, changePercent: -5.83, category: "index" },
    { symbol: "DXY", name: "US Dollar Index", price: 98.382, change: 0.048, changePercent: 0.05, category: "index" },
    { symbol: "AAPL", name: "Apple Inc", price: 278.03, change: -0.75, changePercent: -0.27, category: "stock" },
    { symbol: "TSLA", name: "Tesla Inc", price: 446.89, change: -4.56, changePercent: -1.01, category: "stock" },
    { symbol: "NFLX", name: "Netflix Inc", price: 94.09, change: 1.38, changePercent: 1.49, category: "stock" },
  ]
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + "B"
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + "M"
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + "K"
  return volume.toString()
}

export function formatPrice(price: number): string {
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
