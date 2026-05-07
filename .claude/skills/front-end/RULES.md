---
title: Front-End Rules Index
impact: CRITICAL
impactDescription: Master index for module loading - entry point
tags: rules, index, loading, cross-mapping
---

# Front-End Rules Index

> **AI AGENTS: Load `Rules/core.md` ALWAYS. For design knowledge, invoke `/design-knowledge` skill.**

> **SYNC: Any change to `Front-end/` MUST also update `/.cursorrules`. See [SKILL.md](SKILL.md).**

---

## Loading Protocol

1. **Always load**: `Rules/core.md`
2. **Detect keywords** in task → **load ALL matching Rules modules** (not just primary)
3. **For design rationale**: Invoke `/design-knowledge` skill
4. **For QA/review**: Load `Rules/qa-checklist.md`
5. **For related skills**: See [Related Skills](#related-skills) below

### Loading Behavior

| Scenario | Behavior |
|----------|----------|
| Multiple keyword matches | Load all matches (comprehensive > token-saving) |
| Need design rationale | Invoke `/design-knowledge` — it's a separate skill now |
| No keyword match | **Ask for clarification** — list module options, let user choose |
| Cross-cutting concern | Lives in **primary home** — other modules link, don't duplicate |

---

## Keywords → Rules Modules

| Keywords | Rules Module |
|----------|-------------|
| *always* | [Rules/core.md](Rules/core.md) |
| text, font, heading, paragraph, label | [Rules/typography.md](Rules/typography.md) |
| animation, transition, motion | [Rules/motion.md](Rules/motion.md) |
| icon, phosphor, symbol | [Rules/icons.md](Rules/icons.md) |
| mobile, responsive, touch, viewport | [Rules/mobile.md](Rules/mobile.md) |
| loading, empty, skeleton, spinner, hover, focus, active, disabled, state | [Rules/states.md](Rules/states.md) |
| form, input, validation, field, submit | [Rules/forms.md](Rules/forms.md) |
| modal, dialog, sheet, overlay, alert | [Rules/modals.md](Rules/modals.md) |
| error, exception, message, copy, label | [Rules/errors.md](Rules/errors.md) |
| click, keyboard, paste, scroll, navigation | [Rules/interactions.md](Rules/interactions.md) |
| a11y, accessibility, aria, wcag, focus | [Rules/accessibility.md](Rules/accessibility.md) |
| component, shadcn, primitive, design system, prompt, promptbox, chat input | [Rules/components.md](Rules/components.md) |
| css, style, tailwind, globals, theme, dark mode | [Rules/css.md](Rules/css.md) |
| storybook, chromatic, visual test | [Rules/storybook.md](Rules/storybook.md) |
| handoff, figma, engineer | [Rules/handoff.md](Rules/handoff.md) |
| qa, checklist, review, verify | [Rules/qa-checklist.md](Rules/qa-checklist.md) |
| image, img, picture, lazy, alt | [Rules/images.md](Rules/images.md) |
| performance, virtualize, preload, hydration | [Rules/performance.md](Rules/performance.md) |
| i18n, locale, date, time, number, currency | [Rules/i18n.md](Rules/i18n.md) |
| sample, placeholder, mock, dummy, test data | [Rules/sample-data.md](Rules/sample-data.md) |
| edge case, architecture, logic flow, state machine, coverage, what could go wrong, system map | [Rules/edge-case-discovery.md](Rules/edge-case-discovery.md) |

---

## Module Overview

### Always Load
- **[core.md](Rules/core.md)** — Compliance, stack, tokens

### All Rules Modules
| Module | Content |
|--------|---------|
| [typography.md](Rules/typography.md) | Font scales, text-balance, text-pretty |
| [motion.md](Rules/motion.md) | Animation constraints, reduced-motion |
| [icons.md](Rules/icons.md) | Phosphor sizes, weights, accessibility |
| [mobile.md](Rules/mobile.md) | Touch targets, viewport, safe areas |
| [states.md](Rules/states.md) | Hover, focus, disabled, loading, empty |
| [forms.md](Rules/forms.md) | Validation, field patterns |
| [modals.md](Rules/modals.md) | Dialog types, destructive actions |
| [errors.md](Rules/errors.md) | Error copy, placement |
| [interactions.md](Rules/interactions.md) | Navigation, hover, keyboard |
| [accessibility.md](Rules/accessibility.md) | WCAG, contrast, focus, ARIA |
| [components.md](Rules/components.md) | shadcn, tokens, design system |
| [css.md](Rules/css.md) | Tailwind patterns, dark mode, theming |
| [storybook.md](Rules/storybook.md) | Required stories, Chromatic |
| [handoff.md](Rules/handoff.md) | Figma handoff specs |
| [qa-checklist.md](Rules/qa-checklist.md) | Full verification checklist |
| [images.md](Rules/images.md) | Dimensions, alt, lazy loading |
| [performance.md](Rules/performance.md) | Virtualization, hydration |
| [i18n.md](Rules/i18n.md) | Intl.DateTimeFormat, Intl.NumberFormat |
| [sample-data.md](Rules/sample-data.md) | Placeholder names, emails, teams |
| [edge-case-discovery.md](Rules/edge-case-discovery.md) | Code-level edge case detection via architecture analysis |

---

## Related Skills

| Trigger | Skill | Use Case |
|---------|-------|----------|
| Design rationale, philosophy, UX laws, hierarchy, tacit knowledge | `/design-knowledge` | Design decisions, "why" behind patterns |
| React/Next.js perf, bundle size, hydration, re-renders | `/react-best-practices` | Performance optimization |
| Browser test, visual QA, headless, screenshot, E2E | `/agent-browser` | Automated testing, visual regression |

---

## Failure Signals

Restructure if you observe:
- **Constant cross-referencing** — Every task requires 5+ modules
- **Context loss** — Breaking up loses holistic understanding

---

## Usage Examples

| Task | Load Rules | Also invoke |
|------|-----------|-------------|
| "Build a login form" | core, forms, states, accessibility | `/design-knowledge` for rationale |
| "Add loading skeleton" | core, states | — |
| "Modal confirmation" | core, modals | `/design-knowledge` for copy patterns |
| "Hover animation" | core, motion, interactions | — |
| "Typography feels off" | core, typography | `/design-knowledge` for perception |
| "Add image gallery" | core, images, performance | — |
| "Format dates/numbers" | core, i18n | — |
| "Virtualize long list" | core, performance, states | — |
| "Dark mode styling" | core, css, components | — |
| "QA review" | core, qa-checklist | — |
| "Handoff to eng" | core, handoff, qa-checklist | `/design-knowledge` for handoff gaps |
| "Need placeholder users" | core, sample-data | — |
| "Why this design pattern?" | core | `/design-knowledge` (primary) |
| "What edge cases am I missing?" | core, edge-case-discovery, states | `/design-knowledge` for prioritization |
| "Map architecture for feature X" | core, edge-case-discovery | `/design-knowledge` for methodology |

---
