"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, X } from "lucide-react"
import type { CorporateAction } from "@/lib/types"

// Corporate action types mapping
const CORP_ACTION_TYPES: Record<number, string> = {
  1: "Cash Dividend",
  2: "Stock Dividend",
  3: "Stock Split",
  4: "Reverse Split",
  5: "Rights Issue",
  6: "Bonus Issue",
  7: "Merger",
  8: "Spin-off",
}

// Helper function to get unique instruments
function getUniqueInstruments(actions: CorporateAction[]): string[] {
  const instruments = new Set(actions.map(a => a.instrumentName || a.valoren))
  return Array.from(instruments).sort()
}

interface CorpActionFiltersProps {
  actions: CorporateAction[]
  onFilterChange: (filters: {
    dateFrom?: string
    dateTo?: string
    instruments?: string[]
    actionTypes?: number[]
    status?: string
  }) => void
  currentFilters: {
    dateFrom?: string
    dateTo?: string
    instruments?: string[]
    actionTypes?: number[]
    status?: string
  }
}

export function CorpActionFilters({ actions, onFilterChange, currentFilters }: CorpActionFiltersProps) {
  const [dateFrom, setDateFrom] = useState(currentFilters.dateFrom || "")
  const [dateTo, setDateTo] = useState(currentFilters.dateTo || "")
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(currentFilters.instruments || [])
  const [selectedActionTypes, setSelectedActionTypes] = useState<number[]>(currentFilters.actionTypes || [])
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.status || "all")

  const instruments = getUniqueInstruments(actions)

  const handleApplyFilters = () => {
    onFilterChange({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      instruments: selectedInstruments.length > 0 ? selectedInstruments : undefined,
      actionTypes: selectedActionTypes.length > 0 ? selectedActionTypes : undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
    })
  }

  const handleResetFilters = () => {
    setDateFrom("")
    setDateTo("")
    setSelectedInstruments([])
    setSelectedActionTypes([])
    setSelectedStatus("all")
    onFilterChange({})
  }

  const toggleInstrument = (valoren: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(valoren) ? prev.filter((v) => v !== valoren) : [...prev, valoren]
    )
  }

  const toggleActionType = (type: number) => {
    setSelectedActionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="date-from">From Date</Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="date-to">To Date</Label>
            <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>

          {/* Instrument Filter */}
          <div className="space-y-2">
            <Label>Instruments ({selectedInstruments.length} selected)</Label>
            <Select value="">
              <SelectTrigger>
                <SelectValue placeholder="Select instruments" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
                  {instruments.map((inst) => (
                    <div key={inst.valoren} className="flex items-center space-x-2">
                      <Checkbox
                        id={`inst-${inst.valoren}`}
                        checked={selectedInstruments.includes(inst.valoren)}
                        onCheckedChange={() => toggleInstrument(inst.valoren)}
                      />
                      <Label
                        htmlFor={`inst-${inst.valoren}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {inst.instrumentName} ({inst.valoren})
                      </Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Action Type Filter */}
          <div className="space-y-2">
            <Label>Action Types ({selectedActionTypes.length} selected)</Label>
            <Select value="">
              <SelectTrigger>
                <SelectValue placeholder="Select action types" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 space-y-2">
                  {Object.entries(CORP_ACTION_TYPES).map(([code, label]) => (
                    <div key={code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${code}`}
                        checked={selectedActionTypes.includes(Number(code))}
                        onCheckedChange={() => toggleActionType(Number(code))}
                      />
                      <Label htmlFor={`type-${code}`} className="text-sm font-normal cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button onClick={handleApplyFilters} className="gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
