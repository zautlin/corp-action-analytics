#!/usr/bin/env node
/**
 * Direct ClickHouse connection test
 */

// Load .env.local
const fs = require('fs');
const path = require('path');

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

console.log('📊 ClickHouse Connection Test\n');
console.log('Configuration:');
console.log(`  Host: ${host}`);
console.log(`  Port: ${port}`);
console.log(`  Protocol: ${protocol}`);
console.log(`  User: ${user}`);
console.log(`  Password: ${password ? '***' : '(empty)'}`);
console.log(`  Database: ${database}\n`);

const url = `${protocol}://${host}:${port}/?user=${user}&password=${encodeURIComponent(password)}&database=${database}&default_format=JSON`;

console.log(`Testing connection to: ${protocol}://${host}:${port}\n`);

// Test query
const testQuery = 'SELECT 1 as test';

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
  },
  body: testQuery,
})
  .then(async response => {
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ Error Response:\n${errorText}`);
      process.exit(1);
    }
    
    const result = await response.json();
    console.log('\n✅ Connection successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Test database tables
    console.log('\n\n📋 Checking tables...\n');
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'SHOW TABLES FROM ' + database,
    });
  })
  .then(async response => {
    if (response.ok) {
      const tables = await response.json();
      console.log('Available tables:', JSON.stringify(tables, null, 2));
      
      // Check row counts
      console.log('\n\n📊 Checking row counts...\n');
      const countQueries = [
        `SELECT COUNT(*) as count, 'sicam_master' as table FROM ${database}.sicam_master`,
        `SELECT COUNT(*) as count, 'sicam_eod' as table FROM ${database}.sicam_eod`,
        `SELECT COUNT(*) as count, 'corp_actions' as table FROM ${database}.corp_actions`,
      ];
      
      return Promise.all(countQueries.map(query => 
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: query,
        }).then(r => r.json())
      ));
    } else {
      throw new Error('Failed to fetch tables');
    }
  })
  .then(results => {
    results.forEach(result => {
      if (result.data && result.data[0]) {
        console.log(`  ${result.data[0].table}: ${result.data[0].count.toLocaleString()} rows`);
      }
    });
    console.log('\n✅ All checks passed!');
  })
  .catch(error => {
    console.error('\n❌ Connection failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  });
