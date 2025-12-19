#!/bin/bash
#
# Trading Analytics Dashboard - Schema Setup Script
# Creates the ClickHouse database and all tables
#

CLICKHOUSE_HOST=${CLICKHOUSE_HOST:-localhost}
CLICKHOUSE_PORT=${CLICKHOUSE_PORT:-8123}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DASHBOARD_DIR="$( cd "$SCRIPT_DIR/../dashboard" && pwd )"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if ClickHouse is accessible
if ! curl -s "http://$CLICKHOUSE_HOST:$CLICKHOUSE_PORT/" -d "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}❌ ClickHouse is not accessible at http://$CLICKHOUSE_HOST:$CLICKHOUSE_PORT${NC}"
    exit 1
fi

echo -e "${YELLOW}🗂️  Setting up ClickHouse schema...${NC}"

# Create database
curl -s -X POST "http://$CLICKHOUSE_HOST:$CLICKHOUSE_PORT/" \
    -d "CREATE DATABASE IF NOT EXISTS trading_analytics" > /dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database created${NC}"

# Create tables from SQL schema file
if [ -f "$DASHBOARD_DIR/scripts/clickhouse_schema.sql" ]; then
    echo -e "${YELLOW}📋 Creating tables from schema...${NC}"
    
    # Read schema file and execute each SQL statement
    # Note: We need to handle multi-line statements
    cat "$DASHBOARD_DIR/scripts/clickhouse_schema.sql" | \
    grep -v "^--" | \
    grep -v "^$" | \
    awk 'BEGIN {stmt=""} {stmt=stmt $0 " "} /;$/ {print stmt; stmt=""}' | \
    while IFS= read -r sql; do
        if [ -n "$sql" ]; then
            curl -s -X POST "http://$CLICKHOUSE_HOST:$CLICKHOUSE_PORT/" -d "$sql" > /dev/null 2>&1
        fi
    done
    
    echo -e "${GREEN}✅ Tables created${NC}"
else
    echo -e "${RED}❌ Schema file not found: $DASHBOARD_DIR/scripts/clickhouse_schema.sql${NC}"
    exit 1
fi

# Verify tables were created
echo -e "${YELLOW}📊 Verifying schema...${NC}"
TABLES=$(curl -s "http://$CLICKHOUSE_HOST:$CLICKHOUSE_PORT/" \
    -d "SELECT name FROM system.tables WHERE database = 'trading_analytics' FORMAT TabSeparated")

TABLE_COUNT=$(echo "$TABLES" | wc -l)

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Schema verification complete${NC}"
    echo -e "${YELLOW}Tables created:${NC}"
    echo "$TABLES" | sed 's/^/  • /'
else
    echo -e "${RED}❌ Schema verification failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Schema setup complete!${NC}"
