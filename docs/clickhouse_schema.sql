-- ============================================================================
-- ClickHouse Database Schema for Corporate Actions Dashboard
-- ============================================================================

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS corp_actions_dev.eod_adjusted;
DROP TABLE IF EXISTS corp_actions_dev.eod_raw;
DROP TABLE IF EXISTS corp_actions_dev.adjustment_events;
DROP TABLE IF EXISTS corp_actions_dev.corp_actions;

-- Create database
CREATE DATABASE IF NOT EXISTS corp_actions_dev;

-- ============================================================================
-- 1. CORPORATE ACTIONS TABLE
-- ============================================================================

CREATE TABLE corp_actions_dev.corp_actions (
    event_id String,
    valoren String,
    instrument_name String,
    isin String,
    action_type UInt16,  -- 230=Dividend, 237=Stock Dist, 238=Bonus, 440=Split, 451=Rights, 461=Merger
    action_type_label String,
    announcement_date Date,
    ex_dividend_date Date,
    payment_date Date,
    amount Decimal(18, 4),
    currency String,
    status String,  -- Pending, Complete, Incomplete
    created_at DateTime DEFAULT now(),
    updated_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
ORDER BY (valoren, ex_dividend_date)
PARTITION BY toYYYYMM(ex_dividend_date);

-- Indexes for faster queries
ALTER TABLE corp_actions_dev.corp_actions ADD INDEX idx_action_type action_type TYPE minmax GRANULARITY 4;
ALTER TABLE corp_actions_dev.corp_actions ADD INDEX idx_status status TYPE set(0) GRANULARITY 4;

-- ============================================================================
-- 2. RAW EOD DATA TABLE (unadjusted prices)
-- ============================================================================

CREATE TABLE corp_actions_dev.eod_raw (
    trade_date Date,
    exchange String,
    valoren String,
    open_price Decimal(18, 4),
    high_price Decimal(18, 4),
    low_price Decimal(18, 4),
    close_price Decimal(18, 4),
    volume UInt64,
    turnover Decimal(18, 2),
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
ORDER BY (valoren, trade_date)
PARTITION BY toYYYYMM(trade_date);

-- Indexes
ALTER TABLE corp_actions_dev.eod_raw ADD INDEX idx_exchange exchange TYPE set(0) GRANULARITY 4;

-- ============================================================================
-- 3. ADJUSTED EOD DATA TABLE (adjusted for corporate actions)
-- ============================================================================

CREATE TABLE corp_actions_dev.eod_adjusted (
    trade_date Date,
    exchange String,
    valoren String,
    open_price Decimal(18, 4),
    high_price Decimal(18, 4),
    low_price Decimal(18, 4),
    close_price Decimal(18, 4),
    volume UInt64,
    turnover Decimal(18, 2),
    adjustment_factor Decimal(18, 8),  -- Cumulative adjustment factor
    is_adjusted UInt8,  -- 0=no adjustment, 1=adjusted
    applied_events Array(String),  -- List of event_ids that affected this record
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
ORDER BY (valoren, trade_date)
PARTITION BY toYYYYMM(trade_date);

-- ============================================================================
-- 4. ADJUSTMENT EVENTS TABLE (tracks all adjustments)
-- ============================================================================

CREATE TABLE corp_actions_dev.adjustment_events (
    adjustment_id UUID DEFAULT generateUUIDv4(),
    event_id String,
    valoren String,
    adjustment_date Date,
    action_type UInt16,
    adjustment_factor Decimal(18, 8),
    description String,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
ORDER BY (valoren, adjustment_date);

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert sample corporate actions
INSERT INTO corp_actions_dev.corp_actions VALUES
('549609016', '3481', 'Viscofan S.A.', 'ES0184262212', 230, 'Cash Dividend', '2024-04-19', '2024-05-28', '2024-06-24', 1.596, 'EUR', 'Complete', now(), now()),
('574632986', '3481', 'Viscofan S.A.', 'ES0184262212', 230, 'Cash Dividend', '2024-10-23', '2024-11-22', '2024-12-19', 1.437, 'EUR', 'Complete', now(), now()),
('538692632', '8690', 'Stora Enso Oyj', 'FI0009005953', 230, 'Cash Dividend', '2024-03-21', '2024-03-21', '2024-04-04', 0.1, 'EUR', 'Complete', now(), now()),
('549607556', '3481', 'Viscofan S.A.', 'ES0684262910', 451, 'Rights Issue', '2024-04-19', '2024-05-28', '2024-06-24', 1.596, 'EUR', 'Incomplete', now(), now()),
('602252630', '3481', 'Viscofan S.A.', 'ES0684262936', 230, 'Cash Dividend', '2025-04-29', '2025-05-15', '2025-06-11', 1.688, 'EUR', 'Pending', now(), now());

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Query 1: Get all events for a specific instrument
-- SELECT * FROM corp_actions_dev.corp_actions WHERE valoren = '3481' ORDER BY ex_dividend_date;

-- Query 2: Get raw vs adjusted prices for a date range
-- SELECT r.trade_date, r.close_price as raw_close, a.close_price as adjusted_close, a.adjustment_factor
-- FROM corp_actions_dev.eod_raw r
-- JOIN corp_actions_dev.eod_adjusted a ON r.valoren = a.valoren AND r.trade_date = a.trade_date
-- WHERE r.valoren = '3481' AND r.trade_date BETWEEN '2024-05-01' AND '2024-06-30';

-- Query 3: Get price impact around ex-dividend date
-- SELECT 
--     trade_date,
--     close_price,
--     close_price - lag(close_price) OVER (PARTITION BY valoren ORDER BY trade_date) as price_change,
--     volume
-- FROM corp_actions_dev.eod_adjusted
-- WHERE valoren = '3481' 
--   AND trade_date BETWEEN '2024-05-18' AND '2024-06-07'
-- ORDER BY trade_date;

-- Query 4: Get all adjustments applied to an instrument
-- SELECT * FROM corp_actions_dev.adjustment_events WHERE valoren = '3481' ORDER BY adjustment_date;

-- Query 5: Calculate abnormal returns (simplified)
-- WITH stock_returns AS (
--     SELECT 
--         valoren,
--         trade_date,
--         (close_price - lag(close_price) OVER w) / lag(close_price) OVER w * 100 as return
--     FROM corp_actions_dev.eod_adjusted
--     WHERE valoren = '3481'
--     WINDOW w AS (PARTITION BY valoren ORDER BY trade_date)
-- )
-- SELECT * FROM stock_returns WHERE trade_date >= '2024-05-18';

-- ============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- ============================================================================

-- Daily price change view
CREATE MATERIALIZED VIEW IF NOT EXISTS corp_actions_dev.daily_returns_mv
ENGINE = MergeTree()
ORDER BY (valoren, trade_date)
AS SELECT
    valoren,
    trade_date,
    close_price,
    close_price - lagInFrame(close_price) OVER (PARTITION BY valoren ORDER BY trade_date) as price_change,
    (close_price - lagInFrame(close_price) OVER (PARTITION BY valoren ORDER BY trade_date)) / 
        lagInFrame(close_price) OVER (PARTITION BY valoren ORDER BY trade_date) * 100 as return_percent,
    volume
FROM corp_actions_dev.eod_adjusted;

-- Event statistics view
CREATE MATERIALIZED VIEW IF NOT EXISTS corp_actions_dev.event_stats_mv
ENGINE = AggregatingMergeTree()
ORDER BY valoren
AS SELECT
    valoren,
    instrument_name,
    action_type,
    count() as event_count,
    sum(amount) as total_amount,
    min(ex_dividend_date) as first_event,
    max(ex_dividend_date) as last_event
FROM corp_actions_dev.corp_actions
GROUP BY valoren, instrument_name, action_type;

-- ============================================================================
-- BACKUP AND MAINTENANCE
-- ============================================================================

-- Optimize tables (run periodically)
-- OPTIMIZE TABLE corp_actions_dev.corp_actions FINAL;
-- OPTIMIZE TABLE corp_actions_dev.eod_raw FINAL;
-- OPTIMIZE TABLE corp_actions_dev.eod_adjusted FINAL;

-- Check table sizes
-- SELECT 
--     table,
--     formatReadableSize(sum(bytes)) as size,
--     sum(rows) as rows
-- FROM system.parts
-- WHERE database = 'corp_actions_dev' AND active
-- GROUP BY table;
