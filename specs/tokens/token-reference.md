# Token Reference -- Master Map

> Single source of truth for all design tokens. Consult before writing any UI code.

---

## How Tokens Work (3-Layer Indirection)

```
Layer 1: CSS variables in :root / .dark         (globals.css)
Layer 2: @theme inline maps CSS vars -> Tailwind  (globals.css @theme block)
Layer 3: Tailwind utility classes consume theme    (bg-primary, text-muted-foreground, etc.)
```

**Example flow:**
```
:root { --primary: oklch(0.457 0.215 277.027); }
        |
@theme inline { --color-primary: var(--primary); }
        |
Tailwind class: bg-primary, text-primary, border-primary
```

---

## Color Tokens

### Core Semantic Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--background` | `bg-background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page/app background |
| `--foreground` | `text-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Default text color |
| `--card` | `bg-card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Card surfaces |
| `--card-foreground` | `text-card-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on cards |
| `--popover` | `bg-popover` | `oklch(1 0 0)` | `oklch(0.269 0 0)` | Popover/dropdown surfaces |
| `--popover-foreground` | `text-popover-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text in popovers |
| `--primary` | `bg-primary`, `text-primary` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` | Primary actions, brand color |
| `--primary-foreground` | `text-primary-foreground` | `oklch(1 0 0)` | `oklch(0.257 0.086 281.289)` | Text on primary backgrounds |
| `--secondary` | `bg-secondary` | `oklch(1 0 0)` | `oklch(0.269 0 0)` | Secondary actions, subtle backgrounds |
| `--secondary-foreground` | `text-secondary-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on secondary backgrounds |
| `--muted` | `bg-muted` | `oklch(0.972 0 0)` | `oklch(0.269 0 0)` | Muted/disabled surfaces |
| `--muted-foreground` | `text-muted-foreground` | `oklch(0.544 0.035 265.116)` | `oklch(0.708 0 0)` | Subdued text, placeholders, captions |
| `--accent` | `bg-accent` | `oklch(0.985 0 0)` | `oklch(0.371 0 0)` | Hover/active states, subtle highlights |
| `--accent-foreground` | `text-accent-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on accent backgrounds |
| `--destructive` | `bg-destructive`, `text-destructive` | `oklch(0.622 0.222 28.994)` | `oklch(0.704 0.191 22.216)` | Errors, delete actions, danger states |
| `--destructive-foreground` | `text-destructive-foreground` | `oklch(1 0 0)` | `oklch(0.985 0 0)` | Text on destructive backgrounds |

### Border & Input Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--border` | `border-border` | `oklch(0.935 0.006 264.518)` | `oklch(1 0 0 / 10%)` | Default borders |
| `--input` | `border-input` | `oklch(0.935 0.006 264.518)` | `oklch(1 0 0 / 15%)` | Input field borders |
| `--ring` | `ring-ring` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` | Focus rings |

### Status Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--success` | `bg-success`, `text-success` | `oklch(0.546 0.145 160.785)` | `oklch(0.546 0.145 160.785)` | Success states |
| `--success-foreground` | `text-success-foreground` | `oklch(1 0 0)` | `oklch(1 0 0)` | Text on success backgrounds |
| `--success-hover` | `bg-success-hover` | `oklch(0.486 0.132 160.801)` | `oklch(0.618 0.155 160.785)` | Success button hover |
| `--success-surface` | `bg-success-surface` | `oklch(0.546 0.145 160.785 / 10%)` | `oklch(0.546 0.145 160.785 / 15%)` | Subtle success background (badges, alerts) |
| `--warning` | `bg-warning`, `text-warning` | `oklch(0.769 0.188 70.08)` | `oklch(0.769 0.188 70.08)` | Warning states |
| `--warning-foreground` | `text-warning-foreground` | `oklch(0.534 0.165 49.769)` | `oklch(0.852 0.199 83.87)` | Text on warning backgrounds |
| `--warning-muted` | `bg-warning-muted` | `oklch(0.769 0.188 70.08 / 40%)` | `oklch(0.769 0.188 70.08 / 40%)` | Subtle warning indicator |
| `--info` | `bg-info`, `text-info` | `oklch(0.577 0.189 243.254)` | `oklch(0.577 0.189 243.254)` | Informational states |
| `--info-foreground` | `text-info-foreground` | `oklch(1 0 0)` | `oklch(1 0 0)` | Text on info backgrounds |
| `--info-surface` | `bg-info-surface` | `oklch(0.577 0.189 243.254 / 10%)` | `oklch(0.577 0.189 243.254 / 15%)` | Subtle info background (badges, alerts) |
| `--destructive-surface` | `bg-destructive-surface` | `oklch(0.622 0.222 28.994 / 10%)` | `oklch(0.704 0.191 22.216 / 15%)` | Subtle destructive background (badges, alerts) |

### Overlay Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--overlay` | `bg-overlay` | `oklch(0 0 0 / 50%)` | `oklch(0 0 0 / 70%)` | Modal/dialog backdrop |
| `--photo-overlay` | `bg-photo-overlay` | `oklch(0 0 0 / 75%)` | `oklch(0 0 0 / 75%)` | Image overlay (lightbox, gallery) |
| `--photo-overlay-hover` | `bg-photo-overlay-hover` | `oklch(0 0 0 / 80%)` | `oklch(0 0 0 / 80%)` | Image overlay hover state |

### Chat Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--user-message` | `bg-user-message` | `oklch(0.97 0.01 277)` | `oklch(0.25 0.02 277)` | User message bubble background |

### Chart Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--chart-1` | `bg-chart-1`, `text-chart-1` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` | Chart series 1 (matches primary) |
| `--chart-2` | `bg-chart-2`, `text-chart-2` | `oklch(0.694 0.169 154.946)` | `oklch(0.696 0.17 162.48)` | Chart series 2 |
| `--chart-3` | `bg-chart-3`, `text-chart-3` | `oklch(0.572 0.208 258.932)` | `oklch(0.769 0.188 70.08)` | Chart series 3 |
| `--chart-4` | `bg-chart-4`, `text-chart-4` | `oklch(0.49 0.227 295.686)` | `oklch(0.627 0.265 303.9)` | Chart series 4 |
| `--chart-5` | `bg-chart-5`, `text-chart-5` | `oklch(0.765 0.172 63.086)` | `oklch(0.645 0.246 16.439)` | Chart series 5 |

### Sidebar Colors

| CSS Variable | Tailwind Class | Light Value | Dark Value | Usage |
|---|---|---|---|---|
| `--sidebar` | `bg-sidebar` | `oklch(0.972 0 0)` | `oklch(0.205 0 0)` | Sidebar background |
| `--sidebar-foreground` | `text-sidebar-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Sidebar text |
| `--sidebar-primary` | `bg-sidebar-primary`, `text-sidebar-primary` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` | Active/selected item in sidebar |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | `oklch(1 0 0)` | `oklch(0.985 0 0)` | Text on sidebar primary bg |
| `--sidebar-accent` | `bg-sidebar-accent` | `oklch(0.93 0 0)` | `oklch(0.269 0 0)` | Sidebar hover/highlight |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on sidebar accent bg |
| `--sidebar-border` | `border-sidebar-border` | `oklch(0.943 0.006 264.518)` | `oklch(1 0 0 / 10%)` | Sidebar borders/dividers |
| `--sidebar-ring` | `ring-sidebar-ring` | `oklch(0.457 0.215 277.027)` | `oklch(0.439 0 0)` | Sidebar focus ring |

---

## Typography Tokens

### Font Families

| Token | Tailwind Class | Value | Usage |
|---|---|---|---|
| `--font-sans` | `font-sans` | `"Google Sans", var(--font-geist-sans)` | Default body/UI font |
| `--font-mono` | `font-mono` | `var(--font-geist-mono)` | Code blocks, technical content |

### Custom Text Sizes

| Token | Tailwind Class | Size | Line Height | Usage |
|---|---|---|---|---|
| `--text-2xs` | `text-2xs` | `0.625rem` (10px) | `1.4` | Micro labels, badges, legal text |
| `--text-xs-plus` | `text-xs-plus` | `0.6875rem` (11px) | `~1.4545` | Small UI labels, between xs and 2xs |

### Standard Tailwind Text Scale (for reference)

| Tailwind Class | Size | Default Line Height |
|---|---|---|
| `text-xs` | `0.75rem` (12px) | `1rem` |
| `text-sm` | `0.875rem` (14px) | `1.25rem` |
| `text-base` | `1rem` (16px) | `1.5rem` |
| `text-lg` | `1.125rem` (18px) | `1.75rem` |
| `text-xl` | `1.25rem` (20px) | `1.75rem` |
| `text-2xl` | `1.5rem` (24px) | `2rem` |
| `text-3xl` | `1.875rem` (30px) | `2.25rem` |
| `text-4xl` | `2.25rem` (36px) | `2.5rem` |

---

## Radius Tokens

Base radius: `--radius: 0.625rem` (10px)

| Token | Tailwind Class | Computed Value | Usage |
|---|---|---|---|
| `--radius-sm` | `rounded-sm` | `calc(0.625rem - 4px)` = ~6px | Small elements (badges, chips) |
| `--radius-md` | `rounded-md` | `calc(0.625rem - 2px)` = ~8px | Inputs, buttons |
| `--radius-lg` | `rounded-lg` | `0.625rem` = 10px | Cards, dialogs |
| `--radius-xl` | `rounded-xl` | `calc(0.625rem + 4px)` = ~14px | Large cards, panels |
| `--radius-2xl` | `rounded-2xl` | `calc(0.625rem + 8px)` = ~18px | Hero sections, large containers |
| `--radius-3xl` | `rounded-3xl` | `calc(0.625rem + 12px)` = ~22px | Prominent UI elements |
| `--radius-4xl` | `rounded-4xl` | `calc(0.625rem + 16px)` = ~26px | Extra-large rounded surfaces |

---

## Spacing Tokens

Tailwind's default spacing scale is used. No custom spacing tokens are defined.

| Class Pattern | Scale | Examples |
|---|---|---|
| `{p\|m\|gap\|w\|h}-{n}` | `n * 0.25rem` | `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px |
| Fractional | -- | `p-0.5` = 2px, `p-1.5` = 6px, `p-2.5` = 10px, `p-3.5` = 14px |

Common spacing values used in the project:

| Value | Tailwind | Pixels | Typical Use |
|---|---|---|---|
| `0.5` | `p-0.5` | 2px | Micro spacing, icon padding |
| `1` | `p-1` | 4px | Tight internal padding |
| `1.5` | `p-1.5` | 6px | Compact element spacing |
| `2` | `p-2` | 8px | Standard internal padding |
| `3` | `p-3` | 12px | Component internal padding |
| `4` | `p-4` | 16px | Section padding, card padding |
| `6` | `p-6` | 24px | Large section padding |
| `8` | `p-8` | 32px | Page-level padding |

---

## Custom Tokens

### Animations (defined in globals.css)

| Animation Name | Class / Usage | Description |
|---|---|---|
| `speech` | `.waveform-bar` | Speech waveform bars -- irregular bursts with pauses |
| `thinking-dot` | Thinking indicator | Pulsing dots for AI "thinking" state |
| `tile-jiggle` | `.tile-jiggle` | iOS-style wobble for edit mode |
| `shimmer` | Shimmer effect | Translate-based shimmer for attention |
| `border-rotate` | `--border-angle` custom property | Rotating border gradient animation |
| `fade-in` | Entrance animation | Fade up 4px on mount |
| `pulse-subtle` | `.animate-pulse-subtle` | Subtle primary-colored box-shadow pulse (10 cycles) |

### Custom CSS Properties

| Property | Syntax | Initial | Usage |
|---|---|---|---|
| `--border-angle` | `<angle>` | `0deg` | Used by `border-rotate` animation for conic gradients |

### Reduced Motion

All custom animations respect `prefers-reduced-motion: reduce`:
- `.waveform-bar` -- animation disabled, static scaleY(0.6)
- `.tile-jiggle` -- animation disabled
- `.animate-pulse-subtle` -- animation disabled

---

## Base Layer Defaults

Defined in `@layer base` in globals.css:

| Selector | Applied Styles | Effect |
|---|---|---|
| `html` | `scrollbar-gutter: stable` | Prevents layout shift on scrollbar appearance |
| `*` | `border-border outline-ring/50` | All elements default to semantic border + ring colors |
| `body` | `bg-background text-foreground` | Base page colors |
| `a` | `no-underline hover:no-underline` | Links have no underline by default |
| `a, button, [role="button"], [type="button"], [type="submit"], [type="reset"]` | `cursor: pointer` | All interactive elements show pointer cursor |

---

## Forbidden Patterns

These patterns MUST NOT be used. Always use semantic tokens instead.

| Forbidden | Use Instead | Why |
|---|---|---|
| Hex colors (`#fff`, `#000`, `#6366f1`) | Semantic token classes (`bg-background`, `text-primary`) | Breaks theming, no dark mode support |
| Raw Tailwind palette (`bg-gray-100`, `text-red-500`, `bg-blue-600`) | Semantic tokens (`bg-muted`, `text-destructive`, `bg-primary`) | Bypasses design system, inconsistent |
| `bg-white` / `bg-black` | `bg-background` / `text-foreground` | Does not adapt to light/dark mode |
| `text-white` / `text-black` | `text-primary-foreground` or appropriate `-foreground` token | Does not adapt to light/dark mode |
| Raw oklch values in components | CSS variable reference or Tailwind class | Duplicates values, hard to maintain |
| Arbitrary values (`bg-[#hex]`, `text-[14px]`) when a token exists | Matching token class (`bg-primary`, `text-sm`) | Bypasses design system |
| `rounded-[10px]` or hardcoded border-radius | `rounded-lg` (matches --radius base) | Use the radius scale |
| Inline `opacity` on colors | Use token variants with built-in opacity (e.g., `--overlay`) or Tailwind opacity modifiers (`bg-primary/50`) | Maintains consistency |

---

## Quick Reference: Common Pairings

| Surface | Text | Border | Use Case |
|---|---|---|---|
| `bg-background` | `text-foreground` | `border-border` | Default page content |
| `bg-card` | `text-card-foreground` | `border-border` | Cards, panels |
| `bg-popover` | `text-popover-foreground` | `border-border` | Dropdowns, tooltips |
| `bg-primary` | `text-primary-foreground` | -- | Primary buttons |
| `bg-secondary` | `text-secondary-foreground` | `border-border` | Secondary buttons |
| `bg-muted` | `text-muted-foreground` | -- | Disabled states, subtle surfaces |
| `bg-accent` | `text-accent-foreground` | -- | Hover states, highlights |
| `bg-destructive` | `text-destructive-foreground` | -- | Danger buttons |
| `bg-success` | `text-success-foreground` | -- | Success buttons |
| `bg-success-surface` | `text-success` | -- | Subtle success indicators |
| `bg-destructive-surface` | `text-destructive` | -- | Subtle error indicators |
| `bg-info-surface` | `text-info` | -- | Subtle info indicators |
| `bg-sidebar` | `text-sidebar-foreground` | `border-sidebar-border` | Sidebar layout |
| `bg-user-message` | `text-foreground` | -- | Chat user bubbles |
