"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CorporateAction } from "@/lib/types"
import { BarChart3 } from "lucide-react"

interface CorpActionVolumeChartProps {
  action: CorporateAction
}

export function CorpActionVolumeChart({ action }: CorpActionVolumeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Volume Analysis
        </CardTitle>
        <CardDescription>
          Trading volume patterns around corporate action events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          Volume analysis coming soon - integrating with real EOD data
        </div>
      </CardContent>
    </Card>
  )
}
