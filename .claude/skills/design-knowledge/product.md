---
title: Product Patterns
impact: HIGH
impactDescription: Product-specific flows, feature lifecycle, domain patterns
tags: product, feature, lifecycle, config, domain
---

# Product Patterns

> **Load when**: `product`, `feature`, `lifecycle`, `config`, domain-specific design decisions

> **Template file** — replace with your product's patterns as you build.

---

## Feature Lifecycle

| Stage | User Need | UI Focus |
|-------|-----------|----------|
| Discover | "What can this do?" | Feature introduction, value prop |
| Setup | "How do I get started?" | Quick start, configuration |
| Use | "Let me do the thing" | Core workflow, efficiency |
| Monitor | "Is it working?" | Status, activity feed |
| Tune | "Make it better" | Settings, feedback loop |
| Offboard | "I'm done with this" | Export, cleanup, control |

---

## Configuration Patterns

| Area | User Control |
|------|--------------|
| Profile | Identity, preferences |
| Permissions | Who can see/do what |
| Integrations | Connected services |
| Guardrails | Limits, constraints |

---

## Status Indicators

| Status | Visual | Meaning |
|--------|--------|---------|
| Active | Green pulse | Working |
| Idle | Gray | Waiting |
| Needs review | Amber | Requires approval |
| Error | Red | Failed |
| Paused | Blue outline | User-paused |

---

## Trust & Transparency

| Pattern | Implementation |
|---------|----------------|
| Action log | Timestamped record of all actions |
| Undo/rollback | Review and revert past actions |
| Kill switch | Prominent, immediate stop |
| Approval gate | Confirm before irreversible actions |

---

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Require full config before first use | Friction kills adoption |
| No visibility into system actions | Black box destroys trust |
| No pause/stop control | User feels powerless |
| Same UI for novice and power user | One overwhelmed, other frustrated |

---

## Review Questions

- "What if this scales to 10x? 50x?"
- "How does user know what happened and when?"
- "If something goes wrong, how does user find out and fix?"
- "What's the first thing a new user sees?"
- "What would make a user abandon this?"
