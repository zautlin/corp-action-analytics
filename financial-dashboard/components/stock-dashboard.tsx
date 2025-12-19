"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CandlestickChart } from "@/components/candlestick-chart"
import { VolumeChart } from "@/components/volume-chart"
import { MetricsCards } from "@/components/metrics-cards"
import { CorporateActions } from "@/components/corporate-actions"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp } from "lucide-react"

export function StockDashboard() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Financial Dashboard</h1>
                <p className="text-xs text-muted-foreground">Real-time market data & analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
              <Button size="sm">Export</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Metrics Cards */}
          <MetricsCards />

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price Action (OHLC)</CardTitle>
            </CardHeader>
            <CardContent>
              <CandlestickChart />
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Volume & Turnover</CardTitle>
            </CardHeader>
            <CardContent>
              <VolumeChart />
            </CardContent>
          </Card>

          {/* Corporate Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Corporate Actions Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <CorporateActions />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
