/**
 * Instruments API Route
 * GET /api/instruments - Fetch instrument master data from sicam_master
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClickHouseClient } from '@/lib/clickhouse-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const valoren = searchParams.get('valoren')
    const client = getClickHouseClient()

    // If valoren is provided, fetch specific instrument
    if (valoren) {
      const instrument = await client.getInstrumentDetails(valoren)

      if (!instrument) {
        return NextResponse.json(
          {
            success: false,
            error: `Instrument with valoren ${valoren} not found`,
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: instrument,
      })
    }

    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'valoren'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Fetch instruments with pagination
    const result = await client.getAllInstruments(page, pageSize, search, sortBy, sortOrder)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('[API Error] Instruments:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch instruments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
