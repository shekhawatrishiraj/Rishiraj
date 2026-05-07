# Empty States

## Overview
Consistent pattern for communicating "no data" across the application. Every empty state uses the `<Empty>` component from `@/components/ui/empty`.

## Component
```tsx
import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyAction,
} from "@/components/ui/empty";
```

## Anatomy

```
┌─────────────────────────────────────────┐
│              border-dashed              │
│                                         │
│             [Icon] (32px)               │  ← EmptyIcon (required)
│                                         │
│          Title (sm, semibold)            │  ← EmptyTitle (required)
│     Description (xs, muted, max-w-sm)   │  ← EmptyDescription (required)
│                                         │
│            [ CTA Button ]               │  ← EmptyAction (optional)
│                                         │
└─────────────────────────────────────────┘
```

### Required
- **EmptyIcon** — Contextual icon (32px default or 20px in `contained` variant)
- **EmptyTitle** — Short, specific label (e.g. "No meetings yet")
- **EmptyDescription** — One sentence explaining what goes here or how to populate it

### Optional
- **EmptyAction** — CTA button when user can take action (create, connect, invite)

## Sub-components

### `<Empty>`
Container. Applies `rounded-lg border border-dashed p-12 text-center` and flex column centering.

Override with `className` for special contexts:
- `className="border-none"` — embedded empty states (no outer border needed)

### `<EmptyIcon>`
Icon wrapper. Two variants:
- `variant="default"` — bare icon, 32px, `text-muted-foreground`
- `variant="contained"` — icon inside `size-10 rounded-full bg-muted` circle, 20px icon

### `<EmptyTitle>`
`h3` element. `text-sm font-semibold text-foreground`.

### `<EmptyDescription>`
`p` element. `text-xs text-muted-foreground mt-1 max-w-sm`.

### `<EmptyAction>`
Wrapper div with `mt-4`. Place a `<Button>` inside.

## Usage

### Standard (with CTA)
```tsx
<Empty>
  <EmptyIcon>
    <SparkleIcon size={32} />
  </EmptyIcon>
  <EmptyTitle>No experts available</EmptyTitle>
  <EmptyDescription>
    Create an expert to get specialized help from AI agents.
  </EmptyDescription>
  <EmptyAction>
    <Button size="sm" asChild>
      <Link href="/create-expert">
        <PlusIcon size={16} />
        Create Expert
      </Link>
    </Button>
  </EmptyAction>
</Empty>
```

### Without CTA
```tsx
<Empty>
  <EmptyIcon>
    <ClockCountdownIcon size={32} />
  </EmptyIcon>
  <EmptyTitle>No pending requests</EmptyTitle>
  <EmptyDescription>
    When you request access to an agent, it will appear here until approved.
  </EmptyDescription>
</Empty>
```

### Contained icon variant
```tsx
<Empty>
  <EmptyIcon variant="contained">
    <UsersIcon size={20} />
  </EmptyIcon>
  <EmptyTitle>No people yet</EmptyTitle>
  <EmptyDescription>
    Invite your team to start connecting with their digital twins.
  </EmptyDescription>
</Empty>
```

### Borderless (embedded)
```tsx
<Empty className="border-none">
  <EmptyIcon variant="contained">
    <ClockCounterClockwiseIcon />
  </EmptyIcon>
  <EmptyTitle>No Activity Yet</EmptyTitle>
  <EmptyDescription>
    Actions your twin takes on your behalf will appear here.
  </EmptyDescription>
</Empty>
```

## Icon Selection
Match the icon to the page's nav icon or the content type:
- Experts → `SparkleIcon`
- Agents → `RobotIcon`
- People → `UsersIcon`
- Meetings → `CalendarBlankIcon`
- Pending → `ClockCountdownIcon`
- Scheduled → `TimerIcon`
- Search → `MagnifyingGlassIcon`

## Search Empty State

When a page has search and the query returns no matches, use the same `Empty` component — but with different icon, copy, and **no CTA**.

```tsx
function SearchEmptyState({ query }: { query: string }) {
  return (
    <Empty>
      <EmptyIcon>
        <MagnifyingGlassIcon size={32} />
      </EmptyIcon>
      <EmptyTitle>No results for &ldquo;{query}&rdquo;</EmptyTitle>
      <EmptyDescription>
        Try a different name or check your spelling.
      </EmptyDescription>
    </Empty>
  );
}
```

**Distinguishing search-empty from data-empty:**

The condition order matters — check search first, then fall through to the true empty state:

```tsx
) : filteredItems.length === 0 && search ? (
  <SearchEmptyState query={search} />
) : filteredItems.length === 0 ? (
  <TrueEmptyState />  // with EmptyAction CTA
) : (
  <ItemGrid />
```

**Rules:**
- Always show the query string in the title (`No results for "foo"`)
- No `EmptyAction` CTA — the implicit action is clearing/changing the search
- Icon is always `MagnifyingGlassIcon`, regardless of content type
- Only show search-empty when there IS underlying data (filtered out); if data is empty AND there's a search query, the true empty state wins (no data to search)

---

## Copy Guidelines
- **Title**: "No [thing] yet" or "No [thing] available" — short, specific
- **Search title**: `No results for "[query]"` — always include the query
- **Description**: One sentence. Either explain what goes here OR tell the user how to populate it
- **CTA label**: Action verb + noun (e.g. "Create Expert", "Connect Calendar")

## ESLint Enforcement
Rule: `design-system/no-inline-empty-state` (warning)

Flags any `<div>` with `border-dashed` + `flex-col` + `items-center` + `justify-center` in className. Use `<Empty>` instead.

Excluded: `src/components/ui/**` (primitives).

## Page-Level Empty State: Header Button Rule

When a page is in a **full empty state** (no data across all tabs/sections), the primary action button in the page header **must not appear**. The `EmptyAction` CTA inside the empty state is the sole call-to-action.

**Rationale:** Two competing primary actions (header + empty state) create visual confusion and dilute the empty-state's onboarding intent.

**Rule:**
- Compute `isPageEmpty = data.length === 0 && scenario !== "loading" && scenario !== "error"`
- Wrap the header primary button: `{!isPageEmpty && <Button .../>}`
- The `EmptyAction` button carries the CTA for first-time creation

**Example (agents page):**
```tsx
const isPageEmpty = data.all.length === 0 && scenario !== "loading" && scenario !== "error";

// Header — hidden when empty
{!isPageEmpty && (
  <Button size="sm" asChild>
    <Link href="/create-agent">
      <PlusIcon size={16} />
      Create Agent
    </Link>
  </Button>
)}

// Empty state — sole CTA
<EmptyAction>
  <Button size="sm" asChild>
    <Link href="/create-agent">Create Your First Agent</Link>
  </Button>
</EmptyAction>
```

**Applies to:** Any page with a header primary button + tab/section empty states (agents, experts, people, meetings, etc.)

---

## Do / Don't

**Do:**
- Always include icon, title, and description (all three required)
- Use `EmptyAction` wrapper for CTA buttons
- Match icon to nav/content context
- Use `size="sm"` for CTA buttons
- Hide the page-header primary button when the full page is empty

**Don't:**
- Don't hand-roll empty states with inline `border-dashed` containers
- Don't use empty states with only a text string and no icon
- Don't use different padding/spacing — the component handles it
- Don't put description text directly in the container without `EmptyDescription`
- Don't show a header primary button alongside an empty state CTA — pick one

## Examples in Codebase
- `src/components/ui/empty.tsx` — Component primitives
- `src/app/experts/page.tsx` — Three tab empty states
- `src/app/agents/page.tsx` — Four tab empty states
- `src/app/people/page.tsx` — People empty state
- `src/app/feed/feed-empty.tsx` — Feed empty state
- `src/app/meetings/page.tsx` — Meetings + search empty states
- `src/app/twin-settings/expertise-areas/page.tsx` — Settings empty state
- `src/app/twin-settings/privacy-rules/page.tsx` — Privacy rules empty state
- `src/app/new-tab/components/activity-view.tsx` — Borderless variant
- `src/app/new-tab/components/captures-view.tsx` — Borderless with CTA
