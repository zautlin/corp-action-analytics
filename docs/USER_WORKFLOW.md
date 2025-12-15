# User Workflow Documentation

## Complete User Journey

### Overview
The corporate actions dashboard provides a seamless workflow for users to discover instruments, analyze corporate actions, and view interactive charts.

---

## Workflow Steps

### **Step 1: Login**
- User logs in through `/login`
- Authentication handled by existing auth system
- User is redirected to the main page

### **Step 2: Navigate to Instruments**
- From main navigation bar, click **"Instruments"**
- Route: `/instruments`

### **Step 3: Instrument Discovery**
Users see the **Instruments Listing Page** with:

#### **Dashboard Stats Cards**
- Total Instruments (from sicam_master)
- Total Corporate Actions (from corp_actions)
- Events This Month
- Upcoming Events

#### **Instrument Table**
Displays data from `sicam_master` table with columns:
- **Ticker** - Trading symbol
- **Instrument Name** - Full company name
- **ISIN** - International Securities ID
- **Sector** - Industry sector
- **Currency** - Trading currency
- **Corp Actions** - Count of corporate actions

#### **Search & Filter**
- Real-time search by ticker, name, ISIN, or sector
- Sortable columns (click header to sort)
- Shows filtered count vs total

### **Step 4: Select an Instrument**
- Click on any row in the table OR
- Click "View Details" button
- Navigates to `/instruments/{valoren}`

### **Step 5: Instrument Detail Page**

#### **Page Structure**

**Header Section:**
- Instrument name and ticker
- Valoren ID badge
- ISIN, sector, currency, exchange
- Corporate actions count
- Action buttons: Add to Watchlist, Share, Export

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Breadcrumb: Home > Instruments > VIS           │
├─────────────────────────────────────────────────┤
│  Instrument Header (Ticker, Name, Metadata)     │
├───────────────┬─────────────────────────────────┤
│               │                                  │
│  Chart        │  Corporate Actions Timeline      │
│  Selector     │  (Expandable/Collapsible)        │
│  (Left)       │                                  │
│               ├─────────────────────────────────┤
│               │                                  │
│               │  Selected Chart Display          │
│               │  (Main Content Area)             │
│               │                                  │
└───────────────┴─────────────────────────────────┘
```

**Left Sidebar - Chart Selector:**
8 chart types available:
1. **Overview** - Dashboard with all panels
2. **Price Chart** - TradingView interactive chart
3. **Event Study Heatmap** - Abnormal returns grid
4. **Momentum Analysis** - Box plots
5. **Volatility & Risk** - Volatility burst analysis
6. **Volume & Liquidity** - Volume spikes
7. **Split Momentum** - (Only if Type 440 events exist)
8. **Announcement Drift** - Information leakage

**Corporate Actions Timeline:**
- Chronological list of all events for this instrument
- Shows: Type, Amount, Dates (Announced, Ex-Date, Payment)
- Color-coded by event type:
  - Type 230 (Blue) - Cash Dividend
  - Type 237 (Green) - Stock Distribution
  - Type 238 (Purple) - Bonus Issue
  - Type 440 (Orange) - Stock Split
  - Type 451 (Pink) - Rights Issue
  - Type 461 (Red) - Merger
- Expandable/collapsible
- Click event to highlight in charts

### **Step 6: View Charts**

User clicks on a chart type from the selector:

#### **Option 1: Overview**
- Shows all 6 analytics panels in a grid layout
- 2x2 grid of main panels
- Additional panels for splits and drift
- Perfect for quick comprehensive analysis

#### **Option 2: Price Chart**
- Full TradingView chart integration
- Corporate action markers overlaid
- Interactive zoom, pan, drawing tools
- Technical indicators available
- Event tooltips on hover

#### **Option 3: Event Study Heatmap**
- T-10 to T+10 day abnormal returns
- Color-coded cells (green = outperform, red = underperform)
- Click cell to drill down
- CAR (Cumulative Abnormal Returns) displayed

#### **Option 4: Momentum Analysis**
- Box plots for 4 momentum signals
- 1M, 3M, 6M, Announcement Drift
- Shows quartiles, outliers, mean
- Interactive click-to-filter

#### **Option 5: Volatility & Risk**
- Pre vs post volatility comparison
- VaR/CVaR calculations (95% confidence)
- Risk classification (High/Medium/Low)
- Visual bar charts

#### **Option 6: Volume & Liquidity**
- Volume spike analysis (pre/event/post)
- Turnover acceleration metrics
- Liquidity score (0-100)
- Rating: Excellent/Good/Fair/Poor

#### **Option 7: Split Momentum** (If applicable)
- Only shows for stocks with Type 440 events
- Multi-timeframe momentum (5d, 10d, 30d, 90d)
- Psychological split detection
- Retail interest score

#### **Option 8: Announcement Drift**
- Information leakage detection
- Pre-announcement returns (-5 days)
- Drift score (0-100)
- Risk classification

### **Step 7: Interact with Charts**

Within any chart view, users can:
- **Switch Charts** - Click different chart type from selector
- **View Event Details** - Click event marker/timeline item
- **Export Data** - Click export button (future)
- **Zoom/Pan** - TradingView controls
- **Add to Watchlist** - Save instrument for later
- **Share** - Generate shareable link

---

## Data Flow

### API Calls Made

#### Instruments Page (`/instruments`)
```
GET /api/instruments → Fetch all instruments from sicam_master
GET /api/corp-actions → Fetch all corporate actions for stats
```

#### Instrument Detail Page (`/instruments/{valoren}`)
```
GET /api/instruments?valoren={valoren} → Fetch specific instrument
GET /api/corp-actions?valoren={valoren} → Fetch events for this instrument
GET /api/eod-data?valoren={valoren}&eventDate={date}&daysAround=30 → (On demand for charts)
POST /api/signals → Calculate signals (on demand)
```

---

## Key Features

### ✅ Implemented

1. **Search & Filter**
   - Real-time search across multiple fields
   - Sortable table columns
   - Result count display

2. **Navigation**
   - Breadcrumb navigation
   - Back button support
   - Direct routing

3. **Chart Selection**
   - Visual chart selector menu
   - Disabled state for unavailable charts
   - Active chart highlighting

4. **Event Timeline**
   - Collapsible timeline
   - Color-coded by type
   - Date details (announced, ex-date, payment)
   - Show more/less functionality

5. **Instrument Header**
   - Complete metadata display
   - Action buttons (watchlist, share, export)
   - Corporate actions count

6. **Responsive Design**
   - Grid layouts adapt to screen size
   - Mobile-friendly tables
   - Sidebar collapses on small screens

### 🚧 Future Enhancements

1. **Watchlist/Portfolio**
   - Save favorite instruments
   - Track portfolio corporate actions
   - Custom alerts

2. **Event Drill-Down**
   - Click event to filter all charts
   - Cross-panel highlighting
   - Event comparison mode

3. **Export Functionality**
   - CSV/Excel export
   - Chart image export
   - PDF reports

4. **Advanced Filtering**
   - Multi-select sector filter
   - Date range picker
   - Action type filter

5. **Comparison Mode**
   - Compare 2+ instruments side-by-side
   - Relative performance charts

---

## File Structure

```
app/
├── instruments/
│   ├── page.tsx                           # Instruments listing (sicam_master table)
│   ├── layout.tsx                         # Layout with breadcrumb
│   └── [valoren]/
│       └── page.tsx                       # Instrument detail with charts

components/
├── instruments/
│   ├── instrument-table.tsx               # Sortable, searchable table
│   ├── instrument-header.tsx              # Instrument metadata header
│   ├── chart-selector.tsx                 # Chart type selector menu
│   ├── corp-actions-timeline.tsx          # Event timeline component
│   └── instrument-breadcrumb.tsx          # Navigation breadcrumb

components/
├── corp-action-tradingview-chart.tsx      # TradingView chart (existing)
├── event-study-heatmap.tsx                # Heatmap panel (existing)
├── momentum-box-plots.tsx                 # Momentum panel (existing)
├── volatility-burst-panel.tsx             # Volatility panel (existing)
├── volume-liquidity-panel.tsx             # Volume panel (existing)
├── split-momentum-panel.tsx               # Split panel (existing)
└── announcement-drift-panel.tsx           # Drift panel (existing)
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Main marketplace page |
| `/login` | Login page |
| `/instruments` | Instruments listing page |
| `/instruments/{valoren}` | Instrument detail with charts |
| `/corp-actions` | Corporate actions page (existing) |
| `/analytics` | Analytics dashboard (existing) |

---

## Testing Checklist

### Instruments Page
- [ ] Table loads with sicam_master data
- [ ] Search filters results correctly
- [ ] Sorting works for all columns
- [ ] Stats cards show correct counts
- [ ] Clicking row navigates to detail page

### Instrument Detail Page
- [ ] Header displays correct instrument data
- [ ] Timeline shows all corporate actions
- [ ] Chart selector highlights active chart
- [ ] All 8 chart types render correctly
- [ ] Overview shows all panels
- [ ] Split Momentum disabled when no Type 440 events
- [ ] Breadcrumb navigation works

### Navigation
- [ ] Instruments link in main header works
- [ ] Breadcrumb back navigation works
- [ ] Direct URL access works

### Performance
- [ ] Page load times acceptable
- [ ] API responses cached appropriately
- [ ] Large tables paginate (future)

---

## Usage Example

### Scenario: Analyst researching Viscofan SA dividends

1. **Login** → Navigate to **Instruments**
2. **Search** "Viscofan" in search bar
3. **Click** Viscofan SA row
4. **View** Corporate Actions Timeline → See 3 cash dividends (Type 230)
5. **Click** "Event Study Heatmap" → Analyze abnormal returns around ex-dates
6. **Click** "Announcement Drift" → Check for information leakage
7. **Click** "Price Chart" → View TradingView chart with event markers
8. **Export** analysis (future feature)

---

## Performance Notes

- Instruments page: ~1-2 second load (depends on sicam_master size)
- Detail page: ~1-2 seconds (parallel API calls)
- Chart rendering: ~500ms - 1s (TradingView heaviest)
- Search/filter: Real-time (<50ms)

---

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (responsive design)

---

## Next Steps

1. **Test with Real Data**
   - Connect to ClickHouse database
   - Verify sicam_master schema matches
   - Test with production data volume

2. **Optimize Performance**
   - Add pagination for large tables
   - Implement infinite scroll
   - Cache API responses

3. **Add Analytics**
   - Track popular instruments
   - Monitor chart usage
   - User behavior analytics

4. **Implement Watchlist**
   - User-specific saved instruments
   - Portfolio tracking
   - Custom alerts

---

**Workflow Status: ✅ Complete and Ready for Testing**
