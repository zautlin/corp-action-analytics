#!/usr/bin/env node
/**
 * Test ClickHouse with https module directly
 */

const https = require('https');
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
const user = process.env.CLICKHOUSE_USER || 'default';
const password = process.env.CLICKHOUSE_PASSWORD || '';
const database = process.env.CLICKHOUSE_DATABASE || 'six_poc';

console.log('📊 ClickHouse Connection Test (HTTPS Module)\n');
console.log(`Host: ${host}:${port}`);
console.log(`Database: ${database}\n`);

const query = 'SELECT 1 as test';
const path_url = `/?user=${user}&password=${encodeURIComponent(password)}&database=${database}&default_format=JSON`;

const options = {
  hostname: host,
  port: parseInt(port),
  path: path_url,
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(query),
  },
  rejectUnauthorized: false, // Disable SSL verification
};

console.log('Sending query...\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n✅ Response received!\n');
    try {
      const json = JSON.parse(data);
      console.log('Result:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Full error:', error);
});

req.write(query);
req.end();
