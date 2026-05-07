# Specs

> Index of spec files covering components, tokens, foundations, and patterns. Read before modifying any UI component or token.

---

## Quick Navigation

| Directory | Purpose |
|-----------|---------|
| `components/ui/` | shadcn/ui component specs |
| `components/ai-elements/` | AI chat interface component specs |
| `components/domain/` | Domain-specific component specs |
| `tokens/` | Master token reference (CSS vars -> Tailwind classes) |
| `foundations/` | Color, spacing, typography, radius, elevation, motion, z-index, iconography, lint rules |
| `patterns/` | Layout and composition patterns |

---

## When to Read Specs

| Task | Which spec to read |
|------|--------------------|
| Modifying a shadcn component | `components/ui/<name>.md` |
| Modifying an AI chat component | `components/ai-elements/<name>.md` |
| Modifying a domain component | `components/domain/<name>.md` |
| Changing tokens / globals.css | `tokens/token-reference.md` + relevant `foundations/` |
| Changing motion.ts | `foundations/motion.md` |
| Building a layout | Relevant `patterns/` file |
| Adding a new rule to eslint-plugin | `foundations/lint-rules.md` |

---

## Source-to-Spec Mapping

| Source path | Spec path |
|-------------|-----------|
| `src/components/ui/<name>.tsx` | `specs/components/ui/<name>.md` |
| `src/components/ai-elements/<name>.tsx` | `specs/components/ai-elements/<name>.md` |
| `src/components/<name>.tsx` (domain) | `specs/components/domain/<name>.md` |
| `src/app/globals.css` | `specs/tokens/token-reference.md` + `specs/foundations/` |
| `src/lib/motion.ts` | `specs/foundations/motion.md` |

---

## Foundations

| File | Description |
|------|-------------|
| `foundations/color.md` | Semantic color tokens, light/dark palettes, oklch values |
| `foundations/typography.md` | Font scale, line heights, weight tokens |
| `foundations/spacing.md` | 4px base grid, spacing scale (1-16) |
| `foundations/radius.md` | Border radius tokens (sm -> full) |
| `foundations/elevation.md` | Shadow tokens and elevation levels |
| `foundations/motion.md` | Animation presets, duration, easing (from motion.ts) |
| `foundations/z-index.md` | Z-index scale and layer names |
| `foundations/iconography.md` | Phosphor Icons usage, sizes, weights |
| `foundations/lint-rules.md` | ESLint rules in the custom design system plugin |

---

## Patterns

| File | Description |
|------|-------------|
| `patterns/layout-sidebar.md` | Sidebar navigation layout using shadcn Sidebar |
| `patterns/layout-content-container.md` | Page content width container (`<ContentContainer>`) |
| `patterns/card-grid.md` | Responsive card grid layouts |
| `patterns/empty-states.md` | Empty state using `<Empty>` component |
| `patterns/loading-states.md` | Skeleton loading patterns |
| `patterns/form-layout.md` | Form layout and field grouping |
| `patterns/modal-header-icon.md` | Modal header with icon/avatar pattern |
| `patterns/persona-variants.md` | Persona-aware UI rendering patterns |

---

## Freshness Enforcement

The pre-commit hook runs `npx tsx scripts/spec-freshness.ts` on staged files to detect stale or missing specs.

**Manual commands:**

```bash
# Full scan
npx tsx scripts/spec-freshness.ts

# Check specific files (lint-staged mode)
npx tsx scripts/spec-freshness.ts src/components/feed.tsx

# JSON output
npx tsx scripts/spec-freshness.ts --json

# Fail on any stale/missing
npx tsx scripts/spec-freshness.ts --strict
```

---

## Component Spec Template

When adding a new component, create `specs/components/{category}/<name>.md` using this structure:

```markdown
# ComponentName

> One-line description of what this component does.

## Metadata
- **Source:** `src/components/{path}/<name>.tsx`
- **Category:** ui | ai-elements | domain
- **Depends on:** [list shadcn/other components used]

## When to Use
- Use for X
- Don't use for Y (use OtherComponent instead)

## Anatomy
```tsx
<ComponentName variant="default" size="md">
  <ComponentNameSlot />
</ComponentName>
```

## Tailwind Classes
| Part | Classes |
|------|---------|
| Root | `flex items-center gap-2 ...` |

## Variants
| Variant | Description |
|---------|-------------|
| `default` | Standard appearance |

## States
| State | Behavior |
|-------|----------|
| hover | `hover:bg-primary/5` |
| disabled | `opacity-50 cursor-not-allowed` |

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | "default" | Visual style |

## Usage Example
```tsx
<ComponentName variant="default">Content</ComponentName>
```

## Common Mistakes
- Don't use raw Tailwind colors -- use semantic tokens
```
```
