# Design System Lint Rules

## Overview
Custom ESLint plugin (`eslint-plugin/`) enforcing design token usage, approved patterns, and component consistency. 9 rules total. Runs on pre-commit via lint-staged.

**Run manually:** `npm run lint:design`
**JSON report:** `npm run lint:design:report`

## Configuration
- Config: `eslint.config.mjs`
- Plugin: `eslint-plugin/index.js`
- Rules: `eslint-plugin/rules/`
- Excluded: `src/components/ui/**` (shadcn primitives)

## Rules Reference

### 1. `no-hardcoded-colors` (error)
**Prevents:** `#hex`, `rgb()`, `rgba()`, `oklch()` in className arbitrary values.
**Allows:** CSS variable references like `bg-[var(--my-token)]`.

```tsx
// ❌ Bad
<div className="bg-[#ff0000]" />
<div className="text-[oklch(0.5 0.2 240)]" />

// ✅ Good
<div className="bg-destructive" />
<div className="bg-[var(--my-custom-token)]" />
```

### 2. `no-raw-scale-colors` (error)
**Prevents:** Tailwind color scale classes (`bg-red-500`, `text-emerald-600`).
**Use:** Semantic tokens (`bg-destructive`, `bg-success`, `text-primary`).

```tsx
// ❌ Bad
<div className="bg-red-500 text-gray-600" />

// ✅ Good
<div className="bg-destructive text-muted-foreground" />
```

### 3. `no-banned-arbitrary-font-sizes` (error)
**Prevents:** Arbitrary font sizes that have token equivalents.
**Mapping:**
| Banned | Use instead |
|--------|-------------|
| `text-[10px]` / `text-[0.625rem]` | `text-2xs` |
| `text-[11px]` / `text-[0.6875rem]` | `text-xs-plus` |

```tsx
// ❌ Bad
<span className="text-[10px]">Small</span>

// ✅ Good
<span className="text-2xs">Small</span>
```

### 4. `approved-hover-patterns` (error)
**Prevents:** Unapproved `hover:bg-*` classes.
**Whitelist:** Defined in `eslint-plugin/rules/approved-hover-patterns.js`.

Common approved patterns:
- `hover:bg-accent`, `hover:bg-muted`, `hover:bg-transparent`
- `hover:bg-primary/5`, `hover:bg-primary/10`, `hover:bg-primary/20`
- `hover:bg-destructive/10`, `hover:bg-destructive/80`
- `hover:bg-sidebar-accent`, `hover:bg-background`

Dark-surface files (persona-switcher, terminal, annotation-overlay, dev/) allow `hover:bg-white/*`.

### 5. `no-inline-color-styles` (error)
**Prevents:** Inline `style={{ color: "#fff" }}` and similar hardcoded color styles.

```tsx
// ❌ Bad
<div style={{ color: "#fff", backgroundColor: "rgb(0,0,0)" }} />

// ✅ Good
<div className="text-foreground bg-background" />
```

### 6. `no-raw-container-width` (error)
**Prevents:** Raw Tailwind max-width classes for page containers (`max-w-4xl` through `max-w-7xl`, `max-w-screen-*`).
**Use:** `<ContentContainer>` or `max-w-(--max-w-content)`.
**Allows:** Small widths (`max-w-sm`, `max-w-md`, `max-w-lg`) for dialogs/popovers.

```tsx
// ❌ Bad
<div className="max-w-5xl mx-auto" />

// ✅ Good
<ContentContainer>...</ContentContainer>
<div className="max-w-(--max-w-content) mx-auto" />
```

### 7. `no-inline-empty-state` (warning)
**Prevents:** Hand-rolled empty state containers using `border-dashed` + `flex-col` + centering.
**Use:** `<Empty>` component from `@/components/ui/empty`.

```tsx
// ❌ Bad
<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
  <p className="text-sm text-muted-foreground">No items</p>
</div>

// ✅ Good
<Empty>
  <EmptyIcon><SparkleIcon size={32} /></EmptyIcon>
  <EmptyTitle>No items</EmptyTitle>
  <EmptyDescription>Add items to see them here.</EmptyDescription>
</Empty>
```

See: [Empty States Pattern](../patterns/empty-states.md)

### 8. `text-xs-line-height` (warning)
**Prevents:** `text-xs` on multi-line elements without an explicit `leading-*` class.
**Use:** Add `leading-normal` (1.5 ratio) to `text-xs` descriptions and multi-line content.

```tsx
// ❌ Bad
<p className="text-xs">Long description that wraps to multiple lines</p>

// ✅ Good
<p className="text-xs leading-normal">Long description that wraps to multiple lines</p>
```

### 9. `no-dots-three-horizontal` (error)
**Prevents:** Importing `DotsThreeIcon` from `@phosphor-icons/react`.
**Use:** `DotsThreeVerticalIcon` — the vertical three-dots (⋮) is the standard across the design system.
**Auto-fixable:** Yes — rewrites the import specifier automatically.

```tsx
// ❌ Bad
import { DotsThreeIcon } from "@phosphor-icons/react";
<DotsThreeIcon size={16} weight="bold" />

// ✅ Good
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
<DotsThreeVerticalIcon size={16} weight="bold" />
```

## File Exclusions

| Excluded path | Reason |
|---------------|--------|
| `src/components/ui/**` | shadcn primitives — raw Tailwind allowed |
| `src/app/globals.css` | Token definitions |
| `src/**/celebration/**` | Confetti canvas — intentionally raw |
| `src/components/persona-switcher.tsx` | Dev tool — dark surface |
| `src/components/annotation-overlay.tsx` | Dev tool — dark surface |
| `src/components/feedback-fab.tsx` | Dev tool — dark button |
| `src/app/dev/**` | Dev tools |
| `src/components/ai-elements/terminal.tsx` | Terminal — dark surface |

## Adding a New Rule

1. Create rule file in `eslint-plugin/rules/<rule-name>.js`
2. Register in `eslint-plugin/index.js`
3. Enable in `eslint.config.mjs` under the `design-system` plugin rules
4. Update this spec
5. Run `npm run lint:design` to verify
