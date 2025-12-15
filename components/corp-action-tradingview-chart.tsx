"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CorporateAction, EODData } from "@/lib/types"
import { TrendingUp, Maximize2, Calendar, DollarSign } from "lucide-react"

interface CorpActionTradingViewChartProps {
  action: CorporateAction
  showVolume?: boolean
  height?: number
}

// TradingView types
declare global {
  interface Window {
    TradingView: any
  }
}

export function CorpActionTradingViewChart({
  action,
  showVolume = true,
  height = 450,
}: CorpActionTradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartReady, setChartReady] = useState(false)
  const [eodData, setEodData] = useState<EODData[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch EOD data
  useEffect(() => {
    const fetchEODData = async () => {
      try {
        const response = await fetch(`/api/eod-data?valoren=${action.valoren}`)
        if (!response.ok) {
          console.warn('Failed to fetch EOD data, using fallback')
          setEodData([])
          setDataLoaded(true)
          return
        }
        const result = await response.json()
        setEodData(result.data || [])
        setDataLoaded(true)
      } catch (error) {
        console.error('Error fetching EOD data:', error)
        setEodData([])
        setDataLoaded(true)
      }
    }
    
    fetchEODData()
  }, [action.valoren])

  useEffect(() => {
    if (!containerRef.current || !dataLoaded) return

    // Load TradingView library
    const loadTradingView = () => {
      if (window.TradingView) {
        initializeChart()
        return
      }

      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        initializeChart()
      }
      script.onerror = () => {
        console.error("Failed to load TradingView library")
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializeChart = () => {
      if (!window.TradingView || !containerRef.current) return
      
      // Skip if no data available
      if (!eodData || eodData.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        // Create unique container
        const containerId = `tv_chart_${action.eventId}`
        const chartContainer = document.createElement("div")
        chartContainer.id = containerId
        chartContainer.style.height = `${height}px`

        // Clear and append
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
          containerRef.current.appendChild(chartContainer)
        }

        // Prepare candlestick data from real EOD data
        const chartData = eodData.map((d) => ({
          time: new Date(d.date).getTime() / 1000,
          open: d.openPrice || d.closePrice,
          high: d.highPrice || d.closePrice,
          low: d.lowPrice || d.closePrice,
          close: d.closePrice,
          volume: d.volume || 0,
        })).filter(d => d.close > 0) // Filter out invalid data

        // Initialize TradingView widget with advanced features
        widgetRef.current = new window.TradingView.widget({
          container_id: containerId,
          width: "100%",
          height: height,
          symbol: `${action.instrumentName} (${action.valoren})`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1", // Candlestick
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: false,
          save_image: true,
          hide_side_toolbar: false,
          
          // Studies/Indicators
          studies: showVolume
            ? [
                "Volume@tv-basicstudies",
                "RSI@tv-basicstudies",
                "MASimple@tv-basicstudies",
              ]
            : [],

          // Disabled features for cleaner look
          disabled_features: [
            "use_localstorage_for_settings",
            "header_symbol_search",
            "header_compare",
          ],

          // Enabled features
          enabled_features: [
            "study_templates",
            "side_toolbar_in_fullscreen_mode",
            "header_saveload",
            "create_volume_indicator_by_default",
          ],

          // Overrides for custom styling
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#10b981",
            "mainSeriesProperties.candleStyle.downColor": "#ef4444",
            "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
            "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          },

          // Custom data feed would go here in production
          datafeed: createCustomDatafeed(chartData, action),
        })

        widgetRef.current.onChartReady(() => {
          setChartReady(true)
          setIsLoading(false)

          // Add event markers for corporate actions
          addEventMarkers(widgetRef.current, action)
        })
      } catch (error) {
        console.error("Error initializing TradingView:", error)
        setIsLoading(false)
      }
    }

    loadTradingView()

    return () => {
      if (widgetRef.current && widgetRef.current.remove) {
        widgetRef.current.remove()
      }
    }
  }, [action, showVolume, height, eodData, dataLoaded])

  // Calculate statistics from real EOD data
  const exDivData = eodData.find((d) => d.date === action.exDividendDate)
  const exDivIndex = eodData.findIndex((d) => d.date === action.exDividendDate)
  const prevData = exDivIndex > 0 ? eodData[exDivIndex - 1] : null
  const priceChange = exDivData && prevData
    ? ((exDivData.closePrice - prevData.closePrice) / prevData.closePrice) * 100
    : 0

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
              TradingView advanced charting with indicators and event markers
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
        {!dataLoaded && (
          <div className="flex h-[450px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading EOD data...</p>
            </div>
          </div>
        )}
        
        {dataLoaded && eodData.length === 0 && (
          <div className="flex h-[450px] items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No EOD data available for this instrument</p>
            </div>
          </div>
        )}
        
        {dataLoaded && isLoading && eodData.length > 0 && (
          <div className="flex h-[450px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading TradingView Chart...</p>
            </div>
          </div>
        )}

        {dataLoaded && <div ref={containerRef} className="w-full" />}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span className="text-muted-foreground">Price Up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-500" />
              <span className="text-muted-foreground">Price Down</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span className="text-muted-foreground">Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-orange-500" />
              <span className="text-muted-foreground">Corporate Action Date</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Maximize2 className="mr-1 h-3 w-3" />
              Fullscreen
            </Button>
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

// Helper function to create custom datafeed
function createCustomDatafeed(chartData: any[], action: CorporateAction) {
  return {
    onReady: (callback: any) => {
      setTimeout(() => {
        callback({
          supported_resolutions: ["D", "W", "M"],
          supports_marks: true,
          supports_timescale_marks: true,
        })
      }, 0)
    },

    searchSymbols: () => {},

    resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any) => {
      const symbolInfo = {
        name: symbolName,
        description: action.instrumentName,
        type: "stock",
        session: "24x7",
        timezone: "Etc/UTC",
        ticker: action.valoren,
        exchange: "XSWX",
        minmov: 1,
        pricescale: 100,
        has_intraday: false,
        has_weekly_and_monthly: true,
        supported_resolutions: ["D", "W", "M"],
        volume_precision: 0,
        data_status: "streaming",
      }
      setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0)
    },

    getBars: (
      symbolInfo: any,
      resolution: string,
      periodParams: any,
      onHistoryCallback: any,
      onErrorCallback: any
    ) => {
      try {
        const bars = chartData.map((d) => ({
          time: d.time * 1000,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }))

        onHistoryCallback(bars, { noData: bars.length === 0 })
      } catch (error) {
        onErrorCallback(error)
      }
    },

    subscribeBars: () => {},
    unsubscribeBars: () => {},

    // Add marks for corporate actions
    getMarks: (symbolInfo: any, from: number, to: number, onDataCallback: any) => {
      const exDivTimestamp = new Date(action.exDividendDate).getTime() / 1000

      const marks = [
        {
          id: action.eventId,
          time: exDivTimestamp,
          color: { border: "#ef4444", background: "#fecaca" },
          text: `${action.actionTypeLabel}`,
          label: "E",
          labelFontColor: "#ef4444",
          minSize: 20,
        },
      ]

      // Add announcement date if available
      if (action.announcementDate && action.announcementDate !== action.exDividendDate) {
        const announceTimestamp = new Date(action.announcementDate).getTime() / 1000
        marks.push({
          id: `${action.eventId}_announce`,
          time: announceTimestamp,
          color: { border: "#3b82f6", background: "#bfdbfe" },
          text: "Announcement",
          label: "A",
          labelFontColor: "#3b82f6",
          minSize: 20,
        })
      }

      onDataCallback(marks)
    },
  }
}

// Helper to add event markers after chart is ready
function addEventMarkers(widget: any, action: CorporateAction) {
  try {
    widget.activeChart().createShape(
      { time: new Date(action.exDividendDate).getTime() / 1000 },
      {
        shape: "vertical_line",
        overrides: {
          linecolor: "#ef4444",
          linewidth: 2,
          linestyle: 2, // Dashed
        },
        text: `Ex-Div: ${action.amount} ${action.currency}`,
      }
    )

    // Add announcement marker if different
    if (action.announcementDate && action.announcementDate !== action.exDividendDate) {
      widget.activeChart().createShape(
        { time: new Date(action.announcementDate).getTime() / 1000 },
        {
          shape: "vertical_line",
          overrides: {
            linecolor: "#3b82f6",
            linewidth: 1,
            linestyle: 2,
          },
          text: "Announcement",
        }
      )
    }
  } catch (error) {
    console.error("Error adding event markers:", error)
  }
}
