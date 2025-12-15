"use client"

import { useState } from "react"
import { Grid3x3, List, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function CatalogSearch() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAIResponse, setShowAIResponse] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Show AI response when user types a query
    setShowAIResponse(value.length > 2)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by dataset name, provider, ticker, CUSIP, ISIN..."
            className="h-12 pl-12 text-base bg-card border-border shadow-sm"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {showAIResponse && (
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">AI Search Assistant</p>
                  <div className="text-sm leading-relaxed text-muted-foreground max-h-[4.5rem] overflow-y-auto">
                    <p>
                      Based on your search for "{searchQuery}", I found 12 relevant datasets. The top matches include
                      Bloomberg Real-Time Equity Prices (9.2/10 quality), Refinitiv Global Equity Data (8.9/10), and
                      FactSet Equity Fundamentals (9.0/10). These datasets offer comprehensive coverage of global
                      equities with real-time to daily update frequencies. Would you like me to filter by a specific
                      geography or asset class?
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">416</span> datasets found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="quality">Quality Score</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
                <SelectItem value="cost">Licensing Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
