"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

interface CandlestickVolumeChartProps {
  timeframe: string
}

function generateOHLCData() {
  const dates = []
  const ohlc = []
  const volumes = []
  let basePrice = 165
  const points = 120

  for (let i = 0; i < points; i++) {
    const date = new Date(2024, 6, i + 1)
    dates.push(date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }))

    const open = basePrice + (Math.random() - 0.5) * 3
    const volatility = Math.random() * 5
    const high = open + Math.random() * volatility
    const low = open - Math.random() * volatility
    const close = low + Math.random() * (high - low)
    const volume = Math.random() * 60000000 + 20000000

    basePrice = close + (Math.random() - 0.48) * 2

    // ECharts candlestick format: [open, close, low, high]
    ohlc.push([Number(open.toFixed(2)), Number(close.toFixed(2)), Number(low.toFixed(2)), Number(high.toFixed(2))])
    volumes.push([i, Math.floor(volume), close >= open ? 1 : -1])
  }

  return { dates, ohlc, volumes }
}

export function CandlestickVolumeChart({ timeframe }: CandlestickVolumeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current, "dark")
    chartInstance.current = chart

    const { dates, ohlc, volumes } = generateOHLCData()

    // Calculate moving averages
    function calculateMA(dayCount: number, data: number[][]) {
      const result = []
      for (let i = 0; i < data.length; i++) {
        if (i < dayCount - 1) {
          result.push("-")
          continue
        }
        let sum = 0
        for (let j = 0; j < dayCount; j++) {
          sum += data[i - j][1] // close price
        }
        result.push((sum / dayCount).toFixed(2))
      }
      return result
    }

    const option = {
      backgroundColor: "transparent",
      animation: false,
      legend: {
        data: ["K", "MA5", "MA20", "MA60"],
        textStyle: { color: "oklch(0.60 0.01 264)" },
        top: 0,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: "oklch(0.10 0.01 264)",
        borderColor: "oklch(0.20 0.01 264)",
        textStyle: { color: "oklch(0.90 0.01 264)" },
        formatter: (params: any) => {
          const data = params[0]
          const ohlcData = ohlc[data.dataIndex]
          return `
            ${data.name}<br/>
            Open: ${ohlcData[0]}<br/>
            Close: ${ohlcData[1]}<br/>
            Low: ${ohlcData[2]}<br/>
            High: ${ohlcData[3]}<br/>
            Volume: ${(volumes[data.dataIndex][1] / 1000000).toFixed(2)}M
          `
        },
      },
      axisPointer: {
        link: [{ xAxisIndex: "all" }],
        label: { backgroundColor: "oklch(0.30 0.01 264)" },
      },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: false },
          brush: { type: ["lineX", "clear"] },
        },
        right: 20,
        top: 0,
        iconStyle: { borderColor: "oklch(0.60 0.01 264)" },
      },
      brush: {
        xAxisIndex: "all",
        brushLink: "all",
        outOfBrush: { colorAlpha: 0.1 },
      },
      grid: [
        {
          left: "3%",
          right: "60",
          top: "10%",
          height: "55%",
        },
        {
          left: "3%",
          right: "60",
          top: "70%",
          height: "20%",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: "oklch(0.20 0.01 264)" } },
          axisLabel: { color: "oklch(0.50 0.01 264)" },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
        {
          type: "category",
          gridIndex: 1,
          data: dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: "oklch(0.20 0.01 264)" } },
          axisLabel: { color: "oklch(0.50 0.01 264)" },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: false },
          axisLine: { lineStyle: { color: "oklch(0.20 0.01 264)" } },
          axisLabel: { color: "oklch(0.50 0.01 264)" },
          splitLine: { lineStyle: { color: "oklch(0.16 0.01 264)" } },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLine: { lineStyle: { color: "oklch(0.20 0.01 264)" } },
          axisLabel: {
            color: "oklch(0.50 0.01 264)",
            formatter: (value: number) => `${(value / 1000000).toFixed(0)}M`,
          },
          splitLine: { lineStyle: { color: "oklch(0.16 0.01 264)" } },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: 60,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: "slider",
          bottom: "2%",
          start: 60,
          end: 100,
          borderColor: "oklch(0.20 0.01 264)",
          textStyle: { color: "oklch(0.50 0.01 264)" },
          fillerColor: "oklch(0.20 0.05 264)",
        },
      ],
      series: [
        {
          name: "K",
          type: "candlestick",
          data: ohlc,
          itemStyle: {
            color: "rgb(34, 197, 94)", // green for bullish
            color0: "rgb(239, 68, 68)", // red for bearish
            borderColor: "rgb(34, 197, 94)",
            borderColor0: "rgb(239, 68, 68)",
          },
        },
        {
          name: "MA5",
          type: "line",
          data: calculateMA(5, ohlc),
          smooth: true,
          lineStyle: { width: 1, color: "rgb(251, 191, 36)" },
          showSymbol: false,
        },
        {
          name: "MA20",
          type: "line",
          data: calculateMA(20, ohlc),
          smooth: true,
          lineStyle: { width: 1, color: "rgb(168, 85, 247)" },
          showSymbol: false,
        },
        {
          name: "MA60",
          type: "line",
          data: calculateMA(60, ohlc),
          smooth: true,
          lineStyle: { width: 1, color: "rgb(14, 165, 233)" },
          showSymbol: false,
        },
        {
          name: "Volume",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: (params: any) => (params.data[2] > 0 ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)"),
          },
        },
      ],
    }

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.dispose()
    }
  }, [timeframe])

  return <div ref={chartRef} className="w-full h-full" />
}
