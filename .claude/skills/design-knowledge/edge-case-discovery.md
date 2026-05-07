---
title: Edge Case Discovery & System Architecture Mapping
impact: HIGH
impactDescription: Systematic edge case identification through architecture analysis during design, not development
tags: knowledge, edge-case, architecture, logic-flow, state-machine, error-cascade, system-map
---

# Edge Case Discovery & System Architecture Mapping

> **Pairs with**: `/front-end` skill for implementation-level edge case checks
> **Load when**: `edge case`, `architecture`, `logic flow`, `state machine`, `what could go wrong`, `system map`, `error cascade`, `status`, `permission boundary`

---

## Core Principle

> Discover edge cases during design by mapping system architecture. Every conditional branch, permission level, and status transition is a potential edge case that designers either design for or engineers improvise.

**The gap**: Designers typically discover edge cases when engineers ask "what happens when X?" — by then it's expensive to redesign. Mapping the system first inverts this.

---

## The Mapping Workflow

| Phase | Action | Output |
|-------|--------|--------|
| 1. Map | Trace the feature's logic flow through code | Flow diagram with every branch |
| 2. Identify | Mark each branch as designed/undesigned | Gap list |
| 3. Prioritize | Rank gaps by likelihood x impact | Ordered backlog |
| 4. Design | Design the top gaps | Specs for unhappy paths |

---

## What to Map

### 1. Logic Flows (Conditional Branches)

Every `if/else`, `switch`, ternary, and guard clause is a user-facing state that needs a design.

| Code Pattern | Design Question |
|--------------|-----------------|
| `if (isAuthenticated)` | What does the logged-out user see? |
| `if (items.length === 0)` | Is the empty state designed? |
| `if (error)` | Is the error state designed with recovery? |
| `if (isLoading)` | Is there a skeleton/spinner? At what threshold? |
| `switch (status)` | Is every status value designed? |
| `if (hasPermission)` | What does a user without permission see? |
| `try/catch` | What does the user see when this fails? |
| `?? fallback` | Is the fallback intentional or a placeholder? |

**Technique**: Read the component/page code. List every conditional. For each one, ask: "Is this branch designed, or will the engineer improvise?"

### 2. Status/State Enums

Every enum, union type, or status field represents a finite set of states. Each needs a design.

| Example | States to Design |
|---------|-----------------|
| `type Status = 'draft' \| 'active' \| 'archived'` | 3 distinct UI states |
| `type SyncState = 'idle' \| 'syncing' \| 'error' \| 'complete'` | 4 states + transitions |
| `type Permission = 'owner' \| 'editor' \| 'viewer' \| 'none'` | 4 permission levels = 4 different UIs |

**Check**: Count enum values. Count designed states. The delta is your gap.

### 3. Error Cascades

When one thing fails, what else breaks? Map the dependency chain.

| If This Fails... | Then What Happens To... |
|-------------------|------------------------|
| API call fails | Loading state? Stale data display? Retry option? |
| Auth token expires | Mid-session experience? Unsaved work? |
| WebSocket disconnects | Real-time features? Reconnection UX? |
| File upload fails midway | Progress bar? Partial state? |
| Third-party service down | Degraded experience design? Fallback? |

**Technique**: For each API call or external dependency, ask: "What does the user see when this returns a 500? A 403? A timeout?"

### 4. Permission Boundaries

Every permission level creates a different UI. Map the matrix.

| Feature | Owner | Editor | Viewer | None |
|---------|-------|--------|--------|------|
| See content | Yes | Yes | Yes | No (what do they see?) |
| Edit content | Yes | Yes | No (disabled? hidden?) | N/A |
| Delete content | Yes | No (hidden? tooltip?) | No | N/A |
| Share/invite | Yes | No | No | N/A |

**Question for each "No"**: Is the element hidden, disabled with tooltip, or shown with "request access"?

### 5. Data Shape Extremes

Map the realistic range of data, not just the happy path.

| Dimension | Min | Typical | Max | Design For |
|-----------|-----|---------|-----|------------|
| Items in list | 0 | 5-20 | 1000+ | Empty, scroll, virtualization |
| Text length | 1 char | 20-50 chars | 500+ chars | Truncation, wrapping |
| Nested depth | 1 level | 2-3 levels | 10+ levels | Indentation collapse |
| Concurrent users | 1 | 3-5 | 50+ | Conflict resolution |
| Response time | 50ms | 200ms | 10s+ | Loading thresholds |

### 6. Timing & Sequence

What happens when things arrive in unexpected order?

| Scenario | Design Question |
|----------|-----------------|
| User clicks before page loads | Is the CTA disabled during load? |
| Double-click/double-submit | Is the action idempotent? Button disabled after first click? |
| Stale data from slow network | Optimistic update? Conflict resolution? |
| User navigates away mid-action | Unsaved changes warning? Background completion? |
| Webhook/event arrives late | UI shows stale state — how to refresh? |

---

## Discovery Techniques Using Claude Code

| Technique | How | What It Reveals |
|-----------|-----|-----------------|
| **Grep for conditionals** | Search for `if`, `switch`, ternary in component | Every branch = potential undesigned state |
| **Grep for status/type enums** | Search for `type.*=.*\|`, `enum`, `status` | Finite state sets that need designs |
| **Grep for error handling** | Search for `catch`, `onError`, `error`, `fail` | Error paths with potentially missing UI |
| **Grep for permission checks** | Search for `permission`, `role`, `can`, `allowed` | Permission boundaries needing different UIs |
| **Trace API calls** | Search for `fetch`, `useSWR`, `useQuery`, API routes | Every API call has success/error/loading states |
| **Read type definitions** | Find `.types.ts`, interface files | Data shapes reveal content extremes |

---

## Prioritization Framework

After mapping, prioritize gaps:

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 — Must design** | User will definitely hit this (error states for common actions, empty states for new users) | Design before handoff |
| **P1 — Should design** | User will likely hit this (permission boundaries, edge content lengths) | Design before development |
| **P2 — Could design** | User might hit this (race conditions, extreme data volumes) | Document expected behavior, let eng decide |
| **P3 — Note for later** | User rarely hits this (concurrent edit conflicts, obscure error combinations) | Log as known gap |

---

## Output Format

When mapping edge cases, produce a table:

| # | Source | Branch/State | Currently Designed? | Priority | Design Needed |
|---|--------|-------------|---------------------|----------|---------------|
| 1 | `PersonPage.tsx:42` | `if (!person)` | No — shows blank | P0 | Empty/not-found state |
| 2 | `SyncStatus` enum | `'error'` value | No — falls through | P0 | Error state with retry |
| 3 | `usePermissions` | `role === 'viewer'` | Partial — buttons hidden | P1 | Tooltip on disabled actions |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Design only the happy path, then "handle errors later" | Map errors first (core.md: unhappy path > happy path) |
| Assume engineers will design edge cases sensibly | Every undesigned branch is an improvised design |
| Map the whole system at once | Map one feature flow end-to-end, then expand |
| Treat all edge cases equally | Prioritize by likelihood x user impact |
| Skip mapping because "we'll iterate" | The cost of edge-case redesign increases exponentially after dev starts |

---

## Integration with Other Modules

| Module | Connection |
|--------|-----------|
| [states.md](states.md) | The 8 required states are the minimum — this module finds additional states |
| [copy.md](copy.md) | Every discovered error state needs copy (what went wrong + what to do) |
| [handoff.md](handoff.md) | The edge case map IS the handoff spec for unhappy paths |
| [enterprise.md](enterprise.md) | Permission matrices are critical for enterprise features |
| [ai-core.md](ai-core.md) | AI features have unique edge cases (streaming failure, hallucination, timeout) |
