"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Database,
  Activity,
  Clock,
  Users,
  Download,
  ArrowUpRight,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function AnalyticsContent() {
  const queryVolumeData = [
    { month: "Jul", queries: 1850 },
    { month: "Aug", queries: 2100 },
    { month: "Sep", queries: 2450 },
    { month: "Oct", queries: 2200 },
    { month: "Nov", queries: 2680 },
    { month: "Dec", queries: 2950 },
    { month: "Jan", queries: 2829 },
  ]

  const dataVolumeData = [
    { month: "Jul", volume: 3.2 },
    { month: "Aug", volume: 3.8 },
    { month: "Sep", volume: 4.1 },
    { month: "Oct", volume: 4.5 },
    { month: "Nov", volume: 4.9 },
    { month: "Dec", volume: 5.2 },
    { month: "Jan", volume: 5.4 },
  ]

  const topDatasets = [
    { name: "Bloomberg Real-Time Equity Prices", queries: 1247, change: 12.5, trend: "up" },
    { name: "Refinitiv Fixed Income Reference Data", queries: 892, change: 8.3, trend: "up" },
    { name: "ICE Cryptocurrency Market Data", queries: 456, change: -3.2, trend: "down" },
    { name: "S&P Global ESG Scores", queries: 234, change: 15.7, trend: "up" },
  ]

  const usageByAssetClass = [
    { assetClass: "Equities", queries: 1580, percentage: 55.9 },
    { assetClass: "Fixed Income", queries: 892, percentage: 31.5 },
    { assetClass: "Crypto", queries: 234, percentage: 8.3 },
    { assetClass: "ESG", queries: 123, percentage: 4.3 },
  ]

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Monitor usage patterns and data consumption metrics
          </p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                12.5%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Queries</p>
            <p className="text-3xl font-bold">2,829</p>
            <p className="text-xs text-muted-foreground mt-1">vs. 2,513 last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                8.2%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Data Volume</p>
            <p className="text-3xl font-bold">5.4 TB</p>
            <p className="text-xs text-muted-foreground mt-1">vs. 5.0 TB last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <span>—</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active Datasets</p>
            <p className="text-3xl font-bold">4</p>
            <p className="text-xs text-muted-foreground mt-1">No change</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                5.3%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Avg Query Time</p>
            <p className="text-3xl font-bold">1.2s</p>
            <p className="text-xs text-muted-foreground mt-1">vs. 1.27s last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="datasets">By Dataset</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Query Volume Trend</CardTitle>
                <CardDescription>Total queries executed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={queryVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="queries" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Volume Trend</CardTitle>
                <CardDescription>Total data consumed (TB)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Asset Class</CardTitle>
              <CardDescription>Query distribution across asset classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageByAssetClass.map((item) => (
                  <div key={item.assetClass}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.assetClass}</Badge>
                        <span className="text-sm font-medium">{item.queries.toLocaleString()} queries</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Datasets by Query Volume</CardTitle>
              <CardDescription>Most frequently accessed datasets this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDatasets.map((dataset, idx) => (
                  <div key={dataset.name} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{dataset.name}</p>
                      <p className="text-xs text-muted-foreground">{dataset.queries.toLocaleString()} queries</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        dataset.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {dataset.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(dataset.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
                <CardDescription>Query activity by hour of day (UTC)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { hour: "09:00 - 12:00", percentage: 35, label: "Morning Peak" },
                    { hour: "12:00 - 15:00", percentage: 28, label: "Afternoon" },
                    { hour: "15:00 - 18:00", percentage: 22, label: "Late Afternoon" },
                    { hour: "18:00 - 21:00", percentage: 10, label: "Evening" },
                    { hour: "21:00 - 09:00", percentage: 5, label: "Off Hours" },
                  ].map((period) => (
                    <div key={period.hour}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{period.label}</span>
                        <span className="text-sm text-muted-foreground">{period.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${period.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{period.hour}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Activity</CardTitle>
                <CardDescription>Data exports by format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { format: "CSV", count: 145, size: "2.3 GB", icon: Download },
                    { format: "Parquet", count: 89, size: "1.8 GB", icon: Download },
                    { format: "JSON", count: 67, size: "890 MB", icon: Download },
                    { format: "API", count: 234, size: "N/A", icon: Activity },
                  ].map((item) => (
                    <div key={item.format} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.format}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} exports • {item.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Most active users this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Smith", role: "Quant Analyst", queries: 892, datasets: 3 },
                  { name: "Sarah Chen", role: "Portfolio Manager", queries: 756, datasets: 4 },
                  { name: "Michael Torres", role: "Risk Analyst", queries: 634, datasets: 2 },
                  { name: "Emily Rodriguez", role: "Data Scientist", queries: 547, datasets: 3 },
                ].map((user) => (
                  <div key={user.name} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.queries} queries</p>
                      <p className="text-xs text-muted-foreground">{user.datasets} datasets</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
