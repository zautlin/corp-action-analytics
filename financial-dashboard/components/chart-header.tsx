"use client"

export function ChartHeader() {
  return (
    <div className="px-4 py-2 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Apple Inc</span>
            <span className="text-muted-foreground">· 1D · NASDAQ</span>
            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>
              O <span className="text-foreground">548.79</span>
            </span>
            <span>
              H <span className="text-foreground">545.56</span>
            </span>
            <span>
              L <span className="text-foreground">538.14</span>
            </span>
            <span>
              Close <span className="text-foreground">165.23</span>
            </span>
            <span>
              Volume: <span className="text-foreground">36.44M</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-destructive font-semibold">$33.01 SELL</span>
            <span className="text-muted-foreground">0.00</span>
            <span className="text-success font-semibold">$33.01 BUY</span>
          </div>
        </div>
      </div>
    </div>
  )
}
