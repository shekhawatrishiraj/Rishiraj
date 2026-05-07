# Card Grid

## Overview
Standard responsive grid layout for displaying collections of cards. Used across settings pages, agent listings, expert directories, and widget tiles.

## Structure
```tsx
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} />
  ))}
</div>
```

## Key Classes
```
grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

## Grid Variants

### Settings Grid (1-2-3-4)
The most common pattern for settings pages with smaller cards:
```
grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```
Used in: Data Sources, Apps, MCPs

### Content Grid (3-column fixed)
For larger cards in content-heavy pages:
```
grid grid-cols-3 gap-4
```
Used in: Agents, Experts

### Widget Grid (1-2-3 responsive)
For dashboard-style widget tiles:
```
grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3
```
Used in: New Tab page widget grid

### Widget Home Grid (2-column)
For dashboard home view:
```
grid auto-rows-auto grid-cols-2 gap-3
```
Used in: New Tab home view

### States Grid (4-column fixed)
For dev/states overview:
```
grid grid-cols-4 gap-3
```
Used in: Dev states page

### Welcome Grid (1-2-4)
For onboarding progress cards:
```
grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4
```
Used in: Welcome/progress page

## Responsive Behavior
| Breakpoint | Size | Typical Columns |
|------------|------|-----------------|
| Default | < 640px | 1 column |
| `sm` | >= 640px | 2 columns |
| `md` | >= 768px | 2 columns (widget grid) |
| `lg` | >= 1024px | 3 columns |
| `xl` | >= 1280px | 4 columns |

## Gap Values
| Value | Usage |
|-------|-------|
| `gap-3` (12px) | Settings grids, smaller cards |
| `gap-4` (16px) | Content grids, larger cards |
| `gap-2` (8px) | Tight tile grids |

## Card Height Consistency
Cards in grids should use `h-full` and `flex flex-col` to ensure consistent heights:
```tsx
<div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
  <div className="flex flex-1 items-start gap-4 p-4">
    {/* Content */}
  </div>
  <div className="flex items-center justify-end bg-muted/50 px-4 py-3">
    {/* Footer */}
  </div>
</div>
```

Use `min-h-[2lh]` on subtitle text to maintain alignment even with short content.

## Show-More Pill

Use when a grid section has more items than the preview threshold. This is the preferred pattern for revealing additional items — do **not** use infinite scroll or pagination for grid layouts.

### When to use
- A named section (e.g. "Connected", "Suggested Agents") has more items than the preview count
- Items are bounded (known total) — not a continuous feed
- The full set is already in memory (no additional fetch needed)

### Anatomy
```tsx
const PREVIEW = 10; // tune per section
const [showAll, setShowAll] = React.useState(false);

// Slice the grid source
const visible = showAll ? items : items.slice(0, PREVIEW);

// Grid renders `visible`, pill renders below grid
```

```tsx
{items.length > PREVIEW && (
  <div className="flex items-center gap-3 mt-3">
    <span className="h-px flex-1 bg-border" />
    <button
      onClick={() => setShowAll((v) => !v)}
      className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
    >
      {showAll ? "Show less" : `Show ${items.length - PREVIEW} more`}
      <CaretDownIcon size={10} className={`transition-transform ${showAll ? "rotate-180" : ""}`} />
    </button>
    <span className="h-px flex-1 bg-border" />
  </div>
)}
```

### Rules
| Rule | Rationale |
|------|-----------|
| Show exact hidden count: `Show N more` | User knows what to expect before clicking |
| Caret rotates 180° when expanded | Consistent directional affordance |
| Pill sits `mt-3` below the grid | Enough breathing room, not detached |
| Horizontal rules flank the pill | Visually separates preview from overflow |
| Preview resets on search/filter change | Show results, not a truncated subset |
| State is per-section, not global | Expanding one section doesn't affect others |

### Preview thresholds in use
| Section | Preview | File |
|---------|---------|------|
| Suggested Agents | 3 | `src/app/agents/page.tsx` |
| Connected Apps (HLD) | 10 | `src/app/twin-settings/apps/variations/hld-connect-apps.tsx` |

### Do / Don't
**Do:**
- Use for grids where total count is known and items are already loaded
- Show the hidden count in the button label
- Reset `showAll` to `false` when search query changes

**Don't:**
- Don't use for feeds or time-ordered lists — those warrant pagination or infinite scroll
- Don't use when items exceed ~50 without search/filter — add search instead
- Don't put the pill inside the grid container — it lives below it, outside the grid

---

## Do / Don't

**Do:**
- Use `gap-3` for settings-style grids, `gap-4` for content grids
- Ensure cards use `h-full` when in a grid
- Start mobile-first with `grid-cols-1`
- Use `items-stretch` (default for grid) to equalize card heights

**Don't:**
- Don't use flexbox wrap for card layouts -- CSS Grid handles alignment better
- Don't hardcode column counts without responsive breakpoints (exception: fixed layouts like agents)
- Don't mix gap sizes within the same grid
- Don't use `auto-fit` or `auto-fill` -- explicit column counts are preferred in this codebase

## Examples in Codebase
- `src/app/twin-settings/data-sources/page.tsx` - 1-2-3-4 settings grid
- `src/app/twin-settings/apps/page.tsx` - 1-2-3-4 settings grid
- `src/app/agents/page.tsx` - Fixed 3-column grid
- `src/app/experts/page.tsx` - Fixed 3-column grid
- `src/app/new-tab/page.tsx` - 1-2-3 widget grid
- `src/app/new-tab/components/home-view.tsx` - 2-column home grid
