# Data Marketplace API Specification

## Overview

This document outlines all backend API endpoints required for the Data Marketplace platform. The APIs support dataset management, user authentication, access requests, analytics, and administrative functions.

## Base URL

\`\`\`
https://api.datamarketplace.com/v1
\`\`\`

## Authentication

All API requests require authentication using JWT tokens in the Authorization header:

\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## API Endpoints

### 1. Authentication & Users

#### POST /auth/login
Login with email and password.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "John Smith",
    "email": "user@example.com",
    "role": "consumer" | "steward" | "admin",
    "ownedDatasets": ["dataset-1", "dataset-2"]
  }
}
\`\`\`

#### GET /auth/me
Get current user profile.

**Response:**
\`\`\`json
{
  "id": "user-123",
  "name": "John Smith",
  "email": "user@example.com",
  "role": "consumer" | "steward" | "admin",
  "ownedDatasets": ["dataset-1", "dataset-2"],
  "status": "active" | "inactive",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastActive": "2025-01-07T10:30:00Z"
}
\`\`\`

#### PUT /auth/profile
Update user profile.

**Request:**
\`\`\`json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
\`\`\`

### 2. Datasets

#### GET /datasets
List all datasets with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `assetClass` (string): Filter by asset class
- `provider` (string): Filter by provider
- `geography` (string): Filter by geography
- `licensing` (string): Filter by licensing type
- `search` (string): Search query
- `hasAccess` (boolean): Filter by user access

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "dataset-1",
      "name": "Bloomberg Real-Time Equity Prices",
      "provider": "Bloomberg L.P.",
      "assetClass": "Equities",
      "geography": "North America",
      "qualityScore": 9.2,
      "description": "Real-time market data for US equities...",
      "licensingType": "Per-User License",
      "tags": ["High-Frequency", "Real-Time", "Level 2"],
      "updateFrequency": "Real-time",
      "hasAccess": true,
      "owner": "user-456",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2025-01-07T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
\`\`\`

#### GET /datasets/:id
Get detailed information about a specific dataset.

**Response:**
\`\`\`json
{
  "id": "dataset-1",
  "name": "Bloomberg Real-Time Equity Prices",
  "provider": "Bloomberg L.P.",
  "assetClass": "Equities",
  "geography": "North America",
  "qualityScore": 9.2,
  "description": "Real-time market data for US equities including prices, volumes, and order book depth...",
  "detailedDescription": "Bloomberg Real-Time Equity Prices provides high-quality, real-time pricing data...",
  "keyFeatures": [
    "Real-time streaming data with sub-millisecond latency",
    "Coverage of 50M+ equity instruments across 150+ exchanges globally"
  ],
  "useCases": ["Algorithmic Trading", "Portfolio Management", "Risk Analytics"],
  "licensingType": "Per-User License",
  "tags": ["High-Frequency", "Real-Time", "Level 2"],
  "updateFrequency": "Real-time",
  "hasAccess": true,
  "owner": "user-456",
  "schema": {
    "columns": [
      {
        "name": "ticker",
        "type": "string",
        "description": "Stock ticker symbol",
        "nullable": false
      },
      {
        "name": "price",
        "type": "decimal",
        "description": "Current price",
        "nullable": false
      }
    ]
  },
  "qualityMetrics": {
    "completeness": 99.8,
    "accuracy": 99.9,
    "timeliness": 99.7,
    "consistency": 99.5
  },
  "sampleData": [
    {
      "ticker": "AAPL",
      "price": 178.25,
      "volume": 52341234,
      "timestamp": "2025-01-07T15:30:00Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2025-01-07T10:30:00Z"
}
\`\`\`

#### POST /datasets
Create a new dataset (Admin/Steward only).

**Request:**
\`\`\`json
{
  "name": "New Dataset Name",
  "provider": "Provider Name",
  "assetClass": "Equities",
  "geography": "Global",
  "description": "Dataset description",
  "detailedDescription": "Detailed description...",
  "keyFeatures": ["Feature 1", "Feature 2"],
  "useCases": ["Use Case 1", "Use Case 2"],
  "licensingType": "Commercial",
  "tags": ["tag1", "tag2"],
  "updateFrequency": "Daily",
  "qualityScore": 8.5
}
\`\`\`

#### PUT /datasets/:id
Update dataset information (Admin or dataset owner only).

**Request:** Same as POST /datasets

#### DELETE /datasets/:id
Delete a dataset (Admin only).

#### GET /datasets/:id/lineage
Get data lineage information for a dataset.

**Response:**
\`\`\`json
{
  "nodes": [
    {
      "id": "node-1",
      "name": "bloomberg_equity_prices",
      "type": "source" | "transformation" | "target",
      "schema": "public",
      "columns": 45,
      "description": "Raw equity price data from Bloomberg"
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "label": "ETL Process"
    }
  ]
}
\`\`\`

#### POST /datasets/:id/search
Search within dataset content (e.g., search for specific instrument codes).

**Request:**
\`\`\`json
{
  "column": "ticker",
  "query": "AAPL",
  "limit": 100
}
\`\`\`

**Response:**
\`\`\`json
{
  "results": [
    {
      "ticker": "AAPL",
      "price": 178.25,
      "volume": 52341234,
      "timestamp": "2025-01-07T15:30:00Z"
    }
  ],
  "total": 1,
  "executionTime": "0.125s"
}
\`\`\`

### 3. Access Requests

#### GET /requests
Get all access requests (filtered by user role).

**Query Parameters:**
- `status` (string): Filter by status (pending, approved, rejected)
- `datasetId` (string): Filter by dataset

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "REQ-2025-8472",
      "datasetId": "dataset-1",
      "dataset": "Bloomberg Real-Time Equity Prices",
      "provider": "Bloomberg L.P.",
      "userId": "user-123",
      "userName": "John Smith",
      "status": "pending" | "approved" | "rejected",
      "useCase": "Algorithmic Trading",
      "justification": "Need real-time equity data for our high-frequency trading algorithms...",
      "requestDate": "2025-01-05T10:00:00Z",
      "reviewDate": "2025-01-06T14:30:00Z",
      "reviewer": "Sarah Chen",
      "reviewerId": "user-456",
      "rejectionReason": "Insufficient business justification..."
    }
  ]
}
\`\`\`

#### POST /requests
Submit a new access request.

**Request:**
\`\`\`json
{
  "datasetId": "dataset-1",
  "useCase": "Algorithmic Trading",
  "justification": "Need real-time equity data for our high-frequency trading algorithms. Will be used to generate trading signals and execute automated trades across global markets."
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "REQ-2025-8472",
  "status": "pending",
  "requestDate": "2025-01-07T10:30:00Z"
}
\`\`\`

#### PUT /requests/:id/approve
Approve an access request (Steward/Admin only).

**Request:**
\`\`\`json
{
  "accessDuration": 90,
  "notes": "Approved for 90 days"
}
\`\`\`

#### PUT /requests/:id/reject
Reject an access request (Steward/Admin only).

**Request:**
\`\`\`json
{
  "reason": "Insufficient business justification. Please provide more details on specific use case and expected ROI."
}
\`\`\`

### 4. Notifications

#### GET /notifications
Get user notifications.

**Query Parameters:**
- `unreadOnly` (boolean): Only return unread notifications

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "notif-1",
      "type": "approval" | "request" | "rejection",
      "title": "Access Approved",
      "message": "Your access request for US Equity Market Data has been approved",
      "timestamp": "2025-01-07T10:30:00Z",
      "read": false,
      "datasetName": "US Equity Market Data",
      "datasetId": "dataset-1",
      "requestId": "REQ-2025-8472"
    }
  ],
  "unreadCount": 3
}
\`\`\`

#### PUT /notifications/:id/read
Mark a notification as read.

#### PUT /notifications/read-all
Mark all notifications as read.

### 5. Analytics

#### GET /analytics/overview
Get analytics overview (role-based access).

**Query Parameters:**
- `period` (string): Time period (7d, 30d, 90d, 12m)
- `datasetId` (string): Filter by dataset (for stewards)

**Response:**
\`\`\`json
{
  "totalQueries": 2829,
  "dataVolume": "5.4 TB",
  "activeDatasets": 4,
  "avgQueryTime": "1.2s",
  "queryVolumeData": [
    {
      "month": "Jan",
      "queries": 2829
    }
  ],
  "dataVolumeData": [
    {
      "month": "Jan",
      "volume": 5.4
    }
  ],
  "topDatasets": [
    {
      "name": "Bloomberg Real-Time Equity Prices",
      "queries": 1247,
      "change": 12.5,
      "trend": "up"
    }
  ],
  "usageByAssetClass": [
    {
      "assetClass": "Equities",
      "queries": 1580,
      "percentage": 55.9
    }
  ]
}
\`\`\`

#### GET /analytics/datasets/:id
Get analytics for a specific dataset.

**Response:**
\`\`\`json
{
  "datasetId": "dataset-1",
  "queries": 1247,
  "dataVolume": "2.3 TB",
  "uniqueUsers": 45,
  "avgQueryTime": "0.8s",
  "queryTrend": [
    {
      "date": "2025-01-01",
      "queries": 42
    }
  ],
  "topUsers": [
    {
      "userId": "user-123",
      "name": "John Smith",
      "queries": 156
    }
  ]
}
\`\`\`

### 6. Discussions

#### GET /datasets/:id/discussions
Get discussions for a dataset.

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "comment-1",
      "author": "Michael Rodriguez",
      "authorId": "user-123",
      "role": "Quantitative Analyst",
      "content": "This dataset has been incredibly valuable for our high-frequency trading strategies...",
      "timestamp": "2025-01-07T08:30:00Z",
      "likes": 5,
      "isAdmin": false
    }
  ]
}
\`\`\`

#### POST /datasets/:id/discussions
Post a new comment.

**Request:**
\`\`\`json
{
  "content": "This dataset has been incredibly valuable..."
}
\`\`\`

#### DELETE /datasets/:id/discussions/:commentId
Delete a comment (Admin only).

#### POST /datasets/:id/discussions/:commentId/like
Like a comment.

#### POST /datasets/:id/discussions/:commentId/report
Report a comment.

### 7. AI Features

#### POST /ai/search
Get AI-generated search response.

**Request:**
\`\`\`json
{
  "query": "real-time equity data for algorithmic trading"
}
\`\`\`

**Response:**
\`\`\`json
{
  "summary": "Based on your search for real-time equity data, I found 3 highly relevant datasets...",
  "relevantDatasets": ["dataset-1", "dataset-2", "dataset-3"],
  "suggestions": ["Consider Bloomberg Real-Time Equity Prices for sub-millisecond latency"]
}
\`\`\`

#### POST /ai/dataset-summary
Get AI-generated dataset summary.

**Request:**
\`\`\`json
{
  "datasetId": "dataset-1"
}
\`\`\`

**Response:**
\`\`\`json
{
  "summary": "This dataset provides institutional-grade real-time equity pricing across global markets...",
  "keyInsights": [
    "Best suited for high-frequency trading",
    "Quality score of 9.2/10 reflects Bloomberg's direct exchange connectivity"
  ]
}
\`\`\`

#### POST /ai/chat
Chat with AI about a dataset.

**Request:**
\`\`\`json
{
  "datasetId": "dataset-1",
  "message": "What is the latency for this dataset?",
  "conversationHistory": [
    {
      "role": "user" | "assistant",
      "content": "Previous message..."
    }
  ]
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "The Bloomberg Real-Time Equity Prices dataset has sub-millisecond latency...",
  "sources": ["dataset metadata", "quality metrics"]
}
\`\`\`

### 8. Admin APIs

#### GET /admin/users
Get all users (Admin only).

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "user-123",
      "name": "Sarah Chen",
      "email": "sarah.chen@hedgefund.com",
      "role": "Portfolio Manager",
      "group": "Data Consumer" | "Data Steward" | "Administrator",
      "status": "active" | "inactive",
      "datasets": 12,
      "lastActive": "2025-01-07T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### PUT /admin/users/:id
Update user information (Admin only).

**Request:**
\`\`\`json
{
  "name": "Sarah Chen",
  "email": "sarah.chen@hedgefund.com",
  "group": "Data Steward",
  "status": "active"
}
\`\`\`

#### GET /admin/groups
Get all user groups (Admin only).

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "group-1",
      "name": "Data Consumer",
      "description": "General users with read access",
      "members": 45,
      "permissions": ["read_datasets", "request_access"]
    }
  ]
}
\`\`\`

#### GET /admin/feature-flags
Get all feature flags (Admin only).

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "flag-1",
      "name": "Lineage Visualization",
      "description": "Show data lineage diagrams on dataset detail pages",
      "enabled": true,
      "scope": "global" | "specific",
      "datasets": ["dataset-1", "dataset-2"]
    }
  ]
}
\`\`\`

#### PUT /admin/feature-flags/:id
Update feature flag (Admin only).

**Request:**
\`\`\`json
{
  "enabled": true,
  "scope": "specific",
  "datasets": ["dataset-1", "dataset-2"]
}
\`\`\`

#### GET /admin/catalog-filters
Get catalog filter configuration (Admin only).

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "filter-1",
      "name": "Asset Class",
      "enabled": true,
      "order": 1,
      "options": ["Equities", "Fixed Income", "FX", "Commodities"]
    }
  ]
}
\`\`\`

#### PUT /admin/catalog-filters/:id
Update catalog filter (Admin only).

**Request:**
\`\`\`json
{
  "name": "Asset Class",
  "enabled": true,
  "order": 1,
  "options": ["Equities", "Fixed Income", "FX", "Commodities", "Crypto"]
}
\`\`\`

#### GET /admin/settings
Get platform settings (Admin only).

**Response:**
\`\`\`json
{
  "autoApproveRequests": false,
  "emailNotifications": true,
  "publicDiscussions": true,
  "aiFeatures": true,
  "defaultAccessDuration": 90
}
\`\`\`

#### PUT /admin/settings
Update platform settings (Admin only).

**Request:** Same as GET response

### 9. Export & Code Generation

#### POST /datasets/:id/export/csv
Export dataset sample as CSV.

**Response:** CSV file download

#### POST /datasets/:id/export/documentation
Export dataset documentation as Markdown.

**Response:** Markdown file download

#### POST /datasets/:id/export/notebook
Generate Python notebook for dataset access.

**Response:** Jupyter notebook (.ipynb) file download

## Error Responses

All API errors follow this format:

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
\`\`\`

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication required or invalid token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `CONFLICT` (409): Resource conflict (e.g., duplicate entry)
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API requests are rate-limited:
- Standard users: 1000 requests/hour
- Stewards: 5000 requests/hour
- Admins: 10000 requests/hour

Rate limit headers are included in all responses:
\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704636000
