"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Droplets, TrendingUp, AlertCircle } from "lucide-react"
import type { CorporateAction, EODData } from "@/lib/types"

interface VolumeLiquidityPanelProps {
  actions: CorporateAction[]
  eodDataMap: Map<string, EODData[]>
}

interface LiquidityMetrics {
  eventId: string
  instrumentName: string
  exDate: string
  avgVolumePreEvent: number
  volumeOnEvent: number
  avgVolumePostEvent: number
  volumeSpikePercent: number
  avgTurnoverPreEvent: number
  turnoverOnEvent: number
  turnoverAcceleration: number
  bidAskSpreadEstimate: number // Estimated from volatility
  liquidityScore: number // 0-100
  liquidityRating: "excellent" | "good" | "fair" | "poor"
}

export function VolumeLiquidityPanel({ actions, eodDataMap }: VolumeLiquidityPanelProps) {
  // Handle empty or undefined actions
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Volume & Liquidity Impact Analysis
          </CardTitle>
          <CardDescription>
            Trading volume spikes and liquidity metrics around corporate action events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No corporate actions available for liquidity analysis
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate liquidity metrics for all events
  const liquidityMetrics = actions.map((action) =>
    calculateLiquidityMetrics(action, eodDataMap)
  )

  // Sort by volume spike (descending)
  const sortedMetrics = [...liquidityMetrics].sort(
    (a, b) => b.volumeSpikePercent - a.volumeSpikePercent
  )

  // Summary statistics
  const avgVolumeSpike =
    liquidityMetrics.length > 0
      ? liquidityMetrics.reduce((sum, m) => sum + m.volumeSpikePercent, 0) / liquidityMetrics.length
      : 0
  const avgLiquidityScore =
    liquidityMetrics.length > 0
      ? liquidityMetrics.reduce((sum, m) => sum + m.liquidityScore, 0) / liquidityMetrics.length
      : 0
  const poorLiquidityCount = liquidityMetrics.filter(
    (m) => m.liquidityRating === "poor"
  ).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Volume & Liquidity Impact Analysis
            </CardTitle>
            <CardDescription>
              Trading volume, turnover acceleration, and market liquidity assessment
            </CardDescription>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className="rounded-lg border bg-blue-50 p-3">
            <p className="text-xs text-muted-foreground">Avg Volume Spike</p>
            <p className="text-xl font-bold text-blue-600">+{avgVolumeSpike.toFixed(0)}%</p>
          </div>
          <div className="rounded-lg border bg-green-50 p-3">
            <p className="text-xs text-muted-foreground">Avg Liquidity Score</p>
            <p className="text-xl font-bold text-green-600">{avgLiquidityScore.toFixed(0)}/100</p>
          </div>
          <div className="rounded-lg border bg-orange-50 p-3">
            <p className="text-xs text-muted-foreground">Poor Liquidity</p>
            <p className="text-xl font-bold text-orange-600">{poorLiquidityCount}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-xl font-bold">{liquidityMetrics.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Volume Spike Visualization */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Volume Spike Analysis (Top 10 Events)</h4>
          <div className="space-y-2">
            {sortedMetrics.slice(0, 10).map((metric) => (
              <div key={metric.eventId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.instrumentName}</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.exDate}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        metric.volumeSpikePercent > 150
                          ? "default"
                          : metric.volumeSpikePercent > 75
                          ? "secondary"
                          : "outline"
                      }
                    >
                      +{metric.volumeSpikePercent.toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                {/* Volume bars visualization */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="mb-1 text-muted-foreground">Pre-Event Avg</p>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 rounded bg-gray-200">
                        <div
                          className="rounded bg-gray-400 py-1.5 text-center text-white"
                          style={{
                            width: `${Math.min(
                              (metric.avgVolumePreEvent / metric.volumeOnEvent) * 100,
                              100
                            )}%`,
                          }}
                        >
                          <span className="text-xs font-semibold">
                            {(metric.avgVolumePreEvent / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-muted-foreground">Event Day</p>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 rounded bg-gray-200">
                        <div className="rounded bg-orange-500 py-1.5 text-center text-white">
                          <span className="text-xs font-semibold">
                            {(metric.volumeOnEvent / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-muted-foreground">Post-Event Avg</p>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 rounded bg-gray-200">
                        <div
                          className="rounded bg-blue-500 py-1.5 text-center text-white"
                          style={{
                            width: `${Math.min(
                              (metric.avgVolumePostEvent / metric.volumeOnEvent) * 100,
                              100
                            )}%`,
                          }}
                        >
                          <span className="text-xs font-semibold">
                            {(metric.avgVolumePostEvent / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liquidity Assessment Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Liquidity Assessment</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-2 text-left">Instrument</th>
                  <th className="p-2 text-right">Volume Spike</th>
                  <th className="p-2 text-right">Turnover Accel</th>
                  <th className="p-2 text-right">Spread Est.</th>
                  <th className="p-2 text-right">Liquidity Score</th>
                  <th className="p-2 text-center">Rating</th>
                </tr>
              </thead>
              <tbody>
                {sortedMetrics.map((metric) => (
                  <tr key={metric.eventId} className="border-b hover:bg-muted/20">
                    <td className="p-2 font-medium">{metric.instrumentName}</td>
                    <td className="p-2 text-right font-semibold text-orange-600">
                      +{metric.volumeSpikePercent.toFixed(0)}%
                    </td>
                    <td className="p-2 text-right font-semibold text-blue-600">
                      {metric.turnoverAcceleration > 0 ? "+" : ""}
                      {metric.turnoverAcceleration.toFixed(0)}%
                    </td>
                    <td className="p-2 text-right text-muted-foreground">
                      {metric.bidAskSpreadEstimate.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-gray-200">
                          <div
                            className={`h-1.5 rounded-full ${
                              metric.liquidityScore > 75
                                ? "bg-green-500"
                                : metric.liquidityScore > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${metric.liquidityScore}%` }}
                          />
                        </div>
                        <span className="font-bold">{metric.liquidityScore}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <Badge
                        variant={
                          metric.liquidityRating === "excellent"
                            ? "default"
                            : metric.liquidityRating === "good"
                            ? "secondary"
                            : metric.liquidityRating === "fair"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {metric.liquidityRating}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Turnover Acceleration Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Turnover Acceleration (Pre vs Post Event)</h4>
          <div className="space-y-2">
            {sortedMetrics
              .sort((a, b) => b.turnoverAcceleration - a.turnoverAcceleration)
              .slice(0, 8)
              .map((metric) => (
                <div key={metric.eventId} className="flex items-center gap-2 text-xs">
                  <span className="w-32 truncate font-medium">{metric.instrumentName}</span>
                  <div className="relative flex-1">
                    <div className="h-6 rounded bg-gray-200">
                      <div
                        className={`flex h-6 items-center justify-end rounded px-2 font-semibold text-white ${
                          metric.turnoverAcceleration > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.abs(metric.turnoverAcceleration),
                            100
                          )}%`,
                        }}
                      >
                        {metric.turnoverAcceleration > 0 ? "+" : ""}
                        {metric.turnoverAcceleration.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Liquidity Risk Alert */}
        {poorLiquidityCount > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-orange-900">
                {poorLiquidityCount} Event{poorLiquidityCount > 1 ? "s" : ""} with Poor Liquidity
              </p>
              <p className="text-xs text-orange-700">
                These events may experience wider bid-ask spreads and higher execution costs.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="rounded-lg border bg-muted/10 p-3 text-xs">
          <p className="mb-2 font-semibold">Liquidity Score Methodology:</p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Volume Spike: Higher volume indicates interest (weight: 40%)</li>
            <li>Turnover Acceleration: Sustained activity post-event (weight: 30%)</li>
            <li>Spread Estimate: Tighter spreads = better liquidity (weight: 30%)</li>
            <li>Rating: Excellent (80-100), Good (60-79), Fair (40-59), Poor (&lt;40)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateLiquidityMetrics(
  action: CorporateAction,
  eodDataMap: Map<string, EODData[]>
): LiquidityMetrics {
  const key = `${action.valoren}_${action.exDividendDate}`
  const eodData = eodDataMap.get(key) || []

  const eventIndex = eodData.findIndex((d) => d.date === action.exDividendDate)

  if (eventIndex === -1 || eventIndex < 10 || eventIndex + 10 >= eodData.length) {
    return {
      eventId: action.eventId,
      instrumentName: action.instrumentName,
      exDate: action.exDividendDate,
      avgVolumePreEvent: 0,
      volumeOnEvent: 0,
      avgVolumePostEvent: 0,
      volumeSpikePercent: 0,
      avgTurnoverPreEvent: 0,
      turnoverOnEvent: 0,
      turnoverAcceleration: 0,
      bidAskSpreadEstimate: 0,
      liquidityScore: 0,
      liquidityRating: "poor",
    }
  }

  // Calculate volume metrics
  const preWindow = eodData.slice(eventIndex - 10, eventIndex)
  const postWindow = eodData.slice(eventIndex + 1, eventIndex + 11)

  const avgVolumePreEvent =
    preWindow.reduce((sum, d) => sum + d.volume, 0) / preWindow.length
  const volumeOnEvent = eodData[eventIndex].volume
  const avgVolumePostEvent =
    postWindow.reduce((sum, d) => sum + d.volume, 0) / postWindow.length

  const volumeSpikePercent = ((volumeOnEvent - avgVolumePreEvent) / avgVolumePreEvent) * 100

  // Calculate turnover metrics
  const avgTurnoverPreEvent =
    preWindow.reduce((sum, d) => sum + d.turnover, 0) / preWindow.length
  const turnoverOnEvent = eodData[eventIndex].turnover
  const avgTurnoverPostEvent =
    postWindow.reduce((sum, d) => sum + d.turnover, 0) / postWindow.length

  const turnoverAcceleration =
    ((avgTurnoverPostEvent - avgTurnoverPreEvent) / avgTurnoverPreEvent) * 100

  // Estimate bid-ask spread from volatility (simplified)
  const returns = []
  for (let i = 1; i < postWindow.length; i++) {
    const ret = Math.abs(
      (postWindow[i].closePrice - postWindow[i - 1].closePrice) /
        postWindow[i - 1].closePrice
    )
    returns.push(ret)
  }
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const bidAskSpreadEstimate = avgReturn * 100 * 2 // Rough approximation

  // Calculate liquidity score (0-100)
  const volumeScore = Math.min((volumeSpikePercent / 200) * 100, 100) * 0.4
  const turnoverScore = Math.min(Math.max(turnoverAcceleration, 0) / 100, 1) * 100 * 0.3
  const spreadScore = Math.max(0, (1 - bidAskSpreadEstimate / 5) * 100) * 0.3

  const liquidityScore = Math.round(volumeScore + turnoverScore + spreadScore)

  // Determine rating
  let liquidityRating: "excellent" | "good" | "fair" | "poor"
  if (liquidityScore >= 80) {
    liquidityRating = "excellent"
  } else if (liquidityScore >= 60) {
    liquidityRating = "good"
  } else if (liquidityScore >= 40) {
    liquidityRating = "fair"
  } else {
    liquidityRating = "poor"
  }

  return {
    eventId: action.eventId,
    instrumentName: action.instrumentName,
    exDate: action.exDividendDate,
    avgVolumePreEvent,
    volumeOnEvent,
    avgVolumePostEvent,
    volumeSpikePercent,
    avgTurnoverPreEvent,
    turnoverOnEvent,
    turnoverAcceleration,
    bidAskSpreadEstimate,
    liquidityScore,
    liquidityRating,
  }
}
