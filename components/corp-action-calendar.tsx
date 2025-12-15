"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp } from "lucide-react"
import { type CorporateAction } from "@/lib/types"

interface CorpActionCalendarProps {
  actions: CorporateAction[]
  onActionSelect: (action: CorporateAction) => void
}

export function CorpActionCalendar({ actions, onActionSelect }: CorpActionCalendarProps) {
  // Group actions by month
  const actionsByMonth = actions.reduce((acc, action) => {
    const date = new Date(action.exDividendDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(action)
    return acc
  }, {} as Record<string, CorporateAction[]>)

  // Sort months descending
  const sortedMonths = Object.keys(actionsByMonth).sort((a, b) => b.localeCompare(a))

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getActionColor = (actionType: number) => {
    switch (actionType) {
      case 230:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 237:
        return "bg-green-100 text-green-800 border-green-200"
      case 238:
        return "bg-purple-100 text-purple-800 border-purple-200"
      case 440:
        return "bg-orange-100 text-orange-800 border-orange-200"
      case 451:
        return "bg-pink-100 text-pink-800 border-pink-200"
      case 461:
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {sortedMonths.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No corporate actions found for the selected filters.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        sortedMonths.map((monthKey) => (
          <Card key={monthKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getMonthName(monthKey)}
                <Badge variant="outline" className="ml-auto">
                  {actionsByMonth[monthKey].length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actionsByMonth[monthKey]
                  .sort((a, b) => a.exDividendDate.localeCompare(b.exDividendDate))
                  .map((action) => (
                    <div
                      key={action.eventId}
                      className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onActionSelect(action)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Date Badge */}
                        <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-2 min-w-[60px]">
                          <p className="text-2xl font-bold leading-none">
                            {new Date(action.exDividendDate).getDate()}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {new Date(action.exDividendDate).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </p>
                        </div>

                        {/* Action Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{action.instrumentName}</h4>
                            <Badge
                              variant="outline"
                              className={getActionColor(action.actionType)}
                            >
                              {action.actionTypeLabel}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {action.isin} • Valoren: {action.valoren}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>
                              <span className="font-medium">Announced:</span> {action.announcementDate}
                            </span>
                            <span>
                              <span className="font-medium">Payment:</span> {action.paymentDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {action.currency} {action.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">per share</p>
                        <Badge
                          variant="outline"
                          className={
                            action.status === "Complete"
                              ? "mt-2 bg-green-50 text-green-700 border-green-200"
                              : action.status === "Pending"
                              ? "mt-2 bg-blue-50 text-blue-700 border-blue-200"
                              : "mt-2 bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {action.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
