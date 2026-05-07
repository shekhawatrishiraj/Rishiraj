---
title: Edge Case Discovery Rules
impact: HIGH
impactDescription: Code-level edge case detection through architecture analysis
tags: rules, edge-case, architecture, logic-flow, state-machine, status, coverage
---

# Edge Case Discovery Rules

> Load when: `edge case`, `architecture`, `logic flow`, `state machine`, `coverage`, `what could go wrong`, `system map`

> **Design knowledge**: Invoke `/design-knowledge` for methodology and prioritization framework

---

## Purpose

Use code analysis to discover unhandled edge cases in components BEFORE they reach users. This extends the 8 required states (states.md) by finding feature-specific states hidden in logic flows.

---

## Discovery Checks

### 1. Unhandled Conditional Branches

Scan components for conditional rendering where not all branches have designed UI.

| Detection | Pattern | Violation |
|-----------|---------|-----------|
| Missing else branch | `if (condition) { return <X/> }` with no else | Undesigned fallback state |
| Ternary without both arms designed | `condition ? <Full/> : null` | Silent empty state |
| Switch without default | `switch(status)` missing `default:` | Unhandled status value |
| Optional chaining to nothing | `data?.items?.map(...)` with no fallback | Undefined renders nothing |

**Grep patterns:**
```
# Find ternary rendering with null/undefined fallback
? <.*> : null
? <.*> : undefined

# Find switch without default
switch\s*\(.*\)\s*\{(?![\s\S]*default:)

# Find conditional returns without else
if \(.*\) \{\s*return
```

### 2. Status/Enum Coverage

Every status enum or union type should have a corresponding UI state.

| Check | How |
|-------|-----|
| Find all status types | Grep for `type.*Status`, `type.*State`, `enum` |
| Count enum values | List all possible values |
| Find rendering switches | Grep for `switch(status)` or conditional chains |
| Compare | Values without UI = gap |

**Process:**
1. `Grep` for type/enum definitions in feature area
2. List all possible values
3. `Grep` for where those values are consumed in JSX
4. Report values that have no corresponding UI branch

### 3. API Error Path Coverage

Every API call needs success, loading, AND error UI.

| API Pattern | Required UI States |
|-------------|-------------------|
| `fetch()` / `axios` | Loading, success, error (network), error (4xx), error (5xx) |
| `useSWR` / `useQuery` | `isLoading`, `data`, `error`, `isValidating` |
| `useAction` / server action | Pending, success, error |
| `useMutation` | `isPending`, `isSuccess`, `isError` |

**Check**: For each API call, verify the component renders something for the error case. `catch` blocks that only `console.error` are violations.

### 4. Permission-Gated UI

Components that check permissions must design ALL permission levels.

| Detection | Violation |
|-----------|-----------|
| `if (canEdit)` shows edit button | What does `!canEdit` user see? (nothing? disabled? tooltip?) |
| `role === 'admin'` guard | What do non-admin users see in this space? |
| `isOwner` conditional | Owner vs non-owner UI fully designed? |

**Grep patterns:**
```
# Find permission checks in components
canEdit\|canDelete\|canCreate\|canManage
role\s*===\s*['"]
isOwner\|isAdmin\|isMember
hasPermission\|checkPermission
```

### 5. Data Boundary Testing

Components must handle content extremes.

| Boundary | What to Check |
|----------|---------------|
| Empty array `[]` | Does the component render an empty state or break? |
| Single item `[1]` | Grammar correct? Layout not awkward? |
| Long list `[1..1000]` | Virtualized? Paginated? Performance OK? |
| Long text (200+ chars) | Truncated? Wrapped? Overflows container? |
| Missing optional fields | `undefined` handled gracefully? |

**Grep patterns:**
```
# Find arrays without empty checks
\.map\((?!.*\.length)
# Find potential overflow
className=".*(?!truncate|line-clamp|overflow)
```

---

## Discovery Workflow

When running edge case discovery on a feature:

```
1. SCOPE    — Identify target component(s) and their dependencies
2. GREP     — Search for conditionals, enums, API calls, permission checks
3. TRACE    — Follow data flow from API → state → render
4. LIST     — Catalog every branch point
5. CHECK    — Mark each as designed (has UI) or undesigned (gap)
6. REPORT   — Output gap table with file:line references
```

---

## Report Format

Output discovered gaps as:

| # | File:Line | Branch | Current Behavior | Severity | Recommendation |
|---|-----------|--------|------------------|----------|----------------|
| 1 | `page.tsx:42` | `if (!data)` | Renders blank | HIGH | Add empty state |
| 2 | `api.ts:15` | `catch(e)` | Console only | HIGH | Show error toast |
| 3 | `status` enum | `'suspended'` value | No UI branch | MEDIUM | Add suspended state |

---

## Integration with Existing Checks

This module **extends**, not replaces, existing state checks:

| Existing Check (states.md) | This Module Adds |
|---------------------------|------------------|
| 8 required states (generic) | Feature-specific states from code analysis |
| "Missing hover:" detection | "Missing branch UI" detection |
| Empty state check | WHY it's empty (no data? permission? error?) |
| Error state check | WHICH errors (network? auth? validation? timeout?) |

---

## Violations (Auto-Fail)

```
switch(status) without default    → Every status needs UI, including unexpected values
API call without error UI         → catch block must render user-facing feedback
Permission check without else UI  → Both permitted and denied states need design
.map() without empty check        → Arrays need length === 0 handling
Optional data without fallback    → data?.field rendering nothing is a gap
```
