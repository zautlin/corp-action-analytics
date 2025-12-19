# Trading Analytics Dashboard - Deployment & Startup Guide

## Quick Start

The fastest way to get the Trading Analytics Dashboard up and running:

```bash
cd /Users/agautam/workspace/python/trading-analytics-app

# Option 1: Start with mock data
./scripts/startup.sh --load-data

# Option 2: Start without loading data (faster if data already loaded)
./scripts/startup.sh
```

Both options will:
1. ✅ Start ClickHouse database
2. ✅ Initialize database schema
3. ✅ Load mock data (option 1 only)
4. ✅ Start Next.js dashboard
5. ✅ Display service URLs and API endpoints

Once started, visit: **http://localhost:3000**

---

## Scripts Overview

### 1. `startup.sh` - Main Startup Script
**Location**: `/Users/agautam/workspace/python/trading-analytics-app/scripts/startup.sh`

**Purpose**: Orchestrates the complete startup process for the entire application stack.

**Features**:
- Verifies ClickHouse installation
- Creates required directories
- Copies configuration if needed
- Starts ClickHouse server
- Initializes database schema
- Optionally loads mock data
- Starts Next.js dashboard
- Displays service information

**Usage**:
```bash
# Start without loading data
./scripts/startup.sh

# Start and load mock data
./scripts/startup.sh --load-data
```

**Output**:
```
✅ Trading Analytics Dashboard is running!

Services:
  • ClickHouse:  http://localhost:8123
  • Dashboard:   http://localhost:3000
  • Instruments: http://localhost:3000/instruments

API Endpoints:
  • GET /api/instruments?page=1&pageSize=5
  • GET /api/corp-actions
  • GET /api/eod-data?valoren=1234567&dateFrom=2024-12-01&dateTo=2024-12-31
  • GET /api/cache?action=stats

To stop the services:
  pkill -P $$ clickhouse nextjs node
```

---

### 2. `setup-schema.sh` - Database Schema Setup
**Location**: `/Users/agautam/workspace/python/trading-analytics-app/scripts/setup-schema.sh`

**Purpose**: Creates the ClickHouse database and all required tables.

**Features**:
- Verifies ClickHouse connectivity
- Creates `trading_analytics` database
- Creates all required tables from SQL schema
- Verifies schema setup
- Displays created tables

**Usage**:
```bash
# Manually run schema setup
./scripts/setup-schema.sh
```

**What It Creates**:
- ✅ **instruments** - Stock/ETF metadata (8 records)
- ✅ **eod_prices** - Daily OHLCV price data (1,216 records)
- ✅ **corporate_actions** - Dividends, splits, etc. (11 records)
- ✅ **daily_metrics** - Pre-aggregated analytics view
- ✅ **load_statistics** - Data load tracking
- ✅ **Views** - Analytical views (momentum, volume, timeline)

**Called By**: `startup.sh` automatically

---

### 3. `clickhouse-config.xml` - ClickHouse Configuration
**Location**: `/Users/agautam/workspace/python/trading-analytics-app/scripts/clickhouse-config.xml`

**Purpose**: ClickHouse server configuration template.

**Key Settings**:
```xml
<path>/Users/agautam/.clickhouse-local/data/</path>
<tmp_path>/Users/agautam/.clickhouse-local/tmp/</tmp_path>
<http_port>8123</http_port>
<tcp_port>9000</tcp_port>
```

**Deployment**:
- Automatically copied to `~/.clickhouse-local/config.xml` by `startup.sh`
- Can be manually edited after deployment
- Custom values require editing both source and destination files

---

## Directory Structure

### Project Structure
```
/Users/agautam/workspace/python/trading-analytics-app/
├── scripts/
│   ├── startup.sh                   # Main startup orchestrator
│   ├── setup-schema.sh              # Database schema setup
│   ├── clickhouse-config.xml        # ClickHouse config template
│   ├── load_clickhouse_data.py      # Mock data loader
│   └── clickhouse_schema.sql        # SQL schema definition
│
├── dashboard/                       # Next.js application
│   ├── app/
│   │   ├── api/
│   │   │   ├── instruments/route.ts
│   │   │   ├── corp-actions/route.ts
│   │   │   ├── eod-data/route.ts
│   │   │   └── cache/route.ts
│   │   └── [pages]
│   │
│   └── scripts/
│       ├── load_clickhouse_data.py
│       └── clickhouse_schema.sql
│
└── ~/.clickhouse-local/             # ClickHouse system directory
    ├── config.xml                   # Runtime config (copied from scripts/)
    ├── data/                        # Table data directory
    ├── tmp/                         # Temporary directory
    └── logs/                        # Log files
```

### Important Notes
- **Project root data**: Clean (ClickHouse files only in `~/.clickhouse-local/`)
- **Git safety**: All runtime directories in `.gitignore`
- **No production secrets**: Config uses defaults, update for production

---

## Detailed Startup Sequence

### Step 1: Validation (startup.sh)
```
✓ Check ClickHouse installed
✓ Create ~/.clickhouse-local directories
✓ Copy config.xml if missing
```

### Step 2: Start ClickHouse
```
✓ Stop any existing ClickHouse processes
✓ Start ClickHouse server
✓ Wait 5 seconds for startup
✓ Verify connectivity (curl test)
```

### Step 3: Initialize Database (setup-schema.sh)
```
✓ Verify ClickHouse accessible
✓ Create trading_analytics database
✓ Create instruments table
✓ Create eod_prices table
✓ Create corporate_actions table
✓ Create analytical views
✓ Verify all tables exist
```

### Step 4: Load Data (optional, startup.sh)
```
✓ Run Python data loader if --load-data flag provided
✓ Display data statistics
```

### Step 5: Start Dashboard (startup.sh)
```
✓ Change to dashboard directory
✓ Run npm run start
✓ Display service information
```

---

## Configuration

### Environment Variables

**Dashboard** (`.env.local`):
```bash
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_DATABASE=trading_analytics
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
USE_MOCK_DATA=false
```

### ClickHouse Connection Details

**HTTP Interface** (for direct queries):
```
URL: http://localhost:8123
Database: trading_analytics
User: default
Password: (empty)
```

**Example Query**:
```bash
curl -X POST "http://localhost:8123/" \
  -d "SELECT COUNT(*) FROM trading_analytics.instruments"
# Returns: 8
```

---

## Common Operations

### Check ClickHouse Status
```bash
curl http://127.0.0.1:8123/ -d "SELECT 1"
# Returns: 1
```

### View Database Stats
```bash
curl http://127.0.0.1:8123/ \
  -d "SELECT name, rows FROM system.tables WHERE database='trading_analytics' FORMAT TabSeparated"
```

### View Data Statistics
```bash
cd dashboard
python3 scripts/load_clickhouse_data.py stats
```

### Stop Services
```bash
# Stop all services started by startup.sh
pkill -9 clickhouse
pkill -9 node

# Or stop specific PIDs from startup.sh
kill $CLICKHOUSE_PID $NEXTJS_PID
```

### Reload Mock Data
```bash
cd dashboard
python3 scripts/load_clickhouse_data.py load --all
```

---

## Troubleshooting

### ClickHouse Won't Start
```bash
# Check if already running
ps aux | grep clickhouse

# Kill existing process
pkill -9 clickhouse

# Check config file
cat ~/.clickhouse-local/config.xml

# Try starting manually with verbose output
clickhouse server --config-file=~/.clickhouse-local/config.xml
```

### Database Connection Failed
```bash
# Verify ClickHouse is running
curl http://127.0.0.1:8123/ -d "SELECT 1"

# Check database exists
curl http://127.0.0.1:8123/ -d "SHOW DATABASES"

# Check tables exist
curl http://127.0.0.1:8123/ -d "SHOW TABLES FROM trading_analytics"
```

### API Returns No Data
```bash
# Check data loaded
curl http://127.0.0.1:8123/ \
  -d "SELECT COUNT(*) FROM trading_analytics.instruments"

# Reload if empty
cd dashboard
python3 scripts/load_clickhouse_data.py load --all
```

### Scripts Won't Execute
```bash
# Make executable
chmod +x ./scripts/startup.sh
chmod +x ./scripts/setup-schema.sh

# Verify permissions
ls -la ./scripts/*.sh
```

---

## Production Deployment

### Before Deploying to Production

1. **Update Paths**
   - Change home directory paths in scripts
   - Update ClickHouse config XML paths
   - Set environment variables

2. **Security**
   - Set ClickHouse user password
   - Restrict network access (`listen_host`)
   - Use SSL/TLS for HTTP connections
   - Add API authentication

3. **Performance**
   - Tune ClickHouse memory limits
   - Configure replication (if needed)
   - Set up backup procedures
   - Enable compression

4. **Data Management**
   - Replace mock data with real data source
   - Set up data refresh schedule
   - Configure retention policies
   - Add data validation checks

5. **Monitoring**
   - Add health checks
   - Set up log aggregation
   - Configure alerts
   - Monitor query performance

6. **Docker Deployment**
   - Create Dockerfile
   - Mount volumes for persistent data
   - Use docker-compose for orchestration
   - Configure health checks

### Example Production startup.sh
```bash
#!/bin/bash
# Production startup with environment variables

export CLICKHOUSE_HOST=clickhouse.example.com
export CLICKHOUSE_PORT=8123
export CLICKHOUSE_DATABASE=trading_analytics
export CLICKHOUSE_USER=analytics
export CLICKHOUSE_PASSWORD=$CLICKHOUSE_PASSWORD

# Start with real data
./scripts/setup-schema.sh
python3 scripts/load_real_data.py  # Custom real data loader

# Start with PM2 for process management
pm2 start "npm run start" --name "dashboard"
```

---

## Manual Startup (Without Scripts)

If you prefer to start services manually:

### 1. Start ClickHouse
```bash
mkdir -p ~/.clickhouse-local/{data,tmp,logs}
clickhouse server --config-file=~/.clickhouse-local/config.xml &
sleep 5
```

### 2. Initialize Schema
```bash
curl -X POST http://127.0.0.1:8123/ \
  -d "CREATE DATABASE IF NOT EXISTS trading_analytics"

# Then run all CREATE TABLE statements from clickhouse_schema.sql
```

### 3. Load Data
```bash
cd dashboard
python3 scripts/load_clickhouse_data.py load --all
```

### 4. Start Dashboard
```bash
cd dashboard
npm run build
npm run start
```

### 5. Access Services
```
Dashboard: http://localhost:3000
ClickHouse: http://localhost:8123
```

---

## File Reference

| File | Purpose | Location |
|------|---------|----------|
| startup.sh | Main startup orchestrator | `scripts/startup.sh` |
| setup-schema.sh | Database schema setup | `scripts/setup-schema.sh` |
| clickhouse-config.xml | ClickHouse config template | `scripts/clickhouse-config.xml` |
| clickhouse_schema.sql | Database schema definition | `dashboard/scripts/clickhouse_schema.sql` |
| load_clickhouse_data.py | Mock data generator | `dashboard/scripts/load_clickhouse_data.py` |

---

## Support & Documentation

For more information:
- Dashboard README: `/Users/agautam/workspace/python/trading-analytics-app/dashboard/README.md`
- ClickHouse Docs: https://clickhouse.com/docs/
- Next.js Docs: https://nextjs.org/docs/

---

**Last Updated**: December 20, 2024
**Version**: 2.0 - Production Ready
