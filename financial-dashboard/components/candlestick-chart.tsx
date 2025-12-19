"use client"

import { useMemo } from "react"
import { ChartContainer } from "@/components/ui/chart"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

// Sample OHLC data
const generateOHLCData = () => {
  const data = []
  let price = 150

  for (let i = 0; i < 30; i++) {
    const open = price + (Math.random() - 0.5) * 2
    const close = open + (Math.random() - 0.5) * 8
    const high = Math.max(open, close) + Math.random() * 3
    const low = Math.min(open, close) - Math.random() * 3

    data.push({
      date: `Day ${i + 1}`,
      open,
      high,
      low,
      close,
      candleHigh: high,
      candleLow: low,
      candleBody: Math.abs(close - open),
      candleStart: Math.min(open, close),
    })

    price = close
  }

  return data
}

export function CandlestickChart() {
  const data = useMemo(() => generateOHLCData(), [])

  return (
    <ChartContainer
      config={{
        bullish: {
          label: "Bullish",
          color: "hsl(var(--chart-1))",
        },
        bearish: {
          label: "Bearish",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">{data.date}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Open:</span>
                        <span className="font-mono font-medium">${data.open.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">High:</span>
                        <span className="font-mono font-medium">${data.high.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Low:</span>
                        <span className="font-mono font-medium">${data.low.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Close:</span>
                        <span className="font-mono font-medium">${data.close.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          {/* High-Low wicks */}
          <Line
            type="linear"
            dataKey="candleHigh"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
            dot={false}
            activeDot={false}
          />
          {/* Candlestick bodies */}
          <Bar dataKey="candleBody" stackId="candle">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.close >= entry.open ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
