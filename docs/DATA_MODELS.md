# Data Models

## User

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
  role: "consumer" | "steward" | "admin"
  group: "Data Consumer" | "Data Steward" | "Administrator"
  status: "active" | "inactive"
  ownedDatasets: string[] // Dataset IDs owned by steward
  createdAt: string // ISO 8601 timestamp
  lastActive: string // ISO 8601 timestamp
}
\`\`\`

## Dataset

\`\`\`typescript
interface Dataset {
  id: string
  name: string
  provider: string
  assetClass: string
  geography: string
  qualityScore: number // 0-10
  description: string
  detailedDescription: string
  keyFeatures: string[]
  useCases: string[]
  licensingType: string
  tags: string[]
  updateFrequency: string
  hasAccess: boolean // User-specific
  owner: string // User ID of dataset owner (steward)
  schema: DatasetSchema
  qualityMetrics: QualityMetrics
  sampleData: Record<string, any>[]
  createdAt: string
  updatedAt: string
}
\`\`\`

## Dataset Schema

\`\`\`typescript
interface DatasetSchema {
  columns: SchemaColumn[]
}

interface SchemaColumn {
  name: string
  type: "string" | "number" | "decimal" | "boolean" | "date" | "timestamp"
  description: string
  nullable: boolean
  primaryKey?: boolean
  foreignKey?: {
    table: string
    column: string
  }
}
\`\`\`

## Quality Metrics

\`\`\`typescript
interface QualityMetrics {
  completeness: number // 0-100
  accuracy: number // 0-100
  timeliness: number // 0-100
  consistency: number // 0-100
}
\`\`\`

## Access Request

\`\`\`typescript
interface AccessRequest {
  id: string // Format: REQ-YYYY-NNNN
  datasetId: string
  dataset: string // Dataset name
  provider: string
  userId: string
  userName: string
  status: "pending" | "approved" | "rejected"
  useCase: string
  justification: string
  requestDate: string // ISO 8601 timestamp
  reviewDate: string | null // ISO 8601 timestamp
  reviewer: string | null // Reviewer name
  reviewerId: string | null // Reviewer user ID
  rejectionReason: string | null
}
\`\`\`

## Notification

\`\`\`typescript
interface Notification {
  id: string
  userId: string
  type: "approval" | "request" | "rejection"
  title: string
  message: string
  timestamp: string // ISO 8601 timestamp
  read: boolean
  datasetName?: string
  datasetId?: string
  requestId?: string
}
\`\`\`

## Discussion Comment

\`\`\`typescript
interface Comment {
  id: string
  datasetId: string
  author: string
  authorId: string
  role: string
  content: string
  timestamp: string // ISO 8601 timestamp
  likes: number
  isAdmin: boolean
}
\`\`\`

## Data Lineage

\`\`\`typescript
interface LineageGraph {
  nodes: LineageNode[]
  edges: LineageEdge[]
}

interface LineageNode {
  id: string
  name: string
  type: "source" | "transformation" | "target"
  schema: string
  columns: number
  description: string
}

interface LineageEdge {
  id: string
  source: string // Node ID
  target: string // Node ID
  label: string
}
\`\`\`

## Feature Flag

\`\`\`typescript
interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  scope: "global" | "specific"
  datasets: string[] // Dataset IDs (only for specific scope)
}
\`\`\`

## Catalog Filter

\`\`\`typescript
interface CatalogFilter {
  id: string
  name: string
  enabled: boolean
  order: number
  options: string[]
}
\`\`\`

## Analytics Data

\`\`\`typescript
interface AnalyticsOverview {
  totalQueries: number
  dataVolume: string
  activeDatasets: number
  avgQueryTime: string
  queryVolumeData: TimeSeriesData[]
  dataVolumeData: TimeSeriesData[]
  topDatasets: TopDataset[]
  usageByAssetClass: UsageByCategory[]
}

interface TimeSeriesData {
  month: string
  queries?: number
  volume?: number
}

interface TopDataset {
  name: string
  queries: number
  change: number // Percentage
  trend: "up" | "down"
}

interface UsageByCategory {
  assetClass: string
  queries: number
  percentage: number
}
\`\`\`

## Group

\`\`\`typescript
interface Group {
  id: string
  name: "Data Consumer" | "Data Steward" | "Administrator"
  description: string
  members: number
  permissions: string[]
}
\`\`\`

## Platform Settings

\`\`\`typescript
interface PlatformSettings {
  autoApproveRequests: boolean
  emailNotifications: boolean
  publicDiscussions: boolean
  aiFeatures: boolean
  defaultAccessDuration: number // Days
}
