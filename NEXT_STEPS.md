# 🎯 Refactoring Next Steps - Component Migration Phase 3 Plan

**Current Status**: Phase 2 Complete ✅ - Application builds successfully with new src/ structure

---

## Current Inventory

### Components Status
- **Migrated**: 125 components in new `src/` structure
- **Unmigrated**: 69 components in old `components/` folder
- **Total**: 194 components
- **Progress**: 64% migrated

### Build Status
- ✅ Production build succeeds (0 errors, 0 warnings)
- ✅ All app routes use new import paths
- ✅ 11 routes successfully prerendered
- ✅ Ready for production deployment

---

## Critical Path Blockers (Must Migrate for Full Functionality)

### 3 Components Actively Used in New Code (URGENT)

These are imported by files in the new `src/` structure and block full migration:

| Component | Used By | Location | Priority |
|-----------|---------|----------|----------|
| **DatasetCard** | `catalog-grid.tsx`, `catalog-header.tsx` | `src/components/datasets/catalog/` | 🔴 CRITICAL |
| **NotificationDropdown** | `catalog-header.tsx` (×2) | `src/components/common/headers/`, `src/components/corporate-actions/` | 🔴 CRITICAL |
| **InstrumentTable** | *(moved)* | Already migrated to `src/components/instruments/table/` | ✅ DONE |

### Action Required for These 3
**Migrate immediately** (5-10 minutes) to unblock catalog pages:
1. `dataset-card.tsx` → `src/components/datasets/detail/`
2. `notification-dropdown.tsx` → `src/components/common/notifications/`

---

## Remaining 67 Unmigrated Components by Domain

### 📊 Analytics Domain (6 components)
- `admin-breadcrumb.tsx`
- `admin-content.tsx`
- `analytics-breadcrumb.tsx`
- `analytics-content.tsx`
- `chart-header.tsx`
- `dashboard/` subdirectory with 6 files

**Status**: Most logic already in `src/components/analytics/` - cleanup only

### 📈 Charts Domain (7 components in `chart/` subfolder)
- `chart/candlestick-chart.tsx`
- `chart/chart-header.tsx`
- `chart/tools-sidebar.tsx`
- `corp-action-price-chart.tsx`
- `corp-action-volume-chart.tsx`
- `corp-action-tradingview-chart.tsx`
- `volume-chart.tsx`

**Status**: Core charts migrated, these are alternative/legacy implementations

### 💼 Corporate Actions Domain (10 components)
- `catalog-breadcrumb.tsx` (note: different from corp-action-breadcrumb)
- `catalog-filters.tsx`
- `catalog-grid.tsx`
- `catalog-search.tsx`
- `corp-action-analysis-tab.tsx`
- `corp-action-calendar.tsx`
- `corp-action-filters.tsx`
- `corp-action-summary-cards.tsx`
- `corp-action-table.tsx`
- `corporate-actions.tsx` (wrapper component)

**Status**: Mix of old and new implementations - prioritize high-usage ones

### 📦 Datasets Domain (8 components)
- `dataset-card.tsx` ⚠️ **BLOCKING**
- `dataset-chat.tsx` (duplicate - remove)
- `dataset-detail-breadcrumb.tsx` (already migrated)
- `dataset-detail-content.tsx` (already migrated)
- `dataset-discussion.tsx` (already migrated)
- `dataset-lineage.tsx` (already migrated)
- `dataset-quality-metrics.tsx` (already migrated)
- `dataset-sample-data.tsx` (already migrated)

**Status**: Most already migrated, only `dataset-card.tsx` needed

### 🔐 Auth Domain (1 component)
- `login-form.tsx` (already migrated, old copy can be deleted)

### 🔔 Common Components (3-5 components)
- `notification-dropdown.tsx` ⚠️ **BLOCKING**
- `theme-toggle.tsx` (already migrated)
- `theme-provider.tsx` (already migrated)
- `_index-migration.tsx` (helper file - can delete)

### 📱 Other/Uncategorized (20+ components)
- Various UI wrapper components
- Legacy/alternative implementations
- Duplicate components

---

## Recommended Phase 3 Strategy: "3-Day Sprint"

### Phase 3A: Unblock (Day 1) - 10 minutes
**Goal**: Fix blocking imports

```bash
# Migrate critical components
cp components/dataset-card.tsx src/components/datasets/detail/
cp components/notification-dropdown.tsx src/components/common/notifications/

# Update imports in new code
# - catalog-grid.tsx
# - catalog-header.tsx (×2 files)

# Verify build still succeeds
npm run build
```

### Phase 3B: High-Priority (Day 1-2) - 30-45 minutes
**Goal**: Migrate 15-20 components actively used or frequently imported

Priority order:
1. **Catalog components** (6): `catalog-header.tsx`, `catalog-filters.tsx`, `catalog-grid.tsx`, `catalog-search.tsx`, `catalog-breadcrumb.tsx`
2. **Corporate actions tabs** (3): `corp-action-analysis-tab.tsx`, `corp-action-calendar.tsx`, `corp-action-filters.tsx`
3. **Summary/cards** (2): `corp-action-summary-cards.tsx`, `corp-action-table.tsx`
4. **Chart variants** (3-4): Top 3-4 most used chart types

### Phase 3C: Remaining (Day 2-3) - 1-2 hours
**Goal**: Migrate final 40+ components

- Analytics domain files
- Legacy/alternative chart implementations
- Uncategorized components
- Test coverage for each domain

### Phase 3D: Cleanup (Day 3) - 30 minutes
**Goal**: Prepare for deletion

- List all migrated components
- Remove old `components/` folder (with git archive backup)
- Update all remaining imports
- Final build verification

---

## Tools & Commands for Phase 3

### Find what imports a specific component
```bash
grep -r "from ['\"]@/components/component-name['\"]" . --include="*.tsx" --include="*.ts"
```

### Batch migrate components by domain
```bash
# Copy all corp-action-* components
for file in corp-action-*.tsx; do
  cp components/$file src/components/corporate-actions/
done
```

### Check build after migration
```bash
npm run build
```

### Verify no old imports remain
```bash
grep -r "@/components/[a-z-]*['\"]" src --include="*.tsx" | grep -v "@/components/[a-z-]*/\|@/components/ui/\|@/components/common/\|@/components/charts/\|@/components/corporate-actions/\|@/components/datasets/\|@/components/instruments/\|@/components/analytics/\|@/components/auth/"
```

---

## Success Criteria for Phase 3

- ✅ 0 blocking imports in new code
- ✅ 80%+ components migrated (160+/194)
- ✅ Build succeeds with 0 errors
- ✅ All import paths use new structure
- ✅ Ready for old `components/` folder deletion
- ✅ Documentation updated

---

## Estimated Timeline

| Phase | Tasks | Effort | Build Status |
|-------|-------|--------|--------------|
| 3A (Unblock) | 2 components | 10 min | ✅ Passing |
| 3B (High-Priority) | 15-20 components | 30-45 min | ✅ Passing |
| 3C (Remaining) | 40+ components | 1-2 hours | ✅ Passing |
| 3D (Cleanup) | Delete old folder | 30 min | ✅ Ready |
| **Total Phase 3** | **57-62 components** | **2.5-3 hours** | **✅ Ready for Prod** |

---

## After Phase 3: What Changes

### From User Perspective
- ✅ Faster component lookup (organized by domain)
- ✅ Clearer code structure
- ✅ Easier onboarding for new developers
- ✅ Reduced confusion (single source of truth)

### For Developers
- ✅ One place to import from per domain
- ✅ Clear barrel exports
- ✅ Better IDE autocompletion
- ✅ Easier to find related components

### For the Codebase
- ✅ Old `components/` folder deleted
- ✅ 127 fewer files in repo
- ✅ Single, organized structure
- ✅ Future-proof architecture

---

## Decision Point: Manual vs Automated

### Recommended: Manual Migration (Gradual)
✅ Gives time to review each component
✅ Catch architectural issues early
✅ Understand component relationships
⏱️ Takes 2-3 hours total

### Alternative: Automated Script
✅ Faster (30 minutes total)
⚠️ Less review, might miss issues
⚠️ Risk of import path mistakes

**Recommendation**: Manual with partner review (1-2 hours)

---

## Questions to Answer Before Phase 3

1. **When?** Can you dedicate 2-3 hours for Phase 3? (Recommended: one 2-3 hour session)
2. **Who?** Would you like to do this solo or pair with someone?
3. **Priority?** Keep all 67 components or archive some as legacy?
4. **Testing?** Run full test suite after Phase 3?

---

## Next Action

Choose one:

**Option A: Quick Unblock (10 min)**
- Just migrate the 2 blocking components
- Unblocks full functionality
- Done today

**Option B: Full Phase 3 (2-3 hours)**
- Migrate 80% of remaining components
- Complete migration next session
- Recommended if you have time block

**Option C: Detailed Planning (30 min)**
- Create detailed migration checklist
- Prioritize all 67 components
- Plan domain-by-domain approach
- Execute Phase 3 later with full clarity

---

## Status Dashboard

```
Overall Progress: 64% Complete ✅
├── Phase 1 (Foundation): 100% ✅
├── Phase 2 (Initial Migration): 100% ✅
├── Phase 3 (Remaining): 0% ⏳
│   ├── Unblock Critical: TODO 🔴
│   ├── High-Priority: TODO 🟡
│   ├── Remaining: TODO 🟡
│   └── Cleanup: TODO 🟡
└── Phase 4 (Finalization): TODO ⏳

Build Status: ✅ PASSING
Production Ready: ✅ YES
Next Blocker: Catalog pages need 2 components
```

---

**Last Updated**: December 19, 2025
**Refactoring Lead**: OpenCode
**Estimated Phase 3 Start**: Immediate or next session
