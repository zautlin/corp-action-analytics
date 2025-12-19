# Refactoring Quick Reference Guide

## 📋 At a Glance

**Current State**: 60+ components scattered in `components/`, large monolithic lib files
**Target State**: Organized by feature domains with clear separation of concerns
**Duration**: 5-6 weeks (7 phases)
**Risk Level**: Low (phased approach, atomic commits, easy rollback)

---

## 🎯 Phase Timeline

| Phase | Duration | What | Commits |
|-------|----------|------|---------|
| 1️⃣ Foundation | Week 1 | Create structure, consolidate types | 3 commits |
| 2️⃣ Utilities | Week 1-2 | Refactor lib/ and services | 2 commits |
| 3️⃣ Common | Week 2 | Extract shared components | 1 commit |
| 4️⃣ Domains | Week 3-4 | Organize by feature (6 domains × 1 commit) | 6 commits |
| 5️⃣ Hooks | Week 4 | Organize hooks and context | 1 commit |
| 6️⃣ Imports | Week 5 | Update all import paths | 1 commit |
| 7️⃣ Testing | Week 5-6 | QA and verification | 2 commits |

**Total**: ~16 commits, zero breaking changes

---

## 📁 Folder Creation Checklist

### Phase 1: Foundation
```bash
mkdir -p src/{components,lib,hooks,types,constants,context,services}
mkdir -p src/lib/{data,analysis,database,utils}
mkdir -p src/types/{entities,domain}
mkdir -p src/services/{api,cache}
```

### Phase 3: Common Components
```bash
mkdir -p src/components/common/{breadcrumbs,headers,theme,notifications}
mkdir -p src/components/ui
```

### Phase 4: Feature Domains
```bash
mkdir -p src/components/{instruments,charts,corporate-actions,datasets,admin,analytics,manage,watchlist,auth,requests,my-datasets}

# Each domain should have:
# {domain}/
#   ├── {subfolders}/
#   ├── hooks/
#   ├── types/
#   └── index.ts
```

---

## 🔀 File Movement Map

### Breadcrumbs (→ Common)
```
admin-breadcrumb.tsx → src/components/common/breadcrumbs/
analytics-breadcrumb.tsx → src/components/common/breadcrumbs/
catalog-breadcrumb.tsx → src/components/common/breadcrumbs/
corp-action-breadcrumb.tsx → src/components/common/breadcrumbs/
dataset-detail-breadcrumb.tsx → src/components/common/breadcrumbs/
instrument-breadcrumb.tsx → src/components/common/breadcrumbs/
manage-breadcrumb.tsx → src/components/common/breadcrumbs/
my-datasets-breadcrumb.tsx → src/components/common/breadcrumbs/
requests-breadcrumb.tsx → src/components/common/breadcrumbs/
```

### Theme (→ Common)
```
theme-provider.tsx → src/components/common/theme/
theme-toggle.tsx → src/components/common/theme/
```

### Notifications (→ Common)
```
notification-dropdown.tsx → src/components/common/notifications/
```

### Instruments (→ Feature Domain)
```
instrument-table.tsx → src/components/instruments/table/
instrument-header.tsx → src/components/instruments/detail/
corp-actions-timeline.tsx → src/components/instruments/timeline/
use-instrument-data.ts → src/components/instruments/hooks/
```

### Charts (→ Feature Domain)
```
candlestick-volume-chart.tsx → src/components/charts/candlestick/
candlestick-chart.tsx → src/components/charts/candlestick/
tradingview-chart.tsx → src/components/charts/trading/
chart-header.tsx → src/components/charts/common/
```

### Corporate Actions (→ Feature Domain)
```
corp-action-table.tsx → src/components/corporate-actions/components/
corp-action-calendar.tsx → src/components/corporate-actions/components/
corp-action-filters.tsx → src/components/corporate-actions/filters/
corp-action-tradingview-chart.tsx → src/components/corporate-actions/analysis/
event-metrics-popup.tsx → src/components/corporate-actions/modals/
corporate-actions.tsx → src/components/corporate-actions/components/
```

### Datasets (→ Feature Domain)
```
catalog-grid.tsx → src/components/datasets/catalog/
catalog-search.tsx → src/components/datasets/catalog/
dataset-card.tsx → src/components/datasets/catalog/
dataset-detail-content.tsx → src/components/datasets/detail/
dataset-schema.tsx → src/components/datasets/detail/
dataset-sample-data.tsx → src/components/datasets/detail/
dataset-quality-metrics.tsx → src/components/datasets/detail/
dataset-chat.tsx → src/components/datasets/chat/
ai-summary.tsx → src/components/datasets/chat/
request-access-modal.tsx → src/components/datasets/modals/
```

### Admin (→ Feature Domain)
```
admin-content.tsx → src/components/admin/
```

### Analytics (→ Feature Domain)
```
analytics-content.tsx → src/components/analytics/
index-performance.tsx → src/components/analytics/panels/
index-performance-lightweight.tsx → src/components/analytics/panels/
analysis-panels.tsx → src/components/analytics/panels/
metrics-panel.tsx → src/components/analytics/panels/
```

### Watchlist (→ Feature Domain)
```
watchlist.tsx → src/components/watchlist/
stock-details.tsx → src/components/watchlist/
stock-details-card.tsx → src/components/watchlist/
stock-info.tsx → src/components/watchlist/
```

### Auth (→ Feature Domain)
```
login-form.tsx → src/components/auth/
```

### Lib Files (→ Lib Structure)
```
signal-library.ts → src/lib/analysis/signals/signal-library.ts
adjustment-system.ts → src/lib/analysis/adjustments/adjustment-system.ts
data-loader.ts → src/lib/data/loaders/data-loader.ts
mock-data.ts → src/lib/data/mocks/mock-data.ts
mock-data-extended.ts → src/lib/data/mocks/mock-data-extended.ts
chart-dummy-data.ts → src/lib/data/mocks/chart-dummy-data.ts
clickhouse-client.ts → src/lib/database/clients/clickhouse-client.ts
clickhouse-config.ts → src/lib/database/clickhouse-config.ts
auth.ts → src/lib/auth/auth.ts (or context?)
utils.ts → src/lib/utils/utils.ts
types.ts → src/types/entities/ (split by type)
```

---

## 📝 Barrel Export Template

Each domain folder should have `index.ts`:

```typescript
// src/components/instruments/index.ts

// Re-export components
export { InstrumentDetailPage } from './detail'
export { InstrumentTable } from './table'
export { CorpActionsTimeline } from './timeline'

// Re-export hooks
export { useInstrumentData } from './hooks'

// Re-export types
export type { Instrument, InstrumentFilters } from './types'
```

---

## 🔍 Verification Checklist

### After Each Phase
- [ ] All files moved to new location
- [ ] Import paths updated
- [ ] No `Cannot find module` errors
- [ ] TypeScript passes: `tsc --noEmit`
- [ ] ESLint passes: `npm run lint`
- [ ] App builds: `npm run build`
- [ ] App runs: `npm run dev`
- [ ] Commit created with clear message

### After Phase 6 (Import Updates)
- [ ] Check circular dependencies: `npx madge --circular src/`
- [ ] Verify all imports use aliases
- [ ] Check for unused imports
- [ ] Document any new import patterns

### After Phase 7 (Testing)
- [ ] Test all major user flows
- [ ] Run performance audit
- [ ] Update documentation
- [ ] Create PR for review

---

## 💡 Pro Tips

### 1. Use Find & Replace for Bulk Import Updates
```
Before:  import { CandlestickChart } from '@/components/candlestick-volume-chart'
After:   import { CandlestickChart } from '@/components/charts/candlestick'

Before:  import { SignalLibrary } from '@/lib/signal-library'
After:   import { SignalLibrary } from '@/lib/analysis/signals'
```

### 2. Create Path Aliases in tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components": ["./src/components"],
      "@/lib": ["./src/lib"],
      "@/types": ["./src/types"],
      "@/hooks": ["./src/hooks"],
      "@/constants": ["./src/constants"],
      "@/context": ["./src/context"]
    }
  }
}
```

### 3. Test with Hot Reload
- Keep dev server running during refactoring
- See immediate feedback on import errors
- Fix issues one domain at a time

### 4. Parallel Work Structure
```
Team Member A: Phase 1-2 (Structure & Utilities)
Team Member B: Phase 3 (Common Components)
Team Member C: Phase 4a (Instruments & Charts)
Team Member D: Phase 4b (Corporate Actions & Datasets)
Team Member E: Phase 4c (Admin & Analytics)
```

Then merge phases sequentially to avoid conflicts.

---

## 🚀 Before You Start

### Prerequisites
- [ ] Clone latest code
- [ ] Create feature branch: `git checkout -b refactor/code-organization`
- [ ] Install dependencies: `npm install`
- [ ] Verify dev server runs: `npm run dev`
- [ ] Run tests: `npm run test`

### Backup
```bash
# Create backup of current state
git stash
git branch backup/before-refactor
git checkout -b refactor/code-organization
```

---

## 🆘 Troubleshooting

### Import Paths Break After Move
**Problem**: `Cannot find module` errors
**Solution**: 
1. Check if file moved to new location ✓
2. Update import in using files
3. Run: `tsc --noEmit` to verify
4. Clear cache: `rm -rf .next`
5. Restart dev server

### Circular Dependencies
**Problem**: `A imports B imports A`
**Solution**:
1. Run: `npx madge --circular src/` to find
2. Extract shared logic to separate file
3. Import shared file from both

### Git Conflicts During Merge
**Problem**: Two branches moved same files
**Solution**:
1. Use: `git checkout --theirs` or `--ours`
2. Update imports in merged file
3. Test thoroughly before pushing

### TypeScript Errors After Refactor
**Problem**: Type mismatches after moving files
**Solution**:
1. Run: `tsc --noEmit --pretty`
2. Fix types in new location
3. Check relative imports (should use aliases)

---

## 📊 Progress Tracking

### Status Board
```
Phase 1: Foundation
- [ ] Create src/ structure
- [ ] Move types
- [ ] Extract constants
Status: NOT STARTED

Phase 2: Utilities
- [ ] Refactor lib/
- [ ] Create services/
- [ ] Split large files
Status: PENDING

Phase 3: Common Components
- [ ] Extract breadcrumbs
- [ ] Extract headers
- [ ] Extract theme/notifications
Status: PENDING

... etc
```

### Commit Log Format
```
refactor: Phase 1 - create source structure
- Create src/ directory with base folders
- Move all types to src/types/
- Extract constants to src/constants/
- All TypeScript checks passing ✓

refactor: Phase 2 - reorganize lib utilities
- Split signal-library.ts into modules
- Create src/lib/analysis structure
- Move data loaders to src/lib/data/
- Zero circular dependencies ✓
```

---

## 📚 Related Documents

1. **REFACTORING_PLAN.md** - Detailed implementation guide (50+ pages)
2. **REFACTORING_SUMMARY.md** - Visual overview and strategy
3. **This file** - Quick reference for while refactoring

---

## ❓ Common Questions

**Q: Can I refactor one domain at a time?**
A: Yes! Each phase is independent. Recommend starting with Phases 1-2 (foundation) then any domain.

**Q: What if something breaks?**
A: Each phase is a single atomic commit. Just `git revert` that commit.

**Q: How long will the app be broken?**
A: No broken state! Import paths updated incrementally. App runs after each commit.

**Q: Can multiple people work on this?**
A: Yes! Different teams work on different phases/domains in parallel.

**Q: Do I need to update tests?**
A: Update import paths in tests, but logic doesn't change.

---

## 🎬 Getting Started Now

### Start Phase 1 Immediately
```bash
# 1. Create the feature branch
git checkout -b refactor/code-organization

# 2. Create src/ structure
mkdir -p src/{components,lib,hooks,types,constants,context,services}

# 3. Review REFACTORING_PLAN.md
# and REFACTORING_SUMMARY.md

# 4. Begin Phase 1 steps
# See REFACTORING_PLAN.md Phase 1 section
```

**Next: Read REFACTORING_PLAN.md for detailed Phase 1 steps →**

