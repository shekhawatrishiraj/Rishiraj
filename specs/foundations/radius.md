# Radius

## Overview

Border radius tokens are defined in `globals.css` with a base `--radius` value of `0.625rem` (10px). All other radius values are computed relative to this base. These tokens are mapped to Tailwind via `@theme inline`.

## Scale / Tokens

| Token | Formula | Computed Value | Tailwind Class | Use |
|-------|---------|---------------|---------------|-----|
| `--radius-sm` | `var(--radius) - 4px` | `~6px` | `rounded-sm` | Checkboxes, small badges, inner elements |
| `--radius-md` | `var(--radius) - 2px` | `~8px` | `rounded-md` | Buttons, inputs, dropdowns |
| `--radius` (base) | `0.625rem` | `10px` | -- | Base reference (not used directly) |
| `--radius-lg` | `var(--radius)` | `10px` | `rounded-lg` | Cards, popovers, list items |
| `--radius-xl` | `var(--radius) + 4px` | `14px` | `rounded-xl` | Dialogs, large cards |
| `--radius-2xl` | `var(--radius) + 8px` | `18px` | `rounded-2xl` | Modals, panels |
| `--radius-3xl` | `var(--radius) + 12px` | `22px` | `rounded-3xl` | Feature cards, hero elements |
| `--radius-4xl` | `var(--radius) + 16px` | `26px` | `rounded-4xl` | Large decorative containers |
| `rounded-full` | `9999px` | `9999px` | `rounded-full` | Avatars, pills, circular buttons |

## Usage Guidelines

### By Component Type

| Component | Radius |
|-----------|--------|
| Checkbox | `rounded-sm` |
| Badge | `rounded-sm` to `rounded-md` |
| Button | `rounded-md` |
| Input / Select | `rounded-md` |
| Dropdown menu | `rounded-md` |
| Card | `rounded-lg` |
| Popover | `rounded-md` |
| Tooltip | `rounded-md` |
| Dialog / Modal | `rounded-lg` |
| Sheet | `rounded-lg` (on visible edge) |
| Avatar | `rounded-full` |
| Pill / Tag | `rounded-full` |
| Icon button (circular) | `rounded-full` |

### Nesting Rule

When elements are nested (e.g., a button inside a card), the inner element should use a smaller radius than the outer to maintain visual consistency. The gap between the inner element and outer boundary affects which radius to choose.

## Do / Don't

- **Do** use token-based radius classes (`rounded-md`, `rounded-lg`, etc.)
- **Do** match radius to component purpose (interactive = `md`, container = `lg`)
- **Don't** use arbitrary radius values like `rounded-[7px]`
- **Don't** use `rounded-full` on rectangular containers (only circles/pills)
- **Don't** use a larger radius on inner elements than on their parent container

## Related

- [spacing.md](spacing.md) - Padding interacts with perceived radius
- [elevation.md](elevation.md) - Shadows pair with radius on elevated surfaces
