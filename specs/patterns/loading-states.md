# Loading States

## Overview
Consistent patterns for communicating loading, processing, and empty states across the application. Three primary mechanisms: Skeleton placeholders, Spinner indicators, and Shimmer text animations.

## Skeleton

### Component
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-1/3" />
```

### Implementation
```tsx
// src/components/ui/skeleton.tsx
function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}
```

### Key Classes
```
bg-accent animate-pulse rounded-md
```

### Usage Patterns

**Text line skeleton:**
```tsx
<Skeleton className="h-4 w-1/3" />       {/* Title */}
<Skeleton className="h-3 w-full" />       {/* Full-width body line */}
<Skeleton className="h-3 w-2/3" />        {/* Partial body line */}
```

**Avatar skeleton:**
```tsx
<Skeleton className="size-9 shrink-0 rounded-full bg-muted-foreground/10" />
```

**Card skeleton (Feed):**
```tsx
<div className="flex gap-3 rounded-xl border p-4">
  <Skeleton className="size-9 shrink-0 rounded-full bg-muted-foreground/10" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-4 w-1/3 bg-muted-foreground/10" />
    <Skeleton className="h-3 w-full bg-muted-foreground/10" />
    <Skeleton className="h-3 w-2/3 bg-muted-foreground/10" />
  </div>
</div>
```

**Section header skeleton:**
```tsx
<Skeleton className="h-3 w-16 rounded bg-muted-foreground/10" />
```

**Summary strip skeleton:**
```tsx
<Skeleton className="mb-6 h-10 w-full rounded-lg bg-muted-foreground/10" />
```

**Sidebar menu skeleton:**
```tsx
<SidebarMenuSkeleton showIcon={true} />
// Renders: h-8 items with random width (50-90%) text skeletons
```

### Color Override
Feed skeletons use `bg-muted-foreground/10` instead of default `bg-accent` for subtler appearance.

## Spinner

### Component
```tsx
import { Spinner } from "@/components/ui/spinner";

<Spinner />
<Spinner className="size-6" />
```

### Implementation
```tsx
// src/components/ui/spinner.tsx
function Spinner({ className, ...props }) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
```

### Key Classes
```
size-4 animate-spin
```

### When to Use
- Inline loading indicators (e.g., button loading state)
- Small loading indicators next to text
- Voice selector loading state
- Speech input processing

## Syncing Indicator
For data sync operations (not Spinner component but same pattern):
```tsx
<CircleNotchIcon size={14} className="animate-spin" />
<span>Sync in progress</span>
```
Used in: DataSourceCard syncing status

## Loading Text Conventions
- Use present participle: "Loading...", "Sync in progress", "Processing..."
- The ellipsis is part of the text, not animated separately
- For AI elements, use Shimmer component for animated loading text

## Shimmer (AI Elements)
For AI-specific loading states with gradient animation:
```tsx
import { Shimmer } from "@/components/ai-elements/shimmer";

<Shimmer duration={2}>Loading at normal speed...</Shimmer>
```
Duration controls animation speed (1 = fast, 6 = very slow).

## Pattern: Conditional Loading
The standard pattern for loading states:
```tsx
if (isLoading) return <>{loadingSkeleton}</>;
if (items.length === 0) return <>{emptyState}</>;
return <>{content}</>;
```

Used in Feed component and across pages.

## Do / Don't

**Do:**
- Match skeleton shapes to the content they replace (same height, approximate width)
- Use `rounded-full` for avatar skeletons, `rounded-md` for text/cards
- Use `Spinner` for inline/button loading, `Skeleton` for layout placeholders
- Add `role="status"` and `aria-label` to loading indicators
- Use varying widths (`w-1/3`, `w-full`, `w-2/3`) for text skeleton lines

**Don't:**
- Don't use Skeleton for interactive loading (button clicks) -- use Spinner
- Don't show both skeleton and content simultaneously
- Don't use fixed pixel widths for text skeletons -- use fractions for natural feel
- Don't animate the skeleton's position or opacity beyond `animate-pulse`
- Don't use generic "Loading..." text when a skeleton can show the expected layout

## Examples in Codebase
- `src/components/ui/skeleton.tsx` - Skeleton primitive
- `src/components/ui/spinner.tsx` - Spinner primitive
- `src/app/feed/feed-skeleton.tsx` - Feed loading skeleton composition
- `src/components/ui/sidebar.tsx` - SidebarMenuSkeleton
- `src/components/data-source-card.tsx` - Sync spinner pattern
- `src/components/ai-elements/speech-input.tsx` - Spinner in voice UI
