"use client"

import { useEffect, useRef, useState } from "react"
import { init, dispose } from "klinecharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CorporateAction } from "@/lib/types"
import { TrendingUp, Calendar, DollarSign, Play, Maximize2, Search, Plus, BarChart3, Bell } from "lucide-react"

interface AdvancedPriceChartProps {
  action: CorporateAction
  valoren: string
  instrumentName: string
}

const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"]

export function AdvancedPriceChart({ action, valoren, instrumentName }: AdvancedPriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof init>>(null)
  const [timeframe, setTimeframe] = useState("1D")
  const [eodData, setEodData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [priceChange, setPriceChange] = useState(0)

  // Fetch EOD data
  useEffect(() => {
    const fetchEODData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/eod-data?valoren=${valoren}&eventDate=${action.exDividendDate}&daysAround=30`
        )
        if (!response.ok) {
          console.warn('Failed to fetch EOD data')
          setEodData([])
          return
        }
        const result = await response.json()
        const data = result.data || []
        
        // Transform EOD data to klinecharts format
        const chartData = data.map((d: any) => ({
          timestamp: new Date(d.date).getTime(),
          open: d.openPrice || d.closePrice,
          high: d.highPrice || d.closePrice,
          low: d.lowPrice || d.closePrice,
          close: d.closePrice,
          volume: d.volume || 0,
        })).filter((d: any) => d.close > 0)
        
        setEodData(chartData)
        
        // Calculate price change on ex-dividend date
        const exDivIndex = data.findIndex((d: any) => d.date === action.exDividendDate)
        if (exDivIndex > 0) {
          const prevPrice = data[exDivIndex - 1].closePrice
          const exDivPrice = data[exDivIndex].closePrice
          const change = ((exDivPrice - prevPrice) / prevPrice) * 100
          setPriceChange(change)
        }
      } catch (error) {
        console.error('Error fetching EOD data:', error)
        setEodData([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchEODData()
  }, [valoren, action.exDividendDate])

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || eodData.length === 0) return

    // Initialize chart with professional trading styles
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
      console.error("Failed to initialize chart")
      return
    }

    chartRef.current = chart

    chart.setSymbol({ ticker: instrumentName })
    chart.setPeriod({ span: 1, type: "day" })
    chart.setDataLoader({
      getBars: ({ callback }) => {
        callback(eodData, false)
      },
    })

    // Create volume indicator
    chart.createIndicator("VOL", false, { id: "volume_pane" })

    // Add corporate action marker
    const exDivTimestamp = new Date(action.exDividendDate).getTime()
    chart.createOverlay({
      name: 'simpleAnnotation',
      points: [{ timestamp: exDivTimestamp, value: 0 }],
      styles: {
        line: {
          color: '#ef4444',
          size: 2,
          style: 'dashed'
        }
      }
    })

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
  }, [eodData, instrumentName, action.exDividendDate])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price & Volume Impact Analysis
          </CardTitle>
          <CardDescription>Advanced candlestick chart with technical indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (eodData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price & Volume Impact Analysis
          </CardTitle>
          <CardDescription>Advanced candlestick chart with technical indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[600px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No price data available for this period</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Price & Volume Impact Analysis
            </CardTitle>
            <CardDescription>
              Advanced candlestick chart with volume indicators (±30 days around event)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {/* Event Info */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Ex-Date: {action.exDividendDate}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {action.currency} {action.amount.toFixed(2)}/share
              </div>
            </div>

            {/* Price Change */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Ex-Div Change</p>
              <p
                className={`text-xl font-bold ${
                  priceChange < 0
                    ? "text-red-600"
                    : priceChange > 0
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {priceChange > 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Action Type Badge */}
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className="font-normal">
            {action.actionTypeLabel}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {action.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart Controls */}
        <div className="mb-4 flex items-center justify-between border-b border-border bg-card pb-2">
          <div className="flex items-center gap-4">
            {/* Symbol */}
            <Button variant="ghost" size="sm" className="gap-2 font-semibold">
              <Search className="h-4 w-4" />
              {instrumentName}
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 border-l border-border pl-3">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 border-l border-border pl-3">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <BarChart3 className="h-4 w-4" />
                Indicators
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Bell className="h-4 w-4" />
                Alert
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Play className="h-4 w-4" />
                Replay
              </Button>
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Maximize2 className="mr-1 h-3 w-3" />
            Fullscreen
          </Button>
        </div>

        {/* Chart */}
        <div className="relative flex h-full w-full flex-col bg-card">
          <div ref={chartContainerRef} className="flex-1 min-h-0" style={{ height: "600px" }} />

          {/* Corporate Action Legend */}
          <div className="flex items-center justify-between border-t border-border bg-card/95 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[10px] font-bold text-white transition-transform hover:scale-110 bg-red-500">
                      E
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="font-medium">Ex-Dividend Date</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(action.exDividendDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs">{action.actionTypeLabel}: {action.currency} {action.amount.toFixed(2)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-mono">{new Date().toLocaleTimeString("en-US", { hour12: false })} UTC</span>
              <span className="border-l border-border pl-4">ADJ</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border bg-muted/30 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">Instrument</p>
            <p className="font-semibold">{action.instrumentName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ISIN</p>
            <p className="font-mono font-semibold">{action.isin}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Valoren</p>
            <p className="font-mono font-semibold">{action.valoren}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
