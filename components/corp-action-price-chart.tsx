"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CorporateAction } from "@/lib/types"
import { TrendingUp } from "lucide-react"

interface CorpActionPriceChartProps {
  action: CorporateAction
}

export function CorpActionPriceChart({ action }: CorpActionPriceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Price Impact Analysis
        </CardTitle>
        <CardDescription>
          Price movements before and after corporate action events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          Price analysis coming soon - integrating with real EOD data
        </div>
      </CardContent>
    </Card>
  )
}
