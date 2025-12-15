#!/usr/bin/env node
/**
 * Test ClickHouse connection with official @clickhouse/client
 */

const { createClient } = require('@clickhouse/client');
const fs = require('fs');
const path = require('path');

// Load .env.local
try {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
} catch (err) {
  console.error('Error loading .env.local:', err.message);
}

const host = process.env.CLICKHOUSE_HOST || 'localhost';
const port = process.env.CLICKHOUSE_PORT || '8443';
const protocol = process.env.CLICKHOUSE_PROTOCOL || 'https';
const user = process.env.CLICKHOUSE_USER || 'default';
const password = process.env.CLICKHOUSE_PASSWORD || '';
const database = process.env.CLICKHOUSE_DATABASE || 'six_poc';

console.log('📊 Testing ClickHouse with Official Client\n');
console.log('Configuration:');
console.log(`  URL: ${protocol}://${host}:${port}`);
console.log(`  User: ${user}`);
console.log(`  Password: ${password ? '***' : '(empty)'}`);
console.log(`  Database: ${database}\n`);

// Create client
const client = createClient({
  url: `${protocol}://${host}:${port}`,
  username: user,
  password: password,
  database: database,
  request_timeout: 30000,
  compression: {
    response: true,
    request: false,
  },
});

console.log('Testing connection...\n');

// Test 1: Simple query
client.query({
  query: 'SELECT 1 as test',
  format: 'JSONEachRow',
})
  .then(async (resultSet) => {
    const data = await resultSet.json();
    console.log('✅ Test 1: Simple query successful!');
    console.log('   Result:', JSON.stringify(data, null, 2));
    
    // Test 2: Show tables
    console.log('\n📋 Test 2: Checking tables...\n');
    return client.query({
      query: `SHOW TABLES FROM ${database}`,
      format: 'JSONEachRow',
    });
  })
  .then(async (resultSet) => {
    const tables = await resultSet.json();
    console.log('✅ Available tables:');
    tables.forEach(t => console.log(`   - ${t.name}`));
    
    // Test 3: Check row counts
    console.log('\n📊 Test 3: Checking row counts...\n');
    const queries = [
      `SELECT 'sicam_master' as table, COUNT(*) as count FROM ${database}.sicam_master`,
      `SELECT 'sicam_eod' as table, COUNT(*) as count FROM ${database}.sicam_eod`,
      `SELECT 'corp_actions' as table, COUNT(*) as count FROM ${database}.corp_actions`,
    ];
    
    return Promise.all(queries.map(q => 
      client.query({ query: q, format: 'JSONEachRow' }).then(r => r.json())
    ));
  })
  .then(results => {
    console.log('✅ Row counts:');
    results.forEach(rows => {
      if (rows.length > 0) {
        console.log(`   ${rows[0].table}: ${rows[0].count.toLocaleString()} rows`);
      }
    });
    
    // Test 4: Sample data from sicam_master
    console.log('\n🔍 Test 4: Sample data from sicam_master...\n');
    return client.query({
      query: `SELECT valor as valoren, ticker_symbol as ticker, instrument_short_name as instrument_name FROM ${database}.sicam_master LIMIT 5`,
      format: 'JSONEachRow',
    });
  })
  .then(async (resultSet) => {
    const samples = await resultSet.json();
    console.log('✅ Sample instruments:');
    samples.forEach(s => {
      console.log(`   ${s.valoren}: ${s.ticker} - ${s.instrument_name}`);
    });
    
    console.log('\n✅ All tests passed! ClickHouse is working correctly.\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    console.error('\nFull error:', error);
    process.exit(1);
  });
