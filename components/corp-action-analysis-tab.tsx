"use client"

import { useState } from "react"
import { CandlestickChart } from "@/components/chart/candlestick-chart"
import { ChartHeader } from "@/components/chart/chart-header"
import { ToolsSidebar } from "@/components/chart/tools-sidebar"
import { Watchlist } from "@/components/watchlist/watchlist"
import { StockDetails } from "@/components/watchlist/stock-details"

interface CorpActionAnalysisTabProps {
  selectedSymbol?: string
  onSymbolChange?: (symbol: string) => void
}

export function CorpActionAnalysisTab({ 
  selectedSymbol = "AAPL",
  onSymbolChange 
}: CorpActionAnalysisTabProps) {
  const [symbol, setSymbol] = useState(selectedSymbol)
  const [timeframe, setTimeframe] = useState("1D")

  const handleSymbolSelect = (newSymbol: string) => {
    setSymbol(newSymbol)
    if (onSymbolChange) {
      onSymbolChange(newSymbol)
    }
  }

  return (
    <div className="flex h-[800px] bg-background border border-border rounded-lg overflow-hidden">
      {/* Left Tools Sidebar */}
      <ToolsSidebar />

      {/* Main Chart Area */}
      <div className="flex flex-1 flex-col">
        <ChartHeader 
          symbol={symbol} 
          timeframe={timeframe} 
          onTimeframeChange={setTimeframe} 
        />
        <div className="flex-1 overflow-hidden">
          <CandlestickChart symbol={symbol} timeframe={timeframe} />
        </div>
      </div>

      {/* Right Sidebar - Watchlist */}
      <div className="w-80 border-l border-border flex flex-col bg-card">
        <Watchlist 
          selectedSymbol={symbol} 
          onSelectSymbol={handleSymbolSelect} 
        />
        <StockDetails symbol={symbol} />
      </div>
    </div>
  )
}
