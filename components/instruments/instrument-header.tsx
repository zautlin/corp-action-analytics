"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, TrendingUp, Star, Share2, Download } from "lucide-react"

export interface InstrumentHeaderData {
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
  [key: string]: any
}

interface InstrumentHeaderProps {
  instrument: InstrumentHeaderData
}

export function InstrumentHeader({ instrument }: InstrumentHeaderProps) {
  return (
    <Card className="border-b rounded-none">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          {/* Left: Instrument Info */}
          <div className="space-y-3">
            {/* Ticker and Name */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">
                  {instrument.ticker || instrument.valoren}
                </h1>
              </div>
              <Badge variant="outline" className="text-sm">
                {instrument.valoren}
              </Badge>
            </div>

            <div className="text-xl text-muted-foreground">
              {instrument.instrument_name || instrument.instrument_symbol || "Instrument Name"}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {instrument.isin && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ISIN:</span>
                  <span className="font-mono font-medium">{instrument.isin}</span>
                </div>
              )}

              {instrument.sector && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Sector:</span>
                  <Badge variant="secondary">{instrument.sector}</Badge>
                </div>
              )}

              {instrument.currency && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Currency:</span>
                  <Badge variant="outline">{instrument.currency}</Badge>
                </div>
              )}

              {instrument.bourse_code && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Bourse Code:</span>
                  <Badge variant="outline">{instrument.bourse_code}</Badge>
                </div>
              )}

              {instrument.operating_mic && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Operating MIC:</span>
                  <Badge variant="outline">{instrument.operating_mic}</Badge>
                </div>
              )}

              {instrument.segment_mic && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Segment MIC:</span>
                  <Badge variant="outline">{instrument.segment_mic}</Badge>
                </div>
              )}
            </div>

            {/* Corp Actions Count */}
            {instrument.corp_actions_count !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold">{instrument.corp_actions_count}</span>
                <span className="text-muted-foreground">
                  corporate action{instrument.corp_actions_count !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
