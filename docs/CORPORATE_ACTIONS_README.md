# Corporate Actions Dashboard

## Overview

The Corporate Actions Dashboard provides comprehensive visualization and analysis of corporate action events and their impact on stock prices and trading volumes.

## Features

### ✅ **Implemented Features**

1. **Dashboard Page** (`/corp-actions`)
   - Full-featured corporate actions analytics dashboard
   - Role-based access (available to all users: Consumer, Steward, Admin)
   - Responsive layout optimized for desktop and mobile

2. **Advanced Filtering**
   - Date range selection (from/to dates)
   - Multi-select instrument filter
   - Corporate action type filter (Cash Dividend, Stock Distribution, Bonus Issue, etc.)
   - Status filter (Complete, Pending, Incomplete)
   - Real-time filter application with reset functionality

3. **Summary Analytics Cards**
   - Total Events count
   - Total Dividend Amount (aggregated)
   - Average Price Impact percentage
   - Upcoming Events counter (next 30 days)

4. **Price Impact Chart** (Lightweight Charts)
   - Interactive line chart showing price movement ±30 days around ex-dividend date
   - Visual marker on ex-dividend date
   - Percentage change calculation
   - Zoom and pan controls
   - Professional financial chart styling

5. **Volume Analysis Chart** (Lightweight Charts)
   - Histogram showing daily trading volume
   - Color-coded volume bars:
     - Blue: Normal volume
     - Orange: High volume spike (+50%)
     - Red: Ex-dividend date
   - Volume spike percentage calculation
   - Average volume comparison

6. **Calendar/Timeline View**
   - Events grouped by month
   - Detailed event cards with all information
   - Color-coded action types
   - Status badges
   - Click to view analysis

7. **Data Table View**
   - Sortable columns (date, instrument, type, amount)
   - Complete event information
   - Status badges
   - Quick view button
   - Pagination controls (UI ready)

8. **Navigation Integration**
   - Added "Corporate Actions" link in main header
   - Accessible from all pages
   - Consistent with existing UI patterns

## File Structure

```
corp_action_marketplace/
├── app/
│   └── corp-actions/
│       ├── page.tsx                          # Main dashboard page
│       └── loading.tsx                       # Loading skeleton
├── components/
│   ├── corp-action-breadcrumb.tsx           # Navigation breadcrumb
│   ├── corp-action-calendar.tsx             # Calendar/timeline view
│   ├── corp-action-filters.tsx              # Advanced filter component
│   ├── corp-action-price-chart.tsx          # Price impact chart (Lightweight)
│   ├── corp-action-summary-cards.tsx        # Analytics summary cards
│   ├── corp-action-table.tsx                # Sortable data table
│   └── corp-action-volume-chart.tsx         # Volume analysis chart (Lightweight)
├── lib/
│   └── mock-corp-actions-data.ts            # Mock data & helper functions
└── docs/
    └── CLICKHOUSE_INTEGRATION.md            # Database integration guide
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Charting**: Lightweight Charts (TradingView)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4
- **Database** (when integrated): ClickHouse

## Mock Data

Currently using realistic mock data that simulates:

- **10 corporate action events** spanning 2023-2025
- **2 instruments**: Viscofan S.A. (3481) and Stora Enso Oyj (8690)
- **Action types**: Cash Dividend (230), Rights Issue (451)
- **EOD market data**: Generated with realistic price movements and volume spikes around events

### Mock Data Features:
- Price drops ~1.5% on ex-dividend dates (dividend effect)
- Volume spikes 150% on ex-dividend dates
- Volume increases 80% on announcement dates
- Realistic OHLCV data generation
- Weekend filtering (no trading data on weekends)

## Data Models

### Corporate Action
```typescript
interface CorporateAction {
  eventId: string
  identifier: string
  valoren: string
  instrumentName: string
  isin: string
  actionType: number
  actionTypeLabel: string
  exDividendDate: string
  announcementDate: string
  paymentDate: string
  amount: number
  currency: string
  status: string
}
```

### EOD Market Data
```typescript
interface EODData {
  date: string
  exchange: string
  valoren: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  turnover: number
  volume: number
}
```

## Usage

### Running the Dashboard

1. **Development Mode**:
   ```bash
   cd corp_action_marketplace
   npm run dev
   ```

2. **Navigate to**: `http://localhost:3000/corp-actions`

3. **Login** with any demo user:
   - Consumer: sarah.chen@hedgefund.com
   - Steward: michael.r@bloomberg.com
   - Admin: jennifer.park@datahex.com

### Using Filters

1. **Date Range**: Select from/to dates to filter events by ex-dividend date
2. **Instruments**: Multi-select instruments from dropdown
3. **Action Types**: Select one or more action types (Cash Dividend, Stock Split, etc.)
4. **Status**: Filter by Complete, Pending, or Incomplete
5. Click **Apply Filters** to update the dashboard
6. Click **Reset** to clear all filters

### Viewing Analysis

**Option 1 - From Table**:
1. Go to "All Events" tab
2. Click "View" button on any row
3. Switch to "Price & Volume Analysis" tab

**Option 2 - From Calendar**:
1. Go to "Calendar View" tab
2. Click on any event card
3. Automatically switches to analysis view

### Understanding Charts

**Price Chart**:
- Blue line: Daily closing price
- Red dashed line: Ex-dividend date marker
- Percentage shown: Price change on ex-div date
- Expected pattern: Price drop approximately equal to dividend amount

**Volume Chart**:
- Blue bars: Normal trading volume
- Orange bars: Volume spikes (>50% above average)
- Red bar: Ex-dividend date volume
- Percentage shown: Volume increase on ex-div date

## Integration with ClickHouse

To replace mock data with real ClickHouse data:

1. **Set up ClickHouse database** (see `docs/CLICKHOUSE_INTEGRATION.md`)
2. **Create tables** using provided SQL schemas
3. **Load data** from CSV files
4. **Create API routes** (examples provided in documentation)
5. **Update frontend components** to fetch from API
6. **Add `@clickhouse/client` package**:
   ```bash
   npm install @clickhouse/client
   ```

See `docs/CLICKHOUSE_INTEGRATION.md` for complete integration guide.

## Corporate Action Types

| Code | Label | Description |
|------|-------|-------------|
| 230 | Cash Dividend | Regular cash dividend payment to shareholders |
| 237 | Stock Distribution | Distribution of additional shares |
| 238 | Bonus Issue | Free shares issued to existing shareholders |
| 440 | Stock Split | Division of shares (e.g., 2-for-1 split) |
| 451 | Rights Issue | Offer to purchase additional shares at discount |
| 461 | Merger | Company merger or acquisition event |

## Key Metrics Explained

### Price Impact
- **Definition**: Percentage change in stock price on ex-dividend date
- **Expected**: Price typically drops by approximately the dividend amount
- **Example**: €1.50 dividend on €50 stock = ~3% price drop

### Volume Spike
- **Definition**: Percentage increase in trading volume compared to average
- **Expected**: Increased volume on announcement and ex-dividend dates
- **Thresholds**:
  - Normal: Within 1 standard deviation of average
  - Moderate: 1-2 standard deviations above average
  - High: >2 standard deviations above average

### Ex-Dividend Date
- **Definition**: First trading day when stock trades without dividend rights
- **Importance**: Price adjustment occurs on this date
- **Investor Impact**: Must own stock before this date to receive dividend

## Performance Considerations

### Current Implementation (Mock Data)
- **Load Time**: <100ms
- **Chart Rendering**: <200ms
- **Data Points**: 60 per chart (30 days before + 30 days after)
- **Memory Usage**: Minimal (mock data in-memory)

### With ClickHouse Integration
- **Recommended**: Add caching layer for frequently accessed data
- **Pagination**: Implement server-side pagination for large datasets
- **Lazy Loading**: Load charts only when tab is active
- **Query Optimization**: Use materialized views for aggregations

## Future Enhancements

### Phase 2 (Potential)
- [ ] Export functionality (CSV, PDF, Excel)
- [ ] Event comparison (compare multiple events side-by-side)
- [ ] Advanced analytics (cumulative abnormal returns, event studies)
- [ ] Email alerts for upcoming events
- [ ] Custom date ranges for charts (7 days, 60 days, 90 days)
- [ ] Statistical significance tests
- [ ] Sector comparison (compare action impact across sectors)

### Phase 3 (Advanced)
- [ ] Machine learning predictions for price impact
- [ ] Real-time WebSocket updates for live events
- [ ] Custom watchlists
- [ ] Portfolio impact calculator
- [ ] Historical trend analysis
- [ ] Regression analysis (price impact vs. dividend yield)

## Troubleshooting

### Charts Not Displaying
- Check browser console for errors
- Verify Lightweight Charts library is loaded
- Ensure `chartContainerRef.current` exists
- Check that data format matches expected structure

### Filters Not Working
- Verify date format is YYYY-MM-DD
- Check that action types are numbers (230, 237, etc.)
- Ensure instruments array has valid valoren numbers
- Check browser console for filter application errors

### Performance Issues
- Reduce number of data points per chart
- Enable React strict mode to catch performance issues
- Use React DevTools Profiler
- Check for unnecessary re-renders

## Support

For issues or questions:
1. Check `docs/CLICKHOUSE_INTEGRATION.md` for database setup
2. Review component code comments for implementation details
3. Verify mock data structure in `lib/mock-corp-actions-data.ts`
4. Check browser console for error messages

## License

This dashboard is part of the DataHex corporate actions marketplace platform.
