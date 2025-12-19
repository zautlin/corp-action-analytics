"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChartHeader } from "@/components/chart-header"
import { CandlestickVolumeChart } from "@/components/candlestick-volume-chart"
import { Watchlist } from "@/components/watchlist"
import { StockInfo } from "@/components/stock-info"
import { StockDetails } from "@/components/stock-details"
import { CorporateActions } from "@/components/corporate-actions"
import { Search, Plus, BarChart3, Bell, Play, ChevronDown } from "lucide-react"

export function TradingDashboard() {
  const [timeframe, setTimeframe] = useState("1D")

  const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"]

  return (
    <div className="h-screen flex flex-col bg-background text-foreground dark">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border px-4 h-12 bg-card/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="AAPL"
              className="bg-transparent border-none outline-none text-sm font-medium w-20"
              defaultValue="AAPL"
            />
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="h-7 px-2.5 text-xs"
              >
                {tf}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              Indicators
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              <Bell className="w-3.5 h-3.5" />
              Alert
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              <Play className="w-3.5 h-3.5" />
              Replay
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
            Watchlist
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-border bg-card/30 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold">Corporate Actions</h2>
          </div>
          <div className="p-4">
            <CorporateActions />
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          <ChartHeader />
          <div className="flex-1">
            <CandlestickVolumeChart timeframe={timeframe} />
          </div>
        </div>

        <div className="w-80 border-l border-border bg-card/30 overflow-y-auto">
          <StockDetails />
          <div className="border-t border-border">
            <Watchlist />
          </div>
          <div className="border-t border-border">
            <StockInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
