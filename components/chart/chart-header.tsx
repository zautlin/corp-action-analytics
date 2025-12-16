"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BarChart3, Bell, Play } from "lucide-react"
import { generateCandleData, formatVolume } from "@/lib/chart-dummy-data"
import { useMemo } from "react"

interface ChartHeaderProps {
  symbol: string
  timeframe: string
  onTimeframeChange: (tf: string) => void
}

const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"]

export function ChartHeader({ symbol, timeframe, onTimeframeChange }: ChartHeaderProps) {
  const candleData = useMemo(() => generateCandleData(), [])
  const latestCandle = candleData[candleData.length - 1]
  const previousCandle = candleData[candleData.length - 2]

  const priceChange = latestCandle.close - previousCandle.close
  const percentChange = (priceChange / previousCandle.close) * 100
  const isPositive = priceChange >= 0

  return (
    <div className="border-b border-border bg-card px-4 py-2">
      {/* Top Row */}
      <div className="flex items-center gap-3">
        {/* Search & Symbol */}
        <Button variant="ghost" size="sm" className="gap-2 font-semibold">
          <Search className="h-4 w-4" />
          {symbol}
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 border-l border-border pl-3">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 border-l border-border pl-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <BarChart3 className="h-4 w-4" />
            Indicators
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Bell className="h-4 w-4" />
            Alert
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Play className="h-4 w-4" />
            Replay
          </Button>
        </div>
      </div>

      {/* Bottom Row - OHLCV Info */}
      <div className="mt-2 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Apple Inc</span>
          <span className="text-muted-foreground">· 1D · NASDAQ</span>
          <Badge variant="secondary" className="h-5 text-xs">
            <span className={isPositive ? "text-success" : "text-destructive"}>●</span>
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span>
            <span className="text-muted-foreground">O</span>
            <span className="ml-1 font-mono">{latestCandle.open.toFixed(2)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">H</span>
            <span className="ml-1 font-mono">{latestCandle.high.toFixed(2)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">L</span>
            <span className="ml-1 font-mono">{latestCandle.low.toFixed(2)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">C</span>
            <span className={`ml-1 font-mono ${isPositive ? "text-success" : "text-destructive"}`}>
              {latestCandle.close.toFixed(2)}
            </span>
          </span>
          <span className={isPositive ? "text-success" : "text-destructive"}>
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <span className="text-xs">
            <span className="text-muted-foreground">Vol</span>
            <span className="ml-1 font-mono text-success">{formatVolume(latestCandle.volume)}</span>
          </span>
        </div>

        {/* Buy/Sell Badges */}
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 font-mono">
            {latestCandle.close.toFixed(2)}
            <span className="ml-1 text-xs opacity-70">SELL</span>
          </Badge>
          <span className="text-xs text-muted-foreground">0.00</span>
          <Badge className="bg-success/20 text-success hover:bg-success/30 font-mono">
            {latestCandle.close.toFixed(2)}
            <span className="ml-1 text-xs opacity-70">BUY</span>
          </Badge>
        </div>
      </div>
    </div>
  )
}
