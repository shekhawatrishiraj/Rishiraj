# Color

## Overview

All colors use the OKLCh color space for perceptual uniformity. Tokens are defined as CSS custom properties in `globals.css` and mapped to Tailwind via `@theme inline`. Light and dark modes are supported via `:root` and `.dark` selectors.

## Scale / Tokens

### Backgrounds

| Token | Tailwind Class | Light | Dark | Use |
|-------|---------------|-------|------|-----|
| `--background` | `bg-background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--card` | `bg-card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Card surfaces |
| `--popover` | `bg-popover` | `oklch(1 0 0)` | `oklch(0.269 0 0)` | Popover/dropdown surfaces |
| `--muted` | `bg-muted` | `oklch(0.972 0 0)` | `oklch(0.269 0 0)` | Subtle backgrounds, disabled states |
| `--accent` | `bg-accent` | `oklch(0.985 0 0)` | `oklch(0.371 0 0)` | Hover/active backgrounds |
| `--secondary` | `bg-secondary` | `oklch(1 0 0)` | `oklch(0.269 0 0)` | Secondary surfaces |
| `--user-message` | `bg-user-message` | `oklch(0.97 0.01 277)` | `oklch(0.25 0.02 277)` | User chat message bubbles |

### Foregrounds

| Token | Tailwind Class | Light | Dark | Use |
|-------|---------------|-------|------|-----|
| `--foreground` | `text-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Primary text |
| `--card-foreground` | `text-card-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on cards |
| `--popover-foreground` | `text-popover-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text in popovers |
| `--muted-foreground` | `text-muted-foreground` | `oklch(0.544 0.035 265.116)` | `oklch(0.708 0 0)` | Secondary/subdued text |
| `--accent-foreground` | `text-accent-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on accent bg |
| `--secondary-foreground` | `text-secondary-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` | Text on secondary bg |

### Primary / Brand

| Token | Tailwind Class | Light | Dark | Use |
|-------|---------------|-------|------|-----|
| `--primary` | `bg-primary` / `text-primary` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` | Primary actions, brand accents |
| `--primary-foreground` | `text-primary-foreground` | `oklch(1 0 0)` | `oklch(0.257 0.086 281.289)` | Text on primary bg |
| `--ring` | `ring-ring` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` | Focus ring color |

### Borders & Inputs

| Token | Tailwind Class | Light | Dark | Use |
|-------|---------------|-------|------|-----|
| `--border` | `border-border` | `oklch(0.935 0.006 264.518)` | `oklch(1 0 0 / 10%)` | Default borders |
| `--input` | `border-input` | `oklch(0.935 0.006 264.518)` | `oklch(1 0 0 / 15%)` | Input field borders |

### Status Colors

| Token | Tailwind Class | Light | Dark | Use |
|-------|---------------|-------|------|-----|
| `--destructive` | `bg-destructive` | `oklch(0.622 0.222 28.994)` | `oklch(0.704 0.191 22.216)` | Errors, delete actions |
| `--destructive-foreground` | `text-destructive-foreground` | `oklch(1 0 0)` | `oklch(0.985 0 0)` | Text on destructive bg |
| `--destructive-surface` | `bg-destructive-surface` | `oklch(0.622 0.222 28.994 / 10%)` | `oklch(0.704 0.191 22.216 / 15%)` | Subtle error backgrounds |
| `--success` | `bg-success` | `oklch(0.546 0.145 160.785)` | `oklch(0.546 0.145 160.785)` | Success states |
| `--success-foreground` | `text-success-foreground` | `oklch(1 0 0)` | `oklch(1 0 0)` | Text on success bg |
| `--success-hover` | `bg-success-hover` | `oklch(0.486 0.132 160.801)` | `oklch(0.618 0.155 160.785)` | Success button hover |
| `--success-surface` | `bg-success-surface` | `oklch(0.546 0.145 160.785 / 10%)` | `oklch(0.546 0.145 160.785 / 15%)` | Subtle success backgrounds |
| `--warning` | `bg-warning` | `oklch(0.769 0.188 70.08)` | `oklch(0.769 0.188 70.08)` | Warning states |
| `--warning-foreground` | `text-warning-foreground` | `oklch(0.534 0.165 49.769)` | `oklch(0.852 0.199 83.87)` | Text on/with warning |
| `--warning-muted` | `bg-warning-muted` | `oklch(0.769 0.188 70.08 / 40%)` | `oklch(0.769 0.188 70.08 / 40%)` | Subdued warning (border use) |
| `--warning-surface` | `bg-warning-surface` | `oklch(0.769 0.188 70.08 / 10%)` | `oklch(0.769 0.188 70.08 / 15%)` | Subtle warning backgrounds |
| `--info` | `bg-info` | `oklch(0.577 0.189 243.254)` | `oklch(0.577 0.189 243.254)` | Informational states |
| `--info-foreground` | `text-info-foreground` | `oklch(1 0 0)` | `oklch(1 0 0)` | Text on info bg |
| `--info-surface` | `bg-info-surface` | `oklch(0.577 0.189 243.254 / 10%)` | `oklch(0.577 0.189 243.254 / 15%)` | Subtle info backgrounds |

### Chart Colors

| Token | Tailwind Class | Light | Dark |
|-------|---------------|-------|------|
| `--chart-1` | `text-chart-1` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` |
| `--chart-2` | `text-chart-2` | `oklch(0.694 0.169 154.946)` | `oklch(0.696 0.17 162.48)` |
| `--chart-3` | `text-chart-3` | `oklch(0.572 0.208 258.932)` | `oklch(0.769 0.188 70.08)` |
| `--chart-4` | `text-chart-4` | `oklch(0.49 0.227 295.686)` | `oklch(0.627 0.265 303.9)` |
| `--chart-5` | `text-chart-5` | `oklch(0.765 0.172 63.086)` | `oklch(0.645 0.246 16.439)` |

### Sidebar Colors

| Token | Tailwind Class | Light | Dark |
|-------|---------------|-------|------|
| `--sidebar` | `bg-sidebar` | `oklch(0.972 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `text-sidebar-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `text-sidebar-primary` | `oklch(0.457 0.215 277.027)` | `oklch(0.785 0.104 274.711)` |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | `oklch(1 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `bg-sidebar-accent` | `oklch(0.93 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` | `oklch(0.21 0.034 263.441)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `border-sidebar-border` | `oklch(0.943 0.006 264.518)` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `ring-sidebar-ring` | `oklch(0.457 0.215 277.027)` | `oklch(0.439 0 0)` |

### Overlay Colors

| Token | Tailwind Class | Light | Dark | Use |
|-------|---------------|-------|------|-----|
| `--overlay` | `bg-overlay` | `oklch(0 0 0 / 50%)` | `oklch(0 0 0 / 70%)` | Modal/dialog backdrops |
| `--photo-overlay` | `bg-photo-overlay` | `oklch(0 0 0 / 75%)` | `oklch(0 0 0 / 75%)` | Photo/media overlays |
| `--photo-overlay-hover` | `bg-photo-overlay-hover` | `oklch(0 0 0 / 80%)` | `oklch(0 0 0 / 80%)` | Photo overlay hover |

## Usage Guidelines

- Use semantic tokens, never raw OKLCh values in components
- `foreground` / `muted-foreground` covers 90% of text needs
- Use `*-surface` tokens for subtle status backgrounds (banners, badges)
- Chart colors are pre-sequenced; use `chart-1` through `chart-5` in order
- Dark mode values auto-apply via `.dark` class on `<html>`

## Do / Don't

- **Do** use `text-muted-foreground` for secondary text
- **Do** use `bg-destructive-surface` for error banners (not full `bg-destructive`)
- **Don't** hardcode hex/rgb/oklch values in components
- **Don't** use `bg-primary` for large surfaces (it's for buttons/badges)
- **Don't** mix status color categories (e.g., destructive color for warnings)

## Related

- [typography.md](typography.md) - Text color pairings
- [elevation.md](elevation.md) - Shadow + surface combinations
