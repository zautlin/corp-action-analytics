# ClickHouse Integration Setup Guide

## Prerequisites

1. **ClickHouse Cloud Access**
   - Host: `ctz1fh48b5.ap-southeast-2.aws.clickhouse.cloud`
   - Port: `8443`
   - Database: `six_poc`
   - Protocol: HTTPS

2. **Required Tables**
   - `corp_actions` - Corporate actions events
   - `sicam_eod` - End-of-day price data
   - `sicam_master` - Instrument master data

---

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root with your ClickHouse credentials:

```env
# ClickHouse Configuration
CLICKHOUSE_HOST=ctz1fh48b5.ap-southeast-2.aws.clickhouse.cloud
CLICKHOUSE_PORT=8443
CLICKHOUSE_USER=your_username
CLICKHOUSE_PASSWORD=your_password
CLICKHOUSE_PROTOCOL=https
CLICKHOUSE_DATABASE=six_poc
CLICKHOUSE_SECURE=true
CLICKHOUSE_VERIFY_SSL=true
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `tsx` - TypeScript execution for testing
- All Next.js dependencies
- ClickHouse client dependencies

### 3. Test Database Connection

Run the ClickHouse test script:

```bash
npm run test:db
```

Expected output:
```
🔌 Testing ClickHouse Connection...

1️⃣ Running health check...
   Status: ok
   Message: Connected to ClickHouse at ctz1fh48b5.ap-southeast-2.aws.clickhouse.cloud:8443

2️⃣ Checking database version...
   ClickHouse Version: 24.x.x.x

3️⃣ Listing tables in six_poc database...
   Found 3 tables:
   - corp_actions (MergeTree, XXX rows)
   - sicam_eod (MergeTree, XXXXXX rows)
   - sicam_master (MergeTree, XXX rows)

3a. Checking required tables exist...
   ✓ corp_actions
   ✓ sicam_eod
   ✓ sicam_master

4️⃣ Fetching corporate actions (limit 5)...
   Found XX total corporate actions
   First 5 actions:
   - Viscofan SA (503): Cash Dividend on 2024-04-10
   ...

✅ All tests passed!
```

---

## API Routes

Once the database connection is verified, you can start the dev server:

```bash
npm run dev
```

### Available Endpoints

#### 1. Corporate Actions
```bash
# Get all corporate actions
curl http://localhost:3000/api/corp-actions

# Filter by valoren
curl http://localhost:3000/api/corp-actions?valoren=503

# Filter by action type
curl http://localhost:3000/api/corp-actions?actionType=230

# Filter by date range
curl "http://localhost:3000/api/corp-actions?dateFrom=2024-01-01&dateTo=2024-12-31"
```

#### 2. EOD Data
```bash
# Get EOD data for date range
curl "http://localhost:3000/api/eod-data?valoren=503&dateFrom=2024-01-01&dateTo=2024-12-31"

# Get EOD data around event (±10 days)
curl "http://localhost:3000/api/eod-data?valoren=503&eventDate=2024-04-10&daysAround=10"
```

#### 3. Instruments
```bash
# Get all instruments
curl http://localhost:3000/api/instruments

# Get specific instrument
curl http://localhost:3000/api/instruments?valoren=503
```

#### 4. Calculate Signals
```bash
# Calculate signals for an event
curl -X POST http://localhost:3000/api/signals \
  -H "Content-Type: application/json" \
  -d '{"valoren":"503","eventDate":"2024-04-10","actionType":230}'
```

---

## Troubleshooting

### Connection Errors

**Error: "Health check failed"**
- Check your `.env.local` file exists and has correct credentials
- Verify network connectivity to ClickHouse Cloud
- Ensure CLICKHOUSE_HOST includes the full hostname (no https://)

**Error: "Table not found"**
- Verify the database name is `six_poc`
- Check that tables exist: `corp_actions`, `sicam_eod`, `sicam_master`
- Run the test script to see which tables are available

**Error: "SSL/TLS connection error"**
- Ensure CLICKHOUSE_PROTOCOL is set to `https`
- Ensure CLICKHOUSE_PORT is `8443` (not 8123)
- Check CLICKHOUSE_SECURE is set to `true`

### Query Errors

**Error: "Column not found"**
- The table schema may be different than expected
- Check column names in ClickHouse:
  ```sql
  DESCRIBE TABLE six_poc.corp_actions
  ```

**Error: "No data returned"**
- Check if data exists for the valoren/date range
- Try querying ClickHouse directly to verify data

### Dev Server Issues

**Error: "fetch is not defined"**
- Ensure you're using Node.js 18+ (fetch is built-in)
- Update Node.js if needed

**Error: "Module not found"**
- Run `npm install` to install all dependencies
- Clear .next folder: `rm -rf .next`

---

## ClickHouse Client Methods

### Available Methods

```typescript
import { getClickHouseClient } from '@/lib/clickhouse-client'

const client = getClickHouseClient()

// Health check
const health = await client.healthCheck()

// Get corporate actions
const actions = await client.getCorporateActions({
  valoren: '503',
  actionType: 230,
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
})

// Get EOD data
const eodData = await client.getEODData('503', '2024-01-01', '2024-12-31')

// Get EOD data around event
const eventData = await client.getEODAroundEvent('503', '2024-04-10', 30)

// Get instrument details
const instrument = await client.getInstrumentDetails('503')

// Get all instruments
const instruments = await client.getAllInstruments()

// Get event statistics
const stats = await client.getEventStatistics()

// Get action types
const actionTypes = await client.getActionTypes()

// Raw query
const result = await client.query('SELECT * FROM six_poc.corp_actions LIMIT 10')
```

---

## Database Schema Reference

### corp_actions Table

Key columns:
- `event_id` - Unique event identifier
- `valoren` - Instrument identifier
- `instrument_name` - Instrument name
- `isin` - ISIN code
- `action_type` - Action type code (230, 237, 238, 440, 451, 461)
- `action_type_label` - Human-readable action type
- `announcement_date` - Date announced
- `ex_dividend_date` - Ex-dividend date
- `payment_date` - Payment date
- `amount` - Dividend/split amount
- `currency` - Currency code
- `status` - Event status

### sicam_eod Table

Key columns:
- `trade_date` - Trading date
- `ticker` - Trading symbol
- `valoren` - Instrument identifier
- `open` - Open price
- `high` - High price
- `low` - Low price
- `close` - Close price
- `volume` - Trading volume

### sicam_master Table

Key columns (check actual schema):
- `valoren` - Instrument identifier
- `ticker` - Trading symbol
- `instrument_name` - Full instrument name
- `isin` - ISIN code
- Additional metadata fields

---

## Next Steps

After verifying database connection:

1. ✅ Test all API endpoints
2. ✅ Verify data quality and completeness
3. ⬜ Integrate with frontend components
4. ⬜ Build Portfolio Manager dashboard
5. ⬜ Build Risk Officer dashboard
6. ⬜ Add real-time data updates
7. ⬜ Implement caching layer
8. ⬜ Add authentication/authorization

---

## Support

For issues:
1. Check this guide's troubleshooting section
2. Review API documentation: `docs/API_DOCUMENTATION.md`
3. Run the test script with verbose logging
4. Contact the development team
