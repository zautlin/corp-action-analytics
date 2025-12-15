/**
 * Corporate Actions API Route
 * GET /api/corp-actions - Fetch corporate actions with optional filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClickHouseClient } from '@/lib/clickhouse-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const filters = {
      valoren: searchParams.get('valoren') || undefined,
      actionType: searchParams.get('actionType')
        ? parseInt(searchParams.get('actionType')!)
        : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      status: searchParams.get('status') || undefined,
    }

    // Get ClickHouse client and fetch corporate actions
    const client = getClickHouseClient()
    const actions = await client.getCorporateActions(filters)

    return NextResponse.json({
      success: true,
      data: actions,
      count: actions.length,
      filters: filters,
    })
  } catch (error) {
    console.error('[API Error] Corporate Actions:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch corporate actions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
