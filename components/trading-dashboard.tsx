"use client"

import { useState } from "react"
import { ChartHeader } from "./chart/chart-header"
import { CandlestickChart } from "./chart/candlestick-chart"
import { Watchlist } from "./watchlist/watchlist"
import { StockDetails } from "./watchlist/stock-details"
import { ToolsSidebar } from "./chart/tools-sidebar"

export function TradingDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [timeframe, setTimeframe] = useState("1D")

  return (
    <div className="flex h-screen bg-background">
      {/* Left Tools Sidebar */}
      <ToolsSidebar />

      {/* Main Chart Area */}
      <div className="flex flex-1 flex-col">
        <ChartHeader symbol={selectedSymbol} timeframe={timeframe} onTimeframeChange={setTimeframe} />
        <div className="flex-1 overflow-hidden">
          <CandlestickChart symbol={selectedSymbol} timeframe={timeframe} />
        </div>
      </div>

      {/* Right Sidebar - Watchlist */}
      <div className="w-80 border-l border-border flex flex-col bg-card">
        <Watchlist selectedSymbol={selectedSymbol} onSelectSymbol={setSelectedSymbol} />
        <StockDetails symbol={selectedSymbol} />
      </div>
    </div>
  )
}
