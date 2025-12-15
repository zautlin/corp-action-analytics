"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { isAuthenticated } from "@/lib/auth"
import { CorpActionBreadcrumb } from "@/components/corp-action-breadcrumb"
import { CorpActionFilters } from "@/components/corp-action-filters"
import { CorpActionTable } from "@/components/corp-action-table"
import { CorpActionCalendar } from "@/components/corp-action-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CorporateAction } from "@/lib/types"
import { Activity, TrendingUp, Calendar as CalendarIcon } from "lucide-react"

export default function CorporateActionsPage() {
  const [mounted, setMounted] = useState(false)
  const [corpActions, setCorpActions] = useState<CorporateAction[]>([])
  const [filteredActions, setFilteredActions] = useState<CorporateAction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<CorporateAction | null>(null)
  const [filters, setFilters] = useState<{
    dateFrom?: string
    dateTo?: string
    instruments?: string[]
    actionTypes?: number[]
    status?: string
  }>({})

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      window.location.href = "/login"
    }
  }, [])

  // Fetch corporate actions from API
  useEffect(() => {
    const fetchCorpActions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/corp-actions')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setCorpActions(result.data || [])
        setFilteredActions(result.data || [])
        if (result.data && result.data.length > 0) {
          setSelectedAction(result.data[0])
        }
      } catch (error) {
        console.error('Error fetching corporate actions:', error)
        setCorpActions([])
        setFilteredActions([])
      } finally {
        setLoading(false)
      }
    }
    
    if (mounted) {
      fetchCorpActions()
    }
  }, [mounted])

  // Apply filters
  useEffect(() => {
    let filtered = [...corpActions]
    
    if (filters.dateFrom) {
      filtered = filtered.filter(a => a.exDividendDate >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filtered = filtered.filter(a => a.exDividendDate <= filters.dateTo!)
    }
    if (filters.instruments && filters.instruments.length > 0) {
      filtered = filtered.filter(a => filters.instruments!.includes(a.instrumentName || a.valoren))
    }
    if (filters.actionTypes && filters.actionTypes.length > 0) {
      filtered = filtered.filter(a => filters.actionTypes!.includes(Number(a.actionType)))
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status)
    }
    
    setFilteredActions(filtered)
    
    // Auto-select first action if none selected
    if (!selectedAction && filtered.length > 0) {
      setSelectedAction(filtered[0])
    }
  }, [filters, corpActions])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated()) {
    return null
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleActionSelect = (action: CorporateAction) => {
    setSelectedAction(action)
  }

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <CorpActionBreadcrumb />

        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
            Corporate Actions Dashboard
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Monitor corporate actions and their impact on price and volume movements
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : filteredActions.length}</div>
              <p className="text-xs text-muted-foreground">Corporate actions tracked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instruments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : new Set(filteredActions.map(a => a.valoren)).size}
              </div>
              <p className="text-xs text-muted-foreground">Unique instruments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : filteredActions.filter(a => new Date(a.exDividendDate) > new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">Future events</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CorpActionFilters
            actions={corpActions}
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        {/* Main Content Tabs */}
        {/* Main Content Tabs */}
        <Tabs defaultValue="table" className="space-y-6">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <CorpActionTable
              actions={filteredActions}
              onActionSelect={handleActionSelect}
              selectedActionId={selectedAction?.eventId}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CorpActionCalendar actions={filteredActions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
