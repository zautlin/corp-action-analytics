"use client"

export function StockDetails() {
  // Sample stock data
  const stockData = {
    symbol: "AAPL",
    name: "Apple Inc",
    exchange: "NASDAQ",
    time: "2024-11-27",
    open: 161.72,
    high: 167.18,
    low: 161.15,
    close: 165.23,
    last: 165.23,
    volume: 36443000,
    turnover: 6021450000,
    prevClose: 165.96,
    change: -0.73,
    changePercent: -0.44,
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toFixed(2)
  }

  const formatPrice = (num: number) => num.toFixed(2)

  const detailItems = [
    { label: "Open", value: formatPrice(stockData.open), color: "text-foreground" },
    { label: "High", value: formatPrice(stockData.high), color: "text-emerald-500" },
    { label: "Low", value: formatPrice(stockData.low), color: "text-red-500" },
    { label: "Close", value: formatPrice(stockData.close), color: "text-foreground" },
    { label: "Last", value: formatPrice(stockData.last), color: "text-foreground" },
    { label: "Volume", value: formatNumber(stockData.volume), color: "text-blue-400" },
    { label: "Turnover", value: `$${formatNumber(stockData.turnover)}`, color: "text-blue-400" },
    { label: "Prev Close", value: formatPrice(stockData.prevClose), color: "text-muted-foreground" },
    {
      label: "Change",
      value: `${stockData.change > 0 ? "+" : ""}${formatPrice(stockData.change)} (${stockData.changePercent}%)`,
      color: stockData.change >= 0 ? "text-emerald-500" : "text-red-500",
    },
  ]

  return (
    <div className="p-4">
      {/* Stock Header */}
      <div className="mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">{stockData.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">{stockData.symbol}</h2>
            <p className="text-xs text-muted-foreground">{stockData.exchange}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{stockData.name}</p>
      </div>

      {/* Current Price */}
      <div className="mb-6 pb-4 border-b border-border">
        <div className="text-2xl font-bold mb-1">{formatPrice(stockData.last)}</div>
        <div className={`text-sm font-medium ${stockData.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {stockData.change > 0 ? "+" : ""}
          {formatPrice(stockData.change)} ({stockData.change > 0 ? "+" : ""}
          {stockData.changePercent}%)
        </div>
        <div className="text-xs text-muted-foreground mt-1">{stockData.time}</div>
      </div>

      {/* Stock Details */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Market Data</h3>
        {detailItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
