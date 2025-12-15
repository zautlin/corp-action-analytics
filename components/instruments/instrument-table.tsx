"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  TrendingUp,
  Building2,
} from "lucide-react"

export interface Instrument {
  valoren: string
  ticker?: string
  instrument_name?: string
  instrument_symbol?: string
  isin?: string
  sector?: string
  currency?: string
  bourse_code?: string
  operating_mic?: string
  segment_mic?: string
  exchange?: string
  market_cap?: number
  corp_actions_count?: number
  last_action_date?: string
  [key: string]: any // Allow any additional fields from ClickHouse
}

interface PaginationInfo {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface InstrumentTableProps {
  instruments: Instrument[]
  loading?: boolean
  pagination?: PaginationInfo
  onPageChange?: (page: number, pageSize: number, search: string, sortBy: string, sortOrder: string) => void
}

type SortField = "ticker" | "instrument_name" | "sector" | "currency" | "corp_actions_count" | "valoren" | "bourse_code" | "operating_mic"
type SortDirection = "asc" | "desc"

export function InstrumentTable({ instruments, loading, pagination, onPageChange }: InstrumentTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("valoren")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onPageChange && pagination) {
      onPageChange(1, pagination.pageSize, debouncedSearch, sortField, sortDirection)
    }
  }, [debouncedSearch])

  // Client-side display data (no filtering or sorting needed - done on server)
  const displayInstruments = instruments

  // Handle sort click
  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)
    
    if (onPageChange && pagination) {
      onPageChange(pagination.page, pagination.pageSize, debouncedSearch, field, newDirection)
    }
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (onPageChange && pagination) {
      onPageChange(newPage, pagination.pageSize, debouncedSearch, sortField, sortDirection)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageChange) {
      onPageChange(1, newPageSize, debouncedSearch, sortField, sortDirection)
    }
  }

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading instruments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ticker, name, ISIN, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {pagination ? (
            <>
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of{" "}
              {pagination.totalItems} instruments
            </>
          ) : (
            `Showing ${displayInstruments.length} instruments`
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("ticker")}
                  className="h-8 font-semibold"
                >
                  Ticker
                  {renderSortIcon("ticker")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("instrument_name")}
                  className="h-8 font-semibold"
                >
                  Instrument Name
                  {renderSortIcon("instrument_name")}
                </Button>
              </TableHead>
              <TableHead>ISIN</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("sector")}
                  className="h-8 font-semibold"
                >
                  Sector
                  {renderSortIcon("sector")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("currency")}
                  className="h-8 font-semibold"
                >
                  Currency
                  {renderSortIcon("currency")}
                </Button>
              </TableHead>
              <TableHead>Bourse Code</TableHead>
              <TableHead>Operating MIC</TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("corp_actions_count")}
                  className="h-8 font-semibold"
                >
                  Corp Actions
                  {renderSortIcon("corp_actions_count")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayInstruments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {loading ? "Loading instruments..." : "No instruments found"}
                </TableCell>
              </TableRow>
            ) : (
              displayInstruments.map((instrument, index) => (
                <TableRow
                  key={`${instrument.valoren}-${instrument.exchange}-${index}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    window.location.href = `/instruments/${instrument.valoren}`
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {instrument.ticker || instrument.valoren}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {instrument.instrument_name || instrument.instrument_symbol || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {instrument.isin || "—"}
                  </TableCell>
                  <TableCell>
                    {instrument.sector ? (
                      <Badge variant="outline">{instrument.sector}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{instrument.currency || "—"}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {instrument.bourse_code || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {instrument.operating_mic || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {instrument.corp_actions_count ? (
                      <Badge variant="default" className="font-semibold">
                        {instrument.corp_actions_count}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/instruments/${instrument.valoren}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={loading}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Go to page:</span>
            <Input
              type="number"
              min="1"
              max={pagination.totalPages}
              value={pagination.page}
              onChange={(e) => {
                const page = Number(e.target.value)
                if (page >= 1 && page <= pagination.totalPages) {
                  handlePageChange(page)
                }
              }}
              disabled={loading}
              className="w-16 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
