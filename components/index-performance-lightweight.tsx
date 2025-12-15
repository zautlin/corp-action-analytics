"use client"

"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"

// Import charts library dynamically to avoid SSR issues
let createChart: any = null
let ColorType: any = null

const loadChartLibrary = async () => {
  if (!createChart || !ColorType) {
    try {
      const module = await import("lightweight-charts")
      createChart = module.createChart
      ColorType = module.ColorType
    } catch (error) {
      console.error("Failed to load lightweight-charts:", error)
    }
  }
}

// Monthly performance data
const performanceData = [
  { time: "2024-01", indexValue: 1000, benchmark: 995, sector: 1020 },
  { time: "2024-02", indexValue: 1045, benchmark: 1020, sector: 1055 },
  { time: "2024-03", indexValue: 1089, benchmark: 1055, sector: 1120 },
  { time: "2024-04", indexValue: 1124, benchmark: 1090, sector: 1195 },
  { time: "2024-05", indexValue: 1167, benchmark: 1135, sector: 1275 },
  { time: "2024-06", indexValue: 1210, benchmark: 1180, sector: 1380 },
  { time: "2024-07", indexValue: 1256, benchmark: 1225, sector: 1495 },
  { time: "2024-08", indexValue: 1310, benchmark: 1275, sector: 1620 },
  { time: "2024-09", indexValue: 1365, benchmark: 1330, sector: 1755 },
  { time: "2024-10", indexValue: 1425, benchmark: 1385, sector: 1895 },
  { time: "2024-11", indexValue: 1495, benchmark: 1445, sector: 2045 },
  { time: "2024-12", indexValue: 1575, benchmark: 1510, sector: 2210 },
]

// Candlestick data for technical analysis
const candlestickData = [
  { time: "2024-01", open: 1000, high: 1025, low: 985, close: 1015 },
  { time: "2024-02", open: 1015, high: 1055, low: 1010, close: 1045 },
  { time: "2024-03", open: 1045, high: 1100, low: 1040, close: 1089 },
  { time: "2024-04", open: 1089, high: 1135, low: 1080, close: 1124 },
  { time: "2024-05", open: 1124, high: 1180, low: 1120, close: 1167 },
  { time: "2024-06", open: 1167, high: 1215, low: 1160, close: 1210 },
  { time: "2024-07", open: 1210, high: 1270, low: 1205, close: 1256 },
  { time: "2024-08", open: 1256, high: 1320, low: 1250, close: 1310 },
  { time: "2024-09", open: 1310, high: 1380, low: 1305, close: 1365 },
  { time: "2024-10", open: 1365, high: 1450, low: 1360, close: 1425 },
  { time: "2024-11", open: 1425, high: 1510, low: 1420, close: 1495 },
  { time: "2024-12", open: 1495, high: 1580, low: 1490, close: 1575 },
]

function PerformanceLineChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const init = async () => {
      await loadChartLibrary()
      setIsReady(true)
    }
    if (isHydrated) {
      init()
    }
  }, [isHydrated])

  useEffect(() => {
    if (!isReady || !isHydrated || !containerRef.current) return

    try {
      if (!createChart || !ColorType) {
        console.error("Chart library not available")
        return
      }

      const chart = createChart(containerRef.current, {
        layout: {
          textColor: "#64748b",
          background: { type: ColorType.Solid, color: "transparent" },
        },
        width: containerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      })
      chartRef.current = chart

      const indexSeries = chart.addLineSeries({
        color: "#22c55e",
        lineWidth: 2,
        title: "Clean Energy Index",
      })
      indexSeries.setData(
        performanceData.map((d) => ({ time: d.time as any, value: d.indexValue }))
      )

      const benchmarkSeries = chart.addLineSeries({
        color: "#94a3b8",
        lineWidth: 2,
        lineStyle: 2,
        title: "S&P 500",
      })
      benchmarkSeries.setData(
        performanceData.map((d) => ({ time: d.time as any, value: d.benchmark }))
      )

      const sectorSeries = chart.addLineSeries({
        color: "#3b82f6",
        lineWidth: 2,
        title: "Clean Energy Sector",
      })
      sectorSeries.setData(
        performanceData.map((d) => ({ time: d.time as any, value: d.sector }))
      )

      chart.timeScale().fitContent()

      const handleResize = () => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
        }
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    } catch (error) {
      console.error("Error creating chart:", error)
    }
  }, [isReady, isHydrated])

  if (!isHydrated) return <div style={{ width: "100%", height: "400px" }} />
  return <div ref={containerRef} style={{ width: "100%" }} />
}

function TechnicalAnalysisChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const init = async () => {
      await loadChartLibrary()
      setIsReady(true)
    }
    if (isHydrated) {
      init()
    }
  }, [isHydrated])

  useEffect(() => {
    if (!isReady || !isHydrated || !containerRef.current) return

    try {
      if (!createChart || !ColorType) {
        console.error("Chart library not available")
        return
      }

      const chart = createChart(containerRef.current, {
        layout: {
          textColor: "#64748b",
          background: { type: ColorType.Solid, color: "transparent" },
        },
        width: containerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      })
      chartRef.current = chart

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#16a34a",
        borderDownColor: "#dc2626",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      })
      candleSeries.setData(candlestickData as any)

      // Add a simple moving average
      const maLength = 3
      const maData = candlestickData.map((d, i) => {
        if (i < maLength - 1) return null
        const sum = candlestickData
          .slice(i - maLength + 1, i + 1)
          .reduce((acc, val) => acc + (val.open + val.close) / 2, 0)
        return {
          time: d.time as any,
          value: sum / maLength,
        }
      }).filter(Boolean)

      const maSeries = chart.addLineSeries({
        color: "#f97316",
        lineWidth: 2,
        title: "3-Month MA",
      })
      maSeries.setData(maData as any)

      chart.timeScale().fitContent()

      const handleResize = () => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
        }
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    } catch (error) {
      console.error("Error creating technical chart:", error)
    }
  }, [isReady, isHydrated])

  if (!isHydrated) return <div style={{ width: "100%", height: "400px" }} />
  return <div ref={containerRef} style={{ width: "100%" }} />
}

function AreaChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const init = async () => {
      await loadChartLibrary()
      setIsReady(true)
    }
    if (isHydrated) {
      init()
    }
  }, [isHydrated])

  useEffect(() => {
    if (!isReady || !isHydrated || !containerRef.current) return

    try {
      if (!createChart || !ColorType) {
        console.error("Chart library not available")
        return
      }

      const chart = createChart(containerRef.current, {
        layout: {
          textColor: "#64748b",
          background: { type: ColorType.Solid, color: "transparent" },
        },
        width: containerRef.current.clientWidth,
        height: 300,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      })
      chartRef.current = chart

      const areaSeries = chart.addAreaSeries({
        lineColor: "#22c55e",
        topColor: "rgba(34, 197, 94, 0.2)",
        bottomColor: "rgba(34, 197, 94, 0.02)",
        lineWidth: 2,
        title: "Cumulative Returns",
      })
      areaSeries.setData(
        performanceData.map((d) => ({ time: d.time as any, value: ((d.indexValue - 1000) / 1000) * 100 }))
      )

      chart.timeScale().fitContent()

      const handleResize = () => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
        }
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    } catch (error) {
      console.error("Error creating area chart:", error)
    }
  }, [isReady, isHydrated])

  if (!isHydrated) return <div style={{ width: "100%", height: "300px" }} />
  return <div ref={containerRef} style={{ width: "100%" }} />
}

export function IndexPerformanceLightweight() {
  const [selectedChart, setSelectedChart] = useState<"performance" | "technical" | "area">("performance")

  const totalReturn = 57.5
  const benchmarkReturn = 51.2
  const yearToDateReturn = 24.8
  const volatility = 12.3

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">1-Year Return</p>
                <p className="text-2xl font-bold text-green-600">{totalReturn.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">vs Benchmark: {benchmarkReturn.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Year-to-Date</p>
                <p className="text-2xl font-bold text-green-600">+{yearToDateReturn.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">Since Jan 1, 2025</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volatility (Annual)</p>
                <p className="text-2xl font-bold">{volatility.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">Standard Deviation</p>
              </div>
              <TrendingDown className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
                <p className="text-2xl font-bold">2.34</p>
                <p className="text-xs text-muted-foreground mt-2">Risk-Adjusted Return</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Selection Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Analysis - Lightweight Charts</CardTitle>
              <CardDescription>Interactive charts with technical analysis capabilities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedChart === "performance" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart("performance")}
              >
                Performance
              </Button>
              <Button
                variant={selectedChart === "technical" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart("technical")}
              >
                Technical
              </Button>
              <Button
                variant={selectedChart === "area" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChart("area")}
              >
                Area
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedChart === "performance" && (
            <div>
              <PerformanceLineChart />
              <p className="mt-4 text-xs text-muted-foreground">
                The index has outperformed the S&P 500 by {(totalReturn - benchmarkReturn).toFixed(1)}% over the past year.
                This lightweight chart offers superior performance for real-time data updates.
              </p>
            </div>
          )}
          {selectedChart === "technical" && (
            <div>
              <TechnicalAnalysisChart />
              <p className="mt-4 text-xs text-muted-foreground">
                Candlestick chart with 3-month moving average overlay. Shows OHLC (Open, High, Low, Close) data with trend analysis for technical investors.
              </p>
            </div>
          )}
          {selectedChart === "area" && (
            <div>
              <AreaChart />
              <p className="mt-4 text-xs text-muted-foreground">
                Cumulative returns visualization using area chart. Shows the index's growth trajectory with shaded area highlighting positive momentum.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Comparison Info */}
      <Card>
        <CardHeader>
          <CardTitle>Lightweight Charts Benefits</CardTitle>
          <CardDescription>Why we included this charting library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                Performance
              </h4>
              <p className="text-sm text-muted-foreground">
                Extremely lightweight and fast, perfect for displaying real-time financial data with minimal CPU usage.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                Technical Features
              </h4>
              <p className="text-sm text-muted-foreground">
                Built specifically for financial charts with native support for candlesticks, technical analysis, and time-based data.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                Professional Grade
              </h4>
              <p className="text-sm text-muted-foreground">
                Used by major trading platforms and financial websites for displaying market data at scale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
