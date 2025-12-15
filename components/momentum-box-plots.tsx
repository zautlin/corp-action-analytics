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
import { TrendingUp, Info, Download, Filter } from "lucide-react"
import type { EventSignals } from "@/lib/signal-library"

interface MomentumBoxPlotsProps {
  eventSignals: EventSignals[]
  onEventClick?: (eventId: string) => void
}

interface BoxPlotData {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  mean: number
  outliers: Array<{ value: number; eventId: string; instrumentName: string }>
  count: number
}

export function MomentumBoxPlots({ eventSignals, onEventClick }: MomentumBoxPlotsProps) {
  // Handle empty or undefined eventSignals
  if (!eventSignals || eventSignals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Momentum Distribution
          </CardTitle>
          <CardDescription>
            Box plots showing momentum signal distributions across events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No signal data available for analysis. Signals need to be calculated for corporate action events.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate box plot data for each momentum signal
  const momentum1mData = calculateBoxPlot(
    eventSignals,
    "momentum_1m",
    "1-Month Momentum"
  )
  const momentum3mData = calculateBoxPlot(
    eventSignals,
    "momentum_3m",
    "3-Month Momentum"
  )
  const momentum6mData = calculateBoxPlot(
    eventSignals,
    "momentum_6m",
    "6-Month Momentum"
  )
  const announcementData = calculateBoxPlot(
    eventSignals,
    "announcement_momentum",
    "Announcement Drift"
  )

  const allData = [momentum1mData, momentum3mData, momentum6mData, announcementData]

  // Calculate summary statistics
  const avgMedian = allData.reduce((sum, d) => sum + d.median, 0) / allData.length
  const totalOutliers = allData.reduce((sum, d) => sum + d.outliers.length, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Momentum Distribution Analysis
            </CardTitle>
            <CardDescription>
              Box plots showing momentum signal distributions with quartiles and outliers
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
                    Box: Q1 to Q3 (50% of data). Line: Median. Whiskers: Min/Max excluding
                    outliers. Dots: Outliers beyond 1.5×IQR.
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

        {/* Summary Stats */}
        <div className="mt-3 grid grid-cols-4 gap-3 rounded-lg border bg-muted/20 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Avg Median Return</p>
            <p className="text-lg font-bold">{avgMedian.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-lg font-bold">{eventSignals.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Outliers Detected</p>
            <p className="text-lg font-bold text-orange-600">{totalOutliers}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Positive Events</p>
            <p className="text-lg font-bold text-green-600">
              {eventSignals.filter((e) => e.signals.momentum_1m.value > 0).length}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Box Plots Grid */}
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {allData.map((data) => (
            <div key={data.label} className="space-y-2">
              {/* Label */}
              <div className="text-center">
                <p className="text-sm font-semibold">{data.label}</p>
                <p className="text-xs text-muted-foreground">
                  n={data.count}, μ={data.mean.toFixed(1)}%
                </p>
              </div>

              {/* Box Plot SVG */}
              <div className="relative h-80 rounded-lg border bg-muted/10 p-4">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 320"
                  className="overflow-visible"
                >
                  {/* Scale: -20% to +20% */}
                  <BoxPlotVisualization data={data} onEventClick={onEventClick} />
                </svg>
              </div>

              {/* Statistics */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max:</span>
                  <span className="font-semibold">{data.max.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Q3:</span>
                  <span className="font-semibold">{data.q3.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Median:</span>
                  <span className="font-bold text-blue-600">{data.median.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Q1:</span>
                  <span className="font-semibold">{data.q1.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min:</span>
                  <span className="font-semibold">{data.min.toFixed(1)}%</span>
                </div>
                {data.outliers.length > 0 && (
                  <div className="pt-1 text-orange-600">
                    <span className="font-semibold">{data.outliers.length} outliers</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Outliers Detail */}
        {totalOutliers > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Notable Outliers (Click to View Details)</h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allData.flatMap((d) => d.outliers).map((outlier, idx) => (
                <button
                  key={idx}
                  onClick={() => onEventClick?.(outlier.eventId)}
                  className="flex items-center justify-between rounded-lg border bg-muted/20 p-2 text-left text-xs transition-colors hover:bg-muted/40"
                >
                  <span className="font-semibold">{outlier.instrumentName}</span>
                  <Badge
                    variant={outlier.value > 0 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {outlier.value > 0 ? "+" : ""}
                    {outlier.value.toFixed(1)}%
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BOX PLOT VISUALIZATION COMPONENT
// ============================================================================

function BoxPlotVisualization({
  data,
  onEventClick,
}: {
  data: BoxPlotData
  onEventClick?: (eventId: string) => void
}) {
  // Scale: -20% to +20% mapped to 300px height (with 10px padding top/bottom)
  const scale = (value: number) => {
    const min = -20
    const max = 20
    const range = max - min
    return 300 - ((value - min) / range) * 280 - 10
  }

  const boxWidth = 40
  const centerX = 50

  return (
    <g>
      {/* Y-axis grid lines */}
      {[-20, -10, 0, 10, 20].map((val) => (
        <g key={val}>
          <line
            x1="0"
            x2="100"
            y1={scale(val)}
            y2={scale(val)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
          <text
            x="2"
            y={scale(val) - 2}
            fontSize="8"
            fill="#9ca3af"
          >
            {val}%
          </text>
        </g>
      ))}

      {/* Whisker (min to Q1) */}
      <line
        x1={centerX}
        x2={centerX}
        y1={scale(data.min)}
        y2={scale(data.q1)}
        stroke="#6b7280"
        strokeWidth="1"
      />

      {/* Box (Q1 to Q3) */}
      <rect
        x={centerX - boxWidth / 2}
        y={scale(data.q3)}
        width={boxWidth}
        height={scale(data.q1) - scale(data.q3)}
        fill="#3b82f6"
        fillOpacity="0.2"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Median line */}
      <line
        x1={centerX - boxWidth / 2}
        x2={centerX + boxWidth / 2}
        y1={scale(data.median)}
        y2={scale(data.median)}
        stroke="#3b82f6"
        strokeWidth="2.5"
      />

      {/* Mean marker (X) */}
      <g>
        <line
          x1={centerX - 3}
          x2={centerX + 3}
          y1={scale(data.mean) - 3}
          y2={scale(data.mean) + 3}
          stroke="#ef4444"
          strokeWidth="2"
        />
        <line
          x1={centerX - 3}
          x2={centerX + 3}
          y1={scale(data.mean) + 3}
          y2={scale(data.mean) - 3}
          stroke="#ef4444"
          strokeWidth="2"
        />
      </g>

      {/* Whisker (Q3 to max) */}
      <line
        x1={centerX}
        x2={centerX}
        y1={scale(data.q3)}
        y2={scale(data.max)}
        stroke="#6b7280"
        strokeWidth="1"
      />

      {/* Outliers */}
      {data.outliers.map((outlier, idx) => (
        <TooltipProvider key={idx}>
          <Tooltip>
            <TooltipTrigger asChild>
              <circle
                cx={centerX + (idx % 2 === 0 ? -8 : 8)}
                cy={scale(outlier.value)}
                r="3"
                fill="#f97316"
                stroke="#fff"
                strokeWidth="1"
                className="cursor-pointer transition-all hover:r-4"
                onClick={() => onEventClick?.(outlier.eventId)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {outlier.instrumentName}
                <br />
                {outlier.value.toFixed(2)}%
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </g>
  )
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateBoxPlot(
  eventSignals: EventSignals[],
  signalKey: keyof EventSignals["signals"],
  label: string
): BoxPlotData {
  // Extract values
  const values = eventSignals
    .map((e) => {
      const signal = e.signals[signalKey]
      return signal && typeof signal === "object" && "value" in signal
        ? { value: signal.value, eventId: e.eventId, valoren: e.valoren }
        : null
    })
    .filter((v): v is { value: number; eventId: string; valoren: string } => v !== null)

  const sortedValues = [...values].sort((a, b) => a.value - b.value)

  if (sortedValues.length === 0) {
    return {
      label,
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0,
      mean: 0,
      outliers: [],
      count: 0,
    }
  }

  // Calculate quartiles
  const q1Index = Math.floor(sortedValues.length * 0.25)
  const medianIndex = Math.floor(sortedValues.length * 0.5)
  const q3Index = Math.floor(sortedValues.length * 0.75)

  const q1 = sortedValues[q1Index].value
  const median = sortedValues[medianIndex].value
  const q3 = sortedValues[q3Index].value
  const iqr = q3 - q1

  // Calculate outliers (beyond 1.5 × IQR)
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  const outliers = sortedValues
    .filter((v) => v.value < lowerBound || v.value > upperBound)
    .map((v) => {
      const event = eventSignals.find((e) => e.eventId === v.eventId)
      return {
        value: v.value,
        eventId: v.eventId,
        instrumentName: event?.valoren || v.valoren,
      }
    })

  const nonOutliers = sortedValues.filter(
    (v) => v.value >= lowerBound && v.value <= upperBound
  )

  const min = nonOutliers.length > 0 ? nonOutliers[0].value : sortedValues[0].value
  const max =
    nonOutliers.length > 0
      ? nonOutliers[nonOutliers.length - 1].value
      : sortedValues[sortedValues.length - 1].value

  const mean = sortedValues.reduce((sum, v) => sum + v.value, 0) / sortedValues.length

  return {
    label,
    min,
    q1,
    median,
    q3,
    max,
    mean,
    outliers,
    count: sortedValues.length,
  }
}
