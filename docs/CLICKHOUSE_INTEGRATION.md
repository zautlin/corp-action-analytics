# Corporate Actions Dashboard - ClickHouse Integration Guide

## Overview

This document provides the ClickHouse database schema and integration instructions for the Corporate Actions Dashboard.

## Database Schema

### 1. Corporate Actions Table

```sql
CREATE TABLE corp_actions (
    event_id String,
    identifier String,
    valoren String,
    instrument_name String,
    isin String,
    action_type UInt16,
    action_type_label String,
    ex_dividend_date Date,
    announcement_date Date,
    payment_date Date,
    amount Decimal(18, 4),
    currency String,
    status String,
    created_at DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (valoren, ex_dividend_date)
PARTITION BY toYYYYMM(ex_dividend_date);
```

### 2. End-of-Day Market Data Table

```sql
CREATE TABLE market_data_eod (
    date Date,
    exchange String,
    valoren String,
    open_price Decimal(18, 4),
    high_price Decimal(18, 4),
    low_price Decimal(18, 4),
    close_price Decimal(18, 4),
    turnover Decimal(18, 2),
    volume UInt64,
    created_at DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (valoren, date)
PARTITION BY toYYYYMM(date);
```

## Corporate Action Type Codes

| Code | Label | Description |
|------|-------|-------------|
| 230 | Cash Dividend | Regular cash dividend payment |
| 237 | Stock Distribution | Distribution of additional shares |
| 238 | Bonus Issue | Free shares issued to existing shareholders |
| 440 | Stock Split | Division of existing shares into multiple shares |
| 451 | Rights Issue | Offer to purchase additional shares |
| 461 | Merger | Company merger or acquisition |

## Sample Data Loading

### Load Corporate Actions from CSV

```sql
INSERT INTO corp_actions
SELECT
    eventIdentifier as event_id,
    identifier,
    swissValorNumber as valoren,
    eventInstrumentShortName as instrument_name,
    eventISIN as isin,
    corporateActionType as action_type,
    CASE corporateActionType
        WHEN 230 THEN 'Cash Dividend'
        WHEN 237 THEN 'Stock Distribution'
        WHEN 238 THEN 'Bonus Issue'
        WHEN 440 THEN 'Stock Split'
        WHEN 451 THEN 'Rights Issue'
        WHEN 461 THEN 'Merger'
        ELSE 'Other'
    END as action_type_label,
    parseDateTimeBestEffort(exDividendDate) as ex_dividend_date,
    parseDateTimeBestEffort(announcementDate) as announcement_date,
    parseDateTimeBestEffort(paymentDate) as payment_date,
    grossQuantityOrAmount as amount,
    CASE grossCurrency
        WHEN '814' THEN 'EUR'
        WHEN '756' THEN 'CHF'
        WHEN '840' THEN 'USD'
        ELSE 'EUR'
    END as currency,
    CASE messageStatus
        WHEN '1' THEN 'Complete'
        WHEN '2' THEN 'Incomplete'
        ELSE 'Pending'
    END as status,
    now() as created_at
FROM file('/path/to/corp_actions.csv', CSVWithNames);
```

### Load EOD Market Data from CSV

```sql
INSERT INTO market_data_eod
SELECT
    Date as date,
    Exchange as exchange,
    Valoren as valoren,
    OpenPrice as open_price,
    HighPrice as high_price,
    LowPrice as low_price,
    ClosePrice as close_price,
    Turnover as turnover,
    Volume as volume,
    now() as created_at
FROM file('/path/to/eod_data.csv', CSVWithNames);
```

## API Queries

### 1. Get Corporate Actions with Filters

```sql
SELECT 
    event_id,
    identifier,
    valoren,
    instrument_name,
    isin,
    action_type,
    action_type_label,
    ex_dividend_date,
    announcement_date,
    payment_date,
    amount,
    currency,
    status
FROM corp_actions
WHERE 
    ex_dividend_date >= '2023-01-01'
    AND ex_dividend_date <= '2025-12-31'
    AND (valoren = '3481' OR valoren = '8690')
    AND action_type IN (230, 237, 238)
    AND status = 'Complete'
ORDER BY ex_dividend_date DESC
LIMIT 100;
```

### 2. Get EOD Data Around Corporate Action Event

```sql
SELECT 
    date,
    exchange,
    valoren,
    open_price,
    high_price,
    low_price,
    close_price,
    turnover,
    volume
FROM market_data_eod
WHERE 
    valoren = '3481'
    AND date >= '2024-04-28'  -- 30 days before ex-div
    AND date <= '2024-06-27'  -- 30 days after ex-div
ORDER BY date ASC;
```

### 3. Calculate Analytics Summary

```sql
SELECT 
    count() as total_events,
    sum(amount) as total_dividend_amount,
    countIf(ex_dividend_date > today()) as upcoming_events,
    countIf(action_type = 230) as dividend_events,
    countIf(action_type = 237) as stock_distribution_events,
    countIf(action_type = 440) as split_events
FROM corp_actions
WHERE 
    ex_dividend_date >= '2023-01-01'
    AND ex_dividend_date <= '2025-12-31';
```

### 4. Price Impact Analysis

```sql
WITH event_data AS (
    SELECT 
        valoren,
        ex_dividend_date
    FROM corp_actions
    WHERE event_id = '549609016'
),
price_data AS (
    SELECT 
        m.date,
        m.close_price,
        m.volume,
        CASE 
            WHEN m.date = e.ex_dividend_date THEN true
            ELSE false
        END as is_event_day,
        LAG(m.close_price, 1) OVER (ORDER BY m.date) as prev_close
    FROM market_data_eod m
    CROSS JOIN event_data e
    WHERE 
        m.valoren = e.valoren
        AND m.date >= e.ex_dividend_date - INTERVAL 30 DAY
        AND m.date <= e.ex_dividend_date + INTERVAL 30 DAY
    ORDER BY m.date
)
SELECT 
    date,
    close_price,
    volume,
    is_event_day,
    CASE 
        WHEN prev_close > 0 THEN ((close_price - prev_close) / prev_close) * 100
        ELSE 0
    END as return_percent
FROM price_data
ORDER BY date;
```

### 5. Volume Spike Detection

```sql
WITH avg_volume AS (
    SELECT 
        valoren,
        avg(volume) as avg_vol,
        stddevPop(volume) as stddev_vol
    FROM market_data_eod
    WHERE 
        valoren = '3481'
        AND date >= '2024-04-01'
        AND date <= '2024-06-30'
    GROUP BY valoren
),
daily_volume AS (
    SELECT 
        m.date,
        m.valoren,
        m.volume,
        a.avg_vol,
        a.stddev_vol
    FROM market_data_eod m
    JOIN avg_volume a ON m.valoren = a.valoren
    WHERE 
        m.valoren = '3481'
        AND m.date >= '2024-04-28'
        AND m.date <= '2024-06-27'
)
SELECT 
    date,
    volume,
    avg_vol,
    ((volume - avg_vol) / avg_vol) * 100 as volume_change_percent,
    CASE 
        WHEN volume > (avg_vol + 2 * stddev_vol) THEN 'High Spike'
        WHEN volume > (avg_vol + stddev_vol) THEN 'Moderate Spike'
        ELSE 'Normal'
    END as volume_category
FROM daily_volume
ORDER BY date;
```

## Next.js API Route Integration

### Example API Route: `/api/corp-actions`

```typescript
// app/api/corp-actions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@clickhouse/client';

const client = createClient({
  host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'default',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get('dateFrom') || '2023-01-01';
    const dateTo = searchParams.get('dateTo') || '2025-12-31';
    const instruments = searchParams.get('instruments')?.split(',') || [];
    const actionTypes = searchParams.get('actionTypes')?.split(',').map(Number) || [];

    let query = `
      SELECT 
        event_id,
        valoren,
        instrument_name,
        isin,
        action_type,
        action_type_label,
        ex_dividend_date,
        announcement_date,
        payment_date,
        amount,
        currency,
        status
      FROM corp_actions
      WHERE ex_dividend_date >= '${dateFrom}'
        AND ex_dividend_date <= '${dateTo}'
    `;

    if (instruments.length > 0) {
      query += ` AND valoren IN (${instruments.map(i => `'${i}'`).join(',')})`;
    }

    if (actionTypes.length > 0) {
      query += ` AND action_type IN (${actionTypes.join(',')})`;
    }

    query += ` ORDER BY ex_dividend_date DESC LIMIT 1000`;

    const result = await client.query({
      query,
      format: 'JSONEachRow',
    });

    const data = await result.json();

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching corporate actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corporate actions' },
      { status: 500 }
    );
  }
}
```

### Example API Route: `/api/corp-actions/[id]/price-impact`

```typescript
// app/api/corp-actions/[id]/price-impact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@clickhouse/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = createClient({
    host: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
  });

  try {
    // First, get the corporate action details
    const actionQuery = `
      SELECT valoren, ex_dividend_date, amount
      FROM corp_actions
      WHERE event_id = '${params.id}'
    `;

    const actionResult = await client.query({
      query: actionQuery,
      format: 'JSONEachRow',
    });

    const action = (await actionResult.json())[0];

    if (!action) {
      return NextResponse.json(
        { error: 'Corporate action not found' },
        { status: 404 }
      );
    }

    // Get price data around the event
    const priceQuery = `
      WITH price_data AS (
        SELECT 
          date,
          close_price,
          volume,
          LAG(close_price, 1) OVER (ORDER BY date) as prev_close
        FROM market_data_eod
        WHERE 
          valoren = '${action.valoren}'
          AND date >= '${action.ex_dividend_date}' - INTERVAL 30 DAY
          AND date <= '${action.ex_dividend_date}' + INTERVAL 30 DAY
        ORDER BY date
      )
      SELECT 
        date,
        close_price,
        volume,
        date = '${action.ex_dividend_date}' as is_event_day,
        CASE 
          WHEN prev_close > 0 THEN ((close_price - prev_close) / prev_close) * 100
          ELSE 0
        END as return_percent
      FROM price_data
      ORDER BY date
    `;

    const priceResult = await client.query({
      query: priceQuery,
      format: 'JSONEachRow',
    });

    const priceData = await priceResult.json();

    return NextResponse.json({
      action,
      priceData,
    });
  } catch (error) {
    console.error('Error fetching price impact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price impact data' },
      { status: 500 }
    );
  }
}
```

## Environment Variables

Add to `.env.local`:

```env
CLICKHOUSE_HOST=http://localhost:8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DATABASE=default
```

## Required NPM Package

```bash
npm install @clickhouse/client
```

## Data Refresh Schedule

Recommend setting up scheduled tasks:

1. **Corporate Actions**: Daily import from CSV files
2. **EOD Market Data**: Daily after market close
3. **Data Retention**: Keep 5+ years of historical data

## Performance Optimization

### Indexes

```sql
-- Add materialized views for common queries
CREATE MATERIALIZED VIEW corp_actions_monthly
ENGINE = SummaryMergeTree()
ORDER BY (valoren, month)
AS SELECT
    valoren,
    toStartOfMonth(ex_dividend_date) as month,
    count() as event_count,
    sum(amount) as total_amount,
    countIf(action_type = 230) as dividend_count
FROM corp_actions
GROUP BY valoren, month;
```

### Query Optimization

- Use `PREWHERE` for early filtering
- Partition by month for time-based queries
- Use materialized views for aggregate queries
- Enable query caching for frequently accessed data

## Testing

Mock data is currently used in the frontend. To switch to ClickHouse:

1. Set up ClickHouse database
2. Load sample data using queries above
3. Create API routes as shown
4. Update frontend components to fetch from API instead of mock data

## Troubleshooting

Common issues:

1. **Connection Error**: Check `CLICKHOUSE_HOST` and firewall settings
2. **Empty Results**: Verify data loaded correctly with `SELECT count() FROM corp_actions`
3. **Date Format Issues**: Use `parseDateTimeBestEffort()` for flexible date parsing
4. **Performance**: Check query execution plan with `EXPLAIN` statement
