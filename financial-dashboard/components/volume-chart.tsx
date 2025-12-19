"use client"

import { useMemo } from "react"
import { ChartContainer } from "@/components/ui/chart"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample volume and turnover data
const generateVolumeData = () => {
  const data = []

  for (let i = 0; i < 30; i++) {
    const volume = 35 + Math.random() * 20
    const turnover = volume * (140 + Math.random() * 30)

    data.push({
      date: `Day ${i + 1}`,
      volume: Number.parseFloat(volume.toFixed(2)),
      turnover: Number.parseFloat((turnover / 1000).toFixed(2)), // Convert to billions
    })
  }

  return data
}

export function VolumeChart() {
  const data = useMemo(() => generateVolumeData(), [])

  return (
    <ChartContainer
      config={{
        volume: {
          label: "Volume (M)",
          color: "hsl(var(--chart-3))",
        },
        turnover: {
          label: "Turnover (B)",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[350px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
          <YAxis
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            label={{
              value: "Volume (M)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            label={{
              value: "Turnover (B)",
              angle: 90,
              position: "insideRight",
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">{payload[0].payload.date}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-chart-3" />
                          <span className="text-muted-foreground">Volume:</span>
                        </div>
                        <span className="font-mono font-medium">{payload[0].value}M</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-chart-4" />
                          <span className="text-muted-foreground">Turnover:</span>
                        </div>
                        <span className="font-mono font-medium">${payload[1].value}B</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
          <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--chart-3))" name="Volume (M)" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="turnover"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            name="Turnover (B)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
