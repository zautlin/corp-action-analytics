"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  LineChart,
  BarChart3,
  Activity,
  Volume2,
  Zap,
  Bell,
  Grid3x3,
  TrendingUp,
} from "lucide-react"

export type ChartType =
  | "price"
  | "heatmap"
  | "volatility"
  | "volume"
  | "split"
  | "drift"
  | "overview"

interface ChartOption {
  id: ChartType
  label: string
  description: string
  icon: any
  available: boolean
}

interface ChartSelectorProps {
  selectedChart: ChartType
  onChartChange: (chart: ChartType) => void
  hasSplits?: boolean
}

interface ChartSelectorPropsExtended extends ChartSelectorProps {
  corpActionsCount?: number
}

export function ChartSelector({
  selectedChart,
  onChartChange,
  hasSplits = false,
  corpActionsCount,
}: ChartSelectorPropsExtended) {
  const chartOptions: ChartOption[] = [
    {
      id: "overview",
      label: "Overview",
      description: "Dashboard with all metrics",
      icon: Grid3x3,
      available: true,
    },
    {
      id: "price",
      label: "Price Chart",
      description: "Interactive TradingView chart",
      icon: LineChart,
      available: true,
    },
    {
      id: "heatmap",
      label: "Event Study Heatmap",
      description: "Abnormal returns analysis",
      icon: Grid3x3,
      available: true,
    },
    {
      id: "volatility",
      label: "Volatility & Risk",
      description: "Volatility burst analysis",
      icon: Activity,
      available: true,
    },
    {
      id: "volume",
      label: "Volume & Liquidity",
      description: "Volume spikes and liquidity metrics",
      icon: Volume2,
      available: true,
    },
    {
      id: "split",
      label: "Split Momentum",
      description: "Post-split analysis (Type 440)",
      icon: Zap,
      available: hasSplits,
    },
    {
      id: "drift",
      label: "Announcement Drift",
      description: "Information leakage detection",
      icon: Bell,
      available: true,
    },
  ]

  return (
    <div className="w-full space-y-2">
      {/* Corporate Actions Count */}
      {corpActionsCount !== undefined && (
        <div className="flex items-center gap-2 px-2 pb-3 border-b">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold">{corpActionsCount}</span>
          <span className="text-sm text-muted-foreground">
            corporate action{corpActionsCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
      
      <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-3">CHART TYPES</h3>

      {chartOptions.map((option) => {
        const Icon = option.icon
        const isSelected = selectedChart === option.id
        const isDisabled = !option.available

        return (
          <Button
            key={option.id}
            variant={isSelected ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto py-3 px-3 transition-all duration-200",
              isDisabled && "opacity-50 cursor-not-allowed",
              !isSelected && "hover:bg-muted hover:shadow-sm hover:border-primary/20 border border-transparent",
              isSelected && "shadow-md"
            )}
            onClick={() => option.available && onChartChange(option.id)}
            disabled={isDisabled}
          >
            <div className="flex items-start gap-3 text-left">
              <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0")} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{option.label}</div>
                <div
                  className={cn(
                    "text-xs mt-0.5",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </Button>
        )
      })}

      {!hasSplits && (
        <div className="text-xs text-muted-foreground px-2 pt-2">
          * Split Momentum only available for stock split events (Type 440)
        </div>
      )}
    </div>
  )
}
