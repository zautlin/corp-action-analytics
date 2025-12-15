"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Activity, Download, Info } from "lucide-react"
import type { CorporateAction, EODData } from "@/lib/types"

interface EventStudyHeatmapProps {
  actions: CorporateAction[]
  eodDataMap: Map<string, EODData[]>
  benchmarkData?: EODData[] // Market/sector benchmark
  onCellClick?: (action: CorporateAction, day: number) => void
}

interface AbnormalReturn {
  eventId: string
  instrumentName: string
  exDate: string
  returns: number[] // Daily abnormal returns for T-10 to T+10
  avgReturn: number
  cumulativeReturn: number
}

export function EventStudyHeatmap({
  actions,
  eodDataMap,
  benchmarkData,
  onCellClick,
}: EventStudyHeatmapProps) {
  // Handle empty or undefined actions
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Event-Study Heatmap
          </CardTitle>
          <CardDescription>
            Abnormal returns (%) around corporate action events (T-10 to T+10 trading days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No corporate actions available for analysis
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate abnormal returns for all events
  const abnormalReturns = calculateAbnormalReturns(actions, eodDataMap, benchmarkData)

  // Define day range (T-10 to T+10)
  const dayRange = Array.from({ length: 21 }, (_, i) => i - 10)

  // Get color for return value
  const getColor = (value: number): string => {
    if (value > 2) return "bg-green-600"
    if (value > 1) return "bg-green-500"
    if (value > 0.5) return "bg-green-400"
    if (value > 0) return "bg-green-200"
    if (value === 0) return "bg-gray-100"
    if (value > -0.5) return "bg-red-200"
    if (value > -1) return "bg-red-400"
    if (value > -2) return "bg-red-500"
    return "bg-red-600"
  }

  const getTextColor = (value: number): string => {
    if (Math.abs(value) > 1) return "text-white"
    return "text-gray-900"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Event-Study Heatmap
            </CardTitle>
            <CardDescription>
              Abnormal returns (%) around corporate action events (T-10 to T+10 trading days)
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
                    Abnormal Return = Stock Return - Benchmark Return. Positive values (green)
                    indicate outperformance. Click cells to drill down.
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
      </CardHeader>

      <CardContent>
        {/* Legend */}
        <div className="mb-4 flex items-center gap-4 text-xs">
          <span className="font-semibold text-muted-foreground">Returns Scale (%):</span>
          <div className="flex items-center gap-1">
            <div className="h-4 w-8 bg-red-600" />
            <span className="text-muted-foreground">{"< -2"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-8 bg-red-400" />
            <span className="text-muted-foreground">-1 to -2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-8 bg-gray-100" />
            <span className="text-muted-foreground">~0</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-8 bg-green-400" />
            <span className="text-muted-foreground">+1 to +2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-8 bg-green-600" />
            <span className="text-muted-foreground">{"> +2"}</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="flex gap-0.5 text-xs font-medium text-muted-foreground">
              <div className="w-48 shrink-0 px-2 py-1">Event</div>
              <div className="w-20 shrink-0 px-2 py-1 text-right">Avg</div>
              <div className="w-20 shrink-0 px-2 py-1 text-right">CAR</div>
              {dayRange.map((day) => (
                <div
                  key={day}
                  className={`w-12 shrink-0 px-1 py-1 text-center ${
                    day === 0 ? "font-bold text-orange-600" : ""
                  }`}
                >
                  {day === 0 ? "T" : day > 0 ? `+${day}` : day}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            <div className="space-y-0.5">
              {abnormalReturns.map((ar) => (
                <div key={ar.eventId} className="flex gap-0.5">
                  {/* Event Info */}
                  <div className="w-48 shrink-0 truncate rounded bg-muted/30 px-2 py-1.5 text-xs">
                    <div className="font-semibold">{ar.instrumentName}</div>
                    <div className="text-[10px] text-muted-foreground">{ar.exDate}</div>
                  </div>

                  {/* Average Return */}
                  <div
                    className={`w-20 shrink-0 rounded px-2 py-1.5 text-right text-xs font-semibold ${
                      getColor(ar.avgReturn)
                    } ${getTextColor(ar.avgReturn)}`}
                  >
                    {ar.avgReturn.toFixed(2)}%
                  </div>

                  {/* Cumulative Abnormal Return (CAR) */}
                  <div
                    className={`w-20 shrink-0 rounded px-2 py-1.5 text-right text-xs font-semibold ${
                      getColor(ar.cumulativeReturn)
                    } ${getTextColor(ar.cumulativeReturn)}`}
                  >
                    {ar.cumulativeReturn.toFixed(2)}%
                  </div>

                  {/* Daily Returns */}
                  {ar.returns.map((ret, idx) => {
                    const day = dayRange[idx]
                    const action = actions.find((a) => a.eventId === ar.eventId)

                    return (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => action && onCellClick?.(action, day)}
                              className={`w-12 shrink-0 rounded px-1 py-1.5 text-center text-[11px] font-medium transition-all hover:ring-2 hover:ring-blue-400 ${
                                getColor(ret)
                              } ${getTextColor(ret)} ${
                                day === 0 ? "ring-2 ring-orange-500" : ""
                              }`}
                            >
                              {ret.toFixed(1)}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <span className="font-semibold">{ar.instrumentName}</span>
                              <br />
                              Day {day === 0 ? "T (Ex-Date)" : day > 0 ? `T+${day}` : `T${day}`}
                              <br />
                              Abnormal Return: {ret.toFixed(2)}%
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Summary Statistics */}
            <div className="mt-4 rounded-lg border bg-muted/20 p-3">
              <h4 className="mb-2 text-xs font-semibold">Portfolio-Level Statistics</h4>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Avg Abnormal Return</p>
                  <p className="text-lg font-bold">
                    {calculatePortfolioAverage(abnormalReturns).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg CAR (T-10 to T+10)</p>
                  <p className="text-lg font-bold">
                    {calculateAvgCAR(abnormalReturns).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Positive Events</p>
                  <p className="text-lg font-bold">
                    {calculatePositiveRatio(abnormalReturns).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Drawdown</p>
                  <p className="text-lg font-bold text-red-600">
                    {calculateMaxDrawdown(abnormalReturns).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateAbnormalReturns(
  actions: CorporateAction[],
  eodDataMap: Map<string, EODData[]>,
  benchmarkData?: EODData[]
): AbnormalReturn[] {
  return actions.map((action) => {
    const key = `${action.valoren}_${action.exDividendDate}`
    const eodData = eodDataMap.get(key) || []

    // Find event index
    const eventIndex = eodData.findIndex((d) => d.date === action.exDividendDate)
    if (eventIndex === -1 || eventIndex < 10 || eventIndex + 10 >= eodData.length) {
      return {
        eventId: action.eventId,
        instrumentName: action.instrumentName,
        exDate: action.exDividendDate,
        returns: Array(21).fill(0),
        avgReturn: 0,
        cumulativeReturn: 0,
      }
    }

    // Calculate daily returns for T-10 to T+10
    const returns: number[] = []
    let cumulativeReturn = 0

    for (let day = -10; day <= 10; day++) {
      const idx = eventIndex + day
      if (idx > 0 && idx < eodData.length) {
        const stockReturn =
          ((eodData[idx].closePrice - eodData[idx - 1].closePrice) /
            eodData[idx - 1].closePrice) *
          100

        // Calculate benchmark return if available
        let benchmarkReturn = 0
        if (benchmarkData && benchmarkData[idx] && benchmarkData[idx - 1]) {
          benchmarkReturn =
            ((benchmarkData[idx].closePrice - benchmarkData[idx - 1].closePrice) /
              benchmarkData[idx - 1].closePrice) *
            100
        }

        // Abnormal return = stock return - benchmark return
        const abnormalReturn = stockReturn - benchmarkReturn
        returns.push(abnormalReturn)
        cumulativeReturn += abnormalReturn
      } else {
        returns.push(0)
      }
    }

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length

    return {
      eventId: action.eventId,
      instrumentName: action.instrumentName,
      exDate: action.exDividendDate,
      returns,
      avgReturn,
      cumulativeReturn,
    }
  })
}

function calculatePortfolioAverage(abnormalReturns: AbnormalReturn[]): number {
  if (!abnormalReturns || abnormalReturns.length === 0) return 0
  const avg =
    abnormalReturns.reduce((sum, ar) => sum + ar.avgReturn, 0) / abnormalReturns.length
  return avg
}

function calculateAvgCAR(abnormalReturns: AbnormalReturn[]): number {
  if (!abnormalReturns || abnormalReturns.length === 0) return 0
  const avgCAR =
    abnormalReturns.reduce((sum, ar) => sum + ar.cumulativeReturn, 0) / abnormalReturns.length
  return avgCAR
}

function calculatePositiveRatio(abnormalReturns: AbnormalReturn[]): number {
  if (!abnormalReturns || abnormalReturns.length === 0) return 0
  const positiveCount = abnormalReturns.filter((ar) => ar.cumulativeReturn > 0).length
  return (positiveCount / abnormalReturns.length) * 100
}

function calculateMaxDrawdown(abnormalReturns: AbnormalReturn[]): number {
  if (!abnormalReturns || abnormalReturns.length === 0) return 0
  const allReturns = abnormalReturns.flatMap((ar) => ar.returns)
  if (allReturns.length === 0) return 0
  return Math.min(...allReturns)
}
