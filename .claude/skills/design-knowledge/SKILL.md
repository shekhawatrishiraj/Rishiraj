---
name: design-knowledge
description: Tacit design knowledge and philosophy captured from designer interviews. Use when making design decisions, reviewing UI/UX, exploring product direction, or needing design rationale. Covers typography, motion, states, forms, modals, copy, hierarchy, UX laws, enterprise patterns, AI interfaces, product patterns, and edge case discovery through system architecture mapping.
---

# Design Knowledge Skill

> **Tacit design rules captured from designer interview. The "dark knowledge" that drives quality.**

> **Load `core.md` ALWAYS. Then load topic-specific modules.**

---

## Loading Protocol

1. **Always load**: [core.md](core.md)
2. **Detect task keywords** → **load matching modules**
3. **For implementation specs**: Invoke `/front-end` skill separately

---

## Module Map

### Keywords → Modules

| Keywords | Module |
|----------|--------|
| *always* | [core.md](core.md) |
| text, font, heading, type | [typography.md](typography.md) |
| animation, transition, motion | [motion.md](motion.md) |
| loading, empty, skeleton, state | [states.md](states.md) |
| form, input, validation, field | [forms.md](forms.md) |
| modal, dialog, sheet, overlay | [modals.md](modals.md) |
| error, message, copy, label | [copy.md](copy.md) |
| handoff, figma, engineer | [handoff.md](handoff.md) |
| component, design system, token | [system.md](system.md) |
| hierarchy, layout, prominence | [hierarchy.md](hierarchy.md) |
| ux law, hick, fitts, jakob | [ux-laws.md](ux-laws.md) |
| visual, alignment, polish | [visual-perception.md](visual-perception.md) |
| stuck, blocked, decision | [process.md](process.md) |
| enterprise, table, navigation, density, document, sync | [enterprise.md](enterprise.md) |
| ai, chat, streaming, citations, context | [ai-core.md](ai-core.md) |
| product, feature, lifecycle, config | [product.md](product.md) |
| onboarding, education, tooltip, wizard, guidance, hint, first-time, setup, progressive disclosure, coachmark | [user-education.md](user-education.md) |
| customer, jtbd, pain point, need, value prop, voice of customer | [customers.md](customers.md) |
| persona, user type, archetype, who is this for | [personas.md](personas.md) |
| review, feedback, customer review | [customer-review.md](customer-review.md) |
| edge case, architecture, logic flow, state machine, what could go wrong, system map, error cascade, status, permission boundary | [edge-case-discovery.md](edge-case-discovery.md) |

---

## Module Overview

### Always Load
- **[core.md](core.md)** — Philosophy, forcing functions

### Topic Modules
| Module | Content |
|--------|---------|
| [typography.md](typography.md) | Type hierarchy |
| [motion.md](motion.md) | When animation adds value |
| [states.md](states.md) | Edge cases |
| [forms.md](forms.md) | Validation timing |
| [modals.md](modals.md) | Pattern selection |
| [copy.md](copy.md) | Button labels, errors |
| [handoff.md](handoff.md) | Specification gaps |
| [system.md](system.md) | Token philosophy |
| [hierarchy.md](hierarchy.md) | Reading patterns |
| [ux-laws.md](ux-laws.md) | Hick, Fitts, etc. |
| [visual-perception.md](visual-perception.md) | Premium signals |
| [process.md](process.md) | Unblocking |
| [enterprise.md](enterprise.md) | Tables, nav, collaboration |
| [ai-core.md](ai-core.md) | Streaming, citations, context |
| [product.md](product.md) | Product-specific patterns |
| [user-education.md](user-education.md) | Onboarding, wizards, tooltips, feature discovery |
| [customers.md](customers.md) | JTBD, pain points, buyer segments |
| [personas.md](personas.md) | User archetypes, design implications |
| [customer-review.md](customer-review.md) | Customer review patterns |
| [edge-case-discovery.md](edge-case-discovery.md) | System architecture mapping for edge case discovery |

---

## Persona Switcher

The prototype has a draggable floating toolbar (`src/components/persona-switcher.tsx`) with five control axes. All state is URL-param driven via nuqs — shareable and survives refresh.

### Axes

| Axis | Controls | URL param |
|------|----------|-----------|
| **Presets** | Persona preset (New / Regular) | `?persona=new-user` |
| **Flags** | Individual flag overrides | `&flags=int:0,dat:1` |
| **Scenarios** | Error / loading (global or scoped per domain) | `&scenario=error` or `&scenario=error:con,loading:mtg` |
| **Volume** | Data density (empty / sparse / typical / heavy) | `&volume=sparse` |
| **Annotations** | Design annotation pins on UI elements | `&annotations=true&ann-filter=todo` |

Combine freely: `?persona=new-user&flags=int:1&scenario=error:dat&volume=sparse&annotations=true`

### Scoped scenarios

Scenarios can target specific domains instead of applying globally:

| Scope | Domain |
|-------|--------|
| `*` | Global (all) |
| `onb` | Onboarding |
| `dat` | Data |
| `int` | Integrations |
| `cnt` | Content |

Use `getScenario(scope)` to resolve which scenario applies (checks specific → falls back to `*` → falls back to `none`).

### Annotations

Design annotation pins overlay on UI elements via `[data-testid]` selectors. Four categories: Rationale (blue), Edge Case (amber), Motion Spec (violet), Todo (rose). Each page defines annotations in `page.annotations.ts`. The `AnnotationsProvider` context shares state between the toolbar and pin overlay.

### Sequences

Auto-advance through states for stakeholder demos. Built-in sequences: Onboarding Flow, Error Recovery, Data Growth. Defined in `src/lib/sequences.ts`.

### Design knowledge implications

- **Every page must have both persona states designed** — new-user (empty/onboarding) and returning (populated)
- **Every page must handle scenario modes** — error states and loading skeletons are design work, not afterthoughts
- **Volume extremes reveal layout issues** — empty, sparse, and heavy volumes each need design attention
- When designing for `new-user`, load: `user-education.md`, `states.md`, `product.md`
- When designing for `returning`, load: the relevant feature module + `states.md`
- When designing for `error` scenario, load: `states.md`, `copy.md` (error messages need good copy)
- When designing for `loading` scenario, load: `states.md`, `motion.md` (skeleton/spinner patterns)
- When adding annotations, load: `edge-case-discovery.md` (annotations surface design decisions and gaps)
- **Empty states are not afterthoughts** — they are the first impression. Apply full design rigor.
- **Error states need clear recovery paths** — every error should tell the user what happened and what to do next
- **Loading states should match final layout** — skeletons should mirror the shape of the content they replace
- **Progressive disclosure** — new-user views should guide toward the first meaningful action, not overwhelm with setup

### Architecture

| File | Purpose |
|------|---------|
| `src/lib/personas.ts` | Presets, flags, scenarios, volumes, scoped scenario parsing |
| `src/lib/annotations.ts` | Annotation types & category config |
| `src/lib/annotation-registry.ts` | Route → annotations lookup |
| `src/lib/sequences.ts` | Sequence player step definitions |
| `src/hooks/use-persona.ts` | `usePersona()` — persona/scenario/volume/sequence state |
| `src/hooks/use-annotations.tsx` | `useAnnotations()` — annotation state + `AnnotationsProvider` context |
| `src/components/persona-switcher.tsx` | Floating toolbar UI (all controls) |
| `src/components/annotation-overlay.tsx` | Annotation pin overlay (portal to body) |
| `src/app/*/page.annotations.ts` | Per-page annotation definitions |

---

## Usage Examples

| Task | Load |
|------|------|
| "Build a login form" | core, forms, states |
| "Design data table" | core, enterprise, states |
| "Build AI chat" | core, ai-core, states |
| "Design feature config" | core, product, forms |
| "Design setup flow" | core, product |
| "Document collaboration" | core, enterprise |
| "Design permissions UI" | core, product, enterprise |
| "Design onboarding flow" | core, user-education, states |
| "Add tooltips to feature" | core, user-education, copy |
| "First-time user experience" | core, user-education, product |
| "Setup wizard for feature" | core, user-education, product, forms |
| "Who are we designing for?" | core, personas, customers |
| "What problem does this solve?" | core, customers, product |
| "Prioritize feature for persona" | core, personas, customers |
| "Design for specific user type" | core, personas, customers, product |
| "Enterprise buyer journey" | core, customers, personas, enterprise |
| "What edge cases am I missing?" | core, edge-case-discovery, states |
| "Map the logic flow for feature X" | core, edge-case-discovery |
| "What happens when this fails?" | core, edge-case-discovery, states |
| "Build page with persona support" | core, states, user-education + read `personas.ts` |

---

## Related Skills

| Trigger | Skill | Use Case |
|---------|-------|----------|
| UI code review, component validation | `/front-end` | Implementation checks, token validation |
| React/Next.js perf, bundle size | `/react-best-practices` | Performance optimization |
| Browser test, visual QA | `/agent-browser` | Automated testing, visual regression |

---

**Source**: Designer interview, captured tacit knowledge; Customer data from 500+ demo requests
