"use client"

import { ExternalLink, Grid3x3, Pencil, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StockInfo() {
  return (
    <div className="p-4">
      {/* Stock Card */}
      <div className="bg-primary/10 rounded-lg p-4 mb-4 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">AA</span>
            </div>
            <span className="text-primary font-semibold text-xs">AAPL</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Grid3x3 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="mb-1">
          <div className="text-[10px] text-muted-foreground mb-0.5">Apple Inc ∘ NASDAQ</div>
          <div className="text-[9px] text-muted-foreground">Electronic Technology · Telecommunications Equipment</div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold">489.14</span>
          <span className="text-xs text-muted-foreground">USD</span>
        </div>

        <div className="flex items-center gap-2 text-xs mb-3">
          <span className="text-destructive font-semibold">-2.07 -0.42%</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>◆ Market closed</span>
            <span>Last update at 11:59 GMT+11</span>
          </div>
        </div>

        <div className="bg-card/50 rounded p-3 border border-border">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ExternalLink className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-[11px] leading-relaxed mb-1.5">
                TrendForce reports that Apple Inc faces challenges from rising memory prices in early 2025, potentially
                impacting profit margins and pricing strategies.
              </p>
              <button className="text-primary text-[10px] font-medium hover:underline">Read more →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div>
        <h3 className="text-xs font-semibold mb-3">Key stats</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Next earnings report</span>
            <span className="font-medium">In 48 days</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-medium">72.23M</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Day High</span>
            <span className="font-medium">493.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Day Low</span>
            <span className="font-medium">488.34</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">52W High</span>
            <span className="font-medium">566.95</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">52W Low</span>
            <span className="font-medium">317.42</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-medium">3.42T</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">P/E Ratio</span>
            <span className="font-medium">31.45</span>
          </div>
        </div>
      </div>

      {/* Corporate Actions */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold mb-3">Corporate Actions</h3>
        <div className="space-y-2">
          <div className="bg-card/50 rounded p-2.5 border border-border">
            <div className="flex items-start gap-2">
              <div className="w-1 h-full bg-success rounded-full mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Dividend</span>
                  <span className="text-[10px] text-muted-foreground">Nov 2024</span>
                </div>
                <p className="text-[11px] text-muted-foreground">$0.25 per share</p>
              </div>
            </div>
          </div>

          <div className="bg-card/50 rounded p-2.5 border border-border">
            <div className="flex items-start gap-2">
              <div className="w-1 h-full bg-primary rounded-full mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Stock Split</span>
                  <span className="text-[10px] text-muted-foreground">Aug 2024</span>
                </div>
                <p className="text-[11px] text-muted-foreground">4-for-1 split</p>
              </div>
            </div>
          </div>

          <div className="bg-card/50 rounded p-2.5 border border-border">
            <div className="flex items-start gap-2">
              <div className="w-1 h-full bg-accent rounded-full mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Acquisition</span>
                  <span className="text-[10px] text-muted-foreground">Jun 2024</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Acquired AI startup for $2.1B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
