# API Documentation

## Overview
The Corporate Actions Dashboard provides RESTful API endpoints for accessing corporate actions data, EOD price data, and calculating quantitative signals.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently no authentication required (TODO: Add authentication for production)

---

## Endpoints

### 1. Corporate Actions

**GET** `/api/corp-actions`

Fetch corporate actions with optional filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `valoren` | string | No | Filter by instrument valoren |
| `actionType` | number | No | Filter by action type (230, 237, 238, 440, 451, 461) |
| `dateFrom` | string | No | Filter by ex-dividend date (YYYY-MM-DD) |
| `dateTo` | string | No | Filter by ex-dividend date (YYYY-MM-DD) |
| `status` | string | No | Filter by status |

#### Example Request
```bash
curl "http://localhost:3000/api/corp-actions?valoren=503&actionType=230&dateFrom=2024-01-01&dateTo=2024-12-31"
```

#### Example Response
```json
{
  "success": true,
  "data": [
    {
      "eventId": "...",
      "valoren": "503",
      "instrumentName": "Viscofan SA",
      "isin": "ES0184262212",
      "actionType": 230,
      "actionTypeLabel": "Cash Dividend",
      "announcementDate": "2024-03-15",
      "exDividendDate": "2024-04-10",
      "paymentDate": "2024-04-17",
      "amount": 2.50,
      "currency": "EUR",
      "status": "confirmed"
    }
  ],
  "count": 1,
  "filters": { ... }
}
```

---

### 2. EOD Data

**GET** `/api/eod-data`

Fetch end-of-day price data from sicam_eod table.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `valoren` | string | Yes | Instrument valoren |
| `dateFrom` | string | Conditional | Start date (YYYY-MM-DD) - required if not using eventDate |
| `dateTo` | string | Conditional | End date (YYYY-MM-DD) - required if not using eventDate |
| `eventDate` | string | Conditional | Event date for ±N days query |
| `daysAround` | number | No | Days around event (default: 30) |

#### Example Request (Date Range)
```bash
curl "http://localhost:3000/api/eod-data?valoren=503&dateFrom=2024-01-01&dateTo=2024-12-31"
```

#### Example Request (Around Event)
```bash
curl "http://localhost:3000/api/eod-data?valoren=503&eventDate=2024-04-10&daysAround=10"
```

#### Example Response
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-04-01",
      "ticker": "VIS",
      "valoren": "503",
      "openPrice": 65.20,
      "highPrice": 66.50,
      "lowPrice": 65.00,
      "closePrice": 66.00,
      "volume": 125000,
      "turnover": 8250000
    }
  ],
  "count": 10,
  "params": { ... }
}
```

---

### 3. Instruments

**GET** `/api/instruments`

Fetch instrument master data from sicam_master table.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `valoren` | string | No | Specific instrument valoren |

#### Example Request (All Instruments)
```bash
curl "http://localhost:3000/api/instruments"
```

#### Example Request (Specific Instrument)
```bash
curl "http://localhost:3000/api/instruments?valoren=503"
```

#### Example Response
```json
{
  "success": true,
  "data": [
    {
      "valoren": "503",
      "ticker": "VIS",
      "instrument_name": "Viscofan SA",
      "isin": "ES0184262212",
      "exchange": "SIX",
      "sector": "Consumer Goods",
      "currency": "EUR"
    }
  ],
  "count": 1
}
```

---

### 4. Signals

**POST** `/api/signals`

Calculate quantitative signals for a corporate action event.

#### Request Body
```json
{
  "valoren": "503",
  "eventDate": "2024-04-10",
  "actionType": 230
}
```

#### Example Request
```bash
curl -X POST "http://localhost:3000/api/signals" \
  -H "Content-Type: application/json" \
  -d '{"valoren":"503","eventDate":"2024-04-10","actionType":230}'
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "valoren": "503",
    "eventDate": "2024-04-10",
    "actionType": 230,
    "signals": {
      "momentum1M": {
        "value": 0.05,
        "score": 1,
        "description": "Positive momentum"
      },
      "momentum3M": { ... },
      "momentum6M": { ... },
      "announcementDrift": { ... },
      "zScoreReversal": { ... },
      "meanReversion5D": { ... },
      "meanReversion10D": { ... },
      "impliedVolatilitySpike": { ... },
      "volumeSurprise": { ... },
      "turnoverAcceleration": { ... },
      "postSplitMomentum": null
    },
    "compositeScore": 0.65,
    "percentileRank": 0.75,
    "dataPoints": 180,
    "eventIndex": 90
  }
}
```

**GET** `/api/signals`

Fetch pre-calculated signals (not yet implemented).

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error (database/server error)

---

## Signal Descriptions

### Momentum Signals
- **momentum1M**: 1-month price momentum before event
- **momentum3M**: 3-month price momentum before event
- **momentum6M**: 6-month price momentum before event
- **announcementDrift**: Price drift from announcement to ex-date

### Mean Reversion Signals
- **zScoreReversal**: Z-score based mean reversion signal
- **meanReversion5D**: 5-day mean reversion signal
- **meanReversion10D**: 10-day mean reversion signal

### Volatility Signals
- **impliedVolatilitySpike**: Volatility increase detection
- **volumeSurprise**: Abnormal volume detection
- **turnoverAcceleration**: Turnover rate increase

### Event-Specific Signals
- **postSplitMomentum**: Post-split price momentum (Type 440 only)

### Signal Scores
- `+1`: Bullish signal
- `0`: Neutral signal
- `-1`: Bearish signal

---

## Database Tables

### corp_actions
Corporate actions events data
- `valoren`: Instrument identifier
- `action_type`: Event type (230, 237, 238, 440, 451, 461)
- `ex_dividend_date`: Ex-dividend date
- `amount`: Dividend/split amount
- And more...

### sicam_eod
End-of-day price data
- `valoren`: Instrument identifier
- `trade_date`: Trading date
- `open`, `high`, `low`, `close`: OHLC prices
- `volume`: Trading volume

### sicam_master
Instrument reference data
- `valoren`: Instrument identifier
- `ticker`: Trading symbol
- `instrument_name`: Full name
- `isin`: ISIN code
- And more...

---

## Rate Limits
Currently no rate limits (TODO: Add rate limiting for production)

## Support
For issues or questions, please contact the development team.
