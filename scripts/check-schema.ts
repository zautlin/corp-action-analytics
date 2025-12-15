/**
 * Check sicam_master schema
 */

import { getClickHouseClient } from '../lib/clickhouse-client'

async function checkSchema() {
  console.log('🔍 Checking sicam_master table schema...\n')

  try {
    const client = getClickHouseClient()

    // Describe the table
    const result = await client.query(`DESCRIBE TABLE six_poc.sicam_master`)
    
    console.log('✅ sicam_master columns:\n')
    result.data.forEach((col: any) => {
      console.log(`  - ${col.name} (${col.type})`)
    })
    console.log()

    // Get sample data
    const sampleResult = await client.query(`SELECT * FROM six_poc.sicam_master LIMIT 3`)
    console.log('📊 Sample data (first 3 rows):\n')
    console.log(JSON.stringify(sampleResult.data, null, 2))
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

checkSchema()
