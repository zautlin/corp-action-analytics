/**
 * Test ClickHouse Connection
 * Run with: npx tsx scripts/test-clickhouse.ts
 */

import { getClickHouseClient } from '../lib/clickhouse-client'

async function testConnection() {
  console.log('🔌 Testing ClickHouse Connection...\n')

  try {
    const client = getClickHouseClient()

    // 1. Health Check
    console.log('1️⃣ Running health check...')
    const health = await client.healthCheck()
    console.log(`   Status: ${health.status}`)
    console.log(`   Message: ${health.message}\n`)

    if (health.status !== 'ok') {
      throw new Error('Health check failed')
    }

    // 2. Query Database Version
    console.log('2️⃣ Checking database version...')
    const versionResult = await client.query('SELECT version() as version')
    console.log(`   ClickHouse Version: ${versionResult.data[0]?.version}\n`)

    // 3. List Tables
    console.log('3️⃣ Listing tables in six_poc database...')
    const tablesResult = await client.query(`
      SELECT name, engine, total_rows
      FROM system.tables
      WHERE database = 'six_poc'
      ORDER BY name
    `)
    console.log(`   Found ${tablesResult.rows} tables:`)
    tablesResult.data.forEach((table: any) => {
      console.log(`   - ${table.name} (${table.engine}, ${table.total_rows} rows)`)
    })
    console.log()

    // 3a. Check specific tables we need
    console.log('3a. Checking required tables exist...')
    const requiredTables = ['corp_actions', 'sicam_eod', 'sicam_master']
    for (const tableName of requiredTables) {
      const checkResult = await client.query(`
        SELECT count(*) as count
        FROM system.tables
        WHERE database = 'six_poc' AND name = '${tableName}'
      `)
      const exists = checkResult.data[0]?.count > 0
      console.log(`   ${exists ? '✓' : '✗'} ${tableName}`)
    }
    console.log()

    // 4. Query Corporate Actions
    console.log('4️⃣ Fetching corporate actions (limit 5)...')
    const actions = await client.getCorporateActions()
    console.log(`   Found ${actions.length} total corporate actions`)
    console.log(`   First 5 actions:`)
    actions.slice(0, 5).forEach((action) => {
      console.log(
        `   - ${action.instrumentName} (${action.valoren}): ${action.actionTypeLabel} on ${action.exDividendDate}`
      )
    })
    console.log()

    // 5. Query Instrument Master Data
    console.log('5️⃣ Fetching instrument master data...')
    const instruments = await client.getAllInstruments()
    console.log(`   Found ${instruments.length} instruments in sicam_master`)
    if (instruments.length > 0) {
      console.log(`   First 3 instruments:`)
      instruments.slice(0, 3).forEach((inst: any) => {
        console.log(`   - ${inst.valoren}: ${inst.instrument_name || inst.ticker || 'N/A'}`)
      })
    }
    console.log()

    // 6. Query EOD Data for a sample instrument
    if (actions.length > 0) {
      const sampleAction = actions[0]
      console.log(`6️⃣ Fetching EOD data for ${sampleAction.instrumentName} (${sampleAction.valoren})...`)

      const eodData = await client.getEODAroundEvent(
        sampleAction.valoren,
        sampleAction.exDividendDate,
        10 // ±10 days
      )

      console.log(`   Found ${eodData.length} trading days (±10 days from event)`)
      if (eodData.length > 0) {
        const sample = eodData[0]
        console.log(`   Sample data point:`)
        console.log(`   - Date: ${sample.date}`)
        console.log(`   - Close: ${sample.closePrice}`)
        console.log(`   - Volume: ${sample.volume}`)
      }
      console.log()
    }

    // 7. Query Event Statistics
    console.log('7️⃣ Fetching event statistics...')
    const stats = await client.getEventStatistics()
    console.log(`   Found statistics for ${stats.length} instrument/action type combinations:`)
    stats.slice(0, 5).forEach((stat: any) => {
      console.log(
        `   - ${stat.instrumentName} (${stat.valoren}): ${stat.eventCount} events (Type ${stat.actionType})`
      )
    })
    console.log()

    // 8. Query Action Types
    console.log('8️⃣ Fetching action types...')
    const actionTypes = await client.getActionTypes()
    console.log(`   Found ${actionTypes.length} action types:`)
    actionTypes.forEach((type: any) => {
      console.log(`   - Type ${type.actionType}: ${type.actionTypeLabel} (${type.count} events)`)
    })
    console.log()

    console.log('✅ All tests passed!\n')
  } catch (error) {
    console.error('❌ Test failed:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Run tests
testConnection()
