# Components Documentation

This directory contains all React components for the Data Marketplace UI.

## Mock Data Reference

Each component uses mock data that should be replaced with API calls. Below is a reference of mock data used in each component:

### catalog-grid.tsx
**Mock Data:** Array of 9 datasets
**API Endpoint:** `GET /datasets`
**Data Model:** `Dataset[]`

### requests-content.tsx
**Mock Data:** Array of 4 access requests
**API Endpoint:** `GET /requests`
**Data Model:** `AccessRequest[]`

### notification-dropdown.tsx
**Mock Data:** Array of 4 notifications
**API Endpoint:** `GET /notifications`
**Data Model:** `Notification[]`

### my-datasets-content.tsx
**Mock Data:** 
- Array of 4 user datasets
- Array of 4 recent activity items
**API Endpoints:** 
- `GET /datasets?hasAccess=true`
- `GET /analytics/activity`

### admin-content.tsx
**Mock Data:**
- Array of 3 datasets
- Array of 3 users
- Array of 3 groups
- Array of 5 feature flags
- Array of 5 catalog filters
**API Endpoints:**
- `GET /admin/datasets`
- `GET /admin/users`
- `GET /admin/groups`
- `GET /admin/feature-flags`
- `GET /admin/catalog-filters`

### dataset-discussion.tsx
**Mock Data:** Array of 3 comments
**API Endpoint:** `GET /datasets/:id/discussions`
**Data Model:** `Comment[]`

### analytics-content.tsx
**Mock Data:**
- Query volume trend (7 months)
- Data volume trend (7 months)
- Top 4 datasets
- Usage by 4 asset classes
- Peak usage hours (5 periods)
- Export activity (4 formats)
- User activity (4 users)
**API Endpoint:** `GET /analytics/overview`

### dataset-lineage.tsx
**Mock Data:**
- Array of 5 nodes (source, transformation, target)
- Array of 4 edges
**API Endpoint:** `GET /datasets/:id/lineage`
**Data Model:** `LineageGraph`

### ai-summary.tsx
**Mock Data:** Initial AI-generated summary message
**API Endpoints:**
- `POST /ai/dataset-summary` (initial summary)
- `POST /ai/chat` (follow-up questions)

### catalog-search.tsx
**Mock Data:** AI-generated search response
**API Endpoint:** `POST /ai/search`

## Integration Notes

1. Replace all mock data arrays with API calls using fetch or your preferred HTTP client
2. Add loading states while fetching data
3. Add error handling for failed API requests
4. Implement pagination for large datasets
5. Add optimistic updates for user actions (likes, comments, etc.)
6. Implement real-time updates for notifications using WebSockets or polling
