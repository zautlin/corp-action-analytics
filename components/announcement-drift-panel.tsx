"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, TrendingUp, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CorporateAction, EODData } from "@/lib/types"

interface AnnouncementDriftPanelProps {
  actions: CorporateAction[]
  eodDataMap: Map<string, EODData[]>
  onEventClick?: (eventId: string) => void
}

interface DriftAnalysis {
  eventId: string
  instrumentName: string
  announcementDate: string
  exDividendDate: string
  daysToExDate: number
  priceAtAnnouncement: number
  priceAtExDate: number
  driftPercent: number
  abnormalReturnPreAnnounce: number // -5 days before announcement
  volumeAtAnnouncement: number
  avgVolumeBeforeAnnouncement: number
  volumeSpikePercent: number
  driftScore: number // 0-100
  leakageRisk: "high" | "medium" | "low"
  significantDrift: boolean
}

export function AnnouncementDriftPanel({
  actions,
  eodDataMap,
  onEventClick,
}: AnnouncementDriftPanelProps) {
  // Handle empty or undefined actions
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Announcement-to-ExDate Drift Analysis
          </CardTitle>
          <CardDescription>
            Price drift between announcement and ex-dividend date (potential information leakage)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No corporate actions available for drift analysis
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filter actions with valid announcement dates
  const validActions = actions.filter(
    (a) => a.announcementDate && a.announcementDate !== a.exDividendDate
  )

  // Calculate drift analysis for all events
  const driftAnalyses = validActions.map((action) =>
    analyzeDrift(action, eodDataMap)
  )

  // Sort by drift score (descending - highest drift = most suspicious)
  const sortedAnalyses = [...driftAnalyses].sort((a, b) => b.driftScore - a.driftScore)

  // Summary statistics
  const avgDrift =
    driftAnalyses.length > 0
      ? driftAnalyses.reduce((sum, d) => sum + d.driftPercent, 0) / driftAnalyses.length
      : 0
  const highRiskCount = driftAnalyses.filter((d) => d.leakageRisk === "high").length
  const significantDriftCount = driftAnalyses.filter((d) => d.significantDrift).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcement Drift & Information Leakage
            </CardTitle>
            <CardDescription>
              Price movement between announcement and ex-dividend date indicating potential
              information leakage
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Abnormal price movement before announcements may indicate information
                    leakage or insider trading. High drift scores warrant investigation.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Alert Banner */}
        {highRiskCount > 0 && (
          <div className="mt-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                {highRiskCount} High Risk Event{highRiskCount > 1 ? "s" : ""} Detected
              </p>
              <p className="text-xs text-red-700">
                Significant pre-announcement price movement detected. Potential information
                leakage or insider activity.
              </p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className="rounded-lg border bg-blue-50 p-3">
            <p className="text-xs text-muted-foreground">Avg Drift</p>
            <p
              className={`text-xl font-bold ${
                avgDrift > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {avgDrift > 0 ? "+" : ""}
              {avgDrift.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-lg border bg-red-50 p-3">
            <p className="text-xs text-muted-foreground">High Risk</p>
            <p className="text-xl font-bold text-red-600">{highRiskCount}</p>
          </div>
          <div className="rounded-lg border bg-orange-50 p-3">
            <p className="text-xs text-muted-foreground">Significant Drift</p>
            <p className="text-xl font-bold text-orange-600">{significantDriftCount}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Total Events</p>
            <p className="text-xl font-bold">{driftAnalyses.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {driftAnalyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-semibold text-muted-foreground">
              No Events with Announcement Data
            </p>
            <p className="text-xs text-muted-foreground">
              This analysis requires both announcement date and ex-dividend date
            </p>
          </div>
        ) : (
          <>
            {/* Drift Timeline Visualization */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Announcement to Ex-Date Drift Analysis</h4>
              <div className="space-y-3">
                {sortedAnalyses.slice(0, 10).map((analysis) => (
                  <button
                    key={analysis.eventId}
                    onClick={() => onEventClick?.(analysis.eventId)}
                    className="w-full space-y-2 rounded-lg border bg-muted/10 p-3 text-left transition-colors hover:bg-muted/30"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{analysis.instrumentName}</span>
                        <Badge
                          variant={
                            analysis.leakageRisk === "high"
                              ? "destructive"
                              : analysis.leakageRisk === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {analysis.leakageRisk.toUpperCase()} RISK
                        </Badge>
                        {analysis.significantDrift && (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {analysis.daysToExDate} days drift period
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-muted-foreground">Announcement: </span>
                          <span className="font-semibold">{analysis.announcementDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ex-Date: </span>
                          <span className="font-semibold">{analysis.exDividendDate}</span>
                        </div>
                      </div>

                      {/* Visual drift line */}
                      <div className="relative">
                        <div className="h-8 rounded bg-gradient-to-r from-blue-100 to-orange-100">
                          <div className="flex h-8 items-center justify-between px-2">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-600" />
                              <span className="mt-1 text-xs font-semibold">
                                ${analysis.priceAtAnnouncement.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <TrendingUp
                                className={`h-4 w-4 ${
                                  analysis.driftPercent > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              />
                              <span
                                className={`text-sm font-bold ${
                                  analysis.driftPercent > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {analysis.driftPercent > 0 ? "+" : ""}
                                {analysis.driftPercent.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-orange-600" />
                              <span className="mt-1 text-xs font-semibold">
                                ${analysis.priceAtExDate.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Pre-Announce Return: </span>
                        <span
                          className={`font-semibold ${
                            analysis.abnormalReturnPreAnnounce > 0
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {analysis.abnormalReturnPreAnnounce > 0 ? "+" : ""}
                          {analysis.abnormalReturnPreAnnounce.toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Volume Spike: </span>
                        <span className="font-semibold text-blue-600">
                          +{analysis.volumeSpikePercent.toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Drift Score: </span>
                        <span className="font-semibold text-red-600">
                          {analysis.driftScore}/100
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Comprehensive Drift Analysis</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-2 text-left">Instrument</th>
                      <th className="p-2 text-center">Days</th>
                      <th className="p-2 text-right">Drift %</th>
                      <th className="p-2 text-right">Pre-Announce</th>
                      <th className="p-2 text-right">Vol Spike</th>
                      <th className="p-2 text-right">Score</th>
                      <th className="p-2 text-center">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAnalyses.map((analysis) => (
                      <tr
                        key={analysis.eventId}
                        className="cursor-pointer border-b hover:bg-muted/20"
                        onClick={() => onEventClick?.(analysis.eventId)}
                      >
                        <td className="p-2 font-medium">{analysis.instrumentName}</td>
                        <td className="p-2 text-center text-muted-foreground">
                          {analysis.daysToExDate}
                        </td>
                        <td
                          className={`p-2 text-right font-bold ${
                            analysis.driftPercent > 2
                              ? "text-green-600"
                              : analysis.driftPercent < -2
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {analysis.driftPercent > 0 ? "+" : ""}
                          {analysis.driftPercent.toFixed(2)}%
                        </td>
                        <td
                          className={`p-2 text-right font-semibold ${
                            Math.abs(analysis.abnormalReturnPreAnnounce) > 1
                              ? "text-orange-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {analysis.abnormalReturnPreAnnounce > 0 ? "+" : ""}
                          {analysis.abnormalReturnPreAnnounce.toFixed(2)}%
                        </td>
                        <td className="p-2 text-right text-blue-600">
                          +{analysis.volumeSpikePercent.toFixed(0)}%
                        </td>
                        <td className="p-2 text-right">
                          <span
                            className={`font-bold ${
                              analysis.driftScore > 70
                                ? "text-red-600"
                                : analysis.driftScore > 40
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {analysis.driftScore}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <Badge
                            variant={
                              analysis.leakageRisk === "high"
                                ? "destructive"
                                : analysis.leakageRisk === "medium"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {analysis.leakageRisk}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Methodology Explanation */}
            <div className="rounded-lg border bg-muted/10 p-4 text-xs">
              <h4 className="mb-2 font-semibold">Drift Score Methodology</h4>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Announcement Drift:</strong> Price movement from announcement to
                  ex-date (40% weight)
                </li>
                <li>
                  <strong>Pre-Announcement Return:</strong> Abnormal return 5 days before
                  announcement (35% weight)
                </li>
                <li>
                  <strong>Volume Spike:</strong> Volume increase at announcement vs baseline
                  (25% weight)
                </li>
                <li>
                  <strong>Risk Classification:</strong> High (&gt;70), Medium (40-70), Low
                  (&lt;40)
                </li>
                <li>
                  <strong>Significant Drift:</strong> Flagged if drift exceeds ±3% or
                  pre-announcement return &gt; 2%
                </li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function analyzeDrift(
  action: CorporateAction,
  eodDataMap: Map<string, EODData[]>
): DriftAnalysis {
  const key = `${action.valoren}_${action.exDividendDate}`
  const eodData = eodDataMap.get(key) || []

  const announceIndex = eodData.findIndex((d) => d.date === action.announcementDate)
  const exDateIndex = eodData.findIndex((d) => d.date === action.exDividendDate)

  // Default values if insufficient data
  if (announceIndex === -1 || exDateIndex === -1 || announceIndex < 5) {
    return {
      eventId: action.eventId,
      instrumentName: action.instrumentName,
      announcementDate: action.announcementDate,
      exDividendDate: action.exDividendDate,
      daysToExDate: 0,
      priceAtAnnouncement: 0,
      priceAtExDate: 0,
      driftPercent: 0,
      abnormalReturnPreAnnounce: 0,
      volumeAtAnnouncement: 0,
      avgVolumeBeforeAnnouncement: 0,
      volumeSpikePercent: 0,
      driftScore: 0,
      leakageRisk: "low",
      significantDrift: false,
    }
  }

  // Calculate basic metrics
  const priceAtAnnouncement = eodData[announceIndex].closePrice
  const priceAtExDate = eodData[exDateIndex].closePrice
  const driftPercent = ((priceAtExDate - priceAtAnnouncement) / priceAtAnnouncement) * 100
  const daysToExDate = exDateIndex - announceIndex

  // Pre-announcement return (5 days before announcement)
  const preAnnounceWindow = eodData.slice(announceIndex - 5, announceIndex)
  const abnormalReturnPreAnnounce =
    preAnnounceWindow.length > 1
      ? ((priceAtAnnouncement - preAnnounceWindow[0].closePrice) /
          preAnnounceWindow[0].closePrice) *
        100
      : 0

  // Volume analysis
  const volumeAtAnnouncement = eodData[announceIndex].volume
  const avgVolumeBeforeAnnouncement =
    preAnnounceWindow.reduce((sum, d) => sum + d.volume, 0) / preAnnounceWindow.length
  const volumeSpikePercent =
    ((volumeAtAnnouncement - avgVolumeBeforeAnnouncement) / avgVolumeBeforeAnnouncement) * 100

  // Calculate drift score (0-100)
  const driftComponent = Math.min(Math.abs(driftPercent) * 10, 100) * 0.4
  const preAnnounceComponent = Math.min(Math.abs(abnormalReturnPreAnnounce) * 15, 100) * 0.35
  const volumeComponent = Math.min(volumeSpikePercent / 2, 100) * 0.25
  const driftScore = Math.round(driftComponent + preAnnounceComponent + volumeComponent)

  // Risk classification
  let leakageRisk: "high" | "medium" | "low" = "low"
  if (driftScore > 70 || Math.abs(abnormalReturnPreAnnounce) > 3) {
    leakageRisk = "high"
  } else if (driftScore > 40 || Math.abs(abnormalReturnPreAnnounce) > 1.5) {
    leakageRisk = "medium"
  }

  // Significant drift flag
  const significantDrift = Math.abs(driftPercent) > 3 || Math.abs(abnormalReturnPreAnnounce) > 2

  return {
    eventId: action.eventId,
    instrumentName: action.instrumentName,
    announcementDate: action.announcementDate,
    exDividendDate: action.exDividendDate,
    daysToExDate,
    priceAtAnnouncement,
    priceAtExDate,
    driftPercent,
    abnormalReturnPreAnnounce,
    volumeAtAnnouncement,
    avgVolumeBeforeAnnouncement,
    volumeSpikePercent,
    driftScore,
    leakageRisk,
    significantDrift,
  }
}
