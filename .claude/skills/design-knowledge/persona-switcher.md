---
title: Persona Switcher & Scenario Modes
impact: MEDIUM
impactDescription: Floating toolbar architecture for designing all states — persona, scenario, volume, annotations
tags: persona-switcher, scenario-mode, annotations, volume, sequences, state-design
---

# Persona Switcher & Scenario Modes

> **Load when**: `persona switcher`, `scenario mode`, `annotations`, `volume`, `sequences`, `?persona=`, `?scenario=`

---

## Overview

The prototype has a draggable floating toolbar (`ui/src/components/persona-switcher.tsx`) with five control axes. All state is URL-param driven via nuqs — shareable and survives refresh.

---

## Axes

| Axis | Controls | URL param |
|------|----------|-----------|
| **Presets** | Persona preset (New / Regular) | `?persona=new-user` |
| **Flags** | Individual flag overrides | `&flags=con:0,mtg:1` |
| **Scenarios** | Error / loading (global or scoped per domain) | `&scenario=error` or `&scenario=error:con,loading:mtg` |
| **Volume** | Data density (empty / sparse / typical / heavy) | `&volume=sparse` |
| **Annotations** | Design annotation pins on UI elements | `&annotations=true&ann-filter=todo` |

Combine freely: `?persona=new-user&flags=con:1&scenario=error:mtg&volume=sparse&annotations=true`

---

## Scoped Scenarios

Scenarios can target specific domains instead of applying globally:

| Scope | Domain |
|-------|--------|
| `*` | Global (all) |
| `onb` | Onboarding |
| `mtg` | Meetings |
| `con` | Connections |
| `ks` | Knowledge |

Use `getScenario(scope)` to resolve which scenario applies (checks specific → falls back to `*` → falls back to `none`).

---

## Annotations

Design annotation pins overlay on UI elements via `[data-testid]` selectors. Four categories: Rationale (blue), Edge Case (amber), Motion Spec (violet), Todo (rose). Each page defines annotations in `page.annotations.ts`. The `AnnotationsProvider` context shares state between the toolbar and pin overlay.

---

## Sequences

Auto-advance through states for stakeholder demos. Built-in sequences: Onboarding Flow, Error Recovery, Data Growth. Defined in `ui/src/lib/sequences.ts`.

---

## Architecture

| File | Purpose |
|------|---------|
| `ui/src/lib/personas.ts` | Presets, flags, scenarios, volumes, scoped scenario parsing |
| `ui/src/lib/annotations.ts` | Annotation types & category config |
| `ui/src/lib/annotation-registry.ts` | Route → annotations lookup |
| `ui/src/lib/sequences.ts` | Sequence player step definitions |
| `ui/src/hooks/use-persona.ts` | `usePersona()` — persona/scenario/volume/sequence state |
| `ui/src/hooks/use-annotations.tsx` | `useAnnotations()` — annotation state + `AnnotationsProvider` context |
| `ui/src/components/persona-switcher.tsx` | Floating toolbar UI (all controls) |
| `ui/src/components/annotation-overlay.tsx` | Annotation pin overlay (portal to body) |
| `ui/src/app/*/page.annotations.ts` | Per-page annotation definitions |

---

## Design Implications

- **Every page must have both persona states designed** — new-user (empty/onboarding) and returning (populated)
- **Every page must handle scenario modes** — error states and loading skeletons are design work, not afterthoughts
- **Volume extremes reveal layout issues** — empty, sparse, and heavy volumes each need design attention
- When designing for `new-user`, load: [user-education.md](user-education.md), [states.md](states.md)
- When designing for `returning`, load: the relevant feature module + [states.md](states.md)
- When designing for `error` scenario, load: [states.md](states.md), [copy.md](copy.md) (error messages need good copy)
- When designing for `loading` scenario, load: [states.md](states.md), [motion.md](motion.md) (skeleton/spinner patterns)
- When adding annotations, load: [edge-case-discovery.md](edge-case-discovery.md) (annotations surface design decisions and gaps)
- **Empty states are not afterthoughts** — they are the first impression. Apply full design rigor.
- **Error states need clear recovery paths** — every error should tell the user what happened and what to do next
- **Loading states should match final layout** — skeletons should mirror the shape of the content they replace
- **Progressive disclosure** — new-user views should guide toward the first meaningful action, not overwhelm with setup
