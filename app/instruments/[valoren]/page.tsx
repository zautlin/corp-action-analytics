"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { InstrumentHeader } from "@/components/instruments/instrument-header"
import { ChartSelector, type ChartType } from "@/components/instruments/chart-selector"
import { CorpActionsTimeline, type CorporateAction } from "@/components/instruments/corp-actions-timeline"
import { AdvancedPriceChart } from "@/components/instruments/advanced-price-chart"
import { EventStudyHeatmap } from "@/components/event-study-heatmap"
import { MomentumBoxPlots } from "@/components/momentum-box-plots"
import { VolatilityBurstPanel } from "@/components/volatility-burst-panel"
import { VolumeLiquidityPanel } from "@/components/volume-liquidity-panel"
import { SplitMomentumPanel } from "@/components/split-momentum-panel"
import { AnnouncementDriftPanel } from "@/components/announcement-drift-panel"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface InstrumentData {
  valoren: string
  ticker?: string
  instrument_name?: string
  instrument_symbol?: string
  isin?: string
  sector?: string
  currency?: string
  exchange?: string
  market_cap?: number
  corp_actions_count?: number
  [key: string]: any
}

interface EODData {
  date: string
  ticker: string
  valoren: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
  turnover: number
}

export default function InstrumentDetailPage() {
  const params = useParams()
  const valoren = params.valoren as string

  const [selectedChart, setSelectedChart] = useState<ChartType>("overview")
  const [instrument, setInstrument] = useState<InstrumentData | null>(null)
  const [corpActions, setCorpActions] = useState<CorporateAction[]>([])
  const [eodDataMap, setEodDataMap] = useState<Map<string, EODData[]>>(new Map())
  const [eventSignals, setEventSignals] = useState<any[]>([]) // EventSignals from signal-library
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch instrument data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch instrument details
        const instrumentResponse = await fetch(`/api/instruments?valoren=${valoren}`)
        if (!instrumentResponse.ok) {
          throw new Error("Failed to fetch instrument data")
        }
        const instrumentResult = await instrumentResponse.json()
        setInstrument(instrumentResult.data)

        // Fetch corporate actions for this instrument
        const actionsResponse = await fetch(`/api/corp-actions?valoren=${valoren}`)
        if (!actionsResponse.ok) {
          throw new Error("Failed to fetch corporate actions")
        }
        const actionsResult = await actionsResponse.json()
        const actions = actionsResult.data || []
        setCorpActions(actions)

        // Fetch EOD data for each corporate action event (±30 days)
        const eodMap = new Map<string, EODData[]>()
        
        for (const action of actions) {
          try {
            const eodResponse = await fetch(
              `/api/eod-data?valoren=${valoren}&eventDate=${action.exDividendDate}&daysAround=30`
            )
            if (eodResponse.ok) {
              const eodResult = await eodResponse.json()
              const key = `${action.valoren}_${action.exDividendDate}`
              eodMap.set(key, eodResult.data || [])
            }
          } catch (eodError) {
            console.warn(`Failed to fetch EOD data for event ${action.eventId}:`, eodError)
            // Continue with other events even if one fails
          }
        }
        
        setEodDataMap(eodMap)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching instrument data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (valoren) {
      fetchData()
    }
  }, [valoren])

  // Check if instrument has splits (Type 440)
  const hasSplits = corpActions.some((action) => action.actionType === 440)

  // Render chart based on selection
  const renderChart = () => {
    if (!instrument) return null

    const chartProps = {
      valoren: instrument.valoren,
      ticker: instrument.ticker || instrument.valoren,
      instrumentName: instrument.instrument_name || instrument.instrument_symbol || instrument.valoren,
      corpActions: corpActions,
    }

    // Props for EventStudyHeatmap and EOD-based components
    const eodProps = {
      actions: corpActions,
      eodDataMap: eodDataMap,
    }

    // Props for components that need eventSignals
    const signalProps = {
      eventSignals: eventSignals,
    }

    switch (selectedChart) {
      case "overview":
        return (
          <div className="grid gap-6">
            <EventStudyHeatmap {...eodProps} />
            <VolumeLiquidityPanel {...eodProps} />
            <AnnouncementDriftPanel {...eodProps} />
          </div>
        )

      case "price":
        // Show chart for most recent corporate action
        const mostRecentAction = corpActions.length > 0 
          ? [...corpActions].sort((a, b) => 
              new Date(b.exDividendDate).getTime() - new Date(a.exDividendDate).getTime()
            )[0]
          : null

        if (!mostRecentAction) {
          return (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Data Available</AlertTitle>
              <AlertDescription>
                No corporate actions found for this instrument. The price chart requires at least one corporate action event.
              </AlertDescription>
            </Alert>
          )
        }

        return (
          <AdvancedPriceChart 
            action={mostRecentAction} 
            valoren={instrument.valoren}
            instrumentName={instrument.instrument_name || instrument.ticker || instrument.valoren}
          />
        )

      case "heatmap":
        return <EventStudyHeatmap {...eodProps} />

      case "momentum":
        return <MomentumBoxPlots {...signalProps} />

      case "volatility":
        return <VolatilityBurstPanel {...eodProps} />

      case "volume":
        return <VolumeLiquidityPanel {...eodProps} />

      case "split":
        return hasSplits ? (
          <SplitMomentumPanel {...eodProps} />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Available</AlertTitle>
            <AlertDescription>
              Split momentum analysis is only available for instruments with stock split events (Type 440).
            </AlertDescription>
          </Alert>
        )

      case "drift":
        return <AnnouncementDriftPanel {...eodProps} />

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Select a chart type to view</div>
            </CardContent>
          </Card>
        )
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-6">
          <Skeleton className="h-96 w-64" />
          <Skeleton className="h-96 flex-1" />
        </div>
      </div>
    )
  }

  if (error || !instrument) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Failed to load instrument data. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Instrument Header */}
      <InstrumentHeader
        instrument={{
          ...instrument,
          corp_actions_count: corpActions.length,
        }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left Sidebar: Chart Selector + Timeline */}
          <div className="space-y-6">
            <ChartSelector
              selectedChart={selectedChart}
              onChartChange={setSelectedChart}
              hasSplits={hasSplits}
            />
          </div>

          {/* Right: Chart Display */}
          <div className="space-y-6">
            {/* Corporate Actions Timeline */}
            <CorpActionsTimeline actions={corpActions} />

            {/* Selected Chart */}
            <div>{renderChart()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
