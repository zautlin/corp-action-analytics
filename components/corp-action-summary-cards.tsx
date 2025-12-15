import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Calendar, Euro, Activity } from "lucide-react"

interface CorpActionSummaryCardsProps {
  analytics: {
    totalEvents: number
    totalDividendAmount: number
    avgPriceImpact: number
    avgVolumeSpike: number
    upcomingEvents: number
  }
}

export function CorpActionSummaryCards({ analytics }: CorpActionSummaryCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Events */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Events</p>
          <p className="text-3xl font-bold">{analytics.totalEvents}</p>
          <p className="text-xs text-muted-foreground mt-1">In selected period</p>
        </CardContent>
      </Card>

      {/* Total Dividend Amount */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Euro className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Dividends</p>
          <p className="text-3xl font-bold">€{analytics.totalDividendAmount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Sum of all dividend payments</p>
        </CardContent>
      </Card>

      {/* Average Price Impact */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                analytics.avgPriceImpact < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {analytics.avgPriceImpact.toFixed(2)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Avg Price Impact</p>
          <p className="text-3xl font-bold">
            {Math.abs(analytics.avgPriceImpact).toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">On ex-dividend date</p>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
          <p className="text-3xl font-bold">{analytics.upcomingEvents}</p>
          <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
