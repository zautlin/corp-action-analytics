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
    <Card className="border-2 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Ticker and Valoren */}
          <div className="flex items-center gap-2 pb-4 border-b">
            <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">
                {instrument.ticker || instrument.valoren}
              </h1>
              <Badge variant="outline" className="text-xs mt-1">
                {instrument.valoren}
              </Badge>
            </div>
          </div>

          {/* Instrument Name */}
          <div className="text-sm font-medium leading-snug">
            {instrument.instrument_name || instrument.instrument_symbol || "Instrument Name"}
          </div>

          {/* Metadata - Vertical Stack */}
          <div className="space-y-2 text-xs">
            {instrument.isin && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ISIN:</span>
                <span className="font-mono font-medium">{instrument.isin}</span>
              </div>
            )}

            {instrument.sector && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sector:</span>
                <Badge variant="secondary" className="text-xs">{instrument.sector}</Badge>
              </div>
            )}

            {instrument.currency && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Currency:</span>
                <Badge variant="outline" className="text-xs">{instrument.currency}</Badge>
              </div>
            )}

            {instrument.bourse_code && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bourse Code:</span>
                <Badge variant="outline" className="text-xs">{instrument.bourse_code}</Badge>
              </div>
            )}

            {instrument.operating_mic && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Operating MIC:</span>
                <Badge variant="outline" className="text-xs">{instrument.operating_mic}</Badge>
              </div>
            )}

            {instrument.segment_mic && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Segment MIC:</span>
                <Badge variant="outline" className="text-xs">{instrument.segment_mic}</Badge>
              </div>
            )}
          </div>

          {/* Action Buttons - Stacked */}
          <div className="grid grid-cols-1 gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
            >
              <Star className="h-3 w-3 mr-2" />
              Watchlist
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
            >
              <Share2 className="h-3 w-3 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
            >
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
