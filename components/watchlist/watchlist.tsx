"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getWatchlistData, type WatchlistItem } from "@/lib/chart-dummy-data"
import { Plus, ChevronDown, MoreHorizontal, Grid3X3, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface WatchlistProps {
  selectedSymbol: string
  onSelectSymbol: (symbol: string) => void
}

export function Watchlist({ selectedSymbol, onSelectSymbol }: WatchlistProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const watchlistData = getWatchlistData()

  const indices = watchlistData.filter((item) => item.category === "index")
  const stocks = watchlistData.filter((item) => item.category === "stock")

  const WatchlistRow = ({ item }: { item: WatchlistItem }) => {
    const isPositive = item.change >= 0
    const isSelected = item.symbol === selectedSymbol

    return (
      <button
        onClick={() => onSelectSymbol(item.symbol)}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-accent",
          isSelected && "bg-accent",
        )}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
          {item.symbol.slice(0, 3)}
        </div>
        <span className="flex-1 truncate text-sm font-medium">{item.symbol}</span>
        <div className="text-right">
          <div className="text-sm font-mono">
            {item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={cn("text-xs font-mono", isPositive ? "text-success" : "text-destructive")}>
            {isPositive ? "+" : ""}
            {item.change.toFixed(2)} {item.changePercent.toFixed(2)}%
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="flex flex-col border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <Button variant="ghost" size="sm" className="gap-1 text-sm font-semibold">
          Watchlist
          <ChevronDown className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative px-3 py-2">
        <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Symbol"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8 text-sm"
        />
      </div>

      {/* Column Headers */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1 text-xs text-muted-foreground">
        <span>Symbol</span>
        <div className="flex gap-4">
          <span>Last</span>
          <span>Chg</span>
          <span>Chg%</span>
        </div>
      </div>

      <ScrollArea className="h-64">
        {/* Indices Section */}
        <div className="px-3 py-1">
          <Button variant="ghost" size="sm" className="h-6 gap-1 px-0 text-xs text-muted-foreground">
            <ChevronDown className="h-3 w-3" />
            INDICES
          </Button>
        </div>
        <div>
          {indices.map((item) => (
            <WatchlistRow key={item.symbol} item={item} />
          ))}
        </div>

        {/* Stocks Section */}
        <div className="px-3 py-1">
          <Button variant="ghost" size="sm" className="h-6 gap-1 px-0 text-xs text-muted-foreground">
            <ChevronDown className="h-3 w-3" />
            STOCKS
          </Button>
        </div>
        <div>
          {stocks.map((item) => (
            <WatchlistRow key={item.symbol} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
