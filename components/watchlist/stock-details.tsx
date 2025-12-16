"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateCandleData, formatVolume } from "@/lib/dummy-data"
import { ExternalLink, Grid3X3, Pencil, MoreHorizontal, Sparkles } from "lucide-react"

interface StockDetailsProps {
  symbol: string
}

const stockInfo: Record<string, { name: string; sector: string; industry: string }> = {
  AAPL: { name: "Apple Inc", sector: "Electronic Technology", industry: "Telecommunications Equipment" },
  TSLA: { name: "Tesla Inc", sector: "Consumer Durables", industry: "Motor Vehicles" },
  NFLX: { name: "Netflix Inc", sector: "Technology Services", industry: "Internet Software/Services" },
}

export function StockDetails({ symbol }: StockDetailsProps) {
  const candleData = useMemo(() => generateCandleData(), [])
  const latestCandle = candleData[candleData.length - 1]
  const previousCandle = candleData[candleData.length - 2]

  const priceChange = latestCandle.close - previousCandle.close
  const percentChange = (priceChange / previousCandle.close) * 100
  const isPositive = priceChange >= 0

  const info = stockInfo[symbol] || { name: symbol, sector: "N/A", industry: "N/A" }

  return (
    <ScrollArea className="flex-1">
      <div className="p-3">
        {/* Symbol Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {symbol.slice(0, 2)}
            </div>
            <span className="text-lg font-semibold">{symbol}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{info.name}</span>
            <ExternalLink className="h-3 w-3" />
            <span>· NASDAQ</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {info.sector} · {info.industry}
          </div>
        </div>

        {/* Price Display */}
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono">{latestCandle.close.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">USD</span>
            <span className={`text-sm font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)} {percentChange.toFixed(2)}%
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
              Market closed
            </span>
            <span>Last update at 11:59 GMT+11</span>
          </div>
        </div>

        {/* News/Insights */}
        <div className="mt-4 rounded-lg bg-accent/50 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-blue-500" />
            <div className="flex-1 text-xs">
              <p className="text-foreground">
                TrendForce reports that {info.name} faces challenges from rising memory prices in early 2026,
                potentially impacting profit margins and pricing strategies.
              </p>
              <Button variant="ghost" size="sm" className="mt-1 h-5 px-0 text-xs text-blue-500">
                Read more →
              </Button>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Key stats</h4>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next earnings report</span>
              <span className="font-medium">In 48 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume</span>
              <span className="font-mono">{formatVolume(latestCandle.volume)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Day High</span>
              <span className="font-mono">{latestCandle.high.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Day Low</span>
              <span className="font-mono">{latestCandle.low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">52W High</span>
              <span className="font-mono">{(latestCandle.high * 1.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">52W Low</span>
              <span className="font-mono">{(latestCandle.low * 0.65).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-mono">3.42T</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">P/E Ratio</span>
              <span className="font-mono">31.45</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
