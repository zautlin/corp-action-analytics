"use client"

import { useEffect, useRef } from "react"
import { init, dispose } from "klinecharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CandlestickChartProps {
  symbol: string
  timeframe: string
}

// Generate dummy EOD data for AAPL-like stock
const generateDummyData = () => {
  const data = []
  let basePrice = 180
  const startDate = new Date("2024-07-01")

  for (let i = 0; i < 150; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const change = (Math.random() - 0.48) * 8
    const open = basePrice
    const close = basePrice + change
    const high = Math.max(open, close) + Math.random() * 4
    const low = Math.min(open, close) - Math.random() * 4
    const volume = Math.floor(20000000 + Math.random() * 60000000)

    data.push({
      timestamp: date.getTime(),
      open: Number.parseFloat(open.toFixed(2)),
      high: Number.parseFloat(high.toFixed(2)),
      low: Number.parseFloat(low.toFixed(2)),
      close: Number.parseFloat(close.toFixed(2)),
      volume,
    })

    basePrice = close
  }

  return data
}

// Corporate actions data
const corporateActions = [
  {
    timestamp: new Date("2024-10-31").getTime(),
    type: "earnings",
    text: "E",
    description: "Q4 2024 Earnings Report - EPS: $1.64",
  },
  {
    timestamp: new Date("2024-11-08").getTime(),
    type: "dividend",
    text: "D",
    description: "Quarterly Dividend: $0.25 per share",
  },
  {
    timestamp: new Date("2024-08-01").getTime(),
    type: "earnings",
    text: "E",
    description: "Q3 2024 Earnings Report - EPS: $1.40",
  },
]

const dummyData = generateDummyData()

export function CandlestickChart({ symbol, timeframe }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof init>>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Initialize chart with styles
    const chart = init(chartContainerRef.current, {
      styles: {
        candle: {
          priceMark: {
            last: {
              show: true,
              upColor: "#26a69a",
              downColor: "#ef5350",
              noChangeColor: "#888888",
            },
          },
          bar: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            noChangeColor: "#888888",
            upBorderColor: "#26a69a",
            downBorderColor: "#ef5350",
            noChangeBorderColor: "#888888",
            upWickColor: "#26a69a",
            downWickColor: "#ef5350",
            noChangeWickColor: "#888888",
          },
        },
        indicator: {
          bars: [
            {
              style: "fill",
              borderStyle: "solid",
              borderSize: 1,
              borderDashedValue: [2, 2],
              upColor: "rgba(38, 166, 154, 0.5)",
              downColor: "rgba(239, 83, 80, 0.5)",
              noChangeColor: "#888888",
            },
          ],
        },
        xAxis: {
          show: true,
          tickText: {
            color: "#9ca3af",
          },
        },
        yAxis: {
          show: true,
          tickText: {
            color: "#9ca3af",
          },
        },
        grid: {
          show: true,
          horizontal: {
            show: true,
            color: "#2d3748",
          },
          vertical: {
            show: true,
            color: "#2d3748",
          },
        },
        crosshair: {
          show: true,
          horizontal: {
            show: true,
            line: {
              show: true,
              style: "dashed",
              color: "#9ca3af",
            },
            text: {
              show: true,
              color: "#ffffff",
              backgroundColor: "#374151",
            },
          },
          vertical: {
            show: true,
            line: {
              show: true,
              style: "dashed",
              color: "#9ca3af",
            },
            text: {
              show: true,
              color: "#ffffff",
              backgroundColor: "#374151",
            },
          },
        },
      },
    })

    if (!chart) {
      console.error("[v0] Failed to initialize chart")
      return
    }

    chartRef.current = chart

    chart.setSymbol({ ticker: symbol })
    chart.setPeriod({ span: 1, type: "day" })
    chart.setDataLoader({
      getBars: ({ callback }) => {
        callback(dummyData, false)
      },
    })

    // Create volume indicator
    chart.createIndicator("VOL", false, { id: "volume_pane" })

    console.log("[v0] Chart initialized with setDataLoader, data points:", dummyData.length)

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        chartRef.current.resize()
      }
    })

    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      if (chartContainerRef.current) {
        dispose(chartContainerRef.current)
      }
    }
  }, [symbol, timeframe])

  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      <div ref={chartContainerRef} className="flex-1 min-h-0" style={{ height: "calc(100% - 40px)" }} />

      {/* Corporate Action Legend */}
      <div className="flex items-center justify-between border-t border-border bg-card/95 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            {corporateActions.map((action, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[10px] font-bold text-white transition-transform hover:scale-110 ${
                      action.type === "earnings"
                        ? "bg-blue-500"
                        : action.type === "dividend"
                          ? "bg-green-500"
                          : "bg-amber-500"
                    }`}
                  >
                    {action.text}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-medium">{action.type.charAt(0).toUpperCase() + action.type.slice(1)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(action.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-xs">{action.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-mono">{new Date().toLocaleTimeString("en-US", { hour12: false })} UTC</span>
          <span className="border-l border-border pl-4">ADJ</span>
        </div>
      </div>
    </div>
  )
}
