---
title: Responsive & Mobile Design
impact: MEDIUM
impactDescription: Breakpoint strategy, thumb zones, touch vs mouse, mobile-first patterns
tags: responsive, mobile, breakpoint, touch, thumb, small-screen, layout-shift, tap-target
---

# Responsive & Mobile Design

> **Load when**: `responsive`, `mobile`, `breakpoint`, `touch`, `thumb`, `small screen`, `layout shift`, `tap target`, `phone`, `tablet`

---

## The Core Problem

Most product designers design desktop-first and adapt mobile as an afterthought. The result: interactions that only work with a mouse, layouts that break at small widths, and content that deprioritizes wrong.

**Better approach**: Design constraints mobile-first → you'll make better decisions for all sizes.

---

## Breakpoint Strategy

| Breakpoint | Target | Key Behavior Changes |
|------------|--------|----------------------|
| `< 640px` (sm) | Phone | Single column, bottom nav, full-width cards, larger tap targets |
| `640–1024px` (md) | Tablet | 2 columns, sidebar optional, hybrid touch/mouse |
| `1024–1280px` (lg) | Laptop | Full layout, hover interactions viable |
| `> 1280px` (xl) | Desktop | Wider content areas, dense data tables |

**Rule**: Design for sm and lg. Everything in between adapts. Never just design for xl and hope.

---

## Thumb Zones

On phones, thumbs reach different areas with different ease:

| Zone | Reach | Use For |
|------|-------|---------|
| **Green** — bottom center | Easy, natural | Primary actions, tab bar, FAB |
| **Yellow** — middle | Stretch | Secondary actions, cards |
| **Red** — top, corners | Hard | Non-critical content only |

**Implication**: Bottom navigation beats top navigation on mobile. CTAs belong at the bottom of the screen, not the top.

---

## Touch Targets

| Rule | Detail |
|------|--------|
| Minimum tap target | 44×44px (WCAG + Apple HIG + cross-ref `ux-laws.md`) |
| Minimum for small controls | 32×32px with 8px spacing between targets |
| Spacing between targets | At least 8px to prevent mis-taps |
| Icon buttons on mobile | Always 44×44px hit area even if icon is 20px visual |

**Common mistake**: Icon-only buttons look right at 20px in Figma but are untappable on a device.

---

## Navigation Patterns by Screen Size

| Desktop | Mobile Equivalent |
|---------|-------------------|
| Left sidebar (full labels) | Bottom tab bar (≤5 items) |
| Top nav | Hamburger → slide-out drawer |
| Breadcrumbs | Back button + current page title |
| Hover dropdown | Tap to expand in-page or full-screen menu |
| Dense data table | Cards or simplified columns with detail tap |

**Rule**: If sidebar has >5 items, bottom nav won't fit. Use drawer pattern or reorganize hierarchy.

---

## Content Priority at Breakpoints

Not all content shrinks equally — some must be hidden, some must be promoted.

| Content | Desktop | Mobile |
|---------|---------|--------|
| Primary action | Top of page | Sticky at bottom |
| Secondary filters | Inline | Hidden behind filter icon |
| Metadata columns (table) | All visible | Show 2–3 critical columns; rest on tap |
| Navigation labels | Full text | Icons + label or icons only |
| Dense stats/charts | Inline | Horizontal scroll or stacked |
| Contextual sidebars | Right column | Sheet drawer or removed |

**Question**: If you removed 60% of the content at mobile, which 40% must survive?

---

## Hover Interactions on Touch

Every hover interaction needs a touch-accessible alternative:

| Hover Pattern | Touch Alternative |
|---------------|-------------------|
| Hover to reveal actions | Tap to reveal (toggle) or swipe-to-reveal |
| Tooltip on hover | Tap `?` icon for tooltip or inline help text |
| Hover highlight on table row | Always-visible row affordance or tap to select |
| Dropdown on hover | Tap to open |
| Preview on hover | Tap to expand inline |

**Red flag**: "Hover to reveal" buttons in tables = invisible on touch devices.

---

## Typography on Mobile

| Rule | Detail |
|------|--------|
| Minimum readable body size | 16px (prevents iOS auto-zoom on focus) |
| Line length | 60–75 chars on desktop → 35–55 chars on mobile |
| Line height | Same `leading-normal` (1.5) rule applies |
| Heading scale | Reduce heading sizes at mobile — 32px h1 on desktop → 24px on mobile |

**Trap**: `<input>` with `font-size < 16px` triggers iOS zoom on focus. Always 16px+ on inputs.

---

## Layout Shift Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Fixed pixel widths | Overflow on small screens | Use `max-w` + `w-full` |
| Absolute positioned elements | Overlap at small widths | Reflow to relative |
| Multi-column forms | Break scanning on mobile | Single column always (see `forms.md`) |
| Truncation not tested | Text clips or overflows | Test with long names + short names |
| Image `width=100%` without `aspect-ratio` | Layout shift on load | Reserve space with aspect-ratio |

---

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Design only desktop, scale down for mobile | Core interactions break when hover-dependent |
| Put primary CTA at top-right on mobile | Thumb can't reach it comfortably |
| Use horizontal scroll for main nav | Discoverability fails — items off-screen are invisible |
| Bottom sheet for complex multi-step flows | Use full page instead |
| Tiny close X at top-right corner of modal | Hardest area to tap — move or enlarge |
| Different core features at different sizes | Mobile users need core functionality too |

---

## Review Questions

**Primary question**: "Does this work comfortably with one thumb on a phone?"

- What gets deprioritized at 375px? Is that the right content to cut?
- Are there hover interactions with no touch alternative?
- Are all tap targets 44×44px or larger?
- Is the primary action reachable in the green thumb zone?
- What does this look like when the keyboard is open (viewport shrinks)?
