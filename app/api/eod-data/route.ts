/**
 * EOD Data API Route
 * GET /api/eod-data - Fetch end-of-day price data
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClickHouseClient } from '@/lib/clickhouse-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Required parameters
    const valoren = searchParams.get('valoren')
    if (!valoren) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: valoren',
        },
        { status: 400 }
      )
    }

    // Optional parameters
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const eventDate = searchParams.get('eventDate')
    const daysAround = searchParams.get('daysAround')
      ? parseInt(searchParams.get('daysAround')!)
      : 30

    const client = getClickHouseClient()

    let eodData

    // If eventDate is provided, fetch data around the event
    if (eventDate) {
      eodData = await client.getEODAroundEvent(valoren, eventDate, daysAround)
    }
    // Otherwise, fetch data for date range
    else if (dateFrom && dateTo) {
      eodData = await client.getEODData(valoren, dateFrom, dateTo)
    }
    // If neither, return error
    else {
      return NextResponse.json(
        {
          success: false,
          error: 'Either provide (dateFrom, dateTo) or (eventDate, daysAround)',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: eodData,
      count: eodData.length,
      params: {
        valoren,
        dateFrom,
        dateTo,
        eventDate,
        daysAround,
      },
    })
  } catch (error) {
    console.error('[API Error] EOD Data:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch EOD data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
