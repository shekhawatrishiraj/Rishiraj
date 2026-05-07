# Elevation

## Overview

Elevation is expressed through Tailwind's default shadow scale. Shadows create visual hierarchy by indicating which surfaces are elevated above others. The project uses the standard Tailwind v4 shadow utilities.

## Scale / Tokens

| Tailwind Class | CSS Value | Use |
|---------------|-----------|-----|
| `shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle depth for small elements |
| `shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Buttons, badges, small cards |
| `shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Default card elevation |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Dropdowns, popovers, menus |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Dialogs, modals, FABs |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Elevated modals, feature panels |
| `shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | Maximum elevation, hero cards |
| `shadow-none` | `none` | Reset/remove shadow |

## Usage Guidelines

### By Component Type

| Component | Shadow | Notes |
|-----------|--------|-------|
| Card (flat) | `shadow-none` with `border` | Most cards use border, not shadow |
| Card (elevated) | `shadow-sm` | Used sparingly |
| Button (floating) | `shadow-sm` to `shadow-md` | FABs, floating actions |
| Dropdown / Popover | `shadow-md` | Standard floating UI |
| Dialog / Modal | `shadow-lg` | Primary overlay content |
| Sheet | `shadow-lg` | Side panels |
| Tooltip | None (uses `bg-foreground` contrast) | Relies on color, not shadow |
| Toast | `shadow-lg` | Floating notifications |

### Elevation Hierarchy

1. **Ground level** (`shadow-none`) -- Page background, inline content
2. **Raised** (`shadow-xs` / `shadow-sm`) -- Cards, buttons with depth
3. **Floating** (`shadow-md`) -- Dropdowns, popovers, menus
4. **Overlay** (`shadow-lg`) -- Dialogs, modals, sheets
5. **Top** (`shadow-xl` / `shadow-2xl`) -- Reserved for highest-priority overlays

### Hover Elevation

Interactive elevated elements can increase shadow on hover:
- `shadow-sm` -> `hover:shadow-md`
- `shadow-md` -> `hover:shadow-lg`

## Do / Don't

- **Do** pair shadows with appropriate `rounded-*` values
- **Do** use `border` instead of shadow for flat/grounded elements
- **Do** increase shadow on hover for clickable elevated elements
- **Don't** stack borders AND shadows unless intentional
- **Don't** use `shadow-2xl` for standard UI components
- **Don't** apply shadows to full-width containers (they look odd without rounded edges)

## Related

- [radius.md](radius.md) - Rounded corners pair with shadows
- [color.md](color.md) - Surface colors for elevated elements
- [z-index.md](z-index.md) - Z-index layering for overlapping elevated elements
