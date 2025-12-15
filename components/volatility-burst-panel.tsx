"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import type { CorporateAction, EODData } from "@/lib/types"

interface VolatilityBurstPanelProps {
  actions: CorporateAction[]
  eodDataMap: Map<string, EODData[]>
}

interface VolatilityMetrics {
  eventId: string
  instrumentName: string
  exDate: string
  preVolatility: number // 10-day realized vol before event
  postVolatility: number // 10-day realized vol after event
  volatilityChange: number // % change
  volatilitySpike: number // Standard deviations above historical
  riskLevel: "low" | "medium" | "high"
  var95: number // 95% Value at Risk
  cvar95: number // 95% Conditional VaR
}

export function VolatilityBurstPanel({ actions, eodDataMap }: VolatilityBurstPanelProps) {
  // Handle empty or undefined actions
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Volatility Burst Analysis
          </CardTitle>
          <CardDescription>
            Pre vs post-event volatility comparison with risk metrics (VaR, CVaR)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No corporate actions available for volatility analysis
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate volatility metrics for all events
  const volatilityMetrics = actions.map((action) =>
    calculateVolatilityMetrics(action, eodDataMap)
  )

  // Sort by volatility spike (descending)
  const sortedMetrics = [...volatilityMetrics].sort(
    (a, b) => b.volatilitySpike - a.volatilitySpike
  )

  // Summary statistics
  const avgVolChange =
    volatilityMetrics.length > 0
      ? volatilityMetrics.reduce((sum, m) => sum + m.volatilityChange, 0) / volatilityMetrics.length
      : 0
  const highRiskCount = volatilityMetrics.filter((m) => m.riskLevel === "high").length
  const maxSpike = volatilityMetrics.length > 0 ? Math.max(...volatilityMetrics.map((m) => m.volatilitySpike)) : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Volatility Burst Analysis
            </CardTitle>
            <CardDescription>
              Pre vs post-event volatility comparison with risk metrics (VaR, CVaR)
            </CardDescription>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Avg Vol Change</p>
            <p
              className={`text-xl font-bold ${
                avgVolChange > 0 ? "text-orange-600" : "text-green-600"
              }`}
            >
              {avgVolChange > 0 ? "+" : ""}
              {avgVolChange.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">High Risk Events</p>
            <p className="text-xl font-bold text-red-600">{highRiskCount}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Max Spike</p>
            <p className="text-xl font-bold text-orange-600">{maxSpike.toFixed(1)}σ</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-xl font-bold">{volatilityMetrics.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Volatility Comparison Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Pre vs Post Volatility (Annualized %)</h4>
          <div className="space-y-2">
            {sortedMetrics.slice(0, 10).map((metric) => (
              <div key={metric.eventId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{metric.instrumentName}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        metric.riskLevel === "high"
                          ? "destructive"
                          : metric.riskLevel === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {metric.riskLevel.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-orange-600">
                      {metric.volatilityChange > 0 ? "+" : ""}
                      {metric.volatilityChange.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Visual comparison bars */}
                <div className="flex items-center gap-2">
                  {/* Pre-event volatility bar */}
                  <div className="flex flex-1 items-center gap-1">
                    <span className="w-8 text-right text-xs text-muted-foreground">Pre</span>
                    <div className="relative flex-1 rounded bg-gray-200">
                      <div
                        className="rounded bg-blue-500 py-1 text-center text-xs font-semibold text-white"
                        style={{
                          width: `${Math.min((metric.preVolatility / 100) * 100, 100)}%`,
                        }}
                      >
                        {metric.preVolatility.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  {metric.volatilityChange > 10 ? (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  ) : metric.volatilityChange < -10 ? (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}

                  {/* Post-event volatility bar */}
                  <div className="flex flex-1 items-center gap-1">
                    <span className="w-8 text-xs text-muted-foreground">Post</span>
                    <div className="relative flex-1 rounded bg-gray-200">
                      <div
                        className={`rounded py-1 text-center text-xs font-semibold text-white ${
                          metric.postVolatility > metric.preVolatility
                            ? "bg-orange-600"
                            : "bg-green-600"
                        }`}
                        style={{
                          width: `${Math.min((metric.postVolatility / 100) * 100, 100)}%`,
                        }}
                      >
                        {metric.postVolatility.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Metrics Table */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Risk Metrics (95% Confidence)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-2 text-left">Instrument</th>
                  <th className="p-2 text-left">Ex-Date</th>
                  <th className="p-2 text-right">Pre Vol</th>
                  <th className="p-2 text-right">Post Vol</th>
                  <th className="p-2 text-right">Change</th>
                  <th className="p-2 text-right">VaR (95%)</th>
                  <th className="p-2 text-right">CVaR (95%)</th>
                  <th className="p-2 text-center">Risk</th>
                </tr>
              </thead>
              <tbody>
                {sortedMetrics.map((metric) => (
                  <tr key={metric.eventId} className="border-b hover:bg-muted/20">
                    <td className="p-2 font-medium">{metric.instrumentName}</td>
                    <td className="p-2 text-muted-foreground">{metric.exDate}</td>
                    <td className="p-2 text-right">{metric.preVolatility.toFixed(1)}%</td>
                    <td className="p-2 text-right font-semibold">
                      {metric.postVolatility.toFixed(1)}%
                    </td>
                    <td
                      className={`p-2 text-right font-bold ${
                        metric.volatilityChange > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {metric.volatilityChange > 0 ? "+" : ""}
                      {metric.volatilityChange.toFixed(0)}%
                    </td>
                    <td className="p-2 text-right font-semibold text-orange-600">
                      {metric.var95.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right font-semibold text-red-600">
                      {metric.cvar95.toFixed(2)}%
                    </td>
                    <td className="p-2 text-center">
                      <Badge
                        variant={
                          metric.riskLevel === "high"
                            ? "destructive"
                            : metric.riskLevel === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {metric.riskLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Banner for High Risk Events */}
        {highRiskCount > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                {highRiskCount} High Risk Event{highRiskCount > 1 ? "s" : ""} Detected
              </p>
              <p className="text-xs text-red-700">
                These events show significant volatility increases. Consider risk management
                measures.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateVolatilityMetrics(
  action: CorporateAction,
  eodDataMap: Map<string, EODData[]>
): VolatilityMetrics {
  const key = `${action.valoren}_${action.exDividendDate}`
  const eodData = eodDataMap.get(key) || []

  const eventIndex = eodData.findIndex((d) => d.date === action.exDividendDate)

  if (eventIndex === -1 || eventIndex < 10 || eventIndex + 10 >= eodData.length) {
    return {
      eventId: action.eventId,
      instrumentName: action.instrumentName,
      exDate: action.exDividendDate,
      preVolatility: 0,
      postVolatility: 0,
      volatilityChange: 0,
      volatilitySpike: 0,
      riskLevel: "low",
      var95: 0,
      cvar95: 0,
    }
  }

  // Calculate pre and post event volatility
  const preWindow = eodData.slice(eventIndex - 10, eventIndex)
  const postWindow = eodData.slice(eventIndex + 1, eventIndex + 11)

  const preVolatility = calculateRealizedVolatility(preWindow)
  const postVolatility = calculateRealizedVolatility(postWindow)

  const volatilityChange = ((postVolatility - preVolatility) / preVolatility) * 100

  // Calculate historical volatility (30 days before event)
  const historicalWindow = eodData.slice(Math.max(0, eventIndex - 40), eventIndex - 10)
  const historicalVol = calculateRealizedVolatility(historicalWindow)

  // Volatility spike in standard deviations
  const volatilitySpike = historicalVol > 0 ? (postVolatility - historicalVol) / historicalVol : 0

  // Risk level classification
  let riskLevel: "low" | "medium" | "high" = "low"
  if (volatilityChange > 50 || volatilitySpike > 2) {
    riskLevel = "high"
  } else if (volatilityChange > 20 || volatilitySpike > 1) {
    riskLevel = "medium"
  }

  // Calculate VaR and CVaR (95% confidence)
  const { var95, cvar95 } = calculateRiskMetrics(postWindow, 0.95)

  return {
    eventId: action.eventId,
    instrumentName: action.instrumentName,
    exDate: action.exDividendDate,
    preVolatility,
    postVolatility,
    volatilityChange,
    volatilitySpike,
    riskLevel,
    var95,
    cvar95,
  }
}

function calculateRealizedVolatility(data: EODData[]): number {
  if (data.length < 2) return 0

  const returns: number[] = []
  for (let i = 1; i < data.length; i++) {
    const ret = Math.log(data[i].closePrice / data[i - 1].closePrice)
    returns.push(ret)
  }

  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)

  // Annualize (252 trading days)
  return stdDev * Math.sqrt(252) * 100
}

function calculateRiskMetrics(
  data: EODData[],
  confidence: number
): { var95: number; cvar95: number } {
  if (data.length < 2) return { var95: 0, cvar95: 0 }

  // Calculate returns
  const returns: number[] = []
  for (let i = 1; i < data.length; i++) {
    const ret = ((data[i].closePrice - data[i - 1].closePrice) / data[i - 1].closePrice) * 100
    returns.push(ret)
  }

  // Sort returns (ascending)
  const sortedReturns = [...returns].sort((a, b) => a - b)

  // VaR: percentile of loss distribution
  const varIndex = Math.floor(sortedReturns.length * (1 - confidence))
  const var95 = Math.abs(sortedReturns[varIndex])

  // CVaR: average of losses beyond VaR
  const tailLosses = sortedReturns.slice(0, varIndex + 1)
  const cvar95 = Math.abs(tailLosses.reduce((sum, r) => sum + r, 0) / tailLosses.length)

  return { var95, cvar95 }
}
