"use client"

import { useEffect, useState } from "react"
import { InstrumentTable } from "@/components/instruments/instrument-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, Activity, Calendar } from "lucide-react"

interface Instrument {
  valoren: string
  ticker?: string
  instrument_name?: string
  [key: string]: any
}

interface PaginationInfo {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: number | string
  description: string
  icon: any
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, activeNow: 0 })

  // Fetch instruments with pagination
  const fetchInstruments = async (
    page: number = 1,
    pageSize: number = 50,
    search: string = "",
    sortBy: string = "valoren",
    sortOrder: string = "asc"
  ) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/instruments?${params}`)
      if (!response.ok) throw new Error("Failed to fetch instruments")

      const result = await response.json()
      setInstruments(result.data || [])
      setPagination(result.pagination)
    } catch (error) {
      console.error("Error fetching instruments:", error)
      setInstruments([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch corporate actions stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/corp-actions")
      if (!response.ok) return

      const result = await response.json()
      const actions = result.data || []

      const now = new Date()
      const thisMonth = actions.filter((action: any) => {
        const exDate = new Date(action.exDividendDate)
        return exDate.getMonth() === now.getMonth() && exDate.getFullYear() === now.getFullYear()
      }).length

      const activeNow = actions.filter((action: any) => {
        const exDate = new Date(action.exDividendDate)
        return exDate >= now
      }).length

      setStats({
        total: actions.length,
        thisMonth,
        activeNow,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  // Initial load
  useEffect(() => {
    fetchInstruments()
    fetchStats()
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Instruments</h1>
        <p className="text-muted-foreground">
          Browse and analyze instruments with corporate actions data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Instruments"
          value={pagination.totalItems || 0}
          description="Available in the database"
          icon={Building2}
        />
        <StatsCard
          title="Total Corporate Actions"
          value={stats.total}
          description="Historical events tracked"
          icon={Activity}
        />
        <StatsCard
          title="Events This Month"
          value={stats.thisMonth}
          description="Corporate actions this month"
          icon={Calendar}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.activeNow}
          description="Future corporate actions"
          icon={TrendingUp}
        />
      </div>

      {/* Instruments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Instruments</CardTitle>
          <CardDescription>
            Click on any instrument to view detailed charts and corporate actions analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstrumentTable
            instruments={instruments}
            loading={loading}
            pagination={pagination}
            onPageChange={(page, pageSize, search, sortBy, sortOrder) =>
              fetchInstruments(page, pageSize, search, sortBy, sortOrder)
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
