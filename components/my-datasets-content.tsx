"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Search,
  TrendingUp,
  Clock,
  Download,
  ExternalLink,
  BarChart3,
  Calendar,
  Activity,
} from "lucide-react"

export function MyDatasetsContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const myDatasets = [
    {
      id: "1",
      name: "Bloomberg Real-Time Equity Prices",
      provider: "Bloomberg L.P.",
      assetClass: "Equities",
      qualityScore: 9.2,
      accessGranted: "2025-01-05",
      lastAccessed: "2 hours ago",
      queriesThisMonth: 1247,
      dataVolume: "2.3 TB",
      status: "active",
    },
    {
      id: "2",
      name: "Refinitiv Fixed Income Reference Data",
      provider: "Refinitiv",
      assetClass: "Fixed Income",
      qualityScore: 8.9,
      accessGranted: "2024-12-15",
      lastAccessed: "1 day ago",
      queriesThisMonth: 892,
      dataVolume: "1.8 TB",
      status: "active",
    },
    {
      id: "3",
      name: "ICE Cryptocurrency Market Data",
      provider: "ICE Data Services",
      assetClass: "Crypto",
      qualityScore: 8.5,
      accessGranted: "2024-11-20",
      lastAccessed: "3 days ago",
      queriesThisMonth: 456,
      dataVolume: "890 GB",
      status: "active",
    },
    {
      id: "4",
      name: "S&P Global ESG Scores",
      provider: "S&P Global",
      assetClass: "ESG",
      qualityScore: 9.0,
      accessGranted: "2024-10-10",
      lastAccessed: "5 days ago",
      queriesThisMonth: 234,
      dataVolume: "450 GB",
      status: "active",
    },
  ]

  const recentActivity = [
    {
      dataset: "Bloomberg Real-Time Equity Prices",
      action: "Query executed",
      timestamp: "2 hours ago",
      details: "Retrieved 125K records",
    },
    {
      dataset: "Refinitiv Fixed Income Reference Data",
      action: "Data exported",
      timestamp: "1 day ago",
      details: "CSV export (45MB)",
    },
    {
      dataset: "Bloomberg Real-Time Equity Prices",
      action: "Query executed",
      timestamp: "1 day ago",
      details: "Retrieved 89K records",
    },
    {
      dataset: "ICE Cryptocurrency Market Data",
      action: "Query executed",
      timestamp: "3 days ago",
      details: "Retrieved 34K records",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">My Datasets</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">Manage and access your approved datasets</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Datasets</p>
                <p className="text-3xl font-bold">{myDatasets.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Queries This Month</p>
                <p className="text-3xl font-bold">2,829</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data Volume</p>
                <p className="text-3xl font-bold">5.4 TB</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Quality Score</p>
                <p className="text-3xl font-bold">8.9</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="datasets">My Datasets ({myDatasets.length})</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search my datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Asset Classes</SelectItem>
                <SelectItem value="equities">Equities</SelectItem>
                <SelectItem value="fixed-income">Fixed Income</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="esg">ESG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {myDatasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{dataset.name}</h3>
                          <p className="text-sm text-muted-foreground">{dataset.provider}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="secondary">{dataset.assetClass}</Badge>
                        <div className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          <TrendingUp className="h-3 w-3" />
                          {dataset.qualityScore}/10
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Access Granted</p>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{dataset.accessGranted}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Last Accessed</p>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{dataset.lastAccessed}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Queries (30d)</p>
                          <div className="flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{dataset.queriesThisMonth.toLocaleString()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Data Volume</p>
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{dataset.dataVolume}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" asChild>
                        <a href={`/dataset/${dataset.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.dataset}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
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
