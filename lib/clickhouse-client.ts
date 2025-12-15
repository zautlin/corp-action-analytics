/**
 * ClickHouse Client for Corporate Actions Dashboard
 * Server-side only - handles all database interactions
 */

import { createClient, type ClickHouseClient as OfficialClickHouseClient } from '@clickhouse/client'
import { getClickHouseConfig } from './clickhouse-config'
import type { CorporateAction, EODData } from './types'

export interface QueryResult<T> {
  data: T[]
  rows: number
  statistics?: {
    elapsed: number
    rows_read: number
    bytes_read: number
  }
}

// Allowed bourse codes to filter data
// 7078 = AQXE (Aquis Exchange), 1341 = AQXE, 1560 = XSWX, 5051 = AQEU
const ALLOWED_BOURSE_CODES = ['7078', '1341', '1560', '5051']

export class ClickHouseClient {
  private config: ReturnType<typeof getClickHouseConfig>
  private client: OfficialClickHouseClient
  
  /**
   * Get SQL WHERE clause to filter by allowed bourse codes
   */
  private getBourseCodeFilter(): string {
    return `bc IN (${ALLOWED_BOURSE_CODES.map(bc => `'${bc}'`).join(', ')})`
  }

  constructor() {
    this.config = getClickHouseConfig()
    
    // Create official ClickHouse client for better Cloud support
    this.client = createClient({
      url: `${this.config.protocol}://${this.config.host}:${this.config.port}`,
      username: this.config.user,
      password: this.config.password,
      database: this.config.database,
      // ClickHouse Cloud specific settings
      request_timeout: 30000,
      compression: {
        response: true,
        request: false,
      },
      // TLS settings for ClickHouse Cloud
      tls: this.config.protocol === 'https' ? {
        rejectUnauthorized: false, // Allow ClickHouse Cloud certificates
      } : undefined,
    })
  }

  /**
   * Execute a raw SQL query using official ClickHouse client
   */
  async query<T = any>(sql: string): Promise<QueryResult<T>> {
    try {
      const resultSet = await this.client.query({
        query: sql,
        format: 'JSONEachRow',
      })

      const data = await resultSet.json<T>()

      return {
        data: Array.isArray(data) ? data : [],
        rows: Array.isArray(data) ? data.length : 0,
      }
    } catch (error) {
      console.error('ClickHouse query error:', error)
      throw error
    }
  }

  /**
   * Insert data into a table
   */
  async insert<T extends Record<string, any>>(
    table: string,
    data: T[]
  ): Promise<{ inserted: number }> {
    if (data.length === 0) {
      return { inserted: 0 }
    }

    // Build INSERT statement
    const columns = Object.keys(data[0])
    const values = data
      .map((row) => {
        const vals = columns.map((col) => {
          const val = row[col]
          if (val === null || val === undefined) return 'NULL'
          if (typeof val === 'string') return `'${val.replace(/'/g, "\\'")}'`
          if (typeof val === 'number') return val.toString()
          if (typeof val === 'boolean') return val ? '1' : '0'
          if (Array.isArray(val)) return `[${val.map((v) => `'${v}'`).join(',')}]`
          return `'${String(val)}'`
        })
        return `(${vals.join(', ')})`
      })
      .join(', ')

    const sql = `INSERT INTO ${this.config.database}.${table} (${columns.join(', ')}) VALUES ${values}`

    await this.query(sql)

    return { inserted: data.length }
  }

  // ============================================================================
  // CORPORATE ACTIONS QUERIES
  // ============================================================================

  /**
   * Get all corporate actions with optional filters
   */
  async getCorporateActions(filters?: {
    valoren?: string
    actionType?: number
    dateFrom?: string
    dateTo?: string
    status?: string
  }): Promise<CorporateAction[]> {
    // Note: corp_actions table uses DD/MM/YYYY format, need to parse
    // Also uses different column names than expected
    let sql = `
      SELECT 
        event_identifier as eventId,
        swiss_valor_number as valoren,
        swiss_valor_number as identifier,
        event_instrument_short_name as instrumentName,
        event_isin as isin,
        toInt32(corporate_action_type) as actionType,
        CASE 
          WHEN corporate_action_type = '230' THEN 'Cash Dividend'
          WHEN corporate_action_type = '237' THEN 'Stock Distribution'
          WHEN corporate_action_type = '238' THEN 'Bonus Issue'
          WHEN corporate_action_type = '440' THEN 'Stock Split'
          WHEN corporate_action_type = '451' THEN 'Rights Issue'
          WHEN corporate_action_type = '461' THEN 'Merger'
          ELSE concat('Type ', corporate_action_type)
        END as actionTypeLabel,
        CASE WHEN announcement_date != '' THEN parseDateTimeBestEffort(announcement_date) ELSE toDateTime('1970-01-01') END as announcementDate,
        parseDateTimeBestEffort(ex_dividend_date) as exDividendDate,
        CASE WHEN payment_date != '' THEN parseDateTimeBestEffort(payment_date) ELSE toDateTime('1970-01-01') END as paymentDate,
        toFloat64OrZero(gross_amount_distribution) as amount,
        CASE 
          WHEN gross_amount_distribution_currency = '333' THEN 'USD'
          WHEN gross_amount_distribution_currency = '402' THEN 'EUR'
          WHEN gross_amount_distribution_currency = '814' THEN 'CHF'
          ELSE gross_amount_distribution_currency
        END as currency,
        CASE 
          WHEN message_status = '1' THEN 'confirmed'
          ELSE 'pending'
        END as status
      FROM ${this.config.database}.corp_actions
      WHERE corporate_action_type != ''
        AND ex_dividend_date != ''
        AND gross_amount_distribution != ''
        AND swiss_valor_number IN (
          SELECT DISTINCT valor 
          FROM ${this.config.database}.sicam_master 
          WHERE ${this.getBourseCodeFilter()}
        )
    `

    if (filters?.valoren) {
      sql += ` AND swiss_valor_number = '${filters.valoren}'`
    }
    if (filters?.actionType) {
      sql += ` AND corporate_action_type = '${filters.actionType}'`
    }
    if (filters?.dateFrom) {
      sql += ` AND parseDateTimeBestEffort(ex_dividend_date) >= '${filters.dateFrom}'`
    }
    if (filters?.dateTo) {
      sql += ` AND parseDateTimeBestEffort(ex_dividend_date) <= '${filters.dateTo}'`
    }
    if (filters?.status) {
      sql += ` AND message_status = '${filters.status === 'confirmed' ? '1' : '0'}'`
    }

    sql += ` ORDER BY parseDateTimeBestEffort(ex_dividend_date) DESC`

    const result = await this.query<CorporateAction>(sql)
    return result.data
  }

  /**
   * Get instrument details from sicam_master
   */
  async getInstrumentDetails(valoren: string): Promise<any> {
    const sql = `
      SELECT 
        valor as valoren,
        ticker_symbol as ticker,
        instrument_short_name as instrument_name,
        instrument_symbol,
        isin,
        currency,
        bc as bourse_code,
        operating_mic,
        segment_mic,
        issuer
      FROM ${this.config.database}.sicam_master
      WHERE valor = '${valoren}'
        AND session_date = (SELECT max(session_date) FROM ${this.config.database}.sicam_master)
        AND ${this.getBourseCodeFilter()}
      LIMIT 1
    `

    const result = await this.query(sql)
    return result.data.length > 0 ? result.data[0] : null
  }

  /**
   * Get all instruments from sicam_master with pagination
   */
  async getAllInstruments(
    page: number = 1,
    pageSize: number = 50,
    search: string = '',
    sortBy: string = 'valoren',
    sortOrder: string = 'asc'
  ): Promise<{
    data: any[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }> {
    const offset = (page - 1) * pageSize
    
    // Map frontend sort fields to actual database columns
    const sortFieldMap: Record<string, string> = {
      'valoren': 'valor',
      'ticker': 'ticker_symbol',
      'instrument_name': 'instrument_short_name',
      'currency': 'currency',
      'bourse_code': 'bc',
      'operating_mic': 'operating_mic',
      'segment_mic': 'segment_mic'
    }
    
    const validSortBy = sortFieldMap[sortBy] || 'valor'
    const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

    // Build base WHERE clause with bourse code filter
    const baseWhereClause = `session_date = (SELECT max(session_date) FROM ${this.config.database}.sicam_master) AND ${this.getBourseCodeFilter()}`
    
    // Build search subquery if search term provided
    let searchFilter = ''
    if (search) {
      const searchLower = search.toLowerCase().replace(/'/g, "\\'")
      searchFilter = ` AND valor IN (
        SELECT DISTINCT valor
        FROM ${this.config.database}.sicam_master
        WHERE ${baseWhereClause}
          AND (
            lower(valor) LIKE '%${searchLower}%' OR
            lower(ticker_symbol) LIKE '%${searchLower}%' OR
            lower(instrument_short_name) LIKE '%${searchLower}%' OR
            lower(instrument_symbol) LIKE '%${searchLower}%' OR
            lower(isin) LIKE '%${searchLower}%' OR
            lower(bc) LIKE '%${searchLower}%' OR
            lower(operating_mic) LIKE '%${searchLower}%'
          )
      )`
    }
    
    const whereClause = baseWhereClause + searchFilter

    // Get total count
    const countSql = `
      SELECT count(DISTINCT valor) as total
      FROM ${this.config.database}.sicam_master
      WHERE ${whereClause}
    `
    const countResult = await this.query<{ total: string }>(countSql)
    const totalItems = parseInt(countResult.data[0]?.total || '0')
    const totalPages = Math.ceil(totalItems / pageSize)

    // Get paginated data
    const sql = `
      SELECT 
        valor as valoren,
        any(ticker_symbol) as ticker,
        any(instrument_short_name) as instrument_name,
        any(instrument_symbol) as instrument_symbol,
        any(isin) as isin,
        any(currency) as currency,
        any(bc) as bourse_code,
        any(operating_mic) as operating_mic,
        any(segment_mic) as segment_mic,
        any(issuer) as issuer
      FROM ${this.config.database}.sicam_master
      WHERE ${whereClause}
      GROUP BY valor
      ORDER BY ${validSortBy === 'valor' ? 'valor' : `any(${validSortBy})`} ${validSortOrder}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `

    const result = await this.query(sql)

    return {
      data: result.data,
      page,
      pageSize,
      totalItems,
      totalPages,
    }
  }

  /**
   * Get EOD data from sicam_eod table
   */
  async getEODData(
    valoren: string,
    dateFrom: string,
    dateTo: string
  ): Promise<EODData[]> {
    const sql = `
      SELECT 
        toString(session_date) as date,
        ticker_symbol as exchange,
        valor as valoren,
        toFloat64(open_price) as openPrice,
        toFloat64(high) as highPrice,
        toFloat64(low) as lowPrice,
        toFloat64(close) as closePrice,
        toUInt64(volume) as volume,
        toFloat64(turnover) as turnover
      FROM ${this.config.database}.sicam_eod
      WHERE valor = '${valoren}'
        AND session_date BETWEEN '${dateFrom}' AND '${dateTo}'
        AND ${this.getBourseCodeFilter()}
      ORDER BY session_date ASC
    `

    const result = await this.query<EODData>(sql)
    return result.data
  }

  /**
   * Get EOD data around a corporate action event (±N days)
   */
  async getEODAroundEvent(
    valoren: string,
    eventDate: string,
    daysAround: number = 30
  ): Promise<EODData[]> {
    const sql = `
      SELECT 
        toString(session_date) as date,
        ticker_symbol as exchange,
        valor as valoren,
        toFloat64(open_price) as openPrice,
        toFloat64(high) as highPrice,
        toFloat64(low) as lowPrice,
        toFloat64(close) as closePrice,
        toUInt64(volume) as volume,
        toFloat64(turnover) as turnover
      FROM ${this.config.database}.sicam_eod
      WHERE valor = '${valoren}'
        AND session_date BETWEEN 
          toDate('${eventDate}') - INTERVAL ${daysAround} DAY 
          AND toDate('${eventDate}') + INTERVAL ${daysAround} DAY
        AND ${this.getBourseCodeFilter()}
      ORDER BY session_date ASC
    `

    const result = await this.query<EODData>(sql)
    return result.data
  }

  /**
   * Get event statistics - count and aggregate corporate actions by instrument
   */
  async getEventStatistics(valoren?: string): Promise<any[]> {
    let sql = `
      SELECT 
        valoren,
        instrument_name as instrumentName,
        action_type as actionType,
        count(*) as eventCount,
        sum(amount) as totalAmount,
        min(ex_dividend_date) as firstEvent,
        max(ex_dividend_date) as lastEvent
      FROM ${this.config.database}.corp_actions
      WHERE valoren IN (
        SELECT DISTINCT valor 
        FROM ${this.config.database}.sicam_master 
        WHERE ${this.getBourseCodeFilter()}
      )
    `

    if (valoren) {
      sql += ` AND valoren = '${valoren}'`
    }
    
    sql += ` GROUP BY valoren, instrument_name, action_type`
    sql += ` ORDER BY eventCount DESC`

    const result = await this.query(sql)
    return result.data
  }

  /**
   * Get unique action types from corp_actions
   */
  async getActionTypes(): Promise<any[]> {
    const sql = `
      SELECT DISTINCT
        action_type as actionType,
        action_type_label as actionTypeLabel,
        count(*) as count
      FROM ${this.config.database}.corp_actions
      WHERE valoren IN (
        SELECT DISTINCT valor 
        FROM ${this.config.database}.sicam_master 
        WHERE ${this.getBourseCodeFilter()}
      )
      GROUP BY action_type, action_type_label
      ORDER BY action_type
    `

    const result = await this.query(sql)
    return result.data
  }

  /**
   * Health check - test connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      const result = await this.query('SELECT 1 as test')
      return {
        status: 'ok',
        message: `Connected to ClickHouse at ${this.config.host}:${this.config.port}`,
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Singleton instance
let clickhouseClient: ClickHouseClient | null = null

export function getClickHouseClient(): ClickHouseClient {
  if (!clickhouseClient) {
    clickhouseClient = new ClickHouseClient()
  }
  return clickhouseClient
}
