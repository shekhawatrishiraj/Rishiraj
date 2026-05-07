# Z-Index

## Overview

Z-index values control stacking order for overlapping elements. This spec documents the layering scale derived from actual codebase usage. The project uses Tailwind's `z-*` utilities.

## Scale / Tokens

### Layering Scale

| Layer | Z-Index | Tailwind Class | Use |
|-------|---------|---------------|-----|
| Base | `z-0` | `z-0` | Background elements, canvas layers |
| Raised | `z-10` | `z-10` | Sidebar, badges on avatars, action buttons on cards, resize handles, inline elevated elements |
| Sticky | `z-20` | `z-20` | Sticky headers, navigation bars, bottom bars |
| Feedback | `z-30` | `z-30` | FABs, feedback buttons |
| Annotation | `z-40` | `z-40` | Annotation overlays, celebration backgrounds |
| Overlay | `z-50` | `z-50` | Modals, dialogs, sheets, drawers, tooltips, popovers, dropdown menus, context menus, toasts, persona switcher, celebration foreground |
| Top | `z-[9999]` | `z-[9999]` | Selection toolbar, contextual floating UI that must be above everything |

### Current Usage Map

| Component | Z-Value | Purpose |
|-----------|---------|---------|
| Background canvas | `z-0` | New tab background layer |
| Sidebar | `z-10` | Main sidebar |
| Card action buttons | `z-10` | Delete/edit buttons on cards |
| Avatar badges | `z-10` | Status indicators on avatars |
| Resize handles | `z-10` | Widget card resize grip |
| Sticky headers | `z-20` | Page headers, tab bars, bottom navigation |
| Content overlays | `z-10` | Inline content above background |
| Feedback FAB | `z-30` | Floating feedback button |
| Annotation overlay | `z-40` | Annotation layer |
| Dialog overlay | `z-50` | Modal backdrop |
| Dialog content | `z-50` | Modal content |
| Drawer | `z-50` | Drawer overlay + content |
| Sheet | `z-50` | Sheet overlay + content |
| Tooltip | `z-50` | Tooltip content + arrow |
| Popover | `z-50` | Popover content |
| Dropdown menu | `z-50` | Menu content |
| Context menu | `z-50` | Right-click menu |
| Select menu | `z-50` | Select dropdown |
| Navigation menu | `z-50` | Nav menu viewport |
| Combobox | `z-50` | Combobox dropdown |
| Persona switcher | `z-50` | Persona floating UI |
| Celebration overlay | `z-40` bg / `z-50` content | Celebration page layers |
| Selection toolbar | `z-[9999]` | Text selection floating toolbar |
| Meeting floating UI | `z-[9999]` | Meeting contextual actions |

## Usage Guidelines

- Most floating UI (modals, popovers, tooltips, menus) shares `z-50`. This works because these elements are typically mutually exclusive or use Radix portal stacking.
- Sticky navigation uses `z-20` to stay above scrolling content but below floating UI.
- `z-10` is for elements that need to peek above siblings (badges, action buttons on cards).
- `z-[9999]` is an escape hatch for truly top-level floating UI. Use sparingly.

### Stacking Context

- Each `z-*` value creates a stacking context relative to its parent
- Radix primitives (Dialog, Popover, etc.) portal to `<body>`, so their `z-50` is at root level
- Inline `z-10`/`z-20` elements stack within their parent context

## Do / Don't

- **Do** use the standard scale values (`z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`)
- **Do** rely on Radix portal behavior for floating UI stacking
- **Do** keep sticky headers at `z-20` consistently
- **Don't** use arbitrary z-index values (e.g., `z-[100]`, `z-[999]`) except for the established `z-[9999]` pattern
- **Don't** use z-index on elements that don't need stacking context
- **Don't** fight z-index wars by incrementing values; restructure DOM instead

## Related

- [elevation.md](elevation.md) - Shadows indicate visual elevation, z-index controls stacking
- [motion.md](motion.md) - Animated overlays need correct z-index
