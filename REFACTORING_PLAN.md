# Comprehensive Code Refactoring Plan
## Trading Analytics Dashboard

**Document Version**: 1.0  
**Created**: December 19, 2025  
**Status**: Ready for Implementation

---

## Executive Summary

The current codebase has grown organically with components living in a flat structure mixed with different concerns. This refactoring plan organizes the code into meaningful feature domains and layers, making it more maintainable, testable, and scalable.

**Key Goals:**
- ✅ Reduce cognitive complexity by organizing code by domain
- ✅ Eliminate circular dependencies and improve code reusability
- ✅ Create clear separation of concerns (UI, Logic, Services, Types)
- ✅ Enable parallel development by clear feature boundaries
- ✅ Improve discoverability and reduce time to find code

**Expected Outcomes:**
- Better code organization and structure
- Easier testing and mocking
- Faster onboarding for new developers
- Reduced duplicate logic across components

---

## Current State Analysis

### Components by Size (Lines of Code)
| Component | LOC | Category |
|-----------|-----|----------|
| admin-content.tsx | 1005 | Page Content |
| candlestick-volume-chart.tsx | 559 | Chart (Complex) |
| dataset-detail-content.tsx | 547 | Page Content |
| index-performance-lightweight.tsx | 499 | Analytics |
| corp-action-tradingview-chart.tsx | 463 | Chart (Complex) |
| manage-content.tsx | 442 | Page Content |

### Lib Utilities by Size
| Utility | LOC | Purpose |
|---------|-----|---------|
| signal-library.ts | 538 | Trading Signal Calculations |
| mock-data-extended.ts | 481 | Test Data Generation |
| mock-data.ts | 465 | Test Data Generation |
| clickhouse-client.ts | 464 | Database Client |
| adjustment-system.ts | 437 | Price Adjustments |
| data-loader.ts | 275 | Data Loading Logic |

### Current Structure Problems
1. **Flat component folder** - All 60+ components in same directory
2. **Mixed responsibilities** - UI, Logic, and Business rules intertwined
3. **No clear domains** - Hard to find related components
4. **Duplicate types** - Types scattered across files
5. **Monolithic utilities** - Large lib files doing too many things
6. **No shared constants** - Magic strings/numbers throughout code
7. **Testing challenge** - Hard to test without UI layer

---

## Proposed New Structure

### Root Folder Organization

```
dashboard/
├── app/                              # Next.js App Router
│   ├── api/                         # API Routes
│   ├── [feature]/                   # Feature-specific pages
│   └── layout.tsx
├── src/                             # New source directory
│   ├── components/                  # React Components (organized by domain)
│   ├── hooks/                       # React Hooks
│   ├── lib/                         # Business Logic & Utilities
│   ├── services/                    # External Service Integration
│   ├── types/                       # TypeScript Types & Interfaces
│   ├── constants/                   # App Constants
│   ├── context/                     # React Context Providers
│   ├── providers/                   # App Providers
│   └── utils/                       # Pure Utility Functions
├── tests/                           # Test Files
├── public/                          # Static Assets
└── styles/                          # Global Styles
```

---

## Detailed Folder Structure

### 1. Components Organization (By Feature Domain)

```
src/components/
├── common/                          # Shared/Reusable Components
│   ├── breadcrumbs/
│   │   ├── admin-breadcrumb.tsx
│   │   ├── catalog-breadcrumb.tsx
│   │   ├── corp-action-breadcrumb.tsx
│   │   ├── dataset-detail-breadcrumb.tsx
│   │   ├── instrument-breadcrumb.tsx
│   │   ├── manage-breadcrumb.tsx
│   │   ├── my-datasets-breadcrumb.tsx
│   │   ├── requests-breadcrumb.tsx
│   │   └── index.ts
│   ├── headers/
│   │   ├── chart-header.tsx
│   │   ├── catalog-header.tsx
│   │   └── index.ts
│   ├── theme/
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── index.ts
│   ├── notifications/
│   │   ├── notification-dropdown.tsx
│   │   ├── toast-handler.tsx
│   │   └── index.ts
│   └── index.ts
│
├── instruments/                     # Instrument Feature Domain
│   ├── detail/
│   │   ├── instrument-detail-page.tsx
│   │   ├── instrument-header.tsx
│   │   ├── instrument-sidebar.tsx
│   │   └── index.ts
│   ├── table/
│   │   ├── instrument-table.tsx
│   │   ├── table-columns.tsx
│   │   ├── table-filters.tsx
│   │   └── index.ts
│   ├── timeline/
│   │   ├── corp-actions-timeline.tsx
│   │   ├── timeline-event.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-instrument-data.ts
│   │   ├── use-instrument-filters.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── instrument.types.ts
│   │   └── index.ts
│   └── index.ts
│
├── charts/                          # Chart Feature Domain
│   ├── candlestick/
│   │   ├── candlestick-volume-chart.tsx
│   │   ├── candlestick-chart.tsx
│   │   ├── candlestick-config.ts
│   │   ├── candlestick-utils.ts
│   │   └── index.ts
│   ├── trading/
│   │   ├── tradingview-chart.tsx
│   │   ├── klinechart.tsx
│   │   └── index.ts
│   ├── analysis/
│   │   ├── event-study-heatmap.tsx
│   │   ├── announcement-drift-panel.tsx
│   │   ├── volatility-burst-panel.tsx
│   │   ├── volume-liquidity-panel.tsx
│   │   ├── split-momentum-panel.tsx
│   │   └── index.ts
│   ├── common/
│   │   ├── chart-header.tsx
│   │   ├── chart-tools-sidebar.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-chart-data.ts
│   │   ├── use-echarts-instance.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── chart.types.ts
│   │   └── index.ts
│   └── index.ts
│
├── corporate-actions/               # Corporate Actions Feature Domain
│   ├── dashboard/
│   │   ├── corp-action-dashboard.tsx
│   │   ├── corp-action-breadcrumb.tsx
│   │   └── index.ts
│   ├── components/
│   │   ├── corp-action-buttons.tsx
│   │   ├── corp-action-table.tsx
│   │   ├── corp-action-calendar.tsx
│   │   ├── corp-action-summary-cards.tsx
│   │   ├── corp-action-timeline.tsx
│   │   └── index.ts
│   ├── analysis/
│   │   ├── corp-action-analysis-tab.tsx
│   │   ├── corp-action-price-chart.tsx
│   │   ├── corp-action-volume-chart.tsx
│   │   ├── corp-action-tradingview-chart.tsx
│   │   ├── corp-action-instruments-tab.tsx
│   │   └── index.ts
│   ├── modals/
│   │   ├── event-metrics-popup.tsx
│   │   └── index.ts
│   ├── filters/
│   │   ├── corp-action-filters.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-corp-actions.ts
│   │   ├── use-event-metrics.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── corp-action.types.ts
│   │   └── index.ts
│   └── index.ts
│
├── datasets/                        # Dataset Feature Domain
│   ├── catalog/
│   │   ├── catalog-page.tsx
│   │   ├── catalog-grid.tsx
│   │   ├── catalog-search.tsx
│   │   ├── catalog-filters.tsx
│   │   ├── catalog-header.tsx
│   │   ├── dataset-card.tsx
│   │   └── index.ts
│   ├── detail/
│   │   ├── dataset-detail-page.tsx
│   │   ├── dataset-detail-content.tsx
│   │   ├── dataset-schema.tsx
│   │   ├── dataset-sample-data.tsx
│   │   ├── dataset-quality-metrics.tsx
│   │   ├── dataset-lineage.tsx
│   │   ├── dataset-discussion.tsx
│   │   └── index.ts
│   ├── chat/
│   │   ├── dataset-chat.tsx
│   │   ├── ai-summary.tsx
│   │   └── index.ts
│   ├── modals/
│   │   ├── request-access-modal.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-dataset-detail.ts
│   │   ├── use-dataset-search.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── dataset.types.ts
│   │   └── index.ts
│   └── index.ts
│
├── admin/                           # Admin Feature Domain
│   ├── admin-page.tsx
│   ├── admin-breadcrumb.tsx
│   ├── admin-content.tsx
│   ├── tabs/
│   │   ├── admin-users-tab.tsx
│   │   ├── admin-datasets-tab.tsx
│   │   ├── admin-analytics-tab.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-admin-data.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── admin.types.ts
│   │   └── index.ts
│   └── index.ts
│
├── analytics/                       # Analytics Feature Domain
│   ├── analytics-page.tsx
│   ├── analytics-breadcrumb.tsx
│   ├── analytics-content.tsx
│   ├── panels/
│   │   ├── analysis-panels.tsx
│   │   ├── metrics-panel.tsx
│   │   ├── index-performance.tsx
│   │   ├── index-performance-lightweight.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-analytics-data.ts
│   │   └── index.ts
│   └── index.ts
│
├── manage/                          # Manage Feature Domain
│   ├── manage-page.tsx
│   ├── manage-breadcrumb.tsx
│   ├── manage-content.tsx
│   ├── hooks/
│   │   ├── use-manage-data.ts
│   │   └── index.ts
│   └── index.ts
│
├── watchlist/                       # Watchlist Feature Domain
│   ├── watchlist.tsx
│   ├── stock-details.tsx
│   ├── stock-details-card.tsx
│   ├── stock-info.tsx
│   ├── hooks/
│   │   ├── use-watchlist.ts
│   │   └── index.ts
│   └── index.ts
│
├── auth/                            # Auth Feature Domain
│   ├── login-form.tsx
│   ├── login-page.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── index.ts
│
├── requests/                        # Requests Feature Domain
│   ├── requests-page.tsx
│   ├── requests-breadcrumb.tsx
│   ├── requests-content.tsx
│   ├── hooks/
│   │   ├── use-requests.ts
│   │   └── index.ts
│   └── index.ts
│
├── my-datasets/                     # My Datasets Feature Domain
│   ├── my-datasets-page.tsx
│   ├── my-datasets-breadcrumb.tsx
│   ├── my-datasets-content.tsx
│   ├── hooks/
│   │   ├── use-my-datasets.ts
│   │   └── index.ts
│   └── index.ts
│
└── ui/                              # Shared UI Primitives (shadcn/ui)
    ├── accordion.tsx
    ├── alert-dialog.tsx
    ├── alert.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── table.tsx
    ├── tabs.tsx
    ├── ... (57 other UI components)
    └── index.ts
```

### 2. Lib Organization (Business Logic)

```
src/lib/
├── data/                            # Data Management
│   ├── loaders/
│   │   ├── eod-data-loader.ts
│   │   ├── instrument-loader.ts
│   │   ├── corp-action-loader.ts
│   │   └── index.ts
│   ├── transformers/
│   │   ├── eod-transformer.ts
│   │   ├── instrument-transformer.ts
│   │   └── index.ts
│   ├── mocks/
│   │   ├── mock-data.ts
│   │   ├── mock-data-extended.ts
│   │   ├── chart-dummy-data.ts
│   │   └── index.ts
│   └── index.ts
│
├── analysis/                        # Analysis & Calculations
│   ├── event-metrics/
│   │   ├── event-metrics-calculator.ts
│   │   ├── drift-analyzer.ts
│   │   ├── volume-analyzer.ts
│   │   ├── volatility-analyzer.ts
│   │   └── index.ts
│   ├── signals/
│   │   ├── signal-library.ts
│   │   ├── signal-generator.ts
│   │   ├── signal-detector.ts
│   │   └── index.ts
│   ├── adjustments/
│   │   ├── adjustment-system.ts
│   │   ├── price-adjuster.ts
│   │   ├── split-adjuster.ts
│   │   └── index.ts
│   └── index.ts
│
├── database/                        # Database Integration
│   ├── clients/
│   │   ├── clickhouse-client.ts
│   │   ├── clickhouse-config.ts
│   │   └── index.ts
│   ├── schemas/
│   │   ├── schema-definitions.ts
│   │   ├── schema-validator.ts
│   │   └── index.ts
│   └── index.ts
│
├── auth/                            # Authentication
│   ├── auth.ts
│   └── index.ts
│
├── utils/                           # Pure Utility Functions
│   ├── string-utils.ts
│   ├── number-utils.ts
│   ├── date-utils.ts
│   ├── array-utils.ts
│   ├── format-utils.ts
│   └── index.ts
│
└── index.ts
```

### 3. Types Organization

```
src/types/
├── index.ts                         # Main barrel export
├── common.types.ts                  # Shared types across domains
├── api.types.ts                     # API response/request types
├── entities/
│   ├── instrument.ts
│   ├── corporate-action.ts
│   ├── eod-data.ts
│   ├── dataset.ts
│   ├── user.ts
│   └── index.ts
├── domain/
│   ├── chart.ts
│   ├── analysis.ts
│   ├── events.ts
│   └── index.ts
└── errors.ts
```

### 4. Services Organization

```
src/services/
├── api/
│   ├── instrument-api.ts
│   ├── eod-data-api.ts
│   ├── corporate-action-api.ts
│   ├── dataset-api.ts
│   ├── auth-api.ts
│   └── index.ts
├── cache/
│   ├── cache-manager.ts
│   ├── redis-cache.ts
│   └── index.ts
└── index.ts
```

### 5. Hooks Organization

```
src/hooks/
├── api/
│   ├── use-instrument-data.ts
│   ├── use-eod-data.ts
│   ├── use-corporate-actions.ts
│   ├── use-datasets.ts
│   └── index.ts
├── ui/
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   ├── use-theme.ts
│   └── index.ts
├── analysis/
│   ├── use-event-metrics.ts
│   ├── use-signal-analysis.ts
│   └── index.ts
└── index.ts
```

### 6. Constants Organization

```
src/constants/
├── app.constants.ts                 # App-wide constants
├── api.constants.ts                 # API endpoints, timeouts
├── ui.constants.ts                  # UI-related constants
├── chart.constants.ts               # Chart configuration
├── date.constants.ts                # Date formats
├── error-messages.ts                # Error message strings
├── feature-flags.ts                 # Feature toggles
└── index.ts
```

### 7. Context Organization

```
src/context/
├── auth-context.tsx                 # Auth state
├── theme-context.tsx                # Theme state
├── filters-context.tsx              # Global filter state
├── notifications-context.tsx        # Toast notifications
└── index.ts
```

---

## Migration Strategy

### Phase 1: Foundation (Week 1)
**Goal**: Create new folder structure and move types

1. Create `src/` directory
2. Create base folder structure (without moving files)
3. Create `src/types/` and migrate all types
4. Create `src/constants/` and consolidate magic strings/numbers
5. **Commit**: "refactor: create source structure and consolidate types"

### Phase 2: Shared Utilities (Week 1-2)
**Goal**: Extract and organize business logic

1. Move `lib/utils.ts` → `src/lib/utils/`
2. Split large lib files:
   - `signal-library.ts` → `src/lib/analysis/signals/`
   - `adjustment-system.ts` → `src/lib/analysis/adjustments/`
   - `data-loader.ts` → `src/lib/data/loaders/`
3. Create `src/services/` and move API logic
4. Consolidate mock data in `src/lib/data/mocks/`
5. **Commit**: "refactor: reorganize lib utilities and services"

### Phase 3: Components - Common Layer (Week 2)
**Goal**: Extract reusable components

1. Create `src/components/common/` subdirectories
2. Move breadcrumbs → `src/components/common/breadcrumbs/`
3. Move headers → `src/components/common/headers/`
4. Move theme components → `src/components/common/theme/`
5. Move notifications → `src/components/common/notifications/`
6. Create index.ts barrel exports for each folder
7. **Commit**: "refactor: extract common components"

### Phase 4: Components - Feature Domains (Week 3-4)
**Goal**: Organize components by feature

1. Create feature domain folders in `src/components/`
2. **Move Instruments**: Group instrument-related components
3. **Move Charts**: Group chart-related components
4. **Move Corporate Actions**: Group corp action components
5. **Move Datasets**: Group dataset-related components
6. **Move Analytics**: Group analytics components
7. **Move Admin**: Group admin components
8. For each domain:
   - Extract feature-specific types → `{domain}/types/`
   - Extract feature-specific hooks → `{domain}/hooks/`
   - Create index.ts barrel exports
9. **Commits** (one per domain):
   - "refactor: organize instruments components"
   - "refactor: organize charts components"
   - "refactor: organize corporate-actions components"
   - "refactor: organize datasets components"
   - "refactor: organize analytics components"
   - "refactor: organize admin components"

### Phase 5: Hooks & Context (Week 4)
**Goal**: Centralize hooks and providers

1. Move existing hooks → `src/hooks/`
2. Create feature-specific hooks in domain folders
3. Create `src/context/` for global state
4. Extract context usage from components
5. **Commit**: "refactor: organize hooks and context"

### Phase 6: Import Path Updates (Week 5)
**Goal**: Update all import paths

1. Update imports across entire codebase:
   - `@/components/` → organized domain paths
   - `@/lib/` → organized lib paths
   - Create path aliases in `tsconfig.json`
2. Update relative imports to use aliases
3. Run type checking: `tsc --noEmit`
4. **Commit**: "refactor: update import paths after reorganization"

### Phase 7: Testing & QA (Week 5-6)
**Goal**: Verify everything works

1. Test all routes and features
2. Check for circular dependencies: `npx madge --circular src/`
3. Run linter: `eslint src/`
4. Fix any issues
5. Update documentation
6. **Commit**: "test: verify refactored codebase"

---

## Benefits by Stakeholder

### For Developers
- **Faster Navigation**: Know exactly where to find code by domain
- **Reduced Cognitive Load**: Related code grouped together
- **Better Code Reuse**: Clear where to extract shared logic
- **Easier Testing**: Business logic separated from UI
- **Clear Ownership**: Feature teams own their domain folder

### For New Team Members
- **Onboarding Speed**: Clear code organization reduces learning curve
- **Better Discoverability**: Intuitive folder hierarchy
- **Pattern Consistency**: Similar features organized similarly

### For Code Quality
- **Reduced Coupling**: Feature domains are loosely coupled
- **Easier Refactoring**: Can refactor within domains safely
- **Better Testing**: Pure functions separated from components
- **Scalability**: Easy to add new features without modifying existing structure

---

## Code Examples

### Before: Mixed Imports
```typescript
// admin-content.tsx - scattered imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// ... 10 more imports scattered across different folders
```

### After: Organized Imports
```typescript
// src/components/admin/admin-content.tsx - clear imports grouped by source
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Button, Badge 
} from "@/components/ui"

import { AdminUserTab, AdminDatasetTab, AdminAnalyticsTab } from "./tabs"
import { useAdminData } from "./hooks"
import type { AdminTabType } from "./types"
```

### Before: Large Files with Mixed Logic
```typescript
// candlestick-volume-chart.tsx - 559 lines
// - Chart rendering logic
// - Event metrics calculation
// - Tunnel visualization
// - Popup display logic
// - All mixed together
```

### After: Separated Concerns
```typescript
// src/components/charts/candlestick/candlestick-volume-chart.tsx
// - Only rendering logic

// src/lib/analysis/event-metrics/event-metrics-calculator.ts
// - Pure calculation functions (testable without React)

// src/components/corporate-actions/modals/event-metrics-popup.tsx
// - Popup UI logic only

// src/components/charts/candlestick/candlestick-utils.ts
// - Chart-specific utilities
```

---

## Dependency Graph After Refactoring

```
┌─────────────────────────────────────┐
│      UI Components Layer            │
│  (src/components/*/*/              │
│   Pages & Features)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Feature Domain Logic Layer        │
│  (src/components/*/hooks/,         │
│   src/components/*/types/)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Services & Utilities Layer      │
│  (src/services/,                   │
│   src/lib/analysis/,               │
│   src/lib/data/)                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   External Dependencies & APIs      │
│  (Database, HTTP, 3rd Party)       │
└─────────────────────────────────────┘

NO CIRCULAR DEPENDENCIES ✓
```

---

## Key Principles

1. **Single Responsibility**: Each folder has one reason to change
2. **Feature Cohesion**: Related code lives together
3. **Loose Coupling**: Feature domains are independent
4. **High Cohesion**: Internal domain logic is tightly related
5. **Testability**: Business logic is separated from UI
6. **Scalability**: Easy to add new features without touching existing code
7. **Clarity**: Code organization mirrors business domain

---

## Checklist for Each Domain

For each feature domain refactoring:

- [ ] Create domain folder structure
- [ ] Move components into domain
- [ ] Create domain-specific types folder
- [ ] Create domain-specific hooks folder  
- [ ] Extract shared hooks to `src/hooks/domain/`
- [ ] Create feature-specific constants
- [ ] Add index.ts barrel export
- [ ] Update all imports to use new paths
- [ ] Test feature end-to-end
- [ ] Update imports in app/ pages
- [ ] Create commit

---

## Tools to Help

### Detect Circular Dependencies
```bash
npm install --save-dev madge
npx madge --circular src/
```

### Check Import Paths
```bash
npm install --save-dev eslint-plugin-import
# Check unused imports and invalid paths
```

### TypeScript Validation
```bash
tsc --noEmit
```

### Folder Structure Generator
```bash
# Create the structure using shell
mkdir -p src/components/{common,instruments,charts,corporate-actions,datasets,admin,analytics,manage,watchlist,auth,requests,my-datasets,ui}
```

---

## FAQ

### Q: Should I move all components immediately?
**A**: No. Use a phased approach. Complete each phase before moving to the next. This reduces risk and allows for course correction.

### Q: What about the app/ folder?
**A**: Keep `app/` as-is for now. It's for Next.js routing. Components and logic move to `src/`. Update imports in pages to use the new structure.

### Q: Should I create barrel exports (index.ts)?
**A**: Yes. Barrel exports make imports cleaner and easier to refactor internal structure later without changing external imports.

### Q: How do I handle shared types?
**A**: 
- Types used in one domain → `src/components/{domain}/types/`
- Types used across domains → `src/types/domain/` or `src/types/entities/`
- Common types → `src/types/common.types.ts`

### Q: What about prop drilling?
**A**: Use React Context for global state (theme, auth, notifications). Domain-specific state can use Context or custom hooks. This will be clearer after refactoring.

### Q: Can I work on multiple domains in parallel?
**A**: Yes! Since feature domains are independent, different team members can work on different domains simultaneously. This is one of the main benefits of this organization.

---

## Next Steps

1. **Review Plan**: Share this plan with team for feedback
2. **Adjust Timeline**: Adapt based on team availability
3. **Create Tracking**: Use project board to track phase completion
4. **Start Phase 1**: Create structure and consolidate types
5. **Document Patterns**: Create examples of how to add new features
6. **Share Progress**: Regular updates on what's been refactored

---

## Rollback Plan

If issues arise:

1. All phases are atomic (one commit per logical unit)
2. Can revert specific phases with `git revert`
3. Keep `main` branch stable
4. Use feature branch: `refactor/code-organization`
5. Merge only after all phases complete and tested

---

## Success Metrics

After refactoring is complete:

- [ ] No circular dependencies detected by madge
- [ ] All TypeScript types pass without errors
- [ ] Test coverage maintained or improved
- [ ] No new console errors or warnings
- [ ] All features work identically to before
- [ ] Build size unchanged or reduced
- [ ] New features take less time to implement
- [ ] Onboarding time reduced for new developers

---

**Document prepared for implementation phase. Start with Phase 1: Foundation.**
