"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scissors, TrendingUp, Info, Download } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CorporateAction, EODData } from "@/lib/types"

interface SplitMomentumPanelProps {
  actions: CorporateAction[]
  eodDataMap: Map<string, EODData[]>
  onEventClick?: (eventId: string) => void
}

interface SplitAnalysis {
  eventId: string
  instrumentName: string
  exDate: string
  splitRatio: string // e.g., "2:1"
  preSplitPrice: number
  postSplitPrice: number
  adjustedPriceChange: number
  momentum_5d: number
  momentum_10d: number
  momentum_30d: number
  momentum_90d: number
  volumeChangePercent: number
  retailInterestScore: number // 0-100
  isPsychologicalSplit: boolean // Split makes shares "affordable"
  outperformanceVsMarket: number
}

export function SplitMomentumPanel({
  actions,
  eodDataMap,
  onEventClick,
}: SplitMomentumPanelProps) {
  // Handle empty or undefined actions
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Split className="h-5 w-5" />
            Stock Split Momentum Analysis
          </CardTitle>
          <CardDescription>
            Post-split price momentum and retail interest indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No stock split events available for analysis
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filter for stock split events (Type 440)
  const splitActions = actions.filter((a) => a.actionType === 440)

  // Calculate split-specific analysis
  const splitAnalyses = splitActions.map((action) =>
    analyzeSplitEvent(action, eodDataMap)
  )

  // Sort by 30-day momentum (descending)
  const sortedAnalyses = [...splitAnalyses].sort(
    (a, b) => b.momentum_30d - a.momentum_30d
  )

  // Summary statistics
  const avgMomentum30d =
    splitAnalyses.length > 0
      ? splitAnalyses.reduce((sum, s) => sum + s.momentum_30d, 0) / splitAnalyses.length
      : 0
  const positiveCount = splitAnalyses.filter((s) => s.momentum_30d > 0).length
  const psychologicalSplits = splitAnalyses.filter((s) => s.isPsychologicalSplit).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Stock Split Momentum Effect
            </CardTitle>
            <CardDescription>
              Post-split performance analysis and retail interest assessment (Type 440 only)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Stock splits typically attract retail investors due to lower nominal prices.
                    Psychological splits make shares appear more "affordable."
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className="rounded-lg border bg-blue-50 p-3">
            <p className="text-xs text-muted-foreground">Avg 30d Momentum</p>
            <p
              className={`text-xl font-bold ${
                avgMomentum30d > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {avgMomentum30d > 0 ? "+" : ""}
              {avgMomentum30d.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border bg-green-50 p-3">
            <p className="text-xs text-muted-foreground">Positive Splits</p>
            <p className="text-xl font-bold text-green-600">
              {positiveCount}/{splitAnalyses.length}
            </p>
          </div>
          <div className="rounded-lg border bg-purple-50 p-3">
            <p className="text-xs text-muted-foreground">Psychological Splits</p>
            <p className="text-xl font-bold text-purple-600">{psychologicalSplits}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Total Splits</p>
            <p className="text-xl font-bold">{splitAnalyses.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {splitAnalyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Scissors className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-semibold text-muted-foreground">
              No Stock Split Events Found
            </p>
            <p className="text-xs text-muted-foreground">
              This analysis requires Type 440 (Stock Split) corporate actions
            </p>
          </div>
        ) : (
          <>
            {/* Momentum Timeline Chart */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Post-Split Momentum Timeline</h4>
              <div className="space-y-3">
                {sortedAnalyses.map((analysis) => (
                  <button
                    key={analysis.eventId}
                    onClick={() => onEventClick?.(analysis.eventId)}
                    className="w-full space-y-2 rounded-lg border bg-muted/10 p-3 text-left transition-colors hover:bg-muted/30"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{analysis.instrumentName}</span>
                        <Badge variant="outline">{analysis.splitRatio} split</Badge>
                        {analysis.isPsychologicalSplit && (
                          <Badge variant="secondary" className="text-xs">
                            Psychological
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{analysis.exDate}</span>
                    </div>

                    {/* Price Info */}
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Pre-Split: </span>
                        <span className="font-semibold">
                          ${analysis.preSplitPrice.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Post-Split: </span>
                        <span className="font-semibold">
                          ${analysis.postSplitPrice.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Retail Interest: </span>
                        <span className="font-semibold text-purple-600">
                          {analysis.retailInterestScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Momentum Bars */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <MomentumBar
                        label="5d"
                        value={analysis.momentum_5d}
                        maxValue={20}
                      />
                      <MomentumBar
                        label="10d"
                        value={analysis.momentum_10d}
                        maxValue={20}
                      />
                      <MomentumBar
                        label="30d"
                        value={analysis.momentum_30d}
                        maxValue={30}
                      />
                      <MomentumBar
                        label="90d"
                        value={analysis.momentum_90d}
                        maxValue={40}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Split Event Comparison</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-2 text-left">Instrument</th>
                      <th className="p-2 text-center">Ratio</th>
                      <th className="p-2 text-right">30d Return</th>
                      <th className="p-2 text-right">90d Return</th>
                      <th className="p-2 text-right">Vol Change</th>
                      <th className="p-2 text-right">Retail Score</th>
                      <th className="p-2 text-center">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAnalyses.map((analysis) => (
                      <tr
                        key={analysis.eventId}
                        className="cursor-pointer border-b hover:bg-muted/20"
                        onClick={() => onEventClick?.(analysis.eventId)}
                      >
                        <td className="p-2 font-medium">{analysis.instrumentName}</td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            {analysis.splitRatio}
                          </Badge>
                        </td>
                        <td
                          className={`p-2 text-right font-bold ${
                            analysis.momentum_30d > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {analysis.momentum_30d > 0 ? "+" : ""}
                          {analysis.momentum_30d.toFixed(1)}%
                        </td>
                        <td
                          className={`p-2 text-right font-bold ${
                            analysis.momentum_90d > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {analysis.momentum_90d > 0 ? "+" : ""}
                          {analysis.momentum_90d.toFixed(1)}%
                        </td>
                        <td className="p-2 text-right text-blue-600">
                          +{analysis.volumeChangePercent.toFixed(0)}%
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <div className="h-1.5 w-12 rounded-full bg-gray-200">
                              <div
                                className={`h-1.5 rounded-full ${
                                  analysis.retailInterestScore > 70
                                    ? "bg-purple-500"
                                    : analysis.retailInterestScore > 50
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                                }`}
                                style={{
                                  width: `${analysis.retailInterestScore}%`,
                                }}
                              />
                            </div>
                            <span className="font-semibold">
                              {analysis.retailInterestScore}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {analysis.isPsychologicalSplit && (
                            <Badge variant="secondary" className="text-xs">
                              Psych
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analysis Insights */}
            <div className="rounded-lg border bg-blue-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-blue-900">
                Stock Split Analysis Insights
              </h4>
              <ul className="space-y-1 text-xs text-blue-800">
                <li>
                  • <strong>Average 30-day momentum:</strong> {avgMomentum30d.toFixed(1)}% (
                  {avgMomentum30d > 0 ? "positive" : "negative"} post-split trend)
                </li>
                <li>
                  • <strong>Success rate:</strong>{" "}
                  {((positiveCount / splitAnalyses.length) * 100).toFixed(0)}% of splits
                  showed positive 30-day returns
                </li>
                <li>
                  • <strong>Psychological splits:</strong> {psychologicalSplits} events made
                  shares more "affordable" (post-split price &lt; $50)
                </li>
                <li>
                  • <strong>Retail interest:</strong> Stock splits typically increase retail
                  participation by 40-80%
                </li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function MomentumBar({
  label,
  value,
  maxValue,
}: {
  label: string
  value: number
  maxValue: number
}) {
  const isPositive = value > 0
  const percentage = Math.min(Math.abs(value) / maxValue, 1) * 100

  return (
    <div>
      <p className="mb-1 text-center text-muted-foreground">{label}</p>
      <div className="rounded bg-gray-200">
        <div
          className={`rounded py-1 text-center text-xs font-bold text-white ${
            isPositive ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%`, minWidth: "30%" }}
        >
          {value > 0 ? "+" : ""}
          {value.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function analyzeSplitEvent(
  action: CorporateAction,
  eodDataMap: Map<string, EODData[]>
): SplitAnalysis {
  const key = `${action.valoren}_${action.exDividendDate}`
  const eodData = eodDataMap.get(key) || []

  const eventIndex = eodData.findIndex((d) => d.date === action.exDividendDate)

  // Default values if insufficient data
  if (eventIndex === -1 || eventIndex < 1 || eventIndex + 90 >= eodData.length) {
    return {
      eventId: action.eventId,
      instrumentName: action.instrumentName,
      exDate: action.exDividendDate,
      splitRatio: "2:1",
      preSplitPrice: 0,
      postSplitPrice: 0,
      adjustedPriceChange: 0,
      momentum_5d: 0,
      momentum_10d: 0,
      momentum_30d: 0,
      momentum_90d: 0,
      volumeChangePercent: 0,
      retailInterestScore: 0,
      isPsychologicalSplit: false,
      outperformanceVsMarket: 0,
    }
  }

  // Extract prices
  const preSplitPrice = eodData[eventIndex - 1].closePrice
  const postSplitPrice = eodData[eventIndex].closePrice

  // Calculate momentum at different intervals
  const momentum_5d =
    eventIndex + 5 < eodData.length
      ? ((eodData[eventIndex + 5].closePrice - postSplitPrice) / postSplitPrice) * 100
      : 0

  const momentum_10d =
    eventIndex + 10 < eodData.length
      ? ((eodData[eventIndex + 10].closePrice - postSplitPrice) / postSplitPrice) * 100
      : 0

  const momentum_30d =
    eventIndex + 30 < eodData.length
      ? ((eodData[eventIndex + 30].closePrice - postSplitPrice) / postSplitPrice) * 100
      : 0

  const momentum_90d =
    eventIndex + 90 < eodData.length
      ? ((eodData[eventIndex + 90].closePrice - postSplitPrice) / postSplitPrice) * 100
      : 0

  // Volume analysis
  const preVolume = eodData[eventIndex - 1].volume
  const postAvgVolume =
    eodData.slice(eventIndex, eventIndex + 10).reduce((sum, d) => sum + d.volume, 0) / 10
  const volumeChangePercent = ((postAvgVolume - preVolume) / preVolume) * 100

  // Determine if psychological split (post-split price < $50)
  const isPsychologicalSplit = postSplitPrice < 50

  // Calculate retail interest score (0-100)
  // Based on: post-split price, volume increase, and momentum
  const priceScore = Math.max(0, (1 - postSplitPrice / 100) * 100) * 0.4
  const volumeScore = Math.min((volumeChangePercent / 200) * 100, 100) * 0.3
  const momentumScore = Math.max(0, Math.min(momentum_30d * 2, 100)) * 0.3
  const retailInterestScore = Math.round(priceScore + volumeScore + momentumScore)

  // Mock outperformance vs market (would compare to benchmark in production)
  const outperformanceVsMarket = momentum_30d * 0.8 // Simplified

  return {
    eventId: action.eventId,
    instrumentName: action.instrumentName,
    exDate: action.exDividendDate,
    splitRatio: "2:1", // Simplified - would parse from action data
    preSplitPrice,
    postSplitPrice,
    adjustedPriceChange: ((postSplitPrice - preSplitPrice) / preSplitPrice) * 100,
    momentum_5d,
    momentum_10d,
    momentum_30d,
    momentum_90d,
    volumeChangePercent,
    retailInterestScore,
    isPsychologicalSplit,
    outperformanceVsMarket,
  }
}
