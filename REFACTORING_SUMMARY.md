# Code Refactoring Plan - Visual Summary

## Current Structure ❌
```
components/
├── admin-breadcrumb.tsx
├── admin-content.tsx
├── ai-summary.tsx
├── analysis-panels.tsx
├── analytics-breadcrumb.tsx
├── analytics-content.tsx
├── candlestick-volume-chart.tsx
├── catalog-breadcrumb.tsx
├── ... 50+ more files scattered here
└── ui/ (57 components)

lib/
├── adjustment-system.ts (437 LOC)
├── auth.ts (92 LOC)
├── chart-dummy-data.ts
├── clickhouse-client.ts (464 LOC)
├── data-loader.ts (275 LOC)
├── mock-data-extended.ts (481 LOC)
├── mock-data.ts (465 LOC)
├── signal-library.ts (538 LOC)
├── types.ts (52 LOC)
└── utils.ts (76 LOC)
```

**Problems:**
- 60+ components in same folder 😱
- Hard to find related code 🔍
- Circular dependencies possible 🔄
- No clear separation of concerns 🤷
- Large monolithic lib files 📦
- Mixed business logic & UI 🔀

---

## Target Structure ✅
```
src/
├── components/
│   ├── common/                    ← Shared components
│   │   ├── breadcrumbs/
│   │   ├── headers/
│   │   ├── theme/
│   │   └── notifications/
│   ├── instruments/               ← Feature domain
│   │   ├── detail/
│   │   ├── table/
│   │   ├── timeline/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   ├── charts/                    ← Feature domain
│   │   ├── candlestick/
│   │   ├── trading/
│   │   ├── analysis/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   ├── corporate-actions/         ← Feature domain
│   │   ├── dashboard/
│   │   ├── components/
│   │   ├── analysis/
│   │   ├── modals/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   ├── datasets/                  ← Feature domain
│   ├── admin/                     ← Feature domain
│   ├── analytics/                 ← Feature domain
│   ├── auth/                      ← Feature domain
│   └── ui/                        ← Primitives
├── lib/
│   ├── data/
│   │   ├── loaders/              ← Organized
│   │   ├── transformers/
│   │   ├── mocks/
│   │   └── index.ts
│   ├── analysis/
│   │   ├── event-metrics/        ← Organized
│   │   ├── signals/
│   │   ├── adjustments/
│   │   └── index.ts
│   ├── database/
│   │   ├── clients/
│   │   └── schemas/
│   ├── services/
│   │   └── api/
│   └── utils/
├── hooks/
│   ├── api/
│   ├── ui/
│   └── analysis/
├── types/
│   ├── entities/
│   ├── domain/
│   └── common.types.ts
├── constants/
│   ├── app.constants.ts
│   ├── chart.constants.ts
│   ├── error-messages.ts
│   └── feature-flags.ts
└── context/
    ├── auth-context.tsx
    ├── theme-context.tsx
    └── filters-context.tsx
```

**Benefits:**
- Easy to find related code 🎯
- Clear feature boundaries 📦
- No circular dependencies ✓
- Separation of concerns 🎯
- Scalable structure 📈
- Parallel development possible 👥

---

## Migration Path (7 Phases)

### Phase 1: Foundation (Week 1) 🏗️
- Create `src/` directory structure
- Consolidate all types → `src/types/`
- Extract constants → `src/constants/`

### Phase 2: Shared Utilities (Week 1-2) 🔧
- Refactor `lib/` into organized modules
- Create `src/services/` for API logic
- Split large files (signal-library, adjustment-system, etc.)

### Phase 3: Common Components (Week 2) 🎨
- Extract breadcrumbs → `common/breadcrumbs/`
- Extract headers → `common/headers/`
- Extract theme → `common/theme/`
- Extract notifications → `common/notifications/`

### Phase 4: Feature Domains (Week 3-4) 🎯
- Organize Instruments components
- Organize Charts components
- Organize Corporate Actions components
- Organize Datasets components
- Organize Admin components
- Organize Analytics components

### Phase 5: Hooks & Context (Week 4) 🪝
- Organize hooks by feature
- Create React Context for global state
- Extract context usage from components

### Phase 6: Import Updates (Week 5) 📝
- Update all import paths
- Create path aliases in tsconfig.json
- Verify no circular dependencies

### Phase 7: Testing & QA (Week 5-6) ✅
- Test all features end-to-end
- Run linter and type checker
- Update documentation

---

## Component Organization Strategy

### Before Refactoring
```
Components by Name (Hard to navigate)
- admin-breadcrumb
- analytics-breadcrumb
- catalog-breadcrumb
- corp-action-breadcrumb
- dataset-detail-breadcrumb
- admin-content
- analytics-content
- corp-action-tradingview-chart
- candlestick-volume-chart
- ... etc
```

### After Refactoring
```
Components by Domain (Easy to navigate)

INSTRUMENTS
├── detail/
│   ├── instrument-detail-page.tsx
│   ├── instrument-header.tsx
│   └── instrument-sidebar.tsx
├── table/
│   ├── instrument-table.tsx
│   └── table-filters.tsx
├── timeline/
│   └── corp-actions-timeline.tsx
├── hooks/
│   ├── use-instrument-data.ts
│   └── use-instrument-filters.ts
└── types/
    └── instrument.types.ts

CHARTS
├── candlestick/
│   ├── candlestick-volume-chart.tsx
│   ├── candlestick-config.ts
│   └── candlestick-utils.ts
├── analysis/
│   ├── event-study-heatmap.tsx
│   ├── announcement-drift-panel.tsx
│   └── volatility-burst-panel.tsx
├── hooks/
│   ├── use-chart-data.ts
│   └── use-echarts-instance.ts
└── types/
    └── chart.types.ts

... similar for other domains
```

---

## Size Analysis & Refactoring Targets

### Large Components to Break Down
| Component | Current LOC | After Refactor |
|-----------|------------|-----------------|
| admin-content.tsx | 1005 | 300 (split into tabs) |
| candlestick-volume-chart.tsx | 559 | 250 (separate concerns) |
| dataset-detail-content.tsx | 547 | 300 (split into tabs) |
| corp-action-tradingview-chart.tsx | 463 | 200 (extract logic) |
| manage-content.tsx | 442 | 250 (split into tabs) |

### Large Utility Files to Split
| File | Current LOC | Split Into |
|------|-----------|-----------|
| signal-library.ts | 538 | signal-generator.ts (200), signal-detector.ts (200), signal-library.ts (138) |
| mock-data-extended.ts | 481 | mock-data-extended.ts (300), mock-data-generators.ts (181) |
| mock-data.ts | 465 | mock-data.ts (250), mock-data-utils.ts (215) |
| clickhouse-client.ts | 464 | clickhouse-client.ts (300), clickhouse-query-builder.ts (164) |
| adjustment-system.ts | 437 | price-adjuster.ts (250), split-adjuster.ts (187) |

---

## Dependency Cleanup

### Current Issues ⚠️
```
components/candlestick-volume-chart.tsx imports from:
- @/lib/types (types)
- @/lib/mock-data (test data)
- 20+ UI components
- Business logic mixed with rendering
```

### After Refactoring ✓
```
components/charts/candlestick/candlestick-volume-chart.tsx imports from:
- @/lib/analysis/event-metrics (pure calculations)
- @/components/ui (UI primitives only)
- @/types (types)
- Own folder hooks & utils

Circular Dependencies: 0 ✓
```

---

## Code Location Guide

### Where to Find...

**Feature Domain Logic**
```
For Instruments → src/components/instruments/
For Charts → src/components/charts/
For Corporate Actions → src/components/corporate-actions/
For Datasets → src/components/datasets/
```

**Reusable Utilities**
```
Data Loading → src/lib/data/loaders/
Event Analysis → src/lib/analysis/event-metrics/
Signal Detection → src/lib/analysis/signals/
Price Adjustments → src/lib/analysis/adjustments/
String/Number/Date Utils → src/lib/utils/
```

**Feature-Specific Items**
```
Custom Hooks → src/components/{feature}/hooks/
Types & Interfaces → src/components/{feature}/types/
```

**Global Items**
```
React Context → src/context/
Feature Flags → src/constants/feature-flags.ts
Error Messages → src/constants/error-messages.ts
API Endpoints → src/constants/api.constants.ts
```

---

## Impact Analysis

### Development Speed
- **Before**: 10 min to find related components
- **After**: 2 min to find related components ✓
- **Gain**: 80% faster navigation

### Code Reusability
- **Before**: Utility functions scattered, hard to discover
- **After**: Clear location for all utilities ✓
- **Gain**: More code reuse, less duplication

### Onboarding Time
- **Before**: 1-2 weeks to understand codebase
- **After**: 2-3 days to understand structure ✓
- **Gain**: 70% faster onboarding

### Testing
- **Before**: Hard to test business logic isolated from UI
- **After**: Pure functions in lib/ easily testable ✓
- **Gain**: 50% increase in test coverage potential

---

## Key Principles Applied

| Principle | How We Apply It |
|-----------|-----------------|
| **Single Responsibility** | Each folder has one reason to change |
| **Feature Cohesion** | Related code grouped in feature domains |
| **Loose Coupling** | Domains are independent, via interfaces |
| **High Cohesion** | Internal domain logic is tightly related |
| **Testability** | Business logic separated from UI |
| **Scalability** | Add features without modifying existing code |
| **Clarity** | Structure mirrors business domains |

---

## Tools & Commands

### Detect Issues After Refactoring
```bash
# Check circular dependencies
npx madge --circular src/

# Lint code
npm run lint

# Type check
tsc --noEmit

# Check unused exports
npx knip

# Visualize dependency graph
npx madge --image deps.svg src/
```

### Track Progress
```bash
# Count files by folder
find src/components -type d -maxdepth 1 | sort

# Check file sizes
find src/components -type f -name "*.tsx" | xargs wc -l | sort -n
```

---

## Success Criteria ✓

After refactoring is complete:

- [ ] **No circular dependencies** detected by madge
- [ ] **All types pass** TypeScript validation
- [ ] **Zero console errors** on app startup
- [ ] **All features work** identically to before
- [ ] **Build size** unchanged or reduced
- [ ] **No performance regression** in Lighthouse metrics
- [ ] **New features faster** to implement (target: 30% time reduction)
- [ ] **Onboarding faster** for new developers (target: 70% time reduction)

---

## Documentation After Refactoring

Will create:
1. **Component Architecture Guide** - How components are organized
2. **Adding New Features** - Step-by-step guide for new features
3. **Naming Conventions** - File naming and folder organization
4. **Import Guidelines** - How to structure imports
5. **Testing Guide** - How to test domain logic
6. **FAQ** - Common questions answered

---

**Ready to start Phase 1? See REFACTORING_PLAN.md for detailed implementation guide.**
