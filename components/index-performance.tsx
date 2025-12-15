"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"

// Monthly performance data
const performanceData = [
  { month: "Jan", indexValue: 1000, benchmark: 995, sector: 1020 },
  { month: "Feb", indexValue: 1045, benchmark: 1020, sector: 1055 },
  { month: "Mar", indexValue: 1089, benchmark: 1055, sector: 1120 },
  { month: "Apr", indexValue: 1124, benchmark: 1090, sector: 1195 },
  { month: "May", indexValue: 1167, benchmark: 1135, sector: 1275 },
  { month: "Jun", indexValue: 1210, benchmark: 1180, sector: 1380 },
  { month: "Jul", indexValue: 1256, benchmark: 1225, sector: 1495 },
  { month: "Aug", indexValue: 1310, benchmark: 1275, sector: 1620 },
  { month: "Sep", indexValue: 1365, benchmark: 1330, sector: 1755 },
  { month: "Oct", indexValue: 1425, benchmark: 1385, sector: 1895 },
  { month: "Nov", indexValue: 1495, benchmark: 1445, sector: 2045 },
  { month: "Dec", indexValue: 1575, benchmark: 1510, sector: 2210 },
]

// Sector allocation data
const sectorData = [
  { name: "Clean Energy", value: 35, fill: "#22c55e" },
  { name: "Transportation", value: 20, fill: "#10b981" },
  { name: "Technology", value: 25, fill: "#3b82f6" },
  { name: "Infrastructure", value: 15, fill: "#06b6d4" },
  { name: "Other", value: 5, fill: "#94a3b8" },
]

// Monthly returns
const returnsData = [
  { month: "Jan", return: 0.0 },
  { month: "Feb", return: 4.5 },
  { month: "Mar", return: 4.2 },
  { month: "Apr", return: 3.2 },
  { month: "May", return: 3.8 },
  { month: "Jun", return: 3.7 },
  { month: "Jul", return: 3.8 },
  { month: "Aug", return: 4.3 },
  { month: "Sep", return: 4.2 },
  { month: "Oct", return: 4.4 },
  { month: "Nov", return: 4.9 },
  { month: "Dec", return: 5.4 },
]

export function IndexPerformance() {
  const [timeframe, setTimeframe] = useState<"1y" | "ytd" | "3y">("1y")

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

      {/* Index Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Index Performance</CardTitle>
              <CardDescription>Cumulative return comparison vs benchmark and sector</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeframe === "ytd" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("ytd")}
              >
                YTD
              </Button>
              <Button
                variant={timeframe === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("1y")}
              >
                1Y
              </Button>
              <Button
                variant={timeframe === "3y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("3y")}
              >
                3Y
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                formatter={(value) => value.toLocaleString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="indexValue"
                stroke="#22c55e"
                strokeWidth={2}
                name="Clean Energy Index"
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="S&P 500"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sector"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Clean Energy Sector"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="mt-4 text-xs text-muted-foreground">
            The index has outperformed the S&P 500 by {(totalReturn - benchmarkReturn).toFixed(1)}% over the past year,
            demonstrating strong exposure to clean energy growth trends.
          </p>
        </CardContent>
      </Card>

      {/* Monthly Returns Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Returns</CardTitle>
          <CardDescription>Average monthly contribution to total return</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={returnsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                formatter={(value) => `${value.toFixed(2)}%`}
              />
              <Bar dataKey="return" fill="#10b981" name="Monthly Return" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-xs text-muted-foreground">
            Average monthly return of 3.96% with consistent positive performance throughout the year.
          </p>
        </CardContent>
      </Card>

      {/* Sector Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Allocation</CardTitle>
          <CardDescription>Index composition by sector exposure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Allocation %" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-3 md:w-48">
              {sectorData.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sector.fill }}
                    />
                    <span className="text-sm">{sector.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
