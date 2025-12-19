"use client"

const indices = [
  { symbol: "SPX", name: "SPX", price: "6,901.01", change: "+14.52", percent: "+0.21%", isUp: true },
  { symbol: "NDQ", name: "NDQ", price: "25,086.68", change: "+84.05", percent: "+0.34%", isUp: true },
  { symbol: "DJI", name: "DJI", price: "48,704.07", change: "+646.45", percent: "+1.35%", isUp: true },
  { symbol: "VIX", name: "VIX", price: "14.65", change: "-0.92", percent: "-5.91%", isUp: false },
]

export function Watchlist() {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Symbol"
            className="bg-secondary border border-border rounded px-2 py-1 text-xs w-32 outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center text-[10px] text-muted-foreground mb-2 font-medium">
          <div className="flex-1">Symbol</div>
          <div className="w-20 text-right">Last</div>
          <div className="w-16 text-right">Chg</div>
          <div className="w-16 text-right">Chg%</div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
            <span className="text-[10px]">▼</span>
            INDICES
          </div>
          {indices.map((index) => (
            <div
              key={index.symbol}
              className="flex items-center py-1.5 hover:bg-secondary/50 rounded px-1 cursor-pointer"
            >
              <div className="flex-1">
                <div className="text-xs font-medium flex items-center gap-1.5">
                  <span className="text-primary text-[10px]">{index.symbol}</span>
                  <span className="text-foreground">{index.name}</span>
                </div>
              </div>
              <div className="w-20 text-right text-xs font-medium">{index.price}</div>
              <div className={`w-16 text-right text-xs ${index.isUp ? "text-success" : "text-destructive"}`}>
                {index.change}
              </div>
              <div className={`w-16 text-right text-xs ${index.isUp ? "text-success" : "text-destructive"}`}>
                {index.percent}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
