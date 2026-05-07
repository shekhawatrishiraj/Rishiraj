# Persona, Variant & Scenario System

## Overview
A design-time state management system for previewing UI across user types, data densities, error/loading states, design variants, and annotation overlays. All state is URL-driven (via `nuqs`), shareable, and survives refresh.

This spec covers **how pages consume** the system. For the switcher UI itself, see `specs/components/domain/persona-switcher.md`.

## Hooks

| Hook | Import | Purpose |
|------|--------|---------|
| `usePersona()` | `@/hooks/use-persona` | Persona flags, scenarios, volume, sequences |
| `useVariant()` | `@/hooks/use-variant` | Route-specific design variant switching |
| `useAnnotations()` | `@/hooks/use-annotations` | Design annotation overlay toggle + filtering |

## URL State Shape

All params optional. Defaults applied when absent.

```
/agents?persona=new-user&flags=con:0&scenario=error&volume=sparse
/feed?variant=compact&persona=returning&scenario=loading
/twin-settings/apps?variant=hld&annotations=true&ann-filter=rationale
```

| Param | Format | Example |
|-------|--------|---------|
| `persona` | Preset key | `new-user`, `returning` |
| `flags` | Compact `shortKey:0\|1` | `con:0,mtg:1` |
| `scenario` | Global or scoped | `error` or `error:con,loading:mtg` |
| `volume` | Density key | `empty`, `sparse`, `typical`, `heavy` |
| `variant` | Route-defined key | `compact`, `hld` |
| `annotations` | Boolean | `true` |
| `ann-filter` | Category | `rationale`, `edge-case`, `motion-spec`, `todo` |

---

## Personas & Flags

### Presets
- **`new-user`** — first-time user, nothing connected or configured
- **`returning`** — active user with connections and history

### Flags
Presets set base flags. URL `?flags=` overrides merge on top.

| Flag | Description |
|------|-------------|
| `hasOnboarded` | Completed onboarding flow |
| `hasConnections` | Has connected data sources |
| `hasMeetings` | Has meeting history |
| `hasKnowledgeSources` | Has uploaded knowledge sources |

### Resolution Order
1. Start with `PERSONAS[preset].flags` (base)
2. Apply `?flags=` URL overrides (merge, not replace)
3. Final flags = base + overrides

### Page Consumption Pattern
```tsx
const { flags } = usePersona();
const isNewUser = !flags.hasConnections;

// Adjust visible content based on flags
if (isNewUser) {
  visibleAgents = data.all.slice(0, 3); // Limited preview
  visibleMyAgents = [];                  // Hide empty sections
}
```

---

## Scenarios

Scenarios overlay transient UI states (loading, error) without changing persona identity.

### Keys
- `none` — normal state (default)
- `loading` — show skeleton/loading UI
- `error` — show error state

### Scoping
Scenarios can target specific page sections or apply globally:

| Format | Meaning |
|--------|---------|
| `?scenario=error` | Global — all scopes get `error` |
| `?scenario=error:con,loading:mtg` | Scoped — `con` scope gets error, `mtg` scope gets loading |

### Resolution Priority
1. Check specific scope (e.g., `getScenario("con")`)
2. Fall back to global `"*"` scope
3. Fall back to `"none"`

### Page Consumption Pattern

**Check scenario FIRST, then persona flags:**

```tsx
const { flags, scenario, volume } = usePersona();

// 1. Scenario gates (short-circuit)
if (scenario === "loading") return <PageLoadingSkeleton />;
if (scenario === "error") return <PageErrorState />;

// 2. Persona-driven content
const isNewUser = !flags.hasConnections;
// ... render normal UI
```

For scoped scenarios:
```tsx
const { getScenario } = usePersona();

// Different sections can have independent scenarios
const conversationScenario = getScenario("con");
const meetingScenario = getScenario("mtg");

return (
  <>
    {conversationScenario === "loading" ? <ConversationSkeleton /> : <Conversations />}
    {meetingScenario === "error" ? <MeetingError /> : <Meetings />}
  </>
);
```

---

## Volume (Data Density)

Controls how much mock data pages render.

| Key | Use Case |
|-----|----------|
| `empty` | Zero-state / empty state testing |
| `sparse` | Minimal data, tests low-content layouts |
| `typical` | Default, representative dataset |
| `heavy` | Stress-tests layouts, pagination, overflow |

### Page Consumption Pattern
```tsx
const { volume } = usePersona();
const data = useMemo(() => getVolumeAgents(volume), [volume]);

// Volume affects data size, not UI branching
return <AgentGrid agents={data.all} />;
```

Volume is an **axis of data generation**, not UI branching. Pages call volume-aware data functions that return appropriately sized datasets.

---

## Variants

Route-specific design alternatives for A/B comparison.

### Registry
Defined in `src/lib/variants.ts`:

```tsx
{
  "/feed": {
    defaultVariant: "rich",
    variants: { rich: { label: "Rich" }, compact: { label: "Compact" } }
  },
  "/twin-settings/apps": {
    defaultVariant: "current",
    variants: { current: { label: "Current" }, hld: { label: "HLD" } }
  }
}
```

### Resolution
1. Exact route match first, then prefix match (`/feed/123` → `/feed`)
2. Validates key against route config, falls back to default
3. Auto-clears URL param when selecting default (clean URLs)
4. Auto-clears when navigating to route with no variants

### Page Consumption Pattern
```tsx
const { variant } = useVariant();

// Variant switches entire content or component
if (variant === "hld") return <HldAppsPage />;
return <CurrentAppsPage />;
```

Or for subtler differences:
```tsx
const { variant } = useVariant();
const Content = variant === "compact" ? CompactFeed : RichFeed;
return <Content events={events} />;
```

Variants are **mutually exclusive** — only one active per route.

---

## Sequences

Auto-advancing walkthroughs that step through persona/scenario/volume states.

### Definition
Sequences are arrays of timed steps, each modifying state:

```tsx
{
  name: "Onboarding Flow",
  steps: [
    { persona: "new-user", duration: 3000 },
    { flagOverrides: { hasOnboarded: true }, duration: 2500 },
    { scenario: "loading", duration: 2000 },
    { scenario: "none", persona: "returning", duration: 3000 },
  ]
}
```

### Controls
```tsx
const { sequenceState, playSequence, stopSequence, stepForward, stepBack } = usePersona();
```

- `playSequence(index)` — starts auto-advancing
- `stepForward()` / `stepBack()` — manual navigation
- `stopSequence()` — halts and resets

---

## Annotations

Design annotations pinned to DOM elements via selectors.

### Annotation Files
Each page can define annotations in a co-located file:

```
src/app/agents/page.annotations.ts
src/app/feed/page.annotations.ts
```

### Structure
```tsx
const pageAnnotations: PageAnnotations = {
  route: "/agents",
  annotations: [
    {
      selector: '[data-testid="agents-page-header"]',
      category: "rationale",
      title: "Search placement",
      note: "Search is inline... supports **markdown**"
    },
  ]
};
```

### Categories
| Category | Color | Purpose |
|----------|-------|---------|
| `rationale` | Blue | Design reasoning |
| `edge-case` | Amber | Boundary conditions |
| `motion-spec` | Violet | Animation details |
| `todo` | Rose | Incomplete work |

### Registry
All annotation files are imported into `src/lib/annotation-registry.ts`, which exports `getAnnotationsForRoute(pathname)`.

---

## Interaction Rules

### Priority Order
1. **Scenario** — checked first, short-circuits to loading/error UI
2. **Persona flags** — drive content visibility and section behavior
3. **Volume** — shapes data size passed to components
4. **Variant** — switches component/layout alternatives

### Independence
- Persona and scenario are **combinable** — a new-user can also be in an error state
- Volume is **independent** of persona — any persona can have any data density
- Variants are **independent** of everything — orthogonal axis for design comparison
- Annotations are **independent** — overlay that doesn't affect rendered content

### Adding a New Page

1. Destructure what you need: `const { flags, scenario, volume } = usePersona();`
2. Check scenario first for loading/error gates
3. Use flags for content-level decisions
4. Use volume-aware data functions for mock data
5. If the page has design variants, register them in `src/lib/variants.ts`
6. If adding annotations, create `page.annotations.ts` and register in `annotation-registry.ts`
