"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpDown, Eye } from "lucide-react"
import { type CorporateAction } from "@/lib/types"

interface CorpActionTableProps {
  actions: CorporateAction[]
  onActionSelect: (action: CorporateAction) => void
}

export function CorpActionTable({ actions, onActionSelect }: CorpActionTableProps) {
  const [sortField, setSortField] = useState<keyof CorporateAction>("exDividendDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof CorporateAction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedActions = [...actions].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusBadge = (status: string) => {
    if (status === "Complete") {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>
    } else if (status === "Pending") {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>
    } else {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Incomplete</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Corporate Actions Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort("exDividendDate")}
                  >
                    Ex-Div Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort("instrumentName")}
                  >
                    Instrument
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort("actionTypeLabel")}
                  >
                    Action Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -mr-3"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Announcement</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No corporate actions found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedActions.map((action) => (
                  <TableRow key={action.eventId} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{action.exDividendDate}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{action.instrumentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.isin} • {action.valoren}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{action.actionTypeLabel}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {action.currency} {action.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {action.announcementDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {action.paymentDate}
                    </TableCell>
                    <TableCell>{getStatusBadge(action.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onActionSelect(action)}
                        className="h-8"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {sortedActions.length} events</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
