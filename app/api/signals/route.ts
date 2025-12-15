/**
 * Signals Calculation API Route
 * POST /api/signals - Calculate quantitative signals for corporate action events
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClickHouseClient } from '@/lib/clickhouse-client'
import { SignalLibrary } from '@/lib/signal-library'
import type { CorporateAction, EODData } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { valoren, eventDate, actionType } = body

    // Validate required parameters
    if (!valoren || !eventDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: valoren, eventDate',
        },
        { status: 400 }
      )
    }

    const client = getClickHouseClient()

    // Fetch EOD data around the event (±180 days for momentum calculations)
    const eodData = await client.getEODAroundEvent(valoren, eventDate, 180)

    if (eodData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No EOD data found for the specified parameters',
        },
        { status: 404 }
      )
    }

    // Convert EOD data format for signal library
    const priceData = eodData.map((d) => ({
      date: d.date,
      close: d.closePrice,
      volume: d.volume,
      high: d.highPrice,
      low: d.lowPrice,
    }))

    // Find event date index
    const eventIndex = priceData.findIndex((d) => d.date === eventDate)
    if (eventIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event date not found in EOD data',
        },
        { status: 404 }
      )
    }

    // Calculate all signals
    const signals = {
      // Momentum Signals
      momentum1M: SignalLibrary.calculateMomentum1M(priceData, eventIndex),
      momentum3M: SignalLibrary.calculateMomentum3M(priceData, eventIndex),
      momentum6M: SignalLibrary.calculateMomentum6M(priceData, eventIndex),
      announcementDrift: SignalLibrary.calculateAnnouncementDrift(priceData, eventIndex),

      // Mean Reversion Signals
      zScoreReversal: SignalLibrary.calculateZScoreReversal(priceData, eventIndex),
      meanReversion5D: SignalLibrary.calculateMeanReversion(priceData, eventIndex, 5),
      meanReversion10D: SignalLibrary.calculateMeanReversion(priceData, eventIndex, 10),

      // Volatility Signals
      impliedVolatilitySpike: SignalLibrary.calculateImpliedVolatilitySpike(
        priceData,
        eventIndex
      ),
      volumeSurprise: SignalLibrary.calculateVolumeSurprise(priceData, eventIndex),
      turnoverAcceleration: SignalLibrary.calculateTurnoverAcceleration(
        priceData,
        eventIndex
      ),

      // Event-Specific Signals
      postSplitMomentum:
        actionType === 440
          ? SignalLibrary.calculatePostSplitMomentum(priceData, eventIndex)
          : null,
    }

    // Calculate composite score
    const compositeScore = SignalLibrary.calculateCompositeScore(signals)

    // Calculate percentile rank (would need historical data for accurate ranking)
    const percentileRank = SignalLibrary.calculatePercentileRank(compositeScore, [
      compositeScore,
    ])

    return NextResponse.json({
      success: true,
      data: {
        valoren,
        eventDate,
        actionType,
        signals,
        compositeScore,
        percentileRank,
        dataPoints: priceData.length,
        eventIndex,
      },
    })
  } catch (error) {
    console.error('API Error - Signals:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate signals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to fetch pre-calculated signals
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const valoren = searchParams.get('valoren')
    const eventId = searchParams.get('eventId')

    if (!valoren && !eventId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Provide either valoren or eventId',
        },
        { status: 400 }
      )
    }

    // TODO: Implement fetching pre-calculated signals from database
    // For now, return a placeholder response

    return NextResponse.json({
      success: true,
      data: [],
      message: 'Pre-calculated signals not yet implemented. Use POST to calculate on-demand.',
    })
  } catch (error) {
    console.error('API Error - Get Signals:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch signals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
