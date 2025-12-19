#!/bin/bash
#
# Trading Analytics Dashboard - Startup Script
# Starts ClickHouse and the Next.js dashboard
#

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
DASHBOARD_DIR="$PROJECT_ROOT/dashboard"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Trading Analytics Dashboard...${NC}"

# Check if ClickHouse is installed
if ! command -v clickhouse &> /dev/null; then
    echo -e "${RED}❌ ClickHouse is not installed${NC}"
    echo "Install ClickHouse: brew install clickhouse"
    exit 1
fi

# Create ClickHouse directories if they don't exist
mkdir -p "$HOME/.clickhouse-local"/{data,tmp,logs}

# Copy ClickHouse config if it doesn't exist
if [ ! -f "$HOME/.clickhouse-local/config.xml" ]; then
    echo -e "${YELLOW}📝 Creating ClickHouse configuration...${NC}"
    cp "$SCRIPT_DIR/clickhouse-config.xml" "$HOME/.clickhouse-local/config.xml"
fi

# Stop any existing ClickHouse processes
echo -e "${YELLOW}🛑 Stopping any existing ClickHouse instances...${NC}"
pkill -9 clickhouse 2>/dev/null || true
sleep 2

# Start ClickHouse
echo -e "${YELLOW}▶️  Starting ClickHouse...${NC}"
CLICKHOUSE_CONFIG="$HOME/.clickhouse-local/config.xml"
/opt/homebrew/bin/clickhouse server --config-file="$CLICKHOUSE_CONFIG" &
CLICKHOUSE_PID=$!
sleep 5

# Check if ClickHouse started
if ! curl -s "http://127.0.0.1:8123/" -d "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}❌ ClickHouse failed to start${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ClickHouse running (PID: $CLICKHOUSE_PID)${NC}"

# Create database and tables if they don't exist
echo -e "${YELLOW}📊 Initializing database...${NC}"
curl -s -X POST "http://127.0.0.1:8123/" -d "CREATE DATABASE IF NOT EXISTS trading_analytics" > /dev/null

# Create tables
"$SCRIPT_DIR/setup-schema.sh" > /dev/null 2>&1 || true

# Load data if needed
if [ "$1" = "--load-data" ]; then
    echo -e "${YELLOW}📥 Loading mock data into ClickHouse...${NC}"
    cd "$DASHBOARD_DIR"
    python3 scripts/load_clickhouse_data.py load --all
fi

# Show data statistics
echo -e "${YELLOW}📈 Data Statistics:${NC}"
cd "$DASHBOARD_DIR"
python3 scripts/load_clickhouse_data.py stats

# Start Next.js dashboard
echo -e "${YELLOW}▶️  Starting Next.js dashboard...${NC}"
cd "$DASHBOARD_DIR"
npm run start &
NEXTJS_PID=$!

sleep 3

echo ""
echo -e "${GREEN}✅ Trading Analytics Dashboard is running!${NC}"
echo ""
echo -e "${YELLOW}Services:${NC}"
echo "  • ClickHouse:  http://localhost:8123"
echo "  • Dashboard:   http://localhost:3000"
echo "  • Instruments: http://localhost:3000/instruments"
echo ""
echo -e "${YELLOW}API Endpoints:${NC}"
echo "  • GET /api/instruments?page=1&pageSize=5"
echo "  • GET /api/corp-actions"
echo "  • GET /api/eod-data?valoren=1234567&dateFrom=2024-12-01&dateTo=2024-12-31"
echo "  • GET /api/cache?action=stats"
echo ""
echo -e "${YELLOW}To stop the services:${NC}"
echo "  pkill -P $$ clickhouse nextjs node"
echo ""
