"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
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
      <Card>
        <CardHeader>
          <CardTitle>Corporate Actions</CardTitle>
          <CardDescription>No corporate actions found for this instrument</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Corporate Actions Timeline
            </CardTitle>
            <CardDescription>{actions.length} events tracked</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-4">
            {/* Timeline */}
            <div className="relative space-y-4">
              {/* Vertical line */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />

              {visibleActions.map((action, index) => {
                const isLast = index === visibleActions.length - 1
                const dotColor =
                  ACTION_TYPE_COLORS[action.actionType] || "bg-gray-500"

                return (
                  <div
                    key={action.eventId}
                    className={cn(
                      "relative pl-8 pb-4 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -ml-2",
                      !isLast && "border-b"
                    )}
                    onClick={() => onEventClick?.(action)}
                  >
                    {/* Dot */}
                    <div
                      className={cn(
                        "absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-background",
                        dotColor
                      )}
                    />

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              Type {action.actionType}
                            </Badge>
                            <span className="font-semibold">
                              {action.actionTypeLabel}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {action.amount && action.currency && (
                              <span className="font-medium text-foreground">
                                {action.currency} {action.amount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            action.status === "confirmed" ? "default" : "secondary"
                          }
                        >
                          {action.status}
                        </Badge>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">Announced</div>
                          <div className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(action.announcementDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Ex-Date</div>
                          <div className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(action.exDividendDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Payment</div>
                          <div className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(action.paymentDate)}
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
                className="w-full"
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
            <div className="pt-4 border-t">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                EVENT TYPES
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {Object.entries(ACTION_TYPE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", color)} />
                    <span>
                      Type {type}:{" "}
                      {type === "230"
                        ? "Cash Dividend"
                        : type === "237"
                        ? "Stock Dist."
                        : type === "238"
                        ? "Bonus Issue"
                        : type === "440"
                        ? "Stock Split"
                        : type === "451"
                        ? "Rights Issue"
                        : "Merger"}
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
