---
title: Accessibility (A11y) Knowledge
impact: HIGH
impactDescription: Tacit a11y knowledge designers forget — WCAG AA gaps, focus, contrast, screen reader, keyboard
tags: accessibility, a11y, wcag, contrast, focus, keyboard, screen-reader, aria, touch-target
---

# Accessibility (A11y) Knowledge

> **Load when**: `accessibility`, `a11y`, `wcag`, `contrast`, `focus`, `keyboard`, `screen reader`, `aria`, `color blind`, `inclusive design`

---

## What Designers Actually Forget

Most designers know "make it accessible" but miss these in practice:

| The Forgotten Thing | Why It Slips Through |
|---------------------|----------------------|
| Focus order on custom components | Not visible in normal use |
| Color as the only differentiator | Looks fine on your screen |
| Hover interactions with no touch alternative | Tested on desktop only |
| Missing focus ring removed for aesthetics | `outline: none` in CSS |
| Error states communicated only by color | Red text without icon or label |
| Interactive elements too small to tap | Designed in Figma at 1x |
| Modal focus trap missing | Works fine without AT |
| Screen reader announcement of dynamic content | Not testable without AT |

---

## The WCAG AA Essentials (Non-Negotiables)

| Requirement | Rule | Common Failure |
|-------------|------|----------------|
| **Color contrast** | 4.5:1 for normal text, 3:1 for large text (18px+ or 14px bold) | Light gray on white; muted helper text |
| **Touch targets** | 44×44px minimum (WCAG 2.5.5, cross-ref Fitts's Law) | Icon buttons, checkboxes sized for mouse |
| **Focus visible** | All interactive elements must have a visible focus indicator | `outline: none` without replacement |
| **Color not sole indicator** | Don't use color alone to convey status/error | Red error text without icon or bold |
| **Alt text** | All meaningful images need descriptive alt; decorative images get `alt=""` | AI-generated images with no alt |
| **Form labels** | Every input needs a programmatic label (not just placeholder) | Placeholder-as-label pattern |
| **Keyboard navigable** | All actions reachable by keyboard alone | Drag-only interactions, hover menus |
| **Focus trap** | Modals must trap focus inside; Escape must dismiss | Focus escapes to background page |

---

## Focus Management Rules

| Situation | What to Do |
|-----------|------------|
| Modal opens | Move focus to first interactive element inside |
| Modal closes | Return focus to the element that triggered it |
| Dynamic content added (toast, alert) | Announce via `aria-live` or move focus |
| Page navigation (SPA) | Move focus to page heading or skip nav |
| Accordion expands | Keep focus on trigger; content reads naturally |
| Form error on submit | Move focus to first error field or error summary |

---

## Color Contrast Quick Reference

| Text Type | Minimum Ratio | Check With |
|-----------|---------------|------------|
| Body text (< 18px) | 4.5:1 | Figma A11y plugin, Stark |
| Large text (18px+ or 14px bold) | 3:1 | Same tools |
| UI components & icons | 3:1 | Same tools |
| Disabled states | No requirement | But don't make them invisible |
| Decorative elements | No requirement | — |

**Trap**: Muted text colors (`text-muted-foreground`) often fail 4.5:1. Always check helper text, placeholder text, and secondary labels.

---

## ARIA — When to Use

| Use ARIA | Don't Use ARIA |
|----------|----------------|
| Native HTML element doesn't exist (custom slider, combobox) | When a native HTML element does the job |
| Adding role/state to visual component (`role="alert"`, `aria-expanded`) | As a substitute for visible labels |
| Labeling icon-only buttons (`aria-label="Close"`) | To describe appearance ("red button") |
| Announcing dynamic changes (`aria-live="polite"`) | Everywhere — ARIA overuse causes noise |

**Rule**: First rule of ARIA — don't use ARIA. Native HTML is always preferred.

---

## Screen Reader Behavior Designers Should Know

| Pattern | What Gets Announced |
|---------|---------------------|
| `<button>Save</button>` | "Save, button" |
| `<button aria-label="Close dialog">×</button>` | "Close dialog, button" |
| `<img alt="Chart showing 40% growth">` | "Chart showing 40% growth, image" |
| `<img alt="">` | Nothing (correctly skipped) |
| `aria-live="polite"` region updated | Content announced after user pauses |
| `role="alert"` content added | Announced immediately, interrupts |
| `aria-expanded="true"` on toggle | "expanded" read with button label |

---

## Keyboard Navigation Patterns

| Component | Expected Keyboard Behavior |
|-----------|---------------------------|
| Dropdown menu | Arrow keys navigate, Enter selects, Escape closes, Tab exits |
| Modal dialog | Tab cycles within modal only, Escape closes |
| Tabs | Arrow keys switch tabs, Enter/Space activates, Tab moves to panel |
| Combobox | Type to filter, Arrow keys navigate options, Enter selects, Escape clears |
| Checkbox group | Tab to group, Space to toggle individual items |
| Date picker | Arrow keys navigate calendar, Enter selects, Escape closes |

---

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Remove focus ring for aesthetics | Keyboard users are blind without it — replace it, don't remove it |
| Use color as the only error indicator | Color-blind users can't distinguish it |
| Icon-only buttons without `aria-label` | Screen reader announces nothing useful |
| Auto-play media without controls | Disorienting for screen reader users |
| Timeout without warning | Accessibility law in some jurisdictions |
| `div` or `span` as interactive element without role | Not keyboard accessible, no semantics |
| Decorative images with descriptive alt | Creates unnecessary noise for AT users |
| Skip link hidden permanently | Keyboard users need it — only hide visually, show on focus |

---

## Practical Design Checks

Before handing off:
```
□ All interactive elements have 44×44px touch targets
□ Color contrast passes 4.5:1 for body text (checked, not assumed)
□ Error states use icon + color + text (not color alone)
□ Form inputs have visible labels (not just placeholder)
□ Focus state designed (not default browser ring)
□ Modal has defined focus trap behavior
□ Icon-only buttons have tooltip text (maps to aria-label)
□ Dynamic content changes noted in handoff (needs aria-live)
```

---

## Review Questions

**Primary question**: "Can a keyboard-only user complete every action in this flow?"

- What does a screen reader announce when this changes?
- Does this work without color — replace colors with shapes/labels, does it still communicate?
- What's the focus order through this component?
- Is there a hover interaction without a touch/keyboard alternative?
- Does this error state communicate failure through more than just color?
