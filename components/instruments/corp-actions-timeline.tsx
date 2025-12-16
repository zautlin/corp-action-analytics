"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, ChevronDown, ChevronUp, DollarSign, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CorporateAction {
  eventId: string
  valoren: string
  instrumentName: string
  isin: string
  actionType: number
  actionTypeLabel: string
  announcementDate: string
  exDividendDate: string
  paymentDate: string
  amount: number
  currency: string
  status: string
}

interface CorpActionsTimelineProps {
  actions: CorporateAction[]
  onEventClick?: (action: CorporateAction) => void
}

const ACTION_TYPE_COLORS: Record<number, string> = {
  230: "bg-blue-500",
  237: "bg-green-500",
  238: "bg-purple-500",
  440: "bg-orange-500",
  451: "bg-pink-500",
  461: "bg-red-500",
}

const ACTION_TYPE_LABELS: Record<number, string> = {
  230: "Cash Dividend",
  237: "Stock Distribution",
  238: "Bonus Issue",
  440: "Stock Split",
  451: "Rights Issue",
  461: "Merger",
}

export function CorpActionsTimeline({ actions, onEventClick }: CorpActionsTimelineProps) {
  const [expanded, setExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.exDividendDate).getTime() - new Date(a.exDividendDate).getTime()
  )

  const visibleActions = showAll ? sortedActions : sortedActions.slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (actions.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Corporate Actions Timeline
          </CardTitle>
          <CardDescription>No corporate actions found for this instrument</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              Corporate Actions Timeline
            </CardTitle>
            <CardDescription className="text-base">
              <span className="font-semibold text-foreground">{actions.length}</span> events tracked
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative space-y-6">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

              {visibleActions.map((action, index) => {
                const isLast = index === visibleActions.length - 1
                const dotColor = ACTION_TYPE_COLORS[action.actionType] || "bg-gray-500"
                const isConfirmed = action.status === "confirmed"

                return (
                  <div
                    key={action.eventId}
                    className={cn(
                      "relative pl-12 transition-all duration-200",
                      onEventClick && "cursor-pointer hover:scale-[1.01]"
                    )}
                    onClick={() => onEventClick?.(action)}
                  >
                    {/* Dot with pulse effect */}
                    <div
                      className={cn(
                        "absolute left-2 top-3 h-5 w-5 rounded-full border-4 border-background shadow-md transition-transform hover:scale-110",
                        dotColor,
                        isConfirmed && "ring-2 ring-offset-2 ring-primary/20"
                      )}
                    />

                    {/* Content Card */}
                    <div
                      className={cn(
                        "rounded-lg border-2 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/50",
                        isConfirmed ? "border-border" : "border-dashed border-muted-foreground/30"
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className="font-mono text-xs border-2"
                            >
                              Type {action.actionType}
                            </Badge>
                            <span className="font-bold text-lg">
                              {action.actionTypeLabel}
                            </span>
                          </div>
                          
                          {action.amount && action.currency && (
                            <div className="flex items-center gap-2 text-lg">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-600">
                                {action.currency} {action.amount.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground">per share</span>
                            </div>
                          )}
                        </div>
                        
                        <Badge
                          variant={isConfirmed ? "default" : "secondary"}
                          className="text-xs font-semibold px-3 py-1"
                        >
                          {action.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Dates Grid */}
                      <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Announced
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{formatDate(action.announcementDate)}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Ex-Date
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">{formatDate(action.exDividendDate)}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Payment
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{formatDate(action.paymentDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Show More/Less Button */}
            {actions.length > 5 && (
              <Button
                variant="outline"
                className="w-full border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    Show Less
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show All {actions.length} Events
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}

            {/* Legend */}
            <div className="pt-4 border-t-2">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Event Type Legend
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(ACTION_TYPE_COLORS).map(([type, color]) => (
                  <div 
                    key={type} 
                    className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 border"
                  >
                    <div className={cn("h-4 w-4 rounded-full shadow-sm", color)} />
                    <span className="text-sm">
                      <span className="font-mono font-semibold">{type}</span>
                      {" - "}
                      <span className="text-muted-foreground">
                        {ACTION_TYPE_LABELS[parseInt(type)] || "Unknown"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
