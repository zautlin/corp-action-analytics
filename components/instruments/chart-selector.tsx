"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Activity,
  Volume2,
  Zap,
  Bell,
  Grid3x3,
} from "lucide-react"

export type ChartType =
  | "price"
  | "heatmap"
  | "momentum"
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

export function ChartSelector({
  selectedChart,
  onChartChange,
  hasSplits = false,
}: ChartSelectorProps) {
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
      id: "momentum",
      label: "Momentum Analysis",
      description: "Box plots and momentum signals",
      icon: TrendingUp,
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
    <div className="w-64 space-y-2">
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
              "w-full justify-start h-auto py-3 px-3",
              isDisabled && "opacity-50 cursor-not-allowed",
              !isSelected && "hover:bg-muted"
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
